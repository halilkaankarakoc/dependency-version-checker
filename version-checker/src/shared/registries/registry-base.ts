import { Dependencies } from '@dependency-version-checker/common';

export default abstract class RegistryBase {
    protected abstract getVersion(packageName: string): Promise<Dependencies>;
    abstract getVersions(packageNames: string[]): Promise<Dependencies>;
}