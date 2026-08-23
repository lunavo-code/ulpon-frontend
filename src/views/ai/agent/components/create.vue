<template>
  <div class="create-page-container">
    <!--    &lt;!&ndash; 头部栏 &ndash;&gt;-->
    <!--    <div class="flex justify-between items-center mb-6">-->
    <!--      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">创建新智能体</h3>-->
    <!--      <el-button size="small" @click="cancel">返回列表</el-button>-->
    <!--    </div>-->

    <!-- 左右分栏结构 -->
    <div class="test-view-container">
      <!-- 左侧：表单配置 -->
      <el-card v-loading="saveLoading" class="left-panel-card" shadow="none">
        <template #header>
          <span class="font-bold text-base">智能体配置表单</span>
        </template>
        <div class="panel-body-scroll">

          <!-- AI 智能辅助与元数据导入区 (置于表单最顶部) -->
          <div
            class="ai-helper-section mb-6 p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg">
            <div class="font-bold text-xs text-gray-500 mb-2">AI 智能辅助 / 配置导入</div>
            <el-input v-model="userDesc" :disabled="generating" :rows="3" class="mb-3"
              placeholder="请输入您对智能体的角色描述和功能特点（例如：我需要一个精通 Python 编程的助手...）" type="textarea" />
            <div class="flex gap-2 justify-end">
              <el-button v-if="generating" size="small" type="danger" @click="abortGeneration">
                停止生成
              </el-button>
              <el-button v-else :disabled="!userDesc.trim()" icon="Cpu" size="small" type="primary"
                @click="startGeneration">
                生成元数据
              </el-button>
              <el-button :disabled="generating" icon="DocumentCopy" plain size="small" type="success"
                @click="readClipboardAndParse">
                解析剪贴板数据
              </el-button>
            </div>
            <div v-if="generating" class="text-xs text-blue-500 animate-pulse mt-2 flex items-center gap-1">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              AI 推荐元数据流式生成中，配置正在实时载入...
            </div>
          </div>

          <el-form ref="agentFormRef" :model="form" :rules="rules" class="dialog-grid-form" label-width="120px">
            <el-form-item class="span-2" label="头像" prop="avatar">
              <image-upload v-model="form.avatar" :limit="1" />
            </el-form-item>
            <el-form-item class="span-2" label="名称" prop="agentName">
              <el-input v-model="form.agentName" placeholder="请输入智能体名称" />
            </el-form-item>
            <el-form-item class="span-2" label="描述简介" prop="description">
              <el-input v-model="form.description" placeholder="请输入智能体简介" type="textarea" />
            </el-form-item>
            <el-form-item class="span-2" label="系统指令" prop="systemPrompt">
              <el-input v-model="form.systemPrompt" :rows="5" placeholder="请输入系统指令" type="textarea" />
            </el-form-item>
            <el-form-item class="span-2" label="问候语" prop="greeting">
              <el-input v-model="form.greeting" placeholder="请输入问候语" type="textarea" />
            </el-form-item>
            <el-form-item class="span-2" label="模型配置" prop="modelConfigId">
              <ModelSelectPanel v-model="form.modelConfigId" :displayColumns="['configName']" />
            </el-form-item>
            <!-- 预设问题多输入框行列表 -->
            <el-form-item class="span-2" label="预设问题">
              <div class="preset-questions-wrapper w-full">
                <div v-for="(question, qIndex) in presetQuestionsList" :key="qIndex"
                  class="flex items-center gap-2 mb-2 w-full">
                  <el-input v-model="presetQuestionsList[qIndex]" class="flex-1" placeholder="请输入预设问题" />
                  <el-button circle icon="Delete" size="small" type="danger" @click="removePresetQuestion(qIndex)" />
                </div>
                <el-button class="mt-1" icon="Plus" plain size="small" type="primary" @click="addPresetQuestion">
                  新增行
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="启用知识库" prop="kbEnabled">
              <el-switch v-model="form.kbEnabled" :active-value="true" :inactive-value="false" />
            </el-form-item>
            <el-form-item v-show="form.kbEnabled" label="关联知识库 ID" prop="kbId">
              <el-input-number v-model="form.kbId" controls-position="right" />
            </el-form-item>

            <el-form-item class="span-2" label="启用联网检索" prop="searchEnabled">
              <el-switch v-model="form.searchEnabled" :active-value="true" :inactive-value="false" />
            </el-form-item>

            <el-form-item label="启用聊天记忆" prop="memoryEnabled">
              <el-switch v-model="form.memoryEnabled" :active-value="true" :inactive-value="false" />
            </el-form-item>
            <el-form-item v-if="form.memoryEnabled" label="记忆窗口长度" prop="memoryWindow">
              <el-input-number v-model="form.memoryWindow" controls-position="right" />
            </el-form-item>

            <el-form-item class="span-2" label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入内容" type="textarea" />
            </el-form-item>

            <el-form-item label="可见范围类型" prop="scopeType">
              <el-select v-model="form.scopeType" class="w-full" placeholder="请选择可见范围类型">
                <el-option v-for="dict in ai_agent_visibility" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" class="w-full" placeholder="请选择可见范围类型">
                <el-option v-for="dict in ai_agent_status" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
              <!--              <el-switch v-model="form.status" :active-value="true" :inactive-value="false"/>-->
            </el-form-item>
          </el-form>
        </div>
        <div class="panel-footer mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
          <el-button plain type="danger" @click="handleAbandonAgent">放弃并删除</el-button>
          <el-button type="success" @click="handleFinishTest">确认发布</el-button>
        </div>
      </el-card>

      <!-- 右侧：对话测试 -->
      <el-card class="right-chat-card" shadow="none">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold text-base flex items-center gap-2">
              <span>测试对话</span>
              <el-tag size="small" type="info">{{ form.agentName || '智能体' }}</el-tag>
            </span>
            <el-button icon="Refresh" size="small" @click="resetChat">重置会话</el-button>
          </div>
        </template>

        <!-- 聊天气泡消息区域 -->
        <div ref="chatScrollRef" class="chat-messages-container">
          <div v-if="chatMessages.length === 0" class="empty-state text-center text-gray-400 mt-20">
            <div v-if="generating" class="animate-pulse flex flex-col items-center gap-2">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              <span>AI 正在为您生成配置元数据，请稍候...</span>
            </div>
            <div v-else>
              暂无聊天记录，请在左侧配置完成后在下方开始对话！
            </div>
          </div>
          <div v-for="(msg, index) in chatMessages" :key="index"
            :class="['message flex flex-col mb-4', msg.role === 'user' ? 'items-end' : 'items-start']">
            <!-- 思考过程 -->
            <div v-if="msg.role === 'assistant' && msg.thinking" class="message-bubble think-bubble mb-2">
              <div
                class="text-xs text-gray-400 dark:text-zinc-500 mb-1 border-b border-dashed border-gray-200 dark:border-zinc-700 pb-1 flex items-center gap-1">
                <el-icon class="is-loading">
                  <Loading />
                </el-icon>
                正在思考...
              </div>
              <div>{{ msg.thinking }}</div>
            </div>
            <!-- 对话正文 -->
            <div v-if="msg.content"
              :class="['message-bubble', msg.role === 'user' ? 'user-bubble' : 'assistant-bubble']">
              {{ msg.content }}
            </div>
          </div>
        </div>

        <!-- 预设问题快速点击 -->
        <div v-if="presetQuestionsList.filter(q => q.trim()).length > 0 && !generating" class="preset-questions mb-3">
          <el-tag v-for="(q, qIdx) in presetQuestionsList.filter(q => q.trim())" :key="qIdx"
            class="preset-tag cursor-pointer" effect="plain" round type="info" @click="sendPresetQuestion(q)">
            {{ q }}
          </el-tag>
        </div>

        <!-- 输入发送区域 -->
        <div class="flex gap-2">
          <el-input v-model="userMessageText" :disabled="chatSending || generating" :rows="2"
            placeholder="输入您想对智能体说的话，回车发送..." type="textarea" @keydown.enter.prevent="sendMessage" />
          <el-button :disabled="!userMessageText.trim() || generating" :loading="chatSending" class="send-btn"
            type="primary" @click="sendMessage">
            发送
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" name="AgentCreateDialog" setup>
import { nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { ElForm } from 'element-plus';
import { addAgent, delAgent, listAgent, updateAgent } from '@/api/ai/agent';
import { chatAgentStream, genAgentMetaStream } from '@/api/ai/chat';
import { AgentForm } from '@/api/ai/agent/types';
import modal from '@/plugins/modal';
import { useDict } from '@/utils/dict';
import ModelSelectPanel from '@/views/ai/modelConfig/components/SelectPanel.vue';

type ElFormInstance = InstanceType<typeof ElForm>;

const { ai_agent_visibility, ai_agent_status } = toRefs<any>(useDict('ai_agent_visibility', 'ai_agent_status'));

const emit = defineEmits(['success', 'back']);

const userDesc = ref('');
const streamOutput = ref('');
const generating = ref(false);
const saveLoading = ref(false);
const agentFormRef = ref<ElFormInstance>();
const presetQuestionsList = ref<string[]>([]);

let abortController: AbortController | null = null;

const initFormData: AgentForm = {
  agentId: undefined,
  agentName: '',
  avatar: undefined,
  description: '',
  systemPrompt: '',
  modelConfigId: undefined,
  kbEnabled: false,
  kbId: undefined,
  searchEnabled: false,
  memoryEnabled: false,
  memoryWindow: undefined,
  greeting: '',
  presetQuestions: undefined,
  scopeType: '1',
  status: '1',
  remark: undefined,
};

const data = reactive({
  form: { ...initFormData },
  rules: {
    agentName: [{ required: true, message: '智能体名称不能为空', trigger: 'blur' }],
    modelConfigId: [{ required: true, message: '关联大模型配置不能为空', trigger: 'change' }],
    scopeType: [{ required: true, message: '可见范围类型不能为空', trigger: 'change' }]
  }
});

const { form, rules } = toRefs(data);

// 对话测试相关状态
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
}

