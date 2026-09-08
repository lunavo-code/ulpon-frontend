<template>
  <div
    ref="wrapperRef"
    class="code-editor-wrapper relative flex flex-col border border-solid overflow-hidden"
    :class="{ 'code-editor-fullscreen': isFullscreen }"
    :style="wrapperStyle"
  >
    <!-- 顶部操作栏 -->
    <Toolbar
      v-if="showToolbar"
      :display-language="resolvedLanguage"
      :file-name="fileName"
      :read-only="readOnly"
      :is-fullscreen="isFullscreen"
      @format="handleFormat"
      @copy="handleCopy"
      @toggle-fullscreen="toggleFullscreen"
    />

    <!-- Monaco 容器 -->
    <div ref="containerRef" class="code-editor-container flex-1 w-full" />
  </div>
</template>

<script setup lang="ts">
import { useDark, useResizeObserver } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import type * as monacoType from 'monaco-editor';
import { initMonaco } from './monaco';
import Toolbar from './Toolbar.vue';
import { type CodeEditorEmits, type CodeEditorProps, detectLanguageFromFilename } from './types';

const props = withDefaults(defineProps<CodeEditorProps>(), {
  modelValue: '',
  language: '',
  fileName: '',
  readOnly: false,
  height: 400,
  minHeight: 200,
  theme: 'auto',
  minimap: true,
  lineNumbers: 'on',
  wordWrap: 'on',
  showToolbar: true,
  fontSize: 13,
  options: () => ({})
});

const emit = defineEmits<CodeEditorEmits>();

const wrapperRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const isFullscreen = ref(false);

let monaco: typeof monacoType;
let editor: monacoType.editor.IStandaloneCodeEditor | null = null;
let isUpdatingModel = false;

// 监听系统深色模式（与项目 settings 保持一致的 storageKey）
const isDark = useDark({ storageKey: 'useDarkKey' });

// 实际解析出的语言标识
const resolvedLanguage = computed(() => {
  if (props.language) {
    const lang = props.language.toLowerCase();
    return lang === 'ftl' ? 'freemarker' : lang;
  }
  return detectLanguageFromFilename(props.fileName, 'plaintext');
});

// 计算当前主题
const currentTheme = computed(() => {
  if (props.theme && props.theme !== 'auto') {
    return props.theme;
  }
  return isDark.value ? 'ftl-vs-dark' : 'ftl-vs';
});

// 计算容器样式
const wrapperStyle = computed(() => {
  if (isFullscreen.value) {
    return {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 3000
    };
  }

  const style: Record<string, string> = {};
  if (props.minHeight) {
    style.minHeight = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight;
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }
  return style;
});

// 初始化 Monaco 编辑器
const initEditor = () => {
  if (!containerRef.value) return;

  monaco = initMonaco();

  const editorOptions: monacoType.editor.IStandaloneEditorConstructionOptions = {
    value: props.modelValue,
    language: resolvedLanguage.value,
    theme: currentTheme.value,
    readOnly: props.readOnly,
    fontSize: props.fontSize,
    tabSize: 2,
    automaticLayout: false, // 由 ResizeObserver 主动触发布局，性能更优
    scrollBeyondLastLine: false,
    lineNumbers: props.lineNumbers,
    wordWrap: props.wordWrap,
    minimap: {
      enabled: props.minimap
    },
    folding: true,
    renderLineHighlight: 'all',
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 9,
      horizontalScrollbarSize: 9
    },
    ...props.options
  };

  editor = monaco.editor.create(containerRef.value, editorOptions);

  // 监听内容输入
  editor.onDidChangeModelContent(() => {
    if (isUpdatingModel) return;
    const value = editor?.getValue() ?? '';
    emit('update:modelValue', value);
    emit('change', value);
  });

  // 绑定 Ctrl+S / Cmd+S 快捷键触发保存事件
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    const val = editor?.getValue() ?? '';
    emit('save', val);
  });

  emit('mounted', editor);
};

// 格式化当前文档
const handleFormat = () => {
  if (!editor) return;
  editor.getAction('editor.action.formatDocument')?.run();
};

// 复制编辑器内容
const handleCopy = async () => {
  if (!editor) return;
  const val = editor.getValue();
  try {
    await navigator.clipboard.writeText(val);
    ElMessage.success('代码已成功复制到剪贴板');
  } catch {
    ElMessage.error('复制失败，请手动选中复制');
  }
};

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => {
    editor?.layout();
  });
};

// 监听 Esc 退出全屏
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false;
    nextTick(() => {
      editor?.layout();
    });
  }
};

// 容器尺寸响应式重绘
useResizeObserver(wrapperRef, () => {
  editor?.layout();
});

// 监听外部 modelValue 变更
watch(
  () => props.modelValue,
  newVal => {
    if (!editor) return;
    if (newVal !== editor.getValue()) {
      isUpdatingModel = true;
      const position = editor.getPosition();
      editor.setValue(newVal ?? '');
      if (position) {
        editor.setPosition(position);
      }
      isUpdatingModel = false;
    }
  }
);

// 监听语言变化
watch(resolvedLanguage, newLang => {
  if (!editor) return;
  const model = editor.getModel();
  if (model) {
    monaco.editor.setModelLanguage(model, newLang);
  }
});

// 监听主题变化
watch(currentTheme, newTheme => {
  if (editor) {
    monaco.editor.setTheme(newTheme);
  }
});

// 监听只读状态变更
watch(
  () => props.readOnly,
  val => {
    editor?.updateOptions({ readOnly: val });
  }
);

// 监听缩略图配置
watch(
  () => props.minimap,
  val => {
    editor?.updateOptions({ minimap: { enabled: val } });
  }
);

onMounted(() => {
  initEditor();
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (editor) {
    editor.dispose();
    editor = null;
  }
});

// 暴露常用实例与方法供父组件 ref 调用
defineExpose({
  getEditor: () => editor,
  getMonaco: () => monaco,
  format: handleFormat,
  toggleFullscreen
});
</script>

<style scoped>
.code-editor-wrapper {
  border-color: var(--el-border-color-lighter);
  border-radius: 4px;
  background-color: var(--el-bg-color);
  box-sizing: border-box;
}

.code-editor-fullscreen {
  border-radius: 0;
}
</style>
