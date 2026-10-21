<template>
	<div :class="size" class="sub-title">
		<span>{{ title }}</span>
		<slot />
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title?: string;
		size?: string;
	}>(),
	{
		title: '',
		size: 'long', // long|middle|short
	}
);
</script>

<style lang="less" scoped>
.sub-title {
	width: 100%;
	height: 0.42rem;
	padding-left: 0.24rem;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-image: url('@/assets/images/common/sub-title-bg.png');
	background-size: 100% 100%;
    font-size: 0.2rem;
    color: @title-color;
    &.middle {
      background-image: url('@/assets/images/common/sub-title-bg-min.png');
      background-size: 100% 100%;
    }
    &.swipe {
      background-image: url('@/assets/images/home/swipe-title.png');
      background-size: 100% 100%;
	  padding-left: 0.54rem;
    }
}
</style>
