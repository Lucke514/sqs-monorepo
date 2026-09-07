import { Module } from '@nestjs/common';
import { QueueModule } from './modules/queue/queue.module';
@Module({
  imports: [QueueModule],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