const chatMessages = ref<ChatMessage[]>([]);
const userMessageText = ref('');
const chatSending = ref(false);
const chatScrollRef = ref<HTMLDivElement>();
const currentSessionId = ref<number | string | undefined>(undefined);

let chatAbortController: AbortController | null = null;

onMounted(() => {
  userDesc.value = '';
  streamOutput.value = '';
  generating.value = false;
  presetQuestionsList.value = [];
  reset();
});

/** 重置表单 */
const reset = () => {
  form.value = { ...initFormData };
  presetQuestionsList.value = [];
};

/** 取消 / 返回列表 */
const cancel = () => {
  abortGeneration();
  if (chatAbortController) {
    chatAbortController.abort();
  }
  emit('back');
};

/** 停止生成 */
const abortGeneration = () => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  generating.value = false;
};

/** 开始流式生成 */
const startGeneration = () => {
  generating.value = true;
  streamOutput.value = '';
  presetQuestionsList.value = [];
  chatMessages.value = [];

  abortController = genAgentMetaStream(
    userDesc.value,
    (msg) => {
      if (msg.c) {
        streamOutput.value += msg.c;
      }
    },
    (err) => {
      modal.msgError('AI 生成配置失败：' + (err.message || err));
      generating.value = false;
    },
    () => {
      generating.value = false;
    }
  );
};

