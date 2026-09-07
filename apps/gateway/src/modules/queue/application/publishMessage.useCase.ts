import { Inject, Injectable } from '@nestjs/common';
import { PUBLISH_MESSAGE_PORT } from '../domain/interfaces/publishMessage.interface';
// `import type`: requerido por isolatedModules + emitDecoratorMetadata en firmas decoradas.
import type { PublishMessage } from '../domain/interfaces/publishMessage.interface';
import { Message } from '../domain/classes/message.class';

@Injectable()
export class PublishMessageUseCase {
    constructor(
        @Inject(PUBLISH_MESSAGE_PORT)
        private readonly publishMessageService: PublishMessage,
    ) {}

    async execute(type: string, data: Record<string, unknown>): Promise<void> {
        const message = Message.create(type, data);
        await this.publishMessageService.publishMessage(message);
    }
}
