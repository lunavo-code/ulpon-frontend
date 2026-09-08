<template>
    <el-card shadow="hover" class="table-panel">
        <template #header>
            <div class="toolbar-shell">
                <div class="table-heading"><h3>代码生成模板列表</h3></div>
                <div class="toolbar-actions">
                    <el-button v-hasPermi="['gen:template:add']" type="primary" plain icon="Plus" @click="handleAdd">
                        新增
                    </el-button>
                    <el-button v-hasPermi="['gen:template:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()">
                        修改
                    </el-button>
                    <el-button v-hasPermi="['gen:template:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">
                        删除
                    </el-button>
                    <el-button v-hasPermi="['gen:template:export']" type="warning" plain icon="Download" @click="handleExport">
                        导出
                    </el-button>
                    <right-toolbar :show-search="showSearch" :columns="columns" :search="false" @update:show-search="handleToggleSearch" @query-table="getList"/>
                </div>
            </div>
        </template>

        <el-table v-loading="loading" border class="data-table" :data="templateList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <template v-for="col in columns" :key="col.prop">
                        <el-table-column v-if="col.visible && col.prop === 'id'" label="id" align="center" prop="id"/>
                        <el-table-column v-if="col.visible && col.prop === 'type'" label="模板类型: backend,frontend-vue,frontend-react,sql" align="center" prop="type"/>
                        <el-table-column v-if="col.visible && col.prop === 'path'" label="生成路径" align="center" prop="path"/>
                        <el-table-column v-if="col.visible && col.prop === 'name'" label="模板名称" align="center" prop="name"/>
                        <!-- <el-table-column v-if="col.visible && col.prop === 'content'" label="模板内容" align="center" prop="content"/> -->
                        <el-table-column v-if="col.visible && col.prop === 'sort'" label="排序" align="center" prop="sort"/>
            </template>
            <el-table-column  label="操作" align="center" width="160" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-tooltip content="在线设计/预览" placement="top">
                        <el-button link type="primary" icon="VideoPlay" @click="handleDesign(scope.row)" v-hasPermi="['gen:template:edit']"></el-button>
                    </el-tooltip>
                    <el-tooltip content="修改" placement="top">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['gen:template:edit']"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['gen:template:remove']"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList"/>
    </el-card>
</template>

<script setup name="TemplateTablePanel" lang="ts">
    import {useRouter} from 'vue-router';
    import {listTemplate, delTemplate} from '@/api/tool/gen/template';
    import {TemplateVO, TemplateQuery} from '@/api/tool/gen/template/types';
    import {useLoading} from '@/hooks/async/useLoading';
    import {useTableSelection} from '@/hooks/table/useTableSelection';
    import modal from '@/plugins/modal';
    import {download as requestDownload} from '@/utils/request';

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
        'id',
        'type',
        'path',
        'name',
        'content',
        'sort',
    ]
    }
    });

    const emit = defineEmits([
        'update:showSearch',
        'add',
        'edit'
    ]);

    const templateList = ref<TemplateVO[]> ([]);
    const total = ref(0);
    const {loading, withLoading} = useLoading(true);

    const allColumnsMeta = [
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

    const queryParams = reactive < TemplateQuery > ({
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


    const {ids, single, multiple, handleSelectionChange} = useTableSelection < TemplateVO > (item => item.id);

    /** 查询代码生成模板列表 */
    const getList = async () => {
        await withLoading(async () => {
            let params = queryParams;
            const res = await listTemplate(params);
            templateList.value = res.data?.rows || [];
            total.value = res.data?.total || 0;
        });
    };

    /** 外部应用查询过滤条件 */
    const applyFilters = (filters: Partial<TemplateQuery>) => {
        queryParams.pageNum = 1;
        // 清理先前的过滤参数，防止属性残留污染
        queryParams.type = undefined;
        queryParams.path = undefined;
        queryParams.name = undefined;
        queryParams.content = undefined;
        queryParams.sort = undefined;
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

    const router = useRouter();

    const handleDesign = (row: any) => {
        const id = row?.id || ids.value[0];
        router.push({
            path: id ? `/tool/gen-editor/index/${id}` : '/tool/gen-editor/index'
        });
    };

    const handleUpdate = (row?: any) => {
        const id = row?.id || ids.value[0];
        emit('edit', id);
    };

    /** 删除按钮操作 */
    const handleDelete = async (row?: any) => {
        const targetIds = row?.id ? [row.id] : ids.value;
        await modal.confirm('是否确认删除测试单编号为"' + targetIds + '"的数据项？');
        await withLoading(async () => {
            await delTemplate(targetIds);
        });
        modal.msgSuccess('删除成功');
        await getList();
    };

    /** 导出按钮操作 */
    const handleExport = () => {
        requestDownload(
            'template/template/export',
            {
                ...queryParams
            },
            `代码生成模板_Template_${new Date().getTime()}.xlsx`
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
