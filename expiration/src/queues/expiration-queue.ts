import Queue from 'bull';
import { RepoMetadata } from '@dependency-version-checker/common';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-completed-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
    repo: RepoMetadata;
}

const expirationQueue = new Queue<Payload>('repometadata:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    }
});

expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        repo: job.data.repo,
    });
});

export { expirationQueue };
