import { PackageMetadatas, DependenciesMetadatas, FileContent } from '@dependency-version-checker/common';

export default abstract class FileParsersBase {
    abstract parse(): DependenciesMetadatas;
}