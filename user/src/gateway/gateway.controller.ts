import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/jwt.payload';
import { JwtService } from 'src/auth/jwt.service';
import { AutoDto } from './dto/auto.dto';

@ApiTags('gateway')
@Controller('api')
export class GatewayController {
  constructor(private readonly jwtService: JwtService) {}

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
}
