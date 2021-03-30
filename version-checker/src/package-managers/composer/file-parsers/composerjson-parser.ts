import { FileContent, Dependencies, PackageMetadatas, DependenciesMetadatas } from '@dependency-version-checker/common';
import { Parser } from './parser';

export class ComposerJsonParser implements Parser {

    private findFile(fileName: string, packageMetadatas: PackageMetadatas) {
        const composerJsonFile = packageMetadatas.metadatas.find(metadata => metadata.name === fileName);
        return composerJsonFile;
    }

    private decodeBase64(content: string) {
        return Buffer.from(content, 'base64').toString('utf-8');
    }

    private parseComposerJson(packageMetadatas: PackageMetadatas) {
        const composerJson = this.findFile('composer.json', packageMetadatas);
        if (!composerJson!.content) {
            throw new Error('cannot parse empty composer.json file');
        }
        const decoded = this.decodeBase64(composerJson!.content);
        try {
            let parsed = { require: {}, 'require-dev': {} }
            parsed = JSON.parse(decoded);
            return parsed;
        } catch (error) {
            throw new Error('error when parsing package.json');
        }
    }
    private removeCaretFromVersions(dependencies: Dependencies): Dependencies {
        let transformed: { [name: string]: string } = {};

        Object.keys(dependencies).forEach(dependencyName => {
            if (dependencies[dependencyName][0] === '^') {
                transformed[dependencyName] = dependencies[dependencyName].substring(1)
            } else {
                transformed[dependencyName] = dependencies[dependencyName]
            }
        });
        return transformed;
    }

    private extractDependencies(composerJson: { require: Dependencies, 'require-dev': Dependencies }): Dependencies {
        const { require, 'require-dev': requireDev } = composerJson;
        return { ...require, ...requireDev };
    }

    public parse(packageMetadatas: PackageMetadatas): Dependencies {
        const parsed = this.parseComposerJson(packageMetadatas);
        const dependencies = this.extractDependencies(parsed);
        return this.removeCaretFromVersions(dependencies);
    }
}
