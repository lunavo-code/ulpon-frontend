import type { AgentForm, AgentQuery, AgentVO } from '@/api/ai/agent/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询智能体列表
 * @param query
 * @returns {*}
 */
export const listAgent = (query?: AgentQuery): AxiosPromise<PageResult<AgentVO>> => {
  return request({
    url: '/ai/agent/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询智能体详细
 * @param agentId
 */
export const getAgent = (agentId: string | number): AxiosPromise<AgentVO> => {
  return request({
    url: '/ai/agent/' + agentId,
    method: 'get'
  });
};

/**
 * 新增智能体
 * @param data
 */
export const addAgent = (data: AgentForm) => {
  return request({
    url: '/ai/agent',
    method: 'post',
    data: data
  });
};

/**
 * 修改智能体
 * @param data
 */
export const updateAgent = (data: AgentForm) => {
  return request({
    url: '/ai/agent',
    method: 'put',
    data: data
  });
};



/**
 * 删除智能体
 * @param agentId
 */
export const delAgent = (agentId: string | number | Array<string | number>) => {
  return request({
    url: '/ai/agent/' + agentId,
    method: 'delete'
  });
};
