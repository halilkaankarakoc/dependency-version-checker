import { PackageMetadatas, DependenciesMetadatas, Dependencies, FileContent } from '@dependency-version-checker/common';
import FileParsersBase from '../../shared/file-parsers/file-parsers-base';
import { parsers } from './file-parsers/index';

export default class FileParser extends FileParsersBase {

    constructor(private packageMetadatas: PackageMetadatas) {
        super();
    }

    setPackageMetadatas(packageMetadatas: PackageMetadatas): void {
        this.packageMetadatas = packageMetadatas;
    }

    private mergeDependencies(allDependencies: Dependencies[]) {
        return Object.assign({}, ...allDependencies)
    }

    parse(): DependenciesMetadatas {
        const filesToParse = this.packageMetadatas.metadatas.map(metadata => metadata.name);
        const matchedParserNames = Object.keys(parsers)
            .filter(parserName => filesToParse.includes(parserName));

        const allDependencies = matchedParserNames
            .map(parserName => parsers[parserName].parse(this.packageMetadatas));
        const mergedDependencies = this.mergeDependencies(allDependencies);
        return {
            registry: 'composer',
            dependencies: mergedDependencies
        };
    }
}