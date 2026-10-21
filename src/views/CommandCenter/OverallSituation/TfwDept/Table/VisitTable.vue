<template>
	<div class="visit-table">
		<!-- 筛选工具栏 -->
		<VisitStatisticsToolbar
			:model-value="filters"
			:tag-options="filteredTagOptions"
			:show-fill-unit-filters="true"
			@update:model-value="onFiltersUpdate"
			@change="onToolbarChange"
		/>

		<!-- 表格 -->
		<div class="visit-table-wrap">
			<AdvanceMultiHeaderTable
				ref="tableRef"
				row-key="unitId"
				:tree-props="{ children: 'children' }"
				:expands="expandKeys"
				:tableData="tableData"
				:columns="columns"
				:loading="loading"
				:blueHeader="false"
				:striped="false"
				fixedHeight="100%"
				hideOrder
				:highlight-dept-code="currentDeptCode"
				:row-class-name="tableRowClassName"
			>
				<template #sequenceLabel="{ row }">
					<div
						class="expand-box"
						:class="{
							'level-2': String(row.sequenceLabel || '').startsWith('('),
							'is-expand': expandKeys.includes(row.unitId),
						}"
					>
						<span
							v-if="row.children?.length"
							class="expand-icon"
							@click.stop="toggleExpand(row)"
						>
							{{ expandKeys.includes(row.unitId) ? '-' : '+' }}
						</span>
						<span v-else class="expand-placeholder"></span>
						<span class="index">{{ row.sequenceLabel }}</span>
					</div>
				</template>
				<template #unitNameHeader>
					<div class="unit-header-select-wrap" v-if="curTitleTab !== 'dept'">
						<el-select
							v-model="filters.fillUnitScope"
							class="unit-header-select"
							disabled
							@change="fetchTableData"
						>
							<el-option label="市直部门" value="cityDept" />
							<el-option label="各区" value="district" />
							<el-option label="不限" value="all" />
						</el-select>
					</div>
				</template>
				<template #tipHeader="{ col }">
					<div class="header-tip-text">
						<span>{{ col.label }}</span>
						<el-tooltip :content="col.slotHeaderText" placement="top">
							<SvgIcon name="tip" size="0.18rem" />
						</el-tooltip>
					</div>
				</template>
				<template #clueCount="{ row, col }">
					<Link :row="row" :col="col" :canClick="getCanClick(row)" @click="openDrilldown(row, 'clue')" />
				</template>
				<template #projectCount="{ row, col }">
					<Link :row="row" :col="col" :canClick="getCanClick(row)" @click="openDrilldown(row, 'project')" />
				</template>
				<template #agendaCount="{ row, col }">
					<Link :row="row" :col="col" :canClick="getCanClick(row)" @click="openDrilldown(row, 'agenda')" />
				</template>
				<template #resolutionQiyeTimesCount="{ row, col }">
					<Link :row="row" :col="col" :canClick="getCanClick(row)" @click="openDrilldown(row, 'resolutionQiyeTimes')" />
				</template>
				<template #rate="{ row }">
					{{ typeof row.rate === 'number' ? row.rate + '%' : row.rate || '0%' }}
				</template>
				<template #entDetail="{ row, col, index }">
					<Link :row="row" :col="col" :canClick="getCanClick(row)" @click="openEntDetail(row, col, index)" />
				</template>
				<template #visitDetail="{ row, col, index }">
					<Link :row="row" :col="col" :canClick="getCanClick(row)" @click="openVisitDetail(row, col, index)" />
				</template>
			</AdvanceMultiHeaderTable>
		</div>
		<EntDetail ref="entDetailRef" :defaultDate="defaultDate" />
		<VisitDetail ref="visitDetailRef" :defaultDate="defaultDate" />
		<CityRecordDetail ref="cityRecordDetailRef" :defaultDate="defaultDate" />
		<!-- 产生议定事项 / 产生企业述求 -->
		<ResolutionDetail ref="resolutionDetailRef" :defaultDate="defaultDate" />
	</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import {
	getDepartmentVisitStatistics,
	getDepartmentTfwVisitStatistics,
	getVisitStatisticsUpdateTime,
	getTagOptionsForDocking,
} from '@/api/commandCenter/visitOverview';
import AdvanceMultiHeaderTable from '@/components/table/AdvanceMultiHeaderTable.vue';
import { authService } from '@/services/auth';
import VisitStatisticsToolbar from './VisitStatisticsToolbar.vue';
import type { VisitStatisticsFilters } from '../shared/types';
import { DEFAULT_VISIT_FILTERS } from '../shared/filters';
import { buildVisitColumns } from './columns';
import EntDetail from '../Dialog/EntDetail.vue';
import VisitDetail from '../Dialog/VisitDetail.vue';
import CityRecordDetail from '../Dialog/CityRecordDetail.vue';
import ResolutionDetail from '../Dialog/fieldvisit/ResolutionDetail.vue';
import Link from '../../Components/Link.vue';

