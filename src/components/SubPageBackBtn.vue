<!--
 * @Descripttion: 子级页面返回按钮
 * @Author: ycyun
 * @Date: 2026-01-07 15:29:01
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-07 15:31:12
-->
<template>
	<div class="btn-back" @click="handleBack"></div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const handleBack = () => {
	const { history } = window;
	// 花智会app中初始化页面length为2时，返回无效果
	if (history.length <= 1) {
		router.replace('/');
	} else {
		router.go(-1);
	}
};
</script>
<style lang="less" scoped>
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
	background-image: url(/src/assets/images/runByEnterprise/newDetail/back-btn.png);
}
</style>