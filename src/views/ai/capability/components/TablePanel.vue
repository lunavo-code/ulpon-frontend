<template>
  <el-card shadow="hover" class="table-panel">
    <template #header>
      <div class="toolbar-shell">
        <div class="table-heading"><h3>AI能力列表</h3></div>
        <div class="toolbar-actions">
          <el-button v-hasPermi="['ai:capability:add']" type="primary" plain icon="Plus" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['ai:capability:edit']" type="success" plain icon="Edit" :disabled="single"
                     @click="handleUpdate()">
            修改
          </el-button>
          <el-button v-hasPermi="['ai:capability:remove']" type="danger" plain icon="Delete" :disabled="multiple"
                     @click="handleDelete()">
            删除
          </el-button>
          <el-button v-hasPermi="['ai:capability:export']" type="warning" plain icon="Download" @click="handleExport">
            导出
          </el-button>
          <right-toolbar :show-search="showSearch" :columns="columns" :search="false"
                         @update:show-search="handleToggleSearch" @query-table="getList"/>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" border class="data-table" :data="capabilityList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键 ID" align="center" prop="capabilityId"/>
      <el-table-column label="能力名称" align="center" prop="capabilityName"/>
      <el-table-column label="任务描述简介" align="center" prop="description"/>
      <el-table-column label="系统提示词 (System Prompt)" align="center" prop="systemPrompt" show-overflow-tooltip/>
      <el-table-column label="关联大模型配置" align="center" prop="modelConfigName"/>
      <el-table-column label="可见范围类型" align="center" prop="scopeType">
        <template #default="scope">
          <dict-tag :options="ai_agent_visibility" :value="scope.row.scopeType"/>
        </template>
      </el-table-column>
      <el-table-column label="所属部门 ID" align="center" prop="deptId"/>
      <el-table-column label="创建人用户 ID" align="center" prop="userId"/>
      <el-table-column label="启用状态" align="center" prop="status" width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="true"
            :inactive-value="false"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       v-hasPermi="['ai:capability:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       v-hasPermi="['ai:capability:remove']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList"/>
  </el-card>
</template>

<script setup name="CapabilityTablePanel" lang="ts">
import {listCapability, delCapability} from '@/api/ai/capability';
import {CapabilityVO, CapabilityQuery} from '@/api/ai/capability/types';
import {useLoading} from '@/hooks/async/useLoading';
import {useTableSelection} from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import {download as requestDownload} from '@/utils/request';
import {useDict} from '@/utils/dict';

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
      'capabilityId',
      'capabilityName',
      'description',
      'systemPrompt',
      'modelConfigId',
      'scopeType',
      'deptId',
      'userId',
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

const capabilityList = ref<CapabilityVO[]>([]);
const total = ref(0);
const {loading, withLoading} = useLoading(true);

const allColumnsMeta = [
  {prop: 'capabilityId', label: '主键 ID', index: 0},
  {prop: 'capabilityName', label: '能力名称', index: 1},
  {prop: 'description', label: '任务描述简介', index: 2},
  {prop: 'systemPrompt', label: '系统提示词 (System Prompt)', index: 3},
  {prop: 'modelConfigId', label: '关联大模型配置 ID', index: 4},
  {prop: 'scopeType', label: '可见范围类型', index: 5},
  {prop: 'deptId', label: '所属部门 ID', index: 6},
  {prop: 'userId', label: '创建人用户 ID', index: 7},
  {prop: 'status', label: '启用状态', index: 8},
  {prop: 'delFlag', label: '删除标志', index: 9},
  {prop: 'createDept', label: '创建部门', index: 10},
  {prop: 'createBy', label: '创建者', index: 11},
  {prop: 'createTime', label: '创建时间', index: 12},
  {prop: 'updateBy', label: '更新者', index: 13},
  {prop: 'updateTime', label: '更新时间', index: 14},
  {prop: 'remark', label: '备注', index: 15},
];

const {ai_agent_visibility, sys_normal_disable} = toRefs<any>(useDict('ai_agent_visibility', 'sys_normal_disable'));

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

const queryParams = reactive<CapabilityQuery>({
  pageNum: 1,
  pageSize: 10,
  capabilityId: undefined,
  capabilityName: undefined,
  description: undefined,
  systemPrompt: undefined,
  modelConfigId: undefined,
  scopeType: undefined,
  deptId: undefined,
  userId: undefined,
  status: undefined,
  delFlag: undefined,
  createDept: undefined,
  createBy: undefined,
  createTime: undefined,
  updateBy: undefined,
  updateTime: undefined,
  remark: undefined,
});


const {ids, single, multiple, handleSelectionChange} = useTableSelection<CapabilityVO>(item => item.capabilityId);

/** 查询AI能力列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
    const res = await listCapability(params);
    capabilityList.value = res.data?.rows || [];
    total.value = res.data?.total || 0;
  });
};

/** 外部应用查询过滤条件 */
const applyFilters = (filters: Partial<CapabilityQuery>) => {
  queryParams.pageNum = 1;
  // 清理先前的过滤参数，防止属性残留污染
  queryParams.capabilityName = undefined;
  queryParams.description = undefined;
  queryParams.systemPrompt = undefined;
  queryParams.modelConfigId = undefined;
  queryParams.scopeType = undefined;
  queryParams.deptId = undefined;
  queryParams.userId = undefined;
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
  const id = row?.capabilityId || ids.value[0];
  emit('edit', id);
};

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  const targetIds = row?.capabilityId ? [row.capabilityId] : ids.value;
  await modal.confirm('是否确认删除测试单编号为"' + targetIds + '"的数据项？');
  await withLoading(async () => {
    await delCapability(targetIds);
  });
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'capability/capability/export',
    {
      ...queryParams
    },
    `AI能力_Capability_${new Date().getTime()}.xlsx`
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
