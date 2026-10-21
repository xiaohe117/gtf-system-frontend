<template>
	<div class="ledger-component">
		<el-card :class="{ 'hindden-padding': dataSource === 'inside' }">
			<template #header>
				<div class="card-header">
					<GTFMdTitle class="GTFMdTitle" title="全市招商工作任务指标台账">
						<template #btn>
							<span
								v-if="dataSource !== 'city'"
								class="blue-text-btn"
								@click="handleOpenDailog(searchParams)"
								>* 点击查看指标详情</span
							>
							<SelectDate2 :modelValue="dateValue" @change="handleDateChange" />
						</template>
					</GTFMdTitle>

					<GTFMdTitle
						class="GTFMdTitle-hidden-padding"
						v-if="dataSource === 'inside'"
						:tabs="tabs"
						v-model="internalTab"
					>
					</GTFMdTitle>
				</div>
			</template>
			<div class="page-content">
				<!-- 全市使用 LedgerTableContent -->
				<LedgerTableContent
					class="LedgerTableContentClass"
					v-if="dataSource === 'city'"
					ref="ledgerTableRef"
					:selectDate="dateValue"
				/>

				<!-- 其他使用 AdvanceMultiHeaderTable -->
				<AdvanceMultiHeaderTable
					v-else
					ref="tableRef"
					:tableData="tableData"
					:columns="columns"
					:blueHeader="true"
					:searchTypeRow="0"
					:showEmptyCell="showEmptyCell"
					:loading="loading"
					:span-method="spanMethod"
					:cellClassName="handleCellClassName"
					fixedHeight="100%"
					hideOrder
				>
					<template #customIndex="{ index }"
						><span v-if="index === 0"></span><span v-else>{{ index }}</span></template
					>

					<!-- 指标名称搜索 -->
					<template #searchIndicatorName="{ row, index, col }">
						<template v-if="index === 0"
							><el-select
								v-model="searchParams.indicatorCode"
								placeholder="请选择"
								@change="handleSearch"
								><el-option
									v-for="item in indicatorNameOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value" /></el-select
						></template>
						<table-value v-else :col="{ prop: col.prop }" :val="row[col.prop]" />
					</template>

					<!-- 完成率：灯状态显示 -->
					<template #completionRate="{ row, index, col }">
						<span
							v-if="
								index === 0 &&
								(row[col.prop] === null ||
									row[col.prop] === undefined ||
									row[col.prop] === '')
							"
						></span>
						<div
							v-else
							class="completion-rate-box"
							:class="getLightStatusClass(row.lightStatus)"
						>
							<span
								v-if="
									row[col.prop] !== null &&
									row[col.prop] !== undefined &&
									row[col.prop] !== ''
								"
							>
								{{ row[col.prop] }}{{ col.unit || '%' }}
							</span>
							<span v-else>{{ EmptyConst }}</span>
						</div>
					</template>

					<!-- 同比：灯状态显示 -->
					<template #yearOnYear="{ row, index, col }">
						<template v-if="index === 0">
							<div
								class="completion-rate-box"
								:class="getLightStatusClass(row.lightStatus)"
							>
								<span
									v-if="
										row[col.prop] !== null &&
										row[col.prop] !== undefined &&
										row[col.prop] !== ''
									"
								>
									{{ row[col.prop] }}{{ col.unit || '%' }}
								</span>
								<span v-else>{{ EmptyConst }}</span>
							</div>
						</template>
						<template
							v-else-if="
								row[col.prop] !== null &&
								row[col.prop] !== undefined &&
								row[col.prop] !== ''
							"
						>
							<TableValue :col="{ ...col, type: 'rate' }" :val="row[col.prop]" />
						</template>
						<span v-else>{{ EmptyConst }}</span>
					</template>

					<!-- 省内/全市：所在区字段 -->
					<!-- <template #districtSlot="{ row, index, col }"
						><span v-if="index === 0">总计</span>
						<table-value v-else :col="{ prop: col.prop }" :val="row[col.prop]" />
					</template> -->

					<!-- 各区/部门：单位字段 -->
					<!-- <template #unitSlot="{ row, index, col }"
						><span v-if="index === 0">各区</span
						><table-value v-else :col="{ prop: col.prop }" :val="row[col.prop]"
					/></template> -->

					<!-- 国企：国企字段 -->
					<!-- <template #stateOwnedEnterpriseSlot="{ row, index }"
						><span v-if="index === 0">合计</span
						><span v-else>{{ row.stateOwnedEnterprise }}</span></template
					> -->

					<!-- 月度工作推进表：产业分局字段 -->
					<!-- <template #industryBranchSlot="{ row, index }"
						><span v-if="index === 0">合计</span
						><span v-else>{{ row.industryBranch }}</span></template
					> -->
				</AdvanceMultiHeaderTable>
			</div>
		</el-card>
	</div>
	<!--指标详情页弹窗 -->
	<IndicatorDetailsDialog
		ref="indicatorDetailsDialogRef"
		:defaultDate="defaultDate"
		tabType="city"
	/>
