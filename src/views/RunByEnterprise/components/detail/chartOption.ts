import { getSize } from '@/utils';
import imgUrl from '@/assets/images/runByEnterprise/newDetail/chart-bg.png';

const pieChartOption = (dataList: any) => {
	const colorList = ['#FF4D4F', '#1EB092', '#408FFF', '#E16CFF', '#F5CA45', '#37D9FE'];

	// 计算总和（用于百分比计算）
	const total = dataList.reduce((sum: any, item: any) => sum + item.value, 0);

	const option = {
		color: colorList,
		graphic: {
			elements: [
				{
					type: 'image',
					style: {
						image: imgUrl,
						width: getSize(140),
						height: getSize(129),
					},
					left: '35%',
					top: '21%',
				},
			],
		},
		legend: {
			icon: 'rect',
			top: '75%',
			left: 'center',
			bottom: 0,
			itemGap: getSize(16),
			itemWidth: getSize(10),
			itemHeight: getSize(10),
			itemStyle: {
				borderRadius: 0,
			},
			textStyle: {
				rich: {
					title: {
						color: '#4B4B4B',
						fontSize: getSize(14),
						padding: [0, 0, 0, getSize(8)],
						width: getSize(110),
					},
					value: {
						color: '#4B4B4B',
						fontSize: getSize(16),
						padding: [0, 0, 0, 0],
					},
				},
			},
			formatter(val: any) {
				let numVal = null;
				dataList.forEach((item: any) => {
					if (item.name === val) {
						numVal = item.value;
					}
				});
				return `{title|${val}}{value|${numVal}}`;
			},
		},
		series: [
			// 背景圆环配置
			{
				type: 'pie',
				center: ['50%', '36%'],
				radius: ['55%', '68%'],
				itemStyle: {
					color: 'rgba(169,181,255,0.1)',
				},
				label: {
					show: true,
				},
				data: [0],
			},
			{
				type: 'pie',
				center: ['50%', '36%'],
				radius: ['35%', '60%'],
				itemStyle: {
					borderWidth: getSize(2), // 描边线宽
					borderColor: '#ffffff',
				},
				label: {
					show: true,
					color: '#333333',
					fontSize: getSize(14),
					formatter: (params: any) => {
						if (params.name === '') return ''; // 空名称不显示
						const percent = ((params.value / total) * 100).toFixed(2); // 计算百分比
						return `${percent}%\n`; // 显示百分比（换行符可调整位置）
					},
				},
				labelLine: {
					show: true,
					length: getSize(30),
					length2: getSize(15),
					lineStyle: {
						color: '#4B4B4B', // 设置指向线的颜色，不设置会根据每一项去对应颜色
					},
				},
				data: dataList,
			},
		],
	};
	return option;
};
export default pieChartOption;
