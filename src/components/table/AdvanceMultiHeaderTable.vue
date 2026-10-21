<template>
	<div v-if="props.columnsFilter">
		<md-title :title="tableTitle">
			<template #tag> <slot name="extraTitle" /> </template>
			<template #btn>
				<FilterBtn :columns="columns" @changeSelectedColumns="changeSelectedColumns" />
			</template>
		</md-title>
	</div>
	<el-table
		:scrollbar-always-on="true"
		class="force-native-scroll"
		:data="tableData"
		style="width: 100%"
		row-key="id"
		:class="{ 'blue-header': props.blueHeader }"
		:expand-row-keys="expands"
		:default-sort="{ prop: 'date', order: 'descending' }"
		:row-class-name="tableRowClassName"
		:max-height="height"
		:height="fixedHeight"
		:span-method="props.spanMethod"
		@sort-change="handleSortChange"
		ref="tableRef"
		:border="true"
		element-loading-text="拼命加载中..."
		v-loading="loading"
		v-bind="$attrs"
	>
		<el-table-column v-if="props.selection" type="selection" :width="getSize(55)" />
		<el-table-column
			v-if="!props.hideOrder"
			align="center"
			type="index"
			label="序号"
			:width="getSize(65)"
		>
			<template #default="{ $index }">
				{{ $index + 1 + (page.pageNum - 1) * page.pageSize }}
			</template>
		</el-table-column>

		<!-- <slot name="header"></slot> -->
		<template v-for="(col, colIndex) in tableColumns">
			<el-table-column
				:key="colIndex"
				v-if="col.children?.length && col.visible !== false"
				:label="col.label"
				:align="col.align || 'center'"
				:header-align="col.headerAlign || 'left'"
				:min-width="col.width"
				:class-name="col.className"
				:show-overflow-tooltip="col.showToolTip !== false"
			>
				<template v-for="child in col.children" :key="child.prop">
					<el-table-column
						v-if="child.visible !== false"
						:prop="child.prop"
						:label="child.label"
						:sortable="child.sortable"
						:min-width="child.width"
						:width="child.cellWidth || 'auto'"
						:align="child.align"
						:header-align="child.headerAlign || 'left'"
						:class-name="child.className"
						:show-overflow-tooltip="child.showToolTip !== false"
					>
						<template #header="{ row, $index }" v-if="child.slotHeader">
							<template v-if="child.slotHeaderName">
								<slot
									:name="child.slotHeaderName"
									:row="row"
									:index="$index"
									:col="child"
								></slot>
							</template>
							<template v-else>
							{{ child.label }}
								<el-tooltip
									popper-class="header-table-tooltip"
									:content="child.slotHeaderText"
									placement="top"
									effect="light"
								>
									<el-icon class="table-header-el-icon"><WarningFilled /></el-icon>
								</el-tooltip>
							</template>
						</template>
						<template #default="{ row, $index }">
							<template v-if="child.type === 'slot' || child.searchType">
								<slot
									:name="child.slotName"
									:row="row"
									:index="$index"
									:col="child"
								></slot>
							</template>
							<span v-else-if="searchTypeRow === $index && props.showEmptyCell"></span>
							<table-value v-else :col="child" :val="row[child.prop]"></table-value>
						</template>
					</el-table-column>
				</template>
			</el-table-column>
			<el-table-column
				v-else-if="col.visible !== false"
				:key="col.prop"
				:prop="col.prop"
				:label="col.label"
				:sortable="col.sortable"
				:min-width="col.width"
				:width="col.cellWidth || 'auto'"
				:align="col.align"
				:header-align="col.headerAlign || 'left'"
				:fixed="col.fixed"
				:class-name="col.className"
				:show-overflow-tooltip="col.showToolTip !== false"
			>
				<template #header="{ row, $index }" v-if="col.slotHeader">
					<template v-if="col.slotHeaderName">
						<slot
							:name="col.slotHeaderName"
							:row="row"
							:index="$index"
							:col="col"
						></slot>
					</template>
					<template>
						{{ col.label }}
						<el-tooltip
							popper-class="header-table-tooltip"
							:content="col.slotHeaderText"
							placement="top"
							effect="light"
						>
							<el-icon class="table-header-el-icon"><WarningFilled /></el-icon>
						</el-tooltip>
					</template>
			
				</template>
				<template #default="{ row, $index }">
					<template v-if="col.type === 'slot' || col.searchType">
						<slot :name="col.slotName" :row="row" :index="$index" :col="col"></slot>
					</template>
					<span v-else-if="searchTypeRow === $index && props.showEmptyCell"></span>
					<table-value v-else :col="col" :val="row[col.prop]"></table-value>
				</template>
			</el-table-column>
		</template>
	</el-table>
	<div v-if="props.isPage" class="pagination-container">
		<div class="pagination-left">
			<slot name="paginationLeft" />
		</div>
		<el-pagination
			class="custom-class"
			v-model:current-page="page.pageNum"
			v-model:page-size="page.pageSize"
			:page-sizes="[10, 50, 100, 200]"
			layout="total, prev, pager, next,sizes"
			:total="props.total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script lang="ts" setup>
import { Column } from '@/types';
import { getSize } from '@/utils';
import TableValue from '@/components/table/TableValue.vue';
import MdTitle from '@/components/page/MdTitle.vue';
import FilterBtn from './FilterBtn.vue';

interface Row {
	lightingColour: string;
}

