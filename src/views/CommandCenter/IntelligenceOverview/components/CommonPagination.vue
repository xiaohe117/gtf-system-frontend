<template>
	<div class="common-pagination">
		<div class="left-slot">
			<slot name="left"></slot>
		</div>
		<el-pagination
			v-model:current-page="pagination.page"
			v-model:page-size="pagination.size"
			:total="pagination.total"
			:layout="layout"
			:page-sizes="pageSizes"
			@size-change="handleChange"
			@current-change="handleChange"
		/>
	</div>
</template>

<script lang="ts" setup>
interface Pagination {
	page: number;
	size: number;
	total: number;
}

const pagination = defineModel<Pagination>({ required: true });

withDefaults(
	defineProps<{
		layout?: string;
		pageSizes?: number[];
	}>(),
	{
		layout: 'total, prev, pager, next,sizes',
		pageSizes: () => [10, 20, 50, 100],
	}
);

const emit = defineEmits<{
	change: [page: number, size: number];
}>();

const handleChange = () => {
	emit('change', pagination.value.page, pagination.value.size);
};
</script>

<style lang="less" scoped>
.common-pagination {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	border-top: 1px solid #f0f0f0;
	.left-slot {
		flex: 1;
	}
	:deep(.el-pagination) {
		font-size: 0.16rem;
		--el-pagination-item-gap: 0.16rem;
		--el-pagination-font-size: 0.16rem;
		--el-pagination-button-width: 0.32rem;
		--el-pagination-button-height: 0.32rem;
		.el-pager li,
		.el-select .el-select__placeholder {
			font-size: 0.16rem;
		}
		.btn-next,
		.btn-prev,
		.el-pager li {
			padding: 0 0.04rem;
			.el-icon {
				font-size: 0.16rem;
			}
		}
		.el-pagination__sizes .el-select {
			width: 1.2rem;
		}
	}
}
</style>
