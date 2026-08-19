import type { KeywordForm, KeywordQuery, KeywordVO } from '@/api/geo/keyword/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询核心词管理列表
 * @param query
 * @returns {*}
 */
export const listKeyword = (query?: KeywordQuery): AxiosPromise<PageResult<KeywordVO>> => {
  return request({
    url: '/geo/keyword/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询核心词管理详细
 * @param keywordId
 */
export const getKeyword = (keywordId: string | number): AxiosPromise<KeywordVO> => {
  return request({
    url: '/geo/keyword/' + keywordId,
    method: 'get'
  });
};

/**
 * 新增核心词管理
 * @param data
 */
export const addKeyword = (data: KeywordForm) => {
  return request({
    url: '/geo/keyword',
    method: 'post',
    data: data
  });
};

/**
 * 修改核心词管理
 * @param data
 */
export const updateKeyword = (data: KeywordForm) => {
  return request({
    url: '/geo/keyword',
    method: 'put',
    data: data
  });
};



/**
 * 删除核心词管理
 * @param keywordId
 */
export const delKeyword = (keywordId: string | number | Array<string | number>) => {
  return request({
    url: '/geo/keyword/' + keywordId,
    method: 'delete'
  });
};
