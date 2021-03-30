export interface RepoMetadata {
    provider: string;
    repoName: string;
    emailList: string[];
    expiresAt: Date;
    directory?: string
    branch?: string;
}