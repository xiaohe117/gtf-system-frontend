<!--  柱状图 对应设计稿 0-0-1, 0-0-2, 0-0-3, 0-1-2, 0-1-3, 0-1-4  -->
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
import type { CategoryAxisOption, BarSeriesItem, ValueAxisOption } from '@/types/charts';
import { ECOption } from '@/utils/echarts';
import type { BarSeriesOption } from 'echarts/charts';
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
		series: BarSeriesItem[];
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
	return props.dataUnit?.[0] || '';
};

const getChartOption = (): ECOption => {
	const series: BarSeriesOption[] = [];
	const barNumber = props.series.length;
	props.series.forEach((item) => {
		const barSeriesOption = {
			name: item.name,
			id: item.id,
			type: 'bar' as const,
			data: item.data,
			stack: item?.stack,
		};
		let barWidth = 20;
		if (!item?.stack) {
			if (barNumber > 3) {
				barWidth = 7;
			} else if (barNumber > 1) {
				barWidth = 12;
			}
		}
		series.push({
			barWidth,
			...barSeriesOption,
		});
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
