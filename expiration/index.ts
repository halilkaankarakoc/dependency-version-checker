import { natsWrapper } from './src/nats-wrapper';
import { RepoMetadataCreatedListener } from './src/events/listeners/repo-metadata-created-listener';

const start = async () => {
    try {
        if (!process.env.NATS_CLIENT_ID) {
            throw new Error('NATS_CLIENT_ID must be defined');
        }
        if (!process.env.NATS_URL) {
            throw new Error('NATS_URL must be defined');
        }
        if (!process.env.NATS_CLUSTER_ID) {
            throw new Error('NATS_CLUSTER_ID must be defined');
        }
        if (!process.env.REDIS_HOST) {
            throw new Error('REDIS_HOST must be defined');

        }
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('[expiration] NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new RepoMetadataCreatedListener(natsWrapper.client).listen();
    } catch (err) {
        console.error(err);
    }
};
start();
// export { start as expirationStart };