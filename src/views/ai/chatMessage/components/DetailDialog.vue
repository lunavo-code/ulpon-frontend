<template>
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
        <el-form ref="chatMessageFormRef" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="关联会话 ID" prop="sessionId">
                        <el-input-number v-model="form.sessionId" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="角色类型" prop="role">
                        <el-input v-model="form.role" placeholder="请输入角色类型" />
                    </el-form-item>
                    <el-form-item label="消息内容">
                        <editor v-model="form.content" :min-height="192"/>
                    </el-form-item>
                    <el-form-item label="Token 消耗数" prop="tokenCount">
                        <el-input-number v-model="form.tokenCount" controls-position="right" />
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

<script setup name="ChatMessageDetailDialog" lang="ts">
    import {
        getChatMessage,
        addChatMessage,
        updateChatMessage
    } from '@/api/ai/chatMessage';

    import { ElForm } from 'element-plus';
    import { ChatMessageForm } from '@/api/ai/chatMessage/types';
    import { useFormDialog } from '@/hooks/dialog/useFormDialog';
    import modal from '@/plugins/modal';

    type ElFormInstance = InstanceType<typeof ElForm>;

    const emit = defineEmits(['success']);

    const buttonLoading = ref(false);
    const chatMessageFormRef = ref<ElFormInstance>();

    const initFormData: ChatMessageForm = {
        messageId: undefined,
        sessionId: undefined,
        role: undefined,
        content: undefined,
        tokenCount: undefined,
    };

    const data = reactive<PageData<ChatMessageForm, any>>({
        form: { ...initFormData },
        queryParams: {},
        rules: {
            messageId: [{ required: true, message: '主键 ID不能为空', trigger: "change" }],
            sessionId: [{ required: true, message: '关联会话 ID不能为空', trigger: "change" }],
            role: [{ required: true, message: '角色类型不能为空', trigger: "blur" }],
            content: [{ required: true, message: '消息内容不能为空', trigger: "blur" }],
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
        formRef: chatMessageFormRef,
        initialFormData: initFormData
    });

    /** 打开弹窗并根据是否有ID加载数据 */
    const open = async (id?: number | string) => {
        reset();
        if (id) {
            const res = await getChatMessage(id);
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
        chatMessageFormRef.value?.validate(async (valid: boolean) => {
            if (!valid) return;
            buttonLoading.value = true;
            try {
                const isEdit = !!form.value.messageId;
                isEdit ? await updateChatMessage(form.value) : await addChatMessage(form.value);
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
