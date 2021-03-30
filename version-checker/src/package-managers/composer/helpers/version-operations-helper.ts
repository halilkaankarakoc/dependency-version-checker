import { Dependencies } from "@dependency-version-checker/common";

/**
 * @description intersects two dependency object
 * @param dep1 `{ lodash: '1.2.3', express: '1.2.3', asdadsasdadsa: '1.2.3'}`
 * @param dep2 `{ lodash: '4.17.21', express: '4.17.1' }`
 * @returns  `[{ lodash: '1.2.3', express: '1.2.3' }, { lodash: '4.17.21', express: '4.17.1' }]`
 */
export function equalizeDependencies(dep1: Dependencies, dep2: Dependencies): Dependencies[] {
    const cloned = { ...dep1 };
    Object.keys(dep1).forEach(key => {
        if (!dep2[key]) {
            delete cloned[key];
        }
    });
    return [cloned, dep2];
}

/**
 * @description add zeros to start to versions for comparing
 * @param dep1 `{ lodash: '1.2.3', express: '1.2.3'}`
 * @param dep2 `{ lodash: '4.17.21', express: '4.17.1'}`
 * @returns `[{ lodash: '1.02.03.', express: '1.02.3.' } { lodash: '4.17.21.', express: '4.17.1.' }]`
 */
export function normalizeVersions(dep1: Dependencies, dep2: Dependencies): Dependencies[] {
    let oldTransformed: Dependencies = {};
    let newTransformed: Dependencies = {};

    Object.keys(dep1).forEach(key => {
        const oldValue = dep1[key];
        const newValue = dep2[key];
        let oldSplitted = oldValue.split('.').map(val => {
            if (Number.isInteger(Number.parseInt(val))) {
                return val;
            }
            return '0';
        });
        let newSplitted = newValue.split('.').map(val => {
            if (Number.isInteger(Number.parseInt(val))) {
                return val;
            }
            return '0';
        });
        const maxLength = Math.max(oldSplitted.length, newSplitted.length);
        oldSplitted = [...oldSplitted, ...new Array(maxLength - oldSplitted.length).fill('0')]
        newSplitted = [...newSplitted, ...new Array(maxLength - newSplitted.length).fill('0')]

        let v1 = '';
        let v2 = '';
        oldSplitted.forEach((s1, index) => {
            let s2 = newSplitted[index]
            const max = Math.max(s1.length, s2.length);

            const s1Padded = s1.padStart(max, '0');
            const s2Padded = s2.padStart(max, '0');

            v1 = v1.concat(s1Padded + '.');
            v2 = v2.concat(s2Padded + '.');
        });

        oldTransformed[key] = v1;
        newTransformed[key] = v2;
    });
    return [oldTransformed, newTransformed]
}

/**
 * @description return first zero non-added form
 */
export function denormalize(dep1: Dependencies, dep2: Dependencies): Dependencies {
    const cloned = { ...dep1 };
    Object.keys(dep1).forEach(key => {
        if (!dep2[key]) {
            delete cloned[key];
        }
    });
    return cloned;
}

/**
 * @description compares versions 
 */
export function compareVersions(dep1: Dependencies, dep2: Dependencies): Dependencies {
    let compared: Dependencies = {};

    const filtered = Object.keys(dep2)
        .filter(dependencyName => dep2[dependencyName] > dep1[dependencyName])

    filtered.forEach(dependencyName => {
        compared[dependencyName] = dep2[dependencyName]
    });
    return compared;
}
