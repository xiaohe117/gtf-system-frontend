<template>
	<FrameBox size="small">
		<template #first>
			<TitleBody name="单位任务目标">
				<DynamicTable
					:tableData="unitInvestmentData"
					:columns="unitInvestmentColumns"
				></DynamicTable>
			</TitleBody>
		</template>

		<template #second>
			<TitleBody name="单位招商项目">
				<template #extra>
					<RoundRectTabs
						v-model="unitInvestmentTab"
						:tabsList="['所属产业', '所属阶段']"
					></RoundRectTabs
				></template>
				<div class="unit-investment-project flex-y-start">
					<div class="head flex-x-between">
						<div class="flex-x-center">
							<img src="@/assets/images/gtf/four-square.png" alt="" />
							<span class="txt">{{ unitInvestmentTitle }}</span>
						</div>
						<div class="flex-x-center">
							<span class="number-font">{{ unitInvestmentValue }}</span>
							<span class="unit">个</span>
						</div>
					</div>
					<div class="flex-y-start-start ind-chart">
						<ChartContainer
							:loopTooltip="false"
							:chartOption="barOption"
							class="bar-chart"
						/>
					</div>
				</div>
			</TitleBody>
		</template>
		<template #third>
			<TitleBody name="单位跟进问题台账">
				<div class="tasks flex-x-between" style="width: 7rem">
					<!-- <div class="task flex-x-start" v-for="task in taskList" :key="task.desc">
						<img :src="task.icon" alt="" />
						<div class="flex-y-start-around">
							<div class="flex-x-between" style="gap: 0.04rem">
								<span class="number-font">{{ task.value }}</span>
								<span class="unit">项</span>
							</div>
							<div class="desc">{{ task.desc }}</div>
						</div>
					</div> -->
				</div>
				<DynamicTable
					:tableData="tasksData"
					:columns="tasksColumns"
					:max-height="'2rem'"
				></DynamicTable>
			</TitleBody>
		</template>
	</FrameBox>
</template>

<script setup lang="ts">
import RoundRectTabs from '@/components/RoundRectTabs.vue';
import DynamicTable, { TableColumn } from '@/components/table/DynamicTable.vue';

import gjwt from '@/assets/images/gtf/gjwt.png';
import djj from '@/assets/images/gtf/djj.png';
import yjj from '@/assets/images/gtf/yjj.png';
import { getSize } from '@/utils';
// import lamp from "@/assets/images/gtf/lamp.jpg"

const unitInvestmentTab = ref(0);
const unitInvestmentTitle = ref('产业体系在谈项目数');
const unitInvestmentValue = ref(0);
const taskList = ref([
	{
		icon: gjwt,
		value: '3840',
		desc: '跟进问题',
	},
	{
		icon: djj,
		value: '3840',
		desc: '待解决',
	},
	{
		icon: yjj,
		value: '3840',
		desc: '已解决',
	},
]);

const unitInvestmentColumns: TableColumn[] = [
	{
		prop: 'index',
		label: '序号',
		width: getSize(75),
		align: 'center',
	},
	{
		prop: 'industryName',
		label: '产业名称',
		align: 'left',
	},
	{
		prop: 'target',
		label: '目标',
		width: getSize(80),
		align: 'center',
	},
	{
		prop: 'completedCount',
		label: '完成数',
		width: getSize(120),
		align: 'center',
	},
	{
		prop: 'finishStatus',
		label: '完成情况',
		width: getSize(140),
		align: 'center',
	},
	// {
	// 	prop: 'lampStatus',
	// 	label: '亮灯',
	// 	width: getSize(60),
	// 	align: 'center',
	// 	type: 'custom',
	// },
];
const unitInvestmentData = ref<any>([]);
const tasksColumns: TableColumn[] = [
	{
		prop: 'index',
		label: '序号',
		width: getSize(75),
		align: 'center',
	},
	{
		prop: 'problemType',
		label: '问题类型',
		width: getSize(120),
		align: 'center',
	},
	{
		prop: 'problemDesc',
		label: '问题描述',
		align: 'center',
	},
	// {
	// 	prop: 'lampStatus',
	// 	label: '亮灯',
	// 	width: getSize(60),
	// 	align: 'center',
	// 	type: 'custom',
	// },
];
const tasksData = ref<any>([
	{
		index: '1',
		problemType: '招商项目问题',
		problemDesc: '这是一段描述这是一段描述这是一段描述',
		lampStatus: 'red',
	},
	{
		index: '2',
		problemType: '招商项目问题',
		problemDesc: '这是一段描述这是一段描述这是一段描述',
		lampStatus: 'green',
	},
	{
		index: '3',
		problemType: '招商项目问题',
		problemDesc: '这是一段描述这是一段描述这是一段描述',
		lampStatus: 'red',
	},
	{
		index: '4',
		problemType: '招商项目问题',
		problemDesc: '这是一段描述这是一段描述这是一段描述',
		lampStatus: 'green',
	},
	{
		index: '5',
		problemType: '招商项目问题',
		problemDesc: '这是一段描述这是一段描述这是一段描述',
		lampStatus: 'yellow',
	},
]);

