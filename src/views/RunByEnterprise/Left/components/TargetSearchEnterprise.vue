<!--
 * @Descripttion: 企业搜索按钮弹框
 * @Author: zhaochao
 * @Date: 2025-09-05 09:35:20
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-11-13 15:32:44
-->
<template>
	<div class="search-box" @click="handleSearchDialog">查找目标企业</div>
	<SearchDialog ref="SearchDialogRef" :needRecommendCompany="false" :clickGoDetail="true" />
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
	width: 1.8rem;
	height: 0.46rem;
	line-height: 0.46rem;
	color: #898989;
	font-size: 0.18rem;
	padding-left: 0.55rem;
	cursor: pointer;
	position: relative;
	font-family: PingFangSC-Medium;
	background: url('@/assets/images/runByEnterprise/center/search-btn-bg.png');
	background-size: 100% 100%;
}
</style>