/** 新增预设问题行 */
const addPresetQuestion = () => {
  presetQuestionsList.value.push('');
};

/** 移除指定预设问题行 */
const removePresetQuestion = (index: number) => {
  presetQuestionsList.value.splice(index, 1);
};

/** 容错解析 JSON */
const parseMetaJson = (text: string): any => {
  const cleanText = text.trim();
  if (!cleanText) return null;

  try {
    return JSON.parse(cleanText);
  } catch {
    let candidate = cleanText;
    if (candidate.includes('```')) {
      const match = candidate.match(/```(?:json)?([\s\S]*?)```/);
      if (match) {
        candidate = match[1].trim();
      }
    }

    try {
      return JSON.parse(candidate);
    } catch {
      try {
        const fixedCandidate = candidate.replace(/"([^"]*)"/g, (match, p1) => {
          return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
        });
        return JSON.parse(fixedCandidate);
      } catch {
      }

      const start = candidate.indexOf('{');
      const end = candidate.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        const subCandidate = candidate.substring(start, end + 1);
        try {
          return JSON.parse(subCandidate);
        } catch {
          try {
            const fixedSub = subCandidate.replace(/"([^"]*)"/g, (match, p1) => {
              return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
            });
            return JSON.parse(fixedSub);
          } catch {
          }
        }
      }

      // 兜底纯文本正则匹配
      const parseFallbackText = (rawStr: string): any => {
        const result: any = {};
        const patterns = {
          name: /(?:名称|Title|Name)\s*[:：]\s*(.+)/i,
          description: /(?:描述|Description|Desc)\s*[:：]\s*(.+)/i,
          systemPrompt: /(?:系统提示词|Prompt|Instruction)\s*[:：]\s*(.+)/i,
          greeting: /(?:问候语|Greeting|Welcome)\s*[:：]\s*(.+)/i
        };
        for (const [key, reg] of Object.entries(patterns)) {
          const m = rawStr.match(reg);
          if (m && m[1]) result[key] = m[1].trim();
        }
        return result;
      };

      const fallbackResult = parseFallbackText(cleanText);
      if (Object.keys(fallbackResult).length > 0) {
        return fallbackResult;
      }

      throw new Error('无法解析配置信息，请检查格式是否正确');
    }
  }
};

