import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Signal } from '../schemas/signal.schema/signal.schema';
import { CreateSignalDto } from '../dto/create-signal.dto';

@Injectable()
export class XrayService {
  private readonly logger = new Logger(XrayService.name);

  constructor(@InjectModel(Signal.name) private signalModel: Model<Signal>) {}

  async saveFromXray(deviceId: string, payload: any) {
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
  }

  async createManual(dto: CreateSignalDto) {
    const doc = new this.signalModel(dto);
    return doc.save();
  }

  async findAll(filter: {
    deviceId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    skip?: number;
  }) {
    const q: any = {};
    if (filter.deviceId) q.deviceId = filter.deviceId;
    if (filter.from || filter.to) q.time = {};
    if (filter.from) q.time.$gte = filter.from;
    if (filter.to) q.time.$lte = filter.to;

    const limit = filter.limit ?? 20;
    const skip = filter.skip ?? 0;

    return this.signalModel.find(q).sort({ time: -1 }).limit(limit).skip(skip);
  }

  async findOne(id: string) {
    return this.signalModel.findById(id);
  }

  async update(id: string, dto: Partial<CreateSignalDto>) {
    return this.signalModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.signalModel.findByIdAndDelete(id);
  }
}
