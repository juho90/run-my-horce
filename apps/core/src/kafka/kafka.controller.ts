import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HorseService } from '../horse/horse.service';
import { RaceService } from '../race/race.service';
import { KAFKA_TOPICS } from './kafka.constants';

@Controller()
export class KafkaController {
  constructor(
    private readonly horseService: HorseService,
    private readonly raceService: RaceService,
  ) {}

  @MessagePattern(KAFKA_TOPICS.CREATE_HORSE)
  handleCreateHorse(@Payload() message: any) {
    return this.horseService.create(message);
  }

  @MessagePattern(KAFKA_TOPICS.START_RACE)
  handleStartRace() {
    return this.raceService.startRace();
  }

  @MessagePattern(KAFKA_TOPICS.STOP_RACE)
  handleStopRace() {
    return this.raceService.stopRace();
  }
}
