<template>
	<SmallTitle class="fx-1">
		<template #title>
			<div class="fx-r fx-al-c">
				<!-- 针对固定资产投资额指标特殊处理 -->
				{{
					`${attrs.indicatorData.indexTitle}指标-${isSpecialIndex ? '部门' : ''}镇街对标`
				}}
				<el-radio-group class="mg-l" v-model="dataType" @change="getData" size="small">
					<el-radio-button
						v-for="item in searchTab"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-radio-group>
			</div>
		</template>
		<GrowthRateTable
			:height="'5.7rem'"
			:tableData="streetData"
			:tableColumns="tableColumns"
			@click-row="handleClickRow"
			@handleSortChange="handleSortChange"
			:row-class-name="tableRowClassName"
			ref="growthTableRef"
		>
			<template #deptName="{ row }">
				<div class="fx-r fx-al-c">
					<i class="bg_light bg_common_light"></i>
					<div class="overflow-ellipsis">{{ row.deptName }}</div>
				</div>
			</template>
			<template #category="{ row }">
				{{ categoryType[row.category] }}
			</template>
		</GrowthRateTable>
		<div
			v-if="streetData.length > 0 && orderProp !== 'total'"
			class="text-decoration"
			:style="{
				'margin-left': `${baseLinePosition}px`,
			}"
		>
			花都区增速({{
				streetData[0]?.cityGrow !== null ? `${streetData[0]?.cityGrow}%` : EmptyConst
			}})
		</div>
		<div v-if="streetData.length > 0" class="tips">*点击某镇街可查看对应指标镇街详情</div>
	</SmallTitle>
	<IndicatorDetailsDialog ref="indicatorDetailsDialogRef" :defaultDate="attrs.timeScale" />
</template>
<script lang="ts" setup>
import { ref, useAttrs } from 'vue';
import { queryStreetCompareList } from '@/api/dailyMonitoring/indicatorDetailsPage';
import { EmptyConst } from '@/constanst/BaFormConstanst';
import { isEmpty } from '@/utils/';
import IndicatorDetailsDialog from '@/views/EfficiencyCenter/IndicatorDetailsPage/Dialog.vue';
import SmallTitle from '../components/SmallTitle.vue';
import GrowthRateTable from '../components/GrowthRateTable.vue';

const attrs: any = useAttrs();
const indicatorDetailsDialogRef = ref<any>();
const streetData = ref<any>([]); // 镇街对标数据
const orderProp = ref<any>(''); // 排序字段
const unitMeasurement = ref<any>(''); // 单位
const categoryType = ref<any>({
	1: '统计值',
	2: '摸查值',
	3: '预测值',
});
const isSpecialIndex = computed(() => attrs.indicatorData.indexId === 'IND0000041'); // 是否为固定资产投资额指标
const searchTab = computed(() => {
	if (attrs.hasSearchTab) {
		return [
			{ label: '单季度', value: '2' },
			{ label: '季度累计', value: '3' },
		];
	}
	return [];
});
const dataType = ref(searchTab.value[1]?.value || '3');
const growthTableRef = ref<any>(null);

const hasTargetTotal = computed(() =>
	streetData.value.some((item: any) => !isEmpty(item.targetTotal))
);
const hasTargetGrowRate = computed(() =>
	streetData.value.some((item: any) => !isEmpty(item.targetGrow))
);

const tableColumns = computed(() => [
	{ label: '序号', type: 'index', width: '30', align: 'left' },
	{
		label: ' 镇街',
		prop: 'deptName',
		type: 'slot',
		slotName: 'deptName',
		width: '80',
		align: 'left',
	},
	{
		label: `${unitMeasurement.value ? `目标总量${isSpecialIndex.value ? '(全年)' : ''}(${unitMeasurement.value})` : '目标总量'}`,
		prop: 'targetTotal',
		type: 'num',
		width: '70',
		align: 'right',
		visible: hasTargetTotal.value,
	},
	{
		label: `目标增速${isSpecialIndex.value ? '(全年)' : ''}(%)`,
		prop: 'targetGrow',
		type: 'iconPercent',
		width: '60',
		align: 'right',
		visible: hasTargetGrowRate.value,
	},
	{
		label: `${unitMeasurement.value ? `总量(${unitMeasurement.value})` : '总量'}`,
		prop: 'total',
		type: 'num',
		width: '90',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '增速(%)',
		prop: 'growRate',
		type: 'growRate',
		width: '80',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: `${orderProp.value === 'total' ? '总量' : '增速'}排名`,
		headerAlign: 'center',
		type: 'percent',
		prop: orderProp.value === 'total' ? 'newTotalRate' : 'newGrowRate',
		lineProp: orderProp.value === 'total' ? '' : 'newCityGrow',
		width: `${300 - (hasTargetTotal.value ? 72 : 0) - (hasTargetGrowRate.value ? 50 : 0)}`,
		showToolTip: false,
		align: 'left',
	},
	{
		label: '增速环比(%)',
		prop: 'lastMonthGrowCompare',
		type: 'iconPercent',
		align: 'right',
	},
	{ label: '较上期排名', type: 'relativeRank', prop: 'lastMonthSortCompare', width: '90' },
	{ label: '数据类型', type: 'slot', slotName: 'category', align: 'left' },
]);

