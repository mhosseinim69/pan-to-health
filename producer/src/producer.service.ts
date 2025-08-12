import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(private config: ConfigService) {}

  async sendXrayData(sampleData: any) {
    const url = this.config.get<string>('RABBITMQ_URL');
    const queue = this.config.get<string>('XRAY_QUEUE');

    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(sampleData)), {
      persistent: true,
    });

    this.logger.log(`Sent message to queue "${queue}"`);
    await channel.close();
    await connection.close();
  }
}
