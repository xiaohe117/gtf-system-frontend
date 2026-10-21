<template>
	<div class="process-node">
		<div class="node-stack">
			<img
				class="process-under"
				src="@/assets/images/investmentFullProcess/process-under.png"
				alt=""
			/>
			<div class="ball-wrap">
				<img
					class="process-ball"
					src="@/assets/images/investmentFullProcess/process-ball.png"
					alt=""
				/>
				<span class="node-label" :class="{ multiline: compact }">{{ label }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import {
	NODE_WIDTH,
	NODE_HEIGHT,
	NODE_BALL_WIDTH,
	NODE_BALL_HEIGHT,
	NODE_UNDER_WIDTH,
	NODE_UNDER_HEIGHT,
} from '../processLayout';

defineProps<{
	label: string;
	compact?: boolean;
}>();

const layoutFit = inject<Ref<number>>('investmentLayoutFit', ref(1));

const scaleRem = (value: string) => {
	const num = Number.parseFloat(value);
	if (Number.isNaN(num)) return value;
	return `${num * layoutFit.value}rem`;
};

const nodeWidth = computed(() => scaleRem(NODE_WIDTH));
const nodeHeight = computed(() => scaleRem(NODE_HEIGHT));
const nodeBallWidth = computed(() => scaleRem(NODE_BALL_WIDTH));
const nodeBallHeight = computed(() => scaleRem(NODE_BALL_HEIGHT));
const nodeUnderWidth = computed(() => scaleRem(NODE_UNDER_WIDTH));
const nodeUnderHeight = computed(() => scaleRem(NODE_UNDER_HEIGHT));
const nodeLabelSize = computed(() => scaleRem('0.2rem'));
const nodeLabelLineHeight = computed(() => scaleRem('0.24rem'));
</script>

<style lang="less" scoped>
.process-node {
	display: flex;
	justify-content: center;
	flex-shrink: 0;
}

.node-stack {
	position: relative;
	z-index: 1;
	width: v-bind(nodeWidth);
	height: v-bind(nodeHeight);
	cursor: pointer;
	overflow: visible;
}

.process-under {
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	display: block;
	width: v-bind(nodeUnderWidth);
	height: v-bind(nodeUnderHeight);
	object-fit: contain;
	pointer-events: none;
}

.ball-wrap {
	position: absolute;
	top: 0;
	left: 50%;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	width: v-bind(nodeBallWidth);
	height: v-bind(nodeBallHeight);
	transform: translateX(-50%);
	transition: transform 0.28s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.process-ball {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.node-label {
	position: relative;
	z-index: 1;
	font-family: AlimamaShuHeiTi;
	font-weight: bold;
	font-size: v-bind(nodeLabelSize);
	color: #ffffff;
	line-height: v-bind(nodeLabelLineHeight);
	text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
	text-align: center;
	font-style: normal;
	white-space: nowrap;

	&.multiline {
		white-space: pre-line;
	}
}
</style>
