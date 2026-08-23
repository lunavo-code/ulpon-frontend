<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px" append-to-body>
    <el-form class="dialog-grid-form" ref="capabilityFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="能力名称" prop="capabilityName">
        <el-input v-model="form.capabilityName" placeholder="请输入能力名称"/>
      </el-form-item>
      <el-form-item label="任务描述简介" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="系统提示词 (System Prompt)" prop="systemPrompt">
        <el-input v-model="form.systemPrompt" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="关联大模型配置 ID" prop="modelConfigId">
        <SelectPanel v-model="form.modelConfigId" :displayColumns="['configName']" />
<!--        <el-input-number v-model="form.modelConfigId" controls-position="right"/>-->
      </el-form-item>
      <el-form-item label="可见范围类型" prop="scopeType">
        <el-select v-model="form.scopeType" placeholder="请选择可见范围类型">
          <el-option
            v-for="dict in ai_agent_visibility"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门 ID" prop="deptId">
        <el-input-number v-model="form.deptId" controls-position="right"/>
      </el-form-item>
      <el-form-item label="创建人用户 ID" prop="userId">
        <el-input-number v-model="form.userId" controls-position="right"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-switch
          v-model="form.status"
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

<script setup name="CapabilityDetailDialog" lang="ts">
import {
  getCapability,
  addCapability,
  updateCapability
} from '@/api/ai/capability';

import {ElForm} from 'element-plus';
import {CapabilityForm} from '@/api/ai/capability/types';
import {useFormDialog} from '@/hooks/dialog/useFormDialog';
import modal from '@/plugins/modal';
import {useDict} from '@/utils/dict';
import SelectPanel from "@/views/ai/modelConfig/components/SelectPanel.vue";

type ElFormInstance = InstanceType<typeof ElForm>;

const {ai_agent_visibility, sys_normal_disable} = toRefs<any>(useDict('ai_agent_visibility', 'sys_normal_disable'));

const emit = defineEmits(['success']);

const buttonLoading = ref(false);
const capabilityFormRef = ref<ElFormInstance>();

const initFormData: CapabilityForm = {
  capabilityId: undefined,
  capabilityName: undefined,
  description: undefined,
  systemPrompt: undefined,
  modelConfigId: undefined,
  scopeType: undefined,
  deptId: undefined,
  userId: undefined,
  status: undefined,
  remark: undefined,
};

const data = reactive<PageData<CapabilityForm, any>>({
  form: {...initFormData},
  queryParams: {},
  rules: {
    capabilityId: [{required: true, message: '主键 ID不能为空', trigger: "change"}],
    capabilityName: [{required: true, message: '能力名称不能为空', trigger: "blur"}],
    modelConfigId: [{required: true, message: '关联大模型配置 ID不能为空', trigger: "change"}],
    scopeType: [{required: true, message: '可见范围类型不能为空', trigger: "change"}],
    userId: [{required: true, message: '创建人用户 ID不能为空', trigger: "change"}],
    status: [{required: true, message: '启用状态不能为空', trigger: "change"}],
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
  formRef: capabilityFormRef,
  initialFormData: initFormData
});

/** 打开弹窗并根据是否有ID加载数据 */
const open = async (id?: number | string) => {
  reset();
  if (id) {
    const res = await getCapability(id);
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
  capabilityFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      const isEdit = !!form.value.capabilityId;
      isEdit ? await updateCapability(form.value) : await addCapability(form.value);
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
