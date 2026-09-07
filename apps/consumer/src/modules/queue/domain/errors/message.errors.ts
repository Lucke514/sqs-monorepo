export class InvalidMessageError extends Error {
    constructor(reason: string, options?: ErrorOptions) {
        super(`Mensaje invalido: ${reason}`, options);
        this.name = 'InvalidMessageError';
    }
}

export class UnknownMessageTypeError extends Error {
    constructor(public readonly type: string) {
        super(`No hay handler registrado para el tipo "${type}"`);
        this.name = 'UnknownMessageTypeError';
    }
}
