import type * as monaco from 'monaco-editor';

export interface CodeEditorProps {
  /** 绑定的代码内容 (v-model) */
  modelValue?: string;
  /**
   * 语言模式。
   * 支持 'freemarker' | 'ftl' | 'java' | 'html' | 'xml' | 'json' | 'sql' | 'typescript' | 'javascript' | 'css' | 'yaml' 等
   */
  language?: string;
  /** 文件名或完整文件路径，传入后可根据后缀自动识别 language（如 domain.java.ftl 识别为 freemarker） */
  fileName?: string;
  /** 是否只读 */
  readOnly?: boolean;
  /** 编辑器高度，支持数字（px）或字符串（如 '400px'、'100%'） */
  height?: number | string;
  /** 最小高度 */
  minHeight?: number | string;
  /** 主题：'auto' (自动跟随系统深浅色) | 'vs' | 'vs-dark' */
  theme?: 'auto' | 'vs' | 'vs-dark';
  /** 是否显示代码略缩图 (Minimap) */
  minimap?: boolean;
  /** 是否显示行号 */
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  /** 是否自动换行 */
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  /** 是否显示顶部操作栏（格式化、复制、全屏、语言标签等） */
  showToolbar?: boolean;
  /** 字体大小 */
  fontSize?: number;
  /** 透传底层 Monaco Editor 的原始 options */
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export interface CodeEditorEmits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'save', value: string): void;
  (e: 'mounted', editor: monaco.editor.IStandaloneCodeEditor): void;
}

/**
 * 根据文件名或文件路径后缀自动推断语言模式
 */
export function detectLanguageFromFilename(fileName?: string, defaultLang = 'plaintext'): string {
  if (!fileName) return defaultLang;

  const lowerName = fileName.toLowerCase();

  // 针对双后缀（如 .java.ftl, .vue.ftl, .sql.ftl）优先识别为 ftl / freemarker
  if (lowerName.endsWith('.ftl') || lowerName.endsWith('.ftlh') || lowerName.endsWith('.ftlx')) {
    return 'freemarker';
  }

  const ext = lowerName.split('.').pop() || '';
  const extMap: Record<string, string> = {
    ftl: 'freemarker',
    ftlh: 'freemarker',
    ftlx: 'freemarker',
    java: 'java',
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    mts: 'typescript',
    cts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    vue: 'html',
    html: 'html',
    htm: 'html',
    xml: 'xml',
    svg: 'xml',
    json: 'json',
    json5: 'json',
    sql: 'sql',
    css: 'css',
    scss: 'scss',
    less: 'less',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    markdown: 'markdown',
    sh: 'shell',
    bash: 'shell',
    bat: 'bat',
    cmd: 'bat',
    py: 'python',
    properties: 'ini',
    ini: 'ini'
  };

  return extMap[ext] || defaultLang;
}
