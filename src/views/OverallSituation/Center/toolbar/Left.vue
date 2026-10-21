<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-28 10:20:19
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-30 10:48:15
-->
<template>
	<ul class="toolbar-left">
		<li
			v-for="(item, index) in list"
			:key="index"
			:class="{ 'has-system': item.systemName }"
			@click="goPage(item)"
		>
			<div class="name">{{ item.name }}</div>
			<div class="system-name">{{ item.systemName }}</div>
		</li>
	</ul>
</template>
<script lang="ts" setup>
import ServiceUrl from '@/utils/url'

const list = [
	{ name: '企业潜力', systemName: '广规经济产业大平台' },
	{ name: '投融资', systemName: '清科私募通' },
	{ name: '管理中心', systemName: '', url: ServiceUrl.adminUrl },
];
const goPage = (item: any) => {
	if (item.url) {
		window.open(item.url, '_blank');
	}
};
</script>
<style lang="less" scoped>
.toolbar-left {
	position: absolute;
	bottom: 0;
	left: 0;
	li {
		@boxHeight: 0.42rem;
		margin-bottom: 0.16rem;
		cursor: pointer;
		height: @boxHeight;
		display: flex;
		font-size: 0.16rem;
		width: 2.76rem;
		&.has-system:hover {
			background: url('@/assets/images/runByEnterprise/center/system-name-bg.png');
			background-size: 100% 100%;
			position: relative;
			&::before{
				content:'';
				display: inline-block;
				position: absolute;
				box-shadow: 0 .04rem .12rem 0 #165DFF;
				border-radius:0.08rem .25rem .25rem 0.08rem;
				top: 0;
				bottom: 0;
				width: 100%;
			}
			.name {
				background: none !important;
			}
			.system-name {
				display: inline-block;
			}
		}
		.name {
			width: 1.11rem;
			height: 100%;
			background: url('@/assets/images/runByEnterprise/center/system-bg.png');
			background-size: 100% 100%;
			color: #fff;
			line-height: @boxHeight;
			font-weight: bold;
			padding-left: 0.11rem;
			text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
			font-family: MicrosoftYaHei, MicrosoftYaHei;
		}
		.system-name {
			padding-left: 0.08rem;
			color: #165dff;
			line-height: @boxHeight;
			display: none;
		}
	}
}
</style>