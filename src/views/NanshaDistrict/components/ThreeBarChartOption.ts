import { getSize } from '@/utils';

const threeBarChartOption = () => {
	// eslint-disable-next-line no-console
	console.log('chartData')
	const option = {
		title: {
			show: true,
			text: '单位/个',
			fontFamily: 'PingFangSC',
			textStyle: {
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.6)',
			},
			top: getSize(10),
			left: '0%',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
				shadowStyle: {
                     color: 'rgba(53, 108, 244, 0.1)'
                 },
			},
		},
		legend: {
			data: ['招商活动', '招商项目新增'],
			right: '4%',
			top: '2%',
			textStyle: {
				color: '#666',
				fontSize: getSize(18),
			},
			itemWidth: getSize(14),
			itemHeight: getSize(14),
			itemGap: getSize(20),
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '10%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: [
				'1月',
				'2月',
				'3月',
				'4月',
				'5月',
				'6月',
				'7月',
				'8月',
				'9月',
				'10月',
				'11月',
				'12月',
			],
			axisLabel: {
				fontSize: getSize(18),
				fontFamily: "PingFangSC, PingFang SC",
				fontWeight: 400,
				color: 'rgba(0,0,0,0.65)'
			},
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				fontSize: getSize(18),
				fontFamily: "PingFangSC, PingFang SC",
				fontWeight: 400,
				color: 'rgba(0,0,0,0.65)',
				align: 'right',
				verticalAlign: 'middle',
			},
			splitLine: {
				lineStyle: {
					color: '#999',
				},
			},
		},
		series: [
			{
				name: '招商活动',
				type: 'bar',
				barWidth: getSize(16),
				data: [0, 0, 0, 3, 11, 0, 4, 11, 0, 3, 19, 0],
				itemStyle: {
					color: '#74C0FC',
				},
			},
			{
				name: '招商项目新增',
				type: 'bar',
				barWidth: getSize(16),
				data: [0, 0, 74, 44, 94, 73, 191, 64, 35, 25, 45, 118],
				itemStyle: {
					color: '#FFB366',
				},
			},
		],
	};
	return option;
};

export default threeBarChartOption;