const currentDeptCode = computed(() => authService.getUserInfo()?.orgId as string | undefined);

/* ==================== 常量 ==================== */
const subjectTypeNameMap: Record<string, string> = {
	enterprise: '企业',
	association: '商协会',
	research: '科研机构',
};

const subjectTypeMap: Record<string, string> = {
	enterprise: '1',
	association: '2',
	research: '3',
};

const fillUnitScopeMap: Record<string, string | undefined> = {
	cityDept: '2',
	district: '3',
	dept: '2',
	all: undefined,
};

const timeTypeMap: Record<string, string> = {
	dock: '1',
	fill: '2',
};
const props = defineProps({
	dateValue: {
		type: Object as PropType<{ startTimeStr: string; endTimeStr: string }>,
		default: () => ({ startTimeStr: '', endTimeStr: '' }),
	},
	curTitleTab: {
		type: String,
		default: '',
	},
	deptCode:{
		type: String,
		default: '',
	},
	ownDeptClick:{ // 只有当前的部门才能下钻
		type: Boolean,
		default: false,
	}
});
// 行数据是否是当前部门的数据
const isOwnDept = (row: any) => {
	const unitCode = (row.unitCode && row.unitCode.split('、')) || [];
	return unitCode.includes(props.deptCode);
};
const getCanClick = (row: any) => !props.ownDeptClick || isOwnDept(row);
const tableRowClassName = ({ row }: { row: any }) => {
	if (isOwnDept(row)) {
		return 'yellow-row';
	}
	return '';
};
/* ==================== 状态 ==================== */
const tableRef = ref();
const loading = ref(false);
const expandKeys = ref<string[]>([]);
const tableData = ref<any[]>([]);
const tagOptions = ref<{ label: string; value: string }[]>([]);

const filters = reactive<VisitStatisticsFilters>({ ...DEFAULT_VISIT_FILTERS });
const defaultDate = computed(() => {
	const [startTimeStr, endTimeStr] = filters.dateRange;
	return { startTimeStr, endTimeStr };
});
/* ==================== 计算属性 ==================== */
const subjectTypeName = computed(() => subjectTypeNameMap[filters.subjectType] || '企业');

const filteredTagOptions = computed(() => {
	const optionMap = new Map<string, { label: string; value: string }>();
	tagOptions.value.forEach((item) => {
		if (!optionMap.has(item.value)) {
			optionMap.set(item.value, item);
		}
	});
	return [...optionMap.values()];
});

/* ==================== 列定义 ==================== */
const columns = computed(() => buildVisitColumns(subjectTypeName.value));

/* ==================== 行数据适配 ==================== */
const withSequenceLabels = (rows: any[], level: 'root' | 'child' = 'root'): any[] =>
	rows.map((row, index) => ({
		...row,
		unitId: row.unitId ?? row.unitCode ?? '',
		sequenceLabel: level === 'root' ? `${index + 1}` : `(${index + 1})`,
		children: row.children?.length ? withSequenceLabels(row.children, 'child') : [],
	}));

const normalizeRows = (payload: unknown): any[] => {
	if (Array.isArray(payload)) {
		return withSequenceLabels(payload);
	}
	if (payload && typeof payload === 'object') {
		const obj = payload as Record<string, unknown>;
		if (Array.isArray(obj.list)) {
			return withSequenceLabels(obj.list);
		}
		if (Array.isArray(obj.rows)) {
			return withSequenceLabels(obj.rows);
		}
		if (Array.isArray(obj.data)) {
			return withSequenceLabels(obj.data);
		}
	}
	return [];
};

/* ==================== 展开/收起 ==================== */
/** 递归收集树结构中所有节点的 unitId */
const collectAllUnitIds = (rows: any[]): string[] => {
	const ids: string[] = [];
	const walk = (list: any[]) => {
		list.forEach((item) => {
			if (item.unitId) {
				ids.push(item.unitId);
			}
			if (item.children?.length) {
				walk(item.children);
			}
		});
	};
	walk(rows);
	return ids;
};

const toggleExpand = (row: any) => {
	const currentKeys = new Set(expandKeys.value);
	const wasExpanded = currentKeys.has(row.unitId);
	if (wasExpanded) {
		currentKeys.delete(row.unitId);
	} else {
		currentKeys.add(row.unitId);
	}
	expandKeys.value = [...currentKeys];
	tableRef.value?.tableRef?.toggleRowExpansion(row, !wasExpanded);
};

