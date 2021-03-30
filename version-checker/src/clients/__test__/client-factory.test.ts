import { ClientFactory } from "../client-factory";
import RepoClient from '../../shared/clients/repo-client';

it('must be an instance of RepoClient', () => {
    const client = ClientFactory.getClient({
        provider: 'github',
        repoName: 'dependabot/php-example',
        expiresAt: new Date(),
        emailList: ['test@test.com']
    });

    expect(client).toBeInstanceOf(RepoClient);
});

it('throws an error if client not found', () => {
    expect(() => ClientFactory.getClient({
        provider: 'asdasd',
        repoName: 'dependabot/php-example',
        expiresAt: new Date(),
        emailList: ['test@test.com']
    })).toThrow('client not found');
})
