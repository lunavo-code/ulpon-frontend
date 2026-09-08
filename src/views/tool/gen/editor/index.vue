<template>
  <div class="gen-template-editor-page flex flex-col h-[calc(100vh-84px)] bg-gray-50 dark:bg-dark-900 overflow-hidden">
    <!-- 顶部操作控制栏 -->
    <header class="editor-header flex items-center justify-between px-4 py-2 bg-white dark:bg-dark-800 border-b border-solid border-gray-200 dark:border-dark-600 shadow-sm shrink-0">
      <!-- 左侧：返回、标题、模板属性 -->
      <div class="flex items-center gap-3">
        <el-tooltip content="返回列表" placement="bottom">
          <el-button link :icon="ArrowLeft" @click="handleBack" />
        </el-tooltip>

        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">
            {{ form.name ? form.name : '新建模板' }}
          </span>
          <el-tag size="small" type="primary" effect="plain" class="font-mono">
            {{ form.fileName || 'template.ftl' }}
          </el-tag>
          <el-tag v-if="form.type" size="small" type="info">
            {{ form.type }}
          </el-tag>
        </div>
      </div>

      <!-- 中间：测试上下文数据表选择 -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 shrink-0">测试数据表:</span>
        <el-select
          v-model="selectedTableId"
          placeholder="选择关联测试表"
          filterable
          size="small"
          class="w-60"
          :loading="tableLoading"
          @change="handleTableChange"
        >
          <el-option
            v-for="item in tableOptions"
            :key="item.tableId"
            :label="`${item.tableName} (${item.tableComment || '无描述'})`"
            :value="item.tableId"
          />
        </el-select>
      </div>

      <!-- 右侧：解析预览、保存等动作 -->
      <div class="flex items-center gap-2">
        <el-tooltip content="解析当前模板并预览页面 (快捷键: Ctrl + Enter)" placement="bottom">
          <el-button
            type="primary"
            size="small"
            :loading="parsing"
            :icon="VideoPlay"
            @click="handleRenderPreview"
          >
            解析预览
          </el-button>
        </el-tooltip>

        <el-tooltip content="保存模板内容 (快捷键: Ctrl + S)" placement="bottom">
          <el-button
            type="success"
            size="small"
            :loading="saving"
            :icon="Check"
            @click="handleSave"
          >
            保存模板
          </el-button>
        </el-tooltip>
      </div>
    </header>

    <!-- 工作台主体：左右双栏 -->
    <main class="editor-main flex-1 flex overflow-hidden p-2 gap-2">
      <!-- 左栏：FTL 模板编辑器 -->
      <section class="editor-left-pane flex-1 flex flex-col bg-white dark:bg-dark-800 rounded border border-solid border-gray-200 dark:border-dark-600 overflow-hidden shadow-sm">
        <div class="pane-header flex items-center justify-between px-3 py-1.5 bg-gray-100/70 dark:bg-dark-700 border-b border-solid border-gray-200 dark:border-dark-600 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="font-bold text-blue-600 dark:text-blue-400">FTL TEMPLATE</span>
            <span class="text-gray-400">|</span>
            <span class="text-gray-500">{{ form.fileName || 'template.ftl' }}</span>
          </div>
          <span class="text-gray-400 text-xs">快捷键: Ctrl+Enter 解析预览, Ctrl+S 保存</span>
        </div>

        <div class="flex-1 overflow-hidden relative">
          <code-editor
            v-model="form.content"
            :file-name="form.fileName || 'template.ftl'"
            language="freemarker"
            height="100%"
            :show-toolbar="false"
            @save="handleSave"
          />
        </div>
      </section>

      <!-- 右栏：解析渲染视口 -->
      <!-- <section class="editor-right-pane flex-1 flex flex-col bg-white dark:bg-dark-800 rounded border border-solid border-gray-200 dark:border-dark-600 overflow-hidden shadow-sm">
        <div class="pane-header flex items-center justify-between px-2 bg-gray-100/70 dark:bg-dark-700 border-b border-solid border-gray-200 dark:border-dark-600">
          <el-tabs v-model="activeTab" class="preview-tabs">
            <el-tab-pane label="页面效果 (HTML)" name="html" />
            <el-tab-pane label="生成源码 (Code)" name="code" />
            <el-tab-pane label="上下文数据 (JSON)" name="json" />
          </el-tabs>

          <div class="flex items-center gap-2">
            <span v-if="renderTime" class="text-xs text-gray-400">渲染耗时: {{ renderTime }}ms</span>
            <el-button link size="small" :icon="Refresh" @click="handleRenderPreview">刷新</el-button>
          </div>
        </div>

        <div v-loading="parsing" class="flex-1 overflow-hidden relative flex flex-col">
          <div v-if="parseError" class="p-4 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900">
            <div class="flex items-center justify-between text-red-600 font-bold mb-1 text-sm">
              <span>FreeMarker 解析异常</span>
              <el-button link size="small" type="danger" @click="handleCopyError">复制错误</el-button>
            </div>
            <pre class="text-xs text-red-700 dark:text-red-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto bg-white/70 dark:bg-dark-900/70 p-2 rounded border border-red-100 dark:border-red-900/50">{{ parseError }}</pre>
          </div>
          <div v-show="activeTab === 'html'" class="flex-1 h-full w-full bg-white relative">
            <iframe
              v-if="renderedResult"
              :srcdoc="renderedResult"
              sandbox="allow-scripts allow-same-origin allow-modals"
              class="w-full h-full border-none"
            />
            <el-empty
              v-else
              description="点击「解析预览」或按 Ctrl+Enter 运行生成并预览页面"
              :image-size="100"
            />
          </div>
          <div v-show="activeTab === 'code'" class="flex-1 h-full w-full overflow-hidden">
            <code-editor
              v-if="renderedResult"
              :model-value="renderedResult"
              :file-name="deduceOutputFileName()"
              :read-only="true"
              height="100%"
            />
            <el-empty
              v-else
              description="暂无生成代码，点击「解析预览」执行渲染"
              :image-size="100"
            />
          </div>
          <div v-show="activeTab === 'json'" class="flex-1 h-full w-full overflow-hidden p-2 flex flex-col">
            <div class="text-xs text-gray-500 mb-1 flex items-center justify-between">
              <span>当前测试表注入 FreeMarker 的上下文数据模型：</span>
              <el-button link size="small" type="primary" @click="handleFormatMockJson">格式化 JSON</el-button>
            </div>
            <div class="flex-1 overflow-hidden border rounded border-gray-200 dark:border-dark-600">
              <code-editor
                v-model="mockDataJson"
                language="json"
                height="100%"
                :show-toolbar="false"
              />
            </div>
          </div>
        </div>
      </section> -->
    </main>
  </div>
