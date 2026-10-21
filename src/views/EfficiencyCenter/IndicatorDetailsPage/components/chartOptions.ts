import { formatNumber2, getSize, formatNumber, isEmpty } from '@/utils';
import echarts, { ECOption } from '@/utils/echarts';
import { EmptyConst } from '@/constanst/BaFormConstanst';

// 提取重复的SVG图标路径
const customIcon =
	'path://M2 0 h10 a2 2 0 0 1 2 2 v0 a2 2 0 0 1 -2 2 H2 a2 2 0 0 1 -2 -2 V2 a2 2 0 0 1 2 -2 z';

function dealNumber(val: any) {
	return (val ?? '--') === '--' ? '--' : formatNumber2(val);
}
// 一根柱子、一条折线
const barLineOption2 = (chartData: any) => {
	const {
		title,
		tooltipName,
		dataXName,
		dataYbar,
		dataYline,
		legendArr,
		unitArr,
		colorArr = ['#2F6BEF', '#A5C9FF', '#0769FF', '#00BBC4', '#A5C9FF', '#FFB10D'],
		yAxisName = ['', '增速'],
	} = chartData;
	// 处理图例
	function generateLegendConfig() {
		const hasData = (array: any) => Array.isArray(array) && array.length > 0;

		const configList: any = [];

		if (hasData(dataYbar)) configList.push({ name: legendArr[0], icon: 'roundRect' });
		if (hasData(dataYline))
			configList.push({
				name: legendArr[3],
				icon: customIcon,
			});

		return configList;
	}
	// 处理bar、line数据
	function seriesData() {
		const series: any[] = [];
		[dataYbar, dataYline].forEach((item: any, index: number) => {
			if (index < 1) {
				// 柱状图
				series.push({
					name: legendArr[index],
					color: colorArr[index],
					type: 'bar',
					barWidth: getSize(32),
					data: item?.map((value: any) => ({
						value: value || 0,
						itemStyle: {
							color: colorArr[index],
						},
					})),
				});
			} else {
				// 折线图
				series.push({
					name: legendArr[index],
					color: colorArr[index],
					type: 'line',
					yAxisIndex: 1,
					smooth: true, // 圆滑
					showSymbol: false,
					symbolSize: getSize(14),
					lineStyle: {
						type: 'solid',
						color: colorArr[index],
					},
					dashOffset: getSize(5),
					data: item?.map((el: any) => el),
				});
			}
		});
		return series;
	}

	// 判断总量数据最大值是否小于5
	const isLargeThan5 = dataYbar?.length && Math.max(...dataYbar) > 5;

	// 判断增速数据是否为空
	const hasLineData = dataYline && dataYline.some((val: any) => val != null);

	const option: ECOption = {
		tooltip: {
			confine: true,
			trigger: 'axis',
			extraCssText: 'box-shadow: none; padding: 0; z-index:2; background-color: #fff;',
			formatter(params: any) {
				if (!params?.length) return '';
				const currentMonth = params[0];
				const currentValue = currentMonth?.value;
				// 计算环比增长
				let growthRate = '';

				const lineItem = params.find((item: any) => item.seriesType === 'line') || {};
				// 只有当 value 为 null 或 undefined 时才显示 '--'
				// 如果是 0，它会正常进入 toFixed
				const val = lineItem?.value ?? null;
				growthRate = val !== null ? `${val.toFixed(2)}%` : '--';
				// 确定箭头图标类名
				let arrowClass = '';
				if (growthRate !== '--') {
					const rateValue = parseFloat(growthRate);
					if (rateValue > 0) {
						arrowClass = 'icon-arrow-up';
					} else if (rateValue < 0) {
						arrowClass = 'icon-arrow-down';
					}
				}
				// 构建 HTML
				const htmlContent = `
					<div class="tooltips-part">
						<p class="title fx-r fx-al-c">
							${title}
						</p>
						<p class="items fx-r fx-al-c">
							<span class="icon" style="background:${colorArr[0]}"></span>
							<span class="label">${currentMonth.name}</span>
							<span class="value">${dealNumber(currentValue)}${unitArr[0] || ''}</span>
						</p>
						<p class="items fx-r fx-al-c">
							<span class="icon line" style="background:${colorArr[1] || '#999'}"></span>
							<span class="label">${tooltipName}</span>
							<span class="value ${arrowClass}">${growthRate}</span>
						</p>
					</div>
				`;

				return htmlContent;
			},
		},
		grid: {
			top: '15%',
			left: '3%',
			right: '1%',
			bottom: '0%',
			containLabel: true,
		},
		legend: {
			top: '0%',
			right: getSize(0),
			itemWidth: getSize(16),
			itemHeight: getSize(16),
			borderRadius: getSize(2),
			orient: 'horizontal',
			textStyle: {
				padding: [0, 0, 0, 0],
				fontWeight: 400,
				fontSize: getSize(16),
				color: '#8897B7',
			},
			data: generateLegendConfig(),
		},
		xAxis: {
			type: 'category',
			data: dataXName,
			axisPointer: {
				type: 'shadow',
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.1)',
					width: getSize(1),
				},
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				interval: 0, // 强制显示所有标签
				show: true,
				fontFamily: 'PingFangSC',
				fontWeight: 400,
				fontSize: getSize(16),
				color: '#666666',
			},
		},
		yAxis: [
			{
				type: 'value',
				name: yAxisName[0] ? `完成数/${yAxisName[0]}` : '完成数',
				nameTextStyle: {
					fontFamily: 'PingFangSC',
					fontWeight: 400,
					fontSize: getSize(16),
					color: '#666666',
					padding: [0, 0, 0, getSize(10)],
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: 'rgba(0,0,0,0.8)',
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
					fontFamily: 'PingFangSC',
					fontWeight: 400,
					fontSize: getSize(16),
					color: '#666666',
					padding: [0, 0, -5, 0],
				},
				// 核心逻辑：总量整数最大值>5时使用undefined，<=5时强制0-5，防止出现小数点
				min: isLargeThan5 ? undefined : 0,
				max: isLargeThan5 ? undefined : 5,
				interval: isLargeThan5 ? undefined : 1,
			},
			{
				type: 'value',
				name: yAxisName[1],
				nameTextStyle: {
					fontFamily: 'PingFangSC',
					fontWeight: 400,
					fontSize: getSize(16),
					color: '#666666',
					padding: [0, getSize(10), 0, 0],
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					show: true,
					fontFamily: 'PingFangSC',
					fontWeight: 400,
					fontSize: getSize(16),
					color: '#666666',
					padding: [0, 0, -5, 0],
					formatter: (value: number) => `${value}%`,
				},
				// 核心逻辑：如果没有数据，强制给一个默认范围，防止坐标轴消失或计算错误
				min: hasLineData ? undefined : 0,
				max: hasLineData ? undefined : 100,
				interval: hasLineData ? undefined : 20,
			},
		],
		series: seriesData(),
	};

	return option;
};
const barLineOption = (chartData: any) => {
	const {
		dataXName,
		dataYbar,
		dataYbar2,
		dataYline,
		dataYline2,
		dataYline3,
		legendArr,
		unitArr,
		colorArr = ['#2F6BEF', '#A5C9FF', '#0769FF', '#A5C9FF', '#FFB10D'],
		yAxisName = ['总量/亿元', '增速'],
		categoryArr = [],
		lastCategoryArr = [],
		noSign = false,
		arrowRate = false,
	} = chartData;

	// 处理统计值、摸查值
	const signObj: any = {
		'1': '统计值',
		'2': '摸查值',
		'3': '预测值',
	};
	// 处理图例
	function generateLegendConfig() {
		const hasData = (array: any) => Array.isArray(array) && array.length > 0;

		const configList: any = [];

		if (hasData(dataYbar)) configList.push({ name: legendArr[0], icon: 'roundRect' });
		if (hasData(dataYbar2)) configList.push({ name: legendArr[1], icon: 'roundRect' });
		if (hasData(dataYline))
			configList.push({
				name: legendArr[3],
				icon: customIcon,
			});
		if (hasData(dataYline2))
			configList.push({
				name: legendArr[4],
				icon: customIcon,
			});
		if (hasData(dataYline3))
			configList.push({
				name: legendArr[5],
				icon: customIcon,
			});

		return configList;
	}
	// 处理bar、line数据
	const allCategoryArr = [categoryArr, lastCategoryArr]; // 当年、上年数据种类
	function seriesData() {
		const series: any[] = [];
		[dataYbar, dataYbar2, dataYline, dataYline2, dataYline3].forEach(
			(item: any, index: number) => {
				if (index < 2) {
					// 柱状图
					series.push({
						name: legendArr[index],
						color: colorArr[index],
						type: 'bar',
						barWidth: getSize(12),
						data: item?.map((value: any, idx: number) => ({
							value: value || 0,
							itemStyle: {
								color:
									allCategoryArr[index]?.[idx]?.value === 2
										? `${colorArr[index]}99`
										: colorArr[index],
								borderColor: colorArr[index],
								borderWidth:
									allCategoryArr[index]?.[idx]?.value === 2 ? getSize(2) : 0,
								borderType:
									allCategoryArr[index]?.[idx]?.value === 2 ? 'dashed' : '', // 摸查值为虚线
							},
						})),
					});
				} else {
					// 折线图
					series.push({
						name: legendArr[index],
						color: colorArr[index],
						type: 'line',
						yAxisIndex: 1,
						smooth: true, // 圆滑
						showSymbol: false,
						symbolSize: getSize(14),
						lineStyle: {
							type: index === 4 ? [getSize(10), getSize(5)] : 'solid', // 设置为虚线
							color: colorArr[index],
						},
						dashOffset: getSize(5),
						data: item?.map((el: any) => el),
					});
				}
			}
		);
		return series;
	}

	const option: ECOption = {
		tooltip: {
			confine: true, // 强制不超出容器
			trigger: 'axis',
			extraCssText: 'box-shadow: none; padding: 0;z-index:2;',
			formatter(params: any) {
				const xname = params[0].name;
				const sign = categoryArr?.find((item: any) => item.name === xname)?.value;
				let tagContent = '';
				if (!noSign) {
					tagContent = sign ? signObj[sign] : '统计值';
				}
				let htmlContent = `
          <div class="tooltips-part" >
            <p class="title fx-r fx-al-c" >
              ${xname}${tagContent ? `<span class="tag">${tagContent}</span>` : ''}
            </p>
        `;
				params.forEach((el: any) => {
					let arrowIcon = '';
					if (arrowRate && el.seriesType === 'line' && el.value) {
						arrowIcon = el.value > 0 ? 'icon-arrow-up' : 'icon-arrow-down';
					}
					const iconClass = el.seriesType === 'line' ? 'icon line' : 'icon';
					htmlContent += `
            <p class="items fx-r fx-al-c" >
              <span class="${iconClass}" style="background:${colorArr[el.seriesIndex]}"></span>
              <span class="label" >${el.seriesName}</span>
              <span class="value ${arrowIcon}">${dealNumber(el.value)}${unitArr[el.seriesIndex]}</span>
            </p>
          `;
				});
				htmlContent += '</div>';
				return htmlContent;
			},
		},
		grid: {
			top: '26%',
			left: '3%',
			right: '5%',
			bottom: '0%',
			containLabel: true,
		},
		legend: {
			top: '0%',
			right: getSize(0),
			itemWidth: getSize(16),
			itemHeight: getSize(16),
			borderRadius: getSize(2),
			orient: 'horizontal',
			textStyle: {
				padding: [0, 0, 0, 0],
				fontWeight: 400,
				fontSize: getSize(16),
				color: '#8897B7',
			},
			data: generateLegendConfig(),
		},
		xAxis: {
			type: 'category',
			data: dataXName,
			axisPointer: {
				type: 'shadow',
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.1)',
					width: getSize(1),
				},
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				interval: 0, // 强制显示所有标签
				show: true,
				fontWeight: 600,
				fontSize: getSize(16),
				color: '#8897B9',
			},
		},
		yAxis: [
			{
				type: 'value',
				name: yAxisName[0],
				nameTextStyle: {
					fontWeight: 600,
					fontSize: getSize(16),
					color: '#8897B9',
					padding: [0, 0, 0, getSize(10)],
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: 'rgba(0,0,0,0.1)',
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
					fontWeight: 600,
					fontSize: getSize(16),
					color: '#8897B9',
				},
			},
			{
				type: 'value',
				name: yAxisName[1],
				nameTextStyle: {
					fontWeight: 600,
					fontSize: getSize(16),
					color: '#8897B9',
					padding: [0, getSize(10), 0, 0],
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					show: true,
					fontWeight: 600,
					fontSize: getSize(16),
					color: '#8897B9',
					formatter: (value: number) => `${value}%`,
				},
			},
		],
		series: seriesData(),
	};

	// 处理总量的y轴最小interval为1
	if (Math.max(...(dataYbar?.concat(dataYbar2 || []) || [])) < 5) {
		const yAxis = option.yAxis as ECOption['yAxis'];
		if (Array.isArray(yAxis) && yAxis.length > 0) {
			yAxis[0].min = 0;
			yAxis[0].max = 5;
			yAxis[0].axisLabel = {
				...yAxis[0].axisLabel,
				interval: 1,
			};
		}
	}
	return option;
};

