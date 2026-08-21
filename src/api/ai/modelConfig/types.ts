export interface ModelConfigVO {
  /**
   * 主键 ID
   */
  modelConfigId: string | number;
  /**
   * 提供商 ID
   */
  providerId: string | number;
  /**
   * 配置别名/名称
   */
  configName: string;
  /**
   * 目标模型名称
   */
  modelName: string;
  /**
   * API 接口覆盖地址
   */
  baseUrl: string;
  /**
   * API 密钥 (Script Key)
   */
  apiKey: string;
  /**
   * 最大生成 Token 数
   */
  maxTokens: number;
  /**
   * 温度参数 (0.0 ~ 2.0)
   */
  temperature: number;
  /**
   * 启用状态（0正常 1停用）
   */
  status: boolean;
  /**
   * 是否为默认模型（Y是 N否）
   */
  isDefault: boolean;
  /**
   * 备注
   */
  remark: string;
}

export interface ModelConfigForm extends BaseEntity {
  /**
   * 主键 ID
   */
  modelConfigId?: string | number;
  /**
   * 提供商 ID
   */
  providerId?: string | number;
  /**
   * 配置别名/名称
   */
  configName?: string;
  /**
   * 目标模型名称
   */
  modelName?: string;
  /**
   * API 接口覆盖地址
   */
  baseUrl?: string;
  /**
   * API 密钥 (Script Key)
   */
  apiKey?: string;
  /**
   * 最大生成 Token 数
   */
  maxTokens?: number;
  /**
   * 温度参数 (0.0 ~ 2.0)
   */
  temperature?: number;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 是否为默认模型（Y是 N否）
   */
  isDefault?: boolean;
  /**
   * 备注
   */
  remark?: string;
}

export interface ModelConfigQuery extends PageQuery {
  /**
   * 提供商 ID
   */
  providerId?: string | number;
  /**
   * 配置别名/名称
   */
  configName?: string;
  /**
   * 目标模型名称
   */
  modelName?: string;
  /**
   * API 接口覆盖地址
   */
  baseUrl?: string;
  /**
   * API 密钥 (Script Key)
   */
  apiKey?: string;
  /**
   * 最大生成 Token 数
   */
  maxTokens?: number;
  /**
   * 温度参数 (0.0 ~ 2.0)
   */
  temperature?: number;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 是否为默认模型（Y是 N否）
   */
  isDefault?: boolean;
  /**
   * 日期范围参数
   */
  params?: any;
}
