import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { XrayService } from './xray.service';
import { CreateSignalDto } from '../dto/create-signal.dto';

@Controller('signals')
export class XrayController {
  constructor(private readonly xrayService: XrayService) {}

  @Post()
  create(@Body() dto: CreateSignalDto) {
    return this.xrayService.createManual(dto);
  }

  @Get()
  findAll(
    @Query('deviceId') deviceId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit = '20',
    @Query('page') page = '1',
  ) {
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    return this.xrayService.findAll({
      deviceId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      limit: Number(limit),
      skip,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.xrayService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateSignalDto>) {
    return this.xrayService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.xrayService.remove(id);
  }
}