const pieOption = (chartData: any) => {
	const bgColor = '#fff';
	const color = [
		['#94C2FD', '#5B8FF9'],
		['#93EED2', '#5AD8A6'],
		['#FBE031', '#F6BD16'],
		['#FFCF8B', '#FF7D00'],
		['#9da6ff', '#9DA8FF'],
		['#D4A1FF', '#B370F0'],
	];
	const option: ECOption = {
		color,
		legend: {
			orient: 'vertical',
			icon: 'rect',
			right: '4%',
			top: 'center',
			itemGap: getSize(12),
			itemWidth: getSize(12),
			itemHeight: getSize(12),
			borderRadius: getSize(2),
			textStyle: {
				fontSize: getSize(14),
				rich: {
					name: {
						color: 'rgba(0,0,0,0.85)',
						width: getSize(260),
						fontSize: getSize(14),
					},
					rate: {
						color: '#4E5969',
						width: getSize(100),
						align: 'right',
						fontSize: getSize(14),
					},
				},
			},
			formatter: (name: string) => {
				const current = chartData.find((item: any) => item.name === name);
				return `{name|${name.length > 16 ? `${name.slice(0, 16)}...` : name}} {rate|${current.percent?.toFixed(2)}%}`;
			},
			tooltip: {
				show: true,
			},
		},
		series: [
			{
				type: 'pie',
				radius: ['0%', '70%'],
				center: ['40%', '50%'],
				data: chartData,
				itemStyle: {
					borderColor: bgColor,
					borderWidth: getSize(2),
					color: (params: any) => {
						const index = params.dataIndex;
						return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: color[index % 6][0] },
							{ offset: 1, color: color[index % 6][1] },
						]);
					},
				},
				labelLine: {
					length: getSize(24),
					length2: getSize(20),
				},
				label: {
					formatter: (params: any) =>
						`{name|${params.data.name}}\n{name|${dealNumber(params.data.value)}${params.data.unit}}`,
					padding: [0, 0, 0, 0],
					rich: {
						name: {
							fontSize: getSize(16),
							padding: [0, 0, getSize(8), 0],
							color: 'rgba(0,0,0,0.65)',
						},
						// value: {
						// 	fontSize: getSize(16),
						// 	color: '#2F6BEF',
						// },
					},
				},
			},
		],
	};
	return option;
};

