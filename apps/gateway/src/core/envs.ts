import * as joi from 'joi';
import 'dotenv/config';

interface EnvVars {
    AWS_REGION: string;
    AWS_SQS_QUEUE_URL: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
}

const envsSchema = joi
    .object({
        AWS_REGION: joi.string().required(),
        AWS_SQS_QUEUE_URL: joi.string().uri().required(),
        AWS_ACCESS_KEY_ID: joi.string().optional(),
        AWS_SECRET_ACCESS_KEY: joi.string().optional(),
    })
    .unknown(true);

const validationResult = envsSchema.validate(process.env) as { error?: joi.ValidationError; value: EnvVars };

if (validationResult.error) {
    throw new Error(`Error en las variables de entorno: ${validationResult.error.message}`);
}

const { value } = validationResult;
export const envs: EnvVars = {
    AWS_REGION: value.AWS_REGION,
    AWS_SQS_QUEUE_URL: value.AWS_SQS_QUEUE_URL,
    AWS_ACCESS_KEY_ID: value.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: value.AWS_SECRET_ACCESS_KEY,
};
