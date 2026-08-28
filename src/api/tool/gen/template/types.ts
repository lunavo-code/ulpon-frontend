export interface TemplateVO {
  /**
   * id
   */
  id: string | number;
  /**
   * 模板类型: backend,frontend-vue,frontend-react,sql
   */
  type: string;
  /**
   * 生成路径
   */
  path: string;
  /**
   * 模板名称
   */
  name: string;
  /**
   * 模板内容
   */
  content: string;
  /**
   * 排序
   */
  sort: number;
}

export interface TemplateForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;
  /**
   * 模板类型: backend,frontend-vue,frontend-react,sql
   */
  type?: string;
  /**
   * 生成路径
   */
  path?: string;
  /**
   * 模板名称
   */
  name?: string;
  /**
   * 模板内容
   */
  content?: string;
  /**
   * 排序
   */
  sort?: number;
}

export interface TemplateQuery extends PageQuery {
  /**
   * 模板类型: backend,frontend-vue,frontend-react,sql
   */
  type?: string;
  /**
   * 生成路径
   */
  path?: string;
  /**
   * 模板名称
   */
  name?: string;
  /**
   * 模板内容
   */
  content?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 日期范围参数
   */
  params?: any;
}
