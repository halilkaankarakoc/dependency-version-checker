import { Dependencies, PackageMetadatas } from '@dependency-version-checker/common';
import { IParser } from './IParser';

export class PackageJsonParser implements IParser {

    private findFile(fileName: string, packageMetadatas: PackageMetadatas) {
        const packageJsonFile = packageMetadatas.metadatas.find(metadata => metadata.name === fileName);
        return packageJsonFile;
    }

    private decodeBase64(content: string) {
        return Buffer.from(content, 'base64').toString('utf-8');
    }

    private parsePackageJson(packageMetadatas: PackageMetadatas) {
        const packageJson = this.findFile('package.json', packageMetadatas);
        if (!packageJson!.content) {
            throw new Error('cannot parse empty package.json file');
        }
        const decoded = this.decodeBase64(packageJson!.content);
        try {
            let defaults = { devDependencies: {}, dependencies: {} };
            const parsed = JSON.parse(decoded);
            return { ...defaults, ...parsed };
        } catch (error) {
            throw new Error('error when parsing package.json');
        }
    }

    private removeCaretFromVersions(dependencies: Dependencies): Dependencies {
        let transformed: Dependencies = {};
        const dependencyNames = Object.keys(dependencies);
        dependencyNames.forEach(dependencyName => {
            if (dependencies[dependencyName][0] === '^') {
                transformed[dependencyName] = dependencies[dependencyName].substring(1)
            } else {
                transformed[dependencyName] = dependencies[dependencyName]
            }
        });
        return transformed;
    }

    private extractDependencies(packageJson: { dependencies: Dependencies, devDependencies: Dependencies }): Dependencies {
        const { dependencies, devDependencies } = packageJson;
        return { ...dependencies, ...devDependencies };
    }

    public parse(packageMetadatas: PackageMetadatas): Dependencies {
        const parsed = this.parsePackageJson(packageMetadatas);
        const dependencies = this.extractDependencies(parsed);
        return this.removeCaretFromVersions(dependencies);
    }
}
