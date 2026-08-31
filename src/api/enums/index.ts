import type { AxiosPromise } from '@/utils/api-types';
import type {EnumInfo} from '@/api/enums/types';
import request from '@/utils/request';

/**
 * 获取所有枚举
 * @returns 
 */
export const allEnums = (): AxiosPromise<Record<string,EnumInfo[]>> => {
    return request({
        url: '/enum/all',
        method: 'get'
    });
}

/**
 * 获取指定模块所有枚举
 * @param model 模块名
 * @returns 
 */
export const listEnums = (model:string): AxiosPromise<EnumInfo[]> => {
    return request({
        url: `/enum/list/${model}`,
        method: 'get'
    });
}

/**
 * 获取枚举详情
 * @param model 模块 
 * @param key key
 * @returns 
 */
export const enumInfo = (model:string, key:string): AxiosPromise<EnumInfo> => {
    return request({
        url: `/enum/info/${model}/${key}`,
        method: 'get'
    });
}
