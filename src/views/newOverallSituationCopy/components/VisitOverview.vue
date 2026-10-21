<template>
	<FrameBox
		v-loading="loading"
		class="module-frame visit-overview-frame"
		element-loading-background="rgba(255, 255, 255, 0.72)"
	>
		<section class="module visit-overview">
			<header class="module-header">
				<div class="header-left">
					<div class="header-title-item">
						<span class="module-title">大走访大对接</span>
						<div class="title-bg"></div>
					</div>
				</div>
				<button @click="clickParent('runByEnterprise')" class="enter-btn">
					<img src="@/views/newOverallSituationCopy/image/more.png" alt="" />
				</button>
			</header>

			<div class="visit-summary">
				<div class="visit-stat">
					<img src="@/views/newOverallSituationCopy/image/cube-icon.png" alt="" />
					<div>
						<div class="metric-label">目标企业数</div>
						<div class="metric-value">
							<span>{{ resOverview.summary.jobTouch }}</span>
							<small>家</small>
						</div>
					</div>
				</div>
				<div class="visit-stat">
					<img src="@/views/newOverallSituationCopy/image/cube-icon.png" alt="" />
					<div>
						<div class="metric-label">已完成走访数</div>
						<div class="metric-value">
							<span>{{ resOverview.summary.touch }}</span>
							<small>家</small>
						</div>
					</div>
				</div>
				<div class="visit-stat">
					<img src="@/views/newOverallSituationCopy/image/cube-icon.png" alt="" />
					<div>
						<div class="metric-label">任务完成率</div>
						<div class="metric-value">
							<span>{{ resOverview.summary.rate }}</span>
							<small>%</small>
						</div>
					</div>
				</div>
			</div>

			<div class="visit-body">
				<el-table
					class="visit-table"
					:data="visitRows"
					height="100%"
					:header-cell-style="{
						background: '#E4F1FF',
					}"
					row-key="name"
					:row-class-name="tableRowClassName"
				>
					<el-table-column prop="name" label="走访转化成果" align="left" />
					<el-table-column prop="count" label="数量（个）" align="center" />
					<el-table-column prop="amount" label="金额（亿元）" align="center" />
				</el-table>
				<div class="visit-side">
					<div class="side-item">
						<img
							src="@/views/newOverallSituationCopy/image/metric-icon-small-blue.png"
							alt=""
						/>
						<span class="side-label">议定事项</span>
						<strong class="side-value">{{
							fallback(resgetdataState.agreedMatterCount)
						}}</strong>
						<span class="side-unit">个</span>
					</div>
					<div class="side-item">
						<img
							src="@/views/newOverallSituationCopy/image/metric-icon-small-yellow.png"
							alt=""
						/>
						<span class="side-label">企业诉求</span>
						<strong class="side-value">{{
							fallback(resgetdataState.enterpriseAppealCount)
						}}</strong>
						<span class="side-unit">条</span>
					</div>
				</div>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import status from '@/stores/status';
import { storeToRefs } from 'pinia';
import { getvisittransformationList, queryTargetFollowCity } from '@/api/OverallSituation/index';
import useClickParent from '../composables/useClickParent';

// 父级菜单跳转方法
const { clickParent } = useClickParent();

// 全局年月筛选值
const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
// 获取当前年月对应的查询时间范围
const { getCurrentDate } = statusStore;
const loading = ref(false);

// 走访转化成果表格展示数据
const visitRows = ref([
	{ name: '转化线索', count: '--', amount: '--' },
	{ name: '转化项目', count: '--', amount: '--' },
	{ name: '新增意向企业', count: '--', amount: '--' },
]);

const getdataState = () => ({
	intentionEnterpriseCount: '--',
	convertedClueCount: '--',
	convertedClueAmount: '--',
	convertedProjectCount: '--',
	convertedProjectAmount: '--',
	agreedMatterCount: '--',
	enterpriseAppealCount: '--',
});

// const fallback = (val: any) => val || '--';

