<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-03-24 14:31:23
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-14 18:01:12
-->
<template>
	<TopHeader class="header" />
	<main>
		<router-view></router-view>
	</main>
</template>
<script lang="ts" setup>
import TopHeader from './components/Header/NewIndex.vue';
</script>

<style lang="less" scoped>
main {
	flex: 1;
	height: calc(100% - 0.87rem);
	padding: 0.14rem 0.18rem;
}
</style>