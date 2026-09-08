import * as monaco from 'monaco-editor';
import { registerFreeMarkerLanguage } from './languages/freemarker';

let isInitialized = false;

/**
 * 初始化 Monaco 运行环境与扩展语言
 */
export function initMonaco(): typeof monaco {
  if (isInitialized) {
    return monaco;
  }

  // 配置 Worker 线程（适配 Vite 8 与 monaco-editor 0.56+ 的 exports 规范）
  (self as any).MonacoEnvironment = {
    getWorker(_: any, label: string) {
      if (label === 'json') {
        return new Worker(
          new URL('monaco-editor/language/json/json.worker.js', import.meta.url),
          { type: 'module' }
        );
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new Worker(
          new URL('monaco-editor/language/css/css.worker.js', import.meta.url),
          { type: 'module' }
        );
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new Worker(
          new URL('monaco-editor/language/html/html.worker.js', import.meta.url),
          { type: 'module' }
        );
      }
      if (label === 'typescript' || label === 'javascript') {
        return new Worker(
          new URL('monaco-editor/language/typescript/ts.worker.js', import.meta.url),
          { type: 'module' }
        );
      }
      return new Worker(
        new URL('monaco-editor/editor/editor.worker.js', import.meta.url),
        { type: 'module' }
      );
    }
  };

  // 注册 FreeMarker (FTL) 语言
  registerFreeMarkerLanguage(monaco);

  // 定义亮色主题微调
  monaco.editor.defineTheme('ftl-vs', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword.directive.start', foreground: '9C27B0', fontStyle: 'bold' },
      { token: 'keyword.directive.end', foreground: '9C27B0', fontStyle: 'bold' },
      { token: 'tag.macro.start', foreground: '00796B', fontStyle: 'bold' },
      { token: 'tag.macro.end', foreground: '00796B', fontStyle: 'bold' },
      { token: 'delimiter.interpolation', foreground: 'E65100', fontStyle: 'bold' },
      { token: 'variable.builtin', foreground: '00838F', fontStyle: 'italic' },
      { token: 'variable.parameter', foreground: 'BF360C' },
      { token: 'comment.ftl', foreground: '607D8B', fontStyle: 'italic' }
    ],
    colors: {
      'editor.lineHighlightBackground': '#F5F7FA'
    }
  });

  // 定义暗色主题微调
  monaco.editor.defineTheme('ftl-vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.directive.start', foreground: 'CE93D8', fontStyle: 'bold' },
      { token: 'keyword.directive.end', foreground: 'CE93D8', fontStyle: 'bold' },
      { token: 'tag.macro.start', foreground: '80CBC4', fontStyle: 'bold' },
      { token: 'tag.macro.end', foreground: '80CBC4', fontStyle: 'bold' },
      { token: 'delimiter.interpolation', foreground: 'FFB74D', fontStyle: 'bold' },
      { token: 'variable.builtin', foreground: '4DD0E1', fontStyle: 'italic' },
      { token: 'variable.parameter', foreground: 'FFE082' },
      { token: 'comment.ftl', foreground: '78909C', fontStyle: 'italic' }
    ],
    colors: {
      'editor.lineHighlightBackground': '#2A2D2E'
    }
  });

  isInitialized = true;
  return monaco;
}

export { monaco };
