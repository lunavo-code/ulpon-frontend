<template>
  <el-dialog class="dialog-grid-form" v-model="dialog.visible" :title="dialog.title" width="800px" append-to-body>
    <el-form ref="capabilityTaskFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="能力 ID" prop="capabilityId">
        <el-input-number v-model="form.capabilityId" controls-position="right"/>
      </el-form-item>
      <el-form-item label="用户消息">
        <editor v-model="form.userContent" :min-height="192"/>
      </el-form-item>
      <el-form-item label="反馈消息">
        <editor v-model="form.resContent" :min-height="192"/>
      </el-form-item>
      <el-form-item label="Token 消耗数" prop="tokenCount">
        <el-input-number v-model="form.tokenCount" controls-position="right"/>
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

<script setup name="CapabilityTaskDetailDialog" lang="ts">
import {
  getCapabilityTask,
  addCapabilityTask,
  updateCapabilityTask
} from '@/api/ai/capabilityTask';

import {ElForm} from 'element-plus';
import {CapabilityTaskForm} from '@/api/ai/capabilityTask/types';
import {useFormDialog} from '@/hooks/dialog/useFormDialog';
import modal from '@/plugins/modal';

type ElFormInstance = InstanceType<typeof ElForm>;

const emit = defineEmits(['success']);

const buttonLoading = ref(false);
const capabilityTaskFormRef = ref<ElFormInstance>();

const initFormData: CapabilityTaskForm = {
  taskId: undefined,
  capabilityId: undefined,
  userContent: undefined,
  resContent: undefined,
  tokenCount: undefined,
};

const data = reactive<PageData<CapabilityTaskForm, any>>({
  form: {...initFormData},
  queryParams: {},
  rules: {
    taskId: [{required: true, message: '主键 ID不能为空', trigger: "change"}],
    capabilityId: [{required: true, message: '能力 ID不能为空', trigger: "change"}],
    userContent: [{required: true, message: '用户消息不能为空', trigger: "blur"}],
    resContent: [{required: true, message: '反馈消息不能为空', trigger: "blur"}],
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
  formRef: capabilityTaskFormRef,
  initialFormData: initFormData
});

/** 打开弹窗并根据是否有ID加载数据 */
const open = async (id?: number | string) => {
  reset();
  if (id) {
    const res = await getCapabilityTask(id);
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
  capabilityTaskFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      const isEdit = !!form.value.taskId;
      isEdit ? await updateCapabilityTask(form.value) : await addCapabilityTask(form.value);
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
