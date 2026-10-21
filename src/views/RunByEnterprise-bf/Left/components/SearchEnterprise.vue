<!--
 * @Descripttion: 企业搜索按钮弹框
 * @Author: zhaochao
 * @Date: 2025-09-05 09:35:20
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-08 10:52:53
-->
<template>
	<div class="search-box" @click="handleSearchDialog">请输入查找企业</div>
	<SearchDialog ref="SearchDialogRef" :needRecommendCompany="true" :clickGoDetail="true" />
</template>
<script setup lang="ts">
import SearchDialog from '../dialog/SearchDialog.vue';

const SearchDialogRef = ref<any>();
const handleSearchDialog = () => {
	SearchDialogRef.value.show();
};
</script>
<style lang="less" scoped>
.search-box {
	width: 2rem;
	height: 0.46rem;
	line-height: 0.46rem;
	background: #edf4ff;
	box-shadow: 0 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
	border-radius:0 0.4rem 0.4rem 0;
	border: 0.01rem solid #ffffff;
	backdrop-filter: blur(0.16rem);
	color: #266fe8;
	font-size: 0.18rem;
	padding-left: 0.18rem;
	margin-bottom: 0.1rem;
	cursor: pointer;
	position: relative;
	font-family: PingFangSC-Medium;
	&::before {
		content: '';
		width: 0.6rem;
		height: 0.6rem;
		display: inline-block;
		background: url('@/assets/images/RecruitmentByProject/icon-left.png') no-repeat center;
		background-size: 100% 100%;
		position: absolute;
		left: -0.26rem;
		bottom: -0.1rem;
	}
	&::after {
		content: '';
		width: 0.24rem;
		height: 0.24rem;
		display: inline-block;
		background: url('@/assets/images/RecruitmentByProject/icon-rigth.png') no-repeat center;
		background-size: 100% 100%;
		position: absolute;
		right: 0.1rem;
		bottom: 0.1rem;
	}
}
</style>
