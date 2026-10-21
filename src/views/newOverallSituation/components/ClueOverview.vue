<template>
	<FrameBox
		v-loading="loading"
		class="module-frame clue-overview-frame"
		element-loading-background="rgba(255, 255, 255, 0.72)"
	>
		<section class="module clue-overview">
			<header class="module-header clue-header">
				<div class="header-left">
					<div class="header-title-item">
						<span class="module-title">线索总览</span>
						<div class="title-bg"></div>
					</div>
				</div>
				<button
					v-if="false"
					@click="clickParent('clubOverview')"
					class="enter-link"
					type="button"
				>
					<span>查看更多</span>
					<i class="enter-icon"></i>
				</button>
			</header>

			<div class="clue-metrics">
				<div class="clue-metric">
					<div class="metric-label">目标投资额</div>
					<div class="metric-value">
						<span>{{ resOverview.summary.targetAmount }}</span>
						<small>亿元</small>
					</div>
				</div>
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
				<div class="clue-group">
					<div class="group-title">
						<span class="dot"></span>
						<span>市内线索</span>
					</div>
					<div class="group-grid">
						<div class="clue-card">
							<div class="card-title">十亿元 + 项目</div>
							<div class="card-row">
								<span class="card-num">
									<em>{{ formatNum(sourceStats.innerCity.tenBillionCount) }}</em>
									<small>个</small>
								</span>
							</div>
							<div class="card-row">
								<span class="card-amount">
									<em>{{
										formatAmount(sourceStats.innerCity.tenBillionAmount)
									}}</em>
									<small>亿元</small>
								</span>
							</div>
						</div>
						<div class="clue-card">
							<div class="card-title">百亿元 + 项目</div>
							<div class="card-row">
								<span class="card-num">
									<em>{{
										formatNum(sourceStats.innerCity.hundredBillionCount)
									}}</em>
									<small>个</small>
								</span>
							</div>
							<div class="card-row">
								<span class="card-amount">
									<em>{{
										formatAmount(sourceStats.innerCity.hundredBillionAmount)
									}}</em>
									<small>亿元</small>
								</span>
							</div>
						</div>
					</div>
				</div>

				<div class="clue-group">
					<div class="group-title">
						<span class="dot"></span>
						<span>市外线索</span>
					</div>
					<div class="group-grid">
						<div class="clue-card">
							<div class="card-title">十亿元 + 项目</div>
							<div class="card-row">
								<span class="card-num">
									<em>{{ formatNum(sourceStats.outerCity.tenBillionCount) }}</em>
									<small>个</small>
								</span>
							</div>
							<div class="card-row">
								<span class="card-amount">
									<em>{{
										formatAmount(sourceStats.outerCity.tenBillionAmount)
									}}</em>
									<small>亿元</small>
								</span>
							</div>
						</div>
						<div class="clue-card">
							<div class="card-title">百亿元 + 项目</div>
							<div class="card-row">
								<span class="card-num">
									<em>{{
										formatNum(sourceStats.outerCity.hundredBillionCount)
									}}</em>
									<small>个</small>
								</span>
							</div>
							<div class="card-row">
								<span class="card-amount">
									<em>{{
										formatAmount(sourceStats.outerCity.hundredBillionAmount)
									}}</em>
									<small>亿元</small>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
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

const formatNum = (val: number | null | undefined) =>
	val == null || String(val) === '' ? '--' : val;
const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};

