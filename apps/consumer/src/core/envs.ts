import * as joi from 'joi';
import 'dotenv/config';

interface EnvVars {
    AWS_REGION: string;
    AWS_SQS_QUEUE_URL: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    SQS_BATCH_SIZE: number;
    SQS_WAIT_TIME_SECONDS: number;
    SQS_VISIBILITY_TIMEOUT: number;
    SQS_HEARTBEAT_INTERVAL: number;
}

const envsSchema = joi
    .object({
        AWS_REGION: joi.string().required(),
        AWS_SQS_QUEUE_URL: joi.string().uri().required(),
        AWS_ACCESS_KEY_ID: joi.string().optional(),
        AWS_SECRET_ACCESS_KEY: joi.string().optional(),
        SQS_BATCH_SIZE: joi.number().min(1).max(10).default(10),
        SQS_WAIT_TIME_SECONDS: joi.number().min(0).max(20).default(20),
        SQS_VISIBILITY_TIMEOUT: joi.number().min(1).default(30),
        SQS_HEARTBEAT_INTERVAL: joi.number().min(1).default(10),
    })
    .unknown(true)
    .custom((value, helpers) => {
        if (value.SQS_HEARTBEAT_INTERVAL >= value.SQS_VISIBILITY_TIMEOUT) {
            return helpers.message({
                custom: 'SQS_HEARTBEAT_INTERVAL debe ser menor que SQS_VISIBILITY_TIMEOUT',
            });
        }
        return value;
    });

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
    SQS_BATCH_SIZE: value.SQS_BATCH_SIZE,
    SQS_WAIT_TIME_SECONDS: value.SQS_WAIT_TIME_SECONDS,
    SQS_VISIBILITY_TIMEOUT: value.SQS_VISIBILITY_TIMEOUT,
    SQS_HEARTBEAT_INTERVAL: value.SQS_HEARTBEAT_INTERVAL,
};
