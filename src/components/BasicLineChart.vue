<template>
	<ChartContainer :chartOption="getChartOption()" :height="height" />
</template>

<script lang="ts" setup>
import type { CategoryAxisOption, BarLineSeriesItem, ValueAxisOption } from '@/types/charts';
import { ECOption } from '@/utils/echarts';
import type { LineSeriesOption } from 'echarts/charts';
import { formatNumber } from '@/utils';

const props = withDefaults(
	defineProps<{
		height: number;
		subtext?: string;
		categoryData: string[];
		series: BarLineSeriesItem[];
		splitNumber?: number;
		isXAxisValue?: boolean;
		hasSecondaryValueAxis?: boolean;
		dataUnit?: string[];
	}>(),
	{
		subtext: '',
		splitNumber: 3,
		isXAxisValue: false,
		hasSecondaryValueAxis: false,
		dataUnit: () => [''],
	}
);

const getDataUnit = (seriesId: string) => {
	let res = '';
	if (seriesId === 'other') {
		res = props.dataUnit?.[1];
	} else if (seriesId !== 'percent') {
		res = props.dataUnit?.[0];
	}
	return res;
};
const getChartOption = (): ECOption => {
	const series: LineSeriesOption[] = [];
	props.series.forEach((item) => {
		series.push({
			name: item.name,
			id: item.id,
			type: 'line',
			data: item.data,
			yAxisIndex: item.yAxisIndex,
		});
	});
	const categoryAxis: CategoryAxisOption = {
		type: 'category',
		data: props.categoryData,
	};

	const valueAxisList: ValueAxisOption[] = [
		{
			type: 'value',
			splitNumber: props.splitNumber,
			alignTicks: true,
		},
		{
			type: 'value',
			splitNumber: props.splitNumber,
			min: 0,
			max: 100,
			interval: 25,
			axisLabel: {
				formatter: '{value}%',
			},
		},
	];
	let valueAxis: ValueAxisOption[];
	if (props.hasSecondaryValueAxis) {
		valueAxis = valueAxisList;
	} else {
		valueAxis = [valueAxisList[0]];
	}
	return {
		grid: {
			containLabel: true,
			top: 44,
			left: 0,
			right: 0,
			bottom: 0,
		},
		title: {
			subtext: props.subtext,
		},
		xAxis: props.isXAxisValue ? valueAxis : categoryAxis,
		yAxis: props.isXAxisValue ? categoryAxis : valueAxis,
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
										${value}${seriesId === 'percent' ? '%' : ''}
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
	};
};
</script>

<style lang="less" scoped>
:deep(.tooltip-box) {
	.number-font {
		font-family: @number-font;
		font-size: 0.2rem;
	}
	.tooltipsLine {
		display: flex;
		justify-content: space-between;
	}
	.tooltipsLine-left {
		margin-right: 0.24rem;
		display: flex;
		align-items: center;
	}
}
</style>
