import { Inject, Injectable, Logger } from '@nestjs/common';
import { MESSAGE_HANDLERS } from '../domain/interfaces/messageHandler.interface';
import type { MessageHandler } from '../domain/interfaces/messageHandler.interface';
import { Message } from '../domain/classes/message.class';
import { InvalidMessageError, UnknownMessageTypeError } from '../domain/errors/message.errors';

@Injectable()
export class ProcessMessageUseCase {
    private readonly logger = new Logger(ProcessMessageUseCase.name);
    private readonly handlers: Map<string, MessageHandler>;

    constructor(@Inject(MESSAGE_HANDLERS) handlers: MessageHandler[]) {
        this.handlers = new Map(handlers.map((h) => [h.type, h]));
        this.logger.log(`Handlers registrados: ${[...this.handlers.keys()].join(', ') || '(ninguno)'}`);
    }

    async execute(rawBody: string, messageId: string, receiveCount: number): Promise<void> {
        const message = this.parse(rawBody, messageId, receiveCount);

        const handler = this.handlers.get(message.type);
        if (!handler) throw new UnknownMessageTypeError(message.type);

        if (message.isRedelivery) {
            this.logger.warn(`Reintento #${message.receiveCount} de ${message.messageId} (${message.type})`);
        }

        await handler.handle(message);
    }

    private parse(rawBody: string, messageId: string, receiveCount: number): Message {
        let parsed: unknown;
        try {
            parsed = JSON.parse(rawBody);
        } catch (error) {
            throw new InvalidMessageError('el body no es JSON valido', { cause: error });
        }

        if (typeof parsed !== 'object' || parsed === null) {
            throw new InvalidMessageError('el body no es un objeto');
        }

        const { type, data } = parsed as Record<string, unknown>;

        if (typeof type !== 'string' || type.trim() === '') {
            throw new InvalidMessageError('falta el campo "type" o no es un string');
        }
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            throw new InvalidMessageError('falta el campo "data" o no es un objeto');
        }

        return Message.create(type, data as Record<string, unknown>, messageId, receiveCount);
    }
}
