import FileFetcherBase from "../../shared/file-fetchers/file-fetchers-base";
import { RepoMetadata, FileContent, PackageMetadatas, RateLimitError } from '@dependency-version-checker/common'
import { versionCheckingConfig } from '../../../config/version-checking-config';

export default class FileFetcher extends FileFetcherBase {
    constructor(repoMetadata: RepoMetadata) {
        super(repoMetadata);
    }

    private async fetchAllDependencyFiles() {
        const files: FileContent[] | Error = await Promise.all(versionCheckingConfig.js.filesToCheck.map(async file => {
            return this.fetchFileContent(file).catch(e => e);
        }));

        let packageJsonIndex = -1;

        const validFiles = files.filter((file, index) => {
            if (file.name === 'package.json') {
                packageJsonIndex = index;
            }
            return !(file instanceof Error);
        });

        if (packageJsonIndex < 0) {
            throw new Error('package.json must be exist in repo');
        }

        const rateLimitErrors = files.filter(file => {
            return (file instanceof RateLimitError);
        });

        if (rateLimitErrors.length) {
            throw new RateLimitError();
        }

        return validFiles;
    }

    async fetch(): Promise<PackageMetadatas> {
        const metadatas = await this.fetchAllDependencyFiles();
        return {
            registry: 'npm',
            metadatas
        };
    }
}
