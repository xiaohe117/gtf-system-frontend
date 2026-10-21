<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-04-22 16:40:42
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-23 09:46:08
-->
<template>
	<div class="region-count">
		<p class="title"><span>区域走访次数</span></p>
		<ul>
			<li v-for="(item, index) in countConfig" :key="index">
				<span class="box" :style="{ background: item.color }"></span>
				<span class="label">{{ item.label }}</span>
				<span>次</span>
			</li>
		</ul>
	</div>
</template>
<script lang="ts" setup>
const countConfig = [
	{ label: '<1', level: 4, color: '#DDF2FF ' },
	{ label: '1-5', level: 3, color: '#87C8FF ' },
	{ label: '6-10', level: 2, color: '#408DFB' },
	{ label: '11-50', level: 1, color: '#165DFF' },
	{ label: '>50', level: 0, color: '#3B60A5' },
];
</script>
<style lang="less" scoped>
.region-count {
	position: absolute;
	width: 1.38rem;
	height: 1.92rem;
	// background-image: url('@/assets/images/runByEnterprise/center/region-count-bg.png');
	background-image: url('@/assets/images/map/qyqys-bg.png');
	background-size: 100% 100%;
	bottom: 0rem;
	padding: 0.09rem 0.14rem 0.04rem 0.15rem;
	.title {
		// span:nth-child(1) {
		// 	display: inline-block;
		// 	width: 0;
		// 	height: 0;
		// 	border-top: 6px solid transparent;
		// 	border-bottom: 6px solid transparent;
		// 	border-left: 4px solid #165dff;
		// 	opacity: 0.5;
		// }
		// span:nth-child(2) {
		// 	display: inline-block;
		// 	width: 0;
		// 	height: 0;
		// 	border-top: 6px solid transparent;
		// 	border-bottom: 6px solid transparent;
		// 	border-left: 4px solid #165dff;
		// }
		span {
			font-family: AlimamaShuHeiTi, AlimamaShuHeiTi;
			font-weight: bold;
			font-size: 0.18rem;
			color: #000;
			line-height: 0.22rem;
			// margin-left: 0.02rem;
		}
	}
	ul {
		margin-top: 0.1rem;
		li {
			font-family:
				PingFangSC,
				PingFang SC;
			display: flex;
			align-items: center;
			color: #000;
			font-size: 0.16rem;
			font-family:
				PingFangSC,
				PingFang SC;
			line-height: 0.2rem;
			margin-bottom: 0.08rem;
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
