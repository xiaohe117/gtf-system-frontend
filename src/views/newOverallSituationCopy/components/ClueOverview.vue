<template>
	<FrameBox
		v-loading="loading"
		class="module-frame clue-overview-frame"
		element-loading-background="rgba(255, 255, 255, 0.72)"
	>
		<section class="module clue-overview">
			<header class="module-header">
				<div class="header-left">
					<div class="header-title-item">
						<span class="module-title">线索总览</span>
						<div class="title-bg"></div>
					</div>
					<span class="target-text">意向投资总额任务：</span>
					<strong>{{ resOverview.target.value }}</strong>
					<span>亿元</span>
				</div>
				<button @click="clickParent('clubOverview')" class="enter-btn">
					<img src="@/views/newOverallSituationCopy/image/more.png" alt="" />
				</button>
			</header>

			<div class="clue-metrics">
				<div class="clue-metric">
					<div class="metric-label">线索数量</div>
					<div class="metric-value">
						<span>{{ resOverview.summary.clueCount }}</span>
						<small>个</small>
					</div>
				</div>
				<div class="clue-metric">
					<div class="metric-label">意向投资总额</div>
					<div class="metric-value">
						<span>{{ formatAmount(resOverview.summary.investAmount) }}</span>
						<small>亿元</small>
					</div>
				</div>
				<div class="clue-metric">
					<div class="metric-label">任务完成率</div>
					<div class="metric-value">
						<span>{{ resOverview.summary.completionRate }}</span>
						<small>%</small>
					</div>
				</div>
			</div>

			<div class="clue-main">
				<div class="donut-wrap">
					<div class="donut-legend">
						<span>
							<i style="background-color: #158dff"></i>
							市内来源
						</span>
						<span>
							<i style="background-color: #b9e8ff"></i>
							市外来源
						</span>
						<span>
							<i style="background-color: #bacce9"></i>
							未明确
						</span>
					</div>
					<div ref="chartRef" class="donut-chart"></div>
				</div>
				<div class="source-labels">
					<span>市内</span>
					<span>市外</span>
				</div>
				<div class="source-grid">
					<div
						v-for="item in sourceItems"
						:key="`${item.city}-${item.tier}`"
						:class="['source-item', item.cssClass]"
					>
						<div class="source-title">{{ item.tier }} +</div>
						<div>
							<strong>{{ formatNum(item.count) }}</strong>
							<span class="source-count-unit">个 共</span>
							<strong>{{ formatAmount(item.amount) }}</strong>
							<span>亿元</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import status from '@/stores/status';
import { queryClueTable } from '@/api/commandCenter/deptOverview';
import { clueSourceStats } from '@/api/OverallSituation';
import useClickParent from '../composables/useClickParent';

const { clickParent } = useClickParent();

// 全局年月筛选值
const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
// 获取当前年月对应的查询时间范围
const { getCurrentDate } = statusStore;
const loading = ref(false);

// 饼图和图例颜色
const pieLegendColors = ['#158dff', '#b9e8ff', '#bacce9'];

// 饼图 DOM 容器
const chartRef = ref<HTMLDivElement | null>(null);
// 当前 ECharts 实例
let chartInstance: echarts.ECharts | null = null;

// 线索来源统计数据
const sourceStats = ref({
	innerCity: {
		tenBillionCount: 0,
		tenBillionAmount: 0,
		hundredBillionCount: 0,
		hundredBillionAmount: 0,
	},
	outerCity: {
		tenBillionCount: 0,
		tenBillionAmount: 0,
		hundredBillionCount: 0,
		hundredBillionAmount: 0,
	},
	pieData: [] as { name: string; count: number; percentage: number }[],
});

const formatNum = (val: number) => val || '--';
const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};

