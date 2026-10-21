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
					<span class="target-text">签约项目投资总额任务：</span>
					<strong>{{ investAmountTask }}</strong>
					<span>亿元</span>
				</div>
				<button
					@click="clickParent('recruitmentByProject')"
					class="enter-btn"
					type="button"
				>
					<img src="@/views/newOverallSituationCopy/image/more.png" alt="" />
				</button>
			</header>

			<div class="project-metrics">
				<div class="project-metric">
					<div class="metric-label">全年累计签约项目数量</div>
					<div class="metric-value">
						<span>{{ formatNum(projectNum) }}</span>
						<i></i>
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
						<span>{{ formatNum(completionRate) }}</span>
						<small>%</small>
					</div>
				</div>
			</div>

			<div class="flow-table">
				<div class="flow-head">
					<div class="flow-head-cell"><span>线索</span></div>
					<div class="flow-head-cell"><span>在谈</span></div>
					<div class="flow-head-cell"><span>签约</span></div>
					<div class="flow-head-cell">
						<span>备案<br />(注册)</span>
					</div>
					<div class="flow-head-cell"><span>开工</span></div>
					<div class="flow-head-cell">
						<span>投产<br />(开票)</span>
					</div>
				</div>
				<div class="flow-body">
					<div class="flow-row">
						<div class="flow-label">
							<span>本月结余<br />数量(个)</span>
						</div>
						<div class="flow-values">
							<div
								v-for="item in projectSteps"
								:key="`${item.name}-count`"
								class="flow-value"
							>
								{{ formatNum(item.count) }}
							</div>
						</div>
					</div>
					<div class="flow-row">
						<div class="flow-label is-multiline">
							<span>投资总额</span>
							<span>(亿元)</span>
						</div>
						<div class="flow-values">
							<div
								v-for="item in projectSteps"
								:key="`${item.name}-amount`"
								class="flow-value"
							>
								{{ formatAmount(item.amount) }}
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
import { projectOverview, proSixBatchSummary } from '@/api/OverallSituation';
import useClickParent from '../composables/useClickParent';

const { clickParent } = useClickParent();

const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
const loading = ref(false);
const investAmountTask = ref<number | null>(null);
const projectNum = ref<number | null>(null);
const totalInvestAmount = ref<number | null>(null);
const completionRate = ref<number | null>(null);

const formatNum = (val: number | null) => val ?? '--';
const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};

const getProjectOverview = async () => {
	const res = await projectOverview<any>({ date: yearSelectValue.value });
	if (res.code !== 0) return;
	const { data } = res;
	investAmountTask.value = data.newProjectInvestAmountTask;
	projectNum.value = data.newProjectNum;
	totalInvestAmount.value = data.totalInvestAmount;
	completionRate.value = data.completionRate;
};

const projectSteps = ref([
	{ name: '线索', count: null as number | null, amount: null as number | null },
	{ name: '在谈', count: null as number | null, amount: null as number | null },
	{ name: '签约', count: null as number | null, amount: null as number | null },
	{ name: '备案', count: null as number | null, amount: null as number | null },
	{ name: '开工', count: null as number | null, amount: null as number | null },
	{ name: '投产', count: null as number | null, amount: null as number | null },
]);

// projectSteps 各步骤对应的接口字段映射
const stepFieldMap = [
	{ count: 'clueCount', amount: 'clueInvestAmount' },
	{ count: 'talkingCount', amount: 'talkingInvestAmount' },
	{ count: 'signCount', amount: 'signInvestTotal' },
	{ count: 'regCount', amount: 'regNewFilingTotal' },
	{ count: 'startCount', amount: 'startFixedInvest' },
	{ count: 'produceTotal', amount: 'produceFixedInvest' },
] as const;

const getProSixBatchSummary = async () => {
	const res = await proSixBatchSummary<any>({ date: yearSelectValue.value });
	if (res.code !== 0) return;
	const { data } = res;
	stepFieldMap.forEach(({ count, amount }, i) => {
		projectSteps.value[i].count = data[count];
		projectSteps.value[i].amount = data[amount];
	});
};

