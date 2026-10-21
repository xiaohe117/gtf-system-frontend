<!--  环形进度条  -->
<template>
	<ChartContainer
		:chartOption="getChartOption()"
		:size="size"
		:width="width"
		:height="height"
		:isEmpty="false"
	/>
</template>

<script lang="ts" setup>
import { ECOption } from '@/utils/echarts';

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
		value: number;
		color?: string;
	}>(),
	{
		size: 'normal',
		width: 106,
		height: 106,
        color: '#00E9EA',
	}
);

const getChartOption = (): ECOption => ({
		animation: true,
		series: [
			{
				type: 'gauge', // 仪表盘图
				startAngle: 90,
				endAngle: 89,
				clockwise: false,
				min: 0,
				max: 100,
				radius: '80%',
				center: ['50%', '50%'],
				progress: {
					// 进度环
					roundCap: true,
					show: true,
					width: 12,
					itemStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									// 进度环的渐变色
									offset: 0,
									color: props.color, // 0% 处的颜色
								},
								{
									offset: 1,
									color: props.color, // 100% 处的颜色
								},
							],
						},
					},
				},
				axisLine: {
					// 背景环
					show: true,
					roundCap: true,
					lineStyle: {
						width: 12,
						color: [
							[0, '#1f445c'],
							[1, '#1f445c'],
						],
					},
				},
				pointer: { show: false },
				axisTick: { show: false },
				splitLine: { show: false },
				axisLabel: { show: false },
				detail: { show: false },
				data: [
					{
						value: props.value, // 进度值，最高为1
						detail: {
							show: true,
                            fontSize: 28,
                            fontFamily: 'DIN-Condensed-Bold',
							offsetCenter: ['0%', '0%'],
							color: props.color,
							formatter: '{value}%',
						},
					},
				],
			},
		],
	});
</script>
