import { Dependencies } from './dependencies';
import { RepoMetadata } from './repo-metadata';

export interface EmailMetadata {
    repoMetadata: RepoMetadata;
    dependencies: Dependencies;
    error?: {
        isExists: Boolean,
        reason: string
    };
}