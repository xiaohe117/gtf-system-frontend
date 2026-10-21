import { getSize, getUrl } from '@/utils';


const pieChartOption = (chartData: any, isShowLabel: boolean = false, unit: string = '个') => {

	const colors = [
		{
			color1: '#33A4FD',
			color2: '#176BF9'
		},
		{
			color1: '#FFDC68',
			color2: '#FFB637'
		},
		{
			color1: '#47E7C7',
			color2: '#1EB092'
		},
		{
			color1: '#FF4D4F',
			color2: '#FF4D4F'
		},
		{
			color1: '#37D9FE',
			color2: '#37D9FE'
		},
		{
			color1: '#E16CFF',
			color2: '#E16CFF'
		},
	];
	const total = chartData.reduce((sum: number, item: any) => sum + item.value, 0);

	const richStyles: any = {
		name: {
			color: '#4B4B4B',
			fontSize: getSize(14),
			width: isShowLabel ? getSize(120) : getSize(150),
		},
		value: {
			color: '#1D2129',
			fontSize: getSize(16),
			align: 'right', // 数值右对齐
			width: getSize(50), // 固定数值宽度
			padding: [0, 0, 0, 0], // 调整 padding，使数值靠近单位
		},
		unit: {
			color: '#1D2129',
			fontSize: getSize(14),
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
						color: colorSet.color1
					},
					{
						offset: 1,
						color: colorSet.color2
					}
				]
			};
		}),
		// 图例 (右侧垂直排列)
		legend: {
			orient: 'vertical',
			right: getSize(0),
			top: 'center',
			icon: 'rect',
			itemGap: isShowLabel ? getSize(18) : getSize(26),
			itemWidth: getSize(10),
			itemHeight: getSize(10),
			data: chartData.map((d: any) => d.name),
			itemStyle: {
				borderCap: 'square',
				borderRadius: 0,
				borderColor: 'transparent',  // 设置边框为透明，消除白边
				borderWidth: 0
			},
			textStyle: {
				color: 'transparent', // 必须设置为透明
				fontSize: getSize(14),
				rich: richStyles
			},
			formatter: (name: string) => {
				const dataItem = chartData.find((d: any) => d.name === name);
				const index = chartData.findIndex((d: any) => d.name === name);
				// 使用对应索引的value样式，确保颜色一致
				return `{name|${name}}{value${index}|${dataItem?.value || 0}}{unit|${unit}}`;
			}
		},
		// 图形元素
		graphic: [
			// 中心图片
			{
				type: 'image',
				left: '10%',
				top: '25.6%',
				style: {
					image: getUrl('runByEnterprise/right/pie-inner-icon.png'),
					width: getSize(110),
					height: getSize(100),
					opacity: 1 // 确保图片不受外层透明度影响
				},
			}
		],
		// 核心饼图配置
		series: [
			// 背景圆环配置
			{
				type: 'pie',
				center: ['23%', '50%'],
				radius: ['93%', '78%'],
				itemStyle: {
					color: 'rgba(169,181,255,0.08)',
					background: 'linear-gradient( 145deg, #A9CAFE 0%, #E8F2FC 100%)'
				},
				label: {
					show: true,
				},
				data: [0],
			},
			{
				type: 'pie',
				radius: ['55%', '80%'], // 环形图 [内半径, 外半径]
				center: ['23%', '50%'], // 左对齐
				avoidLabelOverlap: true,
				data: chartData,
				itemStyle: {
					borderWidth: getSize(2), // 描边线宽
					borderColor: '#ffffff',
				},
				label: {
					show: isShowLabel,
					color: '#333333',
					fontSize: getSize(14),
					formatter: (params: any) => {
						// if (params.value === 0) return '';
						// if (params.name === '') return ''; // 空名称不显示
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
				// 高亮状态样式（可选）
				emphasis: {
					scale: false,
					label: {
						show: false,
					},
				},
			},
		],
	};
	return option;
};

