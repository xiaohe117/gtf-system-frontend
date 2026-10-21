<template>
	<div class="tag-list" ref="wrapRef">
		<span class="tag-item" v-for="(tag, index) in visibleList" :key="index">{{ tag }}</span>
		<el-tooltip
			popper-class="tag-list-tooltip"
			v-if="hiddenList.length > 0"
			placement="top"
			effect="light"
		>
			<template #content>
				<span class="tag-item" v-for="(tag, index) in hiddenList" :key="index">{{
					tag
				}}</span>
			</template>
			<span class="tag-more" v-if="hiddenList.length > 0"
				>+{{ hiddenList.length }}</span
			>
		</el-tooltip>
		<!-- 隐藏测量副本：渲染全部标签用于宽度计算 -->
		<span class="tag-list-measure" ref="measureRef" aria-hidden="true">
			<span class="tag-item" v-for="(tag, index) in tags" :key="index">{{ tag }}</span>
			<span class="tag-more more-measure" ref="moreMeasureRef"></span>
		</span>
	</div>
</template>

<script lang="ts" setup>
import { getSize } from '@/utils';

const props = withDefaults(defineProps<{ tags?: string[] }>(), { tags: () => [] });

const wrapRef = ref<HTMLElement>();
const measureRef = ref<HTMLElement>();
const moreMeasureRef = ref<HTMLElement>();

const visibleCount = ref(props.tags.length);

const visibleList = computed(() => props.tags.slice(0, visibleCount.value));
const hiddenList = computed(() => props.tags.slice(visibleCount.value));


// 标签间 margin（tag-item margin-right / tag-more margin-left 均为 0.04rem）的像素值
const getGapPx = () => getSize(4);

// 依据容器宽度计算可见标签数量
const calcVisible = () => {
	if (!wrapRef.value || !measureRef.value || !moreMeasureRef.value) return;
	const wrapWidth = wrapRef.value.clientWidth;
	const tags = Array.from(
		measureRef.value.querySelectorAll<HTMLElement>('.tag-item:not(.more-measure)')
	);
	if (tags.length === 0) {
		visibleCount.value = 0;
		return;
	}
	const gapPx = getGapPx();
	const moreMeasure = moreMeasureRef.value;
	// 逐个标签累加宽度，每步为剩余标签实测“+N”占位宽度（含其 margin-left），避免溢出
	let total = 0;
	let count = 0;
	for (let i = 0; i < tags.length; i += 1) {
		const remain = tags.length - i - 1;
		if (remain > 0) {
			// 动态设置“+N”文本并读取实测宽度
			moreMeasure.textContent = `+${remain}`;
			const moreW = moreMeasure.offsetWidth + gapPx;
			if (total + tags[i].offsetWidth + gapPx + moreW > wrapWidth) break;
		} else if (total + tags[i].offsetWidth + gapPx > wrapWidth) {
			break;
		}
		total += tags[i].offsetWidth + gapPx;
		count += 1;
	}
	visibleCount.value = Math.max(count, 0);
};

let observer: ResizeObserver | null = null;

onMounted(() => {
	calcVisible();
	observer = new ResizeObserver(() => calcVisible());
	if (wrapRef.value) {
		observer.observe(wrapRef.value);
	}
});

onBeforeUnmount(() => {
	observer?.disconnect();
	observer = null;
});

watch(
	() => props.tags,
	() => {
		nextTick(calcVisible);
	},
	{ deep: true }
);
</script>

<style scoped lang="less">
.tag-list {
	position: relative;
	display: flex;
	align-items: center;
	overflow: hidden;
	flex-shrink: 0;
	max-width: 70%;

	.tag-more {
		margin-left: 0.04rem;
        color: #165dff;
        font-size: 0.16rem;
	}

	.tag-list-measure {
		position: absolute;
		top: 0;
		left: 0;
		visibility: hidden;
		pointer-events: none;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}
}
.tag-item {
	flex-shrink: 0;
	font-family: PingFangSC, PingFang SC;
	font-weight: 500;
	font-size: 0.14rem;
	color: #00c462;
	line-height: 0.24rem;
	padding: 0 0.1rem;
	border: 0.01rem solid #00c462;
	border-radius: 0.15rem;
	min-width: 0.76rem;
	text-align: center;
	margin-right: 0.04rem;
}
</style>
