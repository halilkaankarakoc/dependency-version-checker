import { natsWrapper } from '../../../nats-wrapper';
import { CheckVersionCompletedListener } from '../check-version-completed-listener';
import { CheckVersionCompletedEvent, EmailMetadata } from '@dependency-version-checker/common';
import { MailerFactory } from '../../../factories/mailer-factory/mailer-factory';
import { mailerConfig } from '../../../../config/mailer-config';

const setup = async () => {
    const listener = new CheckVersionCompletedListener(natsWrapper.client);
    const emailMetadata: EmailMetadata = {
        repoMetadata: {
            provider: 'github',
            repoName: 'hkaankarakoc/docker-react',
            emailList: ['test@test.com'],
            expiresAt: new Date(),
        },
        dependencies: {},

    }
    const data: CheckVersionCompletedEvent['data'] = {
        ...emailMetadata
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
}

const mailer = MailerFactory.getMailer(mailerConfig.mailerName);
mailer.send = jest.fn().mockImplementation(async () => { });

it('sends mail', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(mailer.send).toHaveBeenCalled();
});

// it('published event to expiration service if dependencies outdated', async () => {
//     const { listener, data, msg } = await setup();
//     await listener.onMessage(data, msg);
//     expect(natsWrapper.client.publish).toHaveBeenCalled();
// });

it('acks message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});