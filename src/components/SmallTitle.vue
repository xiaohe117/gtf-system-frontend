<template>
	<div class="small-title fx-r fx-al-c fx-sp-b">
		<div class="right-box">
			<span class="title">{{ title }}</span>
			<span class="title-bg"></span>
		</div>
		<slot />
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
}>();
</script>

<style lang="less" scoped>
.small-title {
	margin-bottom: 0.2rem;
	.right-box {
		position: relative;
		.title {
			position: relative;
			z-index: 2;
			padding-left: 0.27rem;
			font-weight: 600;
			font-size: @g-font-size-large;
			color: #3a73de;
			line-height: 0.28rem;
		}
		.title-bg {
			position: absolute;
			left: 0;
			bottom: -0.04rem;
			content: '';
			display: inline-block;
			width: 2.36rem;
			height: 0.19rem;
			background-image: url('@/assets/images/runByEnterprise/small-title-bg.png');
			background-size: 100% 100%;
		}
	}
}
</style>
