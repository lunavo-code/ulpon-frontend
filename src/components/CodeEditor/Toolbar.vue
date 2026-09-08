<template>
  <div class="code-editor-toolbar flex items-center justify-between px-3 py-1.5 border-b border-solid text-xs">
    <!-- 左侧：文件名、语言标识与只读状态 -->
    <div class="flex items-center gap-2 overflow-hidden">
      <el-tag v-if="displayLanguage" size="small" effect="plain" type="primary" class="font-mono uppercase">
        {{ displayLanguage }}
      </el-tag>
      <span v-if="fileName" class="text-gray-500 truncate font-mono text-xs" :title="fileName">
        {{ fileName }}
      </span>
      <el-tag v-if="readOnly" size="small" type="info" effect="dark">只读</el-tag>
    </div>

    <!-- 右侧：快捷操作按钮 -->
    <div class="flex items-center gap-1">
      <el-tooltip content="格式化代码 (Shift+Alt+F)" placement="top">
        <el-button link size="small" :disabled="readOnly" @click="emit('format')">
          <el-icon><MagicStick /></el-icon>
          <span class="ml-1 hidden sm:inline">格式化</span>
        </el-button>
      </el-tooltip>

      <el-tooltip content="复制代码" placement="top">
        <el-button link size="small" @click="emit('copy')">
          <el-icon><DocumentCopy /></el-icon>
          <span class="ml-1 hidden sm:inline">复制</span>
        </el-button>
      </el-tooltip>

      <el-tooltip :content="isFullscreen ? '退出全屏 (Esc)' : '全屏模式'" placement="top">
        <el-button link size="small" @click="emit('toggleFullscreen')">
          <el-icon><FullScreen /></el-icon>
          <span class="ml-1 hidden sm:inline">{{ isFullscreen ? '还原' : '全屏' }}</span>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentCopy, FullScreen, MagicStick } from '@element-plus/icons-vue';

defineProps<{
  displayLanguage?: string;
  fileName?: string;
  readOnly?: boolean;
  isFullscreen?: boolean;
}>();

const emit = defineEmits<{
  (e: 'format'): void;
  (e: 'copy'): void;
  (e: 'toggleFullscreen'): void;
}>();
</script>

<style scoped>
.code-editor-toolbar {
  border-color: var(--el-border-color-lighter);
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  user-select: none;
}
</style>
