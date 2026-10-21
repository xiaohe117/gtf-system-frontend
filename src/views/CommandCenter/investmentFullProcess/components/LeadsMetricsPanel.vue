<template>
	<div class="long-metrics leads-metrics">
		<div class="leads-row leads-row-top">
			<div class="metrics-group group-total">
				<span class="metric-label">总线索：</span>
				<span class="metric-value">{{ row1.left.value }}</span>
				<span v-if="row1.left.unit" class="metric-unit">{{ row1.left.unit }}</span>
			</div>
			<img
				class="leads-connector"
				src="@/assets/images/investmentFullProcess/meeting-arrow.png"
				alt=""
			/>
			<div class="metrics-group group-valid">
				<span class="metric-label">有效：</span>
				<span class="metric-value">{{ row1.right.value }}</span>
				<span v-if="row1.right.unit" class="metric-unit">{{ row1.right.unit }}</span>
				<span v-if="row1.right.suffix" class="metric-suffix">{{ row1.right.suffix }}</span>
			</div>
		</div>
		<div class="leads-row leads-row-bottom">
			<div class="metrics-group group-weekly">
				<div class="weekly-label-block">
					<div class="label-lines">
						<span>本周新增</span>
						<span>有效线索</span>
					</div>
					<span class="label-colon">：</span>
				</div>
				<div class="weekly-value-block">
					<span class="metric-value">{{ row2.left.value }}</span>
					<span v-if="row2.left.unit" class="metric-unit">{{ row2.left.unit }}</span>
					<span v-if="row2.left.suffix" class="metric-suffix">{{
						row2.left.suffix
					}}</span>
				</div>
			</div>
			<div class="metrics-group group-invest">
				<span class="metric-label">意向投资额：</span>
				<span class="metric-value">{{ row2.right.value }}</span>
				<span v-if="row2.right.unit" class="metric-unit">{{ row2.right.unit }}</span>
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

const row1 = computed(() => ({
	left: props.items[0],
	right: { ...props.items[1], suffix: props.items[1]?.change },
}));

const row2 = computed(() => ({
	left: { ...props.items[2], suffix: props.items[2]?.change },
	right: props.items[3],
}));
</script>

<style lang="less" scoped>
@import './longRectMetrics.less';

.leads-metrics {
	gap: 0.04rem;
	padding: 0.06rem 0.05rem;
	min-width: 0;
}

.leads-row {
	display: flex;
	align-items: center;
	width: 100%;
	min-width: 0;
}

.leads-row-top {
	justify-content: flex-start;
	gap: 0.02rem;
}

.leads-row-bottom {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	column-gap: 0.04rem;
}

.leads-connector {
	flex-shrink: 0;
	width: 0.3rem;
	height: 0.11rem;
	margin: 0 0.02rem;
	object-fit: contain;
}

.metrics-group {
	display: flex;
	align-items: baseline;
	flex-shrink: 0;
	min-width: 0;
}

.group-total .metric-label {
	width: 0.7rem;
}

.group-valid .metric-label {
	width: 0.44rem;
}

.group-weekly {
	align-items: center;
	gap: 0.02rem;
	min-width: 0;
}

.weekly-label-block {
	width: 0.7rem;
	display: flex;
	align-items: center;
	flex-shrink: 0;
}

.label-lines {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	font-weight: 500;
	font-size: 0.14rem;
	line-height: 0.16rem;
	color: #333333;
	white-space: nowrap;
}

.label-colon {
	flex-shrink: 0;
	font-weight: 500;
	font-size: 0.14rem;
	line-height: 0.16rem;
	color: #333333;
}

.weekly-value-block {
	display: flex;
	align-items: center;
	flex-shrink: 1;
	min-width: 0;

	.metric-suffix {
		font-size: 0.12rem;
	}
}

.group-invest {
	align-items: center;
	flex: 1;
	min-width: 0;
	overflow: hidden;

	.metric-label {
		width: auto;
		flex-shrink: 0;
	}

	.metric-value,
	.metric-unit {
		flex-shrink: 0;
	}
}

.metric-label {
	font-weight: 500;
	font-size: 0.14rem;
	line-height: 0.16rem;
	color: #333333;
	text-align: right;
	white-space: nowrap;
}

.metric-value {
	font-weight: bold;
	font-size: 0.17rem;
	line-height: 0.23rem;
	color: #165dff;
}

.metric-unit {
	margin-left: 0.02rem;
	padding: 0;
	font-weight: 400;
	font-size: 0.14rem;
	line-height: 0.16rem;
	color: rgba(0, 0, 0, 0.6);
}

.metric-suffix {
	margin-left: 0.02rem;
	padding: 0;
	font-weight: 400;
	font-size: 0.14rem;
	line-height: 0.16rem;
	color: #165dff;
	white-space: nowrap;
}
</style>
