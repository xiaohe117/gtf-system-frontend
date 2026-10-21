import { getSize, getUrl } from '@/utils';

const pieChartOption = (
	chartData: any,
	unit: string = '家',
	colors: any = [
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
	]
) => {

	// const total = chartData.reduce((sum: number, item: any) => sum + item.value, 0) || 0;

	const richStyles: any = {
		name: {
			color: '#333',
			fontSize: getSize(20),
			width: getSize(220),
			fontWeight: 500,
			fontFamily: 'PingFangSC, PingFang SC'
		},
		value: {
			color: '#165DFF',
			fontSize: getSize(32),
			align: 'right', // 数值右对齐
			width: getSize(50), // 固定数值宽度
			fontFamily: 'DIN Alternate Bold',
			padding: [0, 0, 0, 0], // 调整 padding，使数值靠近单位
		},
		unit: {
			color: '#333333',
			fontSize: getSize(18),
			fontFamily: 'PingFangSC, PingFang SC',
			padding: [0, 0, 0, 0], // 单位紧贴数值
		},
	};
	chartData.forEach((item: any, index: number) => {
		const colorSet = colors[index % colors.length];
		richStyles[`value${index}`] = {
			...richStyles.value, // 继承基础 value 样式
			color: colorSet.color1, // 使用对应的颜色
		};
	});
	const option = {
		grid: {
			left: '0%',
			right: '0%',
			bottom: '0%',
		},
		color: chartData.map((item: any, index: number) => {
			const colorSet = colors[index % colors.length];
			// 创建线性渐变
			return {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [
					{
						offset: 0,
						color: colorSet.color1,
					},
					{
						offset: 1,
						color: colorSet.color2,
					},
				],
			};
		}),
		tooltip: {
			trigger: 'item',
			extraCssText: 'z-index:2',
			backgroundColor: 'rgba(255, 255, 255, 1)',
			borderColor: '#ccc',
			borderWidth: getSize(1),
			textStyle: {
				color: '#333',
				fontWeight: 'bold',
				fontSize: getSize(20),
				fontFamily: 'PingFangSC, PingFang SC',
			},
			padding: getSize(10),
		},
		// 图例 (右侧垂直排列)
		legend: {
			show: false,
			type: 'scroll',
			orient: 'vertical',
			left: 'center',
			bottom: getSize(20),
			icon: 'circle',
			itemGap: getSize(54),
			itemWidth: getSize(18),
			itemHeight: getSize(18),
			data: chartData.map((d: any, index: number) => ({
				name: d.name,
				// 为每个图例项设置对应的颜色
				itemStyle: {
					borderColor: colors[index % colors.length].color2,
					borderWidth: getSize(4),
					color: 'transparent', // 保持内部透明
				}
			})),
			pageIconSize: getSize(10),
			pageTextStyle: {
				fontSize: getSize(16),
			},
			textStyle: {
				color: 'transparent', // 必须设置为透明
				fontSize: getSize(14),
				rich: richStyles,
				padding: [0, 0, 0, getSize(30)],
			},
			formatter: (name: string) => {
				const dataItem = chartData.find((d: any) => d.name === name);
				// const index = chartData.findIndex((d: any) => d.name === name);
				// eslint-disable-next-line prefer-template
				const nameStr = name.length > 6 ? name.substr(0, 6) + '...' : name;
				// 使用对应索引的value样式，确保颜色一致
				return `{name|${nameStr}}{value|${dataItem?.value || 0}}{unit|${unit}}`;
			},
			tooltip: {
				show: true
			}
		},
		// 图形元素
		graphic: [
			// ...chartData.map((item: any, index: number) => {
			// 	// 计算每个图例项的位置
			// 	const itemHeight = getSize(77); // 每个项目的高度
			// 	const itemWidth = getSize(417); // 每个项目的宽度
			// 	const itemY = getSize(20) + index * (itemHeight + getSize(20)); // 调整位置计算
			// 	return {
			// 		type: 'rect',
			// 		id: `legend-bg-${index}`,
			// 		left: 'center',
			// 		bottom: itemY,
			// 		shape: {
			// 			width: itemWidth,
			// 			height: itemHeight,
			// 			r: getSize(8) // 圆角
			// 		},
			// 		style: {
			// 			fill: {
			// 				type: 'linear',
			// 				x: 1,
			// 				y: 0,
			// 				x2: 0,
			// 				y2: 0,
			// 				colorStops: [
			// 					{
			// 						offset: 0,
			// 						color: '#F5FAFF',
			// 					},
			// 					{
			// 						offset: 1,
			// 						color: '#E8F2FE',
			// 					}
			// 				]
			// 			}, // 背景色
			// 			// stroke: colors[index % colors.length].color1, // 边框颜色与数据颜色对应
			// 			lineWidth: getSize(4),
			// 			// shadowColor: 'rgba(0, 0, 0, 0.1)',
			// 			// shadowBlur: getSize(5),
			// 			// 如果需要背景图片，可以使用 image 属性
			// 			image: getUrl('Ipadpie-inner-icon.png')
			// 		},
			// 		z: -1
			// 	};
			// }),
			// 中心图片
			{
				type: 'image',
				left: 'center',    // 水平居中
				top: 'center',
				style: {
					image: getUrl('Ipad/pie-inner-icon.png'),
					width: getSize(217),
					height: getSize(217),
					opacity: 1,
				},
				z: 2
			},
		],
		// 核心饼图配置
		series: [
			// 背景圆环配置
			{
				type: 'pie',
				center: ['50%', '50%'],
				radius: ['52%', '82%'],
				silent: true, // 鼠标事件不触发
				itemStyle: {
					color: 'rgba(169,181,255,0.08)',
					background: 'linear-gradient( 145deg, #A9CAFE 0%, #E8F2FC 100%)',
				},
				label: {
					show: true,
				},
				data: [0],
			},
			{
				type: 'pie',
				center: ['50%', '50%'],
				radius: ['52%', '72%'], // 环形图 [内半径, 外半径]
				avoidLabelOverlap: true,
				data: chartData,
				labelLayout: {
					hideOverlap: false // 是否隐藏重叠标签
				},
				itemStyle: {
					borderWidth: getSize(2), // 描边线宽
					borderColor: '#ffffff',
				},
				label: {
					show: true,
					color: '#333333',
					fontSize: getSize(16),
					height: getSize(27),
					lineHeight: getSize(27),
					width: getSize(90),
					align: 'center', // 水平居中
					verticalAlign: 'middle', // 垂直居中
					backgroundColor: '#E3EFFF', // 文字块背景色
					borderRadius: getSize(7),
					padding: [getSize(8), getSize(4)],
					fontFamily: 'PingFangSC, PingFang SC',
					formatter: (params: any) => {
						// if (params.value === 0) return '';
						if (params.name === '') return ''; // 空名称不显示
						// const percent = ((params.value / total) * 100).toFixed(2); // 计算百分比
						return `占比 {percent|${(params.data.percentage * 100 || 0).toFixed(0)}%}`; // 显示百分比（换行符可调整位置）
					},
					rich: {
						percent: {
							align: 'center',
							verticalAlign: 'middle',
							lineHeight: getSize(27),
							fontSize: getSize(22),
							color: '#165DFF',
							fontFamily: 'DIN Alternate Bold',
						},
					},
				},
				labelLine: {
					show: true,
					symbol: 'roundRect',
					symbolKeepAspect: true,
					symbolSize: getSize(8),
					length: getSize(20),
					length2: getSize(15),
					lineStyle: {
						color: '#4B4B4B',
					},
				},
			},
		],
	};
	return option;
};

export default pieChartOption;