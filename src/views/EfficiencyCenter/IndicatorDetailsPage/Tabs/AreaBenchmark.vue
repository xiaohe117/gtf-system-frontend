<template>
	<SmallTitle :title="`${attrs.indicatorData.indicatorName}指标-${attrs.specialLabel}`">
		<template #append v-if="showSearchInput">
			<el-input
				v-model="searchKeyword"
				:placeholder="placeholderMsg"
				clearable
				class="search-input"
				@clear="handleSearch"
			/>
			<el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
		</template>

		<GrowthRateTable
			:showPagination="
				attrs.specialLabel === '部门监测' || attrs.specialLabel === '国企监测'
					? true
					: false
			"
			:height="
				attrs.specialLabel === '部门监测' || attrs.specialLabel === '国企监测'
					? 'calc(100% - 0.41rem)'
					: '5.6rem'
			"
			:tableData="areaData"
			:tableColumns="tableColumns"
			:special-label="attrs.specialLabel || ''"
			:special-prop="'deptName'"
			:current-page="currentPage"
			:page-size="pageSize"
			@handleSortChange="handleSortChange"
			@page-change="handlePageChange"
		/>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { ref, useAttrs, computed } from 'vue';
import { queryTabData } from '@/api/dailyMonitoring/indicatorDetailsPage';
import SmallTitle from '../components/SmallTitle.vue';
import GrowthRateTable from '../components/GrowthRateTable.vue';

const attrs: any = useAttrs();
const areaData = ref<any>([]); // 各区对标数据
const searchKeyword = ref<string>(''); // 搜索关键词
const orderProp = ref<string>(''); // 排序字段
const unitMeasurement = ref<string>(''); // 单位

const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

// 是否显示搜索输入框（仅"部门监测"和"国企监测"显示）
const showSearchInput = computed(() => {
	const label = attrs.specialLabel;
	return label === '部门监测' || label === '国企监测';
});

const placeholderMsg = computed(() => {
	const label = attrs.specialLabel;
	if (label === '部门监测') {
		return '请输入部门类别/部门名称';
		// eslint-disable-next-line no-else-return
	} else if (label === '国企监测') {
		return '请输入国企类别/国企名称';
	}
	return '';
});

// 使用传入的表格字段配置，如果没有则使用默认配置，并动态替换 {{unit}} 占位符
const tableColumns = computed(() => {
	// 如果从 props 传入了 tableColumns，则使用传入的配置
	if (attrs.tableColumns && attrs.tableColumns.length > 0) {
		const unit = unitMeasurement.value;
		return attrs.tableColumns.map((col: any) => ({
			...col,
			label: col.label.replace(/\{\{unit\}\}/g, unit ? `（${unit}）` : ''),
		}));
	}
	return [];
});

// 获取各区对标数据
const getTabData = async (defaultDate: any) => {
	areaData.value = [];
	if (!defaultDate) return;
	const params = {
		indicatorCode: attrs.indicatorData.indicatorCode,
		tabType: attrs.tagId || '',
		yearMonth: defaultDate,
		searchKeyword: searchKeyword.value,
	};
	try {
		const res = await queryTabData({ params });
		if (res.code === 0) {
			currentPage.value = 1;
			pageSize.value = 10;
			const { data } = res as any;
			// 数据为空时不处理
			// if (!data || !data.length) return;
			// 删除第一条数据
			// const dataWithoutFirst = data.slice(1);
			const maxGrowRate = Math.max(...data.map((item: any) => Number(item.monthOnMonth)));
			const maxTotal = Math.max(...data.map((item: any) => Number(item.monthDone)));
			areaData.value = data.map((item: any) => ({
				newGrowRate:
					Number(item.monthOnMonth) <= 0
						? 0
						: (Number(item.monthOnMonth) / maxGrowRate) * 100,
				newCityGrow:
					Number(item.cityGrow) <= 0 ? 0 : (Number(item.cityGrow) / maxGrowRate) * 100,
				newTotalRate:
					Number(item.monthDone) <= 0 ? 0 : (Number(item.monthDone) / maxTotal) * 100,
				...item,
			}));
			unitMeasurement.value = areaData.value.find((item: any) => item.unit)?.unit;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

// 搜索处理
const handleSearch = () => {
	getTabData(attrs.defaultDate);
};

const getData = () => {
	getTabData(attrs.defaultDate);
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

const handlePageChange = ({ type, value }: { type: string; value: number }) => {
	if (type === 'size') {
		pageSize.value = value;
		currentPage.value = 1;
	} else {
		currentPage.value = value;
	}
};

watch(
	() => attrs.indicatorData,
	(oldVal, newVal) => {
		console.log('attrs.indicatorData,', attrs.indicatorData);
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
.search-input {
	width: 3rem;
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
}
:deep(.content-part) {
	height: calc(100% - 0.4rem);
}
</style>
