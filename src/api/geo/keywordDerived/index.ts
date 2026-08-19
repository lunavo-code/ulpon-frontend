import type { KeywordDerivedForm, KeywordDerivedQuery, KeywordDerivedVO } from '@/api/geo/keywordDerived/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询派生标题管理列表
 * @param query
 * @returns {*}
 */
export const listKeywordDerived = (query?: KeywordDerivedQuery): AxiosPromise<PageResult<KeywordDerivedVO>> => {
  return request({
    url: '/geo/keywordDerived/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询派生标题管理详细
 * @param derivedId
 */
export const getKeywordDerived = (derivedId: string | number): AxiosPromise<KeywordDerivedVO> => {
  return request({
    url: '/geo/keywordDerived/' + derivedId,
    method: 'get'
  });
};

/**
 * 新增派生标题管理
 * @param data
 */
export const addKeywordDerived = (data: KeywordDerivedForm) => {
  return request({
    url: '/geo/keywordDerived',
    method: 'post',
    data: data
  });
};

/**
 * 修改派生标题管理
 * @param data
 */
export const updateKeywordDerived = (data: KeywordDerivedForm) => {
  return request({
    url: '/geo/keywordDerived',
    method: 'put',
    data: data
  });
};



/**
 * 删除派生标题管理
 * @param derivedId
 */
export const delKeywordDerived = (derivedId: string | number | Array<string | number>) => {
  return request({
    url: '/geo/keywordDerived/' + derivedId,
    method: 'delete'
  });
};
