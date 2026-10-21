import { getSize, getUrl } from '@/utils';

const barChartOption = (chartData: any) => {
	const dataXName = chartData.map((item: any) => item.name);
	const data = chartData.map((item: any) => ({
		value: item.value,
		name: item.name,
		itemStyle: {
			color: item.color,
			borderRadius: [2, 2, 0, 0],
		},
	}));
	const option = {
		grid: {
			top: '20%',
			left: '1%',
			right: '1%',
			bottom: '0%',
			containLabel: true,
		},
		legend: {
			show: false,
			data: ['成熟度数值'],
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
				color: 'rgba(0,0,0,0.65)',
			},
		},
		yAxis: {
			type: 'value',
			name: '企业数量/个',
			nameTextStyle: {
				fontWeight: 400,
				fontSize: getSize(14),
				color: 'rgba(0,0,0,0.65)',
				padding: [0, 0, 0, getSize(30)],
			},
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
				color: 'rgba(0,0,0,0.65)',
			},
		},
		series: [
			{
				name: '成熟度数值',
				type: 'bar',
				barWidth: getSize(24),
				data,
			},
		],
	};
	return option;
};

const pieChartOption = (chartData: any) => {
	let index = 0;
	const option = {
		color: ['#6e9dfa', '#e97c64', '#73deb3', '#6dc8ec', '#f7c739', '#a285d2'],
		// 提示框

		// 图例 (底部水平排列)
		legend: {
			orient: 'horizontal',
			icon: 'rect',
			bottom: 0,
			itemGap: 5,
			width: getSize(320),
			data: chartData.map((d: any) => d.name),
			itemStyle: {
				borderCap: 'square',
			},
			textStyle: {
				color: 'rgba(0,0,0,.65)',
				fontSize: getSize(12),
				width: getSize(70),
			},
			formatter(name: string) {
				if (!chartData[index]) index = 0;
				const str = `${name}  ${chartData[index].value}`;
				index += 1;
				return str;
			},
		},
		// 图形元素 - 在饼图中心添加SVG
		graphic: {
			type: 'image',
			left: 'center',
			top: '25%',
			style: {
				image: getUrl('runByEnterprise/detail/pie-inner.svg'), // 替换为你的 SVG
				width: getSize(100),
				height: getSize(100),
			},
		},
		// 核心饼图配置
		series: [
			{
				name: '风险事项分布',
				type: 'pie',
				radius: ['35%', '60%'], // 环形图 [内半径, 外半径]
				center: ['50%', '40%'], // 居中显示
				avoidLabelOverlap: true, // 防止标签重叠

				// 数据与配色 (按描述顺序)
				data: chartData,

				// 饼图标签配置
				label: {
					show: true,
					formatter: '{d}%', // 分行显示名称和数量
					fontSize: getSize(12),
					color: 'rgba(0,0,0,.65)',
					position: 'outer',
					bleedMargin: 0,
				},
			},
		],
	};
	return option;
};

export { barChartOption, pieChartOption };
