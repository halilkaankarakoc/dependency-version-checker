import { ComposerJsonParser } from './composerjson-parser';
import { Parser } from './parser';

export const parsers: { [fileName: string]: Parser } = {
    'composer.json': new ComposerJsonParser()
};