import { UpdateCheckerFactory } from '../update-checker-factory';
import UpdateCheckersBase from '../../shared/update-checkers/update-checkers-base';

it('creates an instance of FileParsersBase', async () => {
    const parser = UpdateCheckerFactory.getUpdateChecker({
        registry: 'npm',
        dependencies: {}
    });

    expect(parser).toBeInstanceOf(UpdateCheckersBase);
});


it('throw error if parser not found', async () => {
    expect(() => UpdateCheckerFactory.getUpdateChecker({
        registry: 'npms',
        dependencies: {}
    })).toThrow('update checker not found');
});