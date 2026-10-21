<template>
	<div class="runByEnterprise-Details">
		<div class="btn-back" @click="handleBack"></div>
        新的企业详情页面
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const handleBack = () => {
	const { history } = window;
	// 花智会app中初始化页面length为2时，返回无效果
	const backUrl = history.state && history.state.back;
	if (history.length <= 1 || backUrl === null) {
		const path = backUrl || '/';
		router.replace(path);
	} else {
		router.go(-1);
	}
};
</script>

<style lang="less" scoped>
.runByEnterprise-Details {
	position: relative;
	height: 100%;
	padding-top: 0.22rem;
}
.btn-back {
	position: fixed;
	z-index: 2;
	cursor: pointer;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 0.41rem;
	height: 1.52rem;
	background-size: 100% 100%;
	background-image: url('@/assets/images/runByEnterprise/newDetail/back-btn.png');
}
</style>