</template>

<script setup lang="ts">
import { EmptyConst } from '@/utils';
import AdvanceMultiHeaderTable from '@/components/table/AdvanceMultiHeaderTable.vue';
import TableValue from '@/components/table/TableValue.vue';
import GTFMdTitle from '@/components/page/GTFMdTitle.vue';
import LedgerTableContent from '@/views/EfficiencyCenter/components/LedgerTableContent.vue';
import { queryMetricOptions, queryTabData } from '@/api';
import IndicatorDetailsDialog from '@/views/EfficiencyCenter/IndicatorDetailsPage/Dialog.vue';
import useUserStore from '@/stores/user';
import ProvinceLedgerData from './ProvinceLedgerData';
import CityLedgerData from './CityLedgerData';
import DistrictsLedgerData from './DistrictsLedgerData';
import DeptLedgerData from './DeptLedgerData';
import MonthlyWorkProgressData from './MonthlyWorkProgressData';
import ProjectTrackingData from './ProjectTrackingData';
import StateOwnedLedgerData from './StateOwnedLedgerData';

const props = withDefaults(
	defineProps<{
		dataSource?: string;
	}>(),
	{
		dataSource: 'province',
	}
);

const store = useUserStore();
const dateValue = ref(store.dateSelect);
const defaultDate = computed(() => store.dateSelect);

const dataSource = computed(() => props.dataSource);

const tabs = [
	{
		name: '月度工作推进表',
		value: 'inside-monthly-progress',
		tipText: '广州市主攻目标企业清单。',
	},
	{
		name: '项目跟进表（按规模分）',
		value: 'inside-follow-up-by-scale',
	},
	{
		name: '项目跟进表（按跟进情况分）',
		value: 'inside-follow-up-by-status',
	},
];

const dataMap: Record<string, any> = {
	province: ProvinceLedgerData, // 省内
	city: CityLedgerData, // 全市
	district: DistrictsLedgerData, // 各区
	department: DeptLedgerData, // 部门
	enterprise: StateOwnedLedgerData, // 国企
	//  MonthlyWorkProgressData, // 月度工作进度
	// 	projectTracking: ProjectTrackingData, // 项目跟进表
};

const internalTab = ref('inside-monthly-progress');

// internal 有3个 tab，需要分别对应不同的数据配置
const internalDataMap: Record<string, any> = {
	'inside-monthly-progress': MonthlyWorkProgressData, // 月度工作推进表
	'inside-follow-up-by-scale': ProjectTrackingData, // 项目跟进表（按规模分）
	'inside-follow-up-by-status': ProjectTrackingData, // 项目跟进表（按跟进情况分）
};

const currentData = computed(() => {
	if (props.dataSource === 'inside') {
		return internalDataMap[internalTab.value] || MonthlyWorkProgressData;
	}
	return dataMap[props.dataSource];
});
const columns = computed(() => currentData.value.columns);
const searchParams = reactive<Record<string, string>>({});
const tableData = ref<any[]>([]);
const loading = ref(false);
const ledgerTableRef = ref<any>();
const showEmptyCell = ref(false);

// 指标下拉选项
const metricOptions = ref<any[]>([]);
const indicatorNameOptions = computed(() =>
	metricOptions.value.map((item: any) => ({
		label: item.indicatorName,
		value: item.indicatorCode,
	}))
);

// 灯状态对应样式：01-红灯 02-黄灯 03-绿灯 04-灰灯
const getLightStatusClass = (lightStatus: string) => {
	switch (lightStatus) {
		case '01':
			return 'light-red';
		case '02':
			return 'light-yellow';
		case '03':
			return 'light-green';
		case '04':
			return 'light-gray';
		default:
			return '';
	}
};

