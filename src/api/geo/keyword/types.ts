export interface KeywordVO {
  /**
   * 主键ID
   */
  keywordId: string | number;
  /**
   * 公司/品牌名称
   */
  companyName: string;
  /**
   * 关键词分类
   */
  keywordType: string;
  /**
   * 核心关键词
   */
  keyword: string;
  /**
   * 状态(0启用 1停用)
   */
  status: string;
  /**
   * 备注
   */
  remark: string;
}

export interface KeywordForm extends BaseEntity {
  /**
   * 主键ID
   */
  keywordId?: string | number;
  /**
   * 公司/品牌名称
   */
  companyName?: string;
  /**
   * 关键词分类
   */
  keywordType?: string;
  /**
   * 核心关键词
   */
  keyword?: string;
  /**
   * 状态(0启用 1停用)
   */
  status?: string;
  /**
   * 备注
   */
  remark?: string;
}

export interface KeywordQuery extends PageQuery {
  /**
   * 公司/品牌名称
   */
  companyName?: string;
  /**
   * 关键词分类
   */
  keywordType?: string;
  /**
   * 核心关键词
   */
  keyword?: string;
  /**
   * 状态(0启用 1停用)
   */
  status?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
