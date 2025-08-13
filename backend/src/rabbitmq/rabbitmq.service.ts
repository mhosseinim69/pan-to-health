import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async assertQueue(queueName: string) {
    await this.channel.assertQueue(queueName, { durable: true });
    this.logger.log(`Queue asserted: ${queueName}`);
  }

  async consume(
    queueName: string,
    handler: (msg: amqp.ConsumeMessage) => void,
  ) {
    await this.assertQueue(queueName);
    this.channel.consume(queueName, (msg) => {
      if (msg) {
        handler(msg);
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async connect() {
    const url = this.config.get<string>('RABBITMQ_URL');
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    this.logger.log(`Connected to RabbitMQ at ${url}`);
  }

  async send(queueName: string, message: any) {
    await this.assertQueue(queueName);
    this.channel.sendToQueue(
      queueName,
      Buffer.from(
        typeof message === 'string' ? message : JSON.stringify(message),
      ),
    );
  }
}
