<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="公司/品牌名称" prop="companyName">
                            <el-input v-model="queryParams.companyName" placeholder="请输入公司/品牌名称" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="关键词分类" prop="keywordType">
                            <el-select v-model="queryParams.keywordType" placeholder="请选择关键词分类" clearable>
                                <el-option v-for="dict in geo_keyword_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="核心关键词" prop="keyword">
                            <el-input v-model="queryParams.keyword" placeholder="请输入核心关键词" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="状态(0启用 1停用)" prop="status">
                            <el-select v-model="queryParams.status" placeholder="请选择状态(0启用 1停用)" clearable>
                                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
                            </el-select>
                        </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup name="KeywordSearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {KeywordQuery} from '@/api/geo/keyword/types';
    import {useSearchReset} from '@/hooks/form/useSearchReset';
    import { useDict } from '@/utils/dict';

    type ElFormInstance = InstanceType < typeof ElForm >;

    const { geo_keyword_type, sys_normal_disable } = toRefs<any>(useDict('geo_keyword_type', 'sys_normal_disable'));

    const props = defineProps({
        showSearch: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array as() => string[],
    default: () => [
        'companyName',
        'keywordType',
        'keyword',
        'status',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < KeywordQuery > ({
        pageNum: 1,
        pageSize: 10,
        keywordId: undefined,
        companyName: undefined,
        keywordType: undefined,
        keyword: undefined,
        status: undefined,
        delFlag: undefined,
        createDept: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
    });

    const allFields = [
        {prop: 'keywordId', label: '主键ID', index: 0},
        {prop: 'companyName', label: '公司/品牌名称', index: 1},
        {prop: 'keywordType', label: '关键词分类', index: 2},
        {prop: 'keyword', label: '核心关键词', index: 3},
        {prop: 'status', label: '状态(0启用 1停用)', index: 4},
        {prop: 'delFlag', label: '删除标志(0代表存在 2代表删除)', index: 5},
        {prop: 'createDept', label: '创建部门', index: 6},
        {prop: 'createBy', label: '创建者', index: 7},
        {prop: 'createTime', label: '创建时间', index: 8},
        {prop: 'updateBy', label: '更新者', index: 9},
        {prop: 'updateTime', label: '更新时间', index: 10},
        {prop: 'remark', label: '备注', index: 11},
    ];

    const activeFields = computed(() => {
        return props.fields
            .map(name => allFields.find(field => field.prop === name))
            .filter((field): field is typeof allFields[number] => !!field);
    });

    /** 搜索按钮操作 */
    const handleQuery = () => {
        emit('search', {...queryParams.value});
    };

    const {resetQuery} = useSearchReset({
        queryFormRef,
        queryParams,
        afterReset: handleQuery
    });

    const toggleSearch = () => {
        emit('update:showSearch', !props.showSearch);
    };
</script>
