import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { XrayService } from './xray.service';

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
    const dlq = `${queue}.dlq`;

    await this.rabbit.assertQueue(queue);
    await this.rabbit.assertQueue(dlq);

    await this.rabbit.consume(queue, async (msg) => {
      const content = msg.content.toString();
      let parsed: any;

      try {
        parsed = JSON.parse(content);
      } catch (err) {
        this.logger.error(`JSON parse error for message: ${content}`);
        await this.rabbit.send(dlq, content);
        return;
      }

      try {
        for (const deviceId of Object.keys(parsed)) {
          await this.xrayService.saveFromXray(deviceId, parsed[deviceId]);
        }
        this.logger.log(`Processed message from queue "${queue}"`);
      } catch (err) {
        this.logger.error(
          `Failed to process message from queue "${queue}"`,
          err.stack,
        );
        await this.rabbit.send(dlq, content);
      }
    });
  }
}
