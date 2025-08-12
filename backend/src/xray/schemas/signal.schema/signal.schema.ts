import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Signal extends Document {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: true })
  time: Date;

  @Prop()
  dataLength: number;

  @Prop()
  dataVolume: number;

  @Prop({ type: Object })
  raw: any;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
