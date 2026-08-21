<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="提供商名称" prop="providerName">
                            <el-input v-model="queryParams.providerName" placeholder="请输入提供商名称" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="提供商唯一标识键" prop="providerCode">
                            <el-input v-model="queryParams.providerCode" placeholder="请输入提供商唯一标识键" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="默认 API 接口地址" prop="defaultBaseUrl">
                            <el-input v-model="queryParams.defaultBaseUrl" placeholder="请输入默认 API 接口地址" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="启用状态" prop="status">
                            <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable>
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

<script setup name="ModelProviderSearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {ModelProviderQuery} from '@/api/ai/modelProvider/types';
    import {useSearchReset} from '@/hooks/form/useSearchReset';
    import { useDict } from '@/utils/dict';

    type ElFormInstance = InstanceType < typeof ElForm >;

    const { sys_normal_disable } = toRefs<any>(useDict('sys_normal_disable'));

    const props = defineProps({
        showSearch: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array as() => string[],
    default: () => [
        'providerName',
        'providerCode',
        'defaultBaseUrl',
        'status',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < ModelProviderQuery > ({
        pageNum: 1,
        pageSize: 10,
        providerId: undefined,
        providerName: undefined,
        providerCode: undefined,
        defaultBaseUrl: undefined,
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
        {prop: 'providerId', label: '主键 ID', index: 0},
        {prop: 'providerName', label: '提供商名称', index: 1},
        {prop: 'providerCode', label: '提供商唯一标识键', index: 2},
        {prop: 'defaultBaseUrl', label: '默认 API 接口地址', index: 3},
        {prop: 'status', label: '启用状态', index: 4},
        {prop: 'delFlag', label: '删除标志', index: 5},
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
