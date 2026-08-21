<template>
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
        <el-form ref="modelProviderFormRef" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="提供商名称" prop="providerName">
                        <el-input v-model="form.providerName" placeholder="请输入提供商名称" />
                    </el-form-item>
                    <el-form-item label="提供商唯一标识键" prop="providerCode">
                        <el-input v-model="form.providerCode" placeholder="请输入提供商唯一标识键" />
                    </el-form-item>
                    <el-form-item label="默认 API 接口地址" prop="defaultBaseUrl">
                        <el-input v-model="form.defaultBaseUrl" placeholder="请输入默认 API 接口地址" />
                    </el-form-item>
                    <el-form-item label="启用状态" prop="status">
                        <el-switch
                            v-model="form.status"
                                :active-value="true"
                                :inactive-value="false"
                        />
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="ModelProviderDetailDialog" lang="ts">
    import {
        getModelProvider,
        addModelProvider,
        updateModelProvider
    } from '@/api/ai/modelProvider';

    import { ElForm } from 'element-plus';
    import { ModelProviderForm } from '@/api/ai/modelProvider/types';
    import { useFormDialog } from '@/hooks/dialog/useFormDialog';
    import modal from '@/plugins/modal';
    import { useDict } from '@/utils/dict';

    type ElFormInstance = InstanceType<typeof ElForm>;

    const { sys_normal_disable } = toRefs<any>(useDict('sys_normal_disable'));

    const emit = defineEmits(['success']);

    const buttonLoading = ref(false);
    const modelProviderFormRef = ref<ElFormInstance>();

    const initFormData: ModelProviderForm = {
        providerId: undefined,
        providerName: undefined,
        providerCode: undefined,
        defaultBaseUrl: undefined,
        status: undefined,
        remark: undefined,
    };

    const data = reactive<PageData<ModelProviderForm, any>>({
        form: { ...initFormData },
        queryParams: {},
        rules: {
            providerId: [{ required: true, message: '主键 ID不能为空', trigger: "change" }],
            providerName: [{ required: true, message: '提供商名称不能为空', trigger: "blur" }],
            providerCode: [{ required: true, message: '提供商唯一标识键不能为空', trigger: "blur" }],
            status: [{ required: true, message: '启用状态不能为空', trigger: "change" }],
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
        formRef: modelProviderFormRef,
        initialFormData: initFormData
    });

    /** 打开弹窗并根据是否有ID加载数据 */
    const open = async (id?: number | string) => {
        reset();
        if (id) {
            const res = await getModelProvider(id);
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
        modelProviderFormRef.value?.validate(async (valid: boolean) => {
            if (!valid) return;
            buttonLoading.value = true;
            try {
                const isEdit = !!form.value.providerId;
                isEdit ? await updateModelProvider(form.value) : await addModelProvider(form.value);
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
