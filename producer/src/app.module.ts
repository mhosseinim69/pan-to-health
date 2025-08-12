import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProducerService } from './producer.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [ProducerService],
})
export class AppModule {}
