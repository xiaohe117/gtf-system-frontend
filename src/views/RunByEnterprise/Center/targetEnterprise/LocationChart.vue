<!--
 * @Descripttion: 企业所在地
 * @Author: ycyun
 * @Date: 2025-10-27 16:35:37
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-31 14:46:38
-->
<template>
	<div class="location-chart" ref="chartBoxRef">
		<ChartContainer :chartOption="pieOption" ref="chartRef" />
	</div>
</template>
<script lang="ts" setup>
import useUserStore from '@/stores/user';
import { queryRegionTotal, queryRegionCount } from '@/api/index';
import { pieChartOption,handleResize,getOptionByWidth } from './chartOption';

const store = useUserStore();
const isWorld = computed(() => store.mapMode === 0);
const curTab = ref(0);

const pieOption = ref({});

const regionTotal = ref({}) as any;
const chartRef = ref();
const chartBoxRef = ref()
const getRegionTotal = async () => {
	try {
		const res = await queryRegionTotal<any>();
		const data = res?.data || [];
		regionTotal.value.china = data[0]?.count || 0;
		regionTotal.value.world = data[1]?.count || 0;
	} catch (error) {
		console.log(error);
	}
};
getRegionTotal();
const getChinaPieOption = async () => {
	try {
		const res = await queryRegionCount<any>({ domesticForeign: '0' });
		const data = res?.data || [];
		const chartData = data.map((el: any) => ({
			name: el.label,
			value: el.subCount,
			labelLine: {
				show: el.subCount > 0,
			},
			label: {
				show: el.subCount > 0,
			},
		}));
		const myChart = chartRef.value?.chartInstance.instance;
		pieOption.value = getOptionByWidth(myChart,pieChartOption(chartData, 0, '中国'))
	} catch (error) {
		console.log(error);
	}
};
const getWorldPieOption = async () => {
	try {
		const res = await queryRegionCount<any>({ domesticForeign: '1' });
		const data = res?.data || [];
		const chartData = data.map((el: any) => ({
			name: el.label,
			value: el.subCount,
			labelLine: {
				show: el.subCount > 0,
			},
			label: {
				show: el.subCount > 0,
			},
		}));
		const myChart = chartRef.value?.chartInstance.instance;
		pieOption.value =getOptionByWidth(myChart,pieChartOption(chartData, 0, '世界'))
	} catch (error) {
		console.log(error);
	}
};

const getOption = () => {
	if (curTab.value === 0 && !isWorld.value) {
		getChinaPieOption();
		return;
	}
	getWorldPieOption();
};

let resizeObserver: any = null;

onMounted(() => {
	resizeObserver = new ResizeObserver(() => handleResize(chartRef.value));
	resizeObserver.observe(chartBoxRef.value);
});
onUnmounted(() => {
	resizeObserver?.disconnect();
});
watch(
	() => isWorld.value,
	() => {
		nextTick(() => {
			getOption();
		})
		
	},
	{ immediate: true }
);
</script>
<style lang="less" scoped>
.location-chart {
	display: flex;
	flex-direction: column;
	padding-right: 0.24rem;
	padding-top: 0.24rem;
	:deep(.tabs-control) {
		width: 100%;
		display: flex;
		.tabs-control_item {
			width: 50%;
			flex: 1;
		}
		margin-bottom: 0.12rem;
	}
	.tab-box {
		height: 0.34rem;
	}
	.chart-box {
		height: calc(100% - 0.34rem - 0.12rem);
		flex: 1;
	}
}
</style>