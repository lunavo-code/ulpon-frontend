import type { CapabilityForm, CapabilityQuery, CapabilityVO } from '@/api/ai/capability/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询AI能力列表
 * @param query
 * @returns {*}
 */
export const listCapability = (query?: CapabilityQuery): AxiosPromise<PageResult<CapabilityVO>> => {
  return request({
    url: '/ai/capability/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询AI能力详细
 * @param capabilityId
 */
export const getCapability = (capabilityId: string | number): AxiosPromise<CapabilityVO> => {
  return request({
    url: '/ai/capability/' + capabilityId,
    method: 'get'
  });
};

/**
 * 新增AI能力
 * @param data
 */
export const addCapability = (data: CapabilityForm) => {
  return request({
    url: '/ai/capability',
    method: 'post',
    data: data
  });
};

/**
 * 修改AI能力
 * @param data
 */
export const updateCapability = (data: CapabilityForm) => {
  return request({
    url: '/ai/capability',
    method: 'put',
    data: data
  });
};



/**
 * 删除AI能力
 * @param capabilityId
 */
export const delCapability = (capabilityId: string | number | Array<string | number>) => {
  return request({
    url: '/ai/capability/' + capabilityId,
    method: 'delete'
  });
};
