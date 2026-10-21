<!--
 * @Descripttion: 左边菜单框架layout
 * @Author: ycyun
 * @Date: 2026-03-23 14:04:31
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-14 18:06:02
-->
<template>
	<TopHeader class="header" />
	<main
		:class="{
			'hide-side-menu': !isExpand,
			'investment-full-process-page': isInvestmentFullProcess,
		}"
	>
		<SideMenu class="side-menu" v-model="isExpand"/>
		<div class="right-content">
			<transition name="fade-transform">
				<router-view :key="route.fullPath" />
			</transition>
			
		</div>
	</main>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import useUserStore from '@/stores/user';
import SideMenu from './components/Sidebar/SideMenu.vue';
import TopHeader from './components/Header/NewIndex.vue';

const store = useUserStore();
const route = useRoute();
const isExpand = computed(() => store.sideMenusIsExpand);
const isInvestmentFullProcess = computed(() => route.path.includes('investmentFullProcess'));

</script>
<style lang="less" scoped>
@sideWidth:1.6rem;
main {
	flex: 1;
	height: calc(100% - 0.87rem);
	padding: 0.24rem 0.14rem;
	position: relative;
	.side-menu {
		width: @sideWidth;
		height: calc(100% - 0.48rem);
		position: absolute;
		left: 0.14rem;
		top: 0.24rem;
		z-index: 10;
		transition: all 0.3S linear;
	}
	&.hide-side-menu{
		.side-menu {
			left: -@sideWidth;
			
		}
		.right-content{
			padding-left: 0.12rem;
		}
	}
	.right-content {
		width: 100%;
		height: 100%;
		padding-left: calc(@sideWidth + 0.26rem);
		transition: all 0.3S linear;
		
	}
}
/* 进入/离开的整个过渡阶段 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

/* 进入开始状态、离开结束状态（元素不可见） */
.fade-transform-enter-from,
.fade-transform-leave-to {
  opacity: 0;
}

.fade-transform-leave-from,
.fade-transform-enter-to {
  opacity: 1;
}
</style>