<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-08-15 15:24:52
 * @LastEditors: ycyun
 * @LastEditTime: 2025-12-10 09:23:05
-->
<template>
	<section class="app-main">
		<div class="main-inner">
			<router-view :key="key" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const key = computed(() => route.path);
</script>

<style lang="less" scoped>
.app-main {
	flex: 1;
	//overflow-y: auto;
	//height: calc(100vh - 0.9rem);
	// padding-top: 0.9rem;
	// height: calc(100vh - 0.96rem);
	background: #e5eeff;
	padding-bottom: 0.1rem;
}
.main-inner {
	padding: 0 0.24rem;
	height: 100%;
}
</style>