const tableRowClassName = ({ row }: { row: any }) => {
	let ret = '';
	if (row.lightingColor === 1) {
		ret = 'red';
	} else if (row.lightingColor === 2) {
		ret = 'yellow';
	} else if (row.lightingColor === 3) {
		ret = 'green';
	}
	return ret;
};
// 获取街镇对标数据
const getQueryStreetCompareList = async (timeScale: any) => {
	streetData.value = [];
	if (!timeScale) return;
	const params = {
		indexId: attrs.indicatorData.indexId,
		deptId: attrs.indicatorData.deptId,
		timeScale,
		dataType: dataType.value,
	};
	try {
		const res = await queryStreetCompareList({ params });
		if (res.code === 200) {
			const { data } = res as any;
			const maxGrowRate = Math.max(...data.map((item: any) => Number(item.growRate)));
			const maxTotal = Math.max(...data.map((item: any) => Number(item.total)));
			streetData.value = data.map((item: any) => ({
				newGrowRate:
					Number(item.growRate) <= 0 ? 0 : (Number(item.growRate) / maxGrowRate) * 100,
				newCityGrow:
					Number(item.cityGrow) <= 0 ? 0 : (Number(item.cityGrow) / maxGrowRate) * 100,
				newTotalRate: Number(item.total) <= 0 ? 0 : (Number(item.total) / maxTotal) * 100,
				...item,
			}));
			unitMeasurement.value = streetData.value.find(
				(item: any) => item.unitMeasurement
			)?.unitMeasurement;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

const getData = async () => {
	getQueryStreetCompareList(attrs.timeScale);
};

// 街镇指标详情穿透
const handleClickRow = (row: any) => {
	if (row.deptId) {
		indicatorDetailsDialogRef.value?.show({
			deptId: row.deptId || '',
			indexId: row.indexId || '',
			indexTitle: row.indexName || '',
		});
	}
};

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	orderProp.value = prop;
	streetData.value = streetData.value.sort((a: any, b: any) => {
		if (order === 'asc') {
			return Number(a[prop]) - Number(b[prop]);
		}
		return Number(b[prop]) - Number(a[prop]);
	});
};
const baseLinePosition = computed(() => {
	// js 计算使文字和虚线对齐
	let columnsList = [];
	if (growthTableRef.value.tableRef) {
		const { columns } = growthTableRef.value.tableRef;
		// 获取每一列真实宽度
		columnsList = columns.map((item: any) => item.realWidth);
	}
	columnsList = columnsList.slice(0, columnsList.length - 3);
	const sum = columnsList.reduce((acc: any, cur: any, curIndex: any) => {
		if (curIndex !== columnsList.length - 1) {
			return acc + cur;
		}
		return acc;
	}, 0);
	let marginLeft = sum - 30;
	// 虚线相对柱状体移位距离
	const barOffset = (columnsList[columnsList.length - 1] * streetData.value[0].newCityGrow) / 100;
	// 防止增速大于100或者小于0 文字位置与bar-line无法对齐
	if (barOffset > columnsList[columnsList.length - 1]) {
		marginLeft += columnsList[columnsList.length - 1];
	} else if (barOffset < 0) {
		marginLeft += 0;
	} else {
		marginLeft += barOffset;
	}
	return marginLeft;
});

watch(
	() => attrs.indicatorData,
	() => {
		getData();
	},
	{
		immediate: true,
	}
);

watch(
	() => attrs.timeScale,
	() => {
		getData();
	}
);
</script>
<style lang="less" scoped>
.small-title-wrapper {
	padding-bottom: 0;
	width: 0;
	:deep(.title-part) {
		margin-bottom: 0.1rem;
	}
}
.fx-1 {
	height: 100%;
}
.text-decoration {
	color: #df5953;
	font-size: 0.16rem;
}
.tips {
	color: #202741;
	margin-top: -0.16rem;
	position: absolute;
	right: 0.24rem;
	// bottom: -0.1rem;
	font-size: 0.16rem;
}
.bg_common_light {
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width: 0.24rem;
	height: 0.24rem;
	flex-shrink: 0;
	display: inline-block;
}
.red .bg_light {
	background-image: url('@/assets/images/dailyMonitoring/statistics/red_light.png');
}
.yellow .bg_light {
	background-image: url('@/assets/images/dailyMonitoring/statistics/yellow_light.png');
}
.green .bg_light {
	background-image: url('@/assets/images/dailyMonitoring/statistics/green_light.png');
}
.el-table {
	:deep(thead) {
		tr {
			th:nth-of-type(2) {
				padding-left: 0.24rem;
			}
		}
	}
}
</style>
