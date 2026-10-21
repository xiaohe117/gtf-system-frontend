<template>
	<div class="step-bar">
		<div
			v-for="(item, index) in steps"
			:key="index"
			class="step-item"
			:class="{
				active: modelValue === item.value,
				completed: item.value < modelValue,
			}"
			@click="handleClick(item)"
		>
		<div class="step-dot-wrapper">
			<div
				class="step-line"
				:class="{
					'step-line-hidden': index === 0,
					'step-line-active': item.value <= modelValue,
				}"
			></div>
			<div class="step-dot"></div>
			<div
				class="step-line"
				:class="{
					'step-line-hidden': index === steps.length - 1,
					'step-line-active': item.value < modelValue,
				}"
			></div>
		</div>
			<div class="step-label">{{ item.name }}</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
defineProps({
	steps: {
		type: Array as () => { name: string; value: number }[],
		default: () => [],
	},
	modelValue: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleClick = (val: any) => {
	emit('update:modelValue', val.value);
	emit('change', val);
};
</script>
<style lang="less" scoped>
.step-bar {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 0.16rem 0.24rem;
	background: #fff;

	.step-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		position: relative;

		.step-dot-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			position: relative;
		}

		.step-line {
			flex: 1;
			height: 0.01rem;
			background: rgba(0, 0, 0, 0.9);
		}

		.step-line-hidden {
			visibility: hidden;
		}

		.step-line-active {
			background: #0052D9 !important;
		}

		.step-dot {
			width: 0.08rem;
			height: 0.08rem;
			border-radius: 50%;
			border: 0.02rem solid rgba(0, 0, 0, 0.9);
			margin: 0 0.04rem;
			flex-shrink: 0;
			transition: all 0.2s;
		}

		.step-label {
			margin-top: 0.08rem;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: .18rem;
			color: rgba(0, 0, 0, 0.9);
			line-height: .24rem;
		}

		&.active {
			.step-dot {
				background: #0052D9;
				border-color: #0052D9;
			}

			.step-label {
				color: #0052D9;
				font-weight: 600;
			}
		}

		&.completed {
			.step-dot {
				border-color: #0052D9;
			}
		}

		&:hover {
			.step-label {
				color: #0052D9;
			}
		}
	}
}
</style>
