<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-06-21 16:22:41
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-06 10:21:48
-->
<template>
	<div class="tabs-box fx-r fx-al-c">
		<p
			class="item"
			v-for="(item, index) in tabList"
			:key="item"
			:class="{ active: activeIndex === index }"
			@click="clickTab(index)"
		>
			{{ item }}
		</p>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		tabList: string[];
	}>(),
	{
		tabList: () => [],
	}
);

const activeIndex = ref(0);
const emits = defineEmits(['changeTab']);
const clickTab = (index: number) => {
	activeIndex.value = index;
	emits('changeTab', index);
};
</script>

<style lang="less" scoped>
.tabs-box {
	height: 0.36rem;
	.item {
		font-weight: 400;
		font-size: @g-font-size-base;
		color: #999999;
		line-height: 0.2rem;
		padding: 0.09rem 0.24rem 0.07rem;
		background: linear-gradient(
			180deg,
			rgba(232, 244, 255, 0.8) 0%,
			rgba(184, 216, 255, 0.8) 100%
		);
		backdrop-filter: blur(0.1rem);
		position: relative;
		&:not(:last-child) {
			&::after {
				position: absolute;
				right: 0rem;
				content: '';
				display: inline-block;
				width: 0.01rem;
				height: 0.16rem;
				background: rgba(167, 199, 255, 0.9);
				backdrop-filter: blur(0.1rem);
			}
		}
		&.active,
		&:hover {
			cursor: pointer;
			font-weight: 500;
			color: #333333;
			border-bottom: 0.04rem solid #3489ff;
		}
	}
}
</style>
