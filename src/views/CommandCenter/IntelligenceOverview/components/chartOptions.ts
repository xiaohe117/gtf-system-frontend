import { formatNumber, getSize } from '@/utils';
import { ECOption } from '@/utils/echarts';

// 提取重复的SVG图标路径
const customIcon =
	'path://M2 0 h10 a2 2 0 0 1 2 2 v0 a2 2 0 0 1 -2 2 H2 a2 2 0 0 1 -2 -2 V2 a2 2 0 0 1 2 -2 z';

function dealNumber(val: any) {
	return (val ?? '--') === '--' ? '--' : formatNumber(val);
}
const barLineOption = (chartData: any) => {
	const {
		dataXName,
		dataYbar,
		dataYline,
		dataYline2,
		legendArr,
		unitArr,
		colorArr = ['#2F6BEF', '#A5C9FF', '#0769FF', '#A5C9FF', '#00D5A1'],
		yAxisName = ['总量/亿元', '增速'],
		categoryArr = [],
		lastCategoryArr = [],
		noSign = false,
	} = chartData;

	// 处理统计值、摸查值
	const signObj: any = {
		'1': '统计值',
		'2': '摸查值',
	};
	// 处理图例
	function generateLegendConfig() {
		const hasData = (array: any) => Array.isArray(array) && array.length > 0;
		const configList: any = [];
		if (hasData(dataYbar)) configList.push({ name: legendArr[0], icon: 'roundRect' });
		if (hasData(dataYline))
			configList.push({
				name: legendArr[1],
				icon: customIcon,
			});
		if (hasData(dataYline2))
			configList.push({
				name: legendArr[2],
				icon: customIcon,
			});
		return configList;
	}
	// 处理bar、line数据
	const allCategoryArr = [categoryArr, lastCategoryArr]; // 当年、上年数据种类
	function seriesData() {
		const series: any[] = [];
		[dataYbar, dataYline, dataYline2].forEach((item: any, index: number) => {
			if (index < 1) {
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
							borderWidth: allCategoryArr[index]?.[idx]?.value === 2 ? getSize(2) : 0,
							borderType: allCategoryArr[index]?.[idx]?.value === 2 ? 'dashed' : '', // 摸查值为虚线
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
						type: 'solid', // 设置为虚线
						color: colorArr[index],
					},
					data: item?.map((el: any) => el || 0),
				});
			}
		});
		return series;
	}

	const option: ECOption = {
		tooltip: {
			trigger: 'axis',
			extraCssText: 'box-shadow: none; padding: 0;',
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
					const iconClass = el.seriesType === 'line' ? 'icon line' : 'icon';
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
			top: '3%',
			right: '0%',
			itemWidth: getSize(12),
			itemHeight: getSize(12),
			borderRadius: getSize(2),
			orient: 'horizontal',
			textStyle: {
				padding: [0, 0, 0, 0],
				fontWeight: 400,
				fontSize: getSize(14),
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
					fontWeight: 400,
					fontSize: getSize(14),
					color: '#8897B7',
				},
			},
			{
				name: yAxisName[1],
				nameTextStyle: {
					fontWeight: 400,
					fontSize: getSize(14),
					color: '#8897B7',
					padding: [0, getSize(-10), 0, 0],
				},
				type: 'value',
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
					fontWeight: 400,
					fontSize: getSize(14),
					color: '#8897B7',
					formatter: '{value}',
				},
			},
		],
		series: seriesData(),
	};

	// 处理总量的y轴最小interval为1
	// if (Math.max(...(dataYbar?.concat(dataYbar2 || []) || [])) < 5) {
	// 	const yAxis = option.yAxis as ECOption['yAxis'];
	// 	if (Array.isArray(yAxis) && yAxis.length > 0) {
	// 		yAxis[0].min = 0;
	// 		yAxis[0].max = 5;
	// 		yAxis[0].axisLabel = {
	// 			...yAxis[0].axisLabel,
	// 			interval: 1,
	// 		};
	// 	}
	// }
	return option;
};

const chartCloudOption = (chartData: any) => {
	const colorList = [
    "rgb(47, 107, 239)",
    "rgb(2, 63, 193)",
    "rgb(27, 109, 230)",
    "rgb(25, 70, 136)",
    "rgb(0, 80, 255)",
    "rgb(39, 156, 235)",
    "rgb(119, 167, 222)",
    "rgb(58, 93, 184)"
]
const getRandomColor = () => {
	const index = Math.floor(Math.random() * colorList.length);
	return colorList[index];
};

const option = {
	tooltip: {
		show: true,
},
series: [
	{
		type: 'wordCloud',
    shape: 'triangle',
    // left: "center",
		// top: "center",
		width: "100%",
		height: "95%",
		sizeRange: [getSize(20), getSize(48)],
		// sizeRange: [12, 24],
		rotationRange: [0, 0],
		// rotationStep: 40,
		gridSize: getSize(12),
		drawOutOfBound: false,  // 是否渲染超出画布的文字
		textStyle: {
			fontWeight: 'bold',
			color: getRandomColor
		},
		emphasis: {
			focus: 'self',
			textStyle: {
				textShadowBlur: 8,
				textShadowColor: 'rgba(0, 0, 0, 0.5)',
			},
	},
		data: chartData
}
]
}
return option;
};

export { barLineOption,chartCloudOption };
