import { Controller, Get } from '@nestjs/common';
import { HorseService } from 'src/horse/horse.service';
import { RaceService } from 'src/race/race.service';

@Controller('api')
export class GatewayController {
  constructor(
    private readonly horseService: HorseService,
    private readonly raceService: RaceService,
  ) {}

  @Get('horses')
  findAll() {
    return this.horseService.findAll();
  }

  @Get('race/latest')
  async getLatestRace() {
    return this.raceService.getLatestRace() || {};
  }
}
