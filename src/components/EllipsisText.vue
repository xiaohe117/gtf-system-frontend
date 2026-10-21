/** */ * EllipsisText 组件用于显示带有省略号的文本内容。ai生成 *
当文本内容超过指定的行数时，会自动显示省略号，并通过工具提示显示完整内容。 * * Props: * - text:
要显示的文本内容。 * - lines: 显示的最大行数，超过该行数时显示省略号，默认为3。 * - placement:
工具提示的位置，默认为'top'。 * - showAfter: 工具提示显示的延迟时间，默认为200毫秒。 */
<template>
	<el-tooltip
		:disabled="!shouldShowTooltip"
		:content="text"
		:placement="placement"
		:popper-style="{ whiteSpace: 'pre-line' }"
		raw-content
		:show-after="showAfter"
		:teleported="teleported"
		popper-class="ellipsis-text-popper"
		@show="updateContentMaxHeight"
	>
		<template #content>
			<div
				class="ellipsis-text-content"
				v-html="text"
				:style="{ maxHeight: contentMaxHeight }"
			></div>
		</template>
		<div ref="containerRef" class="ellipsis-text" v-bind="$attrs">
			<slot />
			{{ text }}
		</div>
	</el-tooltip>
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils';

const props = withDefaults(
	defineProps<{
		text: string;
		lines?: number;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		showAfter?: number;
		teleported?: boolean;
	}>(),
	{
		lines: 3,
		placement: 'top',
		showAfter: 200,
		teleported: true,
	}
);

// 注意：如果使用 v-bind="$attrs"，需关闭 inheritAttrs（否则 class 会重复）
defineOptions({
	inheritAttrs: false,
});

// 👇 关键：把 lines 暴露给 CSS
const clampLines = computed(() => props.lines);

// ...其余逻辑不变（checkOverflow、ResizeObserver 等）
const containerRef = ref<HTMLElement | null>(null);
const shouldShowTooltip = ref(false);

// popper 内容最大高度：动态按容器距屏幕边缘的可用空间计算，避免超出屏幕
const contentMaxHeight = ref('80vh');

const updateContentMaxHeight = () => {
	const el = containerRef.value;
	if (!el) return;
	const rect = el.getBoundingClientRect();
	const margin = 30;
	// top 方向：不超过容器距屏幕上方的距离；bottom 方向：不超过容器距屏幕下方的距离
	const maxHeight =
		props.placement === 'bottom'
			? window.innerHeight - rect.bottom - margin
			: rect.top - margin;
	contentMaxHeight.value = `${Math.max(0, maxHeight)}px`;
};

const checkOverflow = () => {
	const el = containerRef.value;
	if (!el || isEmpty(props.text)) {
		shouldShowTooltip.value = false;
		return;
	}
	updateContentMaxHeight();
	// eslint-disable-next-line no-void
	void el.offsetWidth;
	shouldShowTooltip.value = el.scrollHeight > el.clientHeight;
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
	checkOverflow();
	if (typeof ResizeObserver !== 'undefined') {
		resizeObserver = new ResizeObserver(checkOverflow);
		if (containerRef.value) {
			resizeObserver.observe(containerRef.value);
		}
	} else {
		window.addEventListener('resize', checkOverflow);
	}
});

onBeforeUnmount(() => {
	if (resizeObserver) resizeObserver.disconnect();
	else window.removeEventListener('resize', checkOverflow);
});

watch(() => props.text, checkOverflow);
</script>

<style scoped lang="less">
.ellipsis-text {
	width: 100%;
	line-height: 1.5;
	word-wrap: break-word;
	// white-space: normal;
	white-space: pre-line; // 07-23 现在要求显示换行符号

	// ✅ 动态行数！
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: v-bind(clampLines); // ←←← 核心！
}
</style>
<style lang="less">
.ellipsis-text-popper {
	max-width: 95vw !important;
	line-height: 0.24rem !important;
	.ellipsis-text-content {
		// 内容过长时限制高度并允许滚动，避免 popper 超出屏幕被遮挡
		max-height: 80vh;
		overflow-y: auto;
		// 用相对行高：固定 rem 行高在小屏（<1920 设计稿）下会小于字号，
		// 字形溢出行盒导致一行内容也出现滚动条
		line-height: 1.5;
	}
}
</style>