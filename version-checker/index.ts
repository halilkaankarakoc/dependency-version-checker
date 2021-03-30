import { natsWrapper } from './src/nats-wrapper';
import { ExpirationCompletedListener } from './src/events/listeners/expiration-completed-listener';


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

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('[version-checker] NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new ExpirationCompletedListener(natsWrapper.client).listen();
    } catch (error) {
        console.log(error)
    }
}
start();
// export { start as versionCheckerStart };