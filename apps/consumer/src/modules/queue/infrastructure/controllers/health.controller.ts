import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { SqsConsumer } from '../consumers/sqs.consumer';

@Controller('health')
export class HealthController {
    constructor(private readonly sqsConsumer: SqsConsumer) {}

    @Get()
    check(): { status: string; polling: boolean } {
        if (!this.sqsConsumer.isRunning) {
            throw new ServiceUnavailableException('The consumer is not polling');
        }
        return { status: 'ok', polling: true };
    }
}
