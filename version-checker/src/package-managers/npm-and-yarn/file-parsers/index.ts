import { PackageJsonParser } from './packagejson-parser';
import { IParser } from './IParser';

export const parsers: { [fileName: string]: IParser } = {
    'package.json': new PackageJsonParser()
};