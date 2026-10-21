<template>
	<SmallTitle
		:class="{ 'hide-title': attrs.notIndicator }"
		:title="`${attrs.indicatorData.indicatorName}指标-${attrs.specialLabel}`"
	>
		<template #append>
			<el-input
				v-model="searchKeyword"
				placeholder="请输入企业名称/单位名称/对接内容"
				clearable
				class="search-input"
				@clear="handleSearch"
			/>
			<!--<TagsSelect v-model="tagIds" />-->
			<el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
			<el-button class="reset-btn" @click="handleReset">重置</el-button>
		</template>
		<GrowthRateTable
			:showPagination="true"
			:serverPageData="true"
			:total="total"
			:height="'calc(100% - 0.58rem)'"
			:tableData="areaData"
			:tableColumns="tableColumns"
			:special-label="attrs.specialLabel || ''"
			:special-prop="'deptName'"
			:current-page="currentPage"
			:page-size="pageSize"
			:showEmptyHeader="attrs.showEmptyHeader"
			@handleSortChange="handleSortChange"
			@page-change="handlePageChange"
		>
			<template #btn="{ row }">
				<div class="detail-btn" @click="handleClick(row)">详情</div>
			</template>
			<!--<template #entTags="{ row }">
				<EntTagsView :value="row.entTags" />
			</template>-->
		</GrowthRateTable>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { ref, useAttrs } from 'vue';
// import EntTagsView from '@/components/EntTagsView.vue';
import ServiceUrl from '@/utils/url';
import { visitDetailList } from '@/api/EfficiencyCenter/index';
import SmallTitle from '../components/SmallTitle.vue';
import GrowthRateTable from '../components/GrowthRateTable.vue';
// import TagsSelect from '../components/TagsSelect.vue';

const attrs: any = useAttrs();
const areaData = ref<any>([]); // 各区对标数据

const searchKeyword = ref<string>(''); // 搜索关键词
const tagIds = ref<string>('');
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
	let params: any = {
		entity: {
			comprehensiveSearch: searchKeyword.value,
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
	// 不是指标的走访明细(投发委部门总览页用)
	if (attrs.notIndicator) {
		params = {
			entity: {
				...attrs.searchParams,
				startTimeStr: attrs.defaultDate.startTimeStr,
				endTimeStr: attrs.defaultDate.endTimeStr,
			},
			pageNum: currentPage.value,
			pageSize: pageSize.value,
			...orderObj,
		};
	}
	try {
		const res: any = await visitDetailList(params);
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
	const targetUrl = `enterprise-form/business-records/BusinessRecordsDetails?type=Details&id=${item.activityId}&roleType=1`;
	window.open(ServiceUrl.adminUrl + targetUrl, '_blank');
};
// 搜索处理
const handleSearch = () => {
	currentPage.value = 1;
	getData();
};

const handleReset = () => {
	searchKeyword.value = '';
	tagIds.value = '';
	currentPage.value = 1;
	getData();
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

// 对话框打开时获取数据（替代 watch 的 immediate）
onMounted(() => {
	getData();
});

// 切换时间周期后重新拉取走访明细
watch(
	() => attrs.defaultDate,
	() => {
		currentPage.value = 1;
		getData();
	}
);
</script>
<style lang="less" scoped>
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
.search-input {
	width: 4rem;
	margin-left: 0.2rem;
	margin-right: 0.2rem;
	:deep(.el-input__wrapper) {
		background-color: rgba(47, 107, 239, 0.05);
		border-color: #2f6bef;
		box-shadow: none;
		border: 0.01rem solid #999;
	}
	:deep(.el-input__inner) {
		color: #202741;
		&::placeholder {
			color: #999;
		}
	}
}
:deep(.el-cascader) {
	width: 3.5rem !important;
	height: 0.44rem !important;
	.el-input {
		height: 100%;
	}
	.el-cascader__tags {
		flex-wrap: nowrap;
		align-items: center;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		.el-tag {
			&:first-child {
				min-width: 0;
			}
		}
		.el-cascader__search-input {
			min-width: 0;
		}
	}
}
.search-btn {
	padding: 0.2rem 0.3rem;
	margin-left: 0.2rem;
}
.reset-btn {
	width: 1rem;
	&:hover {
		color: #000;
		border: 0.01rem solid #ccc;
		background: #fff;
	}
}
:deep(.content-part) {
	height: calc(100% - 0.37rem);
}
</style>
