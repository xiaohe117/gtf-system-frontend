<template>
	<div class="header" :style="{ justifyContent: $slots.extra ? 'space-between' : 'flex-start' }">
		<div class="name">
			<!-- 使用插槽包裹，支持外部传入自定义内容，默认回退到 props.title -->
			<span
				><slot>{{ title }}</slot></span
			>
		</div>
		<div v-if="$slots.extra" class="extra">
			<slot name="extra"></slot>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title: {
		type: String,
		default: '推荐企业',
	},
});
</script>

<style lang="less" scoped>
.header {
	display: flex;
	align-items: baseline;
	margin-bottom: 0.16rem;

	.name {
		// 添加相对定位，确保 ::before 伪元素能正确定位
		position: relative;
		min-width: 1.61rem;
		min-height: 0.44rem;
		padding-right: 0.36rem;
		background: url('@/assets/images/gtf/title-bg-yellow.png') bottom right / 1.55rem 0.17rem
			no-repeat;

		&::before {
			content: '';
			position: absolute;
			width: 0.89rem;
			height: 0.28rem;
			background: url('@/assets/images/gtf/title-bg-text.png');
			background-size: 100% 100%;
		}

		> span {
			display: inline-block;
			padding-top: 0.1rem;
			padding-left: 0.14rem;
			font-family: YouSheBiaoTiHei;
			font-size: 0.3rem;
			line-height: 0.25rem;
			background: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
			background-clip: text;
			-webkit-text-fill-color: transparent;
			filter: drop-shadow(0.02rem 0.02rem 0 #ffffff);
		}
	}
}
</style>
