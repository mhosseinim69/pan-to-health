import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Signal } from '../schemas/signal.schema/signal.schema';
import { CreateSignalDto } from '../dto/create-signal.dto';

@Injectable()
export class XrayService {
  private readonly logger = new Logger(XrayService.name);

  constructor(@InjectModel(Signal.name) private signalModel: Model<Signal>) {}

  async saveFromXray(deviceId: string, payload: any) {
    try {
      const data = payload.data || [];
      const time = payload.time ? new Date(payload.time) : new Date();
      const dataLength = Array.isArray(data) ? data.length : 0;
      const dataVolume = Buffer.byteLength(JSON.stringify(data), 'utf8');

      const doc = new this.signalModel({
        deviceId,
        time,
        dataLength,
        dataVolume,
        raw: payload,
      });

      const saved = await doc.save();
      this.logger.log(`Saved signal ${saved._id} for device ${deviceId}`);
      return saved;
    } catch (err) {
      this.logger.error(`Error saving x-ray data for ${deviceId}`, err.stack);
      throw new InternalServerErrorException('Failed to save signal');
    }
  }

  async createManual(dto: CreateSignalDto) {
    try {
      const doc = new this.signalModel(dto);
      return await doc.save();
    } catch (err) {
      this.logger.error('Error creating signal manually', err.stack);
      throw new InternalServerErrorException('Failed to create signal');
    }
  }

  async findAll(filter: {
    deviceId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    skip?: number;
  }) {
    try {
      const q: any = {};
      if (filter.deviceId) q.deviceId = filter.deviceId;
      if (filter.from || filter.to) q.time = {};
      if (filter.from) q.time.$gte = filter.from;
      if (filter.to) q.time.$lte = filter.to;

      const limit = filter.limit ?? 20;
      const skip = filter.skip ?? 0;

      return await this.signalModel
        .find(q)
        .sort({ time: -1 })
        .limit(limit)
        .skip(skip);
    } catch (err) {
      this.logger.error('Error fetching signals', err.stack);
      throw new InternalServerErrorException('Failed to fetch signals');
    }
  }

  async findOne(id: string) {
    try {
      const signal = await this.signalModel.findById(id);
      if (!signal) {
        throw new NotFoundException(`Signal with ID ${id} not found`);
      }
      return signal;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      this.logger.error(`Error fetching signal ${id}`, err.stack);
      throw err;
    }
  }

  async update(id: string, dto: Partial<CreateSignalDto>) {
    try {
      const updated = await this.signalModel.findByIdAndUpdate(id, dto, {
        new: true,
      });
      if (!updated) {
        throw new NotFoundException(`Signal with ID ${id} not found`);
      }
      return updated;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      this.logger.error(`Error updating signal ${id}`, err.stack);
      throw err;
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.signalModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new NotFoundException(`Signal with ID ${id} not found`);
      }
      return deleted;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      this.logger.error(`Error deleting signal ${id}`, err.stack);
      throw err;
    }
  }
}
