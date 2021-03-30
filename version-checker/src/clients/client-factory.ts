import { RepoMetadata } from '@dependency-version-checker/common';
import RepoClient from '../shared/clients/repo-client';
import GithubClient from './github/github-client';

export class ClientFactory {
    static getClient(repoMetadata: RepoMetadata): RepoClient {
        if (repoMetadata.provider === 'github') {
            return new GithubClient(repoMetadata);
        }

        throw new Error(`client not found`);
    }
}