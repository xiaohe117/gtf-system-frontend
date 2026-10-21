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
						<span class="module-title">招商GI</span>
						<div class="title-bg"></div>
					</div>
				</div>
				<button @click="toGI()" class="enter-btn" type="button">
					<img src="@/views/newOverallSituationCopy/image/more.png" alt="" />
				</button>
			</header>
			<div class="gi-card-grid">
				<div v-if="!loading && activeCards.length === 0" class="gi-empty">
					<img
						src="@/assets/images/IntelligenceOverview/emty.webp"
						class="gi-empty-image"
						alt=""
					/>
					<div class="gi-empty-text">暂无数据</div>
				</div>
				<template v-else>
					<div
						v-for="(item, index) in activeCards"
						:key="item.indicatorName || index"
						class="gi-card"
					>
						<div class="gi-card-text" :title="formatValue(item.indicatorName)">
							{{ formatValue(item.indicatorName) }}
						</div>
						<strong>{{ formatValue(item.currentValue) }}</strong>
						<span>{{ formatValue(item.unit) }}</span>
						<p>
							同比
							<small :class="{ 'is-up': isYoyUp(item.yoyPercentage) }">
								<i v-if="hasValue(item.yoyPercentage)">
									{{ isYoyUp(item.yoyPercentage) ? '▲' : '▼' }}
								</i>
								{{ formatYoy(item) }}
							</small>
						</p>
					</div>
				</template>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import { monitoringData } from '@/api/EfficiencyCenter';
import router from '@/router';
import userStore from '@/stores/user';
import status from '@/stores/status';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

// GI 指标卡接口字段
interface GiIndicator {
	indicatorName?: string | number | null;
	currentValue?: string | number | null;
	unit?: string | number | null;
	yoyPercentage?: string | number | null;
	yoyUnit?: string | number | null;
}

// GI 监测数据接口结构
interface GiMonitoringData {
	indicators?: GiIndicator[];
}

// 全局年月筛选值
const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
const loading = ref(false);
// 当前展示的 GI 指标卡片
const activeCards = ref<GiIndicator[]>([]);
// 上一次请求的年月，避免重复请求

// 判断接口值是否可展示
const hasValue = (value: unknown) => value !== null && value !== undefined && value !== '';
// 格式化空值占位
const formatValue = (value: unknown) => (hasValue(value) ? String(value) : '--');

// 判断同比是否上升
const isYoyUp = (value: unknown) => Number(value) > 0;
// 格式化同比值和单位
const formatYoy = (item: GiIndicator) =>
	hasValue(item.yoyPercentage)
		? `${item.yoyPercentage}${hasValue(item.yoyUnit) ? item.yoyUnit : ''}`
		: '--';

// 根据年月查询 GI 监测数据
const getMonitoringData = async () => {
	const res = await monitoringData<GiMonitoringData>({ yearMonth: yearSelectValue.value });
	if (res?.code !== 0) {
		activeCards.value = [];
		return;
	}
	const list = res.data?.indicators;
	activeCards.value = Array.isArray(list) ? list : [];
};

const refreshData = async () => {
	loading.value = true;
	try {
		await getMonitoringData();
	} catch {
		// 请求失败：清空并展示暂无数据
		activeCards.value = [];
	} finally {
		loading.value = false;
	}
};

// 年月切换后刷新 GI 指标
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
const toGI = () => {
	userStore().setDateSelect(yearSelectValue.value); // 跳转指标仪表盘，同步日期筛选
	router.push({ name: 'efficiencyIndex' });
};
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
	grid-template-columns: minmax(0, 1fr) clamp(0.76rem, 4.8vw, 0.82rem);
	column-gap: 0.08rem;
}

.gi-card-grid {
	position: relative;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	grid-auto-rows: max-content;
	flex: 1 1 0;
	height: 0;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	padding-top: 0rem;
}

.gi-empty {
	grid-column: 1 / -1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100%;
	padding: 0.2rem 0;
}

.gi-empty-image {
	width: 1.8rem;
	height: auto;
	display: block;
}

.gi-empty-text {
	margin-top: 0.12rem;
	font-size: 0.16rem;
	font-weight: 600;
	color: #4e5969;
}

.gi-card {
	min-width: 0;
	border-radius: 0.05rem;
	background: url('../image/scene-card-bg.png') center / 100% 100% no-repeat;
	color: #42546a;
	padding: clamp(0.1rem, 1.5vh, 0.16rem) 0.1rem clamp(0.1rem, 1.5vh, 0.16rem)
		clamp(0.18rem, 1.6vw, 0.3rem);

	.gi-card-text {
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: 0.14rem;
		color: #1d2129;
		min-height: 0.36rem;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	strong {
		display: inline-block;
		margin-top: 0.04rem;
		font-family: DINAlternate, Arial, sans-serif;
		font-size: 0.18rem;
		color: #0578ff;
	}

	span {
		margin-left: 0.04rem;
		color: #536172;
	}

	p {
		display: flex;
		align-items: center;
		margin: 0.04rem 0 0;
		color: #6a7b90;
	}

	small {
		display: inline-flex;
		align-items: center;
		gap: 0.02rem;
		margin-left: 0.3rem;
		color: #ff5b5b;
		font-size: 0.11rem;
		font-weight: 500;

		&.is-up {
			color: #18b86c;
		}
	}

	i {
		font-style: normal;
		font-size: 0.1rem;
		line-height: 1;
	}
}
</style>
