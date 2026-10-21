<template>
	<div class="project-table">
		<StepBar class="step-bar" :steps="stepList" v-model="curStep" @change="handleStepChange" />
		<ComplexTable
			class="project-table-box"
			:tableData="tableData"
			:columns="columns"
			:hasOrder="false"
			:isPage="false"
			height="auto"
			:span-method="spanMethod"
			:row-class-name="rowClassName"
		>
			<template #detail="{ row, col }">
				<div @click="openDatail(col, row)" class="link" v-if="isCanClick(row)">
					{{ isEmpty(row[col.prop]) ? EmptyConst : row[col.prop]}}
				</div>
				<div v-else>{{ isEmpty(row[col.prop]) ? EmptyConst : row[col.prop] }}</div>
			</template>
			<template #append>
				<div class="note-box">
					<p>注：</p>
					<p v-for="(note, idx) in noteList" :key="idx">{{ note }}</p>
				</div>
			</template>
		</ComplexTable>
	</div>
</template>
<script lang="ts" setup>
import { EmptyConst, isEmpty } from '@/utils';
import ServiceUrl from '@/utils/url';
import type { PropType } from 'vue';
import ComplexTable from '@/views/CommandCenter/OverallSituation/Components/ComplexTable.vue';
import { querySixBatchSummaryByYearMonth } from '@/api/commandCenter/deptOverview';
import StepBar from './StepBar.vue';
import { cityColumns } from './columns';

const props = defineProps({
	curTitleTab: {
		type: Number,
		default: 1,
	},
	dateValue: {
		type: Object as PropType<{ startTimeStr: string; endTimeStr: string }>,
		default: () => ({ startTimeStr: '', endTimeStr: '' }),
	},
});
const stepList = [
	{ name: '项目总库', value: 1 },
	{ name: '线索库', value: 2 },
	{ name: '在谈项目库', value: 3 },
	{ name: '签约项目库', value: 4 },
	{ name: '注册（备案）项目库', value: 5 },
	{ name: '动工项目库（固投类）', value: 6 },
	{ name: '投产（开票）项目库', value: 7 },
	{ name: '设备购置类项目', value: 8 },
];
const curStep = ref(stepList[0].value);

/** 点击步骤条时，滚动表格到对应的第二级表头中间位置 */
const handleStepChange = (stepVal: any) => {
	if (props.curTitleTab === 2) return;
	const label = stepVal.name;
	if (!label) return;
	nextTick(() => {
		const container = document.querySelector('.project-table');
		// 获取表格的水平滚动容器（Element Plus 的表头和表体共用同一个滚动容器，或通过事件同步）
		const scrollWrap = container?.querySelector('.el-scrollbar__wrap') as HTMLElement | null;
		const thList = container?.querySelectorAll('.el-table__header th');
		if (!scrollWrap || !thList) return;
		const targetLabel = label.replace(/\s+/g, '');
		// 找到第一个固定列的宽度作为左偏移（跳过序号/第一列的固定区域）
		const firstTh = thList[0] as HTMLElement;
		const fixedOffset = firstTh?.offsetLeft || 0;
		Array.from(thList).some((th) => {
			const cellText = (
				(th as HTMLElement).querySelector('.cell')?.textContent ?? ''
			).replace(/\s+/g, '');
			if (cellText === targetLabel) {
				const el = th as HTMLElement;
				// 滚动到列中间位置
				const targetLeft =
					el.offsetLeft - fixedOffset - scrollWrap.clientWidth / 2 + el.offsetWidth / 2;
				scrollWrap.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
				return true;
			}
			return false;
		});
	});
};

const tableData = ref<any[]>([]);
const columns = ref(cityColumns);
/**
 * 单元格合并逻辑
 * "全年累计数"行：第1列(deptName) rowspan=2 跨两行
 * 额外行：第1列被 rowspan 消耗(rowspan=0,colspan=0)，第2列 colspan=24 合并所有数据列
 */
/** 额外汇总行标识 */
const EXTRA_ROW_KEY = '__extra_summary__';
/** 本月结余后的空白分隔行 */
const MONTH_BALANCE_SPACER_ROW_KEY = '__month_balance_spacer__';

const getLeafColumnCount = (columnList: any) =>
	columnList.reduce((count: any, column: any) => {
		if (column.children?.length) return count + getLeafColumnCount(column.children);
		return count + 1;
	}, 0);
