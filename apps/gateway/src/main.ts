import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const port = process.env.GATEWAY_PORT ?? 5000;
  await app.listen(port);
  Logger.log(`Gateway listening on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
