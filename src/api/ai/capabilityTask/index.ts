import type { CapabilityTaskForm, CapabilityTaskQuery, CapabilityTaskVO } from '@/api/ai/capabilityTask/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询AI能力任务列表
 * @param query
 * @returns {*}
 */
export const listCapabilityTask = (query?: CapabilityTaskQuery): AxiosPromise<PageResult<CapabilityTaskVO>> => {
  return request({
    url: '/ai/capabilityTask/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询AI能力任务详细
 * @param taskId
 */
export const getCapabilityTask = (taskId: string | number): AxiosPromise<CapabilityTaskVO> => {
  return request({
    url: '/ai/capabilityTask/' + taskId,
    method: 'get'
  });
};

/**
 * 新增AI能力任务
 * @param data
 */
export const addCapabilityTask = (data: CapabilityTaskForm) => {
  return request({
    url: '/ai/capabilityTask',
    method: 'post',
    data: data
  });
};

/**
 * 修改AI能力任务
 * @param data
 */
export const updateCapabilityTask = (data: CapabilityTaskForm) => {
  return request({
    url: '/ai/capabilityTask',
    method: 'put',
    data: data
  });
};



/**
 * 删除AI能力任务
 * @param taskId
 */
export const delCapabilityTask = (taskId: string | number | Array<string | number>) => {
  return request({
    url: '/ai/capabilityTask/' + taskId,
    method: 'delete'
  });
};