const spanMethod = ({ row, columnIndex }: any) => {
	const leafColumnCount = getLeafColumnCount(columns.value);
	if (row.deptName === MONTH_BALANCE_SPACER_ROW_KEY) {
		if (columnIndex === 0) return { rowspan: 1, colspan: leafColumnCount };
		return { rowspan: 0, colspan: 0 };
	}
	if (row.deptName === '全年累计数') {
		if (columnIndex <= 16) return { rowspan: 2, colspan: 1 };
		return { rowspan: 1, colspan: 1 };
	}
	if (row.deptName === EXTRA_ROW_KEY) {
		if (columnIndex <= 16) return { rowspan: 0, colspan: 0 };
		if (columnIndex === 17) return { rowspan: 1, colspan: leafColumnCount - 17 };
		return { rowspan: 0, colspan: 0 };
	}
	return { rowspan: 1, colspan: 1 };
};
/** 为额外汇总行添加特殊样式 */
const rowClassName = ({ row }: any) => {
	if (row.deptName === MONTH_BALANCE_SPACER_ROW_KEY) return 'blank-divider-row';
	if (row.deptName === EXTRA_ROW_KEY) return 'extra-summary-row';
	return '';
};


const noteList = [
	'1. 签约项目库、注册（备案）项目库、实施项目库、投产项目库的固投类数据（橘色部分数据）将与发改的固投库数据实现联动。',
	'2. 备案金额中包含备案类项目及部分核准类项目对应金额。',
	'3. 新增动工类项目是指本月新纳统固投项目情况。',
];

/** rowType → deptName 映射 */
const ROWTYPE_TO_DEPTNAME: Record<string, string> = {
	MONTH_START: '月初在库',
	MONTH_START_CONVERT: '月初在库(线索转化)',
	ADD_MONTH: '新增(本月)',
	ADD_MONTH_CONVERT: '新增(本月-线索转化)',
	ADD_YEAR: '新增(累计)',
	ADD_YEAR_CONVERT: '新增(累计-线索转化)',
	STOP_MONTH: '终止(本月)',
	STOP_MONTH_CONVERT: '终止(本月-线索转化)',
	STOP_YEAR: '终止(累计)',
	STOP_YEAR_CONVERT: '终止(累计-线索转化)',
	TRANSFORM_MONTH: '转化(本月)',
	TRANSFORM_MONTH_CONVERT: '转化(本月-线索转化)',
	TRANSFORM_YEAR: '转化(累计)',
	TRANSFORM_YEAR_CONVERT: '转化(累计-线索转化)',
	BALANCE_MONTH: '本月结余',
	BALANCE_MONTH_CONVERT: '本月结余(线索转化)',
	YEAR_TOTAL: '全年累计数',
	YEAR_STOP: '全年终止',
};

/** 金额字段列表，数据需保留两位小数 */
const AMOUNT_FIELDS = [
	'totalAmount',
	'allAmount',
	'clueInvestAmount',
	'talkingInvestAmount',
	'signInvestTotal',
	'signInvestFixed',
	'signInvestNonFixed',
	'regCapital',
	'regFilingAmount',
	'regNewFilingTotal',
	'startFixedInvest',
	'produceFixedInvest',
	'equipFixedInvest',
];

/** 格式化金额字段，保留两位小数 */
const formatAmount = (val: any) => {
	if (val === null || val === undefined || val === '') return val;
	return Number(Number(val).toFixed(2));
};
const year = computed(() => (props.dateValue.endTimeStr?.match(/^\d{4}/) || ['2026'])[0]);
const month = computed(() => (props.dateValue.endTimeStr?.match(/^\d{4}-(\d{2})/) || ['', '05'])[1]);
/** 将接口返回的 rowType 转为 deptName，格式化金额字段，并在"本月结余"后插入空白分隔行、"全年累计数"后插入额外汇总行 */
const transformRows = (rawData: any[]) => {
	const result: any[] = [];
	/** 本月结余行，用于计算固投总额 */
	const balanceRow = rawData.find((item: any) => item.rowType === 'BALANCE_MONTH' || item.rowType === 'BALANCE_MONTH_CONVERT');
	const total = balanceRow
		? (balanceRow.startFixedInvest || 0) + (balanceRow.produceFixedInvest || 0) + (balanceRow.equipFixedInvest || 0)
		: 0;
	rawData.forEach((item: any) => {
		const row: any = { ...item };
		AMOUNT_FIELDS.forEach((field) => {
			if (field in row) {
				row[field] = formatAmount(row[field]);
			}
		});
		row.deptName = ROWTYPE_TO_DEPTNAME[item.rowType] || item.rowType;
		result.push(row);
		if (item.rowType === 'BALANCE_MONTH' || item.rowType === 'BALANCE_MONTH_CONVERT') {
			result.push({ deptName: MONTH_BALANCE_SPACER_ROW_KEY });
		}
		if (item.rowType === 'YEAR_TOTAL') {
			result.push({
				deptName: EXTRA_ROW_KEY,
				startCount: `${year.value}年实际完成固投${formatAmount(total)}亿元`,
			});
		}
	});
	return result;
};

