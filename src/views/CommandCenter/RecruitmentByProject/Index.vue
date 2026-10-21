<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-03-30 09:51:12
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-31 11:03:26
-->
<template>
	<Comp class="recruitment-by-project" />
</template>
<script lang="ts" setup>
import Comp from '@/views/RecruitmentByProject/Index.vue';
</script>
<style lang="less" setup>
.recruitment-by-project {
	:deep(.fx-w) {
        min-width: 0 !important;
	}
}
</style>