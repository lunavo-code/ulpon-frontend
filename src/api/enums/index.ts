import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

export const enumCatalog = (): AxiosPromise<Record<string, string>> => {
    return request({
        url: '/enum/catalog',
        method: 'get'
    })
}

/**
 * 获取枚举详情
 * @param model 模块 
 * @param enumType enumType
 * @returns 
 */
export const enumInfo = (model: string, enumType: string): AxiosPromise<EnumItem[]> => {
    return request({
        url: `/enum/type/${model}/${enumType}`,
        method: 'get'
    });
}
