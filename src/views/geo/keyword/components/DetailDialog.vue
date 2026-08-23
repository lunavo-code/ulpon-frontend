<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
    <el-form ref="keywordFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="公司/品牌名称" prop="companyName">
        <el-input v-model="form.companyName" placeholder="请输入公司/品牌名称"/>
      </el-form-item>
      <el-form-item label="关键词分类" prop="keywordType">
        <el-select v-model="form.keywordType" placeholder="请选择关键词分类">
          <el-option
            v-for="dict in geo_keyword_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="核心关键词" prop="keyword">
        <el-input v-model="form.keyword" placeholder="请输入核心关键词"/>
      </el-form-item>
      <el-form-item label="状态(0启用 1停用)" prop="status">
        <el-switch
          v-model="form.status"
          active-value="0"
          inactive-value="1"
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

<script setup name="KeywordDetailDialog" lang="ts">
import {
  getKeyword,
  addKeyword,
  updateKeyword
} from '@/api/geo/keyword';

import {ElForm} from 'element-plus';
import {KeywordForm} from '@/api/geo/keyword/types';
import {useFormDialog} from '@/hooks/dialog/useFormDialog';
import modal from '@/plugins/modal';
import {useDict} from '@/utils/dict';

type ElFormInstance = InstanceType<typeof ElForm>;

const {geo_keyword_type, sys_normal_disable} = toRefs<any>(useDict('geo_keyword_type', 'sys_normal_disable'));

const emit = defineEmits(['success']);

const buttonLoading = ref(false);
const keywordFormRef = ref<ElFormInstance>();

const initFormData: KeywordForm = {
  keywordId: undefined,
  companyName: undefined,
  keywordType: undefined,
  keyword: undefined,
  status: undefined,
  remark: undefined,
};

const data = reactive<PageData<KeywordForm, any>>({
  form: {...initFormData},
  queryParams: {},
  rules: {
    keywordId: [{required: true, message: '主键ID不能为空', trigger: "change"}],
    companyName: [{required: true, message: '公司/品牌名称不能为空', trigger: "blur"}],
    keywordType: [{required: true, message: '关键词分类不能为空', trigger: "change"}],
    keyword: [{required: true, message: '核心关键词不能为空', trigger: "blur"}],
    status: [{required: true, message: '状态(0启用 1停用)不能为空', trigger: "change"}],
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
  formRef: keywordFormRef,
  initialFormData: initFormData
});

/** 打开弹窗并根据是否有ID加载数据 */
const open = async (id?: number | string) => {
  reset();
  if (id) {
    const res = await getKeyword(id);
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
  keywordFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    buttonLoading.value = true;
    try {
      const isEdit = !!form.value.keywordId;
      isEdit ? await updateKeyword(form.value) : await addKeyword(form.value);
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
