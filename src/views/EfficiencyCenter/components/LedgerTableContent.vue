<template>
	<AdvanceMultiHeaderTable
		:tableData="tableData"
		:columns="tableColumns"
		:row-class-name="rowClass"
		:hideOrder="true"
		ref="tableRef"
		row-key="indicatorCode"
		:expands="expandedRows"
		:searchTypeRow="0"
		v-bind="$attrs"
		@row-click="handleRowClick"
		class="ledger-table"
		:loading="loading"
		:tree-props="{ children: 'childrenList' }"
	>
		<template #index="{ row, index }">
			<span
				v-if="row.childrenList?.length"
				class="custom-expand-icon"
				@click.stop="toggleExpand(row)"
			>
				<span class="expand-icon" v-if="!expandedRows.includes(row.indicatorCode)"></span>
				<span class="shrink-icon" v-else></span>
			</span>
			<template v-if="index === 0">
				{{ row.index }}
			</template>
			<template v-else-if="row.indexBracket">
				{{ row.indexBracket }}
			</template>
			<template v-else>
				{{ row.index }}
			</template>
		</template>
		<!--<template #totalRate="{ row }">
			<div class="gray">{{ row.totalRate }}</div>
		</template>-->

		<!-- 完成率：灯状态显示 -->
		<template #totalRate="{ row, index, col }">
			<span v-if="index === 0 && !row[col.prop]"></span>
			<div
				v-else-if="row[col.prop]"
				class="completion-rate-box"
				:class="getLightStatusClass(row.lightStatus)"
			>
				{{ row[col.prop] }}{{ col.unit || '%' }}
			</div>
			<span v-else class="completion-rate-box" :class="getLightStatusClass(row.lightStatus)">
				<span v-if="!row.isGroupHeader">{{ EmptyConst }}</span>
			</span>
		</template>

		<!-- 指标所属模块列 -->
		<template #indicatorModule="{ row, index }">
			<template v-if="index === 0">
				<el-select
					v-model="filterValues.indicatorModule"
					placeholder="请选择"
					clearable
					size="small"
					style="width: 100%"
					@change="handleFilter"
					class="search-select"
				>
					<el-option
						v-for="item in moduleOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</template>
			<template v-else-if="row.indicatorModule">
				<span
					@click="handleModuleClick(row)"
					class="module-tag"
					:style="{
						backgroundColor: moduleBgColorMap[row.indicatorModule] || '#983',
						borderColor: moduleBorderColorMap[row.indicatorModule] || '#398',
						color: moduleColorMap[row.indicatorModule] || '#e34',
					}"
				>
					{{ row.indicatorModule }}
				</span>
			</template>
		</template>
		<!-- 指标名称列 -->
		<template #indicatorName="{ row, index }">
			<template v-if="index === 0">
				<el-input
					v-model="filterValues.indicatorName"
					placeholder="请输入"
					clearable
					size="small"
					@input="handleFilter"
					class="search-input"
				/>
			</template>
			<template v-else>
				<span class="indicator-name-content">
					<!--<span
						v-if="row.children?.length"
						class="custom-expand-icon"
						@click.stop="toggleExpand(row)"
					>
						<span
							class="expand-icon"
							v-if="!expandedRows.includes(row.indicatorCode)"
						></span>
						<span class="shrink-icon" v-else></span>
					</span>-->
					<div @click="handleModuleClick(row)">{{ row.indicatorName }}</div>
				</span>
			</template>
		</template>
	</AdvanceMultiHeaderTable>
	<IndicatorDetailsDialog
		ref="indicatorDetailsDialogRef"
		:defaultDate="defaultDate"
		tabType="city"
	/>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';
import { getSize, EmptyConst } from '@/utils/';
import { getChineseByNum } from '@/utils/common';
import AdvanceMultiHeaderTable from '@/components/table/AdvanceMultiHeaderTable.vue';
import { indicatorDropDown, tabData } from '@/api/EfficiencyCenter';
import IndicatorDetailsDialog from '@/views/EfficiencyCenter/IndicatorDetailsPage/Dialog.vue';
// import ServiceUrl from '@/utils/url';

// Props 定义
const props = defineProps({
	selectDate: {
		type: String,
		default: '',
	},
});

const tableRef = ref<any>();

const loading = ref(true);

// 展开/收起状态管理
const expandedRows = ref<string[]>([]);

const indicatorDetailsDialogRef = ref();
const store = useUserStore();
const defaultDate = computed(() => store.dateSelect);

// 切换展开/收起状态
const toggleExpand = (row: any) => {
	tableRef.value.tableRef.toggleRowExpansion(row);
	const index = expandedRows.value.indexOf(row.indicatorCode);
	if (index > -1) {
		expandedRows.value.splice(index, 1);
	} else {
		expandedRows.value.push(row.indicatorCode);
	}
};

// 过滤条件
const filterValues = ref({
	indicatorModule: '', // 指标所属模块筛选值
	indicatorName: '', // 指标名称筛选值
});

// 原始数据（用于过滤后恢复）
const originalTableData = ref<any[]>([]);

const moduleOptions: any = ref([]);

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

