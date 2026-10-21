import { getSize } from '@/utils';

const barChartOption = () => {
	/* 	const chartData = [
		{ name: '人工智能', value: 0 },
		{ name: '智能网联与新能源汽车', value: 1 },
		{ name: '智能制造与工业化建筑', value: 3 },
		{ name: '生物医药与健康', value: 39 },
		{ name: '旅游休闲', value: 1 },
		{ name: '智能无人系统', value: 2 },
		{ name: '具身智能', value: 0 },
		{ name: '文化创意', value: 5 },
		{ name: '新能源与新型储能', value: 8 },
		{ name: '低空经济与航空航天', value: 1 },
		{ name: '专业服务', value: 45 },
		{ name: '物流与供应链', value: 2 },
		{ name: '船舶与海洋工程', value: 0 },
		{ name: '深海空深', value: 0 },
		{ name: '绿色石化与新材料', value: 2 },
		{ name: '前沿新材料', value: 9 },
		{ name: '超高清视频与新型显示', value: 1 },
		{ name: '半导体与集成电路', value: 10 },
		{ name: '未来网络与量子科技', value: 0 },
		{ name: '科技服务', value: 36 },
		{ name: '轨道交通', value: 0 },
		{ name: '生物制造', value: 0 },
		{ name: '细胞与基因', value: 0 },
		{ name: '现代金融', value: 7 },
		{ name: '智能装备与机器人', value: 8 },
		{ name: '时尚消费品', value: 5 },
		{ name: '会展', value: 0 },
		{ name: '软件与互联网', value: 2 },
		{ name: '现代商贸', value: 5 }
	].filter((item: any) => item.value !== 0) */

	const chartData = [
		{ name: '智能网联与新能源汽车', value: 1 },
		{ name: '生物医药与健康', value: 1 },
		{ name: '超高清视频与新型显示', value: 0 },
		{ name: '绿色石化与新材料', value: 0 },
		{ name: '软件与互联网', value: 0 },
		{ name: '智能装备与机器人', value: 0 },
		{ name: '人工智能', value: 0 },
		{ name: '半导体与集成电路', value: 0 },
		{ name: '新能源与新型储能', value: 0 },
		{ name: '低空经济与航空航天', value: 0 },
		{ name: '生物制造', value: 0 },
		{ name: '时尚消费品', value: 0 },
		{ name: '轨道交通', value: 0 },
		{ name: '船舶与海洋工程', value: 0 },
		{ name: '智能建造与工业化建筑', value: 0 },
		{ name: '智能无人系统', value: 0 },
		{ name: '未来网络与量子科技', value: 0 },
		{ name: '具身智能', value: 0 },
		{ name: '前沿新材料', value: 0 },
		{ name: '细胞与基因', value: 0 },
		{ name: '深海深空', value: 0 },
		{ name: '现代金融', value: 0 },
		{ name: '科技服务', value: 0 },
		{ name: '专业服务', value: 0 },
		{ name: '现代商贸', value: 0 },
		{ name: '会展', value: 0 },
		{ name: '旅游休闲', value: 0 },
		{ name: '文化创意', value: 0 },
		{ name: '物流与供应链', value: 0 },
		{ name: '其它产业', value: 0 },
	];
	const option = {
		title: {
			show: true,
			text: '单位/个',
			fontFamily: 'PingFangSC',
			textStyle: {
				fontWeight: 400,
				fontSize: getSize(16),
				color: 'rgba(0,0,0,0.6)',
			},
			top: getSize(10),
			left: '0%',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
				shadowStyle: {
					color: 'rgba(53, 108, 244, 0.1)',
				},
			},
		},
		grid: {
			top: '20%',
			left: '0%',
			right: '0%',
			bottom: '10%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: chartData.map((item: any) => item.name),
			axisLabel: {
				formatter: (value: string) => value.replace(/(.{4})/g, '$1\n'),
				interval: 0,
				fontSize: getSize(14),
				fontFamily: 'PingFangSC, PingFang SC',
				fontWeight: 400,
				color: 'rgba(0,0,0,0.65)',
			},
		},
		yAxis: {
			type: 'value',
			min: 0,
			splitNumber: 4,
			axisLabel: {
				fontSize: getSize(18),
				fontFamily: 'PingFangSC, PingFang SC',
				fontWeight: 400,
				color: 'rgba(0,0,0,0.65)',
				align: 'right',
				verticalAlign: 'middle',
			},
			splitLine: {
				lineStyle: {
					color: '#999',
				},
			},
		},
		dataZoom: [
			{
				type: 'slider',
				orient: 'horizontal',
				show: true,
				top: '95%',
				height: getSize(5),
				startValue: 0,
				endValue: 8,
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
		/* 	dataZoom: [
			{
				orient: 'horizontal',
				show: true, // 控制滚动条显示隐藏
				// realtime: true, // 拖动滚动条时是否动态的更新图表数据
				height: getSize(5), // 滚动条高度
				// start: 0, // 滚动条开始位置（共6等份）
				top: '95%',
				bottom: '4%',
				zoomLock: false, // 控制面板是否进行缩放
				startValue: 0, //  从头开始。
				endValue: 8, //  一次性展示6个
				showDetail: false, //  关闭滚动条提示
				fillerColor: 'rgba(255, 255, 255,0.5)',
			},
			{
				type: 'inside',
				// brushSelect: true,
				// start: 0,
				endValue: 4,
				xAxisIndex: [0],
				// moveOnMouseMove: true, // 是否只平移不缩放
				// zoomLock: true, //  鼠标移动触发窗口平移
				// zoomOnMouseWheel: false, // 鼠标移动能触发窗口缩放
			},
		], */
		series: [
			{
				type: 'bar',
				data: chartData.map((item: any) => item.value),
				itemStyle: {
					color: '#FFB366',
				},
				barWidth: getSize(8),
			},
		],
	};
	return option;
};

export default barChartOption;
