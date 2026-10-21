<!-- 环形图 对应设计稿 0-5-2, 0-5-3, 0-5-4 -->
<template>
	<div class="doughnut-chart-container">
		<ChartContainer
			:chartOption="getChartOption()"
			:size="size"
			:width="width"
			:height="height"
			:isEmpty="isChartEmpty"
		/>
		<div v-if="showDivideLine" class="divide-line"></div>
	</div>
</template>

<script lang="ts" setup>
import type { PieSeriesItem } from '@/types/charts';
import { ECOption } from '@/utils/echarts';
import { formatNumber, formatNumberToPercent } from '@/utils';
import { color as defaultColor } from '@/echartsTheme/common-theme.json';

const props = withDefaults(
	defineProps<{
		/*
			'normal': 602 * 220,
			'large': 934 * 329,
			'customized': 自定义，需要同时传width & height
		*/
		size?: 'normal' | 'large' | 'customized';
		width?: number;
		height?: number;
		isSolid?: boolean;
		series: PieSeriesItem[];
		isPercentLegendValue?: boolean;
		dataUnit?: string;
		totalData?: number;
		subtext?: string;
		otherOption?: ECOption;
		hideDivide?: boolean;
	}>(),
	{
		size: 'normal',
		width: 602,
		height: 220,
		isSolid: false,
		isPercentLegendValue: false,
		dataUnit: '',
		totalData: undefined,
		subtext: '',
		otherOption: () => ({}),
		hideDivide: false,
	}
);

const isChartEmpty = computed(() => !props.series.length);

const showDivideLine = computed(() => !props.hideDivide && props.series.length > 6);

const getChartOption = (): ECOption => {
	let richObj = {};
	const colorList = props.otherOption.color as string[];
	const dataUnitWidth = props.dataUnit.length * 18;
	props.series.forEach((item, index) => {
		richObj = {
			...richObj,
			[`value${index}`]: {
				width: props.series.length < 7 ? 85 : 60,
				fontSize: 22,
				fontFamily: 'DIN-Condensed-Bold',
				color: colorList?.[index] || defaultColor[index],
				padding: [6, 4, 0, 0],
				align: 'right',
			},
		};
	});
	return {
		title: {
			show: props.totalData !== undefined,
			text: formatNumber(props?.totalData || 0),
			textStyle: {
				fontFamily: 'DIN-Condensed-Bold',
				fontSize: 22,
				color: '#ffffff',
				fontWeight: 'normal',
				lineHeight: 30,
			},
			subtext: props.subtext,
			subtextStyle: {
				fontSize: 16,
				color: '#CADCFF',
				padding: [16, 0, 0],
			},
			textAlign: 'center',
			top: 88,
			left: 104,
		},
		series: [
			{
				type: 'pie',
				emphasis: {
					disabled: true,
				},
				cursor: 'auto',
				radius: props.isSolid ? 103 : [53, 103],
				center: [104, 'center'],
				data: [
					{
						value: 1,
						itemStyle: {
							color: '#ffffff14',
						},
					},
				],
			},
			{
				type: 'pie',
				data: props.series,
				radius: props.isSolid ? 92 : [69, 92],
				center: [104, 'center'],
			},
		],
		legend: {
			top: 'center',
			right: 0,
			orient: 'vertical',
			itemGap: 14,
			height: props.series.length < 7 ? undefined : 180,
			formatter: (name) => {
				const singleData = props.series.find((item) => item.name === name);
				const singleIndex = props.series.findIndex((item) => item.name === name);
				const formatValue = props.isPercentLegendValue
					? formatNumberToPercent(Number(singleData?.ratio) || 0, 2)
					: formatNumber(singleData?.value || 0);
				const legendArr = [
					`{name|${name}}`,
					`{value${singleIndex}|${formatValue || '--'}}`,
				];
				if (props.dataUnit) {
					legendArr.push(`{unit|${props.dataUnit}}`);
				}
				if (props.series.length > 6 && singleIndex < 5) {
					legendArr.push(`{space|}`);
				}
				return legendArr.join('');
			},
			textStyle: {
				padding: [0, 0, 0, 4],
				fontSize: 18,
				rich: {
					name: {
						width: props.series.length < 7 ? 248 - dataUnitWidth : 95 - dataUnitWidth,
						color: '#CADCFF',
					},
					space: {
						width: 10,
					},
					unit: {
						width: dataUnitWidth,
						color: '#CADCFF',
						align: 'right',
					},
					...richObj,
				},
			},
		},
		...props.otherOption,
	};
};
</script>

<style lang="less" scoped>
.doughnut-chart-container {
	position: relative;
}
.divide-line {
	width: 0.01rem;
	height: 0.66rem;
	background-color: #ffffff4d;
	position: absolute;
	right: 1.82rem;
	top: calc(50% - 0.33rem);
}
</style>
