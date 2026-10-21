<template>
	<div class="table-container">
		<el-table
			:data="tableData"
			style="width: 100%"
			:height="tableHeight"
			:class="{ 'single-level-header': isSingleLevel }"
			v-loading="loading"
			v-bind="$attrs"
			@sort-change="handleSortChange"
		>
			<el-table-column
				label="序号"
				v-if="hasOrder"
				type="index"
				:width="getSize(75)"
				align="center"
			>
				<template #default="{ $index }">
					{{ $index + 1 + page.pageSize * (page.pageNum - 1) }}
				</template>
			</el-table-column>
			<template v-for="column in columns" :key="column.prop">
				<TableColumnItem :column="column">
					<template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
						<slot :name="slotName" v-bind="slotProps" />
					</template>
				</TableColumnItem>
			</template>
			<template #append>
				<slot name="append" />
			</template>
		</el-table>
		<div v-if="isPage" class="pagination-container">
			<div class="pagination-left">
				<slot name="paginationLeft" />
			</div>
			<el-pagination
				class="custom-class"
				v-model:current-page="page.pageNum"
				v-model:page-size="page.pageSize"
				:page-sizes="[10, 50, 100, 200]"
				layout="total, prev, pager, next"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getSize } from '@/utils';
import TableColumnItem from './TableColumnItem.vue';

const emit = defineEmits([ 'pageChange', 'handleSortChange']);

interface Tag {
	name: string;
	type: string;
}

export interface TableColumn {
	prop: string;
	label: string;
	width?: string | number;
	align?: 'left' | 'center' | 'right';
	type?: 'default' | 'custom';
}

interface TableRow {
	[key: string]: any;
	tags?: Tag[];
}

interface Props {
	tableData: TableRow[];
	columns: any[];
	hasOrder?: boolean;
	isPage?: boolean;
	loading?: boolean;
	total?: number;
	current?: number;
	size?: number;
}
const props = defineProps<Props>();

const tableHeight = computed(() => (props.isPage ? `calc(100% - 0.6rem)` : `100%`));
// 判断是否只有一级表头（无 children）
const isSingleLevel = computed(() => !props.columns.some((col: any) => col.children?.length));
const page = reactive<{
	pageNum: number;
	pageSize: number;
}>({
	pageNum: 1,
	pageSize: 10,
});

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
	() => ({
		current: props.current,
		size: props.size,
	}),
	(newVal) => {
		const current = Number(newVal.current);
		const size = Number(newVal.size);

		if (!Number.isNaN(current)) {
			page.pageNum = current;
		}
		if (!Number.isNaN(size)) {
			page.pageSize = size;
		}
	},
	{ immediate: true }
);

const handleSizeChange = (val: number) => {
	emit('pageChange', { type: 'size', value: val });
};

const handleCurrentChange = (val: number) => {
	emit('pageChange', { type: 'page', value: val });
};
</script>

<style lang="less" scoped>
.table-container {
	height: 100%;
}
.enterprise-name-cell {
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
}

.company-name {
	font-weight: 500;
	color: #303133;
	line-height: 1.4;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.06rem;
}

.tag-item {
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	font-size: 0.12rem;
	color: #faad14;
	margin-right: 0.08rem;
	padding: 0 0.08rem;
}

:deep(.el-tag--warning) {
	background: #fffbe6;
	border-radius: 0.02rem;
	border: 0.01rem solid #ffe58f;
}

:deep(div.el-table) {
	// height: calc(100% - 0.6rem) !important;
	border-radius: 0;
	border: 0.01rem solid #d4d4d4;
	overflow: hidden;
	thead th.el-table__cell {
		padding: 0.08rem 0;
		border-right: 0.01rem solid #d4d4d4;
		border-bottom: 0.01rem solid #d4d4d4;
		background: #0268fb;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-base;
		color: #fff;
	}
	td.el-table__cell {
		line-height: 0.22rem;
		color: #000000;
		font-family: PingFangSC, PingFang SC;
		font-size: @g-font-size-small;
		padding: 0.08rem 0;
		border-right: 0.01rem solid #d4d4d4;
		border-bottom: 0.01rem solid #d4d4d4;
	}
	tr {
		background: #fff;
		&:nth-child(even) {
			background: #fff;
		}
	}
	.cell {
		padding: 0 0.08rem;
	}
	thead .cell {
		white-space: pre-line;
	}
	&.single-level-header .cell {
		line-height: 0.36rem;
	}
	.el-table__header tr:nth-child(2) th {
		border-top: 0.01rem solid #d4d4d4;
	}
}

.pagination-container {
	padding-top: 0.15rem;
	display: flex;
	justify-content: flex-end;
	:deep(.el-pagination) {
		.el-pager li,
		.btn-prev,
		.btn-next {
			color: rgba(0, 0, 0, 0.65);
			padding: 0.05rem 0.1rem;
			font-family: PingFangSC, PingFang SC;
			font-size: 0.18rem;
			background: #ffffff;
			border-radius: 0.02rem;
			border: 0.01rem solid rgba(0, 0, 0, 0.15);
			margin-left: 0.08rem;
		}
		.el-pager li.is-active {
			color: #165dff;
			border-color: #165dff;
			font-weight: 400;
		}
		.el-pagination__total,
		.el-pagination__sizes {
			font-family: PingFangSC, PingFang SC;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}
</style>

