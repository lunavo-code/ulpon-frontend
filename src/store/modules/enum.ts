import { defineStore } from 'pinia';

export const useEnumStore = defineStore('enum', () => {
    const enums = ref(new Map<string, Map<string, EnumItem[]>>());

    const getEnum = (_model: string, _key: string): EnumItem[] | null => {
        if (!_model || !_key) {
            return null;
        }
        const modelMap = enums.value.get(_model);
        if (!modelMap) {
            return null;
        }
        return modelMap.get(_key) || null;
    }

    const setEnum = (_model: string, _key: string, _value: EnumItem[]): boolean => {
        if (!_model || !_key) {
            return false;
        }
        let modelMap = enums.value.get(_model);
        if (!modelMap) {
            modelMap = new Map<string, EnumItem[]>();
            enums.value.set(_model, modelMap);
        }
        modelMap.set(_key, _value);
        return true;
    }

    const clearEnum = (): void => {
        enums.value.clear();
    }

    return {
        enums,
        getEnum,
        setEnum,
        clearEnum
    }
})
