import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export class PublishMessageDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    type!: string;

    @IsObject()
    @IsNotEmpty()
    data!: Record<string, unknown>;
}
