import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';
import { getToken } from '@/utils/auth';
import type { AiAgentChatBo, AiCapabilityChatBo, AiChatVo } from './types';

/**
 * Agent 同步对话
 * @param data
 */
export const chatAgentSync = (data: AiAgentChatBo): AxiosPromise<AiChatVo> => {
  return request({
    url: '/ai/chat/d/a',
    method: 'post',
    data: data
  });
};

/**
 * 能力同步对话
 * @param data
 */
export const chatCapabilitySync = (data: AiCapabilityChatBo): AxiosPromise<AiChatVo> => {
  return request({
    url: '/ai/chat/d/c',
    method: 'post',
    params: data
  });
};

/**
 * 封装通用 SSE 流式 POST 请求
 */
const requestStream = (
  url: string,
  data: any,
  onMessage: (message: AiChatVo) => void,
  onError?: (error: any) => void,
  onDone?: () => void,
  isRawString = false
): AbortController => {
  const controller = new AbortController();
  const token = getToken();

  fetch(`${import.meta.env.VITE_APP_BASE_API}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': isRawString ? 'text/plain;charset=utf-8' : 'application/json;charset=utf-8',
      'Authorization': token ? 'Bearer ' + token : '',
      'clientid': import.meta.env.VITE_APP_CLIENT_ID || ''
    },
    body: isRawString ? String(data) : JSON.stringify(data),
    signal: controller.signal
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 暂存未完结行

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;

          let dataStr = cleanLine;
          if (cleanLine.startsWith('data:')) {
            dataStr = cleanLine.substring(5).trim();
          }
          if (dataStr === '[DONE]') {
            continue;
          }
          try {
            const parsed = JSON.parse(dataStr);
            onMessage(parsed as AiChatVo);
          } catch (e) {
            console.error('Failed to parse SSE message:', dataStr, e);
          }
        }
      }
      onDone?.();
    })
    .catch((err) => {
      if (err.name === 'AbortError') {
        return;
      }
      if (onError) {
        onError(err);
      } else {
        console.error('SSE Stream Error:', err);
      }
    });

  return controller;
};

/**
 * Agent 流式对话
 * @param data
 * @param onMessage
 * @param onError
 * @param onDone
 */
export const chatAgentStream = (
  data: AiAgentChatBo,
  onMessage: (message: AiChatVo) => void,
  onError?: (error: any) => void,
  onDone?: () => void
): AbortController => {
  return requestStream('/ai/chat/s/a', data, onMessage, onError, onDone);
};

/**
 * 能力流式对话
 * @param data
 * @param onMessage
 * @param onError
 * @param onDone
 */
export const chatCapabilityStream = (
  data: AiCapabilityChatBo,
  onMessage: (message: AiChatVo) => void,
  onError?: (error: any) => void,
  onDone?: () => void
): AbortController => {
  return requestStream('/ai/chat/s/c', data, onMessage, onError, onDone);
};

/**
 * 生成 Agent 元数据流式对话
 * @param userMsg
 * @param onMessage
 * @param onError
 * @param onDone
 */
export const genAgentMetaStream = (
  userMsg: string,
  onMessage: (message: AiChatVo) => void,
  onError?: (error: any) => void,
  onDone?: () => void
): AbortController => {
  return requestStream('/ai/chat/s/agent/meta', userMsg, onMessage, onError, onDone, true);
};
