import { Listener, DependenciesOutdatedEvent, Subjects} from '@dependency-version-checker/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class DependenciesOutdatedListener extends Listener<DependenciesOutdatedEvent> {
    subject: Subjects.DependenciesOutDated = Subjects.DependenciesOutDated;
    queueGroupName = queueGroupName;

    async onMessage(data: DependenciesOutdatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('DependenciesOutdatedListener');
        console.log(data);
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
