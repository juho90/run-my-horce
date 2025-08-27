import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Betting } from 'src/kafka/kafka.interface';
import { KafkaTopics } from 'src/kafka/kafka.topic';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_PRODUCER') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async onModuleDestroy() {
    await this.kafka.close();
  }

  emitPlaceBet(message: Betting) {
    return this.kafka.emit(KafkaTopics.CREATE_BET, message);
  }
}
