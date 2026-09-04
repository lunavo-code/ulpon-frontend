<template>
  <div class="enum-tag-wrapper">
    <template v-for="(item, index) in tagOptions">
      <template v-if="isValueMatch(getItemValue(item))">
        <span
          v-if="
            (getFinalTagType(item) === 'default' || getFinalTagType(item) === '') &&
            !item.elTagClass && !item.tagClass
          "
          :key="getItemValue(item)"
          :index="index"
          :class="item.elTagClass || item.tagClass"
        >
          {{ getItemLabel(item) + ' ' }}
        </span>
        <el-tag
          v-else
          :key="getItemValue(item) + ''"
          :disable-transitions="true"
          :index="index"
          :type="getFinalTagType(item)"
          :class="item.elTagClass || item.tagClass"
        >
          {{ getItemLabel(item) }}
        </el-tag>
      </template>
    </template>
    <template v-if="unmatch && showValue">
      <span class="unmatch-text">{{ unmatchArray }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEnum } from '@/utils/enums';

interface Props {
  options?: Array<any>;
  model?: string;
  enumType?: string;
  value: number | string | Array<number | string>;
  showValue?: boolean;
  separator?: string;
  valueKey?: string;
  labelKey?: string;
  tagType?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | '' | 'default';
  tagTypeMap?: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger' | ''>;
}

const props = withDefaults(defineProps<Props>(), {
  showValue: true,
  separator: ',',
  valueKey: 'code',
  labelKey: 'label'
});

const tagOptions = computed(() => {
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

const getFinalTagType = (item: any): any => {
  const itemVal = String(getItemValue(item));
  if (props.tagTypeMap && props.tagTypeMap[itemVal]) {
    return props.tagTypeMap[itemVal];
  }
  const type = item.tagType || item.elTagType || props.tagType;
  if (type === 'primary' || type === 'success' || type === 'info' || type === 'warning' || type === 'danger') {
    return type;
  }
  return type || '';
};

const values = computed(() => {
  if (props.value === '' || props.value === null || typeof props.value === 'undefined') return [];
  if (typeof props.value === 'number' || typeof props.value === 'boolean') return [String(props.value)];
  return Array.isArray(props.value) ? props.value.map(item => String(item)) : String(props.value).split(props.separator);
});

const unmatch = computed(() => {
  if (tagOptions.value.length === 0 || props.value === '' || props.value === null || typeof props.value === 'undefined') {
    return false;
  }
  return values.value.some(item => !tagOptions.value.some(v => String(getItemValue(v)) === item));
});

const unmatchArray = computed(() => {
  const itemUnmatchArray: Array<string | number> = [];
  if (props.value !== '' && props.value !== null && typeof props.value !== 'undefined') {
    values.value.forEach(item => {
      if (!tagOptions.value.some(v => String(getItemValue(v)) === item)) {
        itemUnmatchArray.push(item);
      }
    });
  }
  if (itemUnmatchArray.length === 0) return '';
  return itemUnmatchArray.join(' ');
});

const isValueMatch = (itemValue: any) => {
  return values.value.some(val => val === String(itemValue));
};
</script>

<style lang="scss" scoped>
.enum-tag-wrapper {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .unmatch-text {
    margin-left: 6px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style>
