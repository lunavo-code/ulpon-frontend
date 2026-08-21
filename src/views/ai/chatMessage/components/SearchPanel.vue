<template>
    <div class="search-wrap">
        <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
            <template #header>
                <div class="panel-heading search-panel-toggle" @click.stop="toggleSearch">
                    <div><h3>筛选条件</h3></div>
                </div>
            </template>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">

                        <el-form-item label="关联会话 ID" prop="sessionId">
                            <el-input-number v-model="queryParams.sessionId" controls-position="right"/>
                        </el-form-item>
                        <el-form-item label="角色类型" prop="role">
                            <el-input v-model="queryParams.role" placeholder="请输入角色类型" clearable @keyup.enter="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="Token 消耗数" prop="tokenCount">
                            <el-input-number v-model="queryParams.tokenCount" controls-position="right"/>
                        </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup name="ChatMessageSearchPanel" lang="ts">
    import {ElForm} from 'element-plus';
    import {ChatMessageQuery} from '@/api/ai/chatMessage/types';
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
        'sessionId',
        'role',
        'content',
        'tokenCount',
    ]
    }
    });

    const emit = defineEmits(['update:showSearch', 'search']);

    const queryFormRef = ref < ElFormInstance > ();
    const queryParams = ref < ChatMessageQuery > ({
        pageNum: 1,
        pageSize: 10,
        messageId: undefined,
        sessionId: undefined,
        role: undefined,
        content: undefined,
        tokenCount: undefined,
        delFlag: undefined,
        createDept: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
    });

    const allFields = [
        {prop: 'messageId', label: '主键 ID', index: 0},
        {prop: 'sessionId', label: '关联会话 ID', index: 1},
        {prop: 'role', label: '角色类型', index: 2},
        {prop: 'content', label: '消息内容', index: 3},
        {prop: 'tokenCount', label: 'Token 消耗数', index: 4},
        {prop: 'delFlag', label: '删除标志', index: 5},
        {prop: 'createDept', label: '创建部门', index: 6},
        {prop: 'createBy', label: '创建者', index: 7},
        {prop: 'createTime', label: '创建时间', index: 8},
        {prop: 'updateBy', label: '更新者', index: 9},
        {prop: 'updateTime', label: '更新时间', index: 10},
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