// 行合并方法 - 只在国企和部门时启用
const spanMethod = ({ row, rowIndex, columnIndex }: any) => {
	// 只在国企和部门时启用行合并
	if (props.dataSource !== 'department' && props.dataSource !== 'enterprise') {
		return { rowspan: 1, colspan: 1 };
	}

	// 对"类别"列（索引为1）进行合并
	if (columnIndex === 1) {
		const orgName = row?.orgName;

		// 向下遍历：统计当前组的总行数
		let rowspan = 1;
		for (let i = rowIndex + 1; i < tableData.value.length; i += 1) {
			if (tableData.value[i]?.orgName === orgName) {
				rowspan += 1;
			} else {
				break;
			}
		}

		// 向上遍历：检查是否是该组的第一行
		let isFirst = true;
		for (let i = rowIndex - 1; i >= 0; i -= 1) {
			if (tableData.value[i]?.orgName === orgName) {
				isFirst = false;
				break;
			}
			if (tableData.value[i]?.orgName) break;
		}

		return isFirst ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 };
	}

	return { rowspan: 1, colspan: 1 };
};

// 单元格类名 - 用于合并单元格换行
// eslint-disable-next-line no-unused-vars
const handleCellClassName = ({ row, rowIndex, column, columnIndex }: any) => {
	// 只在国企和部门时
	if (props.dataSource !== 'department' && props.dataSource !== 'enterprise') {
		return '';
	}

	// 对"类别"列（索引为1）添加换行类名
	if (columnIndex === 1 && row?.orgName) {
		// 检查是否是该组的第一行
		let isFirst = true;
		for (let i = rowIndex - 1; i >= 0; i -= 1) {
			if (tableData.value[i]?.orgName === row.orgName) {
				isFirst = false;
				break;
			}
			if (tableData.value[i]?.orgName) break;
		}
		return isFirst ? 'span-cell-wrap' : '';
	}

	return '';
};

const getTableData = async () => {
	loading.value = true;
	try {
		// 办内模块使用 tabs 的 value，其他使用 props.dataSource
		// const currentTabValue = tabs.find((tab: any) => tab.value === internalTab.value);
		// const tabType = props.dataSource === 'inside' ? currentTabValue?.value : props.dataSource;

		const params = {
			tabType: props.dataSource,
			yearMonth: dateValue.value,
			indicatorCode: searchParams.indicatorCode || undefined,
		};

		const res: any = await queryTabData(params);
		if (res.code === 0) {
			let dataList = res.data || [];

			// 判断 columns 中是否有指标名称的配置插槽，如果有则添加空对象到数据前面（作为搜索行）
			const hasIndicatorNameSlot = columns.value.some(
				(col: any) =>
					col.prop === 'indicatorName' &&
					(col.type === 'slot' || col.slotName === 'searchIndicatorName')
			);

			if (hasIndicatorNameSlot && dataList.length === 0) {
				// 添加空对象作为搜索行
				dataList = [{}, ...dataList];
				showEmptyCell.value = true;
			} else {
				showEmptyCell.value = false;
			}

			tableData.value = dataList;
		}
	} finally {
		loading.value = false;
	}
};

// 获取指标下拉选项
const fetchMetricOptions = async () => {
	// 办内模块使用 tabs 的 value，其他使用 props.dataSource
	const currentTabValue = tabs.find((tab: any) => tab.value === internalTab.value);
	const tabType = props.dataSource === 'inside' ? currentTabValue?.value : props.dataSource;
	const res: any = await queryMetricOptions({ tabType });
	if (res.code === 0) {
		metricOptions.value = res.data || [];
		// 清空之前选中的值
		searchParams.indicatorCode = '';
		searchParams.indicatorName = '';
		// 默认回填第一个（前提是有数据）
		if (metricOptions.value.length > 0) {
			searchParams.indicatorCode = metricOptions.value[0].indicatorCode;
			searchParams.indicatorName = metricOptions.value[0].indicatorName;
		}
	}
};

const refreshTable = async () => {
	await fetchMetricOptions();
	getTableData();
};

// 监听 dataSource 变化获取对应的指标选项
watch(
	() => props.dataSource,
	() => {
		// dataSource 变了，需要重新获取下拉框（fetchMetricOptions 内部逻辑）
		// 然后重新查表
		if (props.dataSource !== 'city') {
			refreshTable();
		} else {
			nextTick(() => {
				ledgerTableRef.value?.getTableData();
			});
		}
	},
	{ immediate: true }
);

