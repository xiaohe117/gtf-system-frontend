<template>
	<GDialog
		v-model="dialogVisible"
		title="企业明细"
		width="18rem"
		:align-center="true"
		:close-on-click-modal="false"
		:teleported="false"
		:append-to-body="false"
		destroy-on-close
		class="dept-detail-dialog"
	>
		<div class="ent-detail">
			<!-- 搜索筛选区域 -->
			<div class="search-area">
				<el-input
					v-model="searchParams.comprehensiveSearch"
					placeholder="请输入企业名称/统一信用代码/注册地址/企业别称"
					clearable
					class="search-input"
					@keyup.enter="handleSearch"
				>
					<template #prefix>
						<el-icon><Search /></el-icon>
					</template>
				</el-input>

				<el-button type="primary" @click="handleSearch">搜索</el-button>
				<el-button @click="handleReset">重置</el-button>
				<div class="sort-select">
					<span class="label">排序</span>
					<el-select
						v-model="searchParams.orderByField"
						placeholder="按企业标签"
						clearable
						class="filter-select"
						@change="handleSearch"
					>
						<el-option
							v-for="item in sortOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</div>
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
					<template #companyName="{ row }">
						<span class="link-text" @click="handleDetail(row)">
							{{ row.companyName }}
						</span>
					</template>
					<template #tag="{ row }">
						<TagsTableView :value="row.entTags" />
					</template>
					<template #unitDeptName="{ row }">
						{{ getInnerBracket(row.unitDeptName) }}
					</template>
				</GrowthRateTable>
			</div>
		</div>
	</GDialog>
</template>

<script setup lang="ts">
import ServiceUrl from '@/utils/url';
import { getSize } from '@/utils';
import { Search } from '@element-plus/icons-vue';
import GrowthRateTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/GrowthRateTable.vue';
import { cityWideTargetEntList } from '@/api/commandCenter/deptOverview';
import GDialog from '@/components/dialog/GDialog.vue';
import TagsTableView from './TagsTableView.vue';

const props = defineProps({
	defaultDate: {
		type: Object,
		default: () => ({}),
	},
});

const getInnerBracket = (str: string) => {
	if (!str) return '';
	const match = str.match(/（(.+?)）/);
	return match?.[1] || str;
};

const dialogVisible = ref(false);
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const sortOptions = ref<{ label: string; value: string }[]>([
	{ label: '按企业标签', value: '1' },
	{ label: '按创建时间', value: '2' },
]);

const currentPage = ref(1);
const pageSize = ref(10);

const searchParams = reactive({
	comprehensiveSearch: '',
	orderByField: '1',
	tagIds: '',
	startTimeStr: '',
	endTimeStr: '',
	unitCode: '',
	unitName: '',
	columnKey: '',
	unitType: '',
	unitLevel: '',
});

const tableColumns = [
	{
		label: '序号',
		type: 'index',
		fixWidth: String(getSize(80)),
		align: 'left',
	},
	{
		prop: 'companyName',
		label: '目标企业名称',
		headerAlign: 'center',
		width: String(getSize(200)),
		align: 'left',
		type: 'slot',
		slotName: 'companyName',
	},
	{
		prop: 'registeredAddress',
		label: '注册地址',
		width: String(getSize(200)),
		headerAlign: 'center',
		align: 'left',
	},
	{ prop: 'industryTypeName', label: '产业体系', width: String(getSize(160)), align: 'center' },
	{
		prop: 'entTags',
		label: '企业标签',
		width: String(getSize(200)),
		align: 'left',
		headerAlign: 'center',
		type: 'slot',
		slotName: 'tag',
		showToolTip: false,
	},
	{
		prop: 'unitDeptName',
		label: '办内责任分局',
		width: String(getSize(140)),
		align: 'center',
		type: 'slot',
		slotName: 'unitDeptName',
		showToolTip: false,
	},
	{
		prop: 'followUnitName',
		label: '责任市级单位',
		width: String(getSize(160)),
		headerAlign: 'center',
		align: 'left',
	},
];
const fetchTableData = async () => {
	loading.value = true;
	try {
		const params = {
			pageNum: currentPage.value,
			pageSize: pageSize.value,
			// 去除空字符
			entity: Object.fromEntries(
				Object.entries(searchParams).filter(([, v]) => v !== ''),
			),
		};
		const res: any = await cityWideTargetEntList(params);
		tableData.value = res.data?.records || [];
		total.value = Number(res.data?.total || 0) || 0;
	} catch {
		tableData.value = [];
		total.value = 0;
	} finally {
		loading.value = false;
	}
};

const resetParams = () => {
	searchParams.comprehensiveSearch = '';
	searchParams.orderByField = '1';
	searchParams.tagIds = '';
	searchParams.startTimeStr = '';
	searchParams.endTimeStr = '';
	searchParams.unitCode = '';
	searchParams.unitName = '';
	searchParams.unitType = '';
	searchParams.columnKey = '';
	searchParams.unitLevel = '';
};
const handleSearch = () => {
	currentPage.value = 1;
	fetchTableData();
};

const handleReset = () => {
	searchParams.comprehensiveSearch = '';
	searchParams.orderByField = '';
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

const show = (row: any, col: any) => {
	resetParams();
	// 该列查询不带日期参数
	if (!col.notDateParams) {
		const date = props.defaultDate || {};
		searchParams.startTimeStr = date.startTimeStr;
		searchParams.endTimeStr = date.endTimeStr;
	}
	searchParams.tagIds = row.tagId;
	searchParams.unitCode = row.unitCode || '';
	searchParams.unitName = row.unitName || '';
	searchParams.columnKey = row.columnKey || '';
	searchParams.unitType = row.unitType || ''
	searchParams.unitLevel = row.unitLevel || ''
	fetchTableData();
	dialogVisible.value = true;
};
const handleDetail = (row: any) => {
	
	const params = new URLSearchParams({
		name: row.companyName,
		sccode: row.sccode,
		targetId: row.targetId,
		respLeader: row.respLeader,
		labelType: row.labelType,
	});
	const url = `${ServiceUrl.adminUrl}enterprise-form/enterprise-details?${params.toString()}`;
	window.open(url, '_blank');
};
defineExpose({ show });
</script>

<style lang="less" scoped>
.ent-detail {
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

	.link-text {
		color: #165dff !important;
		cursor: pointer;
	}
}
</style>
