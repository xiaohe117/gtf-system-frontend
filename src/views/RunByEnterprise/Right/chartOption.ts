import { getSize, getUrl, formatNumber, getStackMaxValue } from '@/utils';


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

const pieChartOption3 = (chartData: any) => {
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
	];

	const richStyles: any = {
		name: {
			color: '#4B4B4B',
			fontSize: getSize(14),
			width: getSize(120),
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
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: (params: any) => {
				const { marker, data } = params;
				const { name, value = 0, rate } = data;
				if (value === 0) {
					return '';
				}
				return `<div style="font-size: 0.18rem;color:#fff">${marker} ${name} ${formatNumber(value)}家 (${rate}%)</div> `;
			}
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
		// 图例 (右侧垂直排列)
		legend: {
			orient: 'vertical',
			right: getSize(0),
			top: 'center',
			icon: 'rect',
			itemGap: getSize(28),
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
				return `{name|${name}}{value${index}|${dataItem?.value || 0}}{unit|家}`;
				// return `{name|${name}(${dataItem?.subValue || 0}${dataItem?.subUnit})}{value${index}|${dataItem?.value || 0}}{unit|家}`;
			}
		},


		// 图形元素
		graphic: [
			// 中心图片
			{
				type: 'image',
				left: '11.8%',
				top: '28.6%',
				style: {
					image: getUrl('runByEnterprise/right/pie-inner-icon.png'),
					width: getSize(121),
					height: getSize(111),
					opacity: 1 // 确保图片不受外层透明度影响
				},
			},
		],
		// 核心饼图配置
		series: [
			// 背景圆环配置
			{
				type: 'pie',
				radius: ['74%', '85%'],
				center: ['26%', '50%'],
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
				radius: ['50%', '74%'], // 环形图 [内半径, 外半径]
				center: ['26%', '50%'], // 左对齐
				avoidLabelOverlap: true,
				data: chartData,
				itemStyle: {
					borderWidth: getSize(2), // 描边线宽
					borderColor: '#ffffff',
				},
			},
		],
	};
	return option;
};

const barOption = (chartData: any) => ({
	grid: {
		top: '20%',
		bottom: getSize(20),
		left: getSize(10),
		right: getSize(10),
		containLabel: true
	},
	tooltip: {
		trigger: "axis",
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		textStyle: {
			fontSize: getSize(18),
			color: 'rgba(0,0,0,.7)',
			fontFamily: 'MicrosoftYaHei',
		}
	},
	legend: {
		data: ['目标企业总数', '已跟进企业数量', '对接次数'],
		icon: 'rect',
		itemGap: getSize(28),
		itemWidth: getSize(10),
		itemHeight: getSize(10),
		textStyle: {
			color: "rgba(0,0,0,0.5)",
			fontSize: getSize(18),
			fontFamily: "PingFangSC, PingFang SC",
		}
	},
	xAxis: {
		data: chartData.map((d: any) =>  d.name),
		axisLine: {
			show: true,
			lineStyle: {
				color: '#E7E9EE',
				width: getSize(1),
			}
		},
		
		axisTick: {
			show: true
		},
		axisLabel: {
			show: true,
			textStyle: {
				color: "rgba(0,0,0,0.6)", // X轴文字颜色
				fontSize: getSize(18),
				fontFamily: "PingFangSC, PingFang SC",
			},
			interval:0,
			formatter: (value: any) => {
				if (value.length > 3) {
					// 横坐标最多显示6个字符
					const moreText = value.length > 6 ? '...' : ''
					return `${value.slice(0, 3)}\n${value.slice(3,6)}${moreText}`
				}
				return value;
			}
		},
	},
	yAxis: [{
		type: "value",
		name: '单位(家)',
		nameTextStyle: {
			fontSize: getSize(18),
			color: "rgba(0,0,0,0.5)",
			fontFamily: "PingFangSC, PingFang SC",
		},
		nameGap: getSize(15),
		alignTicks: true,
		splitLine: {
			show: true,
			lineStyle: {
				color: 'rgba(0,0,0,0.7',
				width: getSize(1),
			}
		},
		axisTick: {
			show: false
		},
		axisLine: {
			show: false,
		},
		axisLabel: {
			show: true,
			padding: [0, 0, getSize(-6), 0],
			textStyle: {
				color: "rgba(0,0,0,0.6)",
				fontSize: getSize(18),
				fontFamily: "PingFangSC, PingFang SC",
			}
		},
	},
	{
		type: "value",
		name: '对接次数',
		nameTextStyle: {
			fontSize: getSize(18),
			color: "rgba(0,0,0,0.5)",
			fontFamily: "PingFangSC, PingFang SC",
		},
		nameGap: getSize(15),
		position: "right",
		alignTicks: true,
		splitLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		axisLine: {
			show: false
		},
		axisLabel: {
			show: true,
			padding: [0, 0, getSize(-6), 0],
			textStyle: {
				color: "rgba(0,0,0,0.6)",
				fontSize: getSize(18),
				fontFamily: "Microsoft",
			}
		}
	}
	],
	series: [
		{
			name: "目标企业总数",
			type: "bar",
			color: "#003FCF",
			barWidth: getSize(10),
			data: chartData.map((d: any) => d.targets || 0),
		},
		{
			name: "已跟进企业数量",
			type: "bar",
			color: "#3489FF",
			barWidth: getSize(10),
			barGap: getSize(1),
			data: chartData.map((d: any) => d.num || 0),
		},
		{
			name: "对接次数",
			type: "line",
			yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
			smooth: true, // 平滑曲线显示
			showAllSymbol: true, // 显示所有图形。
			symbol: 'emptyCircle',
			symbolSize: getSize(6), // 标记的大小
			itemStyle: {
				color: "#ABCDFF",
				borderWidth: getSize(2),
				width: getSize(2),
			},
			lineStyle: {
				color: "#ABCDFF",
				width: getSize(2),
			},
			data: chartData.map((d: any) => d.touchTimes || 0),
		},
	]
})

