import FileParsersBase from '../../shared/file-parsers/file-parsers-base';
import { ParserFactory } from '../parser-factory';

it('creates an instance of FileParsersBase', async () => {
    const parser = ParserFactory.getParser({
        registry: 'npm',
        metadatas: []
    });

    expect(parser).toBeInstanceOf(FileParsersBase);
});


it('throw error if parser not found', async () => {
    expect(() => ParserFactory.getParser({
        registry: 'npms',
        metadatas: []
    })).toThrow('parser not found');
});