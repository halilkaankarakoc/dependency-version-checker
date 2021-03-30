import axios, { AxiosError } from 'axios';
import { RepoMetadata, FileContent, RepoContent } from '@dependency-version-checker/common'
import RepoClient from '../../shared/clients/repo-client';

export default class GithubClient extends RepoClient {

    constructor(protected repoMetadata: RepoMetadata) {
        super(repoMetadata);
    }

    private baseUrl = 'https://api.github.com';

    async fetchRepoContent(): Promise<RepoContent> {
        const { repoName } = this.repoMetadata;
        const { data } = await axios.get<RepoContent>(`${this.baseUrl}/repos/${repoName}/contents`);
        return data.map(e => {
            return {
                name: e.name,
                type: e.type
            };
        });
    }

    async fetchFileContent(fileName: string): Promise<FileContent> {
        const { repoName } = this.repoMetadata;
        const { data } = await axios.get<FileContent>(`${this.baseUrl}/repos/${repoName}/contents/${fileName}`);
        return {
            name: data.name,
            content: data.content,
            encoding: data.encoding
        };
    }

    setRepoMetadata(repoMetadata: RepoMetadata): void {
        this.repoMetadata = repoMetadata;
    }
}

