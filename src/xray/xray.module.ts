import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XrayService } from './xray/xray.service';
import { Signal, SignalSchema } from './schemas/signal.schema/signal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }]),
  ],
  providers: [XrayService],
  exports: [XrayService],
})
export class XrayModule {}
