import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProducerService } from './producer.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const producer = app.get(ProducerService);

  const message = {
    '66bb584d4ae73e488c30a072': {
      data: [
        [762, [51.339764, 12.339223833333334, 1.2038]],
        [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
        [2763, [51.339782, 12.339196166666667, 2.13906]],
      ],
      time: 1735683480000,
    },
  };

  await producer.sendXrayData(message);
  await app.close();
}
bootstrap();
