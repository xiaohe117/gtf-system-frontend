<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-07-02 11:51:37
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-07 15:32:40
-->
<template>
	<div class="container">
		<SubPageBackBtn />
		<div class="title">工信局招商总览</div>
		<div class="content">
			<LeftPart></LeftPart>
			<RightPart></RightPart>
		</div>
	</div>
</template>

<script setup lang="ts">
import LeftPart from './components/LeftPart.vue';
import RightPart from './components/RightPart.vue';

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});

</script>

<style lang="less" scoped>
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;

	.title {
		background-image: linear-gradient(
			180deg,
			rgba(79, 152, 255, 1) 0,
			rgba(25, 54, 169, 1) 100%
		);
		overflow-wrap: break-word;
		color: rgba(79, 152, 255, 1);
		font-size: 0.4rem;
		font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
		line-height: 0.46rem;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 0.15rem;
	}

	.content {
		display: flex;
		justify-content: space-between;
		gap: 0.24rem;
	}
}
</style>
