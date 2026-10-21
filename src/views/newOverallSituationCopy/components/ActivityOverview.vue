<template>
	<FrameBox
		v-loading="loading"
		class="module-frame activity-frame"
		element-loading-background="rgba(255, 255, 255, 0.72)"
	>
		<section class="module activity-overview">
			<header class="module-header">
				<div class="header-left">
					<div class="header-title-item">
						<span class="module-title">活动总览</span>
						<div class="title-bg"></div>
					</div>
					<span class="target-text">任务数：</span>
					<strong>{{ resOverview.target.value }}</strong>
					<span>场</span>
					<span>，完成率：</span>
					<strong>{{ resOverview.target.completionRate }}%</strong>
				</div>
				<button @click="clickParent('activityOverview')" class="enter-btn">
					<img src="@/views/newOverallSituationCopy/image/more.png" alt="" />
				</button>
			</header>

			<div class="activity-body">
				<div class="activity-left">
					<div class="activity-main-number">
						<div class="number-title">组织活动数</div>
						<div class="number-wrap">
							<span class="number-value">{{
								fallback(dataOverview.activityCount)
							}}</span>
							<span class="number-unit">场</span>
						</div>
					</div>
					<div class="activity-type">
						<img
							class="type-icon"
							src="@/views/newOverallSituationCopy/image/metric-icon-large.png"
							alt=""
						/>
						<div class="type-info">
							<div class="type-name">"热气腾腾"系列</div>
							<div class="type-value-wrap">
								<span class="type-value">{{
									fallback(dataOverview.hotActivityCount)
								}}</span>
								<span class="type-unit">场</span>
							</div>
						</div>
					</div>
					<div class="activity-type">
						<img
							class="type-icon"
							src="@/views/newOverallSituationCopy/image/metric-icon-large-alt.png"
							alt=""
						/>
						<div class="type-info">
							<div class="type-name">展会招商</div>
							<div class="type-value-wrap">
								<span class="type-value">{{
									fallback(dataOverview.expoCount)
								}}</span>
								<span class="type-unit">场</span>
							</div>
						</div>
					</div>
				</div>
				<div class="activity-right">
					<div class="activity-stat-row">
						<i></i>
						<div class="stat-name">活动对接企业数</div>
						<span class="stat-value">{{
							fallback(dataOverview.activityCompanyCount)
						}}</span>
						<span class="stat-unit">家</span>
					</div>
					<div class="activity-stat-row">
						<i></i>
						<div class="stat-name">产生意向线索数</div>
						<span class="stat-value">{{
							fallback(dataOverview.intentionClueCount)
						}}</span>
						<span class="stat-unit">条</span>
					</div>
					<div class="activity-stat-row">
						<i></i>
						<div class="stat-name">转化线索</div>
						<span class="stat-value">{{
							fallback(dataOverview.convertedClueCount)
						}}</span>
						<span class="stat-unit">条</span>
						<span class="stat-value">{{
							formatAmount(dataOverview.convertedClueAmount)
						}}</span>
						<span class="stat-unit">亿元</span>
					</div>
					<div class="activity-stat-row">
						<i></i>
						<div class="stat-name">转化项目</div>
						<span class="stat-value">{{
							fallback(dataOverview.convertedProjectCount)
						}}</span>
						<span class="stat-unit">条</span>
						<span class="stat-value">{{
							formatAmount(dataOverview.convertedProjectAmount)
						}}</span>
						<span class="stat-unit">亿元</span>
					</div>
				</div>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import status from '@/stores/status';
import { queryActivityTable } from '@/api/commandCenter/deptOverview';
import { getactivityoverviewList } from '@/api/OverallSituation/index';
import useClickParent from '../composables/useClickParent';

// 父级菜单跳转方法
const { clickParent } = useClickParent();

// 全局年月筛选值
const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
// 获取当前年月对应的查询时间范围
const { getCurrentDate } = statusStore;
const loading = ref(false);

// 初始展示和接口失败时的兜底数据
const getDefaultOverview = () => ({
	target: {
		value: '--',
		completionRate: '--',
	},
	totalCount: {
		value: '--',
	},
});

const getInitialState = () => ({
	activityCount: '--',
	activityCompanyCount: '--',
	intentionClueCount: '--',
	convertedClueCount: '--',
	convertedClueAmount: '--',
	convertedProjectCount: '--',
	convertedProjectAmount: '--',
	hotActivityCount: '--',
	expoCount: '--',
});

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
	// 活动总览：data.rows 数组
	if (Array.isArray(data.rows)) {
		const first = data.rows[0];
		return first && typeof first === 'object' ? first : null;
	}
	// 兼容 data 直接为数组
	if (Array.isArray(data)) {
		const first = data[0];
		return first && typeof first === 'object' ? first : null;
	}
	// 兼容 data 直接为对象
	if (typeof data === 'object') return data;
	return null;
};