const pie2Option = (chartData: any) => {
	const bgColor = '#fff';
	const color = [
		['#94C2FD', '#5B8FF9'],
		['#93EED2', '#5AD8A6'],
		['#FBE031', '#F6BD16'],
		['#FFCF8B', '#FF7D00'],
	];
	const option = {
		color,
		grid: {
			bottom: '0%',
			containLabel: true,
		},
		title: {
			text: `{num|${formatNumber2(chartData.reduce((acc: any, cur: any) => acc + cur.value, 0))}}{text|家}`,
			subtext: `重点企业数`,
			left: 'center',
			top: '25%',
			textStyle: {
				rich: {
					num: {
						color: '#2F6BEF',
						fontSize: getSize(28),
						padding: [0, getSize(4), 0, 0],
					},
					text: {
						color: 'rgba(0,0,0,0.65)',
						fontSize: getSize(16),
						verticalAlign: 'center',
					},
				},
			},
			subtextStyle: {
				color: 'rgba(0,0,0,0.65)',
				fontSize: getSize(16),
			},
		},
		legend: {
			orient: 'vertical',
			icon: 'rect',
			top: '74%',
			bottom: 0,
			itemGap: getSize(12),
			itemWidth: getSize(12),
			itemHeight: getSize(12),
			borderRadius: getSize(2),
			textStyle: {
				color: '#4E5969',
				rich: {
					name: {
						color: 'rgba(0,0,0,0.85)',
						width: getSize(120),
						fontSize: getSize(14),
					},
				},
			},
			formatter: (name: string) => {
				if (name === '双高型企业') {
					return `{name|${name}} {name|增速>平均增速，产值>平均产值}`;
				}
				if (name === '高增型企业') {
					return `{name|${name}} {name|增速>平均增速，产值<平均产值}`;
				}
				if (name === '稳规模型企业') {
					return `{name|${name}} {name|增速<平均增速，产值>平均产值}`;
				}
				if (name === '双低型企业') {
					return `{name|${name}} {name|增速<平均增速，产值<平均产值}`;
				}
				return '';
			},
			tooltip: {
				show: true,
			},
		},
		series: [
			{
				type: 'pie',
				radius: ['30%', '53%'],
				center: ['50%', '33%'],
				data: chartData,
				itemStyle: {
					borderColor: bgColor,
					borderWidth: getSize(2),
					color: (params: any) => {
						const index = params.dataIndex;
						return new echarts.graphic.LinearGradient(1, 1, 0, 0, [
							{ offset: 0, color: color[index % 4][0] },
							{ offset: 1, color: color[index % 4][1] },
						]);
					},
				},
				labelLine: {
					length: getSize(20),
					length2: getSize(20),
				},
				label: {
					formatter: (params: any) =>
						`{name|${params.name}}\n{name|${dealNumber(params.value)}家}`,
					padding: [0, 0, 0, 0],
					rich: {
						name: {
							fontSize: getSize(16),
							padding: [0, 0, getSize(8), 0],
							color: 'rgba(0,0,0,0.65)',
						},
						// value: {
						// 	fontSize: getSize(16),
						// 	color: '#2F6BEF',
						// },
					},
				},
			},
		],
	};
	return option;
};

