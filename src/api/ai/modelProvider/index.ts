import type { ModelProviderForm, ModelProviderQuery, ModelProviderVO } from '@/api/ai/modelProvider/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询大模型提供商列表
 * @param query
 * @returns {*}
 */
export const listModelProvider = (query?: ModelProviderQuery): AxiosPromise<PageResult<ModelProviderVO>> => {
  return request({
    url: '/ai/modelProvider/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询大模型提供商详细
 * @param providerId
 */
export const getModelProvider = (providerId: string | number): AxiosPromise<ModelProviderVO> => {
  return request({
    url: '/ai/modelProvider/' + providerId,
    method: 'get'
  });
};

/**
 * 新增大模型提供商
 * @param data
 */
export const addModelProvider = (data: ModelProviderForm) => {
  return request({
    url: '/ai/modelProvider',
    method: 'post',
    data: data
  });
};

/**
 * 修改大模型提供商
 * @param data
 */
export const updateModelProvider = (data: ModelProviderForm) => {
  return request({
    url: '/ai/modelProvider',
    method: 'put',
    data: data
  });
};



/**
 * 删除大模型提供商
 * @param providerId
 */
export const delModelProvider = (providerId: string | number | Array<string | number>) => {
  return request({
    url: '/ai/modelProvider/' + providerId,
    method: 'delete'
  });
};
