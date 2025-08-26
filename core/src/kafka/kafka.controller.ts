import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BettingService } from 'src/betting/betting.service';
import { RaceResultService } from 'src/race-result/race-result.service';
import { HorseService } from 'src/race/horse.service';
import { RaceService } from 'src/race/race.service';
import { TrackService } from 'src/race/track.service';
import { Betting, RaceHorse, RaceLog, RaceResult } from './kafka.interface';
import { KafkaTopics } from './kafka.topic';

@Controller()
export class KafkaController {
  constructor(
    private readonly raceService: RaceService,
    private readonly trackService: TrackService,
    private readonly horseService: HorseService,
    private readonly bettingService: BettingService,
    private readonly raceResultService: RaceResultService,
  ) {}

  @MessagePattern(KafkaTopics.START_RACE)
  async handleStartRace() {
    const race = await this.raceService.startRace();
    await this.trackService.createTrack(race.raceId);
    await this.horseService.createHorses(race.raceId);
    return race;
  }

  @MessagePattern(KafkaTopics.STOP_RACE)
  async handleStopRace() {
    return await this.raceService.stopRace();
  }

  @MessagePattern(KafkaTopics.SETTLE_RACE)
  async handleSettleRace() {
    const race = await this.raceService.findLatestRace();
    if (!race || race.state !== 'finished' || race.settled) {
      throw new Error(
        `Bad request race state ${race?.state} settled ${race?.settled}`,
      );
    }
    const raceResult = await this.raceResultService.findRaceResult(race.raceId);
    if (!raceResult) {
      throw new Error('Not found race result');
    }
    await this.bettingService.settleBet(race.raceId, raceResult.winnerHorseId);
    await this.raceService.settleRace(race.raceId);
    return { ok: true };
  }

  @MessagePattern(KafkaTopics.CREATE_HORSE)
  async handleCreateHorse(@Payload() message: RaceHorse) {
    const horse = await this.horseService.upsertHorse(message);
    return {
      status: 'success',
      raceId: message.raceId,
      horses: horse,
    };
  }

  @MessagePattern(KafkaTopics.CREATE_RACE_LOG)
  async handleCreateRaceLog(@Payload() message: RaceLog) {
    const html = await this.raceResultService.createRace(message.raceId);
    return {
      status: 'success',
      raceId: message.raceId,
      html: html,
    };
  }

  @MessagePattern(KafkaTopics.CREATE_RACE_RESULT)
  async handleCreateRaceResult(@Payload() message: RaceResult) {
    return await this.raceResultService.createRaceResult(message);
  }

  @MessagePattern(KafkaTopics.CREATE_BET)
  async handleCreateBet(@Payload() message: Betting) {
    return await this.bettingService.placeBet(message);
  }
}
