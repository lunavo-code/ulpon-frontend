<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="1000px" append-to-body>
    <el-form class="dialog-grid-form" ref="modelConfigFormRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="提供商 ID" prop="providerId">
        <SelectPanel v-model="form.providerId" :displayColumns="['providerName']" />
<!--        <el-input-number v-model="form.providerId" controls-position="right"/>-->
      </el-form-item>
      <el-form-item label="配置别名/名称" prop="configName">
        <el-input v-model="form.configName" placeholder="请输入配置别名/名称"/>
      </el-form-item>
      <el-form-item label="目标模型名称" prop="modelName">
        <el-input v-model="form.modelName" placeholder="请输入目标模型名称"/>
      </el-form-item>
      <el-form-item label="API 接口覆盖地址" prop="baseUrl">
        <el-input v-model="form.baseUrl" placeholder="请输入API 接口覆盖地址"/>
      </el-form-item>
      <el-form-item label="API 密钥 (Script Key)" prop="apiKey">
        <el-input v-model="form.apiKey" placeholder="请输入API 密钥 (Script Key)"/>
      </el-form-item>
      <el-form-item label="最大生成 Token 数" prop="maxTokens">
        <el-input-number v-model="form.maxTokens" controls-position="right"/>
      </el-form-item>
      <el-form-item label="温度参数 (0.0 ~ 2.0)" prop="temperature">
        <el-input-number v-model="form.temperature" controls-position="right"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="是否为默认模型" prop="isDefault">
        <el-switch
          v-model="form.isDefault"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="ModelConfigDetailDialog" lang="ts">
import {
  getModelConfig,
  addModelConfig,
  updateModelConfig
} from '@/api/ai/modelConfig';

import {ElForm} from 'element-plus';
import {ModelConfigForm} from '@/api/ai/modelConfig/types';
import {useFormDialog} from '@/hooks/dialog/useFormDialog';
import modal from '@/plugins/modal';
import {useDict} from '@/utils/dict';
import SelectPanel from "@/views/ai/modelProvider/components/SelectPanel.vue";

type ElFormInstance = InstanceType<typeof ElForm>;

const {sys_normal_disable, sys_yes_no} = toRefs<any>(useDict('sys_normal_disable', 'sys_yes_no'));

const emit = defineEmits(['success']);

const buttonLoading = ref(false);
const modelConfigFormRef = ref<ElFormInstance>();

const initFormData: ModelConfigForm = {
  modelConfigId: undefined,
  providerId: undefined,
  configName: undefined,
  modelName: undefined,
  baseUrl: undefined,
  apiKey: undefined,
  maxTokens: undefined,
  temperature: undefined,
  status: undefined,
  isDefault: undefined,
  remark: undefined,
};

const data = reactive<PageData<ModelConfigForm, any>>({
  form: {...initFormData},
  queryParams: {},
  rules: {
    modelConfigId: [{required: true, message: '主键 ID不能为空', trigger: "change"}],
    providerId: [{required: true, message: '提供商 ID不能为空', trigger: "change"}],
    configName: [{required: true, message: '配置别名/名称不能为空', trigger: "blur"}],
    modelName: [{required: true, message: '目标模型名称不能为空', trigger: "blur"}],
    apiKey: [{required: true, message: 'API 密钥 (Script Key)不能为空', trigger: "blur"}],
    status: [{required: true, message: '启用状态不能为空', trigger: "change"}],
    isDefault: [{required: true, message: '是否为默认模型不能为空', trigger: "change"}],
  }
});

const {form, rules} = toRefs(data);

const {
  dialog,
  resetForm: reset,
  showDialog,
  closeDialog
} = useFormDialog({
  form,
  formRef: modelConfigFormRef,
  initialFormData: initFormData
});

/** 打开弹窗并根据是否有ID加载数据 */
const open = async (id?: number | string) => {
  reset();
  if (id) {
    const res = await getModelConfig(id);
    Object.assign(form.value, res.data);
    showDialog('修改测试单');
  } else {
    showDialog('添加测试单');
  }
};

/** 取消按钮 */
const cancel = () => {
  reset();
  closeDialog();
};

/** 提交表单 */
const submitForm = () => {
  modelConfigFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      const isEdit = !!form.value.modelConfigId;
      isEdit ? await updateModelConfig(form.value) : await addModelConfig(form.value);
      modal.msgSuccess(isEdit ? '修改成功' : '新增成功');
      closeDialog();
      emit('success');
    } finally {
      buttonLoading.value = false;
    }
  });
};

defineExpose({
  open
});
</script>
<style lang="scss" scoped>

</style>
