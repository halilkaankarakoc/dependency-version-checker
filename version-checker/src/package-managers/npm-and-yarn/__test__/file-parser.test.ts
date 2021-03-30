import { PackageMetadatas, DependenciesMetadatas } from '@dependency-version-checker/common';
import NpmFileParser from '../file-parser';

const packageMetadatas: PackageMetadatas = {
    registry: 'npm',
    metadatas: [
        {
            name: 'package.json',
            content: 'ewogICJuYW1lIjogImZyb250ZW5kIiwKICAidmVyc2lvbiI6ICIwLjEuMCIs\nCiAgInByaXZhdGUiOiB0cnVlLAogICJkZXBlbmRlbmNpZXMiOiB7CiAgICAi\nQHRlc3RpbmctbGlicmFyeS9qZXN0LWRvbSI6ICJeNC4yLjQiLAogICAgIkB0\nZXN0aW5nLWxpYnJhcnkvcmVhY3QiOiAiXjkuMy4yIiwKICAgICJAdGVzdGlu\nZy1saWJyYXJ5L3VzZXItZXZlbnQiOiAiXjcuMS4yIiwKICAgICJyZWFjdCI6\nICJeMTYuMTMuMSIsCiAgICAicmVhY3QtZG9tIjogIl4xNi4xMy4xIiwKICAg\nICJyZWFjdC1zY3JpcHRzIjogIjMuNC4xIgogIH0sCiAgInNjcmlwdHMiOiB7\nCiAgICAic3RhcnQiOiAicmVhY3Qtc2NyaXB0cyBzdGFydCIsCiAgICAiYnVp\nbGQiOiAicmVhY3Qtc2NyaXB0cyBidWlsZCIsCiAgICAidGVzdCI6ICJyZWFj\ndC1zY3JpcHRzIHRlc3QiLAogICAgImVqZWN0IjogInJlYWN0LXNjcmlwdHMg\nZWplY3QiCiAgfSwKICAiZXNsaW50Q29uZmlnIjogewogICAgImV4dGVuZHMi\nOiAicmVhY3QtYXBwIgogIH0sCiAgImJyb3dzZXJzbGlzdCI6IHsKICAgICJw\ncm9kdWN0aW9uIjogWwogICAgICAiPjAuMiUiLAogICAgICAibm90IGRlYWQi\nLAogICAgICAibm90IG9wX21pbmkgYWxsIgogICAgXSwKICAgICJkZXZlbG9w\nbWVudCI6IFsKICAgICAgImxhc3QgMSBjaHJvbWUgdmVyc2lvbiIsCiAgICAg\nICJsYXN0IDEgZmlyZWZveCB2ZXJzaW9uIiwKICAgICAgImxhc3QgMSBzYWZh\ncmkgdmVyc2lvbiIKICAgIF0KICB9Cn0K\n',
            encoding: 'base64'
        }
    ]
};

const parser = new NpmFileParser(packageMetadatas);
const expectedResult: DependenciesMetadatas = {
    registry: 'npm',
    dependencies: {
        '@testing-library/jest-dom': '4.2.4',
        '@testing-library/react': '9.3.2',
        '@testing-library/user-event': '7.1.2',
        react: '16.13.1',
        'react-dom': '16.13.1',
        'react-scripts': '3.4.1'
    }
};

it('parses dependencies correctly', () => {
    const result = parser.parse();
    expect(result).toEqual(expectedResult);
});

it('throw error if package.json content is empty', () => {
    const packageMetadatas: PackageMetadatas = {
        registry: 'npm',
        metadatas: [
            {
                name: 'package.json',
                content: '',
                encoding: 'base64'
            }
        ]
    };
    parser.setPackageMetadatas(packageMetadatas);
    expect(() => parser.parse()).toThrow('cannot parse empty package.json file');
});

it('throw error if package.json content contains unrelated stuff', () => {
    const packageMetadatas: PackageMetadatas = {
        registry: 'npm',
        metadatas: [
            {
                name: 'package.json',
                content: 'HELLO WORLD I AM NOT A JSON',
                encoding: 'base64'
            }
        ]
    };
    parser.setPackageMetadatas(packageMetadatas);
    expect(() => parser.parse()).toThrow('error when parsing package.json');
});