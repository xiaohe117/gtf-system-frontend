<template>
	<FrameBox
		v-loading="loading"
		class="module-frame gi-overview-frame"
		element-loading-background="rgba(255, 255, 255, 0.72)"
	>
		<section class="module gi-overview">
			<header class="module-header compact-header gi-header">
				<div class="header-left">
					<div class="header-title-item">
						<span class="module-title">招商项目全流程</span>
						<div class="title-bg"></div>
					</div>
				</div>
				<button
					@click="clickParent('investmentFullProcess')"
					class="enter-link"
					type="button"
				>
					<span>查看更多</span>
					<i class="enter-icon"></i>
				</button>
			</header>

			<div class="process-body">
				<div class="funnel-wrap">
					<div class="funnel-bg"></div>
					<div
						v-for="(item, index) in processSteps"
						:key="item.name"
						class="funnel-label"
						:style="getLabelStyle(index)"
					>
						{{ item.name }}
					</div>
				</div>

				<div class="process-table">
					<div class="table-head">
						<div class="head-cell">
							<div>本月结余</div>
							<small>数量(个)</small>
						</div>
						<div class="head-cell">
							<div>投资总额</div>
							<small>(亿元)</small>
						</div>
					</div>
					<div class="table-body">
						<div
							v-for="item in processSteps"
							:key="`${item.name}-row`"
							class="table-row"
						>
							<span class="row-line"></span>
							<div class="table-cell">
								<span class="cell-main">{{ formatNum(item.total) }}</span>
								<!-- <small class="cell-unit">个</small> -->
							</div>
							<div class="table-cell">
								<span class="cell-main">{{ formatAmount(item.investAmount) }}</span>
								<!-- <small class="cell-unit">亿元</small> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import { proSixBatchSummary } from '@/api/OverallSituation';
// import router from '@/router';
// import userStore from '@/stores/user';
import status from '@/stores/status';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import useClickParent from '../composables/useClickParent';

const { clickParent } = useClickParent();

// 全局年月筛选值
const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
const loading = ref(false);

const processSteps = ref([
	{ name: '线索', total: null as number | null, investAmount: null as number | null },
	{ name: '在谈', total: null as number | null, investAmount: null as number | null },
	{ name: '签约', total: null as number | null, investAmount: null as number | null },
	{ name: '备案(注册)', total: null as number | null, investAmount: null as number | null },
	{ name: '开工', total: null as number | null, investAmount: null as number | null },
	{ name: '投产(开票)', total: null as number | null, investAmount: null as number | null },
]);

const stepFieldMap = [
	{ total: 'clueCount', investAmount: 'clueInvestAmount' },
	{ total: 'talkingCount', investAmount: 'talkingInvestAmount' },
	{ total: 'signCount', investAmount: 'signInvestTotal' },
	{ total: 'regCount', investAmount: 'regNewFilingTotal' },
	{ total: 'startCount', investAmount: 'startFixedInvest' },
	{ total: 'produceTotal', investAmount: 'produceFixedInvest' },
] as const;

const labelTops = ['32%', '44%', '56%', '68%', '80%', '92%'];
const getLabelStyle = (index: number) => ({
	top: labelTops[index],
});

const formatNum = (val: number | null | undefined) =>
	val === null || val === undefined ? '--' : val;
const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};

const getProcessData = async () => {
	const res = await proSixBatchSummary<any>({ date: yearSelectValue.value });
	if (res.code !== 0) return;
	const { data } = res;
	stepFieldMap.forEach(({ total, investAmount }, i) => {
		processSteps.value[i].total = data[total] ?? null;
		processSteps.value[i].investAmount = data[investAmount] ?? null;
	});
};

const refreshData = async () => {
	loading.value = true;
	try {
		await getProcessData();
	} finally {
		loading.value = false;
	}
};

// 年月切换后刷新数据
watch(
	() => yearSelectValue.value,
	(newVal) => {
		if (newVal) {
			refreshData();
		}
	},
	{ immediate: true }
);

// 进入 GI 页面
// const toGI = () => {
// 	userStore().setDateSelect(yearSelectValue.value); // 跳转指标仪表盘，同步日期筛选
// 	router.push({ path: '/efficiency/index' });
// };
</script>

<style lang="less" scoped>
@import './moduleCommon.less';

.gi-overview-frame {
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

.gi-overview {
	min-height: 0;
	overflow: hidden;
}

.gi-header {
	grid-template-columns: minmax(0, 1fr) auto;
	column-gap: 0.08rem;
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

.process-body {
	flex: 1 1 0;
	display: grid;
	grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.8fr);
	gap: 0.08rem;
	height: 0;
	min-height: 0;
	padding: 0.06rem 0.04rem 0.04rem;
	overflow: visible;
}

.funnel-wrap {
	position: relative;
	min-width: 0;
	min-height: 0;
	height: 100%;
	overflow: hidden;
}

.funnel-bg {
	position: absolute;
	left: 0;
	top: 0%;
	width: 100%;
	height: 100%;
	background: url('../image/zsqlc.png') center / 100% 100% no-repeat;
	pointer-events: none;
}

@media (max-height: 1080px) and (min-resolution: 2dppx) {
	.funnel-bg {
		height: 100% !important;
		// width: 100% !important;

		// background: url('../image/zsqlc.png') center / 90% 100% no-repeat;

		top: 0%;
	}
	.table-head {
		padding: 0 !important;
	}
	/* 你的样式，针对高度 ≤ 1080 的高分屏 */
}

.funnel-label {
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #fff;
	font-family: SourceHanSansCN-Bold;
	font-size: 0.14rem;
	text-shadow: none;
	white-space: nowrap;
	pointer-events: none;
}

.process-table {
	position: relative;
	display: flex;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
	margin-left: 0.12rem;
	font-size: clamp(0.11rem, 1.2vh, 0.13rem);
	color: #4f5966;
}

.table-head {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	flex-shrink: 0;
	padding: 0.04rem 0;
	font-family: SourceHanSansCN-Bold;
	color: #1b2f4a;
	text-align: center;

	.head-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 0;
		font-family: SourceHanSansCN-Bold;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);

		small {
			font-family: SourceHanSansCN-Bold;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}

.table-body {
	flex: 1 1 0;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.table-row {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1fr;
	flex: 1 1 0;
	align-items: center;
	justify-items: center;
	min-height: 0;
	margin-bottom: 0.04rem;
	padding: 0;
	background: url('../image/listback.png') center / 100% 100% no-repeat;
	box-sizing: border-box;

	&:last-child {
		margin-bottom: 0;
	}

	.row-line {
		position: absolute;
		left: -0.36rem;
		top: 50%;
		width: 0.36rem;
		height: 0.02rem;
		transform: translateY(-50%);
		background: linear-gradient(
			90deg,
			rgba(79, 152, 255, 0) 0%,
			rgba(79, 152, 255, 0.35) 35%,
			rgba(64, 143, 255, 0.95) 100%
		);
		pointer-events: none;
	}
}

.table-cell {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.02rem;
	width: 100%;
	min-width: 0;
	text-align: center;
	white-space: nowrap;

	.cell-main {
		font-family: SourceHanSansCN-Bold;
		font-size: 0.14rem;
		color: #000000;
		line-height: 1;
	}

	.cell-unit {
		font-size: clamp(0.1rem, 1.1vh, 0.12rem);
		color: rgba(0, 0, 0, 0.65);
		line-height: 1;
	}
}
</style>
