import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XrayService } from './xray/xray.service';
import { Signal, SignalSchema } from './schemas/signal.schema/signal.schema';
import { XrayController } from './xray/xray.controller';
import { XrayConsumer } from './xray/xray.consumer';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }]),
    RabbitMQModule,
  ],
  providers: [XrayService, XrayConsumer],
  controllers: [XrayController],
  exports: [XrayService],
})
export class XrayModule {}
