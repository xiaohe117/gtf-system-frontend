<template>
	<GDialog
		v-model="dialogVisible"
		title="活动明细"
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
			@page-change="handlePageChange"
			@handleSortChange="handleSortChange"
			v-loading="loading"
		>
			<template #btn="{ row }">
				<div class="detail-btn" @click="handleClick(row)">详情</div>
			</template>
		</GrowthRateTable>
	</GDialog>
</template>

<script lang="ts" setup>
import GrowthRateTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/GrowthRateTable.vue';
import { queryActivityDetailPage, queryActivityUrl } from '@/api/commandCenter/deptOverview';
import ServiceUrl from '@/utils/url';
import { ElMessage } from 'element-plus';
import { getSize } from '@/utils';
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

const tableColumns = ref([
	{ label: '序号', type: 'index', width: String(getSize(40)), fixWidth: String(getSize(80)), align: 'left' },
	{
		label: '活动名称',
		prop: 'activityName',
		type: 'activityName',
		width: String(getSize(120)),
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '活动类型',
		prop: 'activityType',
		type: 'activityType',
		width: String(getSize(80)),
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '活动时间',
		prop: 'activityTimeStart',
		type: 'startTime',
		fixWidth: String(getSize(140)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '活动地点',
		prop: 'activityLocation',
		type: 'activityLocation',
		width: String(getSize(100)),
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '单位',
		prop: 'hostUnit',
		type: 'hostUnit',
		width: String(getSize(100)),
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '操作',
		prop: 'btn',
		type: 'slot',
		slotName: 'btn',
		width: String(getSize(80)),
		fixWidth: String(getSize(120)),
		align: 'center',
		showToolTip: false,
	},
]);

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
				...props.defaultDate,
			},
			pageNum: currentPage.value,
			pageSize: pageSize.value,
			...orderObj,
		};
		const res: any = await queryActivityDetailPage(params);
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
const handleClick = async (item: any) => {
	const { data }: any = await queryActivityUrl({ activityId: item.activityId });
	const url = data?.activityUrl;

	if (url) {
		window.open(ServiceUrl.getQmSysUrl() + url, '_blank');
	} else {
		ElMessage.error('该活动无法查看详情');
	}
};
const show = ({ row, col }: any) => {
	detailScopeId.value = row.detailScopeId;
	metricType.value = col.metricType;
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
