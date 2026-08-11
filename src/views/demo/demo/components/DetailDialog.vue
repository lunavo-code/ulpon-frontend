<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
    <el-form ref="demoFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="部门id" prop="deptId">
        <el-input v-model="form.deptId" placeholder="请输入部门id" />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="form.userId" placeholder="请输入用户id" />
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="form.orderNum" :min="0" style="width: 100%;" placeholder="请输入排序号" />
      </el-form-item>
      <el-form-item label="key键" prop="testKey">
        <el-input v-model="form.testKey" placeholder="请输入key键" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="form.value" placeholder="请输入值" />
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

<script setup name="DemoDetailDialog" lang="ts">
import { ref, reactive, toRefs } from 'vue';
import { ElForm } from 'element-plus';
import { getDemo, addDemo, updateDemo } from '@/api/demo/demo';
import { DemoForm } from '@/api/demo/demo/types';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import modal from '@/plugins/modal';


type ElFormInstance = InstanceType<typeof ElForm>;

const emit = defineEmits(['success']);

const buttonLoading = ref(false);
const demoFormRef = ref<ElFormInstance>();

const initFormData: DemoForm = {
  id: undefined,
  deptId: undefined,
  userId: undefined,
  orderNum: undefined,
  testKey: undefined,
  value: undefined
};

const data = reactive<PageData<DemoForm, any>>({
  form: { ...initFormData },
  queryParams: {},
  rules: {
    deptId: [{ required: true, message: '部门id不能为空', trigger: 'blur' }],
    userId: [{ required: true, message: '用户id不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '排序号不能为空', trigger: 'blur' }],
    testKey: [{ required: true, message: 'key键不能为空', trigger: 'blur' }],
    value: [{ required: true, message: '值不能为空', trigger: 'blur' }]
  }
});

const { form, rules } = toRefs(data);

const {
  dialog,
  resetForm: reset,
  showDialog,
  closeDialog
} = useFormDialog({
  form,
  formRef: demoFormRef,
  initialFormData: initFormData
});

/** 打开弹窗并根据是否有ID加载数据 */
const open = async (id?: number | string) => {
  reset();
  if (id) {
    const res = await getDemo(id);
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
  demoFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      const isEdit = !!form.value.id;
      isEdit ? await updateDemo(form.value) : await addDemo(form.value);
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
