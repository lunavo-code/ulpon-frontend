<template>
  <el-checkbox-group v-bind="$attrs" v-model="selectedValue">
    <template v-if="optionType === 'button'">
      <el-checkbox-button
        v-for="item in checkboxOptions"
        :key="getItemValue(item)"
        :value="getItemValue(item)"
        :disabled="item.disabled"
      >
        {{ getItemLabel(item) }}
      </el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox
        v-for="item in checkboxOptions"
        :key="getItemValue(item)"
        :value="getItemValue(item)"
        :disabled="item.disabled"
      >
        {{ getItemLabel(item) }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEnum } from '@/utils/enums';

interface Props {
  modelValue: any;
  model?: string;
  enumType?: string;
  options?: Array<EnumItem | any>;
  optionType?: 'default' | 'button';
  separator?: string;
  valueKey?: string;
  labelKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  optionType: 'default',
  separator: ',',
  valueKey: 'code',
  labelKey: 'label'
});

const emit = defineEmits(['update:modelValue']);

// 双向绑定智能处理：支持数组与逗号分隔字符串
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

const checkboxOptions = computed(() => {
  if (props.options && props.options.length > 0) {
    return props.options;
  }
  if (props.model && props.enumType) {
    const enums = useEnum(props.model, props.enumType);
    return enums[props.enumType] || [];
  }
  return [];
});

const getItemValue = (item: any) => {
  if (item[props.valueKey] !== undefined) {
    return item[props.valueKey];
  }
  return item.value !== undefined ? item.value : item;
};

const getItemLabel = (item: any) => {
  if (item[props.labelKey] !== undefined) {
    return item[props.labelKey];
  }
  return item.label !== undefined ? item.label : item;
};
</script>
