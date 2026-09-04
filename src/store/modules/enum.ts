import { defineStore } from 'pinia';

export const useEnumStore = defineStore('enum', () => {
  const enums = ref<Map<string, EnumItem[]>>(new Map());

  /**
   * 获取枚举
   */
  const getEnum = (_key: string): EnumItem[] | null => {
    if (!_key) {
      return null;
    }
    return enums.value.get(_key) || null;
  }

  /**
   * 设置枚举
   */
  const setEnum = (_key: string, _value: EnumItem[]) => {
    if (!_key) {
      return false;
    }
    try {
      enums.value.set(_key, _value);
      return true;
    } catch (e) {
      console.error('Error in setEnum:', e);
      return false;
    }
  };

  /**
   * 清空枚举
   */
  const cleanEnum = (): void => {
    enums.value.clear();
  }

  return {
    getEnum,
    setEnum,
    cleanEnum
  }
})