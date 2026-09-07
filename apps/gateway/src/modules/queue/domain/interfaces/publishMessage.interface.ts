import { Message } from '../classes/message.class';

export const PUBLISH_MESSAGE_PORT = Symbol('PUBLISH_MESSAGE_PORT');

export interface PublishMessage {
    publishMessage(message: Message): Promise<void>;
}
