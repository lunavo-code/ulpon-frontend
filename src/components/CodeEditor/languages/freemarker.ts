import type * as monacoType from 'monaco-editor';

/**
 * FreeMarker (FTL) 语言注册配置
 */
export function registerFreeMarkerLanguage(monaco: typeof monacoType) {
  const languageId = 'freemarker';

  // 避免重复注册
  const registered = monaco.languages.getLanguages().some(lang => lang.id === languageId);
  if (registered) return;

  // 1. 注册语言 ID 与扩展名
  monaco.languages.register({
    id: languageId,
    extensions: ['.ftl', '.ftlh', '.ftlx'],
    aliases: ['FreeMarker', 'freemarker', 'ftl'],
    mimetypes: ['text/x-freemarker']
  });

  // 2. 语言配置（注释、括号、自动闭合）
  monaco.languages.setLanguageConfiguration(languageId, {
    comments: {
      blockComment: ['<#--', '-->']
    },
    brackets: [
      ['<#', '>'],
      ['</#', '>'],
      ['<@', '>'],
      ['</@', '>'],
      ['[#', ']'],
      ['[/#', ']'],
      ['[#--', '--]'],
      ['${', '}'],
      ['#{', '}'],
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] },
      { open: "'", close: "'", notIn: ['string'] },
      { open: '${', close: '}' },
      { open: '<#--', close: ' --> ' }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '${', close: '}' },
      { open: '<', close: '>' }
    ],
    folding: {
      markers: {
        start: new RegExp('^\\s*<#(?:if|list|macro|function|switch|attempt|items)\\b'),
        end: new RegExp('^\\s*</#(?:if|list|macro|function|switch|attempt|items)>')
      }
    }
  });

  // 3. Monarch 词法高亮规则
  monaco.languages.setMonarchTokensProvider(languageId, {
    defaultToken: '',
    tokenPostfix: '.ftl',

    keywords: [
      'if',
      'else',
      'elseif',
      'list',
      'as',
      'items',
      'sep',
      'break',
      'continue',
      'switch',
      'case',
      'default',
      'macro',
      'function',
      'return',
      'assign',
      'local',
      'global',
      'include',
      'import',
      'attempt',
      'recover',
      'noparse',
      'stop',
      'setting',
      'flush',
      'visit',
      'recurse',
      'fallback',
      'nested',
      'in',
      'using'
    ],

    builtins: [
      'cap_first',
      'uncap_first',
      'capitalize',
      'lower_case',
      'upper_case',
      'trim',
      'length',
      'size',
      'string',
      'number',
      'boolean',
      'date',
      'time',
      'datetime',
      'has_content',
      'eval',
      'is_string',
      'is_number',
      'is_boolean',
      'is_date',
      'is_enumerable',
      'is_hash',
      'is_sequence',
      'default',
      'replace',
      'split',
      'starts_with',
      'ends_with',
      'index_of',
      'last_index_of',
      'seq_contains',
      'seq_index_of',
      'seq_last_index_of',
      'sort',
      'sort_by',
      'reverse',
      'join',
      'keys',
      'values',
      'round',
      'floor',
      'ceiling'
    ],

    operators: ['==', '!=', '<=', '>=', '<', '>', '=', '&&', '||', '!', '+', '-', '*', '/', '%', '..', '..<', '??', '?'],

    tokenizer: {
      root: [
        // FTL 注释: <#-- ... --> 或 [#-- ... --]
        [/<#--/, 'comment.ftl', '@commentFtlAngle'],
        [/\[#--/, 'comment.ftl', '@commentFtlSquare'],

        // FTL 插值表达式: ${...} 或 #{...}
        [/\$\{/, { token: 'delimiter.interpolation', next: '@interpolation' }],
        [/#\{/, { token: 'delimiter.interpolation', next: '@interpolation' }],

        // FTL 指令标签: <#...>, </#...>, [#...], [/#...]
        [/<\/#[a-zA-Z_]\w*>/, 'keyword.directive.end'],
        [/<#([a-zA-Z_]\w*)/, { token: 'keyword.directive.start', next: '@ftlDirective' }],
        [/\[\/#[a-zA-Z_]\w*\]/, 'keyword.directive.end'],
        [/\[#([a-zA-Z_]\w*)/, { token: 'keyword.directive.start', next: '@ftlDirectiveSquare' }],

        // FTL 宏调用标签: <@...>, </@...>, [@...], [/@...]
        [/<\/@[a-zA-Z_][\w.:]*>/, 'tag.macro.end'],
        [/<@([a-zA-Z_][\w.:]*)/, { token: 'tag.macro.start', next: '@ftlMacro' }],
        [/\[\/@[a-zA-Z_][\w.:]*\]/, 'tag.macro.end'],
        [/\[@([a-zA-Z_][\w.:]*)/, { token: 'tag.macro.start', next: '@ftlMacroSquare' }],

        // 常规 HTML/XML 标签（因为 FTL 模板常为 HTML / XML / Vue 代码）
        [/<\/?[a-zA-Z_][\w-]*\b/, 'tag'],
        [/>/, 'tag'],
        [/\/>/, 'tag'],

        // 字符串
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],

        // 数字
        [/\b\d+(\.\d+)?\b/, 'number'],

        // 空白与其它字符
        [/\s+/, 'white'],
        [/[{}[\]()]/, '@brackets'],
        [/[a-zA-Z_]\w*/, 'identifier']
      ],

      // FTL 尖括号注释
      commentFtlAngle: [
        [/-->/, 'comment.ftl', '@pop'],
        [/./, 'comment.ftl']
      ],

      // FTL 方括号注释
      commentFtlSquare: [
        [/--\]/, 'comment.ftl', '@pop'],
        [/./, 'comment.ftl']
      ],

      // FTL 插值内容: ${ ... }
      interpolation: [
        [/\}/, { token: 'delimiter.interpolation', next: '@pop' }],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/\?\b[a-zA-Z_]\w*\b/, 'variable.builtin'], // 内建函数 ?cap_first
        [/\b(true|false|null)\b/, 'keyword'],
        [/\b\d+(\.\d+)?\b/, 'number'],
        [/[a-zA-Z_]\w*/, 'variable.parameter'],
        [/==|!=|<=|>=|<|>|&&|\|\||!|\+|-|\*|\/|%|\?\?|\?/, 'operator'],
        [/\s+/, 'white']
      ],

      // FTL 尖括号指令内部: <#list items as item>
      ftlDirective: [
        [/>/, { token: 'keyword.directive.start', next: '@pop' }],
        [/\/>/, { token: 'keyword.directive.start', next: '@pop' }],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/\b(as|in|using|true|false)\b/, 'keyword'],
        [/\?\b[a-zA-Z_]\w*\b/, 'variable.builtin'],
        [/\b\d+(\.\d+)?\b/, 'number'],
        [/[a-zA-Z_]\w*/, 'attribute.name'],
        [/=/, 'delimiter'],
        [/\s+/, 'white']
      ],

      // FTL 方括号指令内部: [#list items as item]
      ftlDirectiveSquare: [
        [/\]/, { token: 'keyword.directive.start', next: '@pop' }],
        [/\[/, 'delimiter'],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/\b(as|in|using|true|false)\b/, 'keyword'],
        [/\b\d+(\.\d+)?\b/, 'number'],
        [/[a-zA-Z_]\w*/, 'attribute.name'],
        [/\s+/, 'white']
      ],

      // FTL 宏调用内部: <@myMacro param="value">
      ftlMacro: [
        [/>/, { token: 'tag.macro.start', next: '@pop' }],
        [/\/>/, { token: 'tag.macro.start', next: '@pop' }],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/[a-zA-Z_]\w*/, 'attribute.name'],
        [/=/, 'delimiter'],
        [/\s+/, 'white']
      ],

      // FTL 方括号宏调用
      ftlMacroSquare: [
        [/\]/, { token: 'tag.macro.start', next: '@pop' }],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/[a-zA-Z_]\w*/, 'attribute.name'],
        [/=/, 'delimiter'],
        [/\s+/, 'white']
      ]
    }
  });

  // 4. 注册 FreeMarker 常用指令补全提示
  monaco.languages.registerCompletionItemProvider(languageId, {
    triggerCharacters: ['<', '#', '@', '$', '{', '.'],
    provideCompletionItems: (model, position) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const textUntilPosition = lineContent.substring(0, position.column - 1);

      const suggestions: monacoType.languages.CompletionItem[] = [];

      // 提示常用的 FreeMarker 指令结构
      if (textUntilPosition.endsWith('<#') || textUntilPosition.endsWith('<')) {
        const directives = [
          {
            label: 'if',
            insertText: 'if ${1:condition}>\n\t$0\n</#if>',
            detail: 'FreeMarker if 条件判断'
          },
          {
            label: 'list',
            insertText: 'list ${1:items} as ${2:item}>\n\t$0\n</#list>',
            detail: 'FreeMarker list 遍历循环'
          },
          {
            label: 'assign',
            insertText: 'assign ${1:varName} = ${2:value} />',
            detail: 'FreeMarker 局部变量赋值'
          },
          {
            label: 'macro',
            insertText: 'macro ${1:macroName} ${2:params}>\n\t$0\n</#macro>',
            detail: 'FreeMarker 宏定义'
          },
          {
            label: 'include',
            insertText: 'include "${1:template.ftl}" />',
            detail: 'FreeMarker 引入外部模板'
          },
          {
            label: 'switch',
            insertText: 'switch ${1:expression}>\n\t<#case ${2:value}>\n\t\t$0\n\t\t<#break>\n\t<#default>\n</#switch>',
            detail: 'FreeMarker switch-case 分支'
          },
          {
            label: 'comment',
            insertText: '-- ${1:注释内容} -->',
            detail: 'FreeMarker 模板注释'
          }
        ];

        directives.forEach(item => {
          suggestions.push({
            label: item.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: item.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: item.detail,
            range: undefined as any
          });
        });
      }

      return { suggestions };
    }
  });
}
