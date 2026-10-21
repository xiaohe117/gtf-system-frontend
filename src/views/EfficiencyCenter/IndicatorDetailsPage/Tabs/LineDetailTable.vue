<template>
	<SmallTitle
		:class="{ 'hide-title': attrs.notIndicator }"
		:title="`${attrs.indicatorData.indicatorName}指标-${attrs.specialLabel}`"
	>
		<GrowthRateTable
			height="5.2rem"
			:tableData="areaData"
			:tableColumns="tableColumns"
			:special-label="attrs.specialLabel || ''"
			:special-prop="'deptName'"
			:current-page="currentPage"
			:page-size="pageSize"
			:showPagination="true"
			:serverPageData="true"
			:total="total"
			:showEmptyHeader="attrs.showEmptyHeader"
			@page-change="handlePageChange"
			@handleSortChange="handleSortChange"
		>
			<!-- 线索重要程度 -->
			<template #leadImportance="{ row }">
				{{ leadImportanceMap[row.leadImportance] || row.leadImportance || EmptyConst }}
			</template>
			<template #btn="{ row }">
				<div class="detail-btn" @click="handleClick(row)">详情</div>
			</template>
		</GrowthRateTable>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { EmptyConst } from '@/constanst/BaFormConstanst';
import { clueDetailPage } from '@/api/EfficiencyCenter';
import { queryClueDetailPage } from '@/api/commandCenter/deptOverview';
import ServiceUrl from '@/utils/url';
import SmallTitle from '../components/SmallTitle.vue';
import GrowthRateTable from '../components/GrowthRateTable.vue';

const attrs: any = useAttrs();

// 不是指标入口的
const areaData = ref<any>([]); // 线索明细数据
const leadImportanceMap: Record<number, string> = {
	1: '重要线索',
	2: '跨区布局线索',
	3: '其他',
};
// 使用传入的表格字段配置，如果没有则使用默认配置
// eslint-disable-next-line vue/return-in-computed-property, consistent-return
const tableColumns = computed(() => {
	// 如果从 props 传入了 tableColumns，则使用传入的配置
	if (attrs.tableColumns && attrs.tableColumns.length > 0) {
		return attrs.tableColumns;
	}
});
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

const orderObj: { orderFields: string[]; orderSorts: string[] } = {
	orderFields: [], // 排序字段，多个则以数组方式传输
	orderSorts: [], // 排序规则，多个则以数组方式传输；asc：升序；desc：降序
};
// 获取线索明细分页数据
const getData = async () => {
	if (!attrs.defaultDate || !attrs.indicatorData?.indicatorCode) return;
	console.log(22);
	const params = {
		pageNum: currentPage.value,
		pageSize: pageSize.value,
		...orderObj,
		entity: {
			indicatorCode: attrs.indicatorData?.indicatorCode,
			yearMonth: attrs.defaultDate,
			fromType: attrs.fromType || '1', // 来源类型 1-效能中心 2-一部门一页面 3-移动端
			departmentId: attrs.deptCode || undefined,
			isCityAssetManagement: attrs.isGzwDept ? '1' : '0',
		},
	};
	const res: any = await clueDetailPage(params);
	if (res.code === 0) {
		areaData.value = res.data?.records || [];
		total.value = res.data?.total || 0;
	}
};
const getSceneList = async () => {
	if (!attrs.defaultDate.startTimeStr || !attrs.defaultDate.endTimeStr) return;
	const params = {
		entity: {
			detailScopeId: attrs.detailScopeId,
			metricType: attrs.metricType,
			tabType: attrs.tabType,
			startTimeStr: attrs.defaultDate.startTimeStr,
			endTimeStr: attrs.defaultDate.endTimeStr,
		},
		pageNum: currentPage.value,
		pageSize: pageSize.value,
		...orderObj,
	};
	queryClueDetailPage(params).then((res: any) => {
		if (res.code === 0) {
			areaData.value = res.data?.records || [];
			total.value = res.data?.total || 0;
		}
	});
};
const getTableData = () => {
	// 不是指标的场景明细(投发委部门总览页用)
	if (attrs.notIndicator) {
		getSceneList();
		return;
	}
	getData();
};
const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	if (order) {
		orderObj.orderSorts[0] = order;
		orderObj.orderFields[0] = prop;
	} else {
		orderObj.orderSorts = [];
		orderObj.orderFields = [];
	}

	getTableData();
};

const handleClick = (row: any) => {
	const url = `pc/projectManage/clue/create?pageAction=view&clueId=${row.clueId}`;
	window.open(`${ServiceUrl.getQmSysUrl()}/${url}`, '_blank');
};
const handlePageChange = ({ type, value }: { type: string; value: number }) => {
	if (type === 'size') {
		pageSize.value = value;
		currentPage.value = 1;
	} else {
		currentPage.value = value;
	}

	getTableData();
};

const watchObj = computed(() => [attrs.indicatorData, attrs.defaultDate]);
watch(
	() => watchObj.value,
	() => {
		getTableData();
	},
	{
		immediate: true,
		deep: true,
	}
);
</script>
<style lang="less" scoped>
:deep(.el-table .cell) {
	padding: 0.04rem 0.08rem;
}
.small-title-wrapper {
	padding-bottom: 0;
	width: 0;
	&.hide-title {
		padding: 0;
		:deep(.title-part) {
			display: none;
		}
	}
}
.tips {
	color: #202741;
	float: right;
	margin-top: -0.16rem;
}
.detail-btn {
	color: #2d8cf0;
	cursor: pointer;
}
</style>
