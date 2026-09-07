import { Module } from '@nestjs/common';
import { PublishMessageController } from './infrastructure/controllers/publishMessage.controller';
import { PublishMessageService } from './infrastructure/services/publishMessage.service';
import { sqsClientProvider } from './infrastructure/aws/sqs-client';
import { PublishMessageUseCase } from './application/publishMessage.useCase';
import { PUBLISH_MESSAGE_PORT } from './domain/interfaces/publishMessage.interface';

@Module({
    controllers: [PublishMessageController],
    providers: [
        sqsClientProvider,
        { provide: PUBLISH_MESSAGE_PORT, useClass: PublishMessageService },
        PublishMessageUseCase,
    ],
})
export class QueueModule {}
