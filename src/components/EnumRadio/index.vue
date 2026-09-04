<template>
  <el-radio-group v-bind="$attrs" v-model="selectedValue">
    <template v-if="optionType === 'button'">
      <el-radio-button
        v-for="item in radioOptions"
        :key="getItemValue(item)"
        :value="getItemValue(item)"
        :disabled="item.disabled"
      >
        {{ getItemLabel(item) }}
      </el-radio-button>
    </template>
    <template v-else>
      <el-radio
        v-for="item in radioOptions"
        :key="getItemValue(item)"
        :value="getItemValue(item)"
        :disabled="item.disabled"
      >
        {{ getItemLabel(item) }}
      </el-radio>
    </template>
  </el-radio-group>
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
  valueKey?: string;
  labelKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  optionType: 'default',
  valueKey: 'code',
  labelKey: 'label'
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
