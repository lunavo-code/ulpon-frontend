<template>
  <el-checkbox-group v-bind="$attrs" v-model="selectedValue">
    <template v-if="optionType === 'button'">
      <el-checkbox-button
        v-for="item in checkboxOptions"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox
        v-for="item in checkboxOptions"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDict } from '@/utils/dict';

// 扩展类型定义以支持单项禁用
interface DictCheckboxOption extends DictDataOption {
  disabled?: boolean;
}

interface Props {
  modelValue: any;
  dictType?: string;
  options?: Array<DictCheckboxOption>;
  optionType?: 'default' | 'button';
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  optionType: 'default',
  separator: ','
});

const emit = defineEmits(['update:modelValue']);

// 双向绑定绑定值
const selectedValue = computed({
  get: () => {
    const val = props.modelValue;
    if (val === '' || val === null || typeof val === 'undefined') {
      return [];
    }
    if (Array.isArray(val)) {
      return val.map(item => String(item));
    }
    return String(val).split(props.separator);
  },
  set: (val: any[]) => {
    const isArray = Array.isArray(props.modelValue);
    if (isArray) {
      emit('update:modelValue', val);
    } else {
      emit('update:modelValue', val.join(props.separator));
    }
  }
});

// 计算多选框列表选项
const checkboxOptions = computed(() => {
  if (props.options && props.options.length > 0) {
    return props.options;
  }
  if (props.dictType) {
    const dicts = useDict(props.dictType);
    return dicts[props.dictType] || [];
  }
  return [];
});
</script>
