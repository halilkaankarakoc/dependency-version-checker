import { Listener, CheckVersionCompletedEvent, Subjects } from '@dependency-version-checker/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { MailerFactory } from '../../factories/mailer-factory/mailer-factory';
import { TemplateFactory } from '../../factories/template-factory/template-factory';
import { EmailMessage } from '../../email-message';
import { mailerConfig } from '../../../config/mailer-config';
import { DependenciesOutdatedPublisher } from '../publishers/dependencies-outdated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const EXPIRATION_PERIOD = process.env.EXPIRATION_PERIOD ?
    Number.parseInt(process.env.EXPIRATION_PERIOD)
    :
    24 * 60 * 60; // 24 hour
const EXPIRATION_PERIOD_ON_ERROR = 60 * 60; // 1 hour


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
                expiration.setSeconds(expiration.getSeconds() + EXPIRATION_PERIOD);
                newRepoMetadata.expiresAt = expiration;
                new DependenciesOutdatedPublisher(natsWrapper.client).publish(newRepoMetadata);
            }
        } catch (error) {
            const newRepoMetadata = { ...data.repoMetadata };
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + EXPIRATION_PERIOD_ON_ERROR);
            newRepoMetadata.expiresAt = expiration;
            new DependenciesOutdatedPublisher(natsWrapper.client).publish(newRepoMetadata);
            console.log(error);
        }
        msg.ack();
    }
}