// 表格隔行背景样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) =>
	rowIndex === 1 ? 'row-white' : 'row-blue';

// 初始展示和接口失败时的兜底数据
const getDefaultOverview = () => ({
	summary: {
		jobTouch: '--',
		touch: '--',
		rate: '--',
	},
});

const getDefaultVisitRows = () => [
	{ name: '转化线索', count: '--', amount: '--' },
	{ name: '转化项目', count: '--', amount: '--' },
	{ name: '新增意向企业', count: '--', amount: '--' },
];

const fallback = (val: any) => (val === 0 || val === '0' ? val : val || '--');
const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};

/** 从接口响应中安全取出汇总首行；无数据时返回 null */
const pickSummaryRow = (res: any): Record<string, any> | null => {
	const data = res?.data;
	if (data == null) return null;
	if (Array.isArray(data)) {
		const first = data[0];
		return first && typeof first === 'object' ? first : null;
	}
	// 兼容 data 直接为对象的情况
	if (typeof data === 'object') return data;
	return null;
};

// 走访总览接口回填数据
const resOverview = ref(getDefaultOverview());
const resgetdataState = reactive(getdataState());

// 查询走访总览统计数据
const getVisitOverview = async () => {
	// 当前筛选时间范围
	const currentDate = getCurrentDate();
	if (!currentDate) return;
	const { startTimeStr, endTimeStr, label: date } = currentDate;
	try {
		const [res = {}, activityRes = {}]: any = await Promise.all([
			queryTargetFollowCity({ startTimeStr, endTimeStr }),
			getvisittransformationList({ date }),
		]);

		// 接口只取汇总首行；data 为空 / 非数组 / 无首条时走兜底
		const row = pickSummaryRow(res);
		if (res.code === 0 && row) {
			resOverview.value.summary.jobTouch = fallback(row.jobTouch);
			resOverview.value.summary.touch = fallback(row.touch);
			resOverview.value.summary.rate = fallback(row.rate);
		} else {
			resOverview.value = getDefaultOverview();
		}

		if (activityRes.code === 0 && activityRes.data) {
			Object.assign(resgetdataState, activityRes.data);
			visitRows.value = [
				{
					name: '转化线索',
					count: fallback(resgetdataState.convertedClueCount),
					amount: formatAmount(resgetdataState.convertedClueAmount),
				},
				{
					name: '转化项目',
					count: fallback(resgetdataState.convertedProjectCount),
					amount: formatAmount(resgetdataState.convertedProjectAmount),
				},
				{
					name: '新增意向企业',
					count: fallback(resgetdataState.intentionEnterpriseCount),
					amount: '--', // 后端暂无字段
				},
			];
		} else {
			Object.assign(resgetdataState, getdataState());
			visitRows.value = getDefaultVisitRows();
		}
	} catch (error) {
		console.error('getVisitOverview failed:', error);
		// 请求异常时全部回退占位，避免沿用上一次旧数据
		resOverview.value = getDefaultOverview();
		Object.assign(resgetdataState, getdataState());
		visitRows.value = getDefaultVisitRows();
	}
};

