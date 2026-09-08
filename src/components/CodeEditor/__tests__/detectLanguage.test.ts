import { describe, expect, it } from 'vitest';
import { detectLanguageFromFilename } from '../types';

describe('detectLanguageFromFilename', () => {
  it('should detect FTL templates correctly', () => {
    expect(detectLanguageFromFilename('domain.java.ftl')).toBe('freemarker');
    expect(detectLanguageFromFilename('index.vue.ftl')).toBe('freemarker');
    expect(detectLanguageFromFilename('mapper.xml.ftl')).toBe('freemarker');
    expect(detectLanguageFromFilename('template.ftl')).toBe('freemarker');
    expect(detectLanguageFromFilename('email.ftlh')).toBe('freemarker');
    expect(detectLanguageFromFilename('doc.ftlx')).toBe('freemarker');
  });

  it('should detect standard code languages correctly', () => {
    expect(detectLanguageFromFilename('App.vue')).toBe('html');
    expect(detectLanguageFromFilename('User.java')).toBe('java');
    expect(detectLanguageFromFilename('schema.sql')).toBe('sql');
    expect(detectLanguageFromFilename('package.json')).toBe('json');
    expect(detectLanguageFromFilename('config.yaml')).toBe('yaml');
    expect(detectLanguageFromFilename('main.ts')).toBe('typescript');
    expect(detectLanguageFromFilename('pom.xml')).toBe('xml');
  });

  it('should fallback to default language when filename is unknown or missing', () => {
    expect(detectLanguageFromFilename(undefined)).toBe('plaintext');
    expect(detectLanguageFromFilename('unknown_file.xyz', 'custom-lang')).toBe('custom-lang');
  });
});
