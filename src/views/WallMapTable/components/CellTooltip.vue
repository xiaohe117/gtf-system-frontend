<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-08-13 14:36:04
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-23 14:02:40
-->
<template>
	<el-tooltip
		class="box-item"
		effect="dark"
		:disabled="hideToolTip || isExpanded"
		:content="text"
		placement="top"
		popper-class="wallmap-ellipsis-text-popper"
		@show="updateContentMaxHeight"
	>
		<template #content>
			<div
				class="ellipsis-text-content"
				v-html="text"
				:style="{ maxHeight: contentMaxHeight }"
			></div>
		</template>
		<div ref="parentRef" :class="{ 'text-ellipsis': !isExpanded, 'open-content': isExpanded }">
			<span class="text">
				{{ text }}
			</span>
			<!-- 计算宽度元素，不显示 -->
			<span class="calc-dom" ref="childRef" v-if="!hideChild">
				{{ text }}
			</span>
		</div>
	</el-tooltip>
</template>
<script lang="ts" setup>
/* eslint-disable */
import { statusOption } from '../TableList/data';
import dayjs from 'dayjs';

const props = defineProps({
	value: {
		type: [String, Array],
		default: '',
	},
	col: {
		type: Object,
		default: () => ({}),
	},
	row: {
		type: Object,
		default: () => ({}),
	},
	isExpanded: {
		type: Boolean,
		default: false,
	},
});
const isArrayContent = computed(() => Array.isArray(props.value as any));
const text = computed(() => {
	let str: any = '';
	if (isArrayContent.value) {
		str = (props.value as any).join('\n').replace(/\n{2,}/g, '\n');
	} else {
		str = props.value;
	}
	const div = document.createElement('div');
  	div.innerHTML = str;
	let content = div.textContent || '';
	// if (content.length > 300) {
	// 	content = content.substring(0, 300) + '...';
	// }
	return content
});

const hideToolTip = ref(true);
const parentRef = ref();
const childRef = ref();
const hideChild = ref(false);

// popper 内容最大高度：动态按容器距屏幕边缘的可用空间计算，避免超出屏幕
const contentMaxHeight = ref('80vh');

const updateContentMaxHeight = () => {
	const el = parentRef.value;
	if (!el) return;
	const rect = el.getBoundingClientRect();
	const margin = 30;
	// placement 固定为 top：不超过容器距屏幕上方的距离
	const maxHeight = rect.top - margin;
	// 兜底下限：至少容纳一行文字的高度，避免仅一行内容也出现滚动条
	const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
	contentMaxHeight.value = `${Math.max(0, maxHeight, lineHeight)}px`;
};

const getShowTooltip = () => {
	hideChild.value = false;
	nextTick(() => {
		hideToolTip.value = parentRef.value.clientWidth > childRef.value.clientWidth;
		hideChild.value = true;
	});
};
getShowTooltip();
watch(
	() => props.value,
	() => {
		getShowTooltip();
	},
	{ deep: true }
);

</script>
<style lang="less">
.wallmap-ellipsis-text-popper{
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
<style lang="less" scoped>

.open-content {
	.text {
		white-space: pre-wrap;
	}
}

.calc-dom {
	display: inline-block;
	position: absolute;
	opacity: 0;
	left: 0;
	z-index: -1;
	pointer-events: none;
}
.status {
	display: inline-block;
	width: 0.55rem;
	height: 0.22rem;
	line-height: 0.22rem;
	border-radius: 0.03rem;
	text-align: center;
	color: #fff;
}
.general {
	position: absolute;
	bottom: 0.08rem;
	left: 0.08rem;
	width: calc(100% - 0.16rem);
	.box {
		background: linear-gradient(180deg, #f1f7ff 0%, #dfecff 100%);
		border-radius: 0.25rem;
		font-size: 0.14rem;
		padding: 0 0.08rem;
		height: 0.32rem;
		line-height: 0.28rem;
		display: inline-block;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		max-width: 100%;
	}
	.date {
		color: rgba(0, 0, 0, 0.6);
		margin-right: 0.04rem;
		min-width: calc(100% - 0.5rem);
	}
	.num {
		color: #3489ff;
		cursor: pointer;
	}
}
</style>