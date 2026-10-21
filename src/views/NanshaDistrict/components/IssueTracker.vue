<template>
	<div class="issue-section">
		<div class="issue-tabs">
			<RoundRectTabs
				v-model="unitInvestmentTab"
				:tabsList="['招商项目', '企业诉求', '招商活动']"
			></RoundRectTabs>
		</div>
		<DynamicTable :table-data="tableData" :columns="columns" />
	</div>
</template>

<script setup lang="ts">
import { getSize } from '@/utils';

const columns = ref<any[]>([
	{
		prop: 'id',
		label: '序号',
		width: getSize(80),
		align: 'center',
	},
	{
		prop: 'projectName',
		label: '项目名称',
		width: getSize(230),
		align: 'left',
	},
	{
		prop: 'problemCount',
		label: '问题数量',
		// width: getSize(100),
		align: 'center',
	},
	/* {
		prop: 'redCount',
		label: '红灯',
		width: getSize(80),
		align: 'center',
		type: 'custom',
	},
	{
		prop: 'yellowCount',
		label: '黄灯',
		width: getSize(80),
		align: 'center',
		type: 'custom',
	}, */
]);

const tableData = ref<any[]>([]);

const getData = (number: number) => {
	if (number === 0) {
		tableData.value = [
			{
				id: 1,
				projectName: '钢研昊普项目',
				problemCount: 1,
				redCount: 0,
				yellowCount: 0,
			},
			{
				id: 2,
				projectName: '立昇汽车科技(广州)有限公司智能驾乘控制系统研发生产新建项目',
				problemCount: 1,
				redCount: 0,
				yellowCount: 0,
			},
		];
	} else if (number === 1) {
		tableData.value = [
			{
				id: 1,
				projectName: '祺迹汽车科技（广州）有限公司',
				problemCount: 6,
				redCount: 0,
				yellowCount: 1,
			},
		];
	} else if (number === 2) {
		tableData.value = [];
	}
};

onMounted(() => {
	getData(0);
});

const unitInvestmentTab = ref(0);

watch(unitInvestmentTab, (val) => {
	unitInvestmentTab.value = val;
	getData(val);
});
</script>

<style lang="less" scoped>
h3 {
	display: inline-block;
	padding-top: 0.1rem;
	padding-left: 0.14rem;
	font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
	font-size: 0.3rem;
	line-height: 0.25rem;
	color: #4f98ff;
}
.issue-tabs {
	margin-bottom: 0.16rem;
}
</style>
