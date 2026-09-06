<template>
  <div class="dict-demo-container p-4">
    <el-card shadow="never" class="mb-4 header-card">
      <template #header>
        <div class="card-title">
          <h2>字典与枚举全组件样例（Dict* 与 Enum* 系列：Select / Radio / Checkbox / Tag）</h2>
          <p class="desc">
            统一封装了字典/枚举接口调用、Pinia 数据缓存、本地数据适配、按钮形态切换、选项描述展示以及 Tag 状态色彩回显。
          </p>
        </div>
      </template>
    </el-card>

    <el-row :gutter="20">
      <!-- 1. DictSelect 下拉框组件 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="1. DictSelect 字典下拉框">
          <el-form label-width="120px">
            <el-form-item label="远程系统字典">
              <dict-select
                v-model="selectVal1"
                dict-type="sys_normal_disable"
                placeholder="请选择用户状态"
                clearable
                style="width: 100%"
              />
              <div class="value-tip">绑定值：<code>{{ selectVal1 }}</code></div>
            </el-form-item>

            <el-form-item label="自定义静态数据">
              <dict-select
                v-model="selectVal2"
                :options="taskStatusOptions"
                placeholder="请选择任务状态"
                clearable
                style="width: 100%"
              />
              <div class="value-tip">绑定值：<code>{{ selectVal2 }}</code></div>
            </el-form-item>

            <el-form-item label="多选模式 (透传)">
              <dict-select
                v-model="selectVal3"
                :options="taskStatusOptions"
                placeholder="请选择多个状态"
                multiple
                clearable
                style="width: 100%"
              />
              <div class="value-tip">绑定值 (数组)：<code>{{ selectVal3 }}</code></div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 2. DictRadio 单选框组件 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="2. DictRadio 字典单选框">
          <el-form label-width="120px">
            <el-form-item label="普通单选 (远程)">
              <dict-radio
                v-model="radioVal1"
                dict-type="sys_user_gender"
              />
              <div class="value-tip">绑定值：<code>{{ radioVal1 }}</code></div>
            </el-form-item>

            <el-form-item label="按钮外观 (静态)">
              <dict-radio
                v-model="radioVal2"
                :options="priorityOptions"
                option-type="button"
              />
              <div class="value-tip">绑定值：<code>{{ radioVal2 }}</code></div>
            </el-form-item>

            <el-form-item label="表单禁用状态">
              <dict-radio
                v-model="radioVal2"
                :options="priorityOptions"
                disabled
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 3. DictCheckbox 多选框组件 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="3. DictCheckbox 字典多选框">
          <el-form label-width="130px">
            <el-form-item label="数组绑定模式">
              <dict-checkbox
                v-model="checkboxArr"
                dict-type="sys_normal_disable"
              />
              <div class="value-tip">绑定值 (Array)：<code>{{ checkboxArr }}</code></div>
            </el-form-item>

            <el-form-item label="字符串绑定模式">
              <dict-checkbox
                v-model="checkboxStr"
                :options="roleOptions"
                separator=","
              />
              <div class="value-tip">绑定值 (逗号字符串)：<code>{{ checkboxStr }}</code></div>
            </el-form-item>

            <el-form-item label="按钮形态 & 单项禁用">
              <dict-checkbox
                v-model="checkboxButton"
                :options="roleOptions"
                option-type="button"
              />
              <div class="value-tip">绑定值 (Array)：<code>{{ checkboxButton }}</code></div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 4. DictTag 标签回显组件 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="4. DictTag 字典标签回显">
          <el-form label-width="120px">
            <el-form-item label="单值回显">
              <dict-tag :options="taskStatusOptions" value="running" />
              <dict-tag :options="taskStatusOptions" value="completed" class="ml-2" />
              <dict-tag :options="taskStatusOptions" value="failed" class="ml-2" />
            </el-form-item>

            <el-form-item label="多值回显 (数组)">
              <dict-tag :options="taskStatusOptions" :value="['pending', 'running', 'completed']" />
            </el-form-item>

            <el-form-item label="多值回显 (字符串)">
              <dict-tag :options="roleOptions" value="admin,editor" separator="," />
            </el-form-item>

            <el-form-item label="未匹配值回显">
              <!-- showValue 默认 true，未匹配到的原始值会保留显示以防数据丢失 -->
              <dict-tag :options="taskStatusOptions" value="unknown_state_99" :show-value="true" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 5. 综合联动示例 -->
      <el-col :span="24" class="mb-4">
        <el-card shadow="hover" header="5. 组件协同联动实战（选择器 + 实时 DictTag 回显）">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form label-width="100px">
                <el-form-item label="选择状态">
                  <dict-select
                    v-model="interactiveStatus"
                    :options="taskStatusOptions"
                    placeholder="切换状态查看右侧 Tag 回显"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="选择角色">
                  <dict-checkbox
                    v-model="interactiveRoles"
                    :options="roleOptions"
                  />
                </el-form-item>
              </el-form>
            </el-col>

            <el-col :span="12">
              <div class="result-box p-3">
                <div class="mb-2">
                  <span class="label">状态回显：</span>
                  <dict-tag :options="taskStatusOptions" :value="interactiveStatus" />
                </div>
                <div>
                  <span class="label">角色回显：</span>
                  <dict-tag :options="roleOptions" :value="interactiveRoles" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 6. EnumSelect 枚举选择器组件 -->
      <el-col :span="24" class="mb-4">
        <el-card shadow="hover" header="6. EnumSelect 枚举选择器">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form label-width="140px">
                <el-form-item label="远程模块枚举">
                  <enum-select
                    v-model="enumVal1"
                    model="gen"
                    enum-type="TemplateCategoryEnum"
                    placeholder="请选择模板类别"
                    clearable
                    style="width: 100%"
                  />
                  <div class="value-tip">绑定值：<code>{{ enumVal1 }}</code>（自动通过 useEnum('gen', 'TemplateCategoryEnum') 获取并缓存）</div>
                </el-form-item>

                <el-form-item label="本地静态枚举">
                  <enum-select
                    v-model="enumVal2"
                    model="gen"
                    enum-type="TemplateCategoryEnum"
                    placeholder="请选择系统分类"
                    clearable
                    style="width: 100%"
                  />
                  <div class="value-tip">绑定值：<code>{{ enumVal2 }}</code></div>
                </el-form-item>
              </el-form>
            </el-col>

            <el-col :span="12">
              <el-form label-width="140px">
                <el-form-item label="显示描述 (show-desc)">
                  <enum-select
                    v-model="enumVal3"
                    :options="taskTypeEnumOptions"
                    show-desc
                    placeholder="请选择任务类型"
                    clearable
                    style="width: 100%"
                  />
                  <div class="value-tip">绑定值：<code>{{ enumVal3 }}</code>（选项右侧浅色展示 desc 说明）</div>
                </el-form-item>

                <el-form-item label="多选枚举 (multiple)">
                  <enum-select
                    v-model="enumVal4"
                    :options="categoryEnumOptions"
                    multiple
                    clearable
                    placeholder="请选择分类(支持多选)"
                    style="width: 100%"
                  />
                  <div class="value-tip">绑定值 (Array)：<code>{{ enumVal4 }}</code></div>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 7. EnumRadio 枚举单选框组件 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="7. EnumRadio 枚举单选框">
          <el-form label-width="120px">
            <el-form-item label="普通单选 (静态)">
              <enum-radio
                v-model="enumRadioVal1"
                model="gen"
                enum-type="TemplateCategoryEnum"
              />
              <div class="value-tip">绑定值：<code>{{ enumRadioVal1 }}</code></div>
            </el-form-item>

            <el-form-item label="按钮外观 (静态)">
              <enum-radio
                v-model="enumRadioVal2"
                model="gen"
                enum-type="TemplateCategoryEnum"
                option-type="button"
              />
              <div class="value-tip">绑定值：<code>{{ enumRadioVal2 }}</code></div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 8. EnumCheckbox 枚举多选框组件 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="8. EnumCheckbox 枚举多选框">
          <el-form label-width="130px">
            <el-form-item label="数组绑定模式">
              <enum-checkbox
                v-model="enumCheckArr"
                :options="categoryEnumOptions"
              />
              <div class="value-tip">绑定值 (Array)：<code>{{ enumCheckArr }}</code></div>
            </el-form-item>

            <el-form-item label="字符串绑定模式">
              <enum-checkbox
                v-model="enumCheckStr"
                :options="taskTypeEnumOptions"
                separator=","
              />
              <div class="value-tip">绑定值 (逗号字符串)：<code>{{ enumCheckStr }}</code></div>
            </el-form-item>

            <el-form-item label="按钮形态外观">
              <enum-checkbox
                v-model="enumCheckButton"
                :options="categoryEnumOptions"
                option-type="button"
              />
              <div class="value-tip">绑定值 (Array)：<code>{{ enumCheckButton }}</code></div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 9. EnumTag 枚举标签回显组件 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="9. EnumTag 枚举标签回显">
          <el-form label-width="120px">
            <el-form-item label="静态标签回显">
              <enum-tag :options="categoryEnumOptions" value="backend" :tag-type-map="enumTagTypeMap" />
              <enum-tag :options="categoryEnumOptions" value="frontend" :tag-type-map="enumTagTypeMap" class="ml-2" />
              <enum-tag :options="categoryEnumOptions" value="algorithm" :tag-type-map="enumTagTypeMap" class="ml-2" />
            </el-form-item>

            <el-form-item label="多值回显 (数组)">
              <enum-tag :options="taskTypeEnumOptions" :value="['feature', 'bugfix']" :tag-type-map="enumTagTypeMap" />
            </el-form-item>

            <el-form-item label="多值回显 (字符串)">
              <enum-tag :options="categoryEnumOptions" value="backend,mobile" separator="," :tag-type-map="enumTagTypeMap" />
            </el-form-item>

            <el-form-item label="未匹配兜底">
              <enum-tag :options="categoryEnumOptions" value="custom_unknown_code" :show-value="true" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 10. 枚举全家桶联动实战 -->
      <el-col :span="12" class="mb-4">
        <el-card shadow="hover" header="10. 枚举组件全套协同联动实战">
          <el-form label-width="100px">
            <el-form-item label="单选分类">
              <enum-radio
                v-model="interactiveEnumCategory"
                :options="categoryEnumOptions"
                option-type="button"
                size="small"
              />
            </el-form-item>

            <el-form-item label="多选任务">
              <enum-checkbox
                v-model="interactiveEnumTasks"
                :options="taskTypeEnumOptions"
                size="small"
              />
            </el-form-item>
          </el-form>

          <div class="result-box p-3 mt-2">
            <div class="mb-2">
              <span class="label">分类回显：</span>
              <enum-tag :options="categoryEnumOptions" :value="interactiveEnumCategory" :tag-type-map="enumTagTypeMap" />
            </div>
            <div>
              <span class="label">任务回显：</span>
              <enum-tag :options="taskTypeEnumOptions" :value="interactiveEnumTasks" :tag-type-map="enumTagTypeMap" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index" lang="ts">
