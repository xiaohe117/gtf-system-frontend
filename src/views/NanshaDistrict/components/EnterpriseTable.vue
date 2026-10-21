<template>
	<div class="parent-container">
		<DynamicTable :table-data="tableData" :columns="columns" :max-height="'6.35rem'" />
	</div>
</template>

<script setup lang="ts">
import { getSize } from '@/utils/index';
import DynamicTable from '@/components/table/DynamicTable.vue';
import { getExcelData } from '@/views/ToufawOverview/data';

const props = withDefaults(
	defineProps<{
		tabIndex: number;
	}>(),
	{
		tabIndex: 0,
	}
);

const columns = ref<any[]>([
	{
		prop: 'index',
		label: '序号',
		width: getSize(119),
		align: 'center',
	},
	{
		prop: 'name',
		label: '企业名称',
		width: getSize(300),
		type: 'custom',
	},
	{
		prop: 'industryType',
		label: '产业类型',
		width: getSize(160),
		align: 'center',
	},
	{
		prop: 'enterpriseType',
		label: '企业性质',
		width: getSize(160),
		align: 'center',
	},
	{
		prop: 'investTotal',
		label: '在建投资项目',
		width: getSize(160),
		align: 'center',
	},
	{
		prop: 'activityTotal',
		label: '参加活动',
		width: getSize(160),
		align: 'center',
	},
	{
		prop: 'contact',
		label: '跟进联系人',
		width: getSize(160),
		align: 'center',
	},
]);

const tableData = ref<any[]>([]);

const getTableList = (type: number) => {
	// eslint-disable-next-line no-console
	getExcelData('./excel/nanshaDistrict/nanshaDistrictEnterprises.xlsx', 0).then((res: any) => {
		let arr = [];
		if (type === 0) {
			tableData.value = res;
		} else if (type === 1) {
			arr = res.filter((item: any) => item?.isEnterprise === '是');
			tableData.value = arr.map((item: any, index: number) => ({
				...item,
				index,
			}));
		} else if (type === 2) {
			arr = res.filter((item: any) => item?.isRanking === '是');
			tableData.value = arr.map((item: any, index: number) => ({
				...item,
				index,
			}));
		}
	});
};

watch(
	() => props.tabIndex,
	(val) => {
		getTableList(val);
	}
);

onMounted(() => {
	getTableList(0);
});
</script>

<style lang="less" scoped></style>
