import type { TemplateForm, TemplateQuery, TemplateVO } from '@/api/tool/gen/template/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询代码生成模板列表
 * @param query
 * @returns {*}
 */
export const listTemplate = (query?: TemplateQuery): AxiosPromise<PageResult<TemplateVO>> => {
  return request({
    url: '/gen/template/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询代码生成模板详细
 * @param id
 */
export const getTemplate = (id: string | number): AxiosPromise<TemplateVO> => {
  return request({
    url: '/gen/template/' + id,
    method: 'get'
  });
};

/**
 * 新增代码生成模板
 * @param data
 */
export const addTemplate = (data: TemplateForm) => {
  return request({
    url: '/gen/template',
    method: 'post',
    data: data
  });
};

/**
 * 修改代码生成模板
 * @param data
 */
export const updateTemplate = (data: TemplateForm) => {
  return request({
    url: '/gen/template',
    method: 'put',
    data: data
  });
};



/**
 * 删除代码生成模板
 * @param id
 */
export const delTemplate = (id: string | number | Array<string | number>) => {
  return request({
    url: '/gen/template/' + id,
    method: 'delete'
  });
};