// 模块颜色映射
const moduleBgColorMap: Record<string, string> = {
	项目: '#FFF4F8', // 红/粉色
	企业: '#FDF5FF', // 青色
	线索: '#E8F8F2', // 蓝色
	场景: '#E4F1FF', // 绿色
	活动: '#FEF3E6', // 黄色
	目标企业: '#FDF5FF', // 黄色
};

const moduleBorderColorMap: Record<string, string> = {
	项目: 'rgba(196,0,77,0.5)', // 红/粉色
	企业: 'rgba(225,108,255,0.5)', // 青色
	线索: 'rgba(0,168,112,0.5)', // 蓝色
	场景: 'rgba(22,93,255,0.5)', // 绿色
	活动: 'rgba(237,123,47,0.5)', // 黄色
	目标企业: 'rgba(225,108,255,0.5)', // 黄色
};

const moduleColorMap: Record<string, string> = {
	项目: '#C4004D', // 红/粉色
	企业: '#E16CFF', // 青色
	线索: '#00A870', // 蓝色
	场景: '#165DFF', // 绿色
	活动: '#ED7B2F', // 黄色
	目标企业: '#E16CFF', // 黄色
};
const tableColumns: any = computed(() => [
	{
		prop: 'index',
		type: 'slot',
		slotName: 'index',
		label: '序号',
		align: 'center',
		// fixed: 'left',
		width: getSize(120),
		headerAlign: 'center',
	},
	{
		prop: 'indicatorName',
		searchType: 'input',
		slotName: 'indicatorName',
		label: '指标名称',
		align: 'left',
		width: getSize(380),
		headerAlign: 'center',
		// fixed: 'left',
	},
	{
		prop: 'indicatorModule',
		searchType: 'select',
		slotName: 'indicatorModule',
		label: '指标所属模块',
		align: 'left',
		// fixed: 'left',
		width: getSize(180),
		headerAlign: 'center',
	},
	{
		prop: 'unit',
		label: '计量单位',
		align: 'left',
		width: getSize(120),
		headerAlign: 'center',
	},
	{
		label: '当月数',
		align: 'left',
		headerAlign: 'center',
		children: [
			{
				prop: 'monthDone',
				label: '完成数',
				type: 'number',
				align: 'left',
				width: getSize(150),
				headerAlign: 'center',
			},
			{
				prop: 'monthOnMonth',
				label: '环比',
				align: 'left',
				type: 'rate',
				unit: '%',
				width: getSize(150),
				headerAlign: 'center',
			},
		],
	},
	{
		label: '累计数',
		align: 'left',
		headerAlign: 'center',
		children: [
			{
				prop: 'totalTarget',
				label: '目标',
				align: 'left',
				type: 'number',
				width: getSize(150),
				headerAlign: 'center',
			},
			{
				prop: 'totalDone',
				label: '完成数',
				type: 'number',
				align: 'left',
				width: getSize(150),
				headerAlign: 'center',
			},
			{
				prop: 'totalRate',
				type: 'slot',
				slotName: 'totalRate',
				label: '完成率',
				align: 'left',
				// type: 'rate',
				unit: '%',
				width: getSize(150),
				headerAlign: 'center',
			},
			{
				prop: 'yearOnYear',
				label: '同比',
				align: 'left',
				type: 'rate',
				unit: '%',
				width: getSize(150),
				headerAlign: 'center',
			},
		],
	},
]);

const tableData = ref<any>();

/**
 * 设置标题行样式
 */

const rowClass = ({ row }: { row: any }) => {
	// if (row.isFilterRow) return 'filter-row';
	if (row.isGroupHeader) return 'group-header';
	return 'cursor-pointer';
};

const getTableData = (indicatorModule?: string, indicatorName?: string) => {
	tableData.value = [];
	expandedRows.value = [];
	// 重置过滤条件
	filterValues.value = { indicatorModule, indicatorName } as any;

	const params = {
		tabType: 'city',
		yearMonth: props.selectDate,
		...filterValues.value,
	};

	loading.value = true;

	tabData(params)
		.then((res: any) => {
			if (res.code === 0) {
				const { data = [] } = res || {};
				const table: any = [];
				let i = 0;
				data.forEach((item1: any, index1: number) => {
					table.push({
						indicatorCode: `group_${index1}`,
						index: getChineseByNum(index1 + 1),
						indicatorName: item1.indicatorName,
						isGroupHeader: true,
					});
					if (item1.childrenList.length > 0) {
						item1.childrenList.forEach((item2: any) => {
							// item2 总是设置正常序号
							// eslint-disable-next-line no-plusplus
							item2.index = ++i;
							let j = 0;
							if (item2.childrenList?.length) {
								// expandedRows.value.push(item2.indicatorCode);
								item2.childrenList.forEach((item3: any) => {
									// eslint-disable-next-line no-plusplus
									item3.indexBracket = `（${++j}）`;
								});
							}
							table.push({
								...item2,
							});
						});
					}
				});

				// 添加过滤行到表格首位
				const filterRow = {
					indicatorCode: 'filter_row',
					isFilterRow: true,
				};

				// 保存原始数据
				originalTableData.value = [filterRow, ...table];

				if (originalTableData.value.length > 1) {
					tableData.value = [filterRow, ...table];
				} else {
					tableData.value = [filterRow];
				}
				loading.value = false;
			} else {
				loading.value = false;
			}
		})
		.catch(() => {
			loading.value = false;
		});
};

