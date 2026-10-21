<!--
 * @Descripttion: 投发委办总览 - 右侧
 * @Author: zhaochao
 * @Date: 2025-06-21 16:55:53
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-07 15:06:50
-->
<template>
	<div class="tfw-right-content">
		<TitleBody name="单位任务目标">
			<DynamicTable
				:tableData="unitInvestmentData"
				:columns="unitInvestmentColumns"
				:max-height="'1.3rem'"
				:hasOrder="true"
			></DynamicTable>
		</TitleBody>

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
						<span class="txt">
							{{
								unitInvestmentTab === 0
									? '产业体系项目数'
									: '单位年度新增招商项目'
							}}
						</span>
					</div>
					<div class="flex-x-center">
						<span class="number-font">{{
							unitInvestmentTab === 0 ? industryDataTotal : stageDataTotal
						}}</span>
						<span class="unit">个</span>
					</div>
				</div>
				<div class="flex-y-start-start ind-chart">
					<ChartContainer :chartOption="barOption" class="bar-chart" />
				</div>
			</div>
		</TitleBody>
		<TitleBody name="单位跟进问题台账">
			<div class="tasks flex-x-between">
				<div
					@click="activeTaskType = item.type"
					:class="['task', 'flex-x-center', { active: activeTaskType === item.type }]"
					v-for="item in taskList"
					:key="item.desc"
				>
					<img :src="item.icon" alt="" />
					<div class="flex-y-start-start">
						<div class="flex-x-between" style="gap: 0.04rem">
							<span class="number-font">{{ item.value }}</span>
							<span class="unit">项</span>
						</div>
						<div class="desc">{{ item.desc }}</div>
					</div>
				</div>
			</div>
			<DynamicTable
				:tableData="filterTasksData"
				:columns="tasksColumns"
				:max-height="'1.6rem'"
				:hasOrder="true"
			></DynamicTable>
		</TitleBody>
	</div>
</template>

<script setup lang="ts">
import RoundRectTabs from '@/components/RoundRectTabs.vue';
import DynamicTable, { TableColumn } from '@/components/table/DynamicTable.vue';
import { formatNumber, getSize } from '@/utils';

import gjwt from '@/assets/images/gtf/gjwt.png';
import djj from '@/assets/images/gtf/djj.png';
import yjj from '@/assets/images/gtf/yjj.png';
import { getExcelData } from './data';
// import lamp from "@/assets/images/gtf/lamp.jpg"

const unitInvestmentTab = ref(0);
const tasksData = ref<any>([]);
const hasFinishTask = computed(() =>
	tasksData.value.filter((item: any) => item['问题状态'] === '已解决')
);
const hasUnfinishTask = computed(() =>
	tasksData.value.filter((item: any) => item['问题状态'] === '待解决')
);
const taskList = computed(() => [
	{
		icon: gjwt,
		value: tasksData.value.length,
		desc: '跟进问题',
		type: '0',
	},
	{
		icon: djj,
		value: hasUnfinishTask.value.length,
		desc: '待解决',
		type: '1',
	},
	{
		icon: yjj,
		value: hasFinishTask.value.length,
		desc: '已解决',
		type: '2',
	},
]);
const activeTaskType = ref<any>(taskList.value[0].type);

const filterTasksData = computed(() => {
	if (activeTaskType.value === '0') {
		return tasksData.value;
	}
	if (activeTaskType.value === '1') {
		return hasUnfinishTask.value;
	}
	return hasFinishTask.value;
});

