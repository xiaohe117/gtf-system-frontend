<template>
	<div class="long-metrics">
		<div v-for="(row, index) in rows" :key="index" class="metrics-row">
			<div class="metrics-group group-left">
				<span class="metric-label">{{ row.left.label }}：</span>
				<span class="metric-value">{{ row.left.value }}</span>
				<span v-if="row.left.unit" class="metric-unit">{{ row.left.unit }}</span>
			</div>
			<img
				class="meeting-arrow"
				src="@/assets/images/investmentFullProcess/meeting-arrow.png"
				alt=""
			/>
			<div class="metrics-group group-right">
				<span class="metric-label">{{ row.right.label }}：</span>
				<span class="metric-value">{{ row.right.value }}</span>
				<span v-if="row.right.unit" class="metric-unit">{{ row.right.unit }}</span>
				<span v-if="row.right.suffix" class="metric-suffix">{{ row.right.suffix }}</span>
			</div>
		</div>
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
			left: list[0],
			right: { ...list[1], suffix: list[1]?.change },
		},
		{
			left: list[2],
			right: { ...list[3], suffix: list[3]?.change },
		},
	].filter((row) => row.left && row.right);
});
</script>

<style lang="less" scoped>
@import './longRectMetrics.less';

/* 占比文案跟阶段卡「线索转化」字号对齐 */
.metric-suffix {
	font-size: 0.14rem;
	line-height: 0.23rem;
	padding: 0 0.02rem;
}
</style>
