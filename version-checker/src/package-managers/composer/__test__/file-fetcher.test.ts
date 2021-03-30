import ComposerFileFetcher from '../file-fetcher';
import { RepoMetadata, PackageMetadatas } from '@dependency-version-checker/common';

const repoMetadata: RepoMetadata = {
    provider: 'github',
    repoName: 'dependabot/php-example',
    expiresAt: new Date(),
    emailList: ['test@test.com']
};

const expectedResponse: PackageMetadatas = {
    registry: 'composer',
    metadatas: [{
        name: 'composer.json',
        content: 'ewogICAgInJlcXVpcmUiOiB7CiAgICAgICAgImd1enpsZWh0dHAvcHJvbWlz\nZXMiOiAiMS4yLjAiCiAgICB9Cn0K\n',
        encoding: 'base64'
    }]
};

const fetcher = new ComposerFileFetcher(repoMetadata);

it('fetchs package metadatas', async () => {
    const result = await fetcher.fetch();
    expect(result).toEqual(expectedResponse)
});

it('throws error if repo does not contain composer.json', async () => {
    const phpRepo: RepoMetadata = {
        provider: 'github',
        repoName: 'hkaankarakoc/docker-react',
        expiresAt: new Date(),
        emailList: ['test@test.com']
    };
    fetcher.setRepoMetadata(phpRepo);
    await expect(fetcher.fetch()).rejects.toThrow('composer.json must be exist in repo');
});

it('deneme', () => {
    expect(true).toBeTruthy();
})