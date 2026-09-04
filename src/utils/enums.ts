import { enumInfo } from '@/api/enums/index';
import { useEnumStore } from '@/store/modules/enum';

const pendingRequests = new Map<string, Promise<EnumItem[]>>();

export const useEnum = (modelName: string, ...args: string[]): { [key: string]: EnumItem[] } => {
  const res = reactive<{ [key: string]: EnumItem[] }>({});

  args.forEach(async enumType => {
    res[enumType] = [];
    const enums = useEnumStore().getEnum(enumType);
    if (enums) {
      res[enumType] = enums;
    } else {
      if (!pendingRequests.has(enumType)) {
        const request = enumInfo(modelName, enumType)
          .then(resp => {
            const data = resp.data.map(
              (p): EnumItem => ({
                code: p.code,
                label: p.label,
                desc: p.desc
              })
            )
            useEnumStore().setEnum(enumType, data);
            return data;
          })
          .finally(() => pendingRequests.delete(enumType));
        pendingRequests.set(enumType, request);
      }
      res[enumType] = await pendingRequests.get(enumType)!;
    }
  })
  return res;
}