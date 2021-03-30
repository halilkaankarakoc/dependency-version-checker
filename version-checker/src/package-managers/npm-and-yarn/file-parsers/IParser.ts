import { Dependencies, FileContent, DependenciesMetadatas, PackageMetadatas } from "@dependency-version-checker/common";


export interface IParser {
    parse(packageMetadatas: PackageMetadatas): Dependencies;
}

