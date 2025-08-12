import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from '@nestjs/class-validator';

export class CreateSignalDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsDateString()
  time: string;

  @IsNumber()
  @IsOptional()
  dataLength?: number;

  @IsNumber()
  @IsOptional()
  dataVolume?: number;

  @IsOptional()
  raw?: any;
}
