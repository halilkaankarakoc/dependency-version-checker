import GithubClient from '../github-client';
import { RepoMetadata, RepoContent, FileContent } from '@dependency-version-checker/common'

const repo: RepoMetadata = {
    provider: 'github',
    repoName: 'dependabot/php-example',
    expiresAt: new Date(),
    emailList: ['test@test.com']
};

const githubClient = new GithubClient(repo);

it('gets registry type correctly', async () => {
    const result = await githubClient.getRegistryType()
    expect(result).toEqual('composer');
});

it('fetchs contents of repo', async () => {
    const expectedRepoContent: RepoContent = [
        {
            name: '.github',
            type: 'dir'
        },
        {
            name: 'composer.json',
            type: 'file'
        },
        {
            name: 'composer.lock',
            type: 'file'
        },
        {
            name: 'example.php',
            type: 'file'
        }
    ];

    const result = await githubClient.fetchRepoContent();
    expect(result).toEqual(expectedRepoContent);
});

it('fetchs contents of file - for example `composer.json`', async () => {
    const expectedFileContent: FileContent = {
        name: 'composer.json',
        content: 'ewogICAgInJlcXVpcmUiOiB7CiAgICAgICAgImd1enpsZWh0dHAvcHJvbWlz\nZXMiOiAiMS4yLjAiCiAgICB9Cn0K\n',
        encoding: 'base64'
    }

    const result = await githubClient.fetchFileContent('composer.json');
    expect(result).toEqual(expectedFileContent);
});

it('throws error if file does not exist in repo', async () => {
    const fileName = 'asdadsasdadsasd.json';
    await expect(githubClient.fetchFileContent(fileName)).rejects.toThrow(`Request failed with status code 404`)
});

it('throws error if repo does not exist in github', async () => {
    const fakeRepo: RepoMetadata = {
        provider: 'github',
        repoName: 'adasdasdasdasdasdasdasdasdsadasdas',
        expiresAt: new Date(),
        emailList: ['test@test.com']
    };
    githubClient.setRepoMetadata(fakeRepo);
    await expect(githubClient.fetchRepoContent()).rejects.toThrow(`Request failed with status code 404`);
});

it('deneme', () => {
    expect(true).toBeTruthy();
});