// 来源数据项（用于模板 v-for）
const sourceItems = computed(() => [
	{
		city: 'inner',
		tier: '十亿元',
		cssClass: 'is-light',
		count: sourceStats.value.innerCity.tenBillionCount,
		amount: sourceStats.value.innerCity.tenBillionAmount,
	},
	{
		city: 'inner',
		tier: '百亿元',
		cssClass: 'is-light',
		count: sourceStats.value.innerCity.hundredBillionCount,
		amount: sourceStats.value.innerCity.hundredBillionAmount,
	},
	{
		city: 'outer',
		tier: '十亿元',
		cssClass: 'is-group',
		count: sourceStats.value.outerCity.tenBillionCount,
		amount: sourceStats.value.outerCity.tenBillionAmount,
	},
	{
		city: 'outer',
		tier: '百亿元',
		cssClass: 'is-group',
		count: sourceStats.value.outerCity.hundredBillionCount,
		amount: sourceStats.value.outerCity.hundredBillionAmount,
	},
]);

// 构建线索来源饼图配置
function buildPieOption(): echarts.EChartsOption {
	return {
		tooltip: {
			trigger: 'item',
			position: 'right',
			extraCssText: `
				width: 2rem;
				height: 0.8rem;
				box-sizing: border-box;
				padding: 0.08rem 0.12rem;
			`,
			formatter: (params) => {
				// tooltip 只展示当前扇区名称和百分比
				const item = Array.isArray(params) ? params[0] : params;
				const value = `${item.value ?? ''}%`;

				return `<div style="height:100%;display:flex;align-items:center;justify-content:space-between;">
					<span style="display:inline-flex;align-items:center;min-width:0;">${item.marker ?? ''}${item.name ?? ''}</span>
					<span style="flex:0 0 auto;margin-left:20px;font-weight:700;">${value}</span>
				</div>`;
			},
		},
		color: pieLegendColors,
		legend: {
			show: false,
		},
		series: [
			{
				type: 'pie',
				radius: ['34%', '48%'],
				center: ['50%', '55%'],
				avoidLabelOverlap: true,
				label: {
					show: true,
					position: 'outside',
					formatter: '{c}%',
					color: '#333333',
					fontSize: 10,
					fontWeight: 400,
					overflow: 'none',
					bleedMargin: 0,
				},
				labelLine: {
					show: true,
					length: 4,
					length2: 4,
					lineStyle: {
						color: '#999999',
						width: 1,
					},
				},
				data: sourceStats.value.pieData.map((item) => ({
					name: item.name,
					value: item.percentage,
				})),
			},
		],
	};
}

// 初始化线索来源饼图
function initChart() {
	if (!chartRef.value) return;
	chartInstance = echarts.init(chartRef.value);
	chartInstance.setOption(buildPieOption());
}

// 页面尺寸变化时同步重绘图表
function handleResize() {
	chartInstance?.resize();
}

// 初始展示和接口失败时的兜底数据
const getDefaultOverview = () => ({
	target: {
		value: '',
	},
	summary: {
		clueCount: '',
		investAmount: '',
		completionRate: '',
	},
});

// 线索总览接口回填数据
const resOverview = ref(getDefaultOverview());

// 查询线索总览统计数据
const getClueOverview = async () => {
	const currentDate = getCurrentDate();
	if (!currentDate) return;
	const { startTimeStr, endTimeStr } = currentDate;
	const res = await queryClueTable({ startTimeStr, endTimeStr, tabType: 'CITY_OVERVIEW' });
	if (res.code !== 0) {
		resOverview.value = getDefaultOverview();
		return;
	}
	const row = (res.data as { rows?: any[] })?.rows?.[0] || {};
	resOverview.value.target.value = row.targetNum || '--';
	resOverview.value.summary.clueCount = row.clueCount || '--';
	resOverview.value.summary.investAmount = row.investAmount || '--';
	resOverview.value.summary.completionRate = row.completionRate || '--';
};

// 刷新饼图数据
const updatePieChart = () => {
	chartInstance?.setOption(buildPieOption());
};

