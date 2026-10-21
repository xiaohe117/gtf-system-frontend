import { formatNumber, getSize } from '@/utils';

const lineChartOption = (chartData: any) => {
	const { xAxisList, seriesData } = chartData;
	const series = seriesData.map((item: any) => {
		const { name, data, color } = item;
		return {
			name,
			type: 'line',
			symbol: 'circle',
			symbolSize: getSize(8),
			itemStyle: {
				color: '#fff', // 圆心颜色（白色）
				borderColor: color, // 边框颜色（与折线同色）
				borderWidth: getSize(2), // 边框宽度
			},
			lineStyle: {
				color, // 线的颜色
				width: getSize(2), // 线的宽度
			},
			data, // 数据
		};
	});
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'line', // 直线型指示器
				lineStyle: {
					color: '#000000',
					width: getSize(1), // 更宽的指示线
					type: 'solid', // 实线
				},
			},
			confine: true, // 限制在图表区域内
			extraCssText: 'z-index:2',
			padding: [getSize(8), getSize(10)],
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			borderColor: '#ccc',
			formatter: (params: any) => {
				const { name } = params[0];
				// 隐藏"起点"和占位数据的 tooltip
				if (name === '起点' || name === '\u200B') return '';
				let htmlContent = ` <div  style="font-weight: 500;font-size: 0.18rem;line-height:0.16rem;color: rgba(0,0,0,0.65);">${name}</div>`;
				if (Array.isArray(params)) {
					params.forEach((item) => {
						const { seriesName, value, borderColor } = item;
						htmlContent += `
                        <p  class=" fx-al-c fx-r" style="line-height:0.22rem;margin-top:0.08rem;font-size:0.18rem;color: rgba(0,0,0,0.65);font-weight: 300;white-space: normal">
                            <span style="display: inline-block;background:${borderColor};width:0.14rem;height:0.06rem;border-radius:0.02rem;margin-right:0.08rem;"></span>
                            <span class="label" style="margin-right:0.08rem" >${seriesName}</span>
                            <span class="value" >${formatNumber(value)}亿元</span>
                        </p>
                        `;
					});
				}

				return htmlContent;
			},
		},
		grid: {
			top: '20%',
			left: '3%',
			right: getSize(25),
			bottom: '1%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: xAxisList,
			boundaryGap: false,
			axisLabel: {
				show: true,
				formatter: (value: string) => (value === '\u200B' ? '' : value),
				fontWeight: 400,
				fontSize: getSize(16),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
				rotate: 10,
				interval: 0,
				align: 'center',
				verticalAlign: 'top',
				padding:[0,getSize(70),0,0]
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.1)',
					width: getSize(1),
				},
				onZero: true
			},
			axisTick: {
				show: false, // 是否显示
			},
			
		},
		dataZoom: [
			{
				type: 'slider',
				orient: 'horizontal',
				show:  xAxisList.length > 4,
				top: '95%',
				height: getSize(5),
				startValue: xAxisList.length - 3,
				endValue: xAxisList.length,
				showDetail: false,
				fillerColor: 'rgba(255, 255, 255, 0.5)',
				zoomLock: true, // 👈 用户不能拉伸/压缩滑块，只能拖动
			},
			{
				type: 'inside',
				xAxisIndex: [0],
				zoomOnMouseWheel: false, // 👈 禁用滚轮缩放
				moveOnMouseMove: true, // 允许拖动平移（可选）
				// 注意：不要设置 brushSelect 或其他缩放相关属性
			},
		],
		title: {
			show: true,
			text: '单位：亿元',
			fontFamily: 'PingFangSC',
			textStyle: {
				fontWeight: 400,
				fontSize: getSize(16),
				color: 'rgba(0,0,0,0.6)',
			},
			top: '8%',
			left: '5%',
		},
		yAxis: {
			type: 'value',
			min: 0,
			max: (() => {
				// 根据实际数据动态计算 max，确保刻度均匀
				const allData = seriesData.flatMap((s: any) => s.data).filter((v: any) => v != null) as number[];
				const dataMax = allData.length ? Math.ceil(Math.max(...allData) / 500) * 500 : 100;
				return dataMax || 100;
			})(),
			interval: (() => {
				const allData = seriesData.flatMap((s: any) => s.data).filter((v: any) => v != null) as number[];
				const dataMax = allData.length ? Math.ceil(Math.max(...allData) / 500) * 500 : 100;
				return (dataMax || 100) / 5;
			})(),
			axisLabel: {
				show: true,
				fontWeight: 400,
				fontSize: getSize(16),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.3)',
					width: getSize(1),
				},
			},
		},
		series,
	};
	return option;
};

export default lineChartOption;
