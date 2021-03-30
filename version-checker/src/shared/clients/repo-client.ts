import {
    RepoMetadata,
    FileContent,
    RepoContent,
    UnsupportedPackageManagerError,
    RateLimitError,
    RepositoryNotFoundError
} from '@dependency-version-checker/common';

const registryLookUp: { [name: string]: string } = {
    'package.json': 'npm',
    'composer.json': 'composer',
};

export default abstract class RepoClient {
    constructor(protected repoMetadata: RepoMetadata) { }

    abstract fetchRepoContent(): Promise<RepoContent>;

    abstract fetchFileContent(fileName: string): Promise<FileContent>;

    abstract setRepoMetadata(repoMetadata: RepoMetadata): void;

    async getRegistryType(): Promise<string> {
        try {
            const content = await this.fetchRepoContent();
            let registryName: string = '';
            const supportedDependencyFiles = Object.keys(registryLookUp);
            for (let i = 0; i < content.length; i++) {
                for (let j = 0; j < supportedDependencyFiles.length; j++) {
                    if (content[i].name === supportedDependencyFiles[j]) {
                        registryName = registryLookUp[content[i].name];
                        break;
                    }
                }
            }
            if (registryName === '') {
                throw new UnsupportedPackageManagerError(`Unsupported package managers. Dependency Version Checker now supports only ${Object.values(registryLookUp).join(' and ')}.`);
            }
            return registryName;
        } catch (error) {
            const { repoName, provider } = this.repoMetadata;
            if (error.response && error.response.status === 403) {
                throw new RateLimitError('Dependency Version Checker uses public api so it has a request limit... Please try again later. Maybe 30 minutes later :)');
            }
            if (error.response && error.response.status === 404) {
                throw new RepositoryNotFoundError(`Repository: ${repoName} not found at ${provider}`);
            }
            throw error;
        }
    };
}