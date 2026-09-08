import { compile } from 'vue';

try {
  const render = compile('<div class="test"><el-input v-model="form.testTitle" placeholder="请输入" /></div>');
  console.log('Compile success! Render type:', typeof render);
} catch (e) {
  console.error('Compile error:', e);
}