const props = withDefaults(
	defineProps<{
		tableData: Array<Record<string, any>>;
		columns: Column[];
		total?: number;
		isPage?: boolean;
		height?: string;
		fixedHeight?: any; // 固定高度
		current?: number;
		selection?: boolean;
		hideOrder?: boolean;
		expands?: string[];
		blueHeader?: boolean;
		// 指定某一行为带搜索组件的，这一行没有搜索组件的地方不显示内容
		searchTypeRow?: number;
		// 搜索行空白单元格是否显示
		showEmptyCell?: boolean;
		loading?: boolean;
		tableTitle?: string;
		columnsFilter?: boolean;
		// 行合并方法
		spanMethod?: (data: { row: any; rowIndex: number; column: any; columnIndex: number }) => { rowspan: number; colspan: number } | undefined; // eslint-disable-line no-unused-vars
	}>(),
	{
		total: 0,
		isPage: false,
		height: 'auto',
		fixedHeight: null,
		current: 0,
		selection: false,
		expands: () => [],
		blueHeader: true,
		searchTypeRow: -1,
		showEmptyCell: true,
		loading: false,
		tableTitle: '',
		columnsFilter: false,
		spanMethod: undefined,
	}
);

// eslint-disable-next-line no-console
const page = reactive<{
	pageNum: number;
	pageSize: number;
}>({
	pageNum: 1,
	pageSize: 10,
});
const notFilterColumns = computed(() => props.columns.filter((col: any) => col.disabledFilter));
const tableColumns = ref<any>([]);

watch(
	() => props.columns,
	() => {
		if (!props.columnsFilter) {
			tableColumns.value = props.columns;
		}
	},
	{
		immediate: true,
	}
);

const tableRowClassName = ({ row }: { row: Row }) => {
	let ret = '';
	if (row.lightingColour === '1') {
		ret = 'red';
	} else if (row.lightingColour === '2') {
		ret = 'yellow';
	} else if (row.lightingColour === '3') {
		ret = 'green';
	}
	return ret;
};
const emit = defineEmits(['handleSizeChange', 'handleCurrentChange', 'handleSortChange']);

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	let order1 = '';
	if (order && order === 'ascending') {
		order1 = 'asc';
	}
	if (order && order === 'descending') {
		order1 = 'desc';
	}
	emit('handleSortChange', { prop, order: order1 });
};

watch(
	() => props.current,
	() => {
		page.pageNum = props.current as number;
	}
);
const handleSizeChange = (size: number) => {
	emit('handleSizeChange', size);
	emit('handleCurrentChange', 1);
};
const handleCurrentChange = (currentPage: number) => {
	emit('handleCurrentChange', currentPage);
};
const changeSelectedColumns = (col: any) => {
	if (col) {
		tableColumns.value = notFilterColumns.value.concat(
			props.columns.filter((item: any) => col.includes(item.label))
		);
	} else {
		tableColumns.value = notFilterColumns.value;
	}
};
const tableRef = ref();
defineExpose({ tableRef });
</script>

<style lang="less" scoped>
:deep(.title-part) {
	.title-part-right {
		position: absolute;
		right: 0.5rem;
		top: -0.08rem;
	}
}
.blue-header.el-table {
	--el-table-border: 1px solid #aaccff;
	--el-table-border-color: #aaccff;
	border-radius: 0.04rem;
	&.has-footer.el-table--fluid-height {
		:deep(tr):last-child td.el-table__cell {
			border-bottom-color: #aaccff !important;
		}
	}
	&.el-table--border::after {
		background-color: var(--el-table-border-color);
		width: 1px;
	}
	:deep(.cell) {
		padding: 0 0.16rem;
	}
	:deep(thead) {
		th {
			background: #0268fb !important;
			color: #fff !important;
			font-size: 0.16rem;
		}
		.el-table__cell {
			border-right-color: rgba(255, 255, 255, 0.5) !important;
			border-bottom-color: rgba(255, 255, 255, 0.5);
			padding: 0.04rem 0;
		}
	}

	:deep(tbody) {
		.el-table__cell {
			color: #1d2129;
			padding: 0.08rem 0;
		}
		.bold-text {
			font-weight: 500;
		}
	}
	:deep(.group-header) {
		background-color: #f8fafe;
		font-weight: bold;
		text-align: left;
		.cell {
			color: #0068fb;
			font-weight: 500;
			font-size: 0.18rem;
		}
	}
	:deep(.cursor-pointer) {
		cursor: pointer !important;
	}
	:deep(.group-header1) {
		background-color: #e5edfd;
		font-weight: bold;
		text-align: left;
		.cell {
			color: #0068fb;
			font-weight: 500;
			font-size: 0.16rem;
		}
	}
	:deep(.group-header2) {
		background-color: #e5edfd;
		font-weight: bold;
		text-align: left;
		.cell {
			color: #000;
			font-weight: 500;
			font-size: 0.16rem;
		}
	}
	:deep(.search-row),
	:deep(.total-row) {
		td:nth-of-type(1) {
			border-left: var(--el-table-border);
		}
	}
}
.pagination-container {
	position: relative;
	width: 100%;
	margin-top: @space-size-16;
	.pagination-left {
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		height: 100%;
		font-size: @assistant-font-size;
		color: @text-color-secondary;
	}
}
.el-pagination {
	--el-pagination-font-size: 0.16rem;
	justify-content: end;
	font-size: @content-font-size;
}
.el-table {
	:deep(th) {
		background-color: #eff4fe !important;
		color: @table-header-text-color;
		line-height: 0.22rem;
		font-size: @table-font-size;
	}
	:deep(.el-table__cell) {
		padding: 0.08rem 0;
	}
	:deep(tbody) {
		.el-table__cell {
			font-size: 0.18rem;
		}
	}
}
.force-native-scroll {
	height: 68vh;
}
</style>