import { EmailMetadata } from '@dependency-version-checker/common';
import { IMailTemplate } from './IMailTemplate';

export class ErrorTemplate implements IMailTemplate{
    constructor(private emailMetadata: EmailMetadata) { }
    getContent() {
        const providerName = `<strong>provider:</strong> ${this.emailMetadata.repoMetadata.provider}`
        const repositoryName = `<strong>repository:</strong> ${this.emailMetadata.repoMetadata.repoName}`
        const errorMessage = this.emailMetadata.error!.reason;

        return `
            <h1>Dependency Version Checker</h1>
            <p>
                ${providerName}
                <br>
                ${repositoryName}
            </p>
            <p>
                <h1>${errorMessage}</h1>
            </p>
        `;
    }
}