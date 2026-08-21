export interface ModelProviderVO {
  /**
   * 主键 ID
   */
  providerId: string | number;
  /**
   * 提供商名称
   */
  providerName: string | number;
  /**
   * 提供商唯一标识键
   */
  providerCode: string | number;
  /**
   * 默认 API 接口地址
   */
  defaultBaseUrl: string;
  /**
   * 启用状态（0正常 1停用）
   */
  status: boolean;
  /**
   * 备注
   */
  remark: string;
}

export interface ModelProviderForm extends BaseEntity {
  /**
   * 主键 ID
   */
  providerId?: string | number;
  /**
   * 提供商名称
   */
  providerName?: string | number;
  /**
   * 提供商唯一标识键
   */
  providerCode?: string | number;
  /**
   * 默认 API 接口地址
   */
  defaultBaseUrl?: string;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 备注
   */
  remark?: string;
}

export interface ModelProviderQuery extends PageQuery {
  /**
   * 提供商名称
   */
  providerName?: string | number;
  /**
   * 提供商唯一标识键
   */
  providerCode?: string | number;
  /**
   * 默认 API 接口地址
   */
  defaultBaseUrl?: string;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 日期范围参数
   */
  params?: any;
}
