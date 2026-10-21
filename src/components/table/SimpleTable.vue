<template>
	<div>
		<el-table
      ref="tableRef"
			:data="tableData"
			style="width: 100%"
			class="table-box force-native-scroll"
			row-key="id"
			:expand-row-keys="expands"
			:default-sort="{ prop: 'date', order: 'descending' }"
			:row-class-name="tableRowClassName"
			@row-click="handleRowClick"
			:max-height="height"
      @select="select"
      @selectAll="selectAll"
			@sort-change="handleSortChange"
			@selection-change="handleSelectionChange"
			v-loading="isLoading"
			element-loading-text="拼命加载中..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0)"
			:empty-text="emptyText"
		>
			<el-table-column v-if="props.selection"  reserve-selection type="selection" width="55" />
			<el-table-column
				v-if="!props.hideOrder"
				align="center"
				type="index"
				label="序号"
				width="65"
			>
				<template #default="{ $index }">
					{{ $index + 1 + (page.pageNum - 1) * page.pageSize }}
				</template>
			</el-table-column>

			<!-- <slot name="header"></slot> -->
			<template v-for="(col, colIndex) in columns">
				<el-table-column
					v-if="col.visible !== false"
					:key="colIndex"
					:prop="col.prop"
					:label="col.label"
					:sortable="col.sortable"
					:min-width="col.width"
					:width="col.cellWidth || 'auto'"
					:align="col.align"
          :fixed="col.fixed"
					:class-name="col.className"
					:show-overflow-tooltip="col.showToolTip !== false"
				>
					<template #default="{ row, $index }">
						<template v-if="col.type === 'slot'">
							<slot :name="col.slotName" :row="row" :index="$index" :col="col"></slot>
						</template>
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
	</div>
</template>

<script lang="ts" setup>
import { Column } from '@/types';
import TableValue from '@/components/table/TableValue.vue';

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
		current?: number;
		selection?: boolean;
		hideOrder?: boolean;
		expands?: string[];
		isLoading?: boolean;
		emptyText?: string;
	}>(),
	{
		total: 0,
		isPage: false,
		height: 'auto',
		current: 0,
		selection: false,
		expands: () => [],
		isLoading: false,
		emptyText: '暂无数据',
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
const emit = defineEmits([
	'handleSizeChange',
	'handleCurrentChange',
	'handleLink',
	'handleSortChange',
	'handleSelectionChange',
    'selectAllData',
    'selectData'
]);
const selectAll = (data:any) => {
  console.log(645664);
  emit('selectAllData', data)
}
const select = (data:any) => {
  console.log(5655);
  console.log(data);
  emit('selectData', data || [])
}
const handleRowClick = (row: any) => {
	emit('handleLink', row);
};

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

const handleSelectionChange = (row: any[]) => {
	emit('handleSelectionChange', row);
};

const tableRef = ref<any>(null);
// 暴露方法给父组件使用
defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: any, selected?: boolean) =>
      tableRef.value?.toggleRowSelection(row, selected),
  getTableRef: () => tableRef.value
});
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
</script>

<style lang="less" scoped>
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

.table-num-box {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.up {
	.table-num {
		color: #34c759;
	}
	.triangle {
		border-left: 0.04rem solid transparent;
		border-right: 0.04rem solid transparent;
		border-bottom: 0.06rem solid #34c759;
		border-top: initial;
		margin-right: 0.04rem;
	}
}
.down {
	.table-num {
		color: #df5953;
	}
	.triangle {
		border-left: 0.04rem solid transparent;
		border-right: 0.04rem solid transparent;
		border-top: 0.06rem solid #df5953;
		border-bottom: initial;
		margin-right: 0.04rem;
	}
}
.table-tag {
	display: inline-block;
	color: @tag-blue-text-color;
	background: rgba(47, 107, 239, 0.15);
	border-radius: 2px;
	margin: 0.02rem 0.08rem 0.02rem 0;
	padding: 2px 8px;
	&:first-child {
		margin-left: 0;
	}
}
:deep(.table-box) {
	font-size: @content-font-size;
	.el-table__inner-wrapper:before {
		display: none;
	}
	.table-num-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.table-num {
		font-family: Bebas;
		// font-weight: bold;
	}
	td.el-table__cell {
		font-size: 0.16rem;
	}
	.el-table__row,
	th.el-table__cell {
		height: 0.54rem;
		padding: 0;
	}
	.el-table__body tr:hover {
		background: transparent !important;
	}
	.el-table__body tr:hover > td.el-table__cell {
		background: rgba(47, 107, 239, 0.03);
	}
	td.el-table__cell,
	th.el-table__cell {
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		height: 0.54rem;
		padding: 0;
	}
}

:deep(.no-padding) {
	.cell {
		padding: 0 !important;
	}
}
:deep(.el-table) {
	th {
		background-color: @table-header-bg-color;
		color: @table-header-text-color;
		line-height: 0.22rem;
		font-size: @table-font-size;
	}
}
.force-native-scroll {
	overflow: auto !important;
	-webkit-overflow-scrolling: touch !important; /* 启用iOS平滑滚动 */
	touch-action: pan-x pan-y !important; /* 启用手势滑动 */
}
</style>
