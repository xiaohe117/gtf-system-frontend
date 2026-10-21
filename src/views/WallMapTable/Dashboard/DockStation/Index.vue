<!--
 * @Descripttion: 整体对接情况
 * @Author: zhaochao
 * @Date: 2025-12-23 14:35:15
 * @LastEditors: ycyun
 * @LastEditTime: 2025-12-31 17:33:42
-->
<template>
	<div class="dock-station">
		<template v-if="dockStationData.length">
			<div class="chart-box">
				<ChartContainer :chartOption="chartOption" />
			</div>
			<div class="chart-legend">
				<div class="legend-box">
					<div v-for="(item, index) in dockStationData" :key="index" class="legend-item fx-r">
						<div class="icon" :style="iconStyle(index)"></div>
						<div class="name">{{ item.name }}</div>
						<div class="value">
							<span>{{ item.value }}</span> 家
						</div>
					</div>
				</div>
			</div>
		</template>
		<default-empty-container v-else />
	</div>
</template>
<script lang="ts" setup>
// import dayjs from 'dayjs';
import { getOverallConnectionOverview } from '@/api/wallMapTable';
import pieChartOption from './chartOption';

/* interface DateRange {
	start: Date;
	end: Date;
} */

/* const props = defineProps({
	dateRange: {
		type: Object as () => DateRange | null,
		default: () => {},
	},
}); */

const colorList = [
	{
		color1: '#47E7C7',
		color2: '#1EB092',
	},
	{
		color1: '#FFDC68',
		color2: '#FFB637',
	},
	{
		color1: '#33A4FD',
		color2: '#176BF9',
	},
	{
		color1: '#FF4D4F',
		color2: '#FF4D4F',
	},
	{
		color1: '#37D9FE',
		color2: '#37D9FE',
	},
	{
		color1: '#E16CFF',
		color2: '#E16CFF',
	},
];

const dockStationData = ref<any>([]);
const chartOption = computed(() =>
	pieChartOption(
		dockStationData.value,
		'家',
		colorList
	)
);

const iconStyle = (index: any) => ({
	width: '0.16rem',
	height: '0.16rem',
	border: `0.035rem solid ${colorList[index % colorList.length].color2}`,
	borderRadius: '50%',
	backgroundColor: 'transparent',
});
const getDockStationData = () => {
	// if (!props.dateRange?.start) return;
	getOverallConnectionOverview({
		/* params: {
			startTime: dayjs(props.dateRange.start).format('YYYY-MM-DD'),
		}, */
	}).then((res: any) => {
		const data = res.data.map((item: any) => ({
			name: item.label,
			...item,
		}));
		dockStationData.value = data
	});
};
/* watch(
	() => props.dateRange,
	() => {
		getDockStationData();
	},
	{
		immediate: true,
	}
); */

onMounted(() => {
	getDockStationData();
});
</script>
<style lang="less" scoped>
.dock-station {
	width: 100%;
	height: 100%;
	.chart-box,
	.chart-legend {
		height: 50%;
	}
	.chart-legend {
		width: 100%;
		.legend-box {
			margin-top: 0.15rem;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.legend-item {
			margin: 0 auto;
			align-items: center;
			color: #333;
			font-size: 0.18rem;
			font-family: 'PingFangSC, PingFang SC';
			width: 4.17rem;
			height: 0.77rem;
			line-height: 0.77rem;
			background: url('@/assets/images/Ipad/pie-legend-bg.png') no-repeat;
			background-size: 100% 100%;
			margin-bottom: 0.24rem;
			padding: 0 0.24rem;
			.icon {
				margin-right: 0.36rem;
			}
			.name {
				flex: 1;
				font-size: 0.2rem;
				font-weight: 500;
			}
			.value {
				width: 1rem;
				text-align: right;
				span {
					font-size: 0.32rem;
					font-family: 'DIN-Condensed-Bold';
					color: #165dff;
					font-weight: bold;
					margin-right: 0.04rem;
				}
			}
		}
	}
}
</style>
