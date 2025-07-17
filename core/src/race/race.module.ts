import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorseEntity } from './entities/horse.entity';
import { RaceEntity } from './entities/race.entity';
import { HorseService } from './horse.service';
import { RaceService } from './race.service';
import { TrackService } from './track.service';

@Module({
  imports: [TypeOrmModule.forFeature([RaceEntity, HorseEntity])],
  providers: [RaceService, TrackService, HorseService],
  exports: [RaceService, TrackService, HorseService],
})
export class RaceModule {}
