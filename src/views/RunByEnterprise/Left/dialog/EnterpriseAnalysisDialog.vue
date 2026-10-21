<!--
 * @Descripttion: 企业所在地
 * @Author: zhaochao
 * @Date: 2025-09-07 16:19:50
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-08 11:12:45
-->
<template>
	<el-dialog v-model="dialogVisible" width="10.5rem">
		<TitleBody :name="'企业所在地'">
			<EnterpriseAnalysis />
		</TitleBody>
	</el-dialog>
</template>

<script setup lang="ts">
import EnterpriseAnalysis from '@/views/RunByEnterprise/components/targetEnterprise/Index.vue';

const dialogVisible = ref(false);
const show = () => {
	dialogVisible.value = true;
};
defineExpose({ show });
</script>
