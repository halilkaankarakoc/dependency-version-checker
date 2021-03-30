import UpdateCheckersBase from '../../src/shared/update-checkers/update-checkers-base';
import NpmUpdateChecker from './npm-and-yarn/update-checker';
import ComposerUpdateChecker from './composer/update-checker';

import { DependenciesMetadatas } from '@dependency-version-checker/common';

export class UpdateCheckerFactory {

    static getUpdateChecker(dependenciesMetadatas: DependenciesMetadatas): UpdateCheckersBase {
        if (dependenciesMetadatas.registry === 'npm') {
            return new NpmUpdateChecker(dependenciesMetadatas.dependencies);
        }

        if (dependenciesMetadatas.registry === 'composer') {
            return new ComposerUpdateChecker(dependenciesMetadatas.dependencies);
        }
        throw new Error(`update checker not found`);
    }

}