const stackBarOption = (chartData: any, unit: string = '家') => {
	// 传入 yData，自动计算堆叠最大值，且最小值为 5
	const maxValue = getStackMaxValue(chartData.yData, 5);

	const seriesData = chartData.yData?.map((item: any) => ({
		name: item.name,
		stack: '总数',
		type: 'bar',
		barWidth: getSize(20),
		data: item.data,
	}));

	const option = {
		color: chartData.colorArr,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			textStyle: {
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.7)',
				fontFamily: 'MicrosoftYaHei',
			},
			formatter(params: any[]) {
				// 1. 计算总数
				let total = 0;
				params.forEach((item) => {
					total += item.value;
				});

				// 2. 第一行：部门名称 + 总数 (加粗/右对齐模拟)
				// 使用 HTML 标签进行简单的排版
				let res =
					`<div style="margin-bottom: 0.05rem; display:flex; justify-content: space-between;">` +
					`<span style="font-weight:bold; color:#333;">${params[0].name}</span>` +
					`<span style="font-weight:bold; color:#333; margin-left: 0.2rem;">${
						total
					}${unit}</span>` +
					`</div>`;

				// 3. 循环输出每个系列的详情 (带颜色圆点)
				params.forEach((item) => {
					res +=
						`<div style="display:flex; justify-content: space-between; align-items: center;">` +
						// 左侧：颜色圆点 + 名称
						`<span>${item.marker}${item.seriesName}</span>` +
						// 右侧：数值 + 单位
						`<span style="margin-left: 0.2rem; font-weight:bold;">${
							item.value
						}${unit}</span>` +
						`</div>`;
				});

				return res;
			},
		},
		legend: {
			left: 0,
			top: 0,
			textStyle: {
				color: 'rgba(0,0,0,0.5)',
				fontSize: getSize(18),
				fontFamily: 'PingFangSC, PingFang SC',
			},
			icon: 'rect',
			itemWidth: getSize(10),
			itemHeight: getSize(10),
		},
		grid: {
			top: '18%',
			left: '3%',
			right: '1%',
			bottom: '5%',
			containLabel: true,
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: '#E7E9EE',
						width: getSize(1),
					},
				},
				axisTick: { show: false },
				axisLabel: {
					show: true,
					textStyle: {
						color: 'rgba(0,0,0,0.6)', // X轴文字颜色
						fontSize: getSize(18),
						fontFamily: 'PingFangSC, PingFang SC',
						lineHeight: getSize(24),
					},
					interval: 0,
					formatter: (value: any) => {
						if (value.length > 3) {
							// 横坐标最多显示6个字符
							const moreText = value.length > 6 ? '...' : '';
							return `${value.slice(0, 3)}\n${value.slice(3, 6)}${moreText}`;
						}
						return value;
					},
				},
				data: chartData.xData,
			},
		],
		yAxis: [
			{
				type: 'value',
				name: `单位/${unit}`, // 添加Y轴单位
				nameTextStyle: {
					fontSize: getSize(18),
					color: 'rgba(0,0,0,0.5)',
					fontFamily: 'PingFangSC, PingFang SC',
				},
				nameGap: getSize(12),
				alignTicks: true,
				splitLine: {
					show: true,
					lineStyle: {
						color: 'rgba(0,0,0,0.7',
						width: getSize(1),
					},
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					show: true,
					padding: [0, 0, getSize(-10), 0],
					textStyle: {
						color: 'rgba(0,0,0,0.6)',
						fontSize: getSize(18),
						fontFamily: 'PingFangSC, PingFang SC',
					},
				},
				min: 0,
				max: maxValue,
				splitNumber: 5,
			},
		],
		dataZoom: [
			{
				type: 'slider',
				orient: 'horizontal',
				show: chartData.xData.length > 5,
				bottom: '0%',
				height: getSize(8),
				startValue: 0,
				endValue: 4,
				brushSelect: false,
				backgroundColor: '#eef2fd',
				fillerColor: '#bcc3f1',
				handleIcon:
					'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z', // 画一个圆形
				handleSize: '100%',
				handleStyle: {
					color: '#bcc3f1',
					borderWidth: 0,
				},
				borderColor: 'transparent',
				borderRadius: getSize(5),
				showDataShadow: false,
				shadowBlur: 0,
				showDetail: false,
				zoomLock: true, // 👈 用户不能拉伸/压缩滑块，只能拖动
			},
			{
				type: 'inside',
				xAxisIndex: [0],
				zoomOnMouseWheel: false, // 👈 禁用滚轮缩放
				moveOnMouseMove: true, // 允许拖动平移（可选）
				moveOnMouseWheel: true,     // 开启滚轮平移 (true 比 'scroll' 兼容性更好)
			},
		],
		series: seriesData,
	};

	return option;
};

