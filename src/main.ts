import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rabbit = app.get(RabbitMQService);
  const config = app.get(ConfigService);

  await rabbit.connect();

  const queue = config.get<string>('XRAY_QUEUE');
  await rabbit.consume(queue, (msg) => {
    console.log('Received message:', msg.content.toString());
  });

  await app.listen(3000);
}

bootstrap();