/* ==================== 数据请求 ==================== */
const buildQuery = (): Record<string, unknown> => {
	const [startTimeStr, endTimeStr] = filters.dateRange || [];
	const normalizedTagIds = filters.tagIds.length ? filters.tagIds : [];
	return {
		startTimeStr,
		endTimeStr,
		timeType: timeTypeMap[filters.timeType],
		type: subjectTypeMap[filters.subjectType],
		tagId: normalizedTagIds.join(','),
		unitLevel: filters.fillUnitScope ? fillUnitScopeMap[filters.fillUnitScope] : undefined,
		searchBn: filters.searchBn,
	};
};

const fetchTableData = async () => {
	loading.value = true;
	try {
		const baseQuery = buildQuery();
		const query = { ...baseQuery };
		const query2 = { ...baseQuery };
		tableData.value = [];
		const func =
			props.curTitleTab === 'dept'
				? getDepartmentTfwVisitStatistics
				: getDepartmentVisitStatistics;
		const [response] = await Promise.all([
			func<any>(query),
			getVisitStatisticsUpdateTime<any>(query2),
		]);
		const rows = normalizeRows(response.data ?? response);
		tableData.value = rows;
		// getDepartmentTfwVisitStatistics 返回树结构，默认全展开
		if (props.curTitleTab === 'dept') {
			expandKeys.value = collectAllUnitIds(rows);
		}
	} catch {
		tableData.value = [];
	}
	loading.value = false;
};

const ensureValidTags = () => {
	const optionValues = new Set(filteredTagOptions.value.map((item) => item.value));
	const nextTagIds = filters.tagIds.filter((tagId) => optionValues.has(tagId));
	filters.tagIds = nextTagIds.length ? nextTagIds : [];
};

const fetchTagOptions = async (type: string) => {
	try {
		const response = await getTagOptionsForDocking<any>({ type });
		let payload: any[] = [];
		if (Array.isArray(response)) {
			payload = response;
		} else if (response?.code === 0 && Array.isArray(response.data)) {
			payload = response.data;
		}
		tagOptions.value = payload
			.filter((item: any) => item.code)
			.map((item: any) => ({
				label: item.name,
				value: item.code,
			}));
	} catch {
		tagOptions.value = [];
	}
	ensureValidTags();
};

/* ==================== 工具栏事件 ==================== */
const onFiltersUpdate = (value: VisitStatisticsFilters) => {
	Object.assign(filters, value);
};

let previousSubjectType = filters.subjectType;

const onToolbarChange = async (value: VisitStatisticsFilters) => {
	if (previousSubjectType !== value.subjectType) {
		previousSubjectType = value.subjectType;
		await fetchTagOptions(subjectTypeMap[value.subjectType]);
	}
	fetchTableData();
};

/* ==================== 下钻跳转 ==================== */

/* ==================== 初始化 ==================== */
onMounted(async () => {
	await fetchTagOptions('1');
	await fetchTableData();
});
const obj = computed(() => [props.dateValue, props.curTitleTab]);
watch(
	() => obj.value,
	async () => {
		const { startTimeStr, endTimeStr } = props.dateValue;
		if (startTimeStr && endTimeStr) {
			filters.dateRange = [startTimeStr, endTimeStr];
			filters.fillUnitScope = props.curTitleTab;
			filters.searchBn = props.curTitleTab === 'cityDept' ? '1' : null;
			await fetchTagOptions('1');
			await fetchTableData();
		}
	},
	{ immediate: true, deep: true }
);
const getDetailParams = (row: any, col: any, index: any) => {
	const tagIds =
		filters.tagIds && filters.tagIds?.length > 0
			? filters.tagIds
			: [];

	// 合计不传unitCode和unitName
	const notSearchUnit = index === 0 && props.curTitleTab !== 'dept';
	const r = {
		...row,
		timeType: timeTypeMap[filters.timeType], // 时间类型
		columnKey: col.prop,
		unitType: subjectTypeMap[filters.subjectType],
		tagId: tagIds.join(','),
		unitCode: notSearchUnit ? '' : row.unitCode,
		unitName: notSearchUnit ? '' : row.unitName,
	};
	return r;
};
const entDetailRef = ref();
const openEntDetail = (row: any, col: any, index: any) => {
	entDetailRef.value.show(getDetailParams(row, col, index), col);
};

const visitDetailRef = ref();
const openVisitDetail = (row: any, col: any, index: any) => {
	visitDetailRef.value.show({ row: getDetailParams(row, col, index), col });
};

// 走访明细弹窗（线索/项目等，使用 tableColumnsCityConfig）
const cityRecordDetailRef = ref();
// 议定事项 / 企业诉求弹窗（Dialog/fieldvisit）
const resolutionDetailRef = ref();

