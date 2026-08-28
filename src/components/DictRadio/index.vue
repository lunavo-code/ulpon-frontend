<template>
  <el-radio-group v-bind="$attrs" v-model="selectedValue">
    <template v-if="optionType === 'button'">
      <el-radio-button
        v-for="item in radioOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </el-radio-button>
    </template>
    <template v-else>
      <el-radio
        v-for="item in radioOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </el-radio>
    </template>
  </el-radio-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDict } from '@/utils/dict';

interface Props {
  modelValue: any;
  dictType?: string;
  options?: Array<DictDataOption>;
  optionType?: 'default' | 'button';
}

const props = withDefaults(defineProps<Props>(), {
  optionType: 'default'
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const radioOptions = computed(() => {
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
