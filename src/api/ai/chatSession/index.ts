import type { ChatSessionForm, ChatSessionQuery, ChatSessionVO } from '@/api/ai/chatSession/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询对话会话列表
 * @param query
 * @returns {*}
 */
export const listChatSession = (query?: ChatSessionQuery): AxiosPromise<PageResult<ChatSessionVO>> => {
  return request({
    url: '/ai/chatSession/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询对话会话详细
 * @param sessionId
 */
export const getChatSession = (sessionId: string | number): AxiosPromise<ChatSessionVO> => {
  return request({
    url: '/ai/chatSession/' + sessionId,
    method: 'get'
  });
};

/**
 * 新增对话会话
 * @param data
 */
export const addChatSession = (data: ChatSessionForm) => {
  return request({
    url: '/ai/chatSession',
    method: 'post',
    data: data
  });
};

/**
 * 修改对话会话
 * @param data
 */
export const updateChatSession = (data: ChatSessionForm) => {
  return request({
    url: '/ai/chatSession',
    method: 'put',
    data: data
  });
};



/**
 * 删除对话会话
 * @param sessionId
 */
export const delChatSession = (sessionId: string | number | Array<string | number>) => {
  return request({
    url: '/ai/chatSession/' + sessionId,
    method: 'delete'
  });
};
