<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="能力名称" prop="capabilityName">
                            <el-input v-model="queryParams.capabilityName" placeholder="请输入能力名称" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="任务描述简介" prop="description">
                            <el-input v-model="queryParams.description" placeholder="请输入任务描述简介" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="系统提示词 (System Prompt)" prop="systemPrompt">
                            <el-input v-model="queryParams.systemPrompt" placeholder="请输入系统提示词 (System Prompt)" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="关联大模型配置 ID" prop="modelConfigId">
                            <el-input-number v-model="queryParams.modelConfigId" controls-position="right"/>
                        </el-form-item>
                        <el-form-item label="可见范围类型" prop="scopeType">
                            <el-select v-model="queryParams.scopeType" placeholder="请选择可见范围类型" clearable>
                                <el-option v-for="dict in ai_agent_visibility" :key="dict.value" :label="dict.label" :value="dict.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属部门 ID" prop="deptId">
                            <el-input-number v-model="queryParams.deptId" controls-position="right"/>
                        </el-form-item>
                        <el-form-item label="创建人用户 ID" prop="userId">
                            <el-input-number v-model="queryParams.userId" controls-position="right"/>
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

<script setup name="CapabilitySearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {CapabilityQuery} from '@/api/ai/capability/types';
    import {useSearchReset} from '@/hooks/form/useSearchReset';
    import { useDict } from '@/utils/dict';

    type ElFormInstance = InstanceType < typeof ElForm >;

    const { ai_agent_visibility, sys_normal_disable } = toRefs<any>(useDict('ai_agent_visibility', 'sys_normal_disable'));

    const props = defineProps({
        showSearch: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array as() => string[],
    default: () => [
        'capabilityName',
        'description',
        'systemPrompt',
        'modelConfigId',
        'scopeType',
        'deptId',
        'userId',
        'status',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < CapabilityQuery > ({
        pageNum: 1,
        pageSize: 10,
        capabilityId: undefined,
        capabilityName: undefined,
        description: undefined,
        systemPrompt: undefined,
        modelConfigId: undefined,
        scopeType: undefined,
        deptId: undefined,
        userId: undefined,
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
        {prop: 'capabilityId', label: '主键 ID', index: 0},
        {prop: 'capabilityName', label: '能力名称', index: 1},
        {prop: 'description', label: '任务描述简介', index: 2},
        {prop: 'systemPrompt', label: '系统提示词 (System Prompt)', index: 3},
        {prop: 'modelConfigId', label: '关联大模型配置 ID', index: 4},
        {prop: 'scopeType', label: '可见范围类型', index: 5},
        {prop: 'deptId', label: '所属部门 ID', index: 6},
        {prop: 'userId', label: '创建人用户 ID', index: 7},
        {prop: 'status', label: '启用状态', index: 8},
        {prop: 'delFlag', label: '删除标志', index: 9},
        {prop: 'createDept', label: '创建部门', index: 10},
        {prop: 'createBy', label: '创建者', index: 11},
        {prop: 'createTime', label: '创建时间', index: 12},
        {prop: 'updateBy', label: '更新者', index: 13},
        {prop: 'updateTime', label: '更新时间', index: 14},
        {prop: 'remark', label: '备注', index: 15},
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