const pieChartOption2 = (chartData: any, type: number = 0, title: string = '', unit: string = '家') => {
	const colors = [
		{
			color1: '#33A4FD',
			color2: '#176BF9'
		},
		{
			color1: '#FFDC68',
			color2: '#FFB637'
		},
		{
			color1: '#47E7C7',
			color2: '#1EB092'
		},
		{
			color1: '#FF4D4F',
			color2: '#FF4D4F'
		},
		{
			color1: '#37D9FE',
			color2: '#37D9FE'
		},
		{
			color1: '#E16CFF',
			color2: '#E16CFF'
		},
	];
	const total = chartData.reduce((sum: number, item: any) => sum + item.value, 0) || 0;

	const richStyles: any = {
		name: {
			color: '#4B4B4B',
			fontSize: getSize(14),
			width: getSize(150),
		},
		value: {
			color: '#1D2129',
			fontSize: getSize(16),
			align: 'right', // 数值右对齐
			width: getSize(50), // 固定数值宽度
			padding: [0, 0, 0, 0], // 调整 padding，使数值靠近单位
		},
		unit: {
			color: '#1D2129',
			fontSize: getSize(14),
			padding: [0, 0, 0, 0], // 单位紧贴数值
		},
	};
	// 创建中心文本的富文本样式
	const centerRichStyles: any = {
		total: {
			fontSize: getSize(16),
			fontWeight: 'bold',
			color: '#FFFFFF',
			fontFamily: '@number-font',
		},
		unit: {
			fontSize: getSize(10),
			color: '#FFFFFF',
			padding: [2, 0, 0, 4],
			fontFamily: 'PingFangSC, PingFang SC',
		}
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
			left: type === 1 ? '1%' : '0%',
			right: type === 1 ? '1%' : '0%',
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
						color: colorSet.color1
					},
					{
						offset: 1,
						color: colorSet.color2
					}
				]
			};
		}),
		// 使用标题显示total和unit，自动居中
		title: type === 1 ? [] : [
			{
				// 标题显示地区名称
				text: title,
				left: '38%',
				top: '42%',
				textAlign: 'center',
				textStyle: {
					fontSize: getSize(18),
					color: '#FFFFFF',
					fontFamily: 'PingFangSC, PingFang SC',
					fontWeight: '400'
				}
			},
			{
				// 标题显示total和unit，自动居中
				text: `{total|${total}}{unit|${unit}}`,
				left: '38%',
				top: '53%',
				textAlign: 'center',
				textStyle: {
					width: getSize(110),
					align: 'center',
					rich: centerRichStyles
				}
			}
		],
		// 图例 (右侧垂直排列)
		legend: {
			orient: 'vertical',
			right: getSize(0),
			top: 'center',
			icon: 'rect',
			itemGap: getSize(18),
			itemWidth: getSize(10),
			itemHeight: getSize(10),
			data: chartData.map((d: any) => d.name),
			itemStyle: {
				borderCap: 'square',
				borderRadius: 0,
				borderColor: 'transparent',  // 设置边框为透明，消除白边
				borderWidth: 0
			},
			textStyle: {
				color: 'transparent', // 必须设置为透明
				fontSize: getSize(14),
				rich: richStyles
			},
			formatter: (name: string) => {
				const dataItem = chartData.find((d: any) => d.name === name);
				const index = chartData.findIndex((d: any) => d.name === name);
				// 使用对应索引的value样式，确保颜色一致
				return `{name|${name}}{value${index}|${dataItem?.value || 0}}{unit|${unit}}`;
			}
		},
		// 图形元素
		graphic: [
			// 中心图片
			{
				type: 'image',
				left: type === 1 ? '30.4%' : '27.9%',
				top: type === 1 ? '30.4%' : '28.2%',
				style: {
					image: type === 1 ? getUrl('runByEnterprise/right/pie-inner-icon.png') : getUrl('runByEnterprise/right/pie-inner-target.png'),
					width: type === 1 ? getSize(140) : getSize(140),
					height: type === 1 ? getSize(130) : getSize(140),
					opacity: 1 // 确保图片不受外层透明度影响
				},
			},
		],
		// 核心饼图配置
		series: [
			// 背景圆环配置
			{
				type: 'pie',
				center: ['38%', '50%'],
				radius: ['80%', '75%'],
				itemStyle: {
					color: 'rgba(169,181,255,0.08)',
					background: 'linear-gradient( 145deg, #A9CAFE 0%, #E8F2FC 100%)'
				},
				label: {
					show: true,
				},
				data: [0],
			},
			{
				type: 'pie',
				radius: ['50%', '70%'], // 环形图 [内半径, 外半径]
				center: ['38%', '50%'], // 左对齐
				avoidLabelOverlap: true,
				data: chartData,
				itemStyle: {
					borderWidth: getSize(2), // 描边线宽
					borderColor: '#ffffff',
				},
				label: {
					show: true,
					color: '#333333',
					fontSize: getSize(14),
					height: getSize(27),
					lineHeight: getSize(27),
					width: getSize(52),
					align: 'center',        // 水平居中
					verticalAlign: 'middle', // 垂直居中
					backgroundColor: '#E3EFFF', // 文字块背景色
					borderRadius: getSize(7),
					padding: [0, getSize(8), 0, getSize(8)],
					formatter: (params: any) => {
						if (params.value === 0) return '';
						if (params.name === '') return ''; // 空名称不显示
						const percent = ((params.value / total) * 100).toFixed(2); // 计算百分比
						return `${percent || 0}%\n`; // 显示百分比（换行符可调整位置）
					},
					rich: {
						percent: {
							align: 'center',
							verticalAlign: 'middle',
							lineHeight: getSize(27),
							fontSize: getSize(14),
							color: '#333333',
						}
					}
				},
				labelLine: {
					show: true,
					symbol: 'roundRect',
					symbolKeepAspect: true,
					symbolSize: getSize(8),
					length: getSize(30),
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
export { pieChartOption, pieChartOption2 };
