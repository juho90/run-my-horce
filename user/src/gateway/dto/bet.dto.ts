import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BettingDto {
  @ApiProperty({ example: '1' })
  @IsNumber()
  raceId: number;

  @ApiProperty({ example: '1' })
  @IsNumber()
  horseId: number;

  @ApiProperty({ example: '100' })
  @IsNumber()
  amount: number;
}
