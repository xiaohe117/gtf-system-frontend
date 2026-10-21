<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-06-21 16:28:51
 * @LastEditors: ycyun
 * @LastEditTime: 2025-06-21 17:13:44
-->
<template>
	<div class="page-title">
		<span>{{ title }}</span>
	</div>
</template>
<script lang="ts" setup>
withDefaults(
	defineProps<{
		title?: string;
	}>(),
	{
		title: '',
	}
);
</script>
<style lang="less" scoped>
.page-title {
	font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
	font-size: 0.4rem;
	line-height: 0.46rem;
	background: linear-gradient(180deg, #4f98ff 20%, #1936a9 100%);
	background-clip: text;
	-webkit-text-fill-color: transparent;
	padding: 0.08rem 0;
}
</style>