import type { ChatMessageForm, ChatMessageQuery, ChatMessageVO } from '@/api/ai/chatMessage/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询对话消息列表
 * @param query
 * @returns {*}
 */
export const listChatMessage = (query?: ChatMessageQuery): AxiosPromise<PageResult<ChatMessageVO>> => {
  return request({
    url: '/ai/chatMessage/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询对话消息详细
 * @param messageId
 */
export const getChatMessage = (messageId: string | number): AxiosPromise<ChatMessageVO> => {
  return request({
    url: '/ai/chatMessage/' + messageId,
    method: 'get'
  });
};

/**
 * 新增对话消息
 * @param data
 */
export const addChatMessage = (data: ChatMessageForm) => {
  return request({
    url: '/ai/chatMessage',
    method: 'post',
    data: data
  });
};

/**
 * 修改对话消息
 * @param data
 */
export const updateChatMessage = (data: ChatMessageForm) => {
  return request({
    url: '/ai/chatMessage',
    method: 'put',
    data: data
  });
};



/**
 * 删除对话消息
 * @param messageId
 */
export const delChatMessage = (messageId: string | number | Array<string | number>) => {
  return request({
    url: '/ai/chatMessage/' + messageId,
    method: 'delete'
  });
};
