<template>
	<GDialog
		v-model="dialogVisible"
		title="场景明细"
		width="18rem"
		:align-center="true"
		:close-on-click-modal="false"
		destroy-on-close
		class="dept-detail-dialog"
	>
		<GrowthRateTable
			height="5.2rem"
			:tableData="tableData"
			:tableColumns="tableColumns"
			:current-page="currentPage"
			:page-size="pageSize"
			:showPagination="true"
			:serverPageData="true"
			:showEmptyHeader="true"
			:total="total"
			:loading="loading"
			@page-change="handlePageChange"
			@handleSortChange="handleSortChange"
			
		>
			<template #btn="{ row }">
				<div class="detail-btn" @click="handleClick(row)">详情</div>
			</template>
		</GrowthRateTable>
	</GDialog>
</template>

<script lang="ts" setup>
import GrowthRateTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/GrowthRateTable.vue';
import { getTableColumnsConfig } from '@/views/EfficiencyCenter/IndicatorDetailsPage/config/tableColumns';
import { querySceneDetailPage } from '@/api/commandCenter/deptOverview';
import ServiceUrl from '@/utils/url';
import GDialog from '@/components/dialog/GDialog.vue';

const props = defineProps({
	defaultDate: {
		type: Object,
		default: () => ({}),
	},
});

const dialogVisible = ref(false);
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const detailScopeId = ref('');
const metricType = ref('');
const tabType = ref('');

const tableColumns = computed(() => getTableColumnsConfig('sceneDetail'));

const orderObj: { orderFields: string[]; orderSorts: string[] } = {
	orderFields: [],
	orderSorts: [],
};
const fetchData = async () => {
	loading.value = true;
	try {
		const params = {
			entity: {
				detailScopeId: detailScopeId.value,
				metricType: metricType.value,
				...props.defaultDate
			},
			pageNum: currentPage.value,
			pageSize: pageSize.value,
			...orderObj,
		};
		const res: any = await querySceneDetailPage(params);
		tableData.value = res.data?.records || [];
		total.value = Number(res.data?.total || 0) || 0;
	} catch {
		tableData.value = [];
		total.value = 0;
	} finally {
		loading.value = false;
	}
};

const handlePageChange = ({ type, value }: { type: string; value: number }) => {
	if (type === 'size') {
		pageSize.value = value;
		currentPage.value = 1;
	} else {
		currentPage.value = value;
	}
	fetchData();
};

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	if (order) {
		orderObj.orderSorts[0] = order;
		orderObj.orderFields[0] = prop;
	} else {
		orderObj.orderSorts = [];
		orderObj.orderFields = [];
	}
	fetchData();
};

const handleClick = (item: any) => {
	const targetUrl = `enterprise-form/aggregation-detail?sceneId=${item.sceneId}&iframe_menu_key=scene&type=cityDetail&to=efficiency`;
	window.open(ServiceUrl.adminUrl + targetUrl, '_blank');
};

const show = ({ row, col }: any) => {
	detailScopeId.value = row.detailScopeId;
	metricType.value = col.metricType;
	tabType.value = row.unitType;
	currentPage.value = 1;
	pageSize.value = 10;
	orderObj.orderFields = [];
	orderObj.orderSorts = [];
	fetchData();
	dialogVisible.value = true;
};

defineExpose({ show });
</script>

<style lang="less" scoped>
.detail-btn {
	color: #2d8cf0;
	cursor: pointer;
}
</style>
