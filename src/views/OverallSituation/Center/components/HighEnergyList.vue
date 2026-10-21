<template>
	<div class="high-energy-list">
		<el-tabs v-model="curTab">
				<el-tab-pane
					v-for="(item,index) in dockDynamicTabs"
					:label="item"
					:name="index"
					:key="index"
				>
				 <template #label>
					 <span>{{ item }}</span>
					<span
						class="tips-icon"
						@click.stop="handleTipsDialog(`tipsDialog${index + 1}`)"
					></span>
					
				</template>
				</el-tab-pane>
			</el-tabs>
		<div class="right-box fx-c">
			<MultiHeaderTable
				class="table-box fx-h"
				:tableData="tableData"
				:columns="columns"
				height="100%"
				:hasOrder="true"
				:current="page.pageNum"
				:size="page.pageSize"
			>
				<!-- ✅ 产业类型表头插槽 -->
				<template #industryTypeHeader="{ column, onFilterChange }">
					<FilterSelectHeader
						:model-value="selectQuery.industryType"
						:label="column.label"
						:options="industryTypeFilters"
						@update:model-value="
							(val: any) => handleSelectChange(column.prop, val, onFilterChange)
						"
					/>
				</template>
				<!-- ✅ 项目性质表头插槽 -->
				<template #projectNatureHeader="{ column, onFilterChange }">
					<FilterSelectHeader
						:model-value="selectQuery.projectNature"
						:label="column.label"
						:options="projectNatureFilters"
						@update:model-value="
							(val: any) => handleSelectChange(column.prop, val, onFilterChange)
						"
					/>
				</template>
				<!-- ✅ 拟落户区表头插槽 -->
				<template #locationDistrictHeader="{ column, onFilterChange }">
					<FilterSelectHeader
						:model-value="selectQuery.locationDistrict"
						:label="column.label"
						:options="locationDistrictFilters"
						@update:model-value="
							(val: any) => handleSelectChange(column.prop, val, onFilterChange)
						"
					/>
				</template>
				<template #projectName="{ row }">
					<div class="project-name" @click="goDetail(row)">
						{{ row.projectName }}
					</div>
				</template>
			</MultiHeaderTable>
			<div class="page-box">
				<el-pagination
					v-model:page-size="page.pageSize"
					v-model:current-page="page.pageNum"
					:pager-count="7"
					layout="total,prev, pager, next"
					:total="page.total"
					@current-change="handleCurrentChange"
				/>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import ServiceUrl from '@/utils/url'
import { getSize } from '@/utils/index';
import useStatusStore from '@/stores/status';
import { highProjectList, higScreeningList } from '@/api/OverallSituation/index';
import FilterSelectHeader from './FilterSelectHeader.vue';


// const props = defineProps({
// 	curTab: {
// 		type: Number,
// 		default: 0,
// 	},
// });
const { actTabValue, yearSelectValue } = storeToRefs(useStatusStore());
const dockDynamicTabs = ref<any>(['100亿+项目', '10亿+项目', '工业项目', '外资项目']);
const curTab = ref(0);
const emits = defineEmits(['handleTipsDialog'])
const handleTipsDialog = (name:any) => {
	emits('handleTipsDialog',name)
}
// 获取表头的下拉框选项
const industryTypeFilters = ref([]);
const projectNatureFilters = ref([]);
const locationDistrictFilters = ref([]);
const getHigScreeningList = () => {
	const params = {
		tag: curTab.value + 1,
	};
	higScreeningList(params).then((res: any) => {
		const { code, data = [] } = res;
		if (code === 0) {
			industryTypeFilters.value = data?.[0]?.industryType;
			projectNatureFilters.value = data?.[0]?.projectNature;
			locationDistrictFilters.value = data?.[0]?.locationDistrict;
		} else {
			industryTypeFilters.value = [];
			projectNatureFilters.value = [];
			locationDistrictFilters.value = [];
		}
	});
};

