import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceEntryEntity } from 'src/entities/race-entry.entity';
import { HorseEntity } from 'src/horse/entities/horse.entity';
import { RaceEntity } from 'src/race/entities/race.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HorseModule } from './horse/horse.module';
import { KafkaModule } from './kafka/kafka.module';
import { RaceModule } from './race/race.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'horse-core.db',
      entities: [HorseEntity, RaceEntity, RaceEntryEntity],
      synchronize: true, // 개발용. 운영에서는 false
      logging: true,
    }),
    TypeOrmModule.forFeature([HorseEntity, RaceEntity, RaceEntryEntity]),
    HorseModule,
    KafkaModule,
    RaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