const barChartOption = (chartData: any, show: boolean) => {
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
		tooltip: {
			backgroundColor: 'rgba(255,255,255,0.75)',
			textStyle: {
				color: '#333',
				fontSize: getSize(18),
				fontFamily: 'PingFang SC',
			},
		},
		grid: {
			top: getSize(30),
			left: getSize(30),
			right: '0%',
			bottom: '10%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: dataXName,
			axisLabel: {
				formatter: (value: string) => value.replace(/(.{5})/g, '$1\n'),
				interval: 0,
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFang SC',
			},
			axisLine: {
				lineStyle: {
					color: '#333',
				},
			},
		},
		yAxis: {
			type: 'value',
			splitNumber: 2,
			name: '单位/个',
			nameTextStyle: {
				fontWeight: 400,
				align: 'center',
				verticalAlign: 'top',
				fontSize: getSize(18),
				fontFamily: 'PingFang SC',
				color: 'rgba(0,0,0,0.65)',
				padding: [5, 0, 0, 0],
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
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFang SC',
			},
		},
		series: [
			{
				name: '产业数值',
				type: 'bar',
				barWidth: getSize(16),
				data,
			},
		],
		dataZoom: unitInvestmentTab.value === 0 ?[
			{
				orient: 'horizontal',
				show, // 控制滚动条显示隐藏
				realtime: true, // 拖动滚动条时是否动态的更新图表数据
				height: 5, // 滚动条高度
				start: 0, // 滚动条开始位置（共6等份）
				top: '95%',
				bottom: '4%',
				zoomLock: false, // 控制面板是否进行缩放
				startValue: 0, //  从头开始。
				endValue: 4, //  一次性展示5个
				showDetail: false, //  关闭滚动条提示
				fillerColor: 'rgba(255, 255, 255,0.5)',
				moveHandleStyle: {
					// borderWidth:getSize(10),
					color: '#E8A010',
					borderColor: '#E8A010',
				},
			},
			{
				type: 'inside',
				brushSelect: true,
				start: 0,
				endValue: 4,
				xAxisIndex: [0],
				moveOnMouseMove: true, // 是否只平移不缩放
				zoomLock: true, //  鼠标移动触发窗口平移
				// zoomOnMouseWheel: false, // 鼠标移动能触发窗口缩放
			},
		] : [

		],
	};
	return option;
};

const barOption = ref<any>({});

function loadUnitTaskTargetData() {
	unitInvestmentData.value = [
		{
			index: '1',
			industryName: '新引进项目数',
			target: '65',
			completedCount: '70',
			finishStatus: '107.69%',
			lampStatus: '',
		},
		{
			index: '2',
			industryName: '跟进项目统计',
			target: '65',
			completedCount: '89',
			finishStatus: '136.92%',
			lampStatus: '',
		},
	];
}

