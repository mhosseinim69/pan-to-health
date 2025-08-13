import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rabbit = app.get(RabbitMQService);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await rabbit.connect();

  const queue = config.get<string>('XRAY_QUEUE');
  await rabbit.consume(queue, (msg) => {
    console.log('Received message:', msg.content.toString());
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('PanToHealth Backend API')
    .setDescription('API for IoT x-ray signals')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
