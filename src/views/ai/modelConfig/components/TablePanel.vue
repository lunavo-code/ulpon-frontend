<template>
    <el-card shadow="hover" class="table-panel">
        <template #header>
            <div class="toolbar-shell">
                <div class="table-heading"><h3>大模型配置列表</h3></div>
                <div class="toolbar-actions">
                    <el-button v-hasPermi="['ai:modelConfig:add']" type="primary" plain icon="Plus" @click="handleAdd">
                        新增
                    </el-button>
                    <el-button v-hasPermi="['ai:modelConfig:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()">
                        修改
                    </el-button>
                    <el-button v-hasPermi="['ai:modelConfig:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">
                        删除
                    </el-button>
                    <el-button v-hasPermi="['ai:modelConfig:export']" type="warning" plain icon="Download" @click="handleExport">
                        导出
                    </el-button>
                    <right-toolbar :show-search="showSearch" :columns="columns" :search="false" @update:show-search="handleToggleSearch" @query-table="getList"/>
                </div>
            </div>
        </template>

        <el-table v-loading="loading" border class="data-table" :data="modelConfigList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column label="主键 ID" align="center" prop="modelConfigId"/>
                    <el-table-column label="提供商 ID" align="center" prop="providerName"/>
                    <el-table-column label="配置别名/名称" align="center" prop="configName"/>
                    <el-table-column label="目标模型名称" align="center" prop="modelName"/>
                    <el-table-column label="API 接口覆盖地址" align="center" prop="baseUrl"/>
                    <el-table-column label="API 密钥 (Script Key)" align="center" prop="apiKey"/>
                    <el-table-column label="最大生成 Token 数" align="center" prop="maxTokens"/>
                    <el-table-column label="温度参数 (0.0 ~ 2.0)" align="center" prop="temperature"/>
                    <el-table-column label="启用状态" align="center" prop="status" width="120">
                        <template #default="scope">
                            <el-switch
                                v-model="scope.row.status"
                                    :active-value="true"
                                    :inactive-value="false"
                                disabled
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="是否为默认模型" align="center" prop="isDefault" width="120">
                        <template #default="scope">
                            <el-switch
                                v-model="scope.row.isDefault"
                                    :active-value="true"
                                    :inactive-value="false"
                                disabled
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" align="center" prop="remark"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-tooltip content="修改" placement="top">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ai:modelConfig:edit']"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ai:modelConfig:remove']"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList"/>
    </el-card>
</template>

<script setup name="ModelConfigTablePanel" lang="ts">
    import {listModelConfig, delModelConfig} from '@/api/ai/modelConfig';
    import {ModelConfigVO, ModelConfigQuery} from '@/api/ai/modelConfig/types';
    import {useLoading} from '@/hooks/async/useLoading';
    import {useTableSelection} from '@/hooks/table/useTableSelection';
    import modal from '@/plugins/modal';
    import {download as requestDownload} from '@/utils/request';
    import { useDict } from '@/utils/dict';

    // 扩展字段属性接口
    interface TableFieldOption extends FieldOption {
        prop: string;
    }

    const props = defineProps({
        showSearch: {
            type: Boolean,
            default: true
        },
        visibleColumns: {
            type: Array as() => string[],
    default: () => [
        'modelConfigId',
        'providerId',
        'configName',
        'modelName',
        'baseUrl',
        'apiKey',
        'maxTokens',
        'temperature',
        'status',
        'isDefault',
        'remark',
    ]
    }
    });

    const emit = defineEmits([
        'update:showSearch',
        'add',
        'edit'
    ]);

    const modelConfigList = ref<ModelConfigVO[]> ([]);
    const total = ref(0);
    const {loading, withLoading} = useLoading(true);

    const allColumnsMeta = [
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

    const { sys_normal_disable, sys_yes_no } = toRefs<any>(useDict('sys_normal_disable', 'sys_yes_no'));

    // 用于 right-toolbar 显隐列勾选框的数据源
    const columns = ref<TableFieldOption[]> ([]);

    // 监听可见列配置的变化，动态生成列显隐信息及其显示顺序
    watch(
        () => props.visibleColumns,
        (newVal) => {
            columns.value = newVal
                .map((name, index) => {
                    const meta = allColumnsMeta.find(col => col.prop === name);
                    return meta ? {key: index, label: meta.label, visible: true, prop: meta.prop} : null;
                })
                .filter((col): col is TableFieldOption => !!col);
        },
        {immediate: true}
    );

    // 过滤出当前显示的可视列
    const visibleColumnsList = computed(() => {
        return columns.value.filter(col => col.visible);
    });

    const queryParams = reactive < ModelConfigQuery > ({
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


    const {ids, single, multiple, handleSelectionChange} = useTableSelection < ModelConfigVO > (item => item.modelConfigId);

    /** 查询大模型配置列表 */
    const getList = async () => {
        await withLoading(async () => {
            let params = queryParams.value;
            const res = await listModelConfig(params);
            modelConfigList.value = res.data?.rows || [];
            total.value = res.data?.total || 0;
        });
    };

    /** 外部应用查询过滤条件 */
    const applyFilters = (filters: Partial<ModelConfigQuery>) => {
        queryParams.pageNum = 1;
        // 清理先前的过滤参数，防止属性残留污染
        queryParams.providerId = undefined;
        queryParams.configName = undefined;
        queryParams.modelName = undefined;
        queryParams.baseUrl = undefined;
        queryParams.apiKey = undefined;
        queryParams.maxTokens = undefined;
        queryParams.temperature = undefined;
        queryParams.status = undefined;
        queryParams.isDefault = undefined;
        // 动态合并最新的过滤条件
        Object.assign(queryParams, filters);
        getList();
    };

    /** 外部指示刷新列表 */
    const refresh = () => {
        getList();
    };

    const handleToggleSearch = (val: boolean) => {
        emit('update:showSearch', val);
    };

    const handleAdd = () => {
        emit('add');
    };

    const handleUpdate = (row?: any) => {
        const id = row?.modelConfigId || ids.value[0];
        emit('edit', id);
    };

    /** 删除按钮操作 */
    const handleDelete = async (row?: any) => {
        const targetIds = row?.modelConfigId ? [row.modelConfigId] : ids.value;
        await modal.confirm('是否确认删除测试单编号为"' + targetIds + '"的数据项？');
        await withLoading(async () => {
            await delModelConfig(targetIds);
        });
        modal.msgSuccess('删除成功');
        await getList();
    };

    /** 导出按钮操作 */
    const handleExport = () => {
        requestDownload(
            'modelConfig/modelConfig/export',
            {
                ...queryParams
            },
            `大模型配置_ModelConfig_${new Date().getTime()}.xlsx`
        );
    };

    onMounted(() => {
        getList();
    });

    defineExpose({
        applyFilters,
        refresh
    });
</script>