// 监听 internalTab 变化（办内二级 tab）
watch(internalTab, () => {
	refreshTable();
});

// 指标详情页弹窗
const indicatorDetailsDialogRef = ref();
const handleOpenDailog = (val: any) => {
	indicatorDetailsDialogRef.value.show(val);
};

const handleSearch = (val: any) => {
	const selected = metricOptions.value.find((item: any) => item.indicatorCode === val);
	if (selected) {
		searchParams.indicatorCode = selected.indicatorCode;
		searchParams.indicatorName = selected.indicatorName;
	}
	// 直接查询，因为下拉框数据是现成的，不需要重新 fetch
	getTableData();
};
const handleDateChange = (val: any) => {
	dateValue.value = val;
	if (!metricOptions.value?.length) {
		return;
	}
	if (props.dataSource !== 'city') {
		getTableData();
	}
};

defineExpose({ getTableData });
</script>

<style lang="less">
/* 合并单元格允许换行 */
.span-cell-wrap .cell {
	.one-row-ellipsis {
		white-space: break-spaces !important;
	}
}
</style>

<style lang="less" scoped>
.ledger-component {
	// 全市使用 LedgerTableContent 添加样式
	:deep(.LedgerTableContentClass) {
		height: 100% !important;
	}
	:deep(.title-part-left) {
		&::before {
			content: '';
			position: absolute;
			width: 0.89rem;
			height: 0.28rem;
			background: url('@/assets/images/gtf/title-bg-text.png');
			background-size: 100% 100%;
		}
		> span {
			font-weight: normal;
			display: inline-block;
			padding-top: 0.1rem;
			padding-left: 0.14rem;
			font-family: YouSheBiaoTiHei;
			font-size: 0.3rem;
			line-height: 0.25rem;
			background: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
			background-clip: text;
			-webkit-text-fill-color: transparent;
			filter: drop-shadow(0.02rem 0.02rem 0 #ffffff);
		}
	}

	height: 100%;
	display: flex;
	flex-direction: column;
	.el-card {
		height: 100%;
		overflow: auto;
		display: flex;
		flex-direction: column;
		border: none;
		// background-color: transparent;
		background: transparent;
		:deep(.el-card__body) {
			flex: 1;
			height: 0;
			background: white;
			border-radius: 0.12rem 0.12rem 0 0;
			// height: calc(100% - 1rem);
		}
		.page-content {
			height: 100%;
		}

		:deep(.el-card__header) {
			padding: 0 0 0.2rem 0;
			// background: red;
		}
	}
	.hindden-padding {
		// background-color: white;
		.GTFMdTitle {
			padding-bottom: 0.2rem;
		}
		.GTFMdTitle-hidden-padding {
			background: white;
			border-radius: 0.12rem 0.12rem 0 0;
		}
		:deep(.el-card__header) {
			padding: 0;
		}

		:deep(.el-card__body) {
			border-radius: 0;
		}
	}

	// 完成率灯状态样式 - 穿透到 td
	:deep(td.light-red) {
		background-color: #ffd9d9 !important;
	}
	:deep(td.light-yellow) {
		background-color: rgba(255, 177, 13, 0.15) !important;
	}
	:deep(td.light-green) {
		background-color: #deffe8 !important;
	}
	:deep(td.light-gray) {
		background-color: #e1e1e1 !important;
	}
	// 完成率灯状态样式 - 填满 td
	.completion-rate-box {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 8px 0 8px 0.16rem;
		box-sizing: border-box;
		&.light-red {
			color: #df5953;
			background: #ffd9d9;
		}
		&.light-yellow {
			color: #ffb10d;
			background: rgba(255, 177, 13, 0.15);
		}
		&.light-green {
			color: #53a064;
			background: #deffe8;
		}
		&.light-gray {
			color: #909399;
			background: #e1e1e1;
		}
	}

	:deep(.table-num-box) {
		justify-content: left;
	}
}
:deep(.title-part-right) {
	display: flex;
	align-items: center;
	.blue-text-btn {
		color: #0268fb;
		cursor: pointer;
		font-size: 0.16rem;
		margin-right: 2.36rem;
		padding-top: 0.1rem;
	}
}
</style>
