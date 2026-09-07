import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { SQSClient, Message as SqsMessage } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { ProcessMessageUseCase } from '../../application/processMessage.useCase';
import { envs } from '../../../../core/envs';

@Injectable()
export class SqsConsumer implements OnModuleInit, OnApplicationShutdown {
    private readonly logger = new Logger(SqsConsumer.name);
    private consumer!: Consumer;

    constructor(
        private readonly sqsClient: SQSClient,
        private readonly processMessage: ProcessMessageUseCase,
    ) {}

    onModuleInit(): void {
        this.consumer = Consumer.create({
            queueUrl: envs.AWS_SQS_QUEUE_URL,
            sqs: this.sqsClient,
            batchSize: envs.SQS_BATCH_SIZE,
            waitTimeSeconds: envs.SQS_WAIT_TIME_SECONDS,
            visibilityTimeout: envs.SQS_VISIBILITY_TIMEOUT,
            heartbeatInterval: envs.SQS_HEARTBEAT_INTERVAL,
            messageSystemAttributeNames: ['ApproximateReceiveCount'],
            pollingCompleteWaitTimeMs: 30_000,
            handleMessage: async (message: SqsMessage) => {
                await this.processMessage.execute(
                    message.Body ?? '',
                    message.MessageId ?? 'unknown',
                    Number(message.Attributes?.ApproximateReceiveCount ?? 1),
                );
                return message;
            },
        });

        this.consumer.on('processing_error', (err, message) => {
            this.logger.error(`Error procesando ${(message as SqsMessage)?.MessageId}: ${err.message}`, err.stack);
        });
        this.consumer.on('error', (err) => this.logger.error(`Error de SQS: ${err.message}`, err.stack));
        this.consumer.on('timeout_error', (err) => this.logger.error(`Timeout del handler: ${err.message}`));
        this.consumer.on('started', () => this.logger.log(`Polling ${envs.AWS_SQS_QUEUE_URL}`));
        this.consumer.on('stopped', () => this.logger.log('Consumer detenido'));

        this.consumer.start();
    }

    async onApplicationShutdown(signal?: string): Promise<void> {
        this.logger.log(`Shutdown (${signal}): drenando mensajes en vuelo...`);
        this.consumer?.stop();
        await new Promise<void>((resolve) => {
            if (!this.consumer || !this.consumer.status.isRunning) return resolve();
            this.consumer.once('stopped', () => resolve());
        });
    }

    get isRunning(): boolean {
        return this.consumer?.status.isRunning ?? false;
    }
}