const getList = () => {
	const params = {
		year: year.value,
		month: month.value
	};
	querySixBatchSummaryByYearMonth(params).then((res: any) => {
		tableData.value = transformRows(res.data || []);
	});
};
getList();
const openDatail = (col: any, row: any) => {
	const params = `INDICATOR_TYPE=${col.indicatorType}&YEAR=${year.value}&MONTH=${month.value}&ROW_TYPE=${row.rowType}&IS_DELETED=0`
	const url = `${ServiceUrl.getQmSysUrl()}/pc/projectManage/components/sixBatchDrillDownList?${params}`
	window.open(url, '_blank');
};
// 月初在库的数据不能点击
const isCanClick = (row: any) => row.deptName !== EXTRA_ROW_KEY && row.rowType !== 'MONTH_START'
watch(() => props.dateValue, () => {
	getList();
});
</script>
<style lang="less" scoped>
.project-table {
	overflow: auto;
	:deep(.el-table) {
		.el-table__header thead tr:nth-child(1) th {
			background: #e4f1ff;
			font-family: MicrosoftYaHei, MicrosoftYaHei;
			font-weight: bold;
			color: rgba(0, 0, 0, 0.9);
		}
	}
}

.step-bar {
	margin: 0.24rem 0;
}
.project-table-section {
	// display: flex;
	// flex-direction: column;
}
.link {
	color: #165dff;
	font-weight: 500;
	cursor: pointer;
}
:deep(.project-clickable-header .cell) {
	cursor: pointer;
	text-decoration: underline;
}
.project-table-box {
	// flex: 1;
	// min-height: 0;
	:deep(.el-table__footer) {
		td.el-table__cell {
			background: #fff7e6;
		}
		.cell {
			color: #000;
			font-size: @g-font-size-small;
		}
	}
	:deep(.extra-summary-row) {
		td {
			background: #fff7e6;
			color: #000;
			.cell {
				text-align: center;
				font-size: @g-font-size-small;
			}
		}
	}
	:deep(.blank-divider-row) {
		td {
			height: 15px !important;
			padding: 0 !important;
			background: #fff !important;
			border-top: 0.01rem solid #d4d4d4 !important;
			border-bottom: 0.01rem solid #d4d4d4 !important;
			.cell {
				height: 15px;
				line-height: 15px;
				padding: 0;
				font-size: 0;
			}
		}
	}
	:deep(div.el-table) {
		thead th.white-spacer-column,
		td.white-spacer-column {
			padding: 0 !important;
			background: #fff !important;
			.cell {
				padding: 0;
				font-size: 0;
			}
		}
		thead th.orange {
			background: #e65c00;
		}
		tr:nth-child(odd) {
			td.orange {
				background: #ffe0cc;
			}
		}
		tr:nth-child(even) {
			td.orange {
				background: #ffb380;
			}
		}
	}
}

.note-row {
	display: table-row;
	background: #fff;
}

.note-label {
	display: table-cell;
	border-right: 0.01rem solid #d4d4d4;
	border-bottom: 0.01rem solid #d4d4d4;
	padding: 0.08rem 0.04rem;
	font-family: PingFangSC, PingFang SC;
	font-size: @g-font-size-small;
	color: #000000;
	line-height: 0.22rem;
	white-space: nowrap;
	vertical-align: top;
	width: 1%;
}

.note-content {
	display: table-cell;
	border-right: 0.01rem solid #d4d4d4;
	border-bottom: 0.01rem solid #d4d4d4;
	padding: 0.08rem 0.04rem;
	font-family: PingFangSC, PingFang SC;
	font-size: @g-font-size-small;
	color: #000000;
	line-height: 0.22rem;
	vertical-align: top;

	p {
		margin: 0;
		padding: 0;
		line-height: 0.22rem;
	}
}
.note-box {
	padding: 0.08rem 0.24rem;
	font-size: 0.16rem;
	padding-bottom: 0.24rem;
}
</style>
