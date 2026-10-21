<template>
	<TitleBody name="全市招商工作任务指标仪表盘">
		<template #extra>
			<SelectDate class="date-wrapper" :modelValue="dateValue" @change="handleDateChange" />
		</template>
		<div class="dashboard-container fx-c">
			<div class="overview-card">
				<div class="metric-item" v-for="item in metricsData" :key="item.label">
					<div class="metric-icon" :class="item.iconClass"></div>
					<div class="metric-content fx-w">
						<div class="metric-label">{{ item.label }}</div>
						<div class="metric-value-container">
							<div class="metric-value">
								{{ item.value }}
								<span class="metric-unit">{{ item.unit }}</span>
							</div>
							<!-- （趋势/环比） -->
							<div class="metric-helper" v-if="item.helper">
								<span class="helper-text">
									{{ item.helper.text }}
									<span
										:class="['helper-value', getUpDownClass(item.helper.value)]"
									>
										{{ formatPercentValue(item.helper.value) }}</span
									>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card-grid fx-h">
				<div class="box ov-y" v-if="cardData.length">
					<!-- 循环渲染卡片 -->
					<InvestmentCard
						v-for="item in cardData"
						:key="item.id"
						:data="item"
						@click="handleClick(item)"
						class="c-pointer"
					/>
				</div>
				<default-empty-container v-else />
			</div>
		</div>
	</TitleBody>
	<IndicatorDetailsDialog
		ref="indicatorDetailsDialogRef"
		:defaultDate="defaultDate"
		tabType="city"
	/>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';
import { EmptyConst, isEmpty } from '@/utils';
import InvestmentCard from '@/views/EfficiencyCenter/components/InvestmentCard.vue';
import { monitoringData } from '@/api/EfficiencyCenter';
import IndicatorDetailsDialog from '@/views/EfficiencyCenter/IndicatorDetailsPage/Dialog.vue';

const dateValue = ref('2026年1-3月');

const indicatorDetailsDialogRef = ref();
const store = useUserStore();
const defaultDate = computed(() => store.dateSelect);

// 显示+、-数字
const formatPercentValue = (value: any) => {
	if (isEmpty(value)) {
		return EmptyConst;
	}

	const num = Number(value);
	if (num > 0) {
		return `+${num}`;
	}
	if (num < 0) {
		return `${num}`; // 负数自带 - 号，无需额外拼接
	}
	return `${num}`; // 0 的情况
};

// (up、down)样式
const getUpDownClass = (value: any) => {
	if (isEmpty(value)) {
		return '';
	}

	const num = Number(value);
	return num >= 0 ? 'up' : 'down'; // 注意：0 通常归为 up 或 neutral
};
const initialMetricsData = [
	{ label: '考核指标总数', value: 0, unit: '个', iconClass: 'icon-chart' },
	{
		label: '红灯指标',
		value: 0,
		unit: '个',
		iconClass: 'icon-red-light',
		helper: { text: '较上期', value: 0 },
	},
	{
		label: '绿灯指标',
		value: 0,
		unit: '个',
		iconClass: 'icon-green-light',
		helper: { text: '较上期', value: 0 },
	},
	/*
	{
		label: '未亮灯指标',
		value: 0,
		unit: '个',
		iconClass: 'icon-gray-light',
		helper: { text: '较上期', value: 0 },
	},
	*/
];
const metricsData = ref<any[]>([...initialMetricsData]);

const cardData = ref<any[]>([]);