// 初始展示和接口失败时的兜底数据
const getDefaultOverview = () => ({
	target: {
		value: '',
	},
	summary: {
		targetAmount: '',
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
	resOverview.value.summary.targetAmount = row.targetNum || '--';
	resOverview.value.summary.clueCount = row.clueCount || '--';
	resOverview.value.summary.investAmount = row.investAmount || '--';
	resOverview.value.summary.completionRate = row.completionRate || '--';
};

// 查询线索来源统计数据
const getClueSourceStats = async () => {
	const res = await clueSourceStats<typeof sourceStats.value>({ date: yearSelectValue.value });
	if (res.code !== 0) return;
	sourceStats.value = res.data;
};

const refreshData = async () => {
	loading.value = true;
	try {
		await Promise.all([getClueOverview(), getClueSourceStats()]);
	} finally {
		loading.value = false;
	}
};

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
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	min-height: 0;
	overflow: hidden;
}

.clue-header {
	grid-template-columns: minmax(0, 1fr) auto;
}

.enter-link {
	position: relative;
	z-index: 1;
	justify-self: end;
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	gap: 0.04rem;
	padding: 0 0.04rem;
	background: transparent;
	border: 0;
	cursor: pointer;
	font-family: SourceHanSansCN;
	font-weight: 400;
	font-size: 0.12rem;
	color: rgba(0, 0, 0, 0.65);
	line-height: 0.12rem;
	text-align: right;
	font-style: normal;

	&:hover {
		color: #165dff;
	}

	.enter-icon {
		display: inline-block;
		width: 0.12rem;
		height: 0.12rem;
		background: url('../image/rightarrowIcon.png') center / 100% 100% no-repeat;
	}
}

.clue-metrics {
	position: relative;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	gap: 0.44rem;
	flex: 0 0 clamp(0.5rem, 6vh, 0.64rem);
	padding: 0rem 0.2rem 0rem 0.2rem;
	background: url('../image/section-line.png') center bottom / 100% 0.11rem no-repeat;
	overflow: hidden;
}

.clue-metric {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 0;
}

.clue-metric .metric-label {
	// margin-bottom: 0.06rem;
	font-size: 0.16rem;
	line-height: 0.22rem;
	font-family: SourceHanSansCN-Bold;
	color: #303031;
	text-align: center;
}

.clue-metric .metric-value {
	display: flex;
	align-items: baseline;
	justify-content: center;
	margin-top: 0;

	span {
		font-family: SourceHanSansCN-Bold;
		font-size: 0.2rem;
		color: #165dff;
		line-height: 0.28rem;
		text-align: left;
		font-style: normal;
	}

	small {
		margin-left: 0.04rem;
		font-family: SourceHanSansCN;
		font-weight: 400;
		font-size: 0.13rem;
		color: #5e5e5e;
		line-height: 0.22rem;
		text-align: left;
		font-style: normal;
	}
}

.clue-main {
	flex: 0 0 auto;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.1rem;
	min-height: 0;
	padding: 0 0.04rem 0.04rem;
	overflow: hidden;
}

.clue-group {
	display: flex;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
}

.group-title {
	display: flex;
	align-items: center;
	gap: 0.06rem;
	margin-bottom: 0.06rem;
	font-size: 0.16rem;
	color: #000000;
	font-family: SourceHanSansCN-Bold;

	.dot {
		display: inline-block;
		width: 0.08rem;
		height: 0.08rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #4f98ff, #165dff);
		box-shadow: 0 0 0.04rem rgba(79, 152, 255, 0.6);
	}
}

.group-grid {
	flex: 0 0 auto;
	display: flex;
	flex-wrap: nowrap;
	gap: 0.06rem;
	min-height: 0;
}

.clue-card {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 1.2rem;
	height: 1.17rem;

	padding: 0.05rem 0.08rem;
	box-sizing: border-box;
	border-radius: 0.06rem;
	background: #f2f4fe;
	box-shadow: inset 0 0 0 0.01rem rgba(78, 151, 244, 0.18);

	.card-title {
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.2rem;
		// margin-bottom: 0.06rem;
		font-family: SourceHanSansCN-Bold;
		text-align: center;
		font-style: normal;
	}

	.card-row {
		display: flex;
		align-items: baseline;
		justify-content: center;
		margin-top: 0.03rem;

		.card-num,
		.card-amount {
			display: flex;
			align-items: baseline;
			justify-content: center;
		}

		em {
			font-family: SourceHanSansCN-Bold;
			font-style: normal;
			font-size: 0.16rem;
			color: #000000;
		}

		small {
			margin-left: 0.04rem;
			font-size: clamp(0.11rem, 1.2vh, 0.13rem);
			color: rgba(0, 0, 0, 0.65);
		}
	}
}

@media (max-height: 1080px) and (min-resolution: 2dppx) {
	.clue-card {
		height: 0.9rem !important;
	}
}
</style>
