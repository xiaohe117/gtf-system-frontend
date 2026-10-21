<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-03-24 14:33:11
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-09 16:14:44
-->
<template>
	<IframeView :src="url" class="iframe-container" />
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import useUserStore from '@/stores/user';

const store = useUserStore();
const route = useRoute();
const menus = computed(() => store.sideMenus);

const url: any = ref('');
const getUrl = () => {
	// 先获取顶部是否有url
	if(route.query.url){
		url.value = route.query.url
		return 
	}
	const obj = menus.value.find((ele: any) => ele.path === route.path) || {};
	url.value = obj.iframeUrl;
};

getUrl();
</script>
<style lang="less" scoped>
.iframe-container {
	min-height: 0 !important;
}
:deep(.iframe-content) {
	height: 100% !important;
}
</style>