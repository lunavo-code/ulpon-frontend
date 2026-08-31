import { enumInfo } from '@/api/enums/index';
import { useEnumStore } from '@/store/modules/enum';

const pendingRequests = new Map<string, Promise<EnumItem[]>>();

export const useEnum = (model: string, ...keys: string[]): { [key: string]: EnumItem[] } => {
  const res = reactive<{ [key: string]: EnumItem[] }>({});

  keys.forEach(async key => {
    res[key] = [];
    const enums = useEnumStore().getEnum(model, key);
    if (enums) {
      res[key] = enums;
    } else {
      const cacheKey = `${model}:${key}`;
      if (!pendingRequests.has(cacheKey)) {
        const request = enumInfo(model, key)
          .then(resp => {
            const data = resp.data?.values || [];
            useEnumStore().setEnum(model, key, data);
            return data;
          })
          .finally(() => pendingRequests.delete(cacheKey));
        pendingRequests.set(cacheKey, request);
      }
      res[key] = await pendingRequests.get(cacheKey)!;
      console.log(`Fetched enum for ${model}:${key}`, res[key]);
    }
  });

  return res;
};