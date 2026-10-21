<template>
	<ChartContainer :chartOption="getChartOption()" :height="height" />
</template>

<script lang="ts" setup>
import type { PieSeriesItem } from '@/types/charts';
import { ECOption } from '@/utils/echarts';
import { formatNumber } from '@/utils';

const props = withDefaults(
	defineProps<{
		height: number;
		totalData: number;
		subtext?: string;
		series: PieSeriesItem[];
		dataUnit: string;
		colorList: string[];
	}>(),
	{
		subtext: '',
	}
);

const getChartOption = (): ECOption => {
	let richObj = {};
	props.series.forEach((item, index) => {
		richObj = {
			...richObj,
			[`value${index}`]: {
				width: 60,
				fontSize: 26,
				fontFamily: 'DIN-Condensed-Bold',
				color: props.colorList[index],
				padding: [6, 0, 0],
				align: 'right',
			},
			[`unit${index}`]: {
				width: 24,
				color: props.colorList[index],
				align: 'right',
			},
		};
	});
	return {
		title: {
			text: `{value|${formatNumber(props.totalData)}} {unit|${props.dataUnit}}`,
			textStyle: {
				rich: {
					value: {
						fontFamily: 'DIN-Condensed-Bold',
						fontSize: 30,
						color: '#4F9EFD',
					},
					unit: {
						fontSize: 16,
						color: '#4F9EFD',
					},
				},
			},
			subtext: props.subtext,
			textAlign: 'center',
			top: 72,
			left: 120,
		},
		series: [
			{
				type: 'pie',
				data: props.series,
				radius: [54, 85],
				center: [120, 'center'],
			},
			{
				type: 'pie',
				emphasis: {
					disabled: true,
				},
				cursor: 'auto',
				radius: [85, 93],
				center: [120, 'center'],
				data: [
					{
						value: 1,
						itemStyle: {
							color: '#778CA21a',
						},
					},
				],
			},
		],
		legend: {
			top: 'center',
			right: 24,
			orient: 'vertical',
			itemGap: 7,
			formatter: (name) => {
				const singleData = props.series.find((item) => item.name === name);
				const singleIndex = props.series.findIndex((item) => item.name === name);
				const legendArr = [
					`{name|${name}}`,
					`{value${singleIndex}|${formatNumber(singleData?.value || 0)}}`,
					`{unit${singleIndex}|${props.dataUnit}}`,
				];
				return legendArr.join('');
			},
			textStyle: {
				rich: {
					name: {
						width: 90,
						fontSize: 18,
						color: '#CADCFF',
					},
					...richObj,
				},
			},
		},
	};
};
</script>
