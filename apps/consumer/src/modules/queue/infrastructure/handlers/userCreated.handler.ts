import { Injectable, Logger } from '@nestjs/common';
import { MessageHandler } from '../../domain/interfaces/messageHandler.interface';
import { Message } from '../../domain/classes/message.class';

@Injectable()
export class UserCreatedHandler implements MessageHandler {
    readonly type = 'user.created';
    private readonly logger = new Logger(UserCreatedHandler.name);

    async handle(message: Message): Promise<void> {
        this.logger.log(`Procesando ${message.messageId}: ${JSON.stringify(message.data)}`);

        await Promise.resolve();

        this.logger.log(`Mensaje ${message.messageId} procesado`);
    }
}
