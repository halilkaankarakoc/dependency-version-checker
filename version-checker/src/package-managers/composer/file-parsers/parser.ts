// import { Dependencies, FileContent, DependenciesMetadatas } from '@dependency-version-checker/common';

import { Dependencies, FileContent, DependenciesMetadatas, PackageMetadatas } from "@dependency-version-checker/common";

import _ from 'lodash'

export interface Parser {
    parse(packageMetadatas: PackageMetadatas): Dependencies;
}

