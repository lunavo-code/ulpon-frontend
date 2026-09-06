<template>
  <el-select v-bind="$attrs" v-model="selectedValue" :placeholder="placeholder">
    <el-option v-for="item in selectOptions" :key="item.code" :label="item.label" :value="item.code"></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEnum } from '@/utils/enums';

interface Props {
  modelValue: any;
  model?: string;
  enumType?: string;
  options?: Array<EnumItem>;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const selectOptions = computed(() => {
  if (props.options && props.options.length > 0) {
    return props.options;
  }
  if (props.model && props.enumType) {
    const enums = useEnum(props.model, props.enumType);
    return enums[props.enumType] || [];
  }
  return [];
});
</script>
