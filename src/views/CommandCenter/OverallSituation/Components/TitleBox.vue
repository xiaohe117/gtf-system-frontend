<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-05-12 15:41:19
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-13 16:20:37
-->
<template >
	<div class="title-box" :class="{ 'has-bg': !isSub }">
		<div class="sub-title" v-if="isSub">
			<img class="icon" src="@/assets/images/IndicatorDetailsPage/title-icon.png" alt="" />
			<span class="text">{{ title }}</span>
		</div>
		<div class="title" v-else>{{ title }}</div>
		<div class="right">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
defineProps({
	title: {
		type: String,
		default: '',
	},
	isSub: {
		type: Boolean,
		default: false,
	},
});
</script>
<style lang="less" scoped>
.title-box {
	display: flex;
	align-items: center;
	&.has-bg {
		font-family: MicrosoftYaHei, MicrosoftYaHei;
		font-weight: bold;
		font-size: 0.22rem;
		color: #3a73de;
		line-height: 0.29rem;
		text-shadow: 0.01rem 0.01rem 0 #ffffff;
		position: relative;
		padding-left: 0.4rem;
		margin-bottom: 0.22rem;
		height: 0.34rem;
	}

	&.has-bg::before {
		content: '';
		display: inline-block;
		width: 2.57rem;
		height: 0.19rem;
		background: url(@/assets/images/wallMapTable/title-bg.png);
		background-size: 100% 100%;
		position: absolute;
		z-index: 0;
		left: 0;
		bottom: 0rem;
	}
	.title {
		position: relative;
		z-index: 1;
	}
	.right {
		margin-left: auto;
	}
	.sub-title {
		.icon {
			width: 0.16rem;
			height: 0.18rem;
			margin-right: 0.08rem;
		}
		.text {
			font-family: PingFangSC, PingFang SC;
			font-weight: 600;
			font-size: 0.2rem;
			color: #202741;
			line-height: 0.28rem;
		}
	}
}
</style>