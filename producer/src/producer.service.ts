import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class ProducerService implements OnModuleInit {
  private readonly logger = new Logger(ProducerService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  private async connect(retries = 10, delay = 5000) {
    const url = this.config.get<string>('RABBITMQ_URL');
    while (retries > 0) {
      try {
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();
        this.logger.log('Connected to RabbitMQ');
        break;
      } catch (err) {
        this.logger.error(`Failed to connect to RabbitMQ: ${err.message}`);
        retries--;
        if (retries === 0) throw err;
        this.logger.warn(
          `Retrying in ${delay / 1000}s... (${retries} retries left)...`,
        );
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  async sendXrayData(sampleData: any) {
    if (!this.channel) {
      throw new Error('No RabbitMQ channel available');
    }
    const queue = this.config.get<string>('XRAY_QUEUE');
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(sampleData)));
    this.logger.log(`Message sent to queue ${queue}`);
  }
}