</template>

<script setup name="GenTemplateEditor" lang="ts">
import { ArrowLeft, Check, Refresh, VideoPlay } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getGenTable, listTable } from '@/api/tool/gen';
import { addTemplate, getTemplate, renderTemplate, updateTemplate } from '@/api/tool/gen/template';
import type { TemplateForm } from '@/api/tool/gen/template/types';
import type { TableVO } from '@/api/tool/gen/types';

const route = useRoute();
const router = useRouter();

// 模板表单数据
const form = ref<TemplateForm>({
  id: undefined,
  name: '用户信息展示页面',
  fileName: 'user_detail.vue.ftl',
  type: 'frontend-vue',
  content: `<#-- 示例：FreeMarker 页面模板 -->`
});

// 测试数据表列表
const tableOptions = ref<TableVO[]>([]);
const tableLoading = ref(false);
const selectedTableId = ref<string | number>();

// 渲染与交互状态
const parsing = ref(false);
const saving = ref(false);
const activeTab = ref('html');
const renderedResult = ref('');
const renderTime = ref(0);
const parseError = ref('');

// 模拟上下文 JSON
const mockDataJson = ref('');

// 初始化加载测试数据表列表
const loadTableOptions = async () => {
  tableLoading.value = true;
  try {
    const res = await listTable({ pageNum: 1, pageSize: 50, tableName: '', tableComment: '', dataName: '' });
    tableOptions.value = res.rows || [];
    if (tableOptions.value.length > 0 && !selectedTableId.value) {
      selectedTableId.value = tableOptions.value[0].tableId;
      await handleTableChange(selectedTableId.value);
    }
  } catch (err: any) {
    console.error('加载测试数据表列表失败', err);
  } finally {
    tableLoading.value = false;
  }
};

// 切换测试数据表，生成/更新模拟上下文
const handleTableChange = async (tableId: string | number) => {
  try {
    const res = await getGenTable(tableId);
    const tableInfo = res.data?.info || {};
    const columns = res.data?.rows || [];

    const mockObj = {
      table: {
        tableName: tableInfo.tableName || 'sys_demo',
        tableComment: tableInfo.tableComment || '示例数据表',
        className: tableInfo.className || 'SysDemo',
        moduleName: tableInfo.moduleName || 'system',
        businessName: tableInfo.businessName || 'demo',
        packageName: tableInfo.packageName || 'com.ulpon.system'
      },
      columns: columns.map((c: any) => ({
        columnName: c.columnName,
        columnComment: c.columnComment || c.columnName,
        columnType: c.columnType,
        javaType: c.javaType || 'String',
        javaField: c.javaField || c.columnName,
        isPk: c.isPk === '1'
      }))
    };

    mockDataJson.value = JSON.stringify(mockObj, null, 2);
  } catch (err: any) {
    console.error('获取表结构详情失败', err);
  }
};

