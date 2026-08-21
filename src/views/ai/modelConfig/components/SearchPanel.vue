<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="提供商 ID" prop="providerId">
                            <el-input-number v-model="queryParams.providerId" controls-position="right"/>
                        </el-form-item>
                        <el-form-item label="配置别名/名称" prop="configName">
                            <el-input v-model="queryParams.configName" placeholder="请输入配置别名/名称" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="目标模型名称" prop="modelName">
                            <el-input v-model="queryParams.modelName" placeholder="请输入目标模型名称" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="API 接口覆盖地址" prop="baseUrl">
                            <el-input v-model="queryParams.baseUrl" placeholder="请输入API 接口覆盖地址" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="API 密钥 (Script Key)" prop="apiKey">
                            <el-input v-model="queryParams.apiKey" placeholder="请输入API 密钥 (Script Key)" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="最大生成 Token 数" prop="maxTokens">
                            <el-input-number v-model="queryParams.maxTokens" controls-position="right"/>
                        </el-form-item>
                        <el-form-item label="温度参数 (0.0 ~ 2.0)" prop="temperature">
                            <el-input-number v-model="queryParams.temperature" controls-position="right"/>
                        </el-form-item>
                        <el-form-item label="启用状态" prop="status">
                            <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable>
                                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否为默认模型" prop="isDefault">
                            <el-select v-model="queryParams.isDefault" placeholder="请选择是否为默认模型" clearable>
                                <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"/>
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

<script setup name="ModelConfigSearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {ModelConfigQuery} from '@/api/ai/modelConfig/types';
    import {useSearchReset} from '@/hooks/form/useSearchReset';
    import { useDict } from '@/utils/dict';

    type ElFormInstance = InstanceType < typeof ElForm >;

    const { sys_normal_disable, sys_yes_no } = toRefs<any>(useDict('sys_normal_disable', 'sys_yes_no'));

    const props = defineProps({
        showSearch: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array as() => string[],
    default: () => [
        'providerId',
        'configName',
        'modelName',
        'baseUrl',
        'apiKey',
        'maxTokens',
        'temperature',
        'status',
        'isDefault',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < ModelConfigQuery > ({
        pageNum: 1,
        pageSize: 10,
        modelConfigId: undefined,
        providerId: undefined,
        configName: undefined,
        modelName: undefined,
        baseUrl: undefined,
        apiKey: undefined,
        maxTokens: undefined,
        temperature: undefined,
        status: undefined,
        isDefault: undefined,
        delFlag: undefined,
        createDept: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
    });

    const allFields = [
        {prop: 'modelConfigId', label: '主键 ID', index: 0},
        {prop: 'providerId', label: '提供商 ID', index: 1},
        {prop: 'configName', label: '配置别名/名称', index: 2},
        {prop: 'modelName', label: '目标模型名称', index: 3},
        {prop: 'baseUrl', label: 'API 接口覆盖地址', index: 4},
        {prop: 'apiKey', label: 'API 密钥 (Script Key)', index: 5},
        {prop: 'maxTokens', label: '最大生成 Token 数', index: 6},
        {prop: 'temperature', label: '温度参数 (0.0 ~ 2.0)', index: 7},
        {prop: 'status', label: '启用状态', index: 8},
        {prop: 'isDefault', label: '是否为默认模型', index: 9},
        {prop: 'delFlag', label: '删除标志', index: 10},
        {prop: 'createDept', label: '创建部门', index: 11},
        {prop: 'createBy', label: '创建者', index: 12},
        {prop: 'createTime', label: '创建时间', index: 13},
        {prop: 'updateBy', label: '更新者', index: 14},
        {prop: 'updateTime', label: '更新时间', index: 15},
        {prop: 'remark', label: '备注', index: 16},
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
