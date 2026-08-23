<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="1000px" append-to-body>
    <el-steps :active="2" finish-status="success" align-center>
      <el-step title="智能体描述" description="">

      </el-step>
      <el-step title="step b" description="">

      </el-step>
    </el-steps>
    <el-form class="dialog-grid-form" ref="agentFormRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item class="span-2" label="智能体头像" prop="avatar">
        <image-upload v-model="form.avatar"/>
      </el-form-item>
      <el-form-item label="智能体名称" prop="agentName">
        <el-input v-model="form.agentName" placeholder="请输入智能体名称"/>
      </el-form-item>
      <el-form-item label="智能体描述简介" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="系统提示词 (System Prompt)" prop="systemPrompt">
        <el-input v-model="form.systemPrompt" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="关联大模型配置 ID" prop="modelConfigId">
        <ModelSelectPanel v-model="form.modelConfigId" :displayColumns="['configName']"/>
        <!--        <el-input-number v-model="form.modelConfigId" controls-position="right"/>-->
      </el-form-item>
      <el-form-item label="启用知识库" prop="kbEnabled">
        <el-switch
          v-model="form.kbEnabled"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="关联知识库 ID" prop="kbId">
        <el-input-number v-model="form.kbId" controls-position="right"/>
      </el-form-item>
      <el-form-item label="启用联网检索" prop="searchEnabled">
        <el-switch
          v-model="form.searchEnabled"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="启用聊天记忆" prop="memoryEnabled">
        <el-switch
          v-model="form.memoryEnabled"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="记忆窗口长度" prop="memoryWindow">
        <el-input-number v-model="form.memoryWindow" controls-position="right"/>
      </el-form-item>
      <el-form-item label="问候语" prop="greeting">
        <el-input v-model="form.greeting" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="预设问题" prop="presetQuestions">
        <el-input v-model="form.presetQuestions" type="textarea" placeholder="请输入内容"/>
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
      <el-form-item label="启用状态" prop="status">

        <el-select v-model="form.status" placeholder="请选择关键词分类">
          <el-option
            v-for="dict in geo_keyword_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>

<!--        <el-switch-->
<!--          v-model="form.status"-->
<!--          :active-value="true"-->
<!--          :inactive-value="false"-->
<!--        />-->
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

<script setup name="AgentDetailDialog" lang="ts">
import {
  getAgent,
  addAgent,
  updateAgent
} from '@/api/ai/agent';

import {ElForm} from 'element-plus';
import {AgentForm} from '@/api/ai/agent/types';
import {useFormDialog} from '@/hooks/dialog/useFormDialog';
import modal from '@/plugins/modal';
import {useDict} from '@/utils/dict';
import ModelSelectPanel from "@/views/ai/modelConfig/components/SelectPanel.vue";
import OnlineDevice from "@/views/system/user/profile/onlineDevice.vue";
import ResetPwd from "@/views/system/user/profile/resetPwd.vue";
import ThirdParty from "@/views/system/user/profile/thirdParty.vue";
import UserInfo from "@/views/system/user/profile/userInfo.vue";

type ElFormInstance = InstanceType<typeof ElForm>;

const {ai_agent_visibility} = toRefs<any>(useDict('ai_agent_visibility'));

const emit = defineEmits(['success']);

const buttonLoading = ref(false);
const agentFormRef = ref<ElFormInstance>();

const initFormData: AgentForm = {
  agentId: undefined,
  agentName: undefined,
  avatar: undefined,
  description: undefined,
  systemPrompt: undefined,
  modelConfigId: undefined,
  kbEnabled: undefined,
  kbId: undefined,
  searchEnabled: undefined,
  memoryEnabled: undefined,
  memoryWindow: undefined,
  greeting: undefined,
  presetQuestions: undefined,
  scopeType: undefined,
  status: undefined,
  remark: undefined,
};

const data = reactive<PageData<AgentForm, any>>({
  form: {...initFormData},
  queryParams: {},
  rules: {
    agentId: [{required: true, message: '主键 ID不能为空', trigger: "change"}],
    agentName: [{required: true, message: '智能体名称不能为空', trigger: "blur"}],
    modelConfigId: [{required: true, message: '关联大模型配置 ID不能为空', trigger: "change"}],
    kbEnabled: [{required: true, message: '启用知识库不能为空', trigger: "change"}],
    searchEnabled: [{required: true, message: '启用联网检索不能为空', trigger: "change"}],
    memoryEnabled: [{required: true, message: '启用聊天记忆不能为空', trigger: "change"}],
    scopeType: [{required: true, message: '可见范围类型不能为空', trigger: "change"}],
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
  formRef: agentFormRef,
  initialFormData: initFormData
});

/** 打开弹窗并根据是否有ID加载数据 */
const open = async (id?: number | string) => {
  reset();
  if (id) {
    const res = await getAgent(id);
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
  agentFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      const isEdit = !!form.value.agentId;
      isEdit ? await updateAgent(form.value) : await addAgent(form.value);
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
