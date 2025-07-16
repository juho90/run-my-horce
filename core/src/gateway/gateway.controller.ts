import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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

  @Get('horses/:raceId')
  findAllHorsesByRaceId(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.horseService.findAllByRaceId(raceId);
  }

  @Get('bets/:raceId')
  getAllBets(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.bettingService.findBetsByRace(raceId);
  }

  @Get('race/latest')
  getLatestRace() {
    return this.raceService.findLatestRace() || {};
  }

  @Get('race-result/:raceId')
  getRaceResult(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.raceResultService.findResultByRaceId(raceId);
  }
}
