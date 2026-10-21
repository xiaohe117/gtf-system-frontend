<template>
	<SmallTitle :class="{ 'hide-title': attrs.notIndicator }" title="走访明细" v-loading="loading">
		<template #append>
			<el-input
				v-model="searchKeyword"
				placeholder="请输入企业名称/单位名称/对接内容"
				clearable
				class="search-input"
				@clear="handleSearch"
			/>
			<el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
			<el-button class="reset-btn" @click="handleReset">重置</el-button>
		</template>
		<GrowthRateTable
			:showPagination="true"
			:serverPageData="true"
			:height="'calc(100% - 0.58rem)'"
			:tableData="areaData"
			:tableColumns="tableColumns"
			:current-page="currentPage"
			:page-size="pageSize"
			:total="pageTotal"
			:showEmptyHeader="attrs.showEmptyHeader"
			@handleSortChange="handleSortChange"
			@page-change="handlePageChange"
		>
			<template #companyName="{ row }">
				<span class="link-text" @click="handleDetail(row)">
					{{ row.companyName || '—' }}
				</span>
			</template>
			<template #isTargetEnt="scope">
				<div>{{ scope?.row?.isTargetEnt === '1' ? '是' : '否' }}</div>
			</template>
			<template #startTime="{ row }">
				<div>{{ row.startTime ? row.startTime.split(' ')[0] : '—' }}</div>
			</template>
			<template #fillTime="scope">
				<div>{{ scope?.row?.fillTime?.split('.')[0] || '—' }}</div>
			</template>
			<template #cityLeaderName="{ row }">
				<span>{{ row.cityLeaderName || '—' }}</span>
			</template>
			<template #entTags="{ row }">
				<span>{{ row.entTags || '—' }}</span>
			</template>
			<template #action="{ row }">
				<div class="detail-btn" @click="handleTableDetail(row)">详情</div>
			</template>
		</GrowthRateTable>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { ref, useAttrs, onMounted } from 'vue';
import ServiceUrl from '@/utils/url';
// import { useRouter } from 'vue-router';
import SmallTitle from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/SmallTitle.vue';
import GrowthRateTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/GrowthRateTable.vue';
import { cityRecordList } from '@/api/commandCenter/visitOverview';

// const router = useRouter();
const attrs: any = useAttrs();

// 定义 props 接收参数
const props = defineProps({
	defaultDate: {
		type: Object,
		default: () => ({}),
	},
	searchParams: {
		type: Object,
		default: () => ({}),
	},
	tableColumns: {
		type: Array,
		default: () => [],
	},
});

const areaData = ref<any[]>([]);
const orderProp = ref<string>('');
const searchKeyword = ref<string>('');
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const pageTotal = ref<number>(0);
const loading = ref<boolean>(false);

// 获取数据
const fetchData = async () => {
	loading.value = true;
	const params: any = {
		// comprehensiveSearch: searchKeyword.value,
		...props.searchParams,
		queryRequest: {
			pageNum: currentPage.value,
			pageSize: pageSize.value,
		},
	};
	try {
		const res: any = await cityRecordList(params);
		if (res.code === 0) {
			areaData.value = res?.data?.records || [];
			pageTotal.value = res?.data?.total;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	} finally {
		loading.value = false;
	}
};

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	orderProp.value = prop;
	areaData.value = areaData.value.sort((a: any, b: any) => {
		if (order === 'asc') {
			return Number(a[prop]) - Number(b[prop]);
		}
		return Number(b[prop]) - Number(a[prop]);
	});
};

const handleDetail = (row: any) => {
	// const routeData = router.resolve({
	// 	name: 'EnterpriseDetails',
	// 	query: {
	// 		name: row.companyName,
	// 		sccode: row.sccode,
	// 		targetId: row.targetId,
	// 		isTargetEnt: row.isTargetEnt,
	// 	},
	// });
	// window.open(routeData.href, '_blank');

	const targetUrl = `enterprise-form/enterprise-details?name=${row.companyName}&sccode=${row.sccode}&targetId=${row.targetId}&isTargetEnt=${row.isTargetEnt}`;
	window.open(ServiceUrl.adminUrl + targetUrl, '_blank');
};

const handleTableDetail = (row: any) => {
	// const routeData = router.resolve({
	// 	path: '/operationCenter/enterprise',
	// 	query: {
	// 		url: `/enterprise-form/business-records/BusinessRecordsDetails?type=Details&id=${row.id}&roleType=0`,
	// 	},
	// });
	// window.open(routeData.href, '_blank');

	const targetUrl = `enterprise-form/business-records/BusinessRecordsDetails?type=Details&id=${row.id}&roleType=0`;
	window.open(ServiceUrl.adminUrl + targetUrl, '_blank');
};

const handleSearch = () => {
	currentPage.value = 1;
	fetchData();
};

const handleReset = () => {
	searchKeyword.value = '';
	currentPage.value = 1;
	fetchData();
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

onMounted(() => {
	fetchData();
});
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
	height:100%
	// height: calc(100% - 0.0rem);
}


.link-text {
	color: #2d8cf0;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
}
</style>
