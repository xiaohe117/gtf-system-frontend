<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-09-15 17:28:16
 * @LastEditors: ycyun
 * @LastEditTime: 2025-12-30 10:37:25
-->
<template>
	<div class="classified-by-industry">
		<!-- <IframeView src="http://10.205.25.136/zsyz/#/runByEnterprise" title="整体情况概览" /> -->
		<IframeView src="http://10.205.25.135:9001/zszh/#/index/qybj/guihuabj" title="按产业分" />
	</div>
</template>

<script setup lang="ts">
// import IframeView from '@/components/IframeView.vue';

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});
onBeforeMount(() => {});
</script>

<style lang="less" scoped>
.classified-by-industry {
	width: 100%;
	height: 100%;
	background: #f5f5f5;
}
</style>
