export interface KeywordDerivedVO {
  /**
   * 主键ID
   */
  derivedId: string | number;
  /**
   * 关联核心词ID
   */
  keywordId: string | number;
  /**
   * 标题类型
   */
  titleType: string;
  /**
   * 生成的文章标题/用户提问内容
   */
  derivedQuestion: string;
  /**
   * 状态(0待创作 1已创作 2已禁用)
   */
  status: string;
  /**
   * 备注
   */
  remark: string;
}

export interface KeywordDerivedForm extends BaseEntity {
  /**
   * 主键ID
   */
  derivedId?: string | number;
  /**
   * 关联核心词ID
   */
  keywordId?: string | number;
  /**
   * 标题类型
   */
  titleType?: string;
  /**
   * 生成的文章标题/用户提问内容
   */
  derivedQuestion?: string;
  /**
   * 状态(0待创作 1已创作 2已禁用)
   */
  status?: string;
  /**
   * 备注
   */
  remark?: string;
}

export interface KeywordDerivedQuery extends PageQuery {
  /**
   * 关联核心词ID
   */
  keywordId?: string | number;
  /**
   * 标题类型
   */
  titleType?: string;
  /**
   * 生成的文章标题/用户提问内容
   */
  derivedQuestion?: string;
  /**
   * 状态(0待创作 1已创作 2已禁用)
   */
  status?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
