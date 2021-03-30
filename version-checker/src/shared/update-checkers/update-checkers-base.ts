import RegistryBase from '../registries/registry-base';
import { Dependencies } from '@dependency-version-checker/common';

export default abstract class UpdateCheckersBase {

    constructor(private registry: RegistryBase) { }

    protected async getVersions(dependencies: Dependencies): Promise<Dependencies> {
        const packageNames = Object.keys(dependencies);
        return this.registry.getVersions(packageNames);
    }

    abstract check(): Promise<Dependencies>;
}