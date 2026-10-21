<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-06-21 16:06:50
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-01 15:15:37
-->
<template>
	<div class="toufaw-overview">
		<SubPageBackBtn />
		<PageTitle title="投发委办招商总览" />
		<main>
			<FrameBox class="left-box">
				<Left />
			</FrameBox>
			<FrameBox class="right-box" size="small">
				<Right />
			</FrameBox>
		</main>
	</div>
</template>

<script setup lang="ts">
import PageTitle from './components/PageTitle.vue';
import Left from './Left.vue';
import Right from './Right.vue';

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});
onBeforeMount(() => {});
</script>

<style lang="less" scoped>
.toufaw-overview {
	height: 100%;
	display: flex;
	flex-direction: column;
	main {
		height: calc(100% - 0.46rem - 0.16rem);
		flex: 1;
		:deep(.outside){
			max-height: 100% !important;
		}
		display: flex;
		.left-box {
			width: 12.5rem;
		}
		.right-box {
			flex: 1;
			margin-left: 0.24rem;
			width: calc(100% - 12.5rem - 0.24rem);
		}
	}
}
:deep(.title-container .header .name > span) {
	background: linear-gradient(180deg, #4f98ff 40%, #1936a9 100%);
	background-clip: text;
	-webkit-text-fill-color: transparent;
}
</style>
