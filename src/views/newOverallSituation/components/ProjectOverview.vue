<template>
	<FrameBox
		v-loading="loading"
		class="module-frame project-overview-frame"
		element-loading-background="rgba(255, 255, 255, 0.72)"
	>
		<section class="module project-overview">
			<header class="module-header project-header">
				<div class="header-left">
					<div class="header-title-item">
						<span class="module-title">项目总览</span>
						<div class="title-bg"></div>
					</div>
				</div>
				<button
					@click="clickParent('recruitmentByProject')"
					class="enter-link"
					type="button"
				>
					<span>查看更多</span>
					<img class="enter-icon" src="../image/rightarrowIcon.png" alt="" />
				</button>
			</header>

			<div class="project-metrics">
				<div class="project-metric">
					<div class="metric-label">目标签约投资额</div>
					<div class="metric-value">
						<span>{{ formatNum(investAmountTask) }}</span>
						<small>亿元</small>
					</div>
				</div>
				<div class="project-metric">
					<div class="metric-label">签约项目数量</div>
					<div class="metric-value">
						<span>{{ formatNum(projectNum) }}</span>
						<small>个</small>
					</div>
				</div>
				<div class="project-metric">
					<div class="metric-label">项目投资总额</div>
					<div class="metric-value">
						<span>{{ formatAmount(totalInvestAmount) }}</span>
						<small>亿元</small>
					</div>
				</div>
				<div class="project-metric">
					<div class="metric-label">任务完成率</div>
					<div class="metric-value">
						<span>{{ formatRate(completionRate) }}</span>
						<small v-if="completionRate !== null && completionRate !== undefined"
							>%</small
						>
					</div>
				</div>
			</div>

			<div class="project-cards">
				<div class="project-card">
					<div class="project-card-head">
						<span class="dot"></span>
						<span class="card-label">投资 十 亿元 + 项目</span>
					</div>
					<div class="project-card-body">
						<div class="card-body-bg"></div>
						<div class="card-body-content">
							<span class="body-num">{{ formatNum(tenBillionCount) }}</span>
							<small>个</small>
							<span class="body-num">{{ formatAmount(tenBillionAmount) }}</span>
							<small>亿元</small>
						</div>
					</div>
				</div>

				<div class="project-card">
					<div class="project-card-head">
						<span class="dot"></span>
						<span class="card-label">投资 百 亿元 + 项目</span>
					</div>
					<div class="project-card-body">
						<div class="card-body-bg"></div>
						<div class="card-body-content">
							<span class="body-num">{{ formatNum(hundredBillionCount) }}</span>
							<small>个</small>
							<span class="body-num">{{ formatAmount(hundredBillionAmount) }}</span>
							<small>亿元</small>
						</div>
					</div>
				</div>

				<div class="project-card">
					<div class="project-card-head">
						<span class="dot"></span>
						<span class="card-label">产值/营收百亿级项目数</span>
					</div>
					<div class="project-card-body">
						<div class="card-body-bg"></div>
						<div class="card-body-content">
							<span class="body-num">{{ formatNum(hundredIncomeCount) }}</span>
							<small>个</small>
							<span class="body-num">{{ formatAmount(hundredIncomeAmount) }}</span>
							<small>亿元</small>
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
import { getinvestmentscaleoverview, projectOverview } from '@/api/OverallSituation';
import useClickParent from '../composables/useClickParent';

const { clickParent } = useClickParent();

const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
const loading = ref(false);

const investAmountTask = ref<number | null>(null);
const projectNum = ref<number | null>(null);
const totalInvestAmount = ref<number | null>(null);
const completionRate = ref<number | null>(null);

const tenBillionCount = ref<number | null>(null);
const tenBillionAmount = ref<number | null>(null);
const hundredBillionCount = ref<number | null>(null);
const hundredBillionAmount = ref<number | null>(null);
const hundredIncomeCount = ref<number | null>(null);
const hundredIncomeAmount = ref<number | null>(null);

const formatNum = (val: number | null | undefined) =>
	val === null || val === undefined ? '--' : val;
const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};
const formatRate = (val: number | null | undefined) => {
	if (val === null || val === undefined) return '-';
	return val;
};

const getProjectOverview = async () => {
	const res = await projectOverview<any>({ date: yearSelectValue.value });
	if (res.code !== 0) return;
	const { data } = res;

	// 与 newOverallSituationCopy 一致：目标签约投资额
	investAmountTask.value = data.newProjectInvestAmountTask;
	projectNum.value = data.newProjectNum;
	totalInvestAmount.value = data.totalInvestAmount;
	completionRate.value = data.completionRate;
};

const getInvestmentScaleOverview = async () => {
	const res = await getinvestmentscaleoverview<any>({ date: yearSelectValue.value });
	if (res.code !== 0) {
		tenBillionCount.value = null;
		tenBillionAmount.value = null;
		hundredBillionCount.value = null;
		hundredBillionAmount.value = null;
		hundredIncomeCount.value = null;
		hundredIncomeAmount.value = null;
		return;
	}
	const data = res.data ?? {};
	tenBillionCount.value = data.tenBillionCount ?? null;
	tenBillionAmount.value = data.tenBillionAmount ?? null;
	hundredBillionCount.value = data.hundredBillionCount ?? null;
	hundredBillionAmount.value = data.hundredBillionAmount ?? null;
	hundredIncomeCount.value = data.hundredIncomeCount ?? null;
	hundredIncomeAmount.value = data.hundredIncomeAmount ?? null;
};

