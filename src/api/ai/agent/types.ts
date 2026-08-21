export interface AgentVO {
  /**
   * 主键 ID
   */
  agentId: string | number;
  /**
   * 智能体名称
   */
  agentName: string;
  /**
   * 智能体头像
   */
  avatar: string;
  /**
   * 智能体头像Url
   */
  avatarUrl: string;
  /**
   * 智能体描述简介
   */
  description: string;
  /**
   * 系统提示词 (System Prompt)
   */
  systemPrompt: string;
  /**
   * 关联大模型配置 ID
   */
  modelConfigId: string | number;
  /**
   * 启用知识库（0停用 1启用）
   */
  kbEnabled: boolean;
  /**
   * 关联知识库 ID
   */
  kbId: string | number;
  /**
   * 启用联网检索（0停用 1启用）
   */
  searchEnabled: boolean;
  /**
   * 启用聊天记忆（0停用 1启用）
   */
  memoryEnabled: boolean;
  /**
   * 记忆窗口长度
   */
  memoryWindow: number;
  /**
   * 问候语
   */
  greeting: string;
  /**
   * 预设问题
   */
  presetQuestions: string;
  /**
   * 可见范围类型（1个人 2组织 3公开）
   */
  scopeType: string;
  /**
   * 启用状态（0正常 1停用）
   */
  status: boolean;
  /**
   * 备注
   */
  remark: string;
}

export interface AgentForm extends BaseEntity {
  /**
   * 主键 ID
   */
  agentId?: string | number;
  /**
   * 智能体名称
   */
  agentName?: string;
  /**
   * 智能体头像
   */
  avatar?: string;
  /**
   * 智能体描述简介
   */
  description?: string;
  /**
   * 系统提示词 (System Prompt)
   */
  systemPrompt?: string;
  /**
   * 关联大模型配置 ID
   */
  modelConfigId?: string | number;
  /**
   * 启用知识库（0停用 1启用）
   */
  kbEnabled?: boolean;
  /**
   * 关联知识库 ID
   */
  kbId?: string | number;
  /**
   * 启用联网检索（0停用 1启用）
   */
  searchEnabled?: boolean;
  /**
   * 启用聊天记忆（0停用 1启用）
   */
  memoryEnabled?: boolean;
  /**
   * 记忆窗口长度
   */
  memoryWindow?: number;
  /**
   * 问候语
   */
  greeting?: string;
  /**
   * 预设问题
   */
  presetQuestions?: string;
  /**
   * 可见范围类型（1个人 2组织 3公开）
   */
  scopeType?: string;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 备注
   */
  remark?: string;
}

export interface AgentQuery extends PageQuery {
  /**
   * 智能体名称
   */
  agentName?: string;
  /**
   * 智能体头像
   */
  avatar?: string;
  /**
   * 智能体描述简介
   */
  description?: string;
  /**
   * 系统提示词 (System Prompt)
   */
  systemPrompt?: string;
  /**
   * 关联大模型配置 ID
   */
  modelConfigId?: string | number;
  /**
   * 启用知识库（0停用 1启用）
   */
  kbEnabled?: boolean;
  /**
   * 关联知识库 ID
   */
  kbId?: string | number;
  /**
   * 启用联网检索（0停用 1启用）
   */
  searchEnabled?: boolean;
  /**
   * 启用聊天记忆（0停用 1启用）
   */
  memoryEnabled?: boolean;
  /**
   * 记忆窗口长度
   */
  memoryWindow?: number;
  /**
   * 问候语
   */
  greeting?: string;
  /**
   * 预设问题
   */
  presetQuestions?: string;
  /**
   * 可见范围类型（1个人 2组织 3公开）
   */
  scopeType?: string;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 日期范围参数
   */
  params?: any;
}
