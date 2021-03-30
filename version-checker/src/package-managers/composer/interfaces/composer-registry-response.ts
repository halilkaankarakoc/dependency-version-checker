export interface ComposerRegistryResponse {
    packages: {
        [name: string]: {
            version: string
        }[]
    }
};