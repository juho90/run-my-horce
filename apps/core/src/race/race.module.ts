import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceEntity } from './entities/race.entity';
import { RaceService } from './race.service';

@Module({
  imports: [TypeOrmModule.forFeature([RaceEntity])],
  providers: [RaceService],
  exports: [RaceService],
})
export class RaceModule {}
