<template>
	<div class="summary-table">
		<div class="title-row">
			<div class="title">企业对接走访详情</div>
			<div class="unit">金额单位：亿元</div>
		</div>
		<ComplexTable
			:tableData="highlightedRows"
			:columns="tableColumns"
			:loading="loading"
			:border="true"
			class="table-box"
		>
			<template #cell="{ row, col }">
				<div
					class="cell-link"
					:class="{ active: row._highlightColProp === col.prop }"
					@click="handleClick(row, col)"
				>
					<EllipsisText :text="row[col.prop]" :line="1" />
				</div>
			</template>
		</ComplexTable>
		<EntDetail ref="entDetailRef" :leaderName="leaderName" @close="clearHighlightRowCol" />
	</div>
</template>

<script lang="ts" setup>
import ComplexTable from '@/views/CommandCenter/OverallSituation/Components/ComplexTable.vue';
import { getSize } from '@/utils';
import EntDetail from './EntDetail.vue';
import type { SummaryRow } from '../types';

const props = defineProps<{
	rows: SummaryRow[];
	loading?: boolean;
	leaderName?: string;
}>();

const entDetailRef = ref<InstanceType<typeof EntDetail> | null>(null);

const highlightRowCol: any = ref({});

const clearHighlightRowCol = () => {
	highlightRowCol.value = {};
};
// 将高亮状态写入行数据，el-table 感知数据变化后会自动重渲染
const highlightedRows = computed(() =>
	props.rows.map((r) => ({
		...r,
		_highlightColProp:
			r.entTypeName === highlightRowCol.value.type ? highlightRowCol.value.colProp : null,
	}))
);

const handleClick = (row: SummaryRow, col: any) => {
	highlightRowCol.value = {
		type: row.entTypeName,
		colProp: col.prop,
	};
	const entType = row.entTypeName === '合计' ? '' : row.entTypeName;
	entDetailRef.value?.show({
		searchParams: {
			taskType: col.taskType,
			entType,
			matterStatus: col.matterStatus,
		},
		searchColType: col.searchType,
	});
};

const tableColumns = computed(() => [
	{ prop: 'entTypeName', label: '企业类型', width: getSize(100), align: 'center' },
	{
		label: '牵头任务',
		children: [
			{
				prop: 'visitedCount',
				label: '已走访',
				width: getSize(80),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				taskType: 'VISITED',
				searchType: 'ent',
			},
			{
				prop: 'pendingCount',
				label: '待走访',
				width: getSize(80),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				taskType: 'PENDING',
				searchType: 'ent',
			},
		],
	},
	{
		prop: 'primaryCount',
		label: '小计',
		width: getSize(60),
		align: 'center',
		type: 'slot',
		slotName: 'cell',
		taskType: 'VISITED,PENDING',
		searchType: 'ent',
	},
	{
		prop: 'otherCompany',
		label: '其他企业',
		width: getSize(60),
		align: 'center',
		type: 'slot',
		slotName: 'cell',
		taskType: 'OTHER',
		searchType: 'ent',
	},
	{
		label: '形成招商线索',
		children: [
			{
				prop: 'clueCount',
				label: '个数',
				width: getSize(60),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				searchType: 'clue',
			},
			{ prop: 'clueAmount', label: '金额', width: getSize(60), align: 'center' },
		],
	},
	{
		label: '形成招商项目',
		children: [
			{
				prop: 'projectCount',
				label: '个数',
				width: getSize(60),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				searchType: 'project',
			},
			{ prop: 'projectAmount', label: '金额', width: getSize(60), align: 'center' },
		],
	},
	{
		label: '议定事项',
		children: [
			{
				prop: 'matterCount',
				label: '个数',
				width: getSize(60),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				searchType: 'agenda',
				matterStatus: '',
			},
			{
				prop: 'followedCount',
				label: '已完成',
				width: getSize(80),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				searchType: 'agenda',
				matterStatus: '3',
			},
			{
				prop: 'matterInProgressCount',
				label: '推进中',
				width: getSize(80),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				searchType: 'agenda',
				matterStatus: '2',
			},
			{
				prop: 'matterPendingCount',
				label: '待推进',
				width: getSize(80),
				align: 'center',
				type: 'slot',
				slotName: 'cell',
				searchType: 'agenda',
				matterStatus: '1',
			},
		],
	},
]);
</script>

<style lang="less" scoped>
.summary-table {
	background: #fff;
	padding: 0.12rem 0.16rem;
	border-radius: 0.06rem;
	height: 100%;
	display: flex;
	flex-direction: column;
	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.05rem;

		.title {
			font-size: 0.18rem;
			line-height: 0.25rem;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.85);
		}
		.unit {
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.45);
		}
	}
	.table-box {
		flex: 1;
		overflow: hidden;
	}
	.cell-link {
		cursor: pointer;
		&:hover::after,
		&.active::after {
			pointer-events: none;
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: calc(100% - 0.04rem);
			height: calc(100% - 0.04rem);
			box-shadow: 0 0 0.08rem 0 rgba(0, 0, 0, 0.2);
			border: 0.02rem solid #165dff;
		}
		&.active::after {
			box-shadow: none;
		}
	}
	:deep(div.el-table thead th.el-table__cell),
	:deep(div.el-table td.el-table__cell) {
		font-size: 0.16rem;
		padding: 0.04rem 0 0.04rem 0;
		line-height: 0.2rem;
		border-right-color: #aaccff;
		border-bottom-color: #aaccff;
		border-top-color: #aaccff;
		border-left-color: #aaccff;
	}
	:deep(div.el-table) {
		.cell {
			line-height: 0.2rem;
		}
		tbody .cell {
			font-family: PingFangSC, PingFang SC;
			color: rgba(1, 1, 1, 0.85);
		}
		tr:nth-child(even) {
			background: #ecf3fd;
		}
	}
}
</style>