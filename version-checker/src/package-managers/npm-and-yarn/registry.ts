import RegistryBase from '../../../src/shared/registries/registry-base';
import axios from 'axios';
import { NpmRegistryResponse } from './interfaces/npm-registry-response';
import { Dependencies } from '@dependency-version-checker/common';

export default class Registry extends RegistryBase {

    private baseUrl = 'https://registry.npmjs.org';

    async getVersion(packageName: string): Promise<Dependencies> {
        const { data } = await axios.get<NpmRegistryResponse>(`${this.baseUrl}/-/package/${packageName}/dist-tags`);
        return { [packageName]: data.latest };
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