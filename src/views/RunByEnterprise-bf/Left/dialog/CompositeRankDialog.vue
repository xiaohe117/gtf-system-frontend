<!--
 * @Descripttion: 综合性榜单弹窗
 * @Author: zhaochao
 * @Date: 2025-08-12 09:23:35
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-09 14:49:51
-->
<template>
	<el-dialog v-model="dialogVisible" width="10rem" class="composite-rank-dialog">
		<TitleBody :name="dialogType === 1 ? '综合性榜单企业' : '成长性企业'">
			<LineTabs v-model="selectedType" :tabsList="tabsType" @change-tab="changeTab" />
			<EnterpriseRank :rankList="rankList" />
		</TitleBody>
	</el-dialog>
</template>
<script setup lang="ts">
import { queryRankStatistics, queryKeyEnterpriseList } from '@/api/index';
import LineTabs from '@/views/RunByEnterprise/Right/components/LineTabs.vue';
import EnterpriseRank from '../components/EnterpriseRank.vue';

const dialogVisible = ref(false);
const selectedType = ref<any>(0);
const dialogType = ref<any>(1);
const rankList = ref<any>({
	header: [
		{
			label: '序号',
			type: 'index',
		},
		{
			label: '企业名称',
			prop: 'companyName',
		},
		{
			label: '*排序说明',
			type: 'orderTags',
		},
		{
			label: '跟进单位',
			prop: 'unitName',
		},
	],
	listData: [],
});
const tabsType = ref<any>([]);
const tabs = ref<any>({
	1: [
		{ name: '世界500强', num: 0, unit: '家' },
		{ name: '央企100强', num: 0, unit: '家' },
		{ name: '民企100强', num: 0, unit: '家' },
	],
	2: [
		{ name: '专精特性企业', num: 0, unit: '家' },
		{ name: '瞪羚企业', num: 0, unit: '家' },
	],
});
const tagTypeCn = ref<any>({
	1: '榜单企业',
	2: '成长性企业',
});

const getStatisticsData = () => {
	queryRankStatistics({ tagTypeCn: tagTypeCn.value[dialogType.value] }).then((res: any) => {
		if (res.code === 0) {
			tabsType.value = res.data.map((item: any) => ({
				name: item.label,
				num: item.count,
				unit: item.count === 0 ? '' : '家',
			}));
		}
	});
};
const getTableData = (name: string) => {
	queryKeyEnterpriseList({ tagName: name }).then((res: any) => {
		if (res.code === 0) {
			rankList.value.listData = res.data;
		}
	});
};

const changeTab = (tab: any) => {
	getTableData(tab.name);
};

const show = (type: any) => {
	dialogType.value = type === 'CompositeRankDialog1' ? 1 : 2;
	dialogVisible.value = true;
	selectedType.value = 0;
	nextTick(() => {
		getStatisticsData();
		getTableData(tabs.value[dialogType.value][0].name);
	});
};

defineExpose({ show });
</script>
<style scoped lang="less"></style>
