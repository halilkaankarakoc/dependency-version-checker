import { Listener, ExpirationCompletedEvent, Subjects } from '@dependency-version-checker/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { FetcherFactory } from '../../package-managers/fetcher-factory';
import { ParserFactory } from '../../package-managers/parser-factory';
import { UpdateCheckerFactory } from '../../package-managers/update-checker-factory';
import { CheckVersionCompletedPublisher } from '../publishers/check-version-completed-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { EmailMetadata } from '@dependency-version-checker/common';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;

    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
        const repo = data.repo;
        let emailMetadata: EmailMetadata;
        try {
            const fetcher = await FetcherFactory.getFetcher(repo);
            const packageMetadatas = await fetcher.fetch();
            const parser = ParserFactory.getParser(packageMetadatas);
            const dependenciesMetadatas = parser.parse();
            
            const updateChecker = UpdateCheckerFactory.getUpdateChecker(dependenciesMetadatas);
            const dependencies = await updateChecker.check();

            emailMetadata = {
                repoMetadata: repo,
                dependencies,
            }
        } catch (error) {
            console.log(error);
            emailMetadata = {
                repoMetadata: repo,
                dependencies: {},
                error: {
                    isExists: true,
                    reason: error.message
                }
            };
        }
        await new CheckVersionCompletedPublisher(natsWrapper.client).publish(emailMetadata);
        msg.ack();
    }
}
