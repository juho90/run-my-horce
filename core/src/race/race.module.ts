import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceEntity } from './entities/race.entity';
import { RaceService } from './race.service';
import { TrackService } from './track.service';

@Module({
  imports: [TypeOrmModule.forFeature([RaceEntity])],
  providers: [RaceService, TrackService],
  exports: [RaceService, TrackService],
})
export class RaceModule {}
