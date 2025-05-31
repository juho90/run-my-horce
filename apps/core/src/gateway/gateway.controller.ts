import { Controller, Get } from '@nestjs/common';
import { HorseService } from 'src/horse/horse.service';

@Controller('api')
export class GatewayController {
  constructor(private readonly horseService: HorseService) {}

  @Get('horses')
  findAll() {
    return this.horseService.findAll();
  }
}
