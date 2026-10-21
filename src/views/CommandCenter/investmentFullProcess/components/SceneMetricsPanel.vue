<template>
	<div class="long-metrics scene-metrics">
		<div v-for="(row, rowIndex) in rows" :key="rowIndex" class="metrics-row scene-metrics-row">
			<div
				v-for="(item, colIndex) in row"
				:key="`${item.label}-${colIndex}`"
				class="metrics-group scene-metrics-group"
				:class="`scene-col-${colIndex}`"
			>
				<span class="metric-label">{{ item.label }}：</span>
				<span class="metric-value">{{ item.value }}</span>
				<span v-if="item.unit" class="metric-unit">{{ item.unit }}</span>
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
}

const props = defineProps<{
	items: MetricItem[];
}>();

const rows = computed(() => {
	const list = props.items ?? [];
	return [list.slice(0, 3), list.slice(3, 6)];
});
</script>

<style lang="less" scoped>
@import './longRectMetrics.less';

.scene-metrics {
	padding: 0 0.08rem;
	box-sizing: border-box;
}

.scene-metrics-row {
	justify-content: space-between;
	gap: 0.12rem;
}

.scene-metrics-group {
	justify-content: flex-start;
	min-width: 0;
	gap: 0;
}

.scene-metrics-group .metric-value,
.scene-metrics-group .metric-unit {
	margin-left: 0;
	padding: 0;
}

/* 左 / 中差不多宽，右列略短 */
.scene-col-0 {
	flex: 1.05 1 0;
}

.scene-col-1 {
	flex: 1.1 1 0;
}

.scene-col-2 {
	flex: 0.85 1 0;
}

.scene-col-0 .metric-label,
.scene-col-1 .metric-label,
.scene-col-2 .metric-label {
	width: auto;
	min-width: 0;
	flex-shrink: 0;
}
</style>
