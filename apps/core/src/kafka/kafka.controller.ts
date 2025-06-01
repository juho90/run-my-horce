import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BettingService } from 'src/betting/betting.service';
import { HorseService } from 'src/horse/horse.service';
import { ITEM_IDS } from 'src/inventory/inventory.constants';
import { InventoryService } from 'src/inventory/inventory.service';
import { RaceResultService } from 'src/race-result/race-result.service';
import { RaceService } from 'src/race/race.service';
import { KAFKA_TOPICS } from './kafka.constants';
import { Betting, Horse, RaceResult } from './kafka.interface';

@Controller()
export class KafkaController {
  constructor(
    private readonly horseService: HorseService,
    private readonly raceService: RaceService,
    private readonly bettingService: BettingService,
    private readonly inventoryService: InventoryService,
    private readonly raceResultService: RaceResultService,
  ) {}

  @MessagePattern(KAFKA_TOPICS.CREATE_HORSE)
  async handleCreateHorse(@Payload() message: Horse) {
    try {
      return await this.horseService.create(message);
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create horse',
        error: error.message,
      };
    }
  }

  @MessagePattern(KAFKA_TOPICS.START_RACE)
  async handleStartRace() {
    try {
      return await this.raceService.startRace();
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

  @MessagePattern(KAFKA_TOPICS.CREATE_RACE_RESULT)
  async handleCreateRaceResult(@Payload() message: RaceResult) {
    try {
      return await this.raceResultService.createResult(message);
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
