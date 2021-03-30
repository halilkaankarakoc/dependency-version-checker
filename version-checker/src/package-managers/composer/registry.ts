import RegistryBase from '../../shared/registries/registry-base';
import axios from 'axios';
import { ComposerRegistryResponse } from './interfaces/composer-registry-response';
import { Dependencies } from '@dependency-version-checker/common';

export default class Registry extends RegistryBase {

    private baseUrl = 'https://repo.packagist.org';
    async getVersion(packageName: string): Promise<Dependencies> {
        const { data } = await axios.get<ComposerRegistryResponse>(`${this.baseUrl}/p2/${packageName}.json`);
        return { [packageName]: data.packages[packageName][0].version };
    }

    async getVersions(packageNames: string[]): Promise<Dependencies> {
        const promises = packageNames.map(async packageName => {
            return this.getVersion(packageName).catch(e => e);
        });

        const responses = await Promise.all(promises);
        const dependenciesFromRegistry = responses.filter(response => !(response instanceof Error));
        let transformed = {};
        dependenciesFromRegistry.forEach(dependency => {
            transformed = {
                ...transformed,
                ...dependency
            }
        });
        return transformed;
    }
}