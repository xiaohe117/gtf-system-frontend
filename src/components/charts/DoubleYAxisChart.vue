<!-- 双轴图 对应设计稿 0-3-2, 0-3-3, 0-3-4 -->
<template>
	<ChartContainer
		:chartOption="getChartOption()"
		:size="size"
		:width="width"
		:height="height"
		:isEmpty="isChartEmpty"
	/>
</template>

<script lang="ts" setup>
import type { CategoryAxisOption, BarLineSeriesItem, ValueAxisOption } from '@/types/charts';
import { ECOption } from '@/utils/echarts';
import type { LineSeriesOption, BarSeriesOption } from 'echarts/charts';
import { formatNumber } from '@/utils';

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
		categoryData: string[];
		series: BarLineSeriesItem[];
		dataUnit?: string[];
		otherOption?: ECOption;
	}>(),
	{
		size: 'normal',
		width: 602,
		height: 220,
		dataUnit: () => [''],
		otherOption: () => ({}),
	}
);

const isChartEmpty = computed(
	() => !props.categoryData.length || props.series.every((item) => !item.data.length)
);

const getDataUnit = (seriesId: string) => {
	let res = '';
	if (seriesId.includes('other')) {
		res = props.dataUnit?.[1];
	} else if (!seriesId.includes('percent')) {
		res = props.dataUnit?.[0];
	}
	return res;
};

type SeriesOption = LineSeriesOption | BarSeriesOption;
const getChartOption = (): ECOption => {
	const series: SeriesOption[] = [];
	const barNumber = props.series.filter((item) => item.type === 'bar').length;
	props.series.forEach((item) => {
		const barSeriesOption = {
			name: item.name,
			id: item.id,
			type: item.type,
			data: item.data,
			yAxisIndex: item.yAxisIndex,
			stack: item?.stack,
		};
		if (barNumber > 1) {
			series.push({
				barWidth: 12,
				...barSeriesOption,
			});
		} else {
			series.push(barSeriesOption);
		}
	});
	const categoryAxis: CategoryAxisOption = {
		type: 'category',
		data: props.categoryData,
	};

	const valueAxisList: ValueAxisOption[] = [
		{
			type: 'value',
			splitNumber: 4,
			alignTicks: true,
		},
		{
			type: 'value',
			splitNumber: 4,
			axisLabel: {
				formatter: props.dataUnit?.[1] === '%' ? '{value}%' : '{value}',
			},
		},
	];
	return {
		grid: {
			containLabel: true,
			top: 44,
			left: 0,
			right: 2,
			bottom: 0,
		},
		title: [
			{
				text: `单位：${props.dataUnit[0]}`,
			},
			{
				text: !props.dataUnit?.[1] || props.dataUnit?.[1] === '%' ? '' : `单位：${props.dataUnit[1]}`,
				right: 0,
			},
		],
		xAxis: categoryAxis,
		yAxis: valueAxisList,
		series,
		legend: {
			top: 0,
			right: props.dataUnit?.[1] !== '%' ? undefined : 0,
			left: props.dataUnit?.[1] !== '%' ? 'center' : undefined,
			textStyle: {
				padding: [0, 0, 0, 4],
			},
		},
		tooltip: [
			{
				className: 'tooltip-box',
				formatter: (params) => {
					let res = '';
					if (Array.isArray(params)) {
						const { name } = params[0];
						res = `<div class="tooltipsHead">${name}</div>`;
						params.forEach((item) => {
							const { seriesName, seriesId, color } = item;
							const value = formatNumber(Number(item.value));
							let marker = item.marker as string;
							marker = marker.replace('margin-right:4px;', 'margin-right:0.08rem;');
							res += `<div class="tooltipsLine">
								<span class="tooltipsLine-left">
									${marker}
									<span>${seriesName}</span>
								</span>
								<span>
									<span class="number-font" style="color: ${color}">
										${value}${seriesId?.includes('percent') ? '%' : ''}
									</span>
									<span>
										${getDataUnit(seriesId!)}
									</span>
								</span>
							</div>`;
						});
					}
					return res;
				},
			},
		],
		...props.otherOption,
	};
};
</script>
