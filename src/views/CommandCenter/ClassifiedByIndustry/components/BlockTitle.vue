<template>
	<div class="block-title">
		<div class="title-top">
			<img src="@/assets/images/industry/point.webp" class="title-dot" alt="" />
			<span class="title-text">
				<slot />
			</span>
			<el-tooltip
				v-if="$slots.source"
				:content="sourceText"
				placement="top"
				:show-after="300"
				:disabled="!sourceText"
			>
				<span class="title-source">
					<slot name="source" />
				</span>
			</el-tooltip>
		</div>
		<div class="title-line"></div>
	</div>
</template>

<script lang="ts" setup>
import { useSlots, computed } from 'vue';

const slots = useSlots();

/** 提取 source slot 的纯文本内容，用于 tooltip 展示 */
const sourceText = computed(() => {
	const vnodes = slots.source?.() || [];
	return vnodes
		.map((vnode) => {
			if (typeof vnode.children === 'string') return vnode.children;
			return '';
		})
		.join('');
});
</script>
<style lang="less" scoped>
.block-title {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	margin-bottom: 0.08rem;

	.title-top {
		display: flex;
		align-items: center;
		gap: 0.16rem;
		padding-left: 0.16rem;
	}

	.title-dot {
		width: 0.14rem;
		height: 0.1rem;
		flex-shrink: 0;
		margin-bottom: -0.14rem;
		object-fit: contain;
	}

	.title-text {
		font-family: MicrosoftYaHei;
		font-weight: bold;
		font-size: 0.2rem;
		color: #3a73de;
		line-height: 0.26rem;
		text-shadow: 0.01rem 0.01rem 0 #fff;
		margin-bottom: -0.02rem;
		flex-shrink: 0;
	}

	.title-source {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.85);
		margin-left: -0.04rem;
		margin-bottom: 0.02rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.title-line {
		width: 100%;
		height: 0.1rem;
		background-image: url('@/assets/images/industry/title-bg-line.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: 0 0;
	}
}
</style>
