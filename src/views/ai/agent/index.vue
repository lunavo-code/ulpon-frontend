<template>
  <div class="p-2 app-container ai-agent-page">
    <div v-if="viewMode === 'list'">
      <!-- 筛选组件（自定义展示字段与显示顺序） -->
      <SearchPanel v-model:showSearch="showSearch" :fields="['value']" @search="handleSearch" />

      <!-- 列表及分页组件（自定义展示列与展示顺序） -->
      <TablePanel ref="tablePanelRef" v-model:showSearch="showSearch" :visible-columns="['value']"
                  @add="handleCreate" @edit="handleEdit" />

      <!-- 修改表单弹窗 -->
      <DetailDialog ref="detailDialogRef" @success="handleSaveSuccess" />
    </div>

    <!-- 新增智能体全屏向导组件 -->
    <div v-else-if="viewMode === 'create'">
      <CreatePage @back="handleCreateBack" />
    </div>
  </div>
</template>

<script setup name="Agent" lang="ts">
import { ref } from 'vue';
import SearchPanel from './components/SearchPanel.vue';
import TablePanel from './components/TablePanel.vue';
import DetailDialog from './components/DetailDialog.vue';
import CreatePage from './components/create.vue';

const tablePanelRef = ref<InstanceType<typeof TablePanel>>();
const detailDialogRef = ref<InstanceType<typeof DetailDialog>>();
const showSearch = ref(true);

// 页面视图模式：list = 列表, create = 全页面创建向导
const viewMode = ref<'list' | 'create'>('list');

/** 筛选查询 */
const handleSearch = (filters: any) => {
  tablePanelRef.value?.applyFilters(filters);
};

/** 进入创建页面操作 (AI向导) */
const handleCreate = () => {
  viewMode.value = 'create';
};

/** 修改按钮操作 (弹窗修改) */
const handleEdit = (id: number | string) => {
  detailDialogRef.value?.open(id);
};

/** 列表页保存成功后刷新 */
const handleSaveSuccess = () => {
  tablePanelRef.value?.refresh();
};

/** 从创建页面返回并刷新列表 */
const handleCreateBack = () => {
  viewMode.value = 'list';
  handleSaveSuccess();
};
</script>
