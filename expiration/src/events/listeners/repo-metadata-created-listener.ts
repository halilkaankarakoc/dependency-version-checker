import { Listener, RepoMetadataCreatedEvent, Subjects } from '@dependency-version-checker/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class RepoMetadataCreatedListener extends Listener<RepoMetadataCreatedEvent> {
    subject: Subjects.RepoMetadataCreated = Subjects.RepoMetadataCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: RepoMetadataCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        await expirationQueue.add(
            {
                repo: data,
            },
            {
                delay,
            }
        );

        msg.ack();
    }
}
