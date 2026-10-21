<template>
	<GDialog
		v-model="dialogVisible"
		:title="`${tableTypeName}明细`"
		width="18rem"
		:align-center="true"
		:close-on-click-modal="false"
		:teleported="false"
		:append-to-body="false"
		destroy-on-close
		class="dept-detail-dialog"
	>
		<div class="project-detail">
			<div class="search-area">
				<el-input
					v-model.trim="searchParams.projectName"
					:placeholder="`请输入${tableTypeName}名称`"
					clearable
					class="search-input"
					maxlength="100"
				>
					<template #prefix>
						<el-icon><Search /></el-icon>
					</template>
				</el-input>

				<el-button type="primary" @click="handleSearch">搜索</el-button>
				<el-button @click="handleReset">重置</el-button>
			</div>
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
import { projectProgressDetailPage } from '@/api/commandCenter/deptOverview';
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

const searchParams: any = reactive({
	startTimeStr: '',
	endTimeStr: '',
});

const tableType = ref('project'); // 列表类型project：项目，clue:线索
const tableTypeName = computed(() => (tableType.value === 'project' ? '项目' : '线索')); // 列表类型project：项目，clue:线索
const tableColumns = computed(() => [
	{
		label: '序号',
		type: 'index',
		fixWidth: String(getSize(80)),
		align: 'left',
	},
	{
		prop: 'rowTypeName',
		label: '汇总数名称',
		width: String(getSize(120)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'indicatorTypeName',
		label: '指标类型',
		width: String(getSize(120)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'dataTypeName',
		label: '类型',
		width: String(getSize(120)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		prop: 'projectName',
		label:`${tableTypeName.value}名称`,
		headerAlign: 'center',
		width: String(getSize(220)),
		align: 'left',
	},
	{
		prop: 'investAmount',
		label: '金额(亿元)',
		width: String(getSize(160)),
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
]);

const fetchTableData = async () => {
	loading.value = true;
	try {
		const params: Record<string, any> = {
			pageNum: currentPage.value,
			pageSize: pageSize.value,
		};
		const entity: any = {};
		// 仅拼接有值的查询参数
		Object.entries(searchParams).forEach(([k, v]) => {
			if (v !== '' && v !== undefined && v !== null) {
				entity[k] = v;
			}
		});
		const res: any = await projectProgressDetailPage({ ...params, entity });
		tableData.value = res.data?.records || [];
		total.value = Number(res.data?.total || 0) || 0;
	} catch {
		tableData.value = [];
		total.value = 0;
	} finally {
		loading.value = false;
	}
};
const handleSearch = () => {
	currentPage.value = 1;
	fetchTableData();
};
const handleReset = () => {
	searchParams.projectName = '';
	currentPage.value = 1;
	fetchTableData();
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

const show = ({ row, col }: { row: any; col?: any }) => {
	tableType.value = col.indicatorType === 'CLUE_COUNT' ? 'clue' : 'project';
	const date = props.defaultDate || {};
	searchParams.startTimeStr = date.startTimeStr || '';
	searchParams.endTimeStr = date.endTimeStr || '';
	searchParams.deptCode = row.unitCode || '';
	searchParams.indicatorType = col.indicatorType || '';
	fetchTableData();
	dialogVisible.value = true;
};

const handleDetail = (row: any) => {
	if (!row.projectId) return;
	let url = `/pc/projectManage/create?projectId=${row.projectId}&pageAction=view`;
	if (tableType.value === 'clue') {
		url = `pc/projectManage/clue/create?pageAction=view&clueId=${row.projectId}&hideOverviewActions=1`;
	}
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
	.search-area {
		display: flex;
		align-items: center;
		gap: 0.12rem;
		margin-bottom: 0.16rem;
		flex-wrap: wrap;

		.search-input {
			width: 5rem;
		}

		.sort-select {
			margin-left: auto;
			.label {
				margin-right: 0.16rem;
			}
			.filter-select {
				width: 1.8rem;
			}
		}
	}
	.el-button {
		--el-button-hover-bg-color: #165dff;
		--el-button-hover-hover-color: #165dff;
	}
}
</style>