// 过滤逻辑
const handleFilter = () => {
	const { indicatorModule, indicatorName } = filterValues.value;

	// 过滤行始终保留
	const filterRow = {
		indicatorCode: 'filter_row',
		isFilterRow: true,
	};

	getTableData(indicatorModule, indicatorName);

	tableData.value = [filterRow, ...originalTableData.value];
};

const handleRowClick = (row: any, column: any) => {
	// eslint-disable-next-line no-console
	console.log('row:', row, column);
	/*
	if (column.property === 'index') return;
	timeValue.value = time.value;
	if (row.indicatorCode) {
		indicatorDetailsDialogRef.value.show({
			deptId: '440114000000000',
			indexId: row.indicatorCode || '',
			indexTitle: row.indicatorName || '',
		});
	}
	*/
};

const handleModuleClick = (row: any) => {
	// eslint-disable-next-line no-console
	console.log('handleModuleClick', row);
	if(row.isGroupHeader) return
	indicatorDetailsDialogRef.value.show(row);

	/*
	if (row.indicatorModule === '项目' || row.indicatorModule === '线索') {
		const url = `${ServiceUrl.clientUrl}#/operationCenter/project?url=${ServiceUrl.getQmSysUrl()}/pc/index/components/workStaticList`;
		window.open(url, '_blank');
	}
	*/
};

const getIndicatorDropDown = () => {
	const params = {
		tabType: 'city',
	};
	indicatorDropDown(params).then((res: any) => {
		if (res.code === 0) {
			moduleOptions.value = res.data.map((item: any) => ({
				label: item.indicatorName,
				value: item.indicatorCode,
			}));
		}
	});
};

onMounted(() => {
	getIndicatorDropDown();
});

watch(
	() => props.selectDate,
	() => {
		getTableData();
	}
);

defineExpose({ getTableData });
</script>

<style scoped lang="less">
// 模块标签样式
.module-tag {
	display: inline-block;
	padding: 0 0.08rem;
	border-radius: 0.02rem;
	font-size: 12px;
	font-weight: 500;
	border-width: 0.01rem;
	border-style: solid;
}

// 指标名称内容样式（包含展开图标）
.indicator-name-content {
	display: inline-flex;
	align-items: center;
	gap: 4px;
}

// 自定义展开图标样式
.custom-expand-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #409eff;
	padding: 2px;
	border-radius: 2px;
	transition: background-color 0.2s;
	position: absolute;
	left: 0.25rem;
	top: 0.12rem;
	span {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 0.16rem;
		height: 0.16rem;
		display: inline-block;
	}
	.expand-icon {
		background-image: url('@/assets/images/EfficiencyCenter/expand2.png');
	}
	.shrink-icon {
		background-image: url('@/assets/images/EfficiencyCenter/expand1.png');
	}
}

:deep(.el-table) {
	// 过滤行样式
	.filter-row {
		background-color: #f5f7fa !important;
		td {
			padding: 8px 12px !important;
		}
		.cell {
			padding: 0 8px;
		}
	}

	// 隐藏所有展开图标
	.el-table__expand-icon {
		display: none !important;
	}

	// 隐藏树形缩进
	.el-table__indent {
		display: none !important;
	}

	// 隐藏占位符
	.el-table__placeholder {
		display: none !important;
	}

	// 隐藏所有级别的展开图标（包括子行）
	[class*='el-table__row--level'] .el-table__expand-icon {
		display: none !important;
	}
	.expand-icon {
		display: inline-block;
		width: 0.16rem;
		height: 0.16rem;
		vertical-align: middle;
		cursor: pointer;
		img {
			width: 100%;
			height: 100%;
			vertical-align: top;
		}
	}
	.el-table__row--level-1 {
		td:nth-of-type(1) {
			.cell {
				text-align: right;
			}
		}
	}
}
:deep(.el-scrollbar__view) {
	height: 100%;
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
.search-input,
.search-select {
	font-size: 0.18rem;
	:deep(.el-select__selected-item) {
		font-size: 0.18rem;
	}
}
</style>

<style lang="less">
// 全局样式 - 隐藏 el-table 展开图标
.ledger-table {
	.el-table__expand-icon {
		display: none !important;
	}

	.el-table__indent {
		padding-left: 0.35rem !important;
	}

	.el-table__placeholder {
		display: none !important;
	}

	// 隐藏所有级别的展开图标
	[class*='el-table__row--level'] {
		.el-table__expand-icon {
			display: none !important;
		}
	}
	.table-num-box {
		justify-content: flex-start;
	}
}

.ledger-table .group-header {
	td:nth-child(n + 2) {
		border-right-color: transparent !important;
	}
	td:nth-child(n + 4) {
		.table-value {
			color: transparent !important;
		}
	}
	.cell {
		font-size: 0.18rem;
	}
}
</style>
