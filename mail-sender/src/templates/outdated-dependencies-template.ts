import { EmailMetadata } from '@dependency-version-checker/common';
import { IMailTemplate } from './IMailTemplate';

export class OutDatedDependenciesMailTemplate implements IMailTemplate {
    constructor(private emailMetadata: EmailMetadata) { }

    getContent() {
        const dependenciesToText = Object.keys(this.emailMetadata.dependencies)
            .map(dependencyName => `<strong>${dependencyName}:</strong> ${this.emailMetadata.dependencies[dependencyName]}`)
            .join('<br><br>');

        const providerName = `<strong>provider:</strong> ${this.emailMetadata.repoMetadata.provider}`
        const repositoryName = `<strong>repository:</strong> ${this.emailMetadata.repoMetadata.repoName}`

        return `
            <h1>Dependency Version Checker</h1>
            <p>
                ${providerName}
                <br>
                ${repositoryName}
            </p>
            <p>
                <h3><u>Outdated Dependencies</u></h3>
                ${dependenciesToText.length ? dependenciesToText : 'Your dependencies are up to date.'}
            </p>
        `;
    }
}
