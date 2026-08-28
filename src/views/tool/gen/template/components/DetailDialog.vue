





<template>
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px" append-to-body>
        <el-form ref="templateFormRef" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="模板类型: backend,frontend-vue,frontend-react,sql" prop="type">
                        <el-input v-model="form.type" placeholder="请输入内容" />
                    </el-form-item>
                    <el-form-item label="生成路径" prop="path">
                        <el-input v-model="form.path" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                    <el-form-item label="模板名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入模板名称" />
                    </el-form-item>
                    <el-form-item label="模板内容">
                        <el-input type="textarea" v-model="form.content" :min-height="192"/>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input-number v-model="form.sort" controls-position="right" />
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

<script setup name="TemplateDetailDialog" lang="ts">
    import {
        getTemplate,
        addTemplate,
        updateTemplate
    } from '@/api/tool/gen/template';

    import { ElForm } from 'element-plus';
    import { TemplateForm } from '@/api/tool/gen/template/types';
    import { useFormDialog } from '@/hooks/dialog/useFormDialog';
    import modal from '@/plugins/modal';

    type ElFormInstance = InstanceType<typeof ElForm>;

    const emit = defineEmits(['success']);

    const buttonLoading = ref(false);
    const templateFormRef = ref<ElFormInstance>();

    const initFormData: TemplateForm = {
        id: undefined,
        type: undefined,
        path: undefined,
        name: undefined,
        content: undefined,
        sort: undefined,
    };

    const data = reactive<PageData<TemplateForm, any>>({
        form: { ...initFormData },
        queryParams: {},
        rules: {
            id: [{ required: true, message: 'id不能为空', trigger: "change" }],
            type: [{ required: true, message: '模板类型: backend,frontend-vue,frontend-react,sql不能为空', trigger: "change" }],
            path: [{ required: true, message: '生成路径不能为空', trigger: "blur" }],
            name: [{ required: true, message: '模板名称不能为空', trigger: "blur" }],
            content: [{ required: true, message: '模板内容不能为空', trigger: "blur" }],
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
        formRef: templateFormRef,
        initialFormData: initFormData
    });

    /** 打开弹窗并根据是否有ID加载数据 */
    const open = async (id?: number | string) => {
        reset();
        if (id) {
            const res = await getTemplate(id);
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
        templateFormRef.value?.validate(async (valid: boolean) => {
            if (!valid) return;
            buttonLoading.value = true;
            try {
                const isEdit = !!form.value.id;
                isEdit ? await updateTemplate(form.value) : await addTemplate(form.value);
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
