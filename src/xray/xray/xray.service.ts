import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Signal } from '../schemas/signal.schema/signal.schema';

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
}