// 查询线索来源统计数据
const getClueSourceStats = async () => {
	const res = await clueSourceStats<typeof sourceStats.value>({ date: yearSelectValue.value });
	if (res.code !== 0) return;
	sourceStats.value = res.data;
	updatePieChart();
};

const refreshData = async () => {
	loading.value = true;
	try {
		await Promise.all([getClueOverview(), getClueSourceStats()]);
	} finally {
		loading.value = false;
	}
};

// 组件挂载后初始化图表
onMounted(() => {
	initChart();
	window.addEventListener('resize', handleResize);
});

// 组件销毁时释放图表实例
onBeforeUnmount(() => {
	window.removeEventListener('resize', handleResize);
	chartInstance?.dispose();
	chartInstance = null;
});

// 年月切换后刷新接口数据
watch(
	() => yearSelectValue.value,
	(newVal) => {
		if (newVal) {
			refreshData();
		}
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import './moduleCommon.less';

.clue-overview-frame {
	min-height: 0;
	overflow: hidden;

	:deep(.outside-content) {
		min-height: 0;
		overflow: hidden;
		box-shadow: none;
	}

	:deep(.outside-content > div) {
		min-height: 0;
		overflow: hidden;
	}
}

.clue-overview {
	min-height: 0;
	overflow: hidden;
}

.clue-overview .module-header {
	grid-template-columns: minmax(1.79rem, auto) minmax(0, 1fr);
	column-gap: clamp(0.08rem, 0.9vw, 0.16rem);
}

.clue-metrics {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1.45fr 1fr;
	align-items: start;
	flex: 0 0 clamp(0.5rem, 6vh, 0.64rem);
	padding: clamp(0.07rem, 1.1vh, 0.12rem) clamp(0.16rem, 1.7vw, 0.32rem) 0;
	background: url('../image/section-line.png') center bottom / 100% 0.11rem no-repeat;
	overflow: hidden;
}

.clue-metric {
	position: relative;
	z-index: 1;
	min-width: 0;
}

.clue-metric .metric-label {
	margin-bottom: 0.06rem;
	font-size: 0.15rem;
	line-height: clamp(0.15rem, 1.7vh, 0.18rem);
	font-family:
		PingFangSC,
		PingFang SC;
	color: #202a36;
	font-weight: 700;
}

.clue-metric .metric-value {
	display: flex;
	align-items: baseline;
	margin-top: 0;

	span {
		font-family: DINAlternate, DINAlternate;
		font-weight: bold;
		font-size: 0.24rem;
		color: #165dff;
		line-height: clamp(0.23rem, 2.6vh, 0.28rem);
		text-shadow: none;
	}

	small {
		margin-left: 0.04rem;
		font-family: PingFangHK, PingFangHK;
		font-weight: 400;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);
	}
}

.clue-main {
	--source-row-height: clamp(0.5rem, 5.6vh, 0.6rem);
	--source-row-gap: clamp(0.1rem, 1.8vh, 0.2rem);
	--source-top-offset: clamp(0.16rem, 2vh, 0.3rem);

	display: grid;
	grid-template-columns: minmax(0, 34%) clamp(0.3rem, 2vw, 0.42rem) minmax(0, 1fr);
	flex: 1 1 0;
	height: 0;
	min-height: 0;
	overflow: hidden;
	gap: 0;
	align-items: center;
}

.donut-wrap {
	position: relative;
	height: min(100%, 1.22rem);
	max-height: 1.22rem;
	min-width: 0;
	overflow: visible;
}

.donut-legend {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 2;
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	gap: clamp(0.04rem, 0.45vw, 0.02rem);
	width: max-content;
	white-space: nowrap;
	pointer-events: none;

	span {
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
		color: #4f5966;
		font-size: clamp(0.1rem, 1.25vh, 0.12rem);
		font-weight: 700;
		line-height: 0.14rem;
	}

	i {
		flex: 0 0 auto;
		width: clamp(0.08rem, 0.7vw, 0.1rem);
		height: clamp(0.08rem, 0.7vw, 0.1rem);
		margin-right: 0.04rem;
		border-radius: 0.02rem;
	}
}

.donut-chart {
	width: 100%;
	height: 100%;
	min-height: 0;
}

.source-labels {
	display: grid;
	grid-template-rows: repeat(2, var(--source-row-height));
	align-content: center;
	justify-items: baseline;
	// row-gap: var(--source-row-gap);
	row-gap: clamp(0.04rem, 0.8vh, 0.1rem);
	height: calc(100% - var(--source-top-offset));
	min-width: 0;
	min-height: 0;
	margin-top: var(--source-top-offset);
	padding-right: 0.04rem;
	color: #fff;
	font-family:
		PingFangSC,
		PingFang SC,
		Microsoft YaHei,
		sans-serif;
	font-size: clamp(0.16rem, 1.9vh, 0.2rem);
	font-weight: 700;
	line-height: 1.05;
	text-align: center;
	white-space: nowrap;
	pointer-events: none;
}

.source-labels span {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50%;
	height: 80%;
	border-radius: 0.06rem 0 0 0.06rem;
	background: #1598ff;
	writing-mode: vertical-rl;
	text-orientation: upright;
	letter-spacing: 0;
	font-size: 0.14rem;
}

.source-labels span:nth-child(2) {
	background: #9fc4fb;
}

.donut-label {
	position: absolute;
	left: 0.9rem;
	z-index: 1;
	width: 0.52rem;
	font-size: 0.12rem;
	font-weight: 700;
	line-height: 1.08;
	color: #586777;
	white-space: pre-line;

	&::before {
		position: absolute;
		left: -0.42rem;
		width: 0.4rem;
		height: 0.01rem;
		content: '';
		background: #8cc2ff;
	}

	small {
		display: block;
		font-size: 0.1rem;
		color: #586777;
	}
}

.donut-label.inside {
	top: 0.2rem;

	&::before {
		top: 0.13rem;
		transform: rotate(-8deg);
		transform-origin: right center;
	}
}

.donut-label.outside {
	bottom: 0.16rem;

	&::before {
		top: 0.11rem;
		transform: rotate(18deg);
		transform-origin: right center;
	}
}

.source-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-content: center;
	gap: var(--source-row-gap) 0.02rem;
	height: 100%;
	min-height: 0;
	margin-top: var(--source-top-offset);
	overflow-y: hidden;
	overflow-x: hidden;
}

