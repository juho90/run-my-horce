import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/jwt.payload';
import { JwtService } from 'src/auth/jwt.service';
import { ITEM_IDS } from 'src/inventory/inventory.constants';
import { InventoryService } from 'src/inventory/inventory.service';
import { UserId } from './decorator/user-id.decorator';
import { AutoDto } from './dto/auto.dto';
import { BettingDto } from './dto/bet.dto';
import { KafkaProducerService } from './kafka.producer.service';

@ApiTags('gateway')
@Controller('api')
export class GatewayController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Get('health-error')
  @ApiOperation({ summary: 'Test health check error' })
  @ApiResponse({
    status: 500,
    description: 'Always throws an error for testing',
  })
  getHealthError() {
    throw new Error('Health check failed');
  }

  @Post('health-error')
  @ApiOperation({ summary: 'Test health check error (POST)' })
  @ApiResponse({
    status: 500,
    description: 'Always throws an error for testing',
  })
  postHealthError() {
    throw new Error('Health check failed');
  }

  @Post('auth')
  auth(@Body() { email, verify }: AutoDto) {
    const payload = {
      email,
      sub: 'user',
    } as JwtPayload;
    const accessToken = this.jwtService.signAccessToken(payload);
    return { accessToken };
  }

  @Post('bet')
  @ApiBearerAuth('accessToken')
  async placeBet(
    @UserId() userId: string,
    @Body() { raceId, horseId, amount }: BettingDto,
  ) {
    this.kafkaProducerService.emitPlaceBet({
      userId,
      raceId,
      horseId,
      amount,
    });
    await this.inventoryService.subItem(userId, ITEM_IDS.COIN, amount);
  }
}
