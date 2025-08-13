import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSignalDto {
  @ApiProperty({
    example: '66bb584d4ae73e488c30a072',
    description: 'Unique ID of the IoT device sending the signal.',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    example: '2025-08-11T12:00:00Z',
    description: 'Timestamp of the x-ray data in ISO 8601 format.',
  })
  @IsDateString()
  time: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Number of data points in the x-ray signal.',
  })
  @IsNumber()
  @IsOptional()
  dataLength?: number;

  @ApiPropertyOptional({
    example: 128,
    description: 'Size of the data payload in bytes.',
  })
  @IsNumber()
  @IsOptional()
  dataVolume?: number;

  @ApiPropertyOptional({
    description: 'Raw x-ray data payload.',
    example: {
      data: [
        [762, [51.339764, 12.339223833333334, 1.2038]],
        [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
        [2763, [51.339782, 12.339196166666667, 2.13906]],
      ],
      time: 1735683480000,
    },
  })
  @IsOptional()
  raw?: any;
}
