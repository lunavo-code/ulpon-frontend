<template>
  <el-card shadow="hover" class="table-panel">
    <template #header>
      <div class="toolbar-shell">
        <div class="table-heading"><h3>智能体列表</h3></div>
        <div class="toolbar-actions">
          <el-button v-hasPermi="['ai:agent:add']" type="primary" plain icon="Plus" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['ai:agent:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()">
            修改
          </el-button>
          <el-button v-hasPermi="['ai:agent:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">
            删除
          </el-button>
          <el-button v-hasPermi="['ai:agent:export']" type="warning" plain icon="Download" @click="handleExport">
            导出
          </el-button>
          <right-toolbar :show-search="showSearch" :columns="columns" :search="false" @update:show-search="handleToggleSearch" @query-table="getList"/>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" border class="data-table" :data="agentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键 ID" align="center" prop="agentId"/>
      <el-table-column label="智能体名称" align="center" prop="agentName"/>
      <el-table-column label="智能体头像" align="center" prop="avatarUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.avatarUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="智能体描述简介" align="center" prop="description" show-overflow-tooltip/>
      <el-table-column label="系统提示词 (System Prompt)" align="center" prop="systemPrompt" show-overflow-tooltip/>
      <el-table-column label="关联大模型配置 ID" align="center" prop="modelConfigId"/>
      <el-table-column label="启用知识库" align="center" prop="kbEnabled" width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.kbEnabled"
            :active-value="true"
            :inactive-value="false"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="关联知识库 ID" align="center" prop="kbId"/>
      <el-table-column label="启用联网检索" align="center" prop="searchEnabled" width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.searchEnabled"
            :active-value="true"
            :inactive-value="false"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="启用聊天记忆" align="center" prop="memoryEnabled" width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.memoryEnabled"
            :active-value="true"
            :inactive-value="false"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="记忆窗口长度" align="center" prop="memoryWindow"/>
      <el-table-column label="问候语" align="center" prop="greeting" show-overflow-tooltip/>
      <el-table-column label="预设问题" align="center" prop="presetQuestions" show-overflow-tooltip/>
      <el-table-column label="可见范围类型" align="center" prop="scopeType">
        <template #default="scope">
          <dict-tag :options="ai_agent_visibility" :value="scope.row.scopeType"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="120">
        <template #default="scope">
          <dict-tag :options="ai_agent_status" :value="scope.row.status"/>
        </template>
<!--        <template #default="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.status"-->
<!--            :active-value="true"-->
<!--            :inactive-value="false"-->
<!--            disabled-->
<!--          />-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ai:agent:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ai:agent:remove']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList"/>
  </el-card>
</template>

<script setup name="AgentTablePanel" lang="ts">
import {listAgent, delAgent} from '@/api/ai/agent';
import {AgentVO, AgentQuery} from '@/api/ai/agent/types';
import {useLoading} from '@/hooks/async/useLoading';
import {useTableSelection} from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import {download as requestDownload} from '@/utils/request';
import {useDict} from '@/utils/dict';

const { ai_agent_status } = toRefs<any>(useDict('ai_agent_status'));

// 扩展字段属性接口
interface TableFieldOption extends FieldOption {
  prop: string;
}

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  visibleColumns: {
    type: Array as () => string[],
    default: () => [
      'agentId',
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
      'remark',
    ]
  }
});

const emit = defineEmits([
  'update:showSearch',
  'add',
  'edit'
]);

const agentList = ref<AgentVO[]>([]);
const total = ref(0);
const {loading, withLoading} = useLoading(true);

const allColumnsMeta = [
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

const {ai_agent_visibility} = toRefs<any>(useDict('ai_agent_visibility'));

// 用于 right-toolbar 显隐列勾选框的数据源
const columns = ref<TableFieldOption[]>([]);

// 监听可见列配置的变化，动态生成列显隐信息及其显示顺序
watch(
  () => props.visibleColumns,
  (newVal) => {
    columns.value = newVal
      .map((name, index) => {
        const meta = allColumnsMeta.find(col => col.prop === name);
        return meta ? {key: index, label: meta.label, visible: true, prop: meta.prop} : null;
      })
      .filter((col): col is TableFieldOption => !!col);
  },
  {immediate: true}
);

// 过滤出当前显示的可视列
const visibleColumnsList = computed(() => {
  return columns.value.filter(col => col.visible);
});

const queryParams = reactive<AgentQuery>({
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


const {ids, single, multiple, handleSelectionChange} = useTableSelection<AgentVO>(item => item.agentId);

/** 查询智能体列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
    const res = await listAgent(params);
    agentList.value = res.data?.rows || [];
    total.value = res.data?.total || 0;
  });
};

/** 外部应用查询过滤条件 */
const applyFilters = (filters: Partial<AgentQuery>) => {
  queryParams.pageNum = 1;
  // 清理先前的过滤参数，防止属性残留污染
  queryParams.agentName = undefined;
  queryParams.avatar = undefined;
  queryParams.description = undefined;
  queryParams.systemPrompt = undefined;
  queryParams.modelConfigId = undefined;
  queryParams.kbEnabled = undefined;
  queryParams.kbId = undefined;
  queryParams.searchEnabled = undefined;
  queryParams.memoryEnabled = undefined;
  queryParams.memoryWindow = undefined;
  queryParams.greeting = undefined;
  queryParams.presetQuestions = undefined;
  queryParams.scopeType = undefined;
  queryParams.status = undefined;
  // 动态合并最新的过滤条件
  Object.assign(queryParams, filters);
  getList();
};

/** 外部指示刷新列表 */
const refresh = () => {
  getList();
};

const handleToggleSearch = (val: boolean) => {
  emit('update:showSearch', val);
};

const handleAdd = () => {
  emit('add');
};

const handleUpdate = (row?: any) => {
  const id = row?.agentId || ids.value[0];
  emit('edit', id);
};

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  const targetIds = row?.agentId ? [row.agentId] : ids.value;
  await modal.confirm('是否确认删除测试单编号为"' + targetIds + '"的数据项？');
  await withLoading(async () => {
    await delAgent(targetIds);
  });
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'agent/agent/export',
    {
      ...queryParams
    },
    `智能体_Agent_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});

defineExpose({
  applyFilters,
  refresh
});
</script>
