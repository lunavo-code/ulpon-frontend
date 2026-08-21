<template>
  <div class="search-wrap">
    <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
      <template #header>
        <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
          <div><h3>筛选条件</h3></div>
        </div>
      </template>
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
        <el-form-item label="智能体名称" prop="agentName">
          <el-input v-model="queryParams.agentName" placeholder="请输入智能体名称" clearable @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="智能体描述简介" prop="description">
          <el-input v-model="queryParams.description" placeholder="请输入智能体描述简介" clearable @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="系统提示词 (System Prompt)" prop="systemPrompt">
          <el-input v-model="queryParams.systemPrompt" placeholder="请输入系统提示词 (System Prompt)" clearable @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="关联大模型配置 ID" prop="modelConfigId">
          <el-input-number v-model="queryParams.modelConfigId" controls-position="right"/>
        </el-form-item>
        <el-form-item label="启用知识库" prop="kbEnabled">
          <el-select v-model="queryParams.kbEnabled" placeholder="请选择启用知识库" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="关联知识库 ID" prop="kbId">
          <el-input-number v-model="queryParams.kbId" controls-position="right"/>
        </el-form-item>
        <el-form-item label="启用联网检索" prop="searchEnabled">
          <el-select v-model="queryParams.searchEnabled" placeholder="请选择启用联网检索" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="启用聊天记忆" prop="memoryEnabled">
          <el-select v-model="queryParams.memoryEnabled" placeholder="请选择启用聊天记忆" clearable>
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="记忆窗口长度" prop="memoryWindow">
          <el-input-number v-model="queryParams.memoryWindow" controls-position="right"/>
        </el-form-item>
        <el-form-item label="问候语" prop="greeting">
          <el-input v-model="queryParams.greeting" placeholder="请输入问候语" clearable @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="预设问题" prop="presetQuestions">
          <el-input v-model="queryParams.presetQuestions" placeholder="请输入预设问题" clearable @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="可见范围类型" prop="scopeType">
          <el-select v-model="queryParams.scopeType" placeholder="请选择可见范围类型" clearable>
            <el-option v-for="dict in ai_agent_visibility" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable>
            <el-option label="是" :value="true"/>
            <el-option label="否" :value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup name="AgentSearchPanel" lang="ts">
import {ElForm} from 'element-plus';
import {AgentQuery} from '@/api/ai/agent/types';
import {useSearchReset} from '@/hooks/form/useSearchReset';
import {useDict} from '@/utils/dict';

type ElFormInstance = InstanceType<typeof ElForm>;

const {ys_normal_disable, ai_agent_visibility} = toRefs<any>(useDict('sys_normal_disable', 'ai_agent_visibility'));

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  fields: {
    type: Array as () => string[],
    default: () => [
      'agentName',
      'avatar',
      'description',
      'systemPrompt',
      'modelConfigId',
      'kbEnabled',
      'kbId',
      'searchEnabled',
      'memoryEnabled',
      'memoryWindow',
      'greeting',
      'presetQuestions',
      'scopeType',
      'status',
    ]
  }
});

const emit = defineEmits(['update:showSearch', 'search']);

const queryFormRef = ref<ElFormInstance>();
const queryParams = ref<AgentQuery>({
  pageNum: 1,
  pageSize: 10,
  agentId: undefined,
  agentName: undefined,
  avatar: undefined,
  description: undefined,
  systemPrompt: undefined,
  modelConfigId: undefined,
  kbEnabled: undefined,
  kbId: undefined,
  searchEnabled: undefined,
  memoryEnabled: undefined,
  memoryWindow: undefined,
  greeting: undefined,
  presetQuestions: undefined,
  scopeType: undefined,
  status: undefined,
  delFlag: undefined,
  createDept: undefined,
  createBy: undefined,
  createTime: undefined,
  updateBy: undefined,
  updateTime: undefined,
  remark: undefined,
});

const allFields = [
  {prop: 'agentId', label: '主键 ID', index: 0},
  {prop: 'agentName', label: '智能体名称', index: 1},
  {prop: 'avatar', label: '智能体头像', index: 2},
  {prop: 'description', label: '智能体描述简介', index: 3},
  {prop: 'systemPrompt', label: '系统提示词 (System Prompt)', index: 4},
  {prop: 'modelConfigId', label: '关联大模型配置 ID', index: 5},
  {prop: 'kbEnabled', label: '启用知识库', index: 6},
  {prop: 'kbId', label: '关联知识库 ID', index: 7},
  {prop: 'searchEnabled', label: '启用联网检索', index: 8},
  {prop: 'memoryEnabled', label: '启用聊天记忆', index: 9},
  {prop: 'memoryWindow', label: '记忆窗口长度', index: 10},
  {prop: 'greeting', label: '问候语', index: 11},
  {prop: 'presetQuestions', label: '预设问题', index: 12},
  {prop: 'scopeType', label: '可见范围类型', index: 13},
  {prop: 'status', label: '启用状态', index: 14},
  {prop: 'delFlag', label: '删除标志', index: 15},
  {prop: 'createDept', label: '创建部门', index: 16},
  {prop: 'createBy', label: '创建者', index: 17},
  {prop: 'createTime', label: '创建时间', index: 18},
  {prop: 'updateBy', label: '更新者', index: 19},
  {prop: 'updateTime', label: '更新时间', index: 20},
  {prop: 'remark', label: '备注', index: 21},
];

const activeFields = computed(() => {
  return props.fields
    .map(name => allFields.find(field => field.prop === name))
    .filter((field): field is typeof allFields[number] => !!field);
});

/** 搜索按钮操作 */
const handleQuery = () => {
  emit('search', {...queryParams.value});
};

const {resetQuery} = useSearchReset({
  queryFormRef,
  queryParams,
  afterReset: handleQuery
});

const toggleSearch = () => {
  emit('update:showSearch', !props.showSearch);
};
</script>