import { ref, onMounted } from 'vue';
import { useEnum } from '@/utils/enums';

// 保持原有的 useEnum 逻辑
const { templateCategoryEnum } = toRefs<any>(useEnum('gen', 'TemplateCategoryEnum'));

// ======================== 1. DictSelect 状态 ========================
const selectVal1 = ref('0');
const selectVal2 = ref('running');
const selectVal3 = ref(['pending', 'running']);

// ======================== 2. DictRadio 状态 ========================
const radioVal1 = ref('0');
const radioVal2 = ref('medium');

// ======================== 3. DictCheckbox 状态 ========================
// 数组绑定形式
const checkboxArr = ref<string[]>(['0']);
// 逗号分隔字符串绑定形式
const checkboxStr = ref('admin,visitor');
// 按钮模式
const checkboxButton = ref<string[]>(['editor']);

// ======================== 5. 联动示例状态 ========================
const interactiveStatus = ref('running');
const interactiveRoles = ref<string[]>(['admin', 'editor']);

// ======================== 静态字典数据样例 ========================
// 模拟遵循 DictDataOption 规范的数据结构
const taskStatusOptions: DictDataOption[] = [
  { label: '待处理', value: 'pending', elTagType: 'info' },
  { label: '执行中', value: 'running', elTagType: 'primary' },
  { label: '已完成', value: 'completed', elTagType: 'success' },
  { label: '执行失败', value: 'failed', elTagType: 'danger' },
  { label: '已暂停', value: 'paused', elTagType: 'warning' }
];