.source-item {
	position: relative;
	min-width: 0;
	height: var(--source-row-height);
	padding: 0.02rem 0.02rem 0;
	background-position: center bottom;
	background-size: 100% 100%;
	background-repeat: no-repeat;

	&.is-light {
		background-image: url('../image/beam-light.png');
	}

	&.is-group {
		background-image: url('../image/beam-group.png');
	}

	&::before {
		position: absolute;
		left: 12%;
		top: 0%;
		width: 0.1rem;
		height: 0.1rem;
		content: '';
		background: url('@/views/newOverallSituationCopy/image/dot-blue.png') no-repeat center /
			contain;
	}

	.source-title {
		margin-bottom: 0;
		margin-left: 0.06rem;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: clamp(0.15rem, 1.7vh, 0.18rem);
		text-align: center;
		z-index: 10;
		position: relative;
		top: -13%;
	}

	div:last-child {
		display: flex;
		align-items: center;
		justify-content: center;
		height: clamp(0.18rem, 2.1vh, 0.22rem);
		border-radius: 0.14rem;
		color: #67778a;
		position: relative;
		z-index: 0;
	}

	strong {
		margin: 0 0.01rem;
		font-size: 0.14rem;
		color: #333333;
	}

	span {
		font-size: 0.12rem;
	}

	.source-count-unit {
		flex: 0 0 auto;
		white-space: nowrap;
	}
}
</style>
