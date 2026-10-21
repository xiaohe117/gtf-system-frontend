<template>
	<div class="empty-container">
		<p class="empty-container_icon"></p>
		<p class="empty-container_text">暂无数据</p>
	</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		height?: number | string; // 类型为number时，单位为px
	}>(),
	{
		height: '100%',
	}
);

const containerHeight = computed(() => {
	if (typeof props.height === 'string') {
		return props.height;
	}
	return `${props.height / 100}rem`;
});
</script>

<style lang="less" scoped>
.empty-container {
	height: v-bind(containerHeight);
	//background-color: #539cf31a;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: 0.08rem;
	box-sizing: border-box;
}
.empty-container_icon {
	width: auto;
	height: 1.06rem;
	max-width: 1.93rem;
	max-height: 1.53rem;
	aspect-ratio: 124 / 106;
	flex: 1;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-image: url('@/assets/images/common/empty.png');
}
.empty-container_text {
	font-size: @normal-font-size;
  color: rgba(0,0,0,0.65);
	line-height: 0.26rem;
  font-family: MicrosoftYaHei;
}
</style>
