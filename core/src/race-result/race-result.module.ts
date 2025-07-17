import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceModule } from 'src/race/race.module';
import { RaceProcessEntity } from './entities/race-process.entity';
import { RaceResultEntity } from './entities/race-result.entity';
import { RaceResultService } from './race-result.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RaceResultEntity, RaceProcessEntity]),
    RaceModule,
  ],
  providers: [RaceResultService],
  exports: [RaceResultService],
})
export class RaceResultModule {}
