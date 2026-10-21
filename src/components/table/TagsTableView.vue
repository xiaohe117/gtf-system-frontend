<!--
 * @Descripttion: 企业标签table栏展示组件
 * @Author: ycyun
 * @Date: 2025-12-10 09:59:38
 * @LastEditors: ycyun
 * @LastEditTime: 2025-12-11 14:33:24
-->
<template>
	<div class="tags-table-view">
		<template v-if="list.length > 0">
			<el-tag type="primary" v-for="(item, index) in list" :key="item + index">
				<EllipsisText :text="item" :lines="1"/>
			</el-tag>
		</template>
		<span v-else>
			{{ EmptyConst }}
		</span>
	</div>
</template>
<script lang="ts" setup>
import { EmptyConst } from '@/utils';

const props = defineProps({
	value: {
		type: String,
		default: '',
	},
});
const list = computed(() => {
	if (!props.value) {
		return [];
	}
	return props.value.split(',');
});
</script>
<style lang="less" scoped>
.tags-table-view {
	.el-tag {
		--el-color-primary: #165dff;
		--el-color-primary-light-9: #e4f1ff;
		--el-color-primary-light-8: rgba(22, 93, 255, 0.5);
		margin-right: 0.08rem;
		font-size: 0.14rem;
		padding: 0.01rem 0.08rem;
		border-radius: 0.02rem;
		height: auto;
		max-width: 100%;

		&:first-child {
			margin-top: 0;
		}
		:deep(.el-tag__content) {
			line-height: 0.2rem;
			height: 0.2rem;
			display: inline-block;
			max-width: 100%;
		}
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>