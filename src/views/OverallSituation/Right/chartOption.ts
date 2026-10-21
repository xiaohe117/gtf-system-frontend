import { formatNumber, getSize } from '@/utils';

const getBarOption = (xData: any, data: any, val?: number) => {
	const series = data.map((item: any) => ({
		type: 'bar',
		...item,
		barWidth: val === 1 ? getSize(10) : getSize(6),
		itemStyle: {
			normal: {
				color: item.color,
			},
		},
		label: {
			show: val === 1,
			position: 'top', // 数值显示在柱子上方
			formatter: '{c}', // 显示数值
			textStyle: {
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
				fontWeight: 400,
			},
		}
	}));
	const option = {
		grid: {
			top: '10%',
			left: '1%',
			right: '1%',
			bottom: '0%',
			containLabel: true,
		},
		tooltip: {
			extraCssText: 'z-index:2',
			trigger: 'axis',
			padding: [getSize(8), getSize(10)],
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			borderColor: '#ccc',
			formatter: (params: any) => {
				const { name } = params[0];
				let htmlContent = ` <div  style="font-weight: 500;font-size: 0.18rem;line-height:0.16rem;color: rgba(0,0,0,0.65);">${name}</div>`;
				if (Array.isArray(params)) {
					params.forEach((item) => {
						const { color, seriesName, value ,data :{rate}} = item;
						htmlContent += `
                        <p  class=" fx-al-c fx-r" style="line-height:0.22rem;margin-top:0.08rem;font-size:0.18rem;color: rgba(0,0,0,0.65);font-weight: 300;">
                            <span style="display: inline-block;background:${color};width:0.14rem;height:0.06rem;border-radius:0.02rem;margin-right:0.08rem;"></span>
                            <span class="label" style="margin-right:0.08rem" >${seriesName}:</span>
							${rate?`<span class="value">${(rate)}%</span>`:''}
                            <span class="value" >(${formatNumber(value)}个)</span>
                        </p>
                        `;
					});
				}

				return htmlContent;
			},
		},
		legend: {
			top: '0',
			right: '0%',
			itemWidth: getSize(14),
			itemHeight: getSize(6),
			orient: 'horizontal',
			icon: 'rect',
			show: false,
			textStyle: {
				padding: [0, 0, 0, 0],
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
			},
		},
		xAxis: {
			type: 'category',
			data: xData,
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
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
				rotate: 0,
				interval: 0,
				formatter: (value: any) => value.slice(0,2).split('').join('\n'), // 按照UI稿不展示“区”字
			},
		},
		title: {
			show: true,
			text: '项目数/个',
			fontFamily: 'PingFangSC',
			textStyle: {
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.6)',
			},
			top: '0%',
			left: '0%',
		},
		yAxis: {
			type: 'value',
			axisTick: {
				show: false,
			},
			axisLine: {
				show: false,
			},

			axisLabel: {
				show: true,
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
				showMaxLabel: false, // 是否显示最大值
				formatter: (value: any) => Math.floor(value), // 显示整数
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.3)',
					width: getSize(1),
				},
			},
			splitNumber: 5,
			max: (value:any)=> value.max * 1.5,
		},
		series,
	};
	return option;
};
// const getMaxData = (data1: any, data2: any) => {
// 	// 合并
// 	const tempList = [...data1, ...data2];
// 	// 取绝对值
// 	tempList.forEach((elem, index) => {
// 		if (elem < 0) {
// 			tempList[index] = -elem;
// 		}
// 	});
// 	// 排序找出最大
// 	tempList.sort((a: any, b: any) => b - a);
// 	return tempList[0];
// };
const rightLeftOption = (xData: any[], data1: any[], data2: any[]) => {
	const colors = ['#FFB637FF', '#FE793BFF', '#51E1C4FF', '#1EB092FF', '#408FFFFF', '#37D9FEFF'];
	//  const xData = ['注册','签约', '注册(备案)', '落地', '开工', '投产(开票)'];
	//  const data1 = [120, 120, 150, 90, 70,850];
	//  const data2 = [800, 150, 100, 400, 500,200];
	// let maxData = null;

	// maxData = getMaxData(data1, data2);
	// console.log(maxData);

	const option = {
		legend: {
			show: true,
			data: ['左边数据', '右边数据'],
			bottom: 10,
			center: true,
			textStyle: {
				color: '#fff',
				textAlign: 'center',
			},
			itemGap: 80,
			itemWidth: 0,
		},
		grid: [
			{
				show: false,
				left: '5%',
				top: '0%',
				bottom: '8%',
				containLabel: true,
				width: '35%',
				height: '100%', // 固定高度
			},
			{
				show: false,
				left: '50%',
				top: '0%',
				bottom: '8%',
				width: '30%',
				height: '87%', // 固定高度  重点BUG 左右2侧高度不一致的问题,左右2边有刻度挤压导致,很恶心的BUG
			},
			{
				show: false,
				right: '5%',
				top: '0%',
				bottom: '8%',
				containLabel: true,
				width: '35%',
				height: '100%', // 固定高度
			},
		],
		xAxis: [
			{
				gridIndex: 0,
				type: 'value',
				inverse: true,
				axisLine: {
					show: true, // 显示轴线
					lineStyle: {
						color: 'rgba(0,0,0,0.25)',
						width: getSize(1),	
					},
				},
				axisTick: {
					show: true, // 显示刻度
					interval:100,
					lineStyle: {
						width: getSize(1),	
						color: 'rgba(0,0,0,0.25)',
					},
				},
				splitLine: {
					show: false,
				},
				axisLabel: {
					show: true, // 显示标签
					fontWeight: 400,
					fontSize: getSize(15),
					width: 50,
					hideOverlap:true, // 是否隐藏标签重叠
					verticalAlign:"top", // 刻度标签与轴线对齐 解决浏览器放大 120-180%时刻度标签位置偏移问题
					color: 'rgba(0,0,0,0.65)',
					fontFamily: 'PingFangSC',
					formatter(value: number) {
						if (value >= 1000) {
							return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
						}
						return value.toString();
					},
				},
				max: (value:any)=> value.max * 1.5, // 解决2边内容超出宽度
			},
			{
				gridIndex: 1,
				show: true,
			},
			{
				gridIndex: 2,
				type: 'value',
				inverse: false,
				axisLine: {
					show: true, // 显示轴线
					lineStyle: {
						color: 'rgba(0,0,0,0.1)',
						width: getSize(1),
					},
				},
				axisTick: {
					show: true, // 显示刻度
					lineStyle: {
						color: 'rgba(0,0,0,0.25)',
					},
				},
				splitLine: {
					show: true, // 显示分割线
					lineStyle: {
						color: 'rgba(0,0,0,0.1)',
						type: 'dashed',
					},
				},
				axisLabel: {
					show: true, // 显示标签
					fontWeight: 400,
					hideOverlap: true,
					fontSize: getSize(18),
					color: 'rgba(0,0,0,0.65)',
					fontFamily: 'PingFangSC',
					verticalAlign:"top", // 刻度标签与轴线对齐 解决浏览器放大 120-180%时刻度标签位置偏移问题
					formatter(value: number) {
						if (value >= 1000) {
							return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
						}
						return value.toString();
					},
				},
				max: (value:any)=> value.max * 1.6, // 解决2边内容超出宽度
			},
		],
		yAxis: [
			{
				type: 'category',
				gridIndex: 0,
				axisTick: {
					show: false,
				},
				axisLabel: {
					show: false,
				},
			},
			{
				gridIndex: 1,
				type: 'category',
				show: true,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					show: true,
					margin: -1, // margin 配合 align 调整位置
					align: 'center',
					textStyle: {
						fontFamily: 'PingFangSC',
						fontWeight: 400,
						fontSize: getSize(16),
						color: 'rgba(0,0,0,0.65)',
						align: 'center',
					},
				},
				data: xData,
			},
			{
				type: 'category',
				gridIndex: 2,
				axisTick: {
					show: false,
				},
				axisLabel: {
					show: false,
				},
			},
		],
		series: [
			{
				xAxisIndex: 0,
				yAxisIndex: 0,
				data: data1.map((value, index) => ({
					value,
					itemStyle: {
						color: colors[index], // 为每个柱子设置不同颜色
					},
				})),
				type: 'bar',
				barWidth: getSize(10),
				backgroundStyle: {
					color: 'rgba(180, 180, 180, 0.2)',
				},
				label: {
					show: true,
					position: 'left',
					textStyle: {
						fontFamily: 'PingFangSC',
						fontWeight: 400,
						fontSize: getSize(16),
						color: 'rgba(0,0,0,0.65)',
					},
				},
			},
			{
				xAxisIndex: 2,
				yAxisIndex: 2,
				data: data2.map((value, index) => ({
					value,
					itemStyle: {
						color: colors[index], // 为每个柱子设置不同颜色
					},
				})),
				type: 'bar',
				barWidth: getSize(10),
				label: {
					show: true,
					position: 'right',
					color: '#333',
					fontSize: getSize(16),
					textStyle: {
						fontFamily: 'PingFangSC',
						fontWeight: 400,
						fontSize: getSize(16),
						color: 'rgba(0,0,0,0.65)',
					},
				},
			},
		],
	};
	return option;
};

export { getBarOption, rightLeftOption };
