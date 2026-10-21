<template>
	<div class="adv-tabs-wrap">
		<div class="adv-tabs-list">
			<div class="adv-tabs-scroll" ref="tabsWrapRef" @scroll="updateArrowTop">
				<div
					v-for="(tab, idx) in tabs"
					:key="tab.id"
					class="adv-tab-item"
					:class="{
						'adv-tab-active': activeIdx === idx,
						'adv-tab-disabled': tab.disabled,
					}"
					@click="onTabClick(idx, tab.disabled)"
					@mouseenter="emit('pause')"
					@mouseleave="emit('resume')"
				>
					<span class="adv-tab-label">{{ tab.title }}</span>
				</div>
			</div>
		</div>
		<img
			v-if="activeIdx >= 0 && arrowVisible"
			src="@/assets/images/industry/title-arrow-av.webp"
			class="adv-tab-arrow"
			:style="{ top: arrowTop }"
			alt=""
		/>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import type { AdvTabItem } from '../type';

const props = withDefaults(
	defineProps<{
		tabs: AdvTabItem[];
		activeIdx?: number;
	}>(),
	{
		activeIdx: 0,
	}
);

const emit = defineEmits<{
	'update:activeIdx': [idx: number];
	pause: [];
	resume: [];
}>();

const tabsWrapRef = ref<HTMLElement | null>(null);
const arrowTop = ref('0.24rem');
const arrowVisible = ref(true);

const updateArrowTop = () => {
	const wrap = tabsWrapRef.value;
	if (!wrap) return;
	const activeEl = wrap.querySelector('.adv-tab-active') as HTMLElement | null;
	if (!activeEl) return;
	const center = activeEl.offsetTop - wrap.scrollTop + activeEl.offsetHeight / 2;
	arrowTop.value = `${center}px`;
	// 箭头中心点超出可视区域则隐藏
	arrowVisible.value = center >= 0 && center <= wrap.clientHeight;
};

const scrollActiveTabIntoView = () => {
	const wrap = tabsWrapRef.value;
	if (!wrap) return;
	const activeEl = wrap.querySelector('.adv-tab-active') as HTMLElement | null;
	if (!activeEl) return;
	const wrapRect = wrap.getBoundingClientRect();
	const elRect = activeEl.getBoundingClientRect();
	if (elRect.top < wrapRect.top) {
		wrap.scrollTop += elRect.top - wrapRect.top - 0.04;
	} else if (elRect.bottom > wrapRect.bottom) {
		wrap.scrollTop += elRect.bottom - wrapRect.bottom + 0.04;
	}
	nextTick(updateArrowTop);
};

watch(
	() => props.activeIdx,
	() => {
		nextTick(() => scrollActiveTabIntoView());
	}
);

/** 点击 tab：禁用状态下不响应 */
const onTabClick = (idx: number, disabled?: boolean) => {
	if (disabled) return;
	emit('update:activeIdx', idx);
	nextTick(() => scrollActiveTabIntoView());
};
</script>

<style lang="less" scoped>
.adv-tabs-wrap {
	position: relative;
	overflow: visible;
	flex-shrink: 0;
	align-self: stretch;
}

.adv-tabs-list {
	width: 2.12rem;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	box-sizing: border-box;
	border-radius: 0.08rem;
	border: 0.01rem solid rgba(22, 93, 255, 1);
}

.adv-tabs-scroll {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;

	&::-webkit-scrollbar {
		width: 0.03rem;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(43, 124, 255, 0.2);
		border-radius: 0.02rem;
	}
}

.adv-tab-item {
	position: relative;
	height: 0.46rem;
	display: flex;
	align-items: center;
	padding: 0 0.16rem 0 0.24rem;
	cursor: pointer;
	transition: all 0.25s ease;
	box-sizing: border-box;
	flex-shrink: 0;

	.adv-tab-label {
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: 0.18rem;
		color: #202741;
		transition: color 0.25s ease;
	}

	&.adv-tab-active {
		background: linear-gradient(270deg, rgba(91, 143, 249, 0.5) 0%, #165dff 100%);
		border-radius: 0.04rem;

		.adv-tab-label {
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 600;
			font-size: 0.18rem;
			color: #ffffff;
		}
	}

	&:hover:not(.adv-tab-active) {
		background: rgba(43, 124, 255, 0.08);
		border-color: rgba(43, 124, 255, 0.35);
	}

	&.adv-tab-disabled {
		cursor: not-allowed;
		opacity: 0.45;

		.adv-tab-label {
			color: #999;
		}

		&:hover {
			background: transparent;
			border-color: transparent;
		}
	}
}

.adv-tab-arrow {
	position: absolute;
	left: 2.1rem;
	transform: translateY(-50%);
	height: 0.24rem;
	width: auto;
	z-index: 10;
	pointer-events: none;
}
</style>
