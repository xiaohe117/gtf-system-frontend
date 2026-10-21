<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-09-07 10:31:06
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-31 11:12:30
-->
<template>
	<div class="runByEnterprise fx-r fx-sp-b">
		<LeftMain />
		<RightMain />
	</div>
</template>

<script setup lang="ts">
import LeftMain from './components/LeftMain.vue';
import RightMain from './components/RightMain.vue';
</script>

<style lang="less" scoped>
.runByEnterprise {
	// column-gap: 0.24rem;
	padding-top: 0.15rem;
}
</style>
