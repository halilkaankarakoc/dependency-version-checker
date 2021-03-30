import { PackageMetadatas, DependenciesMetadatas } from '@dependency-version-checker/common';
import ComposerFileParser from '../file-parser';

const packageMetadatas: PackageMetadatas = {
    registry: 'npm',
    metadatas: [
        {
            name: 'composer.json',
            content: 'ewogICAgInJlcXVpcmUiOiB7CiAgICAgICAgImd1enpsZWh0dHAvcHJvbWlz\nZXMiOiAiMS4yLjAiCiAgICB9Cn0K\n',
            encoding: 'base64'
        }
    ]
};

const parser = new ComposerFileParser(packageMetadatas);
const expectedResult: DependenciesMetadatas = {
    registry: 'composer',
    dependencies: { 'guzzlehttp/promises': '1.2.0' }
}

it('parses dependencies correctly', () => {
    const result = parser.parse();
    expect(result).toEqual(expectedResult);
});

it('throw error if composer.json content is empty', () => {
    const packageMetadatas: PackageMetadatas = {
        registry: 'composer',
        metadatas: [
            {
                name: 'composer.json',
                content: '',
                encoding: 'base64'
            }
        ]
    };
    parser.setPackageMetadatas(packageMetadatas);
    expect(() => parser.parse()).toThrow('cannot parse empty composer.json file');
});

it('throw error if package.json content contains unrelated stuff', () => {
    const packageMetadatas: PackageMetadatas = {
        registry: 'composer',
        metadatas: [
            {
                name: 'composer.json',
                content: Buffer.from('HELLO WORLD I AM NOT A JSON').toString('base64'),
                encoding: 'base64'
            }
        ]
    };
    parser.setPackageMetadatas(packageMetadatas);
    expect(() => parser.parse()).toThrow('error when parsing package.json');
});