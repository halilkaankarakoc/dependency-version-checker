import { Listener, CheckVersionCompletedEvent, Subjects } from '@dependency-version-checker/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { MailerFactory } from '../../factories/mailer-factory/mailer-factory';
import { TemplateFactory } from '../../factories/template-factory/template-factory';
import { EmailMessage } from '../../email-message';
import { mailerConfig } from '../../../config/mailer-config';

export class CheckVersionCompletedListener extends Listener<CheckVersionCompletedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.CheckVersionCompleted = Subjects.CheckVersionCompleted;

    async onMessage(data: CheckVersionCompletedEvent['data'], msg: Message) {
        try {
            const mailer = MailerFactory.getMailer(mailerConfig.mailerName);
            const content = TemplateFactory.getTemplate(data).getContent();
            const message: EmailMessage = {
                to: data.repoMetadata.emailList,
                from: 'kaankarakoc09@gmail.com',
                subject: 'Dependency Version Checker',
                text: content,
                html: content,
            };
            await mailer.send(message);
            const isOutdatedDependencyExists = Object.keys(data.dependencies).length > 0;
            if (isOutdatedDependencyExists) {
                const newRepoMetadata = { ...data.repoMetadata };
                const expiration = new Date();
                expiration.setSeconds(expiration.getSeconds() + 24 * 60);
                newRepoMetadata.expiresAt = expiration;
                // new DependenciesOutdatedPublisher(natsWrapper.client).publish(data.repoMetadata);
            }
        } catch (error) {
            const newRepoMetadata = { ...data.repoMetadata };
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + 10 * 60);
            newRepoMetadata.expiresAt = expiration;
            // new DependenciesOutdatedPublisher(natsWrapper.client).publish(data.repoMetadata);
            console.log(error);
        }
        msg.ack();
    }
}
