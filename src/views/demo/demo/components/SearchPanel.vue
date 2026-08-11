<template>
  <div class="search-wrap">
    <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
      <template #header>
        <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
          <div><h3>筛选条件</h3></div>
        </div>
      </template>
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
        <el-form-item
          v-for="field in activeFields"
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
        >
          <el-input
            v-model="queryParams[field.prop]"
            :placeholder="'请输入' + field.label"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup name="DemoSearchPanel" lang="ts">
import { ref, computed } from 'vue';
import { ElForm } from 'element-plus';
import { DemoQuery } from '@/api/demo/demo/types';
import { useSearchReset } from '@/hooks/form/useSearchReset';

type ElFormInstance = InstanceType<typeof ElForm>;

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  fields: {
    type: Array as () => string[],
    default: () => ['testKey', 'value']
  }
});

const emit = defineEmits(['update:showSearch', 'search']);

const queryFormRef = ref<ElFormInstance>();
const queryParams = ref<DemoQuery>({
  deptId: undefined,
  userId: undefined,
  orderNum: undefined,
  testKey: undefined,
  value: undefined,
  pageNum: 0,
  pageSize: 0
});

const allFields = [
  { prop: 'deptId', label: '部门ID' },
  { prop: 'userId', label: '用户ID' },
  { prop: 'orderNum', label: '排序号' },
  { prop: 'testKey', label: 'key键' },
  { prop: 'value', label: '值' }
];

const activeFields = computed(() => {
  const a= props.fields
    .map(name => allFields.find(field => field.prop === name))
    .filter((field): field is typeof allFields[number] => !!field);
    console.log('activeFields', a);
    return a;
});

/** 搜索按钮操作 */
const handleQuery = () => {
  emit('search', { ...queryParams.value });
};

const { resetQuery } = useSearchReset({
  queryFormRef,
  queryParams,
  afterReset: handleQuery
});

const toggleSearch = () => {
  emit('update:showSearch', !props.showSearch);
};
</script>
