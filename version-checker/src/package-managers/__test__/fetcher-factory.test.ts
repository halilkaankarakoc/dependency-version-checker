import { RepoMetadata } from '@dependency-version-checker/common';
import { FetcherFactory } from '../fetcher-factory';
import FileFetcherBase from '../../shared/file-fetchers/file-fetchers-base';
import { ClientFactory } from '../../clients/client-factory';

it('creates an instance of FileFetcherBase', async () => {
    const repoMetadata: RepoMetadata = {
        provider: 'github',
        repoName: 'hkaankarakoc/docker-react',
        expiresAt: new Date(),
        emailList: ['test@test.com']
    };
    ClientFactory.getClient = jest.fn().mockImplementation(() => {
        return {
            getRegistryType: async () => 'npm'
        }
    });
    const fetcher = await FetcherFactory.getFetcher(repoMetadata);
    expect(fetcher).toBeInstanceOf(FileFetcherBase);
});


it('throw error if fetcher not found', async () => {
    const repoMetadata: RepoMetadata = {
        provider: 'github',
        repoName: 'hkaankarakoc/docker-react',
        expiresAt: new Date(),
        emailList: ['test@test.com']
    };
    ClientFactory.getClient = jest.fn().mockImplementation(() => {
        return {
            getRegistryType: async () => 'npms'
        }
    });
    await expect(FetcherFactory.getFetcher(repoMetadata)).rejects.toThrow('fetcher not found');
});