import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompletedListener } from '../expiration-completed-listener';
import { RepoMetadata, ExpirationCompletedEvent } from '@dependency-version-checker/common';
import { FetcherFactory } from '../../../package-managers/fetcher-factory';
import { ParserFactory } from '../../../package-managers/parser-factory';
import { UpdateCheckerFactory } from '../../../package-managers/update-checker-factory';

const setup = async () => {
    const listener = new ExpirationCompletedListener(natsWrapper.client);
    const repoMetadata: RepoMetadata = {
        provider: 'github',
        repoName: 'hkaankarakoc/docker-react',
        emailList: ['test@test.com'],
        expiresAt: new Date(),
    };
    const data: ExpirationCompletedEvent['data'] = {
        repo: repoMetadata
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
}

FetcherFactory.getFetcher = jest.fn().mockImplementation(async () => {
    return {
        fetch: async () => { }
    }
});

ParserFactory.getParser = jest.fn().mockImplementation(() => {
    return {
        parse: () => { }
    }
});

UpdateCheckerFactory.getUpdateChecker = jest.fn().mockImplementation(() => {
    return {
        check: async () => { }
    }
});

it('publishes an event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});