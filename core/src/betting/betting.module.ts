import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BettingService } from './betting.service';
import { BettingEntity } from './entities/betting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BettingEntity])],
  providers: [BettingService],
  exports: [BettingService],
})
export class BettingModule {}