/** 从剪贴板读取并解析元数据 */
const readClipboardAndParse = async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (!text.trim()) {
      modal.msgWarning('剪贴板内容为空，请先复制元数据！');
      return;
    }
    const meta = parseMetaJson(text);
    if (meta) {
      form.value.agentName = meta.agentName || meta.name || meta.agent_name || meta.title || '';
      form.value.description = meta.description || meta.desc || meta.description_简介 || '';
      form.value.systemPrompt =
        meta.systemPrompt || meta.prompt || meta.system_prompt || meta.system || meta.instructions || meta.instruction || '';
      form.value.greeting =
        meta.greeting || meta.welcome || meta.welcomeMsg || meta.greetings || meta.welcome_msg || '';

      let questions: string[] = [];
      if (meta.presetQuestions) {
        if (Array.isArray(meta.presetQuestions)) {
          questions = meta.presetQuestions.map(String);
        } else {
          questions = String(meta.presetQuestions).split('\n').map(q => q.trim()).filter(Boolean);
        }
      }
      presetQuestionsList.value = questions;
      modal.msgSuccess('成功从剪贴板解析并导入配置！');
      resetChat();
    }
  } catch (e: any) {
    modal.msgError('从剪贴板解析配置失败：' + e.message);
  }
};

// 监听原始元数据，实时更新并渲染下方的各个子输入框
watch(streamOutput, (newVal) => {
  if (!newVal.trim()) return;
  try {
    const meta = parseMetaJson(newVal);
    if (meta) {
      form.value.agentName = meta.agentName || meta.name || meta.agent_name || meta.title || form.value.agentName;
      form.value.description = meta.description || meta.desc || meta.description_简介 || form.value.description;
      form.value.systemPrompt =
        meta.systemPrompt || meta.prompt || meta.system_prompt || meta.system || meta.instructions || meta.instruction || form.value.systemPrompt;
      form.value.greeting =
        meta.greeting || meta.welcome || meta.welcomeMsg || meta.greetings || meta.welcome_msg || form.value.greeting;
      if (meta.presetQuestions) {
        if (Array.isArray(meta.presetQuestions)) {
          presetQuestionsList.value = meta.presetQuestions.map(String);
          form.value.presetQuestions = meta.presetQuestions.join('\n');
        } else {
          const list = String(meta.presetQuestions).split('\n').map(q => q.trim()).filter(Boolean);
          presetQuestionsList.value = list;
          form.value.presetQuestions = String(meta.presetQuestions);
        }
      }
    }
  } catch {
    // 静默忽略流式生成中的语法错误
  }
});

// 监听流式结束，触发首条问候语输出
watch(generating, (newVal) => {
  if (!newVal && form.value.greeting && chatMessages.value.length === 0) {
    chatMessages.value.push({
      role: 'assistant',
      content: form.value.greeting
    });
  }
});

/** 确保智能体已保存并获取到 ID */
const ensureAgentSaved = async (): Promise<boolean> => {
  let valid = false;
  try {
    await agentFormRef.value?.validate();
    valid = true;
  } catch {
    valid = false;
  }
  if (!valid) {
    modal.msgWarning('请先在左侧选择并完善必填字段（如关联大模型配置等）！');
    return false;
  }

  // 整理预设问题
  form.value.presetQuestions = presetQuestionsList.value.filter(q => q.trim()).join('\n');

  saveLoading.value = true;
  try {
    if (!form.value.agentId) {
      // 1. 新增智能体
      await addAgent(form.value);
      // 2. 查出刚生成的 ID
      const listRes = await listAgent({ agentName: form.value.agentName });
      const createdAgent = listRes.data?.rows?.find(row => row.agentName === form.value.agentName);
      if (!createdAgent) {
        throw new Error('智能体已保存，但未能获取到智能体ID，请稍后重试！');
      }
      form.value.agentId = createdAgent.agentId;
    } else {
      // 更新现有配置
      await updateAgent(form.value);
    }
    return true;
  } catch (e: any) {
    modal.msgError('智能体配置保存失败：' + e.message);
    return false;
  } finally {
    saveLoading.value = false;
  }
};

