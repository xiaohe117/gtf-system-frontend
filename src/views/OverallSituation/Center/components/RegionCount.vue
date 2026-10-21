<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-04-22 16:40:42
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-23 09:46:08
-->
<template>
	<div class="region-count">
		<p class="title">区域企业数</p>
		<ul>
			<li v-for="(item, index) in countConfig" :key="index">
				<span class="box" :style="{ background: item.color }"></span>
				<span class="label">{{ item.label }}</span>
				<span>家</span>
			</li>
		</ul>
	</div>
</template>
<script lang="ts" setup>
import { countConfig } from '@/views/OverallSituation/components/map/chinaProvinces';
</script>
<style lang="less" scoped>
.region-count {
	position: absolute;
	width: 1.53rem;
	height: 2.08rem;
	background-image: url('@/assets/images/runByEnterprise/center/region-count-bg.png');
	background-size: 100% 100%;
	bottom: 0rem;
	padding: 0.1rem 0.16rem;
	.title {
		font-family: YouSheBiaoTiHei;
		font-size: 0.22rem;
		color: #4e5969;
		line-height: 0.29rem;
		margin-bottom: 0.08rem;
	}
	ul {
		li {
			display: flex;
			align-items: center;
			color: rgba(0, 0, 0, 0.65);
			font-size: 0.16rem;
			font-family: PingFangSC, PingFang SC;
			line-height: 0.2rem;
			margin-bottom: 0.12rem;
			span {
				display: inline-block;
			}
			.box {
				width: 0.1rem;
				height: 0.1rem;

				box-shadow: 0 0.02rem 0.04rem 0 #004e97;
				border-radius: 0.01rem;
				margin-right: 0.06rem;
			}
			.label {
				margin-right: 0.04rem;
			}
		}
	}
}
</style>