import { Module } from '@nestjs/common';
import { sqsClientProvider } from './infrastructure/aws/sqs-client';
import { SqsConsumer } from './infrastructure/consumers/sqs.consumer';
import { HealthController } from './infrastructure/controllers/health.controller';
import { UserCreatedHandler } from './infrastructure/handlers/userCreated.handler';
import { ProcessMessageUseCase } from './application/processMessage.useCase';
import { MESSAGE_HANDLERS } from './domain/interfaces/messageHandler.interface';

const HANDLERS = [UserCreatedHandler];

@Module({
    controllers: [HealthController],
    providers: [
        sqsClientProvider,
        ...HANDLERS,
        {
            provide: MESSAGE_HANDLERS,
            useFactory: (...handlers) => handlers,
            inject: HANDLERS,
        },
        ProcessMessageUseCase,
        SqsConsumer,
    ],
})
export class QueueModule {}