const stackedHorizontalBarOption = (chartData: any, unit: any, legendArr: any) => {
	// 传入 yData，自动计算堆叠最大值，且最小值为 5
	const maxValue = getStackMaxValue(chartData.yData, 5);

	const seriesData = chartData.yData?.map((item: any) => ({
		name: item.name,
		type: 'bar',
		stack: 'total',
		barWidth: getSize(20),
		data: item.data.map((i: any) => i.value),
	}));
	const option = {
		color: chartData.colorArr,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			textStyle: {
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.7)',
				fontFamily: 'MicrosoftYaHei',
			},
			formatter(params: any[]) {
				console.log('params', params)
				// 1. 计算总数 (保持不变)
				let total = 0;
				params.forEach((item) => {
					total += item.value;
				});

				// 2. 标题行 (保持不变)
				let res =
					`<div style="margin-bottom: 0.05rem; display:flex;">` +
					`<span style="font-weight:bold; color:#333;">${params[0].name}</span>` +
					`<span style="font-weight:bold; color:#333; margin-left: 0.2rem;">${unit[0] === '' ? '' : total}${unit[0]}</span>` +
					`</div>`;

				// 3. 循环输出列表
				params.forEach((item, index) => {
					// --- 核心逻辑优化开始 ---

					// 1. 判断是否有 rate 字段
					// 只要不是 undefined，就说明有字段（包括 null、0、空字符串都算有字段）
					const hasRateField = item.data?.rate !== undefined;

					// 2. 构建完成率文本
					let rateText = '';
					if (hasRateField) {
						const val = item.data.rate;
						// 只有当值真正“没有”（null 或 空字符串）时，才显示 '-'
						// 如果是 0，则正常显示 0%
						if (val === null || val === '') {
							rateText = '-';
						} else {
							rateText = `${val}%`;
						}
					}

					// 3. 构建右侧内容
					const rightContent = hasRateField
						? `<span style="font-weight:bold; margin-right: 0.1rem;">${item.value}${unit[index + 1]}</span>` +
							`<span style="font-weight:bold;font-size: 0.16rem;">完成率${rateText}</span>`
						: `<span style="font-weight:bold;">${item.value}${unit[index + 1]}</span>`;

					// --- 核心逻辑优化结束 ---

					res +=
						`<div style="display:flex;align-items: center; margin-top: 0.05rem;">` +
						// 左侧：颜色圆点 + 名称
						`<span style="font-weight:bold; margin-right: 0.1rem;">${item.marker}${item.seriesName}</span>` +
						// 右侧：根据逻辑渲染的内容
						`<div style="display:flex; align-items: center;">${rightContent}</div>` +
						`</div>`;
				});

				return res;
			},
		},
		legend: {
			// data: ['主跟目标企业', '配合跟进目标企业', '自主跟进企业'],
			data: legendArr,
			icon: 'rect',
			itemWidth: getSize(10),
			itemHeight: getSize(10),
			textStyle: {
				color: 'rgba(0,0,0,0.5)',
				fontSize: getSize(16),
				fontFamily: 'PingFangSC, PingFang SC',
			},
			left: 0,
			top: 0,
		},
		grid: {
			top: '5%',
			left: '0%',
			right: '8%',
			bottom: '16%',
			containLabel: true,
		},
		xAxis: {
			type: 'value',
			axisLine: { show: false }, // 隐藏轴线
			axisTick: { show: false }, // 隐藏刻度
			splitLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.7',
					width: getSize(1),
				},
			},
			axisLabel: {
				show: true,
				padding: [0, 0, getSize(-6), 0],
				textStyle: {
					color: 'rgba(0,0,0,0.6)',
					fontSize: getSize(18),
					fontFamily: 'PingFangSC, PingFang SC',
				},
			},
			min: 0,
			max: maxValue,
			splitNumber: 5,
			/* // 核心逻辑：总量整数最大值>5时使用undefined，<=5时强制0-5，防止出现小数点
			min: isLargeThan5 ? undefined : 0,
			max: isLargeThan5 ? undefined : 5,
			interval: isLargeThan5 ? undefined : 1, */
		},
		yAxis: {
			type: 'category',
			inverse: true,
			yAxisIndex: 0,
			data: chartData.xData,
			axisLine: { show: false }, // 隐藏轴线
			axisTick: { show: false }, // 隐藏刻度
			axisLabel: {
				show: true,
                padding: [0, 0, 0, getSize(-90)], 
				textStyle: {
					color: 'rgba(0,0,0,0.6)', // X轴文字颜色
					fontSize: getSize(18),
					fontFamily: 'PingFangSC, PingFang SC',
					lineHeight: getSize(24),
					align: 'left', // 可选值: 'left', 'center', 'right'
					verticalAlign: 'middle', // 垂直居中
				},
				interval: 0,
				formatter: (value: any) => {
					if (value.length > 5) {
						// 横坐标最多显示6个字符
						const moreText = value.length > 9 ? '...' : '';
						return `${value.slice(0, 5)}\n${value.slice(5, 9)}${moreText}`;
					}
					return value;
				},
			},
		},
		dataZoom: [
			{
				type: 'slider',
				show: chartData.xData.length > 6,
				yAxisIndex: [0], // 关键修正 1：必须指定 yAxisIndex: 0，告诉组件控制的是 Y 轴（类目轴）
				right: '0%',
				width: getSize(8),
				brushSelect: false,
				backgroundColor: '#eef2fd',
				fillerColor: '#bcc3f1',
				handleIcon:
					'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z', // 画一个圆形
				handleSize: '100%',
				handleStyle: {
					color: '#bcc3f1',
					borderWidth: 0,
				},
				borderColor: 'transparent',
				borderRadius: getSize(5),
				showDataShadow: false,
				shadowBlur: 0,
				startValue: 0,
				endValue: 5,
				showDetail: false,
				zoomLock: true, // 👈 用户不能拉伸/压缩滑块，只能拖动
			},
			{
				type: 'inside',
				yAxisIndex: [0], // 同样需要关联 Y 轴
				zoomOnMouseWheel: false, // 👈 禁用滚轮缩放
				moveOnMouseMove: true, // 允许拖动平移（可选）
				moveOnMouseWheel: true,     // 开启滚轮平移 (true 比 'scroll' 兼容性更好)
			},
		],
		series: seriesData,
	};
	return option;
};
export {
	pieChartOption,
	pieChartOption2,
	pieChartOption3,
	barOption,
	stackBarOption,
	stackedHorizontalBarOption,
};