const priorityOptions: DictDataOption[] = [
  { label: '低优先级', value: 'low' },
  { label: '中等优先级', value: 'medium' },
  { label: '高优先级', value: 'high' }
];

// 支持单项禁用的多选字典配置 (DictCheckboxOption)
const roleOptions = [
  { label: '超级管理员', value: 'admin', elTagType: 'danger' as const },
  { label: '内容编辑员', value: 'editor', elTagType: 'primary' as const },
  { label: '访客人员', value: 'visitor', elTagType: 'info' as const },
  { label: '已离职(禁用)', value: 'disabled_role', elTagType: 'info' as const, disabled: true }
];

// ======================== 6. EnumSelect 状态与静态数据 ========================
const enumVal1 = ref('crud');
const enumVal2 = ref('backend');
const enumVal3 = ref('feature');
const enumVal4 = ref<string[]>(['frontend', 'backend']);

const categoryEnumOptions: EnumItem[] = [
  { code: 'backend', label: '后端微服务', desc: 'Java / Spring Boot 服务组件' },
  { code: 'frontend', label: '前端应用', desc: 'Vue3 + Vite + TS SPA 单页应用' },
  { code: 'mobile', label: '移动端', desc: 'UniApp 跨端客户端' },
  { code: 'algorithm', label: 'AI算法能力', desc: 'LLM Agent 智能协同流水线' }
];

