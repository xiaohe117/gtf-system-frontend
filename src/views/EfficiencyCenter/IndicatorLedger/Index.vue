<template>
	<div class="indicator-ledger-page">
		<!-- <Breadcrumb :show-back="true" /> -->
		<FullIndicatorLedger v-bind="$attrs"/>
	</div>
</template>

<script setup lang="ts">
// import Breadcrumb from '@/components/Breadcrumb.vue';
import FullIndicatorLedger from './components/FullIndicatorLedger.vue';
</script>

<style lang="less" scoped>
.indicator-ledger-page {
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>