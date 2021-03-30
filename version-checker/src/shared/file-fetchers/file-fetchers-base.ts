import RepoClient from '../clients/repo-client';
import { ClientFactory } from '../../clients/client-factory';
import {
    RepoMetadata,
    RepoContent,
    FileContent,
    PackageMetadatas,
    RepositoryNotFoundError,
    FileNotFoundError,
    RateLimitError
} from '@dependency-version-checker/common'


export default abstract class FileFetcherBase {
    private repoClient: RepoClient;

    constructor(private repoMetadata: RepoMetadata) {
        this.repoClient = ClientFactory.getClient(repoMetadata);
    }

    protected async fetchRepoContent(): Promise<RepoContent> {
        const { repoName, provider } = this.repoMetadata;
        try {
            const data = await this.repoClient.fetchRepoContent();
            return data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                throw new RateLimitError();
            }
            throw new RepositoryNotFoundError(`Repository: ${repoName} not found at ${provider}`);
        }
    }

    protected async fetchFileContent(fileName: string): Promise<FileContent> {
        const { repoName, provider } = this.repoMetadata;
        try {
            const data = await this.repoClient.fetchFileContent(fileName);
            return data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                throw new RateLimitError();
            }
            throw new FileNotFoundError(`Filename: ${fileName} not found at ${repoName}`);
        }
    }

    abstract fetch(): Promise<PackageMetadatas>;

    setRepoMetadata(repoMetadata: RepoMetadata) {
        this.repoMetadata = repoMetadata;
        this.repoClient.setRepoMetadata(repoMetadata);
    }

    setClient(client: RepoClient) {
        this.repoClient = client;
    }
}
