import UpdateCheckersBase from "../../shared/update-checkers/update-checkers-base"
import { Dependencies } from '@dependency-version-checker/common';
import ComposerRegistry from './registry';
import * as versionHelper from './helpers/version-operations-helper'

export default class UpdateChecker extends UpdateCheckersBase {

    constructor(private dependencies: Dependencies) {
        super(new ComposerRegistry());
    }

    private getDependenciesToUpdate(oldDependencies: Dependencies, newDependencies: Dependencies) {
        const [equalizedOld, equalizedNew] = versionHelper.equalizeDependencies(oldDependencies, newDependencies);
        const [normalizedOld, normalizedNew] = versionHelper.normalizeVersions(equalizedOld, equalizedNew);
        const compared = versionHelper.compareVersions(normalizedOld, normalizedNew);
        const denormalized = versionHelper.denormalize(newDependencies, compared);
        return denormalized;
    }

    async check(): Promise<Dependencies> {
        const result = await this.getVersions(this.dependencies);
        const dependenciesToUpdate = this.getDependenciesToUpdate(this.dependencies, result);
        return dependenciesToUpdate;
    }
}