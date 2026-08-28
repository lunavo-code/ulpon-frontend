<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="模板类型: backend,frontend-vue,frontend-react,sql" prop="type">
                            <el-select v-model="queryParams.type" placeholder="请选择模板类型: backend,frontend-vue,frontend-react,sql" clearable>
                                <el-option label="请选择字典生成" value=""/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生成路径" prop="path">
                            <el-input v-model="queryParams.path" placeholder="请输入生成路径" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="模板名称" prop="name">
                            <el-input v-model="queryParams.name" placeholder="请输入模板名称" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="queryParams.sort" controls-position="right"/>
                        </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup name="TemplateSearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {TemplateQuery} from '@/api/tool/gen/template/types';
    import {useSearchReset} from '@/hooks/form/useSearchReset';

    type ElFormInstance = InstanceType < typeof ElForm >;

    const props = defineProps({
        showSearch: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array as() => string[],
    default: () => [
        'type',
        'path',
        'name',
        'content',
        'sort',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < TemplateQuery > ({
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        version: undefined,
        type: undefined,
        path: undefined,
        name: undefined,
        content: undefined,
        sort: undefined,
        createDept: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
    });

    const allFields = [
        {prop: 'id', label: 'id', index: 0},
        {prop: 'version', label: '版本', index: 1},
        {prop: 'type', label: '模板类型: backend,frontend-vue,frontend-react,sql', index: 2},
        {prop: 'path', label: '生成路径', index: 3},
        {prop: 'name', label: '模板名称', index: 4},
        {prop: 'content', label: '模板内容', index: 5},
        {prop: 'sort', label: '排序', index: 6},
        {prop: 'createDept', label: '创建部门', index: 7},
        {prop: 'createBy', label: '创建者', index: 8},
        {prop: 'createTime', label: '创建时间', index: 9},
        {prop: 'updateBy', label: '更新者', index: 10},
        {prop: 'updateTime', label: '更新时间', index: 11},
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
