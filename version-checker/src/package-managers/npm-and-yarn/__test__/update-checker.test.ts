import NpmUpdateChecker from '../update-checker';
import { DependenciesMetadatas } from '@dependency-version-checker/common';

const dependenciesMetadatas: DependenciesMetadatas = {
    registry: 'npm',
    dependencies: {
        '@testing-library/jest-dom': '4.2.4',
        '@testing-library/react': '9.3.2',
        '@testing-library/user-event': '7.1.2',
        react: '16.13.1',
        'react-dom': '16.13.1',
        'react-scripts': '3.4.1',
        asdadadsasad: '1.2.3'
    }
};

const updateChecker = new NpmUpdateChecker(dependenciesMetadatas.dependencies);

it('checks and gets versions correctly', async () => {
    const result = await updateChecker.check();
    expect(result).toHaveProperty('@testing-library/jest-dom');
    expect(result).toHaveProperty('@testing-library/react');
    expect(result).toHaveProperty('@testing-library/user-event');
    expect(result).toHaveProperty('react');
    expect(result).toHaveProperty('react-dom');
    expect(result).toHaveProperty('react-scripts');
    expect(result).not.toHaveProperty('asdadadsasad');
});
