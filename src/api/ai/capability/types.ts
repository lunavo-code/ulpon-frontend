export interface CapabilityVO {
  /**
   * 主键 ID
   */
  capabilityId: string | number;
  /**
   * 能力名称
   */
  capabilityName: string;
  /**
   * 任务描述简介
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
   * 可见范围类型（1个人 2组织 3公开）
   */
  scopeType: string;
  /**
   * 所属部门 ID
   */
  deptId: string | number;
  /**
   * 创建人用户 ID
   */
  userId: string | number;
  /**
   * 启用状态（0正常 1停用）
   */
  status: boolean;
  /**
   * 备注
   */
  remark: string;
}

export interface CapabilityForm extends BaseEntity {
  /**
   * 主键 ID
   */
  capabilityId?: string | number;
  /**
   * 能力名称
   */
  capabilityName?: string;
  /**
   * 任务描述简介
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
   * 可见范围类型（1个人 2组织 3公开）
   */
  scopeType?: string;
  /**
   * 所属部门 ID
   */
  deptId?: string | number;
  /**
   * 创建人用户 ID
   */
  userId?: string | number;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 备注
   */
  remark?: string;
}

export interface CapabilityQuery extends PageQuery {
  /**
   * 能力名称
   */
  capabilityName?: string;
  /**
   * 任务描述简介
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
   * 可见范围类型（1个人 2组织 3公开）
   */
  scopeType?: string;
  /**
   * 所属部门 ID
   */
  deptId?: string | number;
  /**
   * 创建人用户 ID
   */
  userId?: string | number;
  /**
   * 启用状态（0正常 1停用）
   */
  status?: boolean;
  /**
   * 日期范围参数
   */
  params?: any;
}
