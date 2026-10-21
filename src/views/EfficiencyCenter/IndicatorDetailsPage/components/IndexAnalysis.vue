<!--
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2025-06-16 15:18:38
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-07-24 14:11:50
-->
<template>
	<SmallTitle :title="`${attrs.indicatorData.indexTitle}指标-指标分析`">
		<div class="index-analysis fx-r">
			<div class="icon">
				<img src="@/assets/images/IndicatorDetailsPage/index-analysis-icon.svg" alt="" />
			</div>
			<div class="content">{{ attrs?.baseIndicatorData?.hd_ZB_DE028 || '--' }}</div>
		</div>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { useAttrs } from 'vue';
import SmallTitle from './SmallTitle.vue';

const attrs: any = useAttrs();
</script>
<style lang="less" scoped>
.small-title-wrapper {
	padding-bottom: 0;
}
.index-analysis {
	margin-top: 0.16rem;
	padding: 0.16rem;
	background: linear-gradient(90deg, rgba(210, 223, 251, 0.4) 0%, rgba(210, 223, 251, 0.2) 100%);
	border: 0.01rem solid rgba(210, 223, 251, 0.3);
	border-radius: 0.08rem;
	color: #4e5969;
	font-size: 0.16rem;
	line-height: 0.24rem;
	.icon {
		img {
			width: 0.9rem;
			height: 0.9rem;
			margin-right: 0.16rem;
		}
	}
	.content {
		height: 0.9rem;
		overflow-y: scroll;
	}
}
</style>