function loadUnitInvestmentProjectData() {
	// 定义不同成熟度对应的类别名称、颜色和值

	let title = '产业体系在谈项目数',
		chartData = [
			{ name: '智能网联与新能源汽车', value: 0 },
			{ name: '超高清视频与新型显示', value: 0 },
			{ name: '生物医药与健康', value: 0 },
			{ name: '绿色石化与新材料', value: 2 },
			{ name: '软件与互联网', value: 0 },
			{ name: '智能装备与机器人', value: 1 },
			{ name: '人工智能', value: 0 },
			{ name: '半导体与集成电路', value: 0 },
			{ name: '新能源与新型储能', value: 0 },
			{ name: '低空经济与航空航天', value: 5 },
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
	if (unitInvestmentTab.value === 1) {
		chartData = [
			{ name: '在谈', value: 8 },
			{ name: '签约', value: 2 },
			{ name: '注册', value: 24 },
			{ name: '落地', value: 16 },
			{ name: '开工', value: 11 },
			{ name: '投产   (开票)', value: 27 },
			// { name: '纳税', value: 0 },
		];
		title = '单位年度新增招商项目';
	}
	// 按数量从大到小排序
	chartData = chartData.sort((a, b) => b.value - a.value);
	// 计算总数量
	const total = chartData.reduce((prev, current) => prev + current.value, 0);
	unitInvestmentValue.value = total;
	unitInvestmentTitle.value = title;
	barOption.value = barChartOption(
		chartData.map((d) => ({ ...d, color: '#FFB637' })),
		// unitInvestmentTab.value !== 1
		true
	);
}

watch(unitInvestmentTab, loadUnitInvestmentProjectData);

function loadAreaTaskList() {
	// taskList.value
	tasksData.value = [];

	let doing = 0,
		todo = 0,
		finish = 0;

	tasksData.value = [
		// {
		// 	problemType: '行业审批',
		// 	lampStatus: '已解决',
		// 	problemDesc:
		// 		'新公司拟注册名为“中石化环境科技有限公司”，在国家市场监管总局系统核准公司名称时，被告知必须冠以集团名称，或冠以地方行政区域名称，希望协调相关部门核准新公司名称。4月23日，未来产业分局已发函市市场监管局，目前正在协调跟进。',
		// },
		// {
		// 	problemType: '其他',
		// 	lampStatus: '待解决',
		// 	problemDesc: '协调投资事项',
		// },
		// {
		// 	problemType: '土地',
		// 	lampStatus: '已解决',
		// 	problemDesc:
		// 		'项目地块AH070737、AH070738之间有条规划道路可以连通两个地块，目前此道路会影响广州市文化馆目前的进出口，需要协调明确道路的开发建设主体以及协调好是文化馆。',
		// },
		// {
		// 	problemType: '资金',
		// 	lampStatus: '已解决',
		// 	problemDesc:
		// 		'区科技局反馈如广州实验室要采购量子计算机，需自行统筹资金。据了解，广州实验室对量子计算机有使用需求，但因资金问题暂时无法采购。玻色反馈如订单方面没有可行的路径，将会选择落地其他地方，建议市区联动，共同谋划广州量子产业发展思路，搭建平台，推动量子科技与本地产业深度融合，同时建议从科技口支持广州实验室采购量子计算机。',
		// },
		// {
		// 	problemType: '市场场景',
		// 	lampStatus: '待解决',
		// 	problemDesc: '请广州市协调稳定的厨余油（UCO）资源保供。',
		// },
		// {
		// 	problemType: '政策',
		// 	lampStatus: '待解决',
		// 	problemDesc: '',
		// },
		// {
		// 	problemType: '人才',
		// 	lampStatus: '待解决',
		// 	problemDesc: '',
		// },
		// {
		// 	problemType: '市领导拜会',
		// 	lampStatus: '待解决',
		// 	problemDesc: '',
		// },
	].map((d: any, i) => {
		if (d.lampStatus === '已解决') {
			d.lampStatus = 'green';
			finish += 1;
		} else if (d.lampStatus === '待解决') {
			d.lampStatus = 'yellow';
			todo += 1;
		} else {
			d.lampStatus = 'red';
			doing += 1;
		}
		d.index = i + 1;
		return d;
	});

	taskList.value[0].value = String(doing);
	taskList.value[1].value = String(todo);
	taskList.value[2].value = String(finish);
}

onMounted(() => {
	loadUnitTaskTargetData();
	loadUnitInvestmentProjectData();
	loadAreaTaskList();
});
</script>

<style lang="less" scoped>
:deep(.tabs-control) {
	> div {
		line-height: 0.3rem;
	}
}
// 单位招商项目
.unit-investment-project {
	padding: 0 0.08rem;
	> *:not(:last-child) {
		margin-bottom: 0.08rem;
	}
	.head {
		background: rgba(169, 181, 255, 0.1);
		border-radius: 0.08rem;
		border: 0.01rem solid #ffffff;
		padding: 0.13rem 0.16rem;
		width: 100%;
		> div {
			> img {
				width: 0.3rem;
				margin-right: 0.08rem;
			}

			.txt {
				font-weight: 400;
				font-size: @g-font-size-base;
				color: #666666;
				line-height: @g-font-size-large;
				text-align: left;
				font-style: normal;
			}

			.number-font {
				font-weight: 500;
				font-size: 0.28rem;
				color: rgba(0, 0, 0, 0.85);
				line-height: 0.4rem;
				font-style: normal;
			}

			.unit {
				font-weight: 400;
				font-size: 0.16rem;
				color: #666666;
				line-height: 0.22rem;
				margin-left: 0.04rem;
			}
		}
	}

	.ind-chart {
		width: 100%;
		height: 1.6rem;
	}

	.unit-name {
		font-weight: 400;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.2rem;
		text-align: left;
		font-style: normal;
	}
}

// 区任务清单
.tasks {
	padding: 0 0.1rem;
	margin-bottom: 0.12rem;
	.task {
		&:not(:last-child) {
			margin-right: 0.16rem;
		}
		width: 1.72rem;
		height: 0.78rem;
		background: rgba(169, 181, 255, 0.1);
		border-radius: 0.08rem;
		border: 0.01rem solid #ffffff;
		padding-left: 0.16rem;

		img {
			width: 0.3rem;
			margin-right: 0.08rem;
		}

		.number-font {
			font-weight: 500;
			font-size: 0.28rem;
			color: rgba(0, 0, 0, 0.85);
			line-height: 0.4rem;
			text-align: left;
			font-style: normal;
		}

		.unit {
			font-weight: 400;
			font-size: 0.16rem;
			color: #666666;
			line-height: 0.22rem;
			text-align: left;
			font-style: normal;
		}

		.desc {
			font-weight: 400;
			font-size: 0.16rem;
			color: #666666;
			line-height: 0.22rem;
			text-align: left;
			font-style: normal;
		}
	}
}
</style>