// 渐变色的单个折线图
const singleLineOption = (chartData: any) => {
	const {
		dataXName,
		dataYline,
		legendArr,
		unitArr,
		colorArr = ['#2F6BEF'],
		yAxisName,
	} = chartData;
	const option: ECOption = {
		tooltip: {
			trigger: 'axis',
			extraCssText: 'box-shadow: none; padding: 0;',
			formatter(params: any) {
				const xname = params[0].name;
				let htmlContent = `
          <div class="tooltips-part" >
            <p class="title fx-r fx-al-c" >
              ${xname}
            </p>
        `;
				params.forEach((el: any) => {
					const iconClass = 'icon line';
					htmlContent += `
            <p class="items fx-r fx-al-c" >
              <span class="${iconClass}" style="background:${colorArr[el.seriesIndex]}"></span>
              <span class="label" >${el.seriesName}</span>
              <span class="value" >${dealNumber(el.value)}${unitArr[el.seriesIndex]}</span>
            </p>
          `;
				});
				htmlContent += '</div>';
				return htmlContent;
			},
		},
		grid: {
			top: '28%',
			left: '1%',
			right: '1%',
			bottom: '0%',
			containLabel: true,
		},
		legend: {
			top: '5%',
			left: '0%',
			itemWidth: getSize(12),
			itemHeight: getSize(12),
			borderRadius: getSize(2), // 圆角大小
			orient: 'horizontal',
			textStyle: {
				padding: [0, 0, 0, 0],
				fontWeight: 400,
				fontSize: getSize(14),
				color: '#8897B7',
			},
		},
		xAxis: {
			type: 'category',
			data: dataXName,
			axisPointer: {
				type: 'shadow',
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.1)', // 分隔线颜色
					width: getSize(1), // 分隔线宽度
				},
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				show: true,
				fontWeight: 400,
				fontSize: getSize(14),
				color: '#8897B7',
			},
		},
		yAxis: [
			{
				name: yAxisName[0],
				nameTextStyle: {
					fontWeight: 400,
					fontSize: getSize(14),
					color: '#8897B7',
					padding: [0, 0, 0, getSize(-10)],
				},
				type: 'value',
				splitLine: {
					show: true,
					lineStyle: {
						color: 'rgba(0,0,0,0.1)', // 分隔线颜色
						width: getSize(1), // 分隔线宽度
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
					fontWeight: 400,
					fontSize: getSize(14),
					color: '#8897B7',
				},
			},
		],
		series: [
			{
				name: legendArr[0],
				color: colorArr[0],
				type: 'line',
				smooth: true, // 圆滑
				showSymbol: true,
				symbolSize: getSize(14),
				lineStyle: {
					color: colorArr[0],
				},
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 1,
								color: `${colorArr[0]}00`,
							},
							{
								offset: 0,

								color: `${colorArr[0]}4D`,
							},
						],
						global: false,
					},
				},
				data: dataYline,
			},
		],
	};
	return option;
};

