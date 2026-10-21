<template>
	<div class="stage-metrics">
		<template v-for="(row, index) in rows" :key="index">
			<div class="metrics-line col-left">
				<span class="metric-label">{{ row.left.label }}：</span>
				<span class="metric-value">{{ row.left.value }}</span>
				<span v-if="row.left.unit" class="metric-unit">{{ row.left.unit }}</span>
			</div>
			<div class="metrics-line col-middle">
				<span v-if="row.left.suffix" class="metric-suffix">{{ row.left.suffix }}</span>
			</div>
			<div class="metrics-line col-right">
				<span class="metric-label">{{ row.right.label }}：</span>
				<span class="metric-value">{{ row.right.value }}</span>
				<span v-if="row.right.unit" class="metric-unit">{{ row.right.unit }}</span>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface MetricItem {
	label: string;
	value: string;
	unit?: string;
	change?: string;
}

const props = defineProps<{
	items: MetricItem[];
}>();

const rows = computed(() => {
	const list = props.items ?? [];
	return [
		{
			left: { ...list[0], suffix: list[0]?.change },
			right: list[1],
		},
		{
			left: { ...list[2], suffix: list[2]?.change },
			right: list[3],
		},
	].filter((row) => row.left && row.right);
});
</script>

<style lang="less" scoped>
.stage-metrics {
	container-type: inline-size;
	box-sizing: border-box;
	display: grid;
	/* 左/中紧凑，右侧多留空间；minmax(0) 防止撑出卡片被裁切 */
	grid-template-columns: minmax(0, 0.9fr) minmax(0, 0.78fr) minmax(0, 1.32fr);
	grid-auto-rows: auto;
	align-items: baseline;
	column-gap: 0.02rem;
	row-gap: 0.04rem;
	width: 100%;
	min-width: 0;
	height: 0.66rem;
	margin-bottom: 0.02rem;
	padding: 0.05rem 0.03rem;
	background: url('@/assets/images/investmentFullProcess/long-rect-bg.png') center / 100% 100%
		no-repeat;
}

.metrics-line {
	display: flex;
	align-items: baseline;
	justify-content: flex-start;
	min-width: 0;
	max-width: 100%;
	white-space: nowrap;
}

.col-left,
.col-middle,
.col-right {
	justify-self: start;
	width: 100%;
	min-width: 0;
}

.metric-label {
	font-weight: 500;
	font-size: 0.13rem;
	line-height: 0.16rem;
	color: #333333;
	flex-shrink: 0;
}

.metric-value {
	font-weight: bold;
	font-size: 0.15rem;
	line-height: 0.21rem;
	color: #165dff;
	flex-shrink: 0;
}

.col-right {
	.metric-label {
		font-size: 0.12rem;
	}

	.metric-value {
		font-size: 0.14rem;
		line-height: 0.2rem;
	}

	.metric-unit {
		font-size: 0.1rem;
		line-height: 0.17rem;
	}
}

.metric-unit {
	margin-left: 0.01rem;
	font-weight: 500;
	font-size: 0.1rem;
	line-height: 0.17rem;
	color: rgba(0, 0, 0, 0.6);
	flex-shrink: 0;
}

.metric-suffix {
	font-weight: 600;
	font-size: 0.12rem;
	line-height: 0.17rem;
	color: #165dff;
	flex-shrink: 0;
}

@container (max-width: 3.5rem) {
	.stage-metrics {
		padding: 0.06rem 0.04rem;
	}

	.metric-label {
		font-size: 0.12rem;
	}

	.metric-value {
		font-size: 0.14rem;
	}

	.col-right .metric-value {
		font-size: 0.13rem;
	}

	.metric-suffix,
	.metric-unit {
		font-size: 0.1rem;
	}

	.col-right .metric-unit {
		font-size: 0.1rem;
	}
}

@container (max-width: 3.2rem) {
	.metric-label {
		font-size: 0.11rem;
	}

	.metric-value {
		font-size: 0.13rem;
	}

	.col-right .metric-value {
		font-size: 0.12rem;
	}

	.metric-suffix,
	.metric-unit {
		font-size: 0.09rem;
	}

	.col-right .metric-unit {
		font-size: 0.09rem;
	}
}
</style>