const unitInvestmentColumns: TableColumn[] = [
	{
		prop: 'taskName',
		label: '任务名称',
		align: 'left',
	},
	{
		prop: 'target',
		label: '目标',
		width: getSize(80),
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
	// 	width: getSize(68),
	// 	align: 'center',
	// 	type: 'custom',
	// },
	// {
	// 	prop: 'count',
	// 	label: '具体数量',
	// 	width: getSize(100),
	// 	align: 'center',
	// 	type: 'custom',
	// },
];
const unitInvestmentData = ref<any>([
	{
		taskName: '跟进项目统计',
		target: '120',
		finishStatus: '370.00%',
		lampStatus: 'green',
		count: 444,
	},
	{
		taskName: '新引进项目数',
		target: '120',
		finishStatus: '111.67%',
		lampStatus: 'green',
		count: 134,
	},
]);
const tasksColumns: TableColumn[] = [
	{
		prop: '问题类型',
		label: '问题类型',
		align: 'left',
		width: getSize(120),
	},
	{
		prop: '问题描述',
		label: '问题描述',
		align: 'left',
	},
	// {
	// 	prop: 'lampStatus',
	// 	label: '亮灯',
	// 	width: getSize(68),
	// 	align: 'center',
	// 	type: 'custom',
	// },
];

// 所属产业
const industryData = ref<any>([
  { name: '生物医药与健康', value: 90 },
  { name: '人工智能', value: 44 },
  { name: '现代商贸', value: 35 },
  { name: '低空经济与航空航天', value: 29 },
  { name: '软件与互联网', value: 28 },
  { name: '新能源与新型储能', value: 28 },
  { name: '半导体与集成电路', value: 25 },
  { name: '智能网联与新能源汽车', value: 23 },
  { name: '现代金融', value: 21 },
  { name: '智能装备与机器人', value: 19 },
  { name: '专业服务', value: 17 },
  { name: '科技服务', value: 14 },
  { name: '其它产业', value: 8 },
  { name: '物流与供应链', value: 8 },
  { name: '生物制造', value: 7 },
  { name: '文化创意', value: 7 },
  { name: '具身智能', value: 7 },
  { name: '绿色石化与新材料', value: 6 },
  { name: '细胞与基因', value: 6 },
  { name: '智能建造与工业化建筑', value: 4 },
  { name: '船舶与海洋工程', value: 4 },
  { name: '超高清视频与新型显示', value: 3 },
  { name: '旅游休闲', value: 3 },
  { name: '时尚消费品', value: 3 },
  { name: '轨道交通', value: 2 },
  { name: '前沿新材料', value: 1 },
  { name: '智能无人系统', value: 1 },
  { name: '深海深空', value: 1 }
]);
const industryDataTotal: any = computed(() =>
	industryData.value.reduce((pre: number, current: any) => pre + current.value, 0)
);
// 所属阶段
const stageData = ref<any>([
  { name: '在谈', value: 250 },
  { name: '注册', value: 122 },
  { name: '落地', value: 40 },
  { name: '签约', value: 21 },
  { name: '投产（开票）', value: 9 },
  { name: '开工', value: 2 }
]);
const stageDataTotal: any = computed(() =>
	stageData.value.reduce((pre: number, current: any) => pre + current.value, 0)
);

const barChartOption = (chartData: any) => {
	// const total = chartData.length;
	// const visibleCount = 6;
	// const showScrollbar = total > visibleCount;
	// const endPercent = showScrollbar ? (visibleCount / total) * 100 : 100;

	const option = {
		title: {
			show: true,
			text: '单位/个',
			fontFamily: 'PingFangSC',
			textStyle: {
				fontWeight: 400,
				fontSize: getSize(14),
				color: 'rgba(0,0,0,0.6)',
			},
			top: 0,
			left: '0%',
		},
		grid: {
			top: getSize(20),
			left: getSize(20),
			bottom: '0%',
			// bottom: getSize(25), // 增加底部间距，容纳滚动条
			right: getSize(20),
			containLabel: true,
		},
		tooltip: {
			extraCssText: 'z-index:2',
			trigger: 'axis',
			padding: [getSize(8), getSize(10)],
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			borderColor: '#ccc',
			formatter: (params: any) => {
				const { name, value, marker } = params[0];
				const htmlContent = ` <div  style="font-weight: 500;font-size: 0.16rem;line-height:0.16rem;color: rgba(0,0,0,0.65);">${marker}${name}<div style="margin-top: 0.08rem" >${formatNumber(value)}个</div></div>`;
				return htmlContent;
			},
		},
		xAxis: {
			type: 'category',
			axisLabel: {
				formatter: (value: string) => value.replace(/(.{4})/g, '$1\n'),
				fontWeight: 400,
				fontSize: getSize(14),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
				align: 'center', // 标签居中显示（取消右对齐）
				interval: 0, // 显示所有标签
				// margin: getSize(8), // 调整标签与轴线距离，避免重叠
			},
			axisLine: {
				lineStyle: {
					color: '#333',
				},
			},
			data: chartData.map((item: any) => item.name),
		},
		yAxis: {
			type: 'value',
			offset: getSize(10),
			splitLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.5)', // 分隔线颜色
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
				fontFamily: 'PingFangSC',
			},
		},
		series: [
			{
				name: '产业数值',
				type: 'bar',
				// barWidth: getSize(14),
				barWidth: getSize(20), // 调大柱状图宽度（原14→20，可按需调整）
				color: '#FFB637',
				data: chartData.map((item: any) => item.value),
			},
		],
		// 核心新增：dataZoom 滚动配置（仅滚动、禁缩放）

		dataZoom: unitInvestmentTab.value === 0 ? [
			{
				type: 'slider',
				orient: 'horizontal',
				show: true,
				top: '95%',
				height: getSize(5),
				startValue: 0,
				endValue: 5,
				showDetail: false,
				fillerColor: 'rgba(255, 255, 255, 0.5)',
				zoomLock: true, // 👈 用户不能拉伸/压缩滑块，只能拖动
			},
			{
				type: 'inside',
				xAxisIndex: [0],
				zoomOnMouseWheel: false, // 👈 是否禁用滚轮缩放
				moveOnMouseMove: true, // 允许拖动平移（可选）
				// 注意：不要设置 brushSelect 或其他缩放相关属性
			},
		]:[], // 数据 ≤3 项时不显示滚动条
	};
	return option;
};

const barOption = ref<any>({});
watch(
	() => unitInvestmentTab.value,
	(newV) => {
		barOption.value =
			newV === 0 ? barChartOption(industryData.value) : barChartOption(stageData.value);
	}
);

onMounted(() => {
	barOption.value = barChartOption(industryData.value);
	getExcelData('./excel/toufawProblemLedger.xlsx', 0).then((res: any) => {
		const arr = res.sort((a: any, b: any) => a.index - b.index);
		tasksData.value = arr.map((item: any) => ({ ...item, lampStatus: 'yellow' }));
	});
});
</script>

<style lang="less" scoped>
.tfw-right-content {
	font-family:
		PingFangSC,
		PingFang SC;
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
					line-height: 0.22rem;
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
			height: 1.5rem;
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
		margin-bottom: 0.24rem;
		.task {
			&:not(:last-child) {
				margin-right: 0.16rem;
			}
			cursor: pointer;
			width: 1.72rem;
			height: 0.78rem;
			background: rgba(169, 181, 255, 0.1);
			border-radius: 0.08rem;
			border: 0.01rem solid #ffffff;
			&.active {
				border-color: #1b4df4;
			}

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
}
</style>