// 映射 resultType 到 columnKey
const resultTypeToColumnKeyMap: Record<string, string> = {
	clue: 'clueTimes',
	project: 'projectTimes',
	agenda: 'resolutionTimes',
	resolutionQiyeTimes: 'resolutionQiyeTimes',
	qiye: 'resolutionQiyeTimes',
};
const resultTypeToTitleMap: Record<string, string> = {
	agenda: '产生议定事项',
	resolutionQiyeTimes: '产生企业诉求',
};
/** 议定事项 / 企业诉求走独立弹窗 */
const RESOLUTION_RESULT_TYPES = ['agenda', 'resolutionQiyeTimes', 'qiye'];

const buildDrilldownParams = (row: any, resultType: string) => {
	const [startDate, endDate] = filters.dateRange || [];
	const tagIds =
		filters.tagIds && filters.tagIds?.length > 0
			? filters.tagIds.join(',')
			: undefined;
	return {
		menuType: 0,
		orderByField: '4',
		columnKey: resultTypeToColumnKeyMap[resultType] || resultType,
		unitCode: row.unitName === '合计' ? null : row.unitCode,
		unitName: row.unitName === '合计' ? null : row.unitName,
		unitLevel: row.unitLevel,
		timeType: timeTypeMap[filters.timeType],
		unitType: subjectTypeMap[filters.subjectType],
		tagIds,
		startTimeStr: startDate ? dayjs(startDate).format('YYYY-MM-DD HH:mm') || '' : '',
		endTimeStr: endDate ? dayjs(endDate).format('YYYY-MM-DD HH:mm') || '' : '',
	};
};

const openDrilldown = (row: any, resultType: string) => {
	const params = buildDrilldownParams(row, resultType);
	const title = resultTypeToTitleMap[resultType];
	if (RESOLUTION_RESULT_TYPES.includes(resultType)) {
		resolutionDetailRef.value.show({ row: params, title });
		return;
	}
	cityRecordDetailRef.value.show({ row: params, title });
};
</script>

<style lang="less" scoped>
.visit-table {
	height: 100%;
	display: flex;
	flex-direction: column;
	.visit-statistics-toolbar {
		padding-top: 0.24rem;
	}
	.visit-table-wrap {
		flex: 1;
		min-height: 4rem;
		:deep(.yellow-row) {
			background-color: #fef9e7 !important;
		}
	}
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 0.16rem;
}

.update-time {
	font-size: 0.18rem;
	font-weight: 600;
	color: rgba(0, 0, 0, 0.85);
}

.metric-link {
	color: #165dff;
	cursor: pointer;
	font-weight: 500;
}

.unit-header-select-wrap {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 0 0.08rem;
	box-sizing: border-box;
}

.unit-header-select {
	width: 1.64rem;
}

:deep(.unit-header-select .el-select__wrapper) {
	min-height: 0.38rem;
	font-size: 0.16rem;
}
.visit-table-wrap {
	:deep(.el-table th.el-table__cell) {
		text-align: center;
	}

	:deep(.el-table) {
		--el-table-border-color: #d4d4d4;
		--el-table-border: 1px solid #d4d4d4;
	}

	:deep(.el-table th.el-table__cell) {
		background-color: #165dff !important;
		border-color: #d4d4d4;
		color: #fff;
	}

	:deep(.el-table td.el-table__cell) {
		border-color: #d4d4d4;
	}

	:deep(.el-table--border::after),
	:deep(.el-table--group::after),
	:deep(.el-table::before) {
		background-color: #165dff;
		color: #fff;
	}

	:deep(.el-table .el-table__cell) {
		.el-table__expand-icon {
			display: none !important;
		}
		.el-table__placeholder,
		.el-table__indent {
			display: none !important;
		}
	}
}
.expand-box {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding-left: 0.1rem;
	&.level-2 {
		padding-left: 0.1rem;
	}
	&.is-expand {
		color: #165dff;
		.expand-icon {
			background-color: #ecf2fe;
			color: #165dff;
			border-color: #165dff;
		}
	}
	.expand-icon,
	.expand-placeholder {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 0.18rem;
		height: 0.18rem;
		margin-right: 0.08rem;
		flex: 0 0 0.18rem;
	}
	.expand-icon {
		background-color: #165dff;
		color: #fff;
		border: 0.01rem solid #165dff;
		cursor: pointer;
		font-size: 0.14rem;
		font-weight: 700;
		line-height: 1;
	}
	.index {
		font-size: 0.18rem;
	}
}
.header-tip-text {
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 0.04rem;
	width: 100%;
	text-align: center;

	:deep(.icon) {
		// color: #87b5ff;
		color: #fff;
		flex: 0 0 auto;
	}
}
</style>
