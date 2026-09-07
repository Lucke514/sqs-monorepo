import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConsumerModule } from './consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);
  const port = process.env.CONSUMER_PORT ?? 3001;
  await app.listen(port);
  Logger.log(`Consumer listening on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