// 重置数据
const resetData = () => {
	// 直接替换整个数组，简单粗暴且安全
	metricsData.value = JSON.parse(JSON.stringify(initialMetricsData));
	cardData.value = []; // 卡片列表置空
};
const getMonitoringData = () => {
	// 先重置数据
	resetData();

	const params = {
		yearMonth: dateValue.value,
	};

	monitoringData(params)
		.then((res: any) => {
			if (res?.code === 0 && res?.data) {
				const { summary = {}, indicators = [] } = res.data || {};

				if (summary) {
					metricsData.value[0].value = summary.totalIndicators || 0;

					metricsData.value[1].value = summary.redLightIndicators || 0;
					metricsData.value[1].helper.value = summary.redLightChange || 0;

					metricsData.value[2].value = summary.greenLightIndicators || 0;
					metricsData.value[2].helper.value = summary.greenLightChange || 0;

					// metricsData.value[3].value = summary.unlitIndicators || 0;
					// metricsData.value[3].helper.value = summary.unlitChange || 0;
				}

				cardData.value = indicators;
			}
		})
		.catch(() => {
			// 网络报错，也保持空状态
			// eslint-disable-next-line no-console
			console.error('网络异常');
		});
};

const handleDateChange = (val: any) => {
	dateValue.value = val;
	getMonitoringData();
};

const handleClick = (item: any) => {
	indicatorDetailsDialogRef.value.show(item);
};
</script>

<style lang="less" scoped>
:deep(.header) {
	align-items: center;
	position: relative;
}
.date-wrapper {
	width: 2.36rem;
	top: 0;
}
.dashboard-container {
	height: 100%;
}
.overview-card {
	height: 1.68rem;
	background-image: url('@/assets/images/EfficiencyCenter/top-bg.png');
	background-size: 100% 100%;
	margin-bottom: 0.25rem;
	display: flex;
	align-items: center;
	padding: 0.25rem 0rem 0.21rem;

	.metric-item {
		display: flex;
		align-items: center;
		flex: 1;
		&:not(:last-child)::after {
			content: '';
			display: block;
			width: 0.01rem;
			height: 1.2rem;
			background: linear-gradient(
				180deg,
				rgba(180, 210, 255, 0) 0%,
				rgba(125, 166, 253, 1) 50%,
				rgba(180, 210, 255, 0) 100%
			);
			background-repeat: no-repeat;
		}
		&:last-child {
			flex: 2;
		}
	}

	/* 图标区域 */
	.metric-icon {
		width: 0.48rem;
		height: 0.48rem;
		margin: 0 0.16rem 0 0.43rem;
		background-size: contain;
		&.icon-chart {
			background-image: url('@/assets/images/EfficiencyCenter/icon-chart.png');
		}
		&.icon-red-light {
			background-image: url('@/assets/images/EfficiencyCenter/icon-red-light.png');
		}
		&.icon-green-light {
			background-image: url('@/assets/images/EfficiencyCenter/icon-green-light.png');
		}
		&.icon-gray-light {
			background-image: url('@/assets/images/EfficiencyCenter/icon-gray-light.png');
		}
	}

	.metric-label {
		font-weight: 500;
		font-size: 0.22rem;
		color: #202741;
		line-height: 0.3rem;
		padding-bottom: 0.09rem;
	}

	/* 辅助信息（较上期...） */
	.metric-value-container {
		display: flex;
		align-items: center;
	}

	/* 数值部分 */
	.metric-value {
		font-family: @number-font;
		font-weight: bold;
		font-size: 0.36rem;
		color: rgba(0, 0, 0, 0.85);
		line-height: 0.42rem;
	}

	.metric-unit {
		font-weight: 500;
		font-size: 0.16rem;
		color: #4e5969;
		line-height: 0.22rem;
		margin-left: 0.12rem;
	}

	.metric-helper {
		padding-left: 0.56rem;
		white-space: nowrap;
		font-weight: 400;
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.25rem;
	}

	.helper-value {
		padding-left: 0.06rem;
		&.up {
			color: #73aa76;
		}
		&.down {
			color: #d76a66;
		}
	}
}
.card-grid {
	width: 100%;
	background: #ffffff;
	border-radius: 0.14rem;
	border: 0.01rem solid;
	padding: 0.2rem 0rem 0.16rem 0.12rem;
	.box {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(3, 1fr);
		align-content: start;
		column-gap: 0.18rem;
		row-gap: 0.22rem;
		padding: 0.08rem 0.45rem 0.08rem 0.08rem;
	}
}
</style>
