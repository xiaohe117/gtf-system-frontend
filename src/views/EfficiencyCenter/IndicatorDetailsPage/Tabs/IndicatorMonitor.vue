<template>
	<div>
		<!-- 亮灯 -->
		<LightingMonitoring v-bind="$attrs" />
		<!-- 指标分析 -->
		<!-- <IndexAnalysis v-bind="$attrs" v-else /> -->
		<!-- 趋势 -->
		<SmallTitle>
			<template #title>
				<div class="fx-r fx-al-c">
					{{ `${indicatorName || attrs.indicatorData.indicatorName || ''}指标-指标趋势` }}
					<el-radio-group
						class="mg-l btn-radio"
						v-model="dataType"
						@change="getData"
						size="small"
					>
						<el-radio-button
							v-for="item in searchTab"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-radio-group>
				</div>
			</template>
			<BaseChart
				:chartOption="chartOption"
				:isEmpty="isChartEmpty"
				width="100%"
				height="3.35rem"
				v-bind="$attrs"
			/>
		</SmallTitle>
	</div>
</template>
<script lang="ts" setup>
import { useAttrs } from 'vue';
import BaseChart from '@/components/BaseChart.vue';
import { queryTrendList } from '@/api/dailyMonitoring/indicatorDetailsPage';
import LightingMonitoring from '../components/LightingMonitoring.vue';
// import IndexAnalysis from '../components/IndexAnalysis.vue';
import SmallTitle from '../components/SmallTitle.vue';
import { barLineOption2 } from '../components/chartOptions';

const attrs: any = useAttrs();

const searchTab = computed(() => [
	{ label: '当月数', value: '01' },
	{ label: '累计数', value: '02' },
]);
const dataType = ref<string>('01');
const indicatorName = ref<string>('');

// const emit = defineEmits(['loaded']);
// 获取运行态势（今年数据判断摸查值还是统计值，上年数据都是统计值）
const isChartEmpty = ref(false);
const chartData = ref({
	title: '',
	tooltipName: '',
	dataXName: [],
	dataYbar: [],
	dataYline: [],
	// legendArr: ['总量', '', '', '增速'],
	legendArr: [],
	unitArr: ['', '', '', '%'],
	yAxisName: ['', '增速'],
});
const chartOption = computed(() => barLineOption2(chartData.value));
const defaultDate = computed(() => attrs.defaultDate); // 时间选择

const findFirstUnit = (list: Array<any>) => {
	const target = list.find((item) => !!item.unit);
	return target ? target.unit : '';
};
const getQueryTrendList = async (selectedDate: any) => {
	isChartEmpty.value = true;
	if (!selectedDate) return;
	try {
		const params = {
			indicatorCode: attrs.indicatorData.indicatorCode,
			yearMonth: selectedDate,
			tabType: attrs.tabType,
			dataType: dataType.value,
			targetId: attrs.isGzwDept ? '' : attrs.deptCode
		};
		const res = await queryTrendList(params);
		if (res.code === 0) {
			const { data } = res as any;
			if (!data?.thisYearList?.length) return;
			isChartEmpty.value = false;

			indicatorName.value = data?.thisYearList[0]?.indicatorName || '';
			chartData.value.title = indicatorName.value || attrs.indicatorData.indicatorName || '';
			chartData.value.tooltipName = dataType.value === '01' ? '环比' : '同比';
			// 数据单位
			chartData.value.unitArr[0] = findFirstUnit(data?.thisYearList || []);
			chartData.value.yAxisName[0] = findFirstUnit(data?.thisYearList || []);
			chartData.value.unitArr[1] = findFirstUnit(data?.lastYearList || []);
			chartData.value.unitArr[2] = findFirstUnit(data?.growthTrendList || []);

			chartData.value.dataXName = data?.thisYearList?.map((el: any) => el.yearMonth) || [];
			chartData.value.dataYbar = data?.thisYearList?.map((el: any) => el.value) || [];
			chartData.value.dataYline = data?.growthTrendList?.map((el: any) => el.value) || [];
		} else {
			isChartEmpty.value = true;
		}
	} catch (error) {
		isChartEmpty.value = true;
	}
};

// 获取数据
const getData = async () => {
	await getQueryTrendList(defaultDate.value);
};

watch(
  [defaultDate, () => attrs.indicatorData, () => attrs.tabType],
  () => getData(),
  { immediate: true }
)
</script>
<style lang="less" scoped>
.chart-box {
	:deep(.date-part) {
		top: 0.48rem;
	}
}
:deep(.tooltips-part) {
	padding: 0.2rem;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.8);
	box-shadow: 0rem 0.02rem 0.1rem 0.04rem rgba(0, 0, 0, 0.08);
	border-radius: 0.08rem;
	border: 0.02rem solid;
	border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) 2 2;
	backdrop-filter: blur(0.07rem);
	.title {
		font-weight: 500;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.85);
	}
	.tag {
		margin-left: 0.08rem;
		padding: 0.01rem 0.08rem;
		background: #e6f7ff;
		border-radius: 0.02rem;
		border: 0.01rem solid #91d5ff;
		font-weight: 400;
		font-size: 0.12rem;
		color: #1890ff;
		line-height: 0.2rem;
	}
	.items {
		padding-top: 0.16rem;
		.icon {
			width: 0.14rem;
			height: 0.14rem;
			background: #0769ff;
			border-radius: 0.02rem;
			margin-right: 0.08rem;
			&.line {
				width: 0.14rem;
				height: 0.04rem;
				background: #0769ff;
				border-radius: 0.02rem;
			}
		}
		.label,
		.value {
			font-weight: 400;
			font-size: 0.16rem;
			color: #202741;
		}
		.label {
			padding-right: 0.16rem;
		}
	}
}
.btn-radio {
	margin-left: 0.16rem;
	:deep(.el-radio-button.is-active) {
		.el-radio-button__inner {
			background: #2f6bef !important;
		}
	}
}
</style>
