export interface CapabilityTaskVO {
  /**
   * 主键 ID
   */
  taskId: string | number;
  /**
   * 能力 ID
   */
  capabilityId: string | number;
  /**
   * 用户消息
   */
  userContent: string;
  /**
   * 反馈消息
   */
  resContent: string;
  /**
   * Token 消耗数
   */
  tokenCount: number;
}

export interface CapabilityTaskForm extends BaseEntity {
  /**
   * 主键 ID
   */
  taskId?: string | number;
  /**
   * 能力 ID
   */
  capabilityId?: string | number;
  /**
   * 用户消息
   */
  userContent?: string;
  /**
   * 反馈消息
   */
  resContent?: string;
  /**
   * Token 消耗数
   */
  tokenCount?: number;
}

export interface CapabilityTaskQuery extends PageQuery {
  /**
   * 能力 ID
   */
  capabilityId?: string | number;
  /**
   * 用户消息
   */
  userContent?: string;
  /**
   * 反馈消息
   */
  resContent?: string;
  /**
   * Token 消耗数
   */
  tokenCount?: number;
  /**
   * 日期范围参数
   */
  params?: any;
}