const refreshData = async () => {
	loading.value = true;
	try {
		await getVisitOverview();
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

.visit-overview-frame {
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

.visit-overview {
	min-height: 0;
	overflow: hidden;
}
.visit-summary {
	display: flex;
	align-items: center;
	justify-content: space-around;
	flex: 0 0 0.64rem;
	margin: 0.04rem 0 clamp(0.08rem, 1vh, 0.12rem);
	padding: 0 clamp(0.14rem, 1.4vw, 0.28rem);
	background: url('../image/visit-summary-row.webp') center / 100% 100% no-repeat;
}

.visit-stat {
	display: flex;
	align-items: center;
	gap: clamp(0.06rem, 0.8vw, 0.12rem);
	min-width: 0;

	img {
		width: clamp(0.36rem, 4.4vh, 0.47rem);
		height: clamp(0.38rem, 4.6vh, 0.49rem);
		object-fit: contain;
	}
}

.visit-stat .metric-label {
	font-size: 0.15rem;
	line-height: clamp(0.14rem, 1.6vh, 0.17rem);
	font-weight: 700;
	color: #202a36;
	font-family:
		PingFangSC,
		PingFang SC;
}

.visit-stat .metric-value {
	display: flex;
	align-items: baseline;
	margin-top: 0.05rem;

	span {
		line-height: 0.24rem;
		font-family: DINAlternate, Arial, sans-serif;
		font-size: 0.24rem;
		font-weight: bold;
		color: #165dff;
	}

	small {
		margin-left: 0.07rem;
		font-family: PingFangHK, PingFangHK;
		font-weight: 400;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);
	}
}

.visit-title {
	display: flex;
	align-items: center;
	flex: 0 0 clamp(0.22rem, 2.8vh, 0.28rem);
	font-size: 0.16rem;
	line-height: clamp(0.17rem, 1.9vh, 0.2rem);
	color: #162438;
}

.visit-body {
	display: flex;
	flex: 1 1 0;
	height: 0;
	min-height: 0;
	overflow: hidden;
	gap: max(0.04rem, 2%);
}

.visit-table {
	width: 100%;
	height: 100%;
	flex: 1;
	background: transparent;

	:deep(.el-table),
	:deep(.el-table__inner-wrapper),
	:deep(.el-table__header-wrapper),
	:deep(.el-table__body-wrapper),
	:deep(.el-table__header),
	:deep(.el-table__body),
	:deep(.el-scrollbar),
	:deep(.el-scrollbar__wrap),
	:deep(.el-scrollbar__view) {
		background: transparent !important;
	}

	:deep(.el-table__inner-wrapper::before) {
		display: none;
	}

	:deep(.el-table__inner-wrapper) {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden !important;
	}

	:deep(.el-table__header-wrapper) {
		margin-bottom: 0.02rem;
		flex-shrink: 0;
		overflow: hidden !important;
	}

	:deep(.el-table__body-wrapper) {
		flex: 1;
		min-height: 0;
		overflow: hidden !important;
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
		}
	}

	:deep(.el-scrollbar),
	:deep(.el-scrollbar__wrap),
	:deep(.el-scrollbar__bar) {
		overflow: hidden !important;
	}

	:deep(.el-scrollbar__bar) {
		display: none !important;
	}

	:deep(.el-table__header-wrapper th.el-table__cell) {
		height: clamp(0.24rem, 3vh, 0.36rem);
		padding: 0;
		border: 0;
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: 0.16rem;
		font-weight: 400;
		color: #333 !important;
	}

	:deep(.el-table__body-wrapper td.el-table__cell) {
		height: clamp(0.24rem, 3vh, 0.36rem);
		padding: 0;
		border: 0;
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: 0.15rem;
		color: #333 !important;
	}

	:deep(.el-table__body tr.row-blue td.el-table__cell) {
		background: #f0f3fe;
	}

	:deep(.el-table__body tr.row-white td.el-table__cell) {
		background: #fff;
	}
}

.visit-side {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;
	min-height: 0;
	overflow: hidden;

	.side-item {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.08rem;
	}

	img {
		width: 0.4rem;
		height: 0.4rem;
		object-fit: contain;
		flex-shrink: 0;
	}

	.side-label {
		flex: 1;
		min-width: 0;
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: 0.16rem;
		color: #333;
		white-space: nowrap;
	}

	.side-value {
		flex-shrink: 0;
		font-family: DINAlternate, Arial, sans-serif;
		font-weight: bold;
		font-size: 0.22rem;
		color: rgba(0, 0, 0, 0.65);
	}

	.side-unit {
		flex-shrink: 0;
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: 0.14rem;
		font-family: PingFangHK, PingFangHK;
		font-weight: 400;
		color: #5e5e5e;
		margin-left: 0.02rem;
	}
}
</style>
