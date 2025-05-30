import { Controller, Get } from '@nestjs/common';
import { HorseService } from './horse.service';

@Controller('horses')
export class HorseController {
  constructor(private readonly horseService: HorseService) {}

  @Get()
  findAll() {
    return this.horseService.findAll();
  }
}
