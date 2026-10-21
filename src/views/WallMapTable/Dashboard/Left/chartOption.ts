import { getSize} from '@/utils';


const barOption = (chartData: any) => ({
	grid: {
		top: getSize(40),
		bottom: getSize(10),
		left: getSize(10),
		right: getSize(10),
		containLabel: true
	},
	tooltip: {
		trigger: "axis",
		backgroundColor: '#fff',
		borderColor: 'transparent',
		borderWidth: 0,
		padding: [getSize(12), getSize(16)],
		textStyle: {
			fontSize: getSize(14),
			color: 'rgba(0,0,0,.85)',
			fontFamily: 'PingFangSC, PingFang SC',
		},
		extraCssText: 'box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); border-radius: 4px;',
		formatter: (params: any) => {
			if (!params || params.length === 0) return '';

			// 标题（X轴名称）
			const title = params[0].axisValue.replace('\n', '');

			// 构建每个系列的数据行
			let content = `<div style="font-weight: 500; margin-bottom: ${getSize(8)}px; color: rgba(0,0,0,0.6);font-size: 0.18rem">${title}</div>`;

			params.forEach((item: any) => {
				const { color } = item;
				const marker = `<span style="display: inline-block; width: ${getSize(10)}px; height: ${getSize(10)}px; background-color: ${color}; border-radius: 50%; margin-right: ${getSize(8)}px;"></span>`;
				content += `<div style="display: flex; justify-content: space-between; align-items: center; margin-top: ${getSize(4)}px;font-size: 0.18rem;line-height: 0.2rem">
					<span style="display: flex; align-items: center; color: rgba(0,0,0,0.6);">
						${marker}${item.seriesName}
					</span>
					<span style="margin-left: ${getSize(30)}px;margin-right: 0.3rem; font-weight: 400; color: rgba(0,0,0,0.6);">${item.value}</span>
				</div>`;
			});

			return content;
		}
	},
	legend: {
		show: false,
		data: ['相关央企', '总数'],
		icon: 'rect',
		itemGap: getSize(28),
		itemWidth: getSize(10),
		itemHeight: getSize(10),
		textStyle: {
			color: "rgba(0,0,0,0.5)",
			fontSize: getSize(14),
			fontFamily: "PingFangSC, PingFang SC",
		}
	},
	xAxis: {
		data: chartData.map((d: any) => {
			if (d.name.length > 5) {
				return `${d.name.slice(0, 5)}\n${d.name.slice(5)}`
			}
			return d.name
		}),
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
				color: "rgba(0,0,0,0.7)", // X轴文字颜色
				fontSize: getSize(20),
				fontFamily: "PingFangSC, PingFang SC",
			}
		},
	},
	yAxis: [{
		type: "value",
		name: '单位(家)',
		nameTextStyle: {
			fontSize: getSize(18),
			color: "rgba(0,0,0,0.4)",
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
				color: "rgba(0,0,0,0.4)",
				fontSize: getSize(18),
				fontFamily: "PingFangSC, PingFang SC",
			}
		},
	},
	],
	series: [
		{
			name: "相关央企",
			type: "bar",
			color: "#003FCF",
			barWidth: getSize(24),
			itemStyle:{
				borderRadius: [getSize(4), getSize(4), getSize(0), getSize(0)]
			},
			data: chartData.map((d: any) => d.targets || 0),
		},
		{
			name: "总数",
			type: "bar",
			color: "#3489FF",
			barWidth: getSize(24),
			barGap: getSize(0.5),
			itemStyle:{
				borderRadius: [getSize(4), getSize(4), getSize(0), getSize(0)]
			},
			data: chartData.map((d: any) => d.num || 0),
		},
	]
})

export default  barOption;
