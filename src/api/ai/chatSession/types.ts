export interface ChatSessionVO {
  /**
   * 主键 ID
   */
  sessionId: string | number;
  /**
   * 会话名称
   */
  sessionName: string;
  /**
   * 关联智能体 ID
   */
  agentId: string | number;
  /**
   * 会话所有者 ID
   */
  userId: string | number;
}

export interface ChatSessionForm extends BaseEntity {
  /**
   * 主键 ID
   */
  sessionId?: string | number;
  /**
   * 会话名称
   */
  sessionName?: string;
  /**
   * 关联智能体 ID
   */
  agentId?: string | number;
  /**
   * 会话所有者 ID
   */
  userId?: string | number;
}

export interface ChatSessionQuery extends PageQuery {
  /**
   * 会话名称
   */
  sessionName?: string;
  /**
   * 关联智能体 ID
   */
  agentId?: string | number;
  /**
   * 会话所有者 ID
   */
  userId?: string | number;
  /**
   * 日期范围参数
   */
  params?: any;
}