// 格式化模拟 JSON
const handleFormatMockJson = () => {
  try {
    const parsed = JSON.parse(mockDataJson.value);
    mockDataJson.value = JSON.stringify(parsed, null, 2);
    ElMessage.success('JSON 已格式化');
  } catch {
    ElMessage.error('JSON 格式有误，无法格式化');
  }
};

// 构造输出文件名
const deduceOutputFileName = () => {
  const tplName = form.value.fileName || '';
  if (tplName.endsWith('.ftl')) {
    return tplName.slice(0, -4);
  }
  return 'rendered_output.html';
};

// 执行解析预览
const handleRenderPreview = async () => {
  if (!form.value.content) {
    ElMessage.warning('模板内容不能为空');
    return;
  }

  parsing.value = true;
  parseError.value = '';
  const startTime = Date.now();

  let parsedContext: Record<string, any> = {};
  try {
    if (mockDataJson.value) {
      parsedContext = JSON.parse(mockDataJson.value);
    }
  } catch {
    ElMessage.warning('模拟数据 JSON 解析有误，将使用基础上下文');
  }

  try {
    // 优先调用后端 FreeMarker 解析接口
    const res = await renderTemplate({
      content: form.value.content,
      tableId: selectedTableId.value,
      params: parsedContext
    });

    console.log('后端渲染结果', res);

    renderedResult.value = typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2);
    renderTime.value = Date.now() - startTime;
  } catch (err: any) {
    // 若后端接口未部署 (404)，提供高可用客户端轻量渲染降级，确保前端流畅可用
    if (err?.response?.status === 404) {
      renderedResult.value = fallbackClientRender(form.value.content, parsedContext);
      renderTime.value = Date.now() - startTime;
      ElMessage.info('提示：后端 /gen/template/render 暂未就绪，当前使用前端智能渲染引擎预览');
    } else {
      parseError.value = err?.response?.data?.msg || err?.message || 'FreeMarker 渲染失败';
      ElMessage.error('模板解析失败，请查看下方诊断信息');
    }
  } finally {
    parsing.value = false;
  }
};

// 客户端简易 Fallback 渲染引擎（用于后端接口未就绪时的无缝演示与基础预览）
const fallbackClientRender = (templateStr: string, context: Record<string, any>) => {
  let result = templateStr;
  const table = context.table || {};
  const columns = context.columns || [];

  // 基础替换 ${table.xxx}
  result = result.replace(/\$\{table\.(\w+)(?:\|\|[^}]+)?\}/g, (_, key) => table[key] || '');

  // 匹配 <#list columns as col> ... </#list>
  const listRegex = /<#list\s+columns\s+as\s+(\w+)>([\s\S]*?)<\/#list>/g;
  result = result.replace(listRegex, (_, varName, body) => {
    return columns
      .map((col: any) => {
        let rowHtml = body;
        const colRegex = new RegExp(`\\$\\{${varName}\\.(\\w+)(?:\\?string\\(([^)]+)\\))?\\}`, 'g');
        rowHtml = rowHtml.replace(colRegex, (__: string, prop: string, boolFmt: string) => {
          const val = col[prop];
          if (boolFmt && typeof val === 'boolean') {
            const [trueStr, falseStr] = boolFmt.split(',').map((s: string) => s.trim().replace(/['"]/g, ''));
            return val ? trueStr : falseStr;
          }
          return val !== undefined ? String(val) : '';
        });
        return rowHtml;
      })
      .join('');
  });

  return result;
};

// 复制错误信息
const handleCopyError = async () => {
  if (!parseError.value) return;
  await navigator.clipboard.writeText(parseError.value);
  ElMessage.success('错误信息已复制到剪贴板');
};

// 保存模板
const handleSave = async () => {
  saving.value = true;
  try {
    if (form.value.id) {
      await updateTemplate(form.value);
      ElMessage.success('模板修改成功');
    } else {
      await addTemplate(form.value);
      ElMessage.success('模板创建成功');
    }
  } catch (err: any) {
    ElMessage.error(err.msg || '保存模板失败');
  } finally {
    saving.value = false;
  }
};

// 返回上一级
const handleBack = () => {
  router.back();
};

// 监听全局快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    handleRenderPreview();
  }
};

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);

  // 加载路由模板数据
  const templateId = (route.query.id || route.params.id) as string;
  if (templateId) {
    try {
      const res = await getTemplate(templateId);
      if (res.data) {
        form.value = { ...res.data };
      }
    } catch (err: any) {
      ElMessage.error('加载模板详情失败');
    }
  }

  // 加载测试数据表
  await loadTableOptions();

  // 初始自动执行一次预览
  if (form.value.content) {
    handleRenderPreview();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.preview-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  border-bottom: none;
}
.preview-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 0;
}
</style>
