import NpmFileParser from './npm-and-yarn/file-parser';
import ComposerFileParser from './composer/file-parser';
import FileParsersBase from '../shared/file-parsers/file-parsers-base';
import { PackageMetadatas } from '@dependency-version-checker/common';

export class ParserFactory {
    static getParser(packageMetadatas: PackageMetadatas): FileParsersBase {
        if (packageMetadatas.registry === 'npm') {
            return new NpmFileParser(packageMetadatas);
        }

        if (packageMetadatas.registry === 'composer') {
            return new ComposerFileParser(packageMetadatas);
        }
        throw new Error(`parser not found`);
    }
}