// 活动总览接口回填数据
const resOverview = ref(getDefaultOverview());
const dataOverview = reactive(getInitialState());

// 查询活动总览统计数据
const getActivityOverview = async () => {
	// 当前筛选时间范围
	const currentDate = getCurrentDate();
	if (!currentDate) return;
	const { startTimeStr, endTimeStr, label: date } = currentDate;
	try {
		const [res = {}, activityRes = {}]: any = await Promise.all([
			queryActivityTable({ startTimeStr, endTimeStr, tabType: 'CITY_OVERVIEW' }),
			getactivityoverviewList({ date }),
		]);

		// 接口只取汇总首行；data / rows 为空时走兜底
		const row = pickSummaryRow(res);
		if (res.code === 0 && row) {
			resOverview.value.target.value = fallback(row.taskCount);
			resOverview.value.target.completionRate = fallback(row.completionRate);
			resOverview.value.totalCount.value = fallback(row.totalCount);
		} else {
			resOverview.value = getDefaultOverview();
		}

		if (activityRes.code === 0 && activityRes.data) {
			Object.assign(dataOverview, activityRes.data);
		} else {
			Object.assign(dataOverview, getInitialState());
		}
	} catch (error) {
		console.error('getActivityOverview failed:', error);
		// 请求异常时全部回退占位，避免沿用上一次旧数据
		resOverview.value = getDefaultOverview();
		Object.assign(dataOverview, getInitialState());
	}
};

const refreshData = async () => {
	loading.value = true;
	try {
		await getActivityOverview();
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

.activity-frame {
	min-height: 0;
	overflow: hidden;

	:deep(.outside-content) {
		min-height: 0;
		overflow: hidden;
		box-shadow: none;
		padding: clamp(0.07rem, 0.9vh, 0.12rem) clamp(0.09rem, 0.9vw, 0.16rem)
			clamp(0.1rem, 1.2vh, 0.2rem) clamp(0.12rem, 1.2vw, 0.2rem);
	}

	:deep(.outside-content > div) {
		min-height: 0;
		overflow: hidden;
	}
}

.activity-overview {
	min-height: 0;
	overflow: hidden;
}

.activity-body {
	display: grid;
	grid-template-columns: 2rem 1fr;
	gap: 0.1rem;
	flex: 1 1 0;
	height: 0;
	min-height: 0;
	padding-top: 0.08rem;
}

.activity-left {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	min-height: 0;
}

.activity-main-number {
	flex-shrink: 0;
	height: clamp(0.5rem, 6vh, 0.64rem);
	.number-title {
		padding-left: 0.24rem;
		font-size: 0.15rem;
		line-height: clamp(0.15rem, 1.7vh, 0.18rem);
		color: #202a36;
		font-weight: 700;
	}
	.number-wrap {
		display: flex;
		align-items: flex-end;
		gap: 0.08rem;
		padding-left: 0.24rem;
		background:
			url('../image/section-line.png') center bottom / 100% 0.1rem no-repeat,
			linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(218, 242, 255, 0.58) 100%);
		.number-value {
			font-family: DINAlternate;
			font-weight: bold;
			font-size: 0.24rem;
			color: #165dff;
		}
		.number-unit {
			font-family: PingFangHK;
			font-size: 0.14rem;
			color: #5e5e5e;
			line-height: 2;
		}
	}
}

.activity-type {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	gap: 0.08rem;
	.type-icon {
		width: 0.5rem;
		height: 0.5rem;
		object-fit: contain;
	}
	.type-info {
		display: flex;
		flex-direction: column;
		.type-name {
			font-family: PingFangSC;
			font-size: 0.15rem;
			color: #333;
		}
		.type-value-wrap {
			display: flex;
			align-items: center;
			gap: 0.08rem;
			.type-value {
				font-family: DINAlternate;
				font-weight: bold;
				font-size: 0.2rem;
				color: rgba(0, 0, 0, 0.65);
			}
			.type-unit {
				font-family: PingFangHK;
				font-size: 0.14rem;
				color: #5e5e5e;
			}
		}
	}
}

.activity-right {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100%;
	min-height: 0;
	overflow: hidden;
	.activity-stat-row {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 0.38rem;
		padding: 0.08rem 0.08rem 0.08rem 0.24rem;
		background: url('../image/small-table-bg.png') no-repeat center center;
		background-size: 100% 100%;

		i {
			width: 0.12rem;
			height: 0.12rem;
			border: 0.02rem solid #2091ff;
			border-radius: 50%;
		}

		.stat-name {
			flex: 1;
			font-family: PingFangSC;
			font-size: 0.15rem;
			color: #333333;
			padding-left: 0.08rem;
		}
		.stat-value {
			font-family: DINAlternate;
			font-weight: bold;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.65);
			padding: 0 0.08rem;
		}
		.stat-unit {
			font-family: PingFangHK;
			font-size: 0.14rem;
			color: #5e5e5e;
		}
	}
}
</style>
