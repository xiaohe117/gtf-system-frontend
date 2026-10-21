<!-- 有效线索明细 -->
<template>
	<GDialog
		v-model="dialogVisible"
		title="线索明细"
		width="18rem"
		:align-center="true"
		:close-on-click-modal="false"
		:teleported="false"
		:append-to-body="false"
		destroy-on-close
		class="dept-detail-dialog"
	>
		<div class="project-detail">
			<!-- 表格 -->
			<div v-loading="loading">
				<GrowthRateTable
					ref="tableRef"
					height="5.2rem"
					:tableData="tableData"
					:tableColumns="tableColumns"
					:currentPage="currentPage"
					:pageSize="pageSize"
					:showPagination="true"
					:serverPageData="true"
					:showEmptyHeader="true"
					:total="total"
					@page-change="handlePageChange"
				>
					<template #btn="{ row }">
						<div class="link-text" @click="handleDetail(row)">详情</div>
					</template>
				</GrowthRateTable>
			</div>
		</div>
	</GDialog>
</template>

<script setup lang="ts">
import ServiceUrl from '@/utils/url';
import { getSize } from '@/utils';
import GrowthRateTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/GrowthRateTable.vue';
import { clueFollowStatPage } from '@/api/commandCenter/deptOverview';
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

const searchParams = reactive({
	startTimeStr: '',
	endTimeStr: '',
	tagId: '',
});

const tableColumns = [
	{
		label: '序号',
		type: 'index',
		fixWidth: String(getSize(80)),
		align: 'left',
	},
	{
		prop: 'clueName',
		label: '线索名称',
		headerAlign: 'center',
		width: String(getSize(180)),
		align: 'left',
	},
	{
		prop: 'summarize',
		label: '线索简介',
		width: String(getSize(200)),
		headerAlign: 'center',
		align: 'left',
		showToolTip: true,
	},
	{
		prop: 'cityIndustrialChainName',
		label: '产业体系',
		width: String(getSize(160)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'investAmount',
		label: '预计投资总额（亿元）',
		width: String(getSize(180)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'investors',
		label: '关联企业名称',
		width: String(getSize(160)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'receivingUnits',
		label: '线索接收单位',
		width: String(getSize(180)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'settleAreaName',
		label: '落户区',
		width: String(getSize(120)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'cluePhaseNew',
		label: '线索状态',
		width: String(getSize(120)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '操作',
		type: 'slot',
		slotName: 'btn',
		fixed: 'right',
		width: 100,
	},
];

const fetchTableData = async () => {
	loading.value = true;
	try {
		const params: Record<string, any> = {
			page: currentPage.value,
			size: pageSize.value,
		};
		// 仅拼接有值的查询参数
		Object.entries(searchParams).forEach(([k, v]) => {
			if (v !== '' && v !== undefined && v !== null) {
				params[k] = v;
			}
		});
		const res: any = await clueFollowStatPage(params);
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
	fetchTableData();
};

const show = ({ row }: { row: any }) => {
	const date = props.defaultDate || {};
	searchParams.startTimeStr = date.startTimeStr || '';
	searchParams.endTimeStr = date.endTimeStr;
	searchParams.tagId = row.tagId || '';
	fetchTableData();
	dialogVisible.value = true;
};
const handleDetail = (row: any) => {
	if (!row.clueId) return;
	const url = `pc/projectManage/clue/create?pageAction=view&clueId=${row.clueId}`;
	window.open(`${ServiceUrl.getQmSysUrl()}/${url}`, '_blank');
};

defineExpose({ show });
</script>

<style lang="less" scoped>
.project-detail {
	.link-text {
		color: #165dff !important;
		cursor: pointer;
	}
}
</style>
