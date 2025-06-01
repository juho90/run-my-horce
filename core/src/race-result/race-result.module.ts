import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceProcessEntity } from './entities/race-process.entity';
import { RaceResultEntity } from './entities/race-result.entity';
import { RaceResultService } from './race-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([RaceResultEntity, RaceProcessEntity])],
  providers: [RaceResultService],
  exports: [RaceResultService],
})
export class RaceResultModule {}