// 上下布局的饼图
const pieUpDownOption = (chartData: any) => {
	const bgColor = '#fff';
	const color = [
		['#94C2FD', '#5B8FF9'],
		['#93EED2', '#5AD8A6'],
		['#FBE031', '#F6BD16'],
		['#FFCF8B', '#FF7D00'],
		['#9da6ff', '#9DA8FF'],
		['#D4A1FF', '#B370F0'],
	];
	const option: ECOption = {
		color,
		legend: {
			orient: 'vertical',
			icon: 'rect',
			bottom: '5%',
			left: 'left',
			itemGap: getSize(12),
			itemWidth: getSize(12),
			itemHeight: getSize(12),
			borderRadius: getSize(2),
			// 关键配置：强制分两列
			height: getSize(80), // 3个项目的高度 (itemHeight*3 + itemGap*2)
			align: 'left',
			// 列间距配置
			pageButtonItemGap: getSize(50), // 这是两列之间的间距
			textStyle: {
				fontSize: getSize(14),
				rich: {
					name: {
						color: 'rgba(0,0,0,0.85)',
						width: getSize(220),
						fontSize: getSize(14),
					},
					rate: {
						color: '#4E5969',
						width: getSize(80),
						align: 'right',
						fontSize: getSize(14),
					},
				},
			},
			formatter: (name: string) => {
				const current = chartData.find((item: any) => item.name === name);
				return `{name|${name.length > 16 ? `${name.slice(0, 16)}...` : name}} {rate|${current.percent?.toFixed(2)}%}`;
			},
			tooltip: {
				show: true,
			},
		},
		series: [
			{
				type: 'pie',
				radius: ['0%', '50%'],
				center: ['50%', '45%'],
				data: chartData,
				itemStyle: {
					borderColor: bgColor,
					borderWidth: getSize(2),
					color: (params: any) => {
						const index = params.dataIndex;
						return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: color[index % 6][0] },
							{ offset: 1, color: color[index % 6][1] },
						]);
					},
				},
				labelLine: {
					length: getSize(24),
					length2: getSize(20),
				},
				label: {
					formatter: (params: any) =>
						`{name|${params.data.name}}\n{name|${dealNumber(params.data.value)}${params.data.unit}}`,
					padding: [0, 0, 0, 0],
					rich: {
						name: {
							fontSize: getSize(16),
							padding: [0, 0, getSize(8), 0],
							color: 'rgba(0,0,0,0.65)',
						},
						// value: {
						// 	fontSize: getSize(16),
						// 	color: '#2F6BEF',
						// },
					},
				},
			},
		],
	};
	return option;
};
// 品类分析图表
const pieCategoryOption = (chartData: any) => {
	const total = chartData.reduce((sum: any, item: any) => sum + Number(item.value), 0);
	const totalUnit = chartData.find((item: any) => item.unit)?.unit || '亿元';

	const bgColor = '#fff';

	const color = [
		['#94C2FD', '#5B8FF9'],
		['#93EED2', '#5AD8A6'],
		['#FBE031', '#F6BD16'],
		['#FFCF8B', '#FF7D00'],
		['#9da6ff', '#9DA8FF'],
		['#D4A1FF', '#B370F0'],
	];
	const option = {
		color,
		grid: {
			bottom: '0%',
			right: '0%',
			containLabel: true,
		},
		title: {
			text: `{num|${formatNumber(total)}}{text|${totalUnit}}`,
			subtext: `总产值`,
			left: 'center',
			top: '36%',
			textStyle: {
				rich: {
					num: {
						color: '#2F6BEF',
						fontSize: getSize(28),
						padding: [0, getSize(4), 0, 0],
					},
					text: {
						color: 'rgba(0,0,0,0.65)',
						fontSize: getSize(16),
						verticalAlign: 'center',
					},
				},
			},
			subtextStyle: {
				color: 'rgba(0,0,0,0.65)',
				fontSize: getSize(16),
			},
		},
		legend: {
			orient: 'vertical',
			icon: 'rect',
			top: '68%',
			bottom: 0,
			itemGap: getSize(12),
			itemWidth: getSize(12),
			itemHeight: getSize(12),
			borderRadius: getSize(2),
			textStyle: {
				rich: {
					text: {
						width: getSize(220),
						fontSize: getSize(16),
						color: '#4E5969',
						overflow: 'break',
					},
					value: {
						color: '#4E5969',
						fontSize: getSize(16),
					},
				},
			},
			formatter: (name: string) => {
				// const current = chartData.find((item: any) => item.name === name) || {}
				// const result =  name.length > 12 ? `${name.slice(0, 12)}...` : name;
				// return `{name|${result.trim()}} {name|占比 ${current.percent || '-'}}`
				const item = chartData.find((el: any) => el.name === name) || {};
				const percent = isEmpty(item.percent)
					? EmptyConst
					: `${formatNumber2(item.percent)}%`;
				return `{text|${name}} {value|${formatNumber2(item.value)}${item.unit} (${percent})}`;
			},
			tooltip: {
				show: true,
			},
		},
		series: [
			{
				type: 'pie',
				radius: ['30%', '53%'],
				center: ['50%', '37%'],
				data: chartData,
				itemStyle: {
					borderColor: bgColor,
					borderWidth: getSize(2),
					color: (params: any) => {
						const index = params.dataIndex;
						return new echarts.graphic.LinearGradient(1, 1, 0, 0, [
							{ offset: 0, color: color[index % 6][0] },
							{ offset: 1, color: color[index % 6][1] },
						]);
					},
				},
				labelLine: {
					length: getSize(20),
					length2: getSize(20),
				},
				label: {
					formatter: (params: any) =>
						`{name|${params.name.length > 6 ? params.name.replace(/(.{6})/g, '$1\n').trim() : params.name}}\n{name|${dealNumber(params.value)}亿元}`,
					padding: [0, 0, 0, 0],
					rich: {
						name: {
							fontSize: getSize(16),
							padding: [0, 0, getSize(8), 0],
							color: 'rgba(0,0,0,0.65)',
						},
						// value: {
						// 	fontSize: getSize(16),
						// 	color: '#2F6BEF',
						// },
					},
				},
			},
		],
	};
	return option;
};

export {
	barLineOption,
	barLineOption2,
	pieOption,
	pie2Option,
	singleLineOption,
	pieCategoryOption,
	pieUpDownOption,
};
