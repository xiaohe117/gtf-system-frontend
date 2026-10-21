<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-29 15:39:34
 * @LastEditors: ycyun
 * @LastEditTime: 2025-10-30 09:51:46
-->

<template>
	<div class="title-container fx-c">
		<div
			class="header"
			:style="{ justifyContent: $slots.extra ? 'space-between' : 'flex-start' }"
		>
			<div class="name">
				<span>{{ props.name }}</span>
			</div>
			<div class="extra"><slot name="extra"></slot></div>
		</div>
		<div class="title-body-content">
			<slot></slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
	name: string;
}>();
</script>
<style lang="less" scoped>
.title-container {
	width: 100%;
	height: 100%;
}
.header {
	display: flex;
	align-items: baseline;
	margin-bottom: 0.16rem;

	.name {
		min-width: 1.61rem;
		min-height: 0.44rem;
		padding-right: 0.36rem;
		// background: url('@/assets/images/gtf/water-proof.png') top right / 1.61rem 0.44rem no-repeat;
		background: url('@/assets/images/gtf/title-bg-yellow.png') bottom right / 1.55rem
				0.17rem no-repeat;
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
			// font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
			font-family: YouSheBiaoTiHei;
			font-size: 0.3rem;
			line-height: 0.25rem;
			// color: transparent;
			// background-clip: text;
			// background-image: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
			background: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
			background-clip: text;
			-webkit-text-fill-color: transparent;
			filter: drop-shadow(0.02rem 0.02rem 0 #ffffff);
		}
	}
}
.title-body-content {
	width: 100%;
	height: 100%;
}
</style>
