import { ErrorTemplate } from '../../templates/error-occured-template';
import { EmailMetadata } from '@dependency-version-checker/common';
import { OutDatedDependenciesMailTemplate } from '../../templates/outdated-dependencies-template';
import { IMailTemplate } from '../../templates/IMailTemplate';

export class TemplateFactory {
    static getTemplate(emailMetadata: EmailMetadata): IMailTemplate{
        if (emailMetadata.error) {
            return new ErrorTemplate(emailMetadata);
        }
        return new OutDatedDependenciesMailTemplate(emailMetadata);
    }
}