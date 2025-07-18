import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BettingService } from 'src/betting/betting.service';
import { RaceResultService } from 'src/race-result/race-result.service';
import { HorseService } from 'src/race/horse.service';
import { RaceService } from 'src/race/race.service';
import { TrackService } from 'src/race/track.service';

@Controller('api')
export class GatewayController {
  constructor(
    private readonly bettingService: BettingService,
    private readonly horseService: HorseService,
    private readonly trackService: TrackService,
    private readonly raceService: RaceService,
    private readonly raceResultService: RaceResultService,
  ) {}

  @Get('race/latest')
  getLatestRace() {
    return this.raceService.findLatestRace() || {};
  }

  @Get('horses')
  findAllHorses() {
    return this.horseService.findHorseAll();
  }

  @Get('horses/:raceId')
  findAllHorsesByRaceId(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.horseService.findHorseAllByRaceId(raceId);
  }

  @Get('track/:raceId')
  findTrackByRaceId(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.trackService.findTrack(raceId);
  }

  @Get('race-log/:raceId')
  async getRaceLog(@Param('raceId', ParseIntPipe) raceId: number) {
    const html = await this.raceResultService.findLogByRaceId(raceId);
    return { html };
  }

  @Get('race-result/:raceId')
  getRaceResult(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.raceResultService.findResultByRaceId(raceId);
  }

  @Get('bets/:raceId')
  getAllBets(@Param('raceId', ParseIntPipe) raceId: number) {
    return this.bettingService.findBetsByRace(raceId);
  }
}
