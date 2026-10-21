<template>
	<SmallTitle :title="`${attrs.indicatorData.indicatorName}指标-${attrs.specialLabel}`">
		<GrowthRateTable
			:tableData="areaData"
			:showPagination="true"
			:serverPageData="true"
			:total="total"
			:height="'calc(100% - 0.55rem)'"
			:tableColumns="tableColumns"
			:special-label="attrs.specialLabel || ''"
			:special-prop="'deptName'"
			:current-page="currentPage"
			:page-size="pageSize"
			@handleSortChange="handleSortChange"
			@page-change="handlePageChange"
		>
			<template #btn="{ row }">
				<div class="detail-btn" @click="handleClick(row)">详情</div>
			</template>
		</GrowthRateTable>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { ref, useAttrs } from 'vue';
import { sceneDetailList } from '@/api/EfficiencyCenter/index';
import ServiceUrl from '@/utils/url';
import SmallTitle from '../components/SmallTitle.vue';
import GrowthRateTable from '../components/GrowthRateTable.vue';

const attrs: any = useAttrs();
const areaData = ref<any>([]); // 各区对标数据

const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

const orderObj: { orderFields: string[]; orderSorts: string[] } = {
	orderFields: [], // 排序字段
	orderSorts: [], // 排序规则：asc：升序；desc：降序
};

// 使用传入的表格字段配置，如果没有则使用默认配置
// eslint-disable-next-line vue/return-in-computed-property, consistent-return
const tableColumns = computed(() => {
	// 如果从 props 传入了 tableColumns，则使用传入的配置
	if (attrs.tableColumns && attrs.tableColumns.length > 0) {
		return attrs.tableColumns;
	}
});

// 获取各区对标数据
const getData = async () => {
	if (!attrs.defaultDate) return;
	const params = {
		entity: {
			yearMonth: attrs.defaultDate,
			indicatorCode: attrs.indicatorData.indicatorCode,
			tagIds: attrs.indicatorData.indexTagId,
			departmentId: attrs.isGzwDept || attrs.isTwfDept ? '' : attrs.deptCode,
			isCityAssetManagement: attrs.isGzwDept ? '1' : '0',
			isBn: attrs.isTwfDept ? '1' : '0',
			bnDepartmentId: attrs.isTwfDept ? attrs.deptCode : '',
		},
		pageNum: currentPage.value,
		pageSize: pageSize.value,
		...orderObj,
	};
	try {
		const res: any = await sceneDetailList(params);
		if (res.code === 0) {
			areaData.value = res?.data?.records || [];
			total.value = res?.data?.total || 0;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	if (order) {
		orderObj.orderSorts[0] = order;
		orderObj.orderFields[0] = prop;
	} else {
		orderObj.orderSorts = [];
		orderObj.orderFields = [];
	}
	getData();
};

const handleClick = (item: any) => {
	const targetUrl = `enterprise-form/aggregation-detail?sceneId=${item.sceneId}&iframe_menu_key=scene&type=cityDetail&to=efficiency`;
	window.open(ServiceUrl.adminUrl + targetUrl, '_blank');
};

const handlePageChange = ({ type, value }: { type: string; value: number }) => {
	if (type === 'size') {
		pageSize.value = value;
		currentPage.value = 1;
	} else {
		currentPage.value = value;
	}
	getData();
};

watch(
	() => attrs.indicatorData,
	(oldVal, newVal) => {
		if (oldVal !== newVal) {
			getData();
		}
	},
	{
		immediate: true,
		deep: true,
	}
);

watch(
	() => attrs.defaultDate,
	(oldVal, newVal) => {
		if (oldVal !== newVal) {
			getData();
		}
	}
);
</script>
<style lang="less" scoped>
.small-title-wrapper {
	padding-bottom: 0;
	width: 0;
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
:deep(.content-part) {
	height: calc(100% - 0.37rem);
}
</style>
