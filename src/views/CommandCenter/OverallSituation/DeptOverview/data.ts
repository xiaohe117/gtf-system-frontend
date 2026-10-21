import { getSize, formatNumber2,isEmpty } from '@/utils';

const EmptyConst = '-'

export function dealNumber(val: any) {
	return (val ?? '--') === '--' ? '--' : formatNumber2(val);
}

export const getNumberStr = (val: any, unit: any = '') => {
	if (isEmpty(val)) return EmptyConst;
	const isNumber = typeof val === 'number' || !Number.isNaN(Number(val));
	if (!isNumber) return val + unit;
	const str = val.toString();
	const dotIndex = str.indexOf('.');
	if (dotIndex !== -1 && str.length - dotIndex - 1 > 2) {
		return Number(val).toFixed(2) + unit;
	}
	return val + unit;
};



const customIcon =
	'path://M2 0 h10 a2 2 0 0 1 2 2 v0 a2 2 0 0 1 -2 2 H2 a2 2 0 0 1 -2 -2 V2 a2 2 0 0 1 2 -2 z';

export const getBarOption = ({xData, series, unit,xLabelLength,xLength} :any) => {
	let dataYbar: any = [];
	let dataYline: any = [];
	const hasLine = series.find((ele: any) => ele.type === 'line');
	series.forEach((s: any) => {
		if (s.type === 'bar') {
			dataYbar = dataYbar.concat(s.data);
		}
		if (s.type === 'line') {
			dataYline = dataYline.concat(s.data);
		}
	});
	// // 判断总量数据最大值是否小于5
	const isLargeThan5 = dataYbar?.length && Math.max(...dataYbar) > 5;
	// 判断增速数据是否为空
	const hasLineData = dataYline && dataYline.some((val: any) => val != null);
	const showSlilder = xData.length  > xLength
	return {
		grid: {
			top: getSize(48),
			left: '1%',
			right: hasLine ? getSize(24) : 0,
			bottom: showSlilder ? getSize(24) : '0%',
			containLabel: true,
		},
		tooltip: {
			trigger: 'axis',
			extraCssText: ' z-index:999;',
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
				console.log(params);
				let html = `<p style="font-size:0.2rem;font-weight:600;margin-bottom:0.08rem;">${params[0].name}</p>`;
				params.forEach((ele) => {
					const height = ele.seriesType === 'line' ? '.1rem' : '.16rem ';
					const aUnit =
						ele.seriesType === 'line'
							? `<span style="font-family:'DIN-Condensed-Bold';font-size:0.22rem">%</span>`
							: ` <span style="font-size:0.16rem">${unit}</span>`;
					const div = `<div style="display:flex;align-items:center;margin-bottom:0.08rem">
                    <div style="width: .16rem;height: ${height};background: ${ele.color};border-radius: .02rem;"></div>
                    <div style="margin-left:0.08rem;font-size:0.16rem">${ele.seriesName}</div>
                    <div style="min-width:0.8rem;text-align:right;margin-left:auto">
                        <span style="font-family: 'DIN-Condensed-Bold';font-size:0.2rem">${dealNumber(ele.data)}</span>
                        ${aUnit}
                    </div>
                    </div>`;
					html += div;
				});
				return html;
			},
		},
		legend: {
			show: false,
			top: 0,
			right: getSize(24),
			itemWidth: getSize(16),
			itemHeight: getSize(16),
			borderRadius: getSize(2),
			orient: 'horizontal',
			textStyle: {
				padding: [0, 0, 0, 0],
				fontWeight: 400,
				fontSize: getSize(18),
				color: '#8897B7',
			},
			data: series.map((item: any) => ({
				name: item.name,
				icon: item.type === 'line' ? customIcon : 'roundRect',
			})),
		},
		xAxis: [
			{
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
					interval: 0, // 强制显示所有标签
					show: true,
					fontFamily: 'PingFangSC',
					fontWeight: 400,
					fontSize: getSize(16),
					color: '#666666',
					formatter: (value: any) => {
						if (value.length > 4 && xLabelLength) {
							// 横坐标最多显示6个字符
							const moreText = value.length > 6 ? '...' : '';
							return `${value.slice(0, xLabelLength)}\n${value.slice(xLabelLength, 6)}${moreText}`;
						}
						return value;
					},
				},
			},
		],
		dataZoom: [
			{

				type: 'slider',
				orient: 'horizontal',
				show: showSlilder,
				top: '95%',
				height: getSize(5),
				startValue: 0,
				endValue: xLength - 1,
				showDetail: false,
				fillerColor: 'rgba(255, 255, 255, 0.5)',
				zoomLock: true, // 👈 用户不能拉伸/压缩滑块，只能拖动
			},
			{
				type: 'inside',
				xAxisIndex: [0],
				show: showSlilder,
				zoomOnMouseWheel: false, // 👈 禁用滚轮缩放
				moveOnMouseMove: true, // 允许拖动平移（可选）
				// 注意：不要设置 brushSelect 或其他缩放相关属性
			},
		],
		yAxis: [
			{
				type: 'value',
				name: '',
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
					fontSize: getSize(18),
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
				name: '',
				show: hasLine,
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
					fontSize: getSize(18),
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
		title: [
			{
				show: true,
				text: unit,
				textStyle: {
					fontFamily: 'PingFangSC',
					fontWeight: 400,
					fontSize: getSize(20),
					color: 'rgba(0,0,0,0.65)',
				},
				top:0,
				left: getSize(8),
			},
			{
				show: hasLine,
				text: '增速(%)',
				textStyle: {
					fontFamily: 'PingFangSC',
					fontWeight: 400,
					fontSize: getSize(20),
					color: 'rgba(0,0,0,0.65)',
				},
				top: getSize(0),
				right: getSize(24),
			},
		],
		series,
	};
};
export const getLightStatus = (status: any) => {
	const obj: any = {
		'01': { name: '红灯', img: 'light-icon-red', class: 'red' },
		'02': { name: '黄灯', img: 'light-icon-yellow', class: 'yellow' },
		'03': { name: '绿灯', img: 'light-icon-green', class: 'green' },
		'04': { name: '灰灯', img: 'light-icon-gray', class: 'gray' },
	};
	return obj[status] || { name: '--', img: 'light-icon-gray', class: 'gray' };
};

export const typeList = [
	{ label: '招商一类', value: 'GQ0010001' },
	{ label: '招商二类', value: 'GQ0010002' },
	{ label: '招商三类', value: 'GQ0010003' },
];
