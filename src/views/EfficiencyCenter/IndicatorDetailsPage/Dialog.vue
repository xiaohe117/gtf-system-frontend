<template>
	<el-dialog
		v-model="dialogVisible"
		width="16.2rem"
		class="indicator-detail-dialog"
		:before-close="handleClose"
		append-to-body
		:align-center="true"
		:close-on-click-modal="false"
		v-bind="$attrs"
		destroy-on-close
	>
		<Index v-bind="$attrs" ref="indexRef" :indicatorData="indicatorData" />
	</el-dialog>
</template>
<script setup lang="ts">
import Index from './Index.vue';

const dialogVisible = ref(false);
const indicatorData = ref<any>();
const indexRef = ref<any>();

const show = (data?: any) => {
	dialogVisible.value = true;
	indicatorData.value = data;
};
const handleClose = () => {
	dialogVisible.value = false;
	indexRef.value.handleClose();
};
defineExpose({ show });
</script>
<style lang="less">
.indicator-detail-dialog {
	.el-dialog__body {
		background: #fff;
		padding: 0.2rem;
		overflow-x: hidden;
	}
}
</style>
