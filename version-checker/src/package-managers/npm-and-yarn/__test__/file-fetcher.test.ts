import NpmFileFetcher from '../file-fetcher';
import { RepoMetadata, PackageMetadatas } from '@dependency-version-checker/common';

const repoMetadata: RepoMetadata = {
    provider: 'github',
    repoName: 'hkaankarakoc/docker-react',
    expiresAt: new Date(),
    emailList: ['test@test.com']
};

const expectedResponse: PackageMetadatas = {
    registry: 'npm',
    metadatas: [{
        name: 'package.json',
        content: 'ewogICJuYW1lIjogImZyb250ZW5kIiwKICAidmVyc2lvbiI6ICIwLjEuMCIs\nCiAgInByaXZhdGUiOiB0cnVlLAogICJkZXBlbmRlbmNpZXMiOiB7CiAgICAi\nQHRlc3RpbmctbGlicmFyeS9qZXN0LWRvbSI6ICJeNC4yLjQiLAogICAgIkB0\nZXN0aW5nLWxpYnJhcnkvcmVhY3QiOiAiXjkuMy4yIiwKICAgICJAdGVzdGlu\nZy1saWJyYXJ5L3VzZXItZXZlbnQiOiAiXjcuMS4yIiwKICAgICJyZWFjdCI6\nICJeMTYuMTMuMSIsCiAgICAicmVhY3QtZG9tIjogIl4xNi4xMy4xIiwKICAg\nICJyZWFjdC1zY3JpcHRzIjogIjMuNC4xIgogIH0sCiAgInNjcmlwdHMiOiB7\nCiAgICAic3RhcnQiOiAicmVhY3Qtc2NyaXB0cyBzdGFydCIsCiAgICAiYnVp\nbGQiOiAicmVhY3Qtc2NyaXB0cyBidWlsZCIsCiAgICAidGVzdCI6ICJyZWFj\ndC1zY3JpcHRzIHRlc3QiLAogICAgImVqZWN0IjogInJlYWN0LXNjcmlwdHMg\nZWplY3QiCiAgfSwKICAiZXNsaW50Q29uZmlnIjogewogICAgImV4dGVuZHMi\nOiAicmVhY3QtYXBwIgogIH0sCiAgImJyb3dzZXJzbGlzdCI6IHsKICAgICJw\ncm9kdWN0aW9uIjogWwogICAgICAiPjAuMiUiLAogICAgICAibm90IGRlYWQi\nLAogICAgICAibm90IG9wX21pbmkgYWxsIgogICAgXSwKICAgICJkZXZlbG9w\nbWVudCI6IFsKICAgICAgImxhc3QgMSBjaHJvbWUgdmVyc2lvbiIsCiAgICAg\nICJsYXN0IDEgZmlyZWZveCB2ZXJzaW9uIiwKICAgICAgImxhc3QgMSBzYWZh\ncmkgdmVyc2lvbiIKICAgIF0KICB9Cn0K\n',
        encoding: 'base64'
    }]
};

const fetcher = new NpmFileFetcher(repoMetadata);

it('fetchs package metadatas', async () => {
    const result = await fetcher.fetch();
    expect(result).toEqual(expectedResponse)
});

it('throws error if repo does not contain package.json', async () => {
    const phpRepo: RepoMetadata = {
        provider: 'github',
        repoName: 'dependabot/php-example',
        expiresAt: new Date(),
        emailList: ['test@test.com']
    };
    fetcher.setRepoMetadata(phpRepo);
    await expect(fetcher.fetch()).rejects.toThrow('package.json must be exist in repo');
});

it('deneme', () => {
    expect(true).toBeTruthy();
})