watch(
	() => yearSelectValue.value,
	async (newVal) => {
		if (!newVal) return;
		loading.value = true;
		try {
			await Promise.all([getProjectOverview(), getInvestmentScaleOverview()]);
		} finally {
			loading.value = false;
		}
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import './moduleCommon.less';

.project-overview {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	min-height: 0;
	overflow: hidden;
	font-family: SourceHanSansCN;
}

.project-overview-frame {
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

.project-header {
	grid-template-columns: minmax(0, 1fr) auto;
}

.enter-link {
	position: relative;
	z-index: 1;
	justify-self: end;
	display: inline-flex;
	align-items: center;
	gap: 0.04rem;
	padding: 0;
	border: 0;
	background: transparent;
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
		width: 0.12rem;
		height: 0.12rem;
		object-fit: contain;
	}
}

.project-metrics {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	align-items: flex-start;
	justify-content: center;
	gap: 0.22rem;
	padding: 0.06rem 0.16rem 0.12rem;
	background: url('../image/section-line.png') center bottom / 100% 0.12rem no-repeat;
}

.project-metric {
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	align-items: center;
	min-width: 0;
}

.metric-label {
	width: 100%;
	font-family: SourceHanSansCN-Bold;
	font-size: 0.16rem;
	color: #303031;
	line-height: 0.2rem;
	white-space: nowrap;
	text-align: center;
}

.metric-value {
	display: flex;
	flex-wrap: nowrap;
	align-items: baseline;
	margin-top: 0.02rem;
	white-space: nowrap;

	> span {
		font-family: SourceHanSansCN-Bold;
		font-size: 0.2rem;
		color: #165dff;
		line-height: 0.28rem;
	}

	> small {
		margin-left: 0.04rem;
		font-family: SourceHanSansCN;
		font-weight: 400;
		font-size: 0.13rem;
		color: rgba(0, 0, 0, 0.55);
		line-height: 0.18rem;
	}
}

.project-cards {
	display: grid;
	// flex: 0 0 auto;
	flex: 1;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.1rem;
	height: 1.65rem;
	margin-top: 0;
	padding: 0 0.08rem;
}

.project-card {
	position: relative;
	display: flex;
	flex-direction: column;
	min-width: 0;
	height: 100%;
	overflow: hidden;
	border-radius: 0.08rem;
	background: #f7faff;
	box-shadow: 0 0.02rem 0.08rem rgba(61, 139, 255, 0.08);
}

.project-card-head {
	position: relative;
	z-index: 2;
	display: flex;
	flex-shrink: 0;
	align-items: flex-start;
	height: 0.56rem;
	padding: 0.08rem 0.1rem 0.06rem;
	box-sizing: border-box;
	overflow: hidden;
	background: url('../image/beam-group.png') center / 100% 100% no-repeat;

	.dot {
		flex-shrink: 0;
		width: 0.08rem;
		height: 0.08rem;
		margin-top: 0.06rem;
		margin-right: 0.08rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #4f98ff, #165dff);
		box-shadow: 0 0 0.04rem rgba(79, 152, 255, 0.55);
	}

	.card-label {
		min-width: 0;
		font-family: SourceHanSansCN-Bold;
		font-size: 0.14rem;
		color: #000000;
		line-height: 0.2rem;
		text-align: left;
		font-style: normal;
		white-space: normal;
		word-break: break-all;
	}
}

.project-card-body {
	position: relative;
	flex: 1;
	z-index: 1;
	display: flex;
	// height: 100%;
	min-height: 0.8rem;
	margin-top: -0.1rem;
	overflow: hidden;
	height: calc(100% - 1.1rem);
}

.card-body-bg {
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	background:
		url('../image/stamp2.png') center -10% / 100% auto no-repeat,
		url('../image/stamp.png') center calc(100% + 0.1rem) / 100% 100% no-repeat;
}

// @media (max-height: 1080px) and (min-resolution: 2dppx) {
// 	.card-body-bg {
// 		background:
// 			url('../image/stamp2.png') center calc(100% + 0.3rem) / 100% auto no-repeat,
// 			url('../image/stamp.png') center calc(100% + 0.1rem) / 100% 100% no-repeat !important;
// 	}
// 	/* 你的样式，针对高度 ≤ 1080 的高分屏 */
// }

.card-body-content {
	position: relative;
	z-index: 2;
	display: flex;
	flex: 1 1 auto;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	align-content: center;
	// gap: 0.01rem 0.02rem;
	width: 100%;
	min-height: 0;
	padding: 0.14rem 0rem 0.16rem;
	box-sizing: border-box;

	.body-num {
		font-family: SourceHanSansCN-Bold;
		font-size: 0.18rem;
		color: #000000;
		line-height: 0.28rem;
		text-align: center;
		font-style: normal;
		margin-right: 0.02rem;
	}

	small {
		margin-right: 0.08rem;
		font-family: SourceHanSansCN;
		font-weight: 400;
		font-size: 0.13rem;
		color: rgba(0, 0, 0, 0.55);
		line-height: 0.18rem;

		&:last-child {
			margin-right: 0;
		}
	}
}
@media (max-height: 1080px) and (min-resolution: 2dppx) {
	.project-metrics {
		padding-bottom: 0rem !important;
	}

	.project-card-body {
		flex: 0 0 0.8rem;
		height: 0.8rem;
		min-height: 0.8rem;
	}

	.card-body-content {
		padding: 0.08rem 0 0.1rem;
	}

	.card-body-bg {
		background:
			url('../image/stamp2.png') center 5% / 100% auto no-repeat,
			url('../image/stamp.png') center calc(100% + 0.1rem) / 100% 100% no-repeat !important;
	}
}
</style>
