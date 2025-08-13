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
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Signals')
@Controller('signals')
export class XrayController {
  constructor(private readonly xrayService: XrayService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new signal manually' })
  @ApiBody({ type: CreateSignalDto })
  @ApiResponse({ status: 201, description: 'Signal created successfully.' })
  create(@Body() dto: CreateSignalDto) {
    return this.xrayService.createManual(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all signals with optional filters' })
  @ApiQuery({ name: 'deviceId', required: false, type: String })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of signals.' })
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
  @ApiOperation({ summary: 'Get a single signal by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Signal found.' })
  @ApiResponse({ status: 404, description: 'Signal not found.' })
  findOne(@Param('id') id: string) {
    return this.xrayService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a signal by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: CreateSignalDto })
  @ApiResponse({ status: 200, description: 'Signal updated successfully.' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateSignalDto>) {
    return this.xrayService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a signal by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Signal deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.xrayService.remove(id);
  }
}
