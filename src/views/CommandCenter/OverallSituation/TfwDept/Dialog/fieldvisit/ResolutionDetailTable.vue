<template>
	<SmallTitle :class="{ 'hide-title': attrs.notIndicator }" title="走访明细" v-loading="loading">
		<template #append>
			<el-input
				v-model="searchKeyword"
				placeholder="请输入企业名称/信用代码/内容"
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
			<!-- companyName：企业名称；为空不跳转 -->
			<template #companyName="{ row }">
				<span
					:class="{ 'link-text': !!row.companyName }"
					@click="handleDetail(row)"
				>
					{{ row.companyName || '—' }}
				</span>
			</template>
			<!-- sccode：信用代码 -->
			<template #sccode="{ row }">
				<div>{{ row.sccode || '—' }}</div>
			</template>
			<!-- eventDescription：内容 -->
			<template #eventDescription="{ row }">
				<div>{{ row.eventDescription || '—' }}</div>
			</template>
			<!-- expectedCompleteDate：时间，统一展示为 YYYY-MM-DD -->
			<template #expectedCompleteDate="{ row }">
				<div>{{ formatCompleteDate(row.expectedCompleteDate) }}</div>
			</template>
			<!-- unitName：部门 -->
			<template #unitName="{ row }">
				<div>{{ row.unitName || '—' }}</div>
			</template>
			<!-- 操作：详情跳转 -->
			<template #action="{ row }">
				<div class="detail-btn" @click="handleTableDetail(row)">详情</div>
			</template>
		</GrowthRateTable>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { ref, useAttrs, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import ServiceUrl from '@/utils/url';
import SmallTitle from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/SmallTitle.vue';
import GrowthRateTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/components/GrowthRateTable.vue';
import { getresolutionList } from '@/api/commandCenter/visitOverview';
import getTableColumnsResolutionConfig from './columns';

const router = useRouter();

const attrs: any = useAttrs();

const props = defineProps({
	defaultDate: {
		type: Object,
		default: () => ({}),
	},
	searchParams: {
		type: Object,
		default: () => ({}),
	},
});

/** 按 columnKey 切换 eventDescription 表头：企业诉求 / 议定事项 */
const tableColumns = computed(() =>
	getTableColumnsResolutionConfig((props.searchParams as any)?.columnKey)
);
const areaData = ref<any[]>([]);
const orderProp = ref<string>('');
const searchKeyword = ref<string>('');
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const pageTotal = ref<number>(0);
const loading = ref<boolean>(false);

/** 获取议定事项 / 企业诉求列表 */
const fetchData = async () => {
	loading.value = true;
	const params: any = {
		...props.searchParams,
		queryRequest: {
			pageNum: currentPage.value,
			pageSize: pageSize.value,
		},
	};
	try {
		const res: any = await getresolutionList(params);
		if (res.code === 0) {
			areaData.value = res?.data?.records || [];
			pageTotal.value = res?.data?.total;
		}
	} catch (error) {
		console.error('Error fetching resolution list:', error);
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

/** 将接口 expectedCompleteDate 统一转为 YYYY-MM-DD */
const formatCompleteDate = (dateStr: string | number | null | undefined) => {
	if (dateStr === null || dateStr === undefined || dateStr === '') return '—';
	const d = dayjs(dateStr);
	return d.isValid() ? d.format('YYYY-MM-DD') : '—';
};

/**
 * 企业名称跳转：与「产生项目」CityRecordDetailTable 保持一致
 * 企业名称为空时不跳转
 */
const handleDetail = (row: any) => {
	if (!row?.companyName) return;
	const targetUrl = `enterprise-form/enterprise-details?name=${row.companyName}&sccode=${row.sccode}&targetId=${row.targetId}&isTargetEnt=${row.isTargetEnt}`;
	window.open(ServiceUrl.adminUrl + targetUrl, '_blank');
};

/**
 * 操作-详情：议定事项/企业诉求详情页（新开一页）
 * 路由名 AgendaItemsAndIssueFeedbackDetails
 */
const handleTableDetail = (row: any) => {
	const query = {
		activityId: row.activityId || row.recordId || '',
		id: row.itemId || row.id || '',
		resolutionId: row.resolutionId || '',
	};
	let href = '';
	try {
		const named = router.resolve({
			name: 'AgendaItemsAndIssueFeedbackDetails',
			query,
		});
		// 命名路由存在且匹配到才用 name，否则走 path（redirectArr 会转到运营端）
		href =
			named.matched?.length > 0
				? named.href
				: router.resolve({
						path: '/enterprise-form/agendaItems-andIssue-feedback-details',
						query,
					}).href;
	} catch {
		href = router.resolve({
			path: '/enterprise-form/agendaItems-andIssue-feedback-details',
			query,
		}).href;
	}
	window.open(href, '_blank');
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
	height: 100%;
}
.link-text {
	color: #2d8cf0;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
}
.detail-btn {
	color: #2d8cf0;
	cursor: pointer;
}
</style>
