<template>
	<div class="fx-1 content">
		<SmallTitle>
			<template #title>
				<TextRotation :text="`${attrs.indicatorData.indexTitle}指标-主要品类分析`" />
				<el-radio-group class="mg-l" v-model="dateCode" @change="getData" size="small">
					<el-radio-button
						v-for="item in searchTab"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-radio-group>
			</template>

			<div v-if="!isChartEmpty" class="fx-r">
				<BaseChart
					:chartOption="chartOption"
					width="100%"
					height="5.6rem"
					v-bind="$attrs"
					:isEmpty="isChartEmpty"
					@click="handleClick"
					class="left-box"
				/>
				<simple-table
					class="right-box"
					:height="'5.7rem'"
					:tableData="tableData"
					:columns="tableColumns"
					:emptyText="'镇街暂无数据'"
				>
				</simple-table>
			</div>
			<div v-else style="height: 5.7rem">
				<default-empty-container :emptyText="'镇街暂无数据'" />
			</div>
		</SmallTitle>
	</div>
</template>
<script lang="ts" setup>
import { useAttrs } from 'vue';
import { getSize } from '@/utils';
import { queryAgricultureOutputListByType } from '@/api/dailyMonitoring/indicatorDetailsPage';
import TextRotation from '@/components/widget/TextRotation.vue';
import { queryAgricultureOutputChart } from '@/api/dailyMonitoring/new-department';
import SimpleTable from '@/components/table/SimpleTable.vue';
import SmallTitle from '../components/SmallTitle.vue';
import { pieCategoryOption } from '../components/chartOptions';

const attrs: any = useAttrs();
const enterpriseListData = ref<any>([]);
const isChartEmpty = ref<boolean>(true);
const tableData = ref<any>([]);
const dateCode = ref('2');
const categoryCode = ref('');
const statUnit = ref('');
const tableColumns: any = computed(() => [
	{ label: '品类', prop: 'categoryName', align: 'left', width: getSize(180) },
	{ label: '镇街', prop: 'streetName', align: 'left' },
	{
		label: `${statUnit.value ? `总量(${statUnit.value})` : '总量(亿元)'}`,
		prop: 'total',
		type: 'number',
		align: 'right',
	},
	{ label: '增速(%)', prop: 'growRate', type: 'rate', unit: '%', align: 'right' },
	{ label: '数据类型', prop: 'dataCategoryName', align: 'left' },
]);
const searchTab = ref([
	{ label: '单季度', value: '2' },
	{ label: '季度累计', value: '3' },
]);
const chartOption: any = ref({});

const dataCategoryObj: any = {
	'1': '统计值',
	'2': '摸查值',
	'3': '预测值',
};
const getTableData = async () => {
	if (!attrs.timeScale) return;
	const params = {
		date: attrs.timeScale,
		cycleType: dateCode.value,
		categoryCode: categoryCode.value,
	};
	try {
		const res: any = await queryAgricultureOutputListByType(params);
		// 1:统计数据,2:摸查数据,3:预测数据
		tableData.value =
			res.data?.map((ele: any) => ({
				...ele,
				dataCategoryName: dataCategoryObj[ele.dataCategory] || '',
			})) || [];
	} catch (err) {
		tableData.value = [];
	}
};

const getData = async () => {
	if (!attrs.timeScale) return;
	const params = {
		date: attrs.timeScale,
		cycleType: dateCode.value,
	};
	try {
		const res = await queryAgricultureOutputChart({ params });
		const { data = [] }: { data: any } = res as any;
		enterpriseListData.value = data.map((item: any) => ({
			name: item.category,
			value: item.total,
			percent: item.percentage,
			categoryCode: item.categoryCode,
			unit: item.statUnit || '亿元',
		}));
		if (!categoryCode.value) {
			categoryCode.value = data[0]?.categoryCode;
		}
		statUnit.value = data.find((item: any) => item.statUnit)?.statUnit || '亿元';
		getTableData();
		isChartEmpty.value = enterpriseListData.value.length === 0;
		chartOption.value = pieCategoryOption(enterpriseListData.value);
	} catch (err) {
		isChartEmpty.value = true;
		enterpriseListData.value = [];
	}
};

watch(
	() => attrs.timeScale,
	() => {
		getData();
	}
);

watch(
	() => attrs.indicatorData,
	() => {
		getData();
	},
	{
		immediate: true,
	}
);
// 点击修改右边表格数据
const handleClick = (el: any) => {
	el.on('click', (params: any) => {
		const { data = {} }: { data: any } = params as any;
		categoryCode.value = data.categoryCode;
		getTableData();
	});
};
</script>
<style lang="less" scoped>
.content {
	width: 100%;
	.left-box {
		width: 50%;
		:deep(.title-part) {
			width: 100%;
		}
		.fl {
			float: left;
			margin-top: 0.08rem;
			position: relative;
			z-index: 999;
		}
		.right-btn {
			float: right;
			margin-top: 0.1rem;
			position: relative;
		}
	}
	.right-box {
		width: 60%;
	}
}
:deep(.el-table) {
	th {
		background-color: #ecf2fe;
		color: @table-header-text-color;
		line-height: 0.22rem;
		font-size: @table-font-size;
	}
}
</style>
