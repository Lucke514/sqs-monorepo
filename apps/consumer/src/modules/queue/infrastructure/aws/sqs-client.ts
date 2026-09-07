import { Provider } from '@nestjs/common';
import { SQSClient } from '@aws-sdk/client-sqs';
import { envs } from '../../../../core/envs';

export const sqsClientProvider: Provider = {
    provide: SQSClient,
    useFactory: () => new SQSClient({ region: envs.AWS_REGION }),
};
