<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="关联核心词ID" prop="keywordId">
                            <select-panel v-model="queryParams.keywordId" :displayColumns="['keyword']"/>
                            <!-- <el-input-number v-model="queryParams.keywordId" controls-position="right"/> -->
                        </el-form-item>
                        <el-form-item label="标题类型" prop="titleType">
                            <dict-select v-model="queryParams.titleType" dict-type="geo_title_type" placeholder="请选择标题类型" clearable/>
                        </el-form-item>
                        <el-form-item label="生成的文章标题/用户提问内容" prop="derivedQuestion">
                            <el-input v-model="queryParams.derivedQuestion" placeholder="请输入生成的文章标题/用户提问内容" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="状态(0待创作 1已创作 2已禁用)" prop="status">
                            <dict-select v-model="queryParams.status" dict-type="geo_derived_status" placeholder="请选择状态" clearable/>
                        </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup name="KeywordDerivedSearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {KeywordDerivedQuery} from '@/api/geo/keywordDerived/types';
    import {useSearchReset} from '@/hooks/form/useSearchReset';
    import SelectPanel from '../../keyword/components/SelectPanel.vue';

    type ElFormInstance = InstanceType < typeof ElForm >;

    const props = defineProps({
        showSearch: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array as() => string[],
    default: () => [
        'keywordId',
        'titleType',
        'derivedQuestion',
        'status',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < KeywordDerivedQuery > ({
        pageNum: 1,
        pageSize: 10,
        derivedId: undefined,
        keywordId: undefined,
        titleType: undefined,
        derivedQuestion: undefined,
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
        {prop: 'derivedId', label: '主键ID', index: 0},
        {prop: 'keywordId', label: '关联核心词ID', index: 1},
        {prop: 'titleType', label: '标题类型', index: 2},
        {prop: 'derivedQuestion', label: '生成的文章标题/用户提问内容', index: 3},
        {prop: 'status', label: '状态(0待创作 1已创作 2已禁用)', index: 4},
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
        console.log('queryParams.value', queryParams.value);
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
