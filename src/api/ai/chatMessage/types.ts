export interface ChatMessageVO {
  /**
   * 主键 ID
   */
  messageId: string | number;
  /**
   * 关联会话 ID
   */
  sessionId: string | number;
  /**
   * 角色类型（system, user, assistant, tool）
   */
  role: string;
  /**
   * 消息内容
   */
  content: string;
  /**
   * Token 消耗数
   */
  tokenCount: number;
}

export interface ChatMessageForm extends BaseEntity {
  /**
   * 主键 ID
   */
  messageId?: string | number;
  /**
   * 关联会话 ID
   */
  sessionId?: string | number;
  /**
   * 角色类型（system, user, assistant, tool）
   */
  role?: string;
  /**
   * 消息内容
   */
  content?: string;
  /**
   * Token 消耗数
   */
  tokenCount?: number;
}

export interface ChatMessageQuery extends PageQuery {
  /**
   * 关联会话 ID
   */
  sessionId?: string | number;
  /**
   * 角色类型（system, user, assistant, tool）
   */
  role?: string;
  /**
   * 消息内容
   */
  content?: string;
  /**
   * Token 消耗数
   */
  tokenCount?: number;
  /**
   * 日期范围参数
   */
  params?: any;
}