/** 放弃并删除 */
const handleAbandonAgent = () => {
  const agentId = form.value.agentId;
  if (!agentId) {
    cancel();
    return;
  }
  modal.confirm('确定要放弃测试并删除该智能体吗？此操作不可逆。').then(async () => {
    await delAgent(agentId);
    modal.msgSuccess('已成功删除并返回列表');
    cancel();
  }).catch(() => {
  });
};

/** 确认发布并保存 */
const handleFinishTest = async () => {
  const saved = await ensureAgentSaved();
  if (!saved) return;
  modal.msgSuccess('智能体发布成功！');
  emit('back');
};

/** 重置测试会话 */
const resetChat = () => {
  if (chatAbortController) {
    chatAbortController.abort();
    chatAbortController = null;
  }
  chatMessages.value = [];
  currentSessionId.value = undefined;
  chatSending.value = false;

  if (form.value.greeting) {
    chatMessages.value.push({
      role: 'assistant',
      content: form.value.greeting
    });
  }
};

/** 滚动对话到底部 */
const scrollToBottom = () => {
  nextTick(() => {
    if (chatScrollRef.value) {
      chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight;
    }
  });
};

/** 发送对话消息 */
const sendMessage = () => {
  if (chatSending.value) return;
  const msgText = userMessageText.value.trim();
  if (!msgText) return;

  userMessageText.value = '';
  executeChat(msgText);
};

/** 快捷点击发送预设问题 */
const sendPresetQuestion = (question: string) => {
  if (chatSending.value || !question.trim()) return;
  executeChat(question.trim());
};

/** 执行流式对话接口调用 */
const executeChat = async (text: string) => {
  // 对话发送前自动保存智能体以确保更新生效
  const saved = await ensureAgentSaved();
  if (!saved) return;

  const agentId = form.value.agentId;

  chatMessages.value.push({
    role: 'user',
    content: text
  });
  scrollToBottom();

  const assistantMsgIndex = chatMessages.value.push({
    role: 'assistant',
    content: '',
    thinking: ''
  }) - 1;

  chatSending.value = true;

  const chatBo = {
    agentId,
    sessionId: currentSessionId.value || undefined,
    userMsg: text
  } as any;

  chatAbortController = chatAgentStream(
    chatBo,
    (msg) => {
      if (msg.sId && !currentSessionId.value) {
        currentSessionId.value = msg.sId;
      }

      if (msg.t === 'THINK') {
        chatMessages.value[assistantMsgIndex].thinking = (chatMessages.value[assistantMsgIndex].thinking || '') + msg.c;
      } else if (msg.t === 'CONTENT') {
        chatMessages.value[assistantMsgIndex].content = (chatMessages.value[assistantMsgIndex].content || '') + msg.c;
      }
      scrollToBottom();
    },
    (err) => {
      chatMessages.value[assistantMsgIndex].content = `[出错了: ${err.message || err}]`;
      chatSending.value = false;
      scrollToBottom();
    },
    () => {
      chatSending.value = false;
      chatAbortController = null;
      scrollToBottom();
    }
  );
};
</script>

<style lang="scss" scoped>
.create-page-container {
  background-color: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.test-view-container {
  display: flex;
  height: calc(100vh - 180px);
  gap: 16px;
  overflow: hidden;
  box-sizing: border-box;
}

.left-panel-card {
  width: 42%;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 16px;
  }

  .panel-body-scroll {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
  }
}

.right-chat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 16px;
  }
}

.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color-page);
  margin-bottom: 12px;
}

.message {
  margin-bottom: 16px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 8px;
  word-break: break-all;
  white-space: pre-wrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  line-height: 1.5;

  &.user-bubble {
    background-color: var(--el-color-primary);
    color: #ffffff;
    border-top-right-radius: 2px;
  }

  &.assistant-bubble {
    background-color: var(--el-bg-color);
    color: var(--el-text-color-primary);
    border: 1px solid var(--el-border-color-light);
    border-top-left-radius: 2px;
  }

  &.think-bubble {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    border: 1px dashed var(--el-border-color-darker);
    border-top-left-radius: 2px;
    font-size: 13px;
    width: 80%;
  }
}

.preset-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-tag {
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    background-color: var(--el-color-info-light-9);
  }
}

.send-btn {
  height: auto;
  padding: 0 24px;
}

.w-full {
  width: 100%;
}

.mb-6 {
  margin-bottom: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.gap-2 {
  gap: 8px;
}
</style>
