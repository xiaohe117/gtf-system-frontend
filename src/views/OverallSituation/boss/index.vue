<template>
	<div class="boss-dashboard"></div>
	<div class="click-btn" @click="goDetail"></div>
</template>
<script setup lang="ts">
import router from '@/router'

// 跳转页面
const goDetail = () => {
	router.push({
		name: 'classifiedByIndustry',
	})
}
</script>
<style lang="less" scoped>
.boss-dashboard {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-image: url('@/assets/images/OverallSituation/boss-dashboard-design-1.jpg');
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}
.click-btn {
	width: 5.1vw;
    height: 3vh;
    background: #000;
    position: fixed;
    z-index: 2;
    top: 72vh;
    left: 63.7vw;
    opacity: 0;
	cursor: pointer;
}
</style>
