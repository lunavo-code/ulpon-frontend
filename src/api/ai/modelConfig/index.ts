import type { ModelConfigForm, ModelConfigQuery, ModelConfigVO } from '@/api/ai/modelConfig/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询大模型配置列表
 * @param query
 * @returns {*}
 */
export const listModelConfig = (query?: ModelConfigQuery): AxiosPromise<PageResult<ModelConfigVO>> => {
  return request({
    url: '/ai/modelConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询大模型配置详细
 * @param modelConfigId
 */
export const getModelConfig = (modelConfigId: string | number): AxiosPromise<ModelConfigVO> => {
  return request({
    url: '/ai/modelConfig/' + modelConfigId,
    method: 'get'
  });
};

/**
 * 新增大模型配置
 * @param data
 */
export const addModelConfig = (data: ModelConfigForm) => {
  return request({
    url: '/ai/modelConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改大模型配置
 * @param data
 */
export const updateModelConfig = (data: ModelConfigForm) => {
  return request({
    url: '/ai/modelConfig',
    method: 'put',
    data: data
  });
};



/**
 * 删除大模型配置
 * @param modelConfigId
 */
export const delModelConfig = (modelConfigId: string | number | Array<string | number>) => {
  return request({
    url: '/ai/modelConfig/' + modelConfigId,
    method: 'delete'
  });
};
