<template>
	<div class="month-timeline">
		<div class="head-row">
			<el-select v-model="year" :teleported="false" class="year-select" size="small">
				<el-option v-for="y in yearOptions" :key="y" :label="`${y}年`" :value="y" />
			</el-select>
			<div class="legend">
				<div class="legend-item">
					<span class="dot visited"></span>
					<span>已拜访</span>
				</div>
				<div class="legend-item">
					<span class="dot pending"></span>
					<span>待拜访</span>
				</div>
			</div>
		</div>

		<div class="months">
			<div
				v-for="m in months"
				:key="m.month"
				class="month-cell"
				:class="{ active: m.month === selectedMonth, [m.status]: true }"
				@click="selectMonth(m.month)"
			>
				<div class="month-label">{{ m.month }}月</div>
				<div class="month-dot-wrap">
					<span class="dot" :class="m.status"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { MonthStatus } from '../types';

const props = defineProps<{
	modelValue: number;
	months: MonthStatus[];
	selectedMonth?: number;
}>();

const emit = defineEmits<{
	'update:modelValue': [val: number];
	'update:selectedMonth': [val: number];
}>();

const year = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
});

const yearOptions = computed(() => {
	const startYear = 2026;
	const list: number[] = [];
	for (let i = 0; i < 5; i += 1) list.push(startYear + i);
	return list;
});

const selectMonth = (month: number) => {
	emit('update:selectedMonth', month);
};
</script>

<style lang="less" scoped>
.month-timeline {
	.head-row {
		display: flex;
		align-items: center;
		gap: 0.16rem;
		margin-bottom: 0.16rem;

		.year-select {
			width: 1.14rem;
			:deep(.el-select__wrapper) {
				box-shadow: none;
				background: #f7f9fe;
				padding: 0;
				padding-right: 0.12rem;
				padding-left: 0.12rem;
				border-radius: 0.08rem;
				text-align: center;
				.el-select__placeholder {
					color: rgba(0, 0, 0, 0.9);
					font-size: 0.16rem;
					font-weight: 500;
				}
				.el-select__selection {
					gap: 0;
				}
			}
			:deep(.el-select__suffix .el-icon) {
				color: rgba(0, 0, 0, 0.9);
				font-size: 0.2rem;
				font-weight: 500;
				gap: 0;
			}
		}
		.legend {
			margin-left: auto;
			display: flex;
			gap: 0.24rem;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.65);

			.legend-item {
				display: flex;
				align-items: center;
				gap: 0.08rem;
			}
		}
	}

	.months {
		display: flex;
		justify-content: space-between;

		.month-cell {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 0.08rem 0;
			border-radius: 0.04rem;
			height: 0.48rem;
			width: 0.48rem;
			background: #f7f9fe;
			border-radius: 50%;
			position: relative;
			cursor: pointer;
			.month-label {
				font-size: 0.16rem;
				color: rgba(0, 0, 0, 0.9);
				line-height: 0.26rem;
				font-weight: 500;
			}
			.month-dot-wrap {
				position: absolute;
				bottom: 0.14rem;
				height: 0.07rem;
				width: 0.07rem;
				.dot {
					width: 0.07rem;
					height: 0.07rem;
				}
			}
			&.active {
				border: 0.01rem solid #165dff;
				.month-label {
					color: #165dff;
				}
				&.visited {
					border: 0.01rem solid #17ba7f;

					.month-label {
						color: #17ba7f;
					}
				}
				&.pending {
					border: 0.01rem solid #ff7a45;
					.month-label {
						color: #ff7a45;
					}
				}
			}
		}
	}

	.dot {
		display: inline-block;
		width: 0.1rem;
		height: 0.1rem;
		border-radius: 50%;
		&.visited {
			background: #17ba7f;
		}
		&.pending {
			background: #fe793b;
		}
		&.empty {
			background: transparent;
		}
	}
}
</style>