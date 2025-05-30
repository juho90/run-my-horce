import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorseEntity } from './entities/horse.entity';
import { HorseController } from './horse.controller';
import { HorseService } from './horse.service';

@Module({
  imports: [TypeOrmModule.forFeature([HorseEntity])],
  providers: [HorseService],
  controllers: [HorseController],
  exports: [HorseService],
})
export class HorseModule {}
