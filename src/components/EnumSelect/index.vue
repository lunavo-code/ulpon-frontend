<template>
  <el-select v-bind="$attrs" v-model="selectedValue" :placeholder="placeholder">
    <el-option
      v-for="item in selectOptions"
      :key="getItemValue(item)"
      :label="getItemLabel(item)"
      :value="getItemValue(item)"
      :disabled="item.disabled"
    >
      <slot :item="item">
        <div class="enum-option-item">
          <span>{{ getItemLabel(item) }}</span>
          <span v-if="showDesc && item.desc" class="enum-option-desc">{{ item.desc }}</span>
        </div>
      </slot>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEnum } from '@/utils/enums';

interface Props {
  modelValue: any;
  model?: string;
  enumType?: string;
  options?: Array<EnumItem | any>;
  placeholder?: string;
  showDesc?: boolean;
  valueKey?: string;
  labelKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  showDesc: false,
  valueKey: 'code',
  labelKey: 'label'
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

<style scoped lang="scss">
.enum-option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .enum-option-desc {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    margin-left: 12px;
  }
}
</style>
