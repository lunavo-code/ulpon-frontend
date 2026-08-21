<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="会话名称" prop="sessionName">
                            <el-input v-model="queryParams.sessionName" placeholder="请输入会话名称" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="关联智能体 ID" prop="agentId">
                            <el-input-number v-model="queryParams.agentId" controls-position="right"/>
                        </el-form-item>
                        <el-form-item label="会话所有者 ID" prop="userId">
                            <el-input-number v-model="queryParams.userId" controls-position="right"/>
                        </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup name="ChatSessionSearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {ChatSessionQuery} from '@/api/ai/chatSession/types';
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
        'sessionName',
        'agentId',
        'userId',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < ChatSessionQuery > ({
        pageNum: 1,
        pageSize: 10,
        sessionId: undefined,
        sessionName: undefined,
        agentId: undefined,
        userId: undefined,
        delFlag: undefined,
        createDept: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
    });

    const allFields = [
        {prop: 'sessionId', label: '主键 ID', index: 0},
        {prop: 'sessionName', label: '会话名称', index: 1},
        {prop: 'agentId', label: '关联智能体 ID', index: 2},
        {prop: 'userId', label: '会话所有者 ID', index: 3},
        {prop: 'delFlag', label: '删除标志', index: 4},
        {prop: 'createDept', label: '创建部门', index: 5},
        {prop: 'createBy', label: '创建者', index: 6},
        {prop: 'createTime', label: '创建时间', index: 7},
        {prop: 'updateBy', label: '更新者', index: 8},
        {prop: 'updateTime', label: '更新时间', index: 9},
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
