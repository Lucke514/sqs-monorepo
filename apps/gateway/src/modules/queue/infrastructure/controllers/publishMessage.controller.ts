import { Controller, Post, Body, Logger, HttpException, InternalServerErrorException } from '@nestjs/common';
import { PublishMessageUseCase } from '../../application/publishMessage.useCase';
import { PublishMessageDto } from '../dtos/publishMessage.dto';

@Controller('queue')
export class PublishMessageController {
    private readonly logger = new Logger(PublishMessageController.name);

    constructor(private readonly publishMessageUseCase: PublishMessageUseCase) {}

    @Post('publish')
    async publishMessage(@Body() body: PublishMessageDto): Promise<{ message: string }> {
        try {
            this.logger.log(`Publishing message to queue: ${body.type}`);
            await this.publishMessageUseCase.execute(body.type, body.data);
            return { message: 'Message published successfully' };
        } catch (error) {
            if (error instanceof HttpException) throw error;

            this.logger.error(`Error publishing message: ${body.type}`, error instanceof Error ? error.stack : undefined);
            throw new InternalServerErrorException('Error publishing message', {
                cause: error,
            });
        }
    }
}
