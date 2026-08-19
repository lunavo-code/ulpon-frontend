<template>
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
        <el-form ref="keywordDerivedFormRef" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="关联核心词ID" prop="keywordId">
                        <el-input-number v-model="form.keywordId" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="标题类型" prop="titleType">
                        <el-select v-model="form.titleType" placeholder="请选择标题类型">
                            <el-option
                                v-for="dict in geo_title_type"
                                :key="dict.value"
                                :label="dict.label"
                                    :value="dict.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生成的文章标题/用户提问内容" prop="derivedQuestion">
                        <el-input v-model="form.derivedQuestion" placeholder="请输入生成的文章标题/用户提问内容" />
                    </el-form-item>
                    <el-form-item label="状态(0待创作 1已创作 2已禁用)" prop="status">
                        <el-switch
                            v-model="form.status"
                                active-value="0"
                                inactive-value="1"
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

<script setup name="KeywordDerivedDetailDialog" lang="ts">
    import {
        getKeywordDerived,
        addKeywordDerived,
        updateKeywordDerived
    } from '@/api/geo/keywordDerived';

    import { ElForm } from 'element-plus';
    import { KeywordDerivedForm } from '@/api/geo/keywordDerived/types';
    import { useFormDialog } from '@/hooks/dialog/useFormDialog';
    import modal from '@/plugins/modal';
    import { useDict } from '@/utils/dict';

    type ElFormInstance = InstanceType<typeof ElForm>;

    const { geo_title_type, sys_normal_disable } = toRefs<any>(useDict('geo_title_type', 'sys_normal_disable'));

    const emit = defineEmits(['success']);

    const buttonLoading = ref(false);
    const keywordDerivedFormRef = ref<ElFormInstance>();

    const initFormData: KeywordDerivedForm = {
        derivedId: undefined,
        keywordId: undefined,
        titleType: undefined,
        derivedQuestion: undefined,
        status: undefined,
        remark: undefined,
    };

    const data = reactive<PageData<KeywordDerivedForm, any>>({
        form: { ...initFormData },
        queryParams: {},
        rules: {
            derivedId: [{ required: true, message: '主键ID不能为空', trigger: "change" }],
            keywordId: [{ required: true, message: '关联核心词ID不能为空', trigger: "change" }],
            titleType: [{ required: true, message: '标题类型不能为空', trigger: "change" }],
            derivedQuestion: [{ required: true, message: '生成的文章标题/用户提问内容不能为空', trigger: "blur" }],
            status: [{ required: true, message: '状态(0待创作 1已创作 2已禁用)不能为空', trigger: "change" }],
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
        formRef: keywordDerivedFormRef,
        initialFormData: initFormData
    });

    /** 打开弹窗并根据是否有ID加载数据 */
    const open = async (id?: number | string) => {
        reset();
        if (id) {
            const res = await getKeywordDerived(id);
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
        keywordDerivedFormRef.value?.validate(async (valid: boolean) => {
            if (!valid) return;
            buttonLoading.value = true;
            try {
                const isEdit = !!form.value.derivedId;
                isEdit ? await updateKeywordDerived(form.value) : await addKeywordDerived(form.value);
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
