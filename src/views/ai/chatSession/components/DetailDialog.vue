<template>
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
        <el-form ref="chatSessionFormRef" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="会话名称" prop="sessionName">
                        <el-input v-model="form.sessionName" placeholder="请输入会话名称" />
                    </el-form-item>
                    <el-form-item label="关联智能体 ID" prop="agentId">
                        <el-input-number v-model="form.agentId" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="会话所有者 ID" prop="userId">
                        <el-input-number v-model="form.userId" controls-position="right" />
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

<script setup name="ChatSessionDetailDialog" lang="ts">
    import {
        getChatSession,
        addChatSession,
        updateChatSession
    } from '@/api/ai/chatSession';

    import { ElForm } from 'element-plus';
    import { ChatSessionForm } from '@/api/ai/chatSession/types';
    import { useFormDialog } from '@/hooks/dialog/useFormDialog';
    import modal from '@/plugins/modal';

    type ElFormInstance = InstanceType<typeof ElForm>;

    const emit = defineEmits(['success']);

    const buttonLoading = ref(false);
    const chatSessionFormRef = ref<ElFormInstance>();

    const initFormData: ChatSessionForm = {
        sessionId: undefined,
        sessionName: undefined,
        agentId: undefined,
        userId: undefined,
    };

    const data = reactive<PageData<ChatSessionForm, any>>({
        form: { ...initFormData },
        queryParams: {},
        rules: {
            sessionId: [{ required: true, message: '主键 ID不能为空', trigger: "change" }],
            sessionName: [{ required: true, message: '会话名称不能为空', trigger: "blur" }],
            agentId: [{ required: true, message: '关联智能体 ID不能为空', trigger: "change" }],
            userId: [{ required: true, message: '会话所有者 ID不能为空', trigger: "change" }],
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
        formRef: chatSessionFormRef,
        initialFormData: initFormData
    });

    /** 打开弹窗并根据是否有ID加载数据 */
    const open = async (id?: number | string) => {
        reset();
        if (id) {
            const res = await getChatSession(id);
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
        chatSessionFormRef.value?.validate(async (valid: boolean) => {
            if (!valid) return;
            buttonLoading.value = true;
            try {
                const isEdit = !!form.value.sessionId;
                isEdit ? await updateChatSession(form.value) : await addChatSession(form.value);
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
