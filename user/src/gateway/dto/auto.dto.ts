import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AutoDto {
  @ApiProperty({ example: 'hans@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'verification_code' })
  @IsString()
  verify: string;
}
