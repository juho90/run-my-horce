import { Controller, Get, Query } from '@nestjs/common';
import { BettingService } from 'src/betting/betting.service';
import { HorseService } from 'src/horse/horse.service';
import { RaceResultService } from 'src/race-result/race-result.service';
import { RaceService } from 'src/race/race.service';

@Controller('api')
export class GatewayController {
  constructor(
    private readonly horseService: HorseService,
    private readonly bettingService: BettingService,
    private readonly raceService: RaceService,
    private readonly raceResultService: RaceResultService,
  ) {}

  @Get('horses')
  findAllHorses() {
    return this.horseService.findAll();
  }

  @Get('bets')
  getAllBets(@Query('raceId') raceId: string) {
    return this.bettingService.findBetsByRace(Number.parseInt(raceId));
  }

  @Get('race/latest')
  getLatestRace() {
    return this.raceService.findLatestRace() || {};
  }

  @Get('race-result')
  getRaceResult(@Query('raceId') raceId: string) {
    return this.raceResultService.findResultByRaceId(Number.parseInt(raceId));
  }
}
