import NpmUpdateChecker from '../update-checker';
import { DependenciesMetadatas } from '@dependency-version-checker/common';

const dependenciesMetadatas: DependenciesMetadatas = {
    registry: 'composer',
    dependencies: {
        'guzzlehttp/promises': '1.2.0',
        asadasdasdas: '1.2.3'
    }
};

const updateChecker = new NpmUpdateChecker(dependenciesMetadatas.dependencies);

it('checks and gets versions correctly', async () => {
    const result = await updateChecker.check();

    expect(result).toHaveProperty('guzzlehttp/promises');
    expect(result).not.toHaveProperty('asadasdasdas');
});
