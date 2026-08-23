export interface AiAgentChatBo {
  /**
   * 智能体 ID
   */
  agentId: string | number;
  /**
   * 会话 ID
   */
  sessionId: string | number;
  /**
   * 用户输入的消息
   */
  userMsg: string;
}

export interface AiCapabilityChatBo {
  /**
   * AI 能力 ID
   */
  capabilityId: string | number;
  /**
   * 用户输入的消息
   */
  userMsg: string;
}

export interface AiChatVo {
  /**
   * 会话 ID
   */
  sId: string | number;
  /**
   * 消息类型
   */
  t: string;
  /**
   * 消息内容
   */
  c: string;
}