// 表格列属性
const columns = computed(() => {
	const arr = [
		{
			prop: 'projectName',
			label: '项目名称',
			align: 'left',
			width: getSize(240),
			type: 'slot',
			slotName: 'projectName',
		},
		{
			prop: 'industryType',
			label: '产业类型',
			align: 'left',
			width: getSize(160),
			type: 'filter',
		},
		{
			prop: 'projectNature',
			label: '项目性质',
			align: 'center',
			type: 'filter',
			width: getSize(140),
		},
		{
			prop: 'investmentAmount',
			label: '预计投资总额/\n亿元',
			align: 'center',
			width: getSize(160),
		},
		{
			prop: 'annualRevenue',
			label: '预计达产年产值\n营收/亿元',
			align: 'center',
			width: getSize(170),
		},
		{
			prop: 'locationDistrict',
			label: '拟落户区',
			align: 'center',
			type: 'filter',
			width: getSize(140),
		},
	];
	return arr;
});
const tableData = ref([]);
const page = reactive<{
	pageNum: number;
	pageSize: number;
	total: number;
}>({
	pageNum: 1,
	pageSize: 7,
	total: 0,
});
const selectQuery = ref<any>({
	industryType: '',
	projectNature: '',
	locationDistrict: '',
});
// 获取表格数据
const getHighProjectList = () => {
	tableData.value = [];
	const params = {
		tag: curTab.value + 1,
		queryRequest: {
			pageSize: page.pageSize,
			pageNum: page.pageNum,
		},
		...selectQuery.value,
		date: actTabValue.value === '0' ? '' : yearSelectValue.value || '',
	};
	highProjectList(params).then((res: any) => {
		const { code, data = {} } = res;
		if (code === 0) {
			tableData.value = data?.records;
			page.total = data?.total;
		}
	});
};

const handleSelectChange = (column: any, val: any, onFilterChange: Function) => {
	onFilterChange(column, val);
	selectQuery.value[column] = val;
	getHighProjectList();
};

const handleCurrentChange = () => {
	getHighProjectList();
};

const goDetail = (vl: any) => {
	console.log('vl', vl.projectId);
	window.open(`${ServiceUrl.getQmSysUrl()}/pc/projectManage/project/detail?projectId=${vl.projectId}`,)
};

watch(
	() => curTab.value,
	() => {
		// 切换tab后，要初始化值
		page.pageNum = 1;
		Object.keys(selectQuery.value).forEach((key) => {
			selectQuery.value[key] = '';
		});
		getHigScreeningList();
		getHighProjectList();
	}
);

onMounted(() => {
	getHigScreeningList();
	getHighProjectList();
});

watch(
	() => [actTabValue.value, yearSelectValue.value],
	() => {
		getHighProjectList();
	}
);
</script>

<style lang="less" scoped>
.high-energy-list {
	flex: 1;
	display: flex;
	flex-direction: column;
	margin-top: 0.08rem !important;
	.el-tabs{
		margin-bottom: 0.08rem;
	}
	.tips-icon {
		cursor: pointer;
		display: inline-block;
		width: 0.2rem;
		height: 0.2rem;
		background-image: url('@/assets/images/OverallSituation/tips-icon.png');
		background-size: 100% 100%;
	}
	.right-box {
		// width: calc(100% - 1.86rem);
		width: 100%;
		flex: 1;
		&.has-tab {
			.table-box {
				height: calc(100% - 0.34rem - 0.12rem);
			}
		}
		.table-box {
			// height: 100%;
		}
		.project-name {
			// font-size: 0.14rem;
			color: #165dff;
			line-height: 0.18rem;
			cursor: pointer;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		:deep(.tabs-control) {
			width: 100%;
			.tabs-control_item {
				width: 50%;
			}
			margin-bottom: 0.12rem;
		}
	}
}
:deep(div.el-table thead th.el-table__cell) {
	padding: 0;
	min-height: 0.4rem;
}
:deep(div.el-table thead) {
	.cell {
		min-height: 0.4rem;
		line-height: normal;
		display: flex;
		align-items: center;
	}
}
:deep(div.el-table td.el-table__cell) {
	padding: 0;
	height: 0.38rem;
}
.page-box {
	display: flex;
	justify-content: flex-end;
	margin-top: 0.12rem;
	box-sizing: border-box;

	:deep(.el-pagination) {
		width: 100%;
		justify-content: flex-end;
		font-size: @g-font-size-base;
		color: rgba(0, 0, 0, 0.6);
		background-color: transparent;
		--el-pagination-bg-color: transparent;
		--el-pagination-button-disabled-bg-color: transparent;
		.el-pager {
			gap: 0.08rem;
			li {
				width: 0.32rem;
				height: 0.3rem;
				line-height: 0.3rem;
				border-radius: 0.03rem;
				background: rgba(255, 255, 255, 0.9);
				border: 0.01rem solid #dcdcdc;
				padding: 0;
				font-size: @g-font-size-base;
				min-width: 0.32rem;
				&.is-active {
					font-weight: 400;
					border: 0.01rem solid #165dffff;
					color: #165dff;
				}
			}
		}
	}
}
</style>
