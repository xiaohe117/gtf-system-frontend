<!--  折线图 对应设计稿 0-2-1, 0-2-2, 0-2-3, 0-2-4  -->
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
import type { CategoryAxisOption, LineSeriesItem, ValueAxisOption } from '@/types/charts';
import echarts, { ECOption } from '@/utils/echarts';
import type { LineSeriesOption } from 'echarts/charts';
import { formatNumber } from '@/utils';
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
		categoryData: string[];
		series: LineSeriesItem[];
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
	if (seriesId === 'other') {
		return props.dataUnit?.[1];
	}
	if (seriesId.includes('percent')) {
		return '';
	}
	return props.dataUnit?.[0] || '';
};

const getChartOption = (): ECOption => {
	const series: LineSeriesOption[] = [];
	const lineNumber = props.series.length;
	const colorList = props.otherOption.color as string[];
	props.series.forEach((item, index) => {
		const areaStyle =
			lineNumber < 2 || lineNumber > 3
				? {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: `${colorList?.[index] || defaultColor[index]}4d`,
							},
							{
								offset: 1,
								color: `${colorList?.[index] || defaultColor[index]}00`,
							},
						]),
				  }
				: undefined;
		const lineSeriesOption = {
			name: item.name,
			id: item.id,
			type: 'line' as const,
			data: item.data,
			smooth: lineNumber > 3,
			symbolSize: lineNumber > 3 ? 6 : 10,
			areaStyle,
		};
		series.push(lineSeriesOption);
	});
	const categoryAxis: CategoryAxisOption = {
		type: 'category',
		data: props.categoryData,
	};
	const valueAxisList: ValueAxisOption[] = [
		{
			type: 'value',
			splitNumber: 4,
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
		title: {
			text: `单位：${props.dataUnit[0]}`,
		},
		xAxis: categoryAxis,
		yAxis: valueAxisList,
		series,
		legend: {
			top: 0,
			right: 0,
			textStyle: {
				padding: [0, 0, 0, 4],
			},
		},
		tooltip: [
			{
				className: 'tooltip-box',
				axisPointer: {
					lineStyle: {
						type: 'dashed',
						width: 1,
						color: '#CBDDFF',
						opacity: 0.7,
					},
				},
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
