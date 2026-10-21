<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-03-24 14:31:23
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-14 18:06:09
-->
<template>
	<TopHeader class="header" />
	<main>
		<SideToolbar class="side-toobar" />
		<div class="right-content">
			<transition name="fade-transform" mode="out-in">
				<router-view :key="route.fullPath" />
			</transition>
		</div>
	</main>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import TopHeader from './components/Header/NewIndex.vue';
import SideToolbar from './components/Sidebar/SideToolbar.vue';


const route = useRoute()
</script>
<style lang="less" scoped>
main {
	flex: 1;
	height: calc(100% - 0.87rem);
	display: flex;
	padding: 0.14rem 0.18rem;
	.side-toobar {
		width: 0.7rem;
		height: 100%;
	}
	.right-content {
		flex: 1;
		width: calc(100% - 1.56rem);
		padding-left: 0.16rem;
	}
}
</style>