const taskTypeEnumOptions: EnumItem[] = [
  { code: 'feature', label: '新功能需求', desc: '业务新增功能与流程开发' },
  { code: 'bugfix', label: '缺陷修复', desc: '生产环境或测试缺陷排查修复' },
  { code: 'refactor', label: '架构重构', desc: '核心模块标准化与性能优化' }
];

// ======================== 7. EnumRadio 状态 ========================
const enumRadioVal1 = ref('feature');
const enumRadioVal2 = ref('backend');

// ======================== 8. EnumCheckbox 状态 ========================
const enumCheckArr = ref<string[]>(['frontend', 'backend']);
const enumCheckStr = ref('feature,bugfix');
const enumCheckButton = ref<string[]>(['backend']);

// ======================== 9 & 10. EnumTag 标签回显与联动状态 ========================
const interactiveEnumCategory = ref('backend');
const interactiveEnumTasks = ref<string[]>(['feature', 'bugfix']);

// 枚举状态与主题色彩映射表
const enumTagTypeMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
  backend: 'primary',
  frontend: 'success',
  mobile: 'warning',
  algorithm: 'danger',
  feature: 'success',
  bugfix: 'danger',
  refactor: 'warning'
};

onMounted(() => {
  console.log('TemplateCategoryEnum:', templateCategoryEnum);
});
</script>

<style scoped lang="scss">
.dict-demo-container {
  .header-card {
    border-radius: 8px;
    h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    .desc {
      margin: 0;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  .value-tip {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    code {
      padding: 2px 6px;
      border-radius: 4px;
      background-color: var(--el-fill-color-light);
      color: var(--el-color-primary);
      font-family: monospace;
    }
  }

  .result-box {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    background-color: var(--el-fill-color-blank);
    min-height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .label {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-regular);
      display: inline-block;
      width: 80px;
    }
  }
}
</style>
