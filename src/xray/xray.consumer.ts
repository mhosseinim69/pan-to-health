import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { XrayService } from './xray/xray.service';

@Injectable()
export class XrayConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(XrayConsumer.name);

  constructor(
    private rabbit: RabbitMQService,
    private config: ConfigService,
    private xrayService: XrayService,
  ) {}

  async onApplicationBootstrap() {
    const queue = this.config.get<string>('XRAY_QUEUE');
    await this.rabbit.consume(queue, async (msg) => {
      const content = msg.content.toString();
      try {
        const parsed = JSON.parse(content);
        for (const deviceId of Object.keys(parsed)) {
          await this.xrayService.saveFromXray(deviceId, parsed[deviceId]);
        }
        this.logger.log(`Processed message from queue "${queue}"`);
      } catch (err) {
        this.logger.error(`Invalid message: ${content}`, err as any);
      }
    });
  }
}
