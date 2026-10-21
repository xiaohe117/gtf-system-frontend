<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-04-14 16:48:41
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-14 17:25:07
-->
<template>
	<TitleBody name="外部系统导航" class="energy-center">
		<ul>
			<li v-for="item in systems" :key="item.key" @click="clickFunc(item)">
				{{ item.label }}
			</li>
		</ul>
	</TitleBody>
</template>
<script lang="ts" setup>
const systems = computed(() => [
	{
		label: '广州市招商土地超市',
		key: 'btn_land_market',
		url: 'https://guangdong.tianditu.gov.cn/guangzhou/zstdcs/#/',
	},
]);
const clickFunc = (e: any) => {
	window.open(e.url, '_blank');
};
</script>
<style lang="less" scoped>
.energy-center {
	padding: 0.3rem 0.5rem;
	ul {
		font-size: 0.24rem;
		color: #4f98ff;
		li {
			display: inline-block;
			padding: 0.48rem 0.56rem;
			background: linear-gradient(
				90deg,
				rgba(254, 255, 255, 1) 0%,
				rgba(242, 246, 255, 1) 100%
			);
			border-radius: 0.08rem;
			cursor: pointer;
			text-decoration: underline;
		}
	}
}
</style>