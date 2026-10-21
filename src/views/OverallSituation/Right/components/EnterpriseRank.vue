<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-01-06 10:45:03
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-06 14:41:37
-->
<template>
	<div class="enterprise-rank">
		<CustomTable
			class="table-box"
			:tableData="listData"
			:columns="headers"
			:hasOrder="false"
			height="100%"
			@handleSortChange="handleSortChange"
			@row-click="goEnterpriseDetail"
		>
			<template #index="scope">
				{{ (currentPage - 1) * pageSize + scope.index + 1 }}
			</template>
		</CustomTable>
		<div class="page-box">
			<el-pagination
				:page-size="pageSize"
				layout="prev, pager, next"
				:total="total"
				:current-page="currentPage"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>
<script lang="ts" setup>
import CustomTable from '@/views/RunByEnterprise/Left/components/CustomTable.vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['changePage', 'sortChange']);
const router = useRouter();
// 添加当前页码状态
const currentPage = ref(1);
const pageSize = 5;
const props = defineProps({
	rankList: {
		type: Object,
		default: () => ({
			header: [],
			listData: [],
			total: 0,
		}),
	},
});
const headers = computed(() => props.rankList.header);
const listData = computed(() => props.rankList.listData);
const total = computed(() => props.rankList.total);
// ----------------------- 排序-------------------------
const sortConfig = ref<Record<string, { direction: 'asc' | 'desc' }>>({
	projectCount: { direction: 'asc' },
	totalInvestment: { direction: 'asc' },
});
const handleSort = (prop: string, direction: 'asc' | 'desc') => {
	if (sortConfig.value[prop]) {
		sortConfig.value[prop].direction = direction;
	}
	emit('sortChange', { prop, direction });
};

const handleSortChange = (obj: any) => {
	handleSort(obj.prop, obj.order);
};
// 处理页码变更
const handleCurrentChange = (page: any) => {
	currentPage.value = page;
	emit('changePage', { page, pageSize });
};

const goEnterpriseDetail = (item: any) => {
	router.push({
		name: 'enterpriseDetail',
		query: {
			sccode: item.sccode,
		},
	});
};
onMounted(() => {
	handleCurrentChange(1);
	//   currentPage.value = 1; // 初始化页码
});

defineExpose({
	handleCurrentChange,
});
</script>
<style lang="less" scoped>
.enterprise-rank {
	display: flex;
	flex-direction: column;
}
.table-box {
	height: calc(100% - 0.4rem);
	flex: 1;
	:deep(thead tr th.el-table__cell .cell){
		color: rgba(0, 0, 0, 0.7);
	}
	:deep(tr td .cell){
		cursor: pointer;
	}
}
.page-box {
	display: flex;
	justify-content: center;
	margin-top: 0.05rem;
	margin-bottom: 0.05rem;
	padding: 0 0.1rem;
	box-sizing: border-box;

	:deep(.el-pagination) {
		font-size: @g-font-size-base;
		color: rgba(0, 0, 0, 0.6);
		background-color: transparent;
		--el-pagination-bg-color: transparent;
		--el-pagination-button-disabled-bg-color: transparent;
		.el-pager {
			gap: 0.08rem;
			li {
				width: 0.32rem;
				height: 0.3rem;
				line-height: 0.3rem;
				border-radius: 0.03rem;
				background: rgba(255, 255, 255, 0.9);
				border: 0.01rem solid #dcdcdc;
				padding: 0;
				font-size: @g-font-size-base;
				min-width: 0.32rem;
				&.is-active {
					font-weight: 400;
					border: 0.01rem solid #165dffff;
					color: #165dff;
				}
			}
		}
	}
}
</style>