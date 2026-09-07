import { Message } from '../classes/message.class';

export const MESSAGE_HANDLERS = Symbol('MESSAGE_HANDLERS');

export interface MessageHandler {
    readonly type: string;
    handle(message: Message): Promise<void>;
}
