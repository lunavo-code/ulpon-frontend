<template>
  <el-select v-bind="$attrs" v-model="selectedValue" :placeholder="placeholder">
    <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"/>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDict } from '@/utils/dict';

interface Props {
  modelValue: any;
  dictType?: string;
  options?: Array<DictDataOption>;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择'
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
  if (props.dictType) {
    const dicts = useDict(props.dictType);
    return dicts[props.dictType] || [];
  }
  return [];
});
</script>