// 年月切换后刷新接口数据
watch(
	() => yearSelectValue.value,
	async (newVal) => {
		if (!newVal) return;
		loading.value = true;
		try {
			await Promise.all([getProjectOverview(), getProSixBatchSummary()]);
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
	--flow-label-width: clamp(0.56rem, 3.5vw, 0.64rem);
	--flow-row-gap: clamp(0.08rem, 1vh, 0.14rem);
	--flow-line-color: rgba(78, 151, 244, 0.45);

	min-height: 0;
	overflow: hidden;
	font-family:
		Microsoft YaHei,
		PingFang SC,
		sans-serif;
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
	grid-template-columns: minmax(0, 1fr) clamp(0.76rem, 4.8vw, 0.82rem);
}

.project-metrics {
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex: 0 0 0.64rem;
	margin: 0.08rem 0 0.08rem;
	background-image: url('../image/summary-card-row.png');
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

.project-metric {
	min-width: 0;
}

.metric-label {
	font-size: 0.15rem;
	line-height: clamp(0.15rem, 1.7vh, 0.18rem);
	font-family:
		PingFangSC,
		PingFang SC;
	color: #202a36;
	font-weight: 700;
}

.metric-value {
	display: flex;
	align-items: baseline;
	min-width: 0;
	height: clamp(0.23rem, 2.6vh, 0.28rem);
	margin-top: 0.03rem;
	color: #52606f;

	span {
		font-family: DINAlternate, Arial, sans-serif;
		font-size: 0.24rem;
		font-weight: bold;
		line-height: clamp(0.23rem, 2.6vh, 0.28rem);
		color: #165dff;
		text-shadow: none;
	}

	small {
		margin-left: 0.07rem;
		line-height: clamp(0.17rem, 1.9vh, 0.2rem);
		font-family: PingFangHK, PingFangHK;
		font-weight: 400;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);
	}

	&.is-empty span {
		font-size: 0.22rem;
	}
}

.flow-table {
	display: flex;
	flex: 1 1 0;
	flex-direction: column;
	height: 0;
	min-height: 0;
	overflow: hidden;
	font-size: 0.12rem;
	font-weight: 700;
	color: #555d69;
}

.flow-body {
	flex: 1 1 0;
	height: 0;
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.flow-head {
	display: flex;
	flex-shrink: 0;
	height: 0.35rem;
	margin-left: var(--flow-label-width);
	overflow: hidden;
	background: #fff;
}

.flow-head-cell {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1 1 0;
	min-width: 0;
	height: 100%;
	margin-left: -0.07rem;
	padding: 0 0.03rem 0 0.1rem;
	clip-path: polygon(
		0 0,
		calc(100% - 0.08rem) 0,
		100% 50%,
		calc(100% - 0.08rem) 100%,
		0 100%,
		0.08rem 50%
	);
	background: linear-gradient(135deg, #0d86ff 0%, #8fc5ff 100%);
	color: #fff;
	font-size: 0.12rem;
	line-height: 1.05;
	text-align: center;
	text-shadow: none;

	&:first-child {
		margin-left: 0;
		padding-left: 0.04rem;
		clip-path: polygon(
			0 0,
			calc(100% - 0.08rem) 0,
			100% 50%,
			calc(100% - 0.08rem) 100%,
			0 100%
		);
		background: linear-gradient(135deg, #0074f4 0%, #0f89ff 100%);
	}

	&:nth-child(2) {
		background: linear-gradient(135deg, #158dff 0%, #34a0ff 100%);
	}

	&:nth-child(3) {
		background: linear-gradient(135deg, #2f9cff 0%, #61b1ff 100%);
	}

	&:nth-child(4) {
		background: linear-gradient(135deg, #54aaff 0%, #80bcff 100%);
	}

	&:nth-child(5) {
		background: linear-gradient(135deg, #79bbff 0%, #9acaff 100%);
	}

	&:nth-child(6) {
		background: linear-gradient(135deg, #96c8ff 0%, #abd2ff 100%);
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0.08rem 50%);
		margin-left: -0.07rem;
	}

	span {
		display: block;
		white-space: pre-line;
	}
}

.flow-row {
	display: grid;
	grid-template-columns: var(--flow-label-width) minmax(0, 1fr);
	flex: 1;
	min-height: 0;
	margin-top: 0.04rem;
}
.flow-row:nth-child(1) {
	margin-top: 0.04rem;
}

.flow-label {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	min-width: 0;
	padding-left: 0.02rem;
	font-size: 0.14rem;
	line-height: 1.08;
	color: #4f5966;
	text-align: left;
	background: linear-gradient(90deg, rgba(232, 240, 253, 0.96), rgba(242, 247, 255, 0.92));

	&.is-multiline {
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}
}

.flow-values {
	display: grid;
	grid-template-columns: repeat(6, minmax(0, 1fr));
	min-width: 0;
	overflow: visible;
	border-radius: 0 0.13rem 0.13rem 0;
	background: linear-gradient(90deg, rgba(232, 240, 253, 0.96), rgba(242, 247, 255, 0.92));
}

.flow-value {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-width: 0;
	padding: 0 0.02rem;
	font-family: DINAlternate, Arial, sans-serif;
	font-size: 0.14rem;
	color: #565e6b;
	white-space: nowrap;
}
.flow-row {
	&:first-of-type {
		.flow-value {
			&::before {
				position: absolute;
				top: calc(var(--flow-row-gap) * -1);
				bottom: 0;
				left: 0;
				height: 1.06rem;
				border: 0.01rem solid;
				border-image: linear-gradient(
						180deg,
						rgba(253, 253, 253, 0),
						rgba(39, 114, 255, 0.74),
						rgba(39, 114, 255, 1),
						rgba(253, 253, 253, 0)
					)
					1 1;
				content: '';
				pointer-events: none;
			}
		}
	}
}
</style>
