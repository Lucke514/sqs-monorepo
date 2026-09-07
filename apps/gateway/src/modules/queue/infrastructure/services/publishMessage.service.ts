import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { PublishMessage } from '../../domain/interfaces/publishMessage.interface';
import { Message } from '../../domain/classes/message.class';
import { envs } from '../../../../core/envs';

@Injectable()
export class PublishMessageService implements PublishMessage {
    private readonly logger = new Logger(PublishMessageService.name);
    private readonly isFifo = envs.AWS_SQS_QUEUE_URL.endsWith('.fifo');

    constructor(private readonly sqsClient: SQSClient) {}

    async publishMessage(message: Message): Promise<void> {
        try {
            const result = await this.sqsClient.send(
                new SendMessageCommand({
                    QueueUrl: envs.AWS_SQS_QUEUE_URL,
                    MessageBody: JSON.stringify(message),
                    ...(this.isFifo && {
                        MessageGroupId: message.type,
                        MessageDeduplicationId: randomUUID(),
                    }),
                }),
            );

            this.logger.log(`Message ${result.MessageId} published to ${envs.AWS_SQS_QUEUE_URL}`);
        } catch (error) {
            this.logger.error(`Error publishing message of type "${message.type}"`, error instanceof Error ? error.stack : undefined);
            throw new Error('Error publishing message', { cause: error });
        }
    }
}
