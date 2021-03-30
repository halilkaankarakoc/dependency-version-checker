import NpmFileFetcher from '../package-managers/npm-and-yarn/file-fetcher';
import ComposerFileFetcher from '../package-managers/composer/file-fetcher';
import { ClientFactory } from '../clients/client-factory';
import { RepoMetadata } from '@dependency-version-checker/common';
import FileFetcherBase from '../shared/file-fetchers/file-fetchers-base';

export class FetcherFactory {

    static async getFetcher(repo: RepoMetadata): Promise<FileFetcherBase> {
        const client = ClientFactory.getClient(repo);
        const packageManagerType = await client.getRegistryType();

        if (packageManagerType === 'npm') {
            return new NpmFileFetcher(repo);
        }
        if (packageManagerType === 'composer') {
            return new ComposerFileFetcher(repo);
        }
        throw new Error(`fetcher not found`);
    }
}