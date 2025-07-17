import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BettingService } from 'src/betting/betting.service';
import { ITEM_IDS } from 'src/inventory/inventory.constants';
import { InventoryService } from 'src/inventory/inventory.service';
import { RaceResultService } from 'src/race-result/race-result.service';
import { HorseService } from 'src/race/horse.service';
import { RaceService } from 'src/race/race.service';
import { TrackService } from 'src/race/track.service';
import { KAFKA_TOPICS } from './kafka.constants';
import { Betting, RaceLog, RaceResult } from './kafka.interface';

@Controller()
export class KafkaController {
  constructor(
    private readonly raceService: RaceService,
    private readonly trackService: TrackService,
    private readonly horseService: HorseService,
    private readonly bettingService: BettingService,
    private readonly inventoryService: InventoryService,
    private readonly raceResultService: RaceResultService,
  ) {}

  @MessagePattern(KAFKA_TOPICS.START_RACE)
  async handleStartRace() {
    try {
      const race = await this.raceService.startRace();
      await this.trackService.createTrack(race.raceId);
      await this.horseService.createHorses(race.raceId);
      return race;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to start race',
        error: error.message,
      };
    }
  }

  @MessagePattern(KAFKA_TOPICS.STOP_RACE)
  async handleStopRace() {
    try {
      return await this.raceService.stopRace();
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to stop race',
        error: error.message,
      };
    }
  }

  @MessagePattern(KAFKA_TOPICS.SETTLE_RACE)
  async handleSettleRace() {
    try {
      const race = await this.raceService.findLatestRace();
      if (!race || race.state !== 'finished' || race.settled) {
        throw new Error(
          `Bad request race state ${race?.state} settled ${race?.settled}`,
        );
      }
      const raceResult = await this.raceResultService.findResultByRaceId(
        race.raceId,
      );
      if (!raceResult) {
        throw new Error('Not found race result');
      }
      await this.bettingService.settleBet(
        race.raceId,
        raceResult.winnerHorseId,
      );
      await this.raceService.settleRace(race.raceId);
      return { ok: true };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to settle race',
        error: error.message,
      };
    }
  }

  @MessagePattern(KAFKA_TOPICS.CREATE_RACE_LOG)
  async handleCreateRaceLog(@Payload() message: RaceLog) {
    try {
      return await this.raceResultService.createRaceLog(message.raceId);
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create race log',
        error: error.message,
      };
    }
  }

  @MessagePattern(KAFKA_TOPICS.CREATE_RACE_RESULT)
  async handleCreateRaceResult(@Payload() message: RaceResult) {
    try {
      return await this.raceResultService.createRaceResult(message);
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create race result',
        error: error.message,
      };
    }
  }

  @MessagePattern(KAFKA_TOPICS.CREATE_BET)
  async handleCreateBet(@Payload() message: Betting) {
    try {
      if (message.discordId.startsWith('user')) {
        await this.inventoryService.addItem(
          message.discordId,
          ITEM_IDS.COIN,
          message.amount,
        );
      }
      return await this.bettingService.placeBet(message);
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create bet',
        error: error.message,
      };
    }
  }
}
