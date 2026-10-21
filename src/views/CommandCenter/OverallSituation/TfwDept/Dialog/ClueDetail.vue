<template>
	<GDialog
		v-model="dialogVisible"
		title="线索明细"
		width="18rem"
		:align-center="true"
		:close-on-click-modal="false"
		:teleported="false"
		:append-to-body="false"
		destroy-on-close
		class="dept-detail-dialog"
	>
		<LineDetailTable
			style="width: 100%"
			:notIndicator="true"
			:showEmptyHeader="true"
			:indicatorData="{}"
			:tableColumns="tableColumns"
			:detailScopeId="detailScopeId"
			:metricType="metricType"
			:tabType="tabType"
			v-bind="$attrs"
		>
		</LineDetailTable>
	</GDialog>
</template>
<script lang="ts" setup>
import LineDetailTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/Tabs/LineDetailTable.vue';
import { getTableColumnsConfig } from '@/views/EfficiencyCenter/IndicatorDetailsPage/config/tableColumns';
import GDialog from '@/components/dialog/GDialog.vue';

import { getSize } from '@/utils';

const dialogVisible = ref(false);
const tableColumns: any = computed(() => {
	const arr = [...getTableColumnsConfig('lineDetail')];
	// 去掉录入时间，插入接收单位和审核通过时间
	const operationIndex = arr.findIndex((col: any) => col.prop === 'createdDate');
	if (operationIndex !== -1) {
		arr.splice(
			operationIndex,
			1,
			{
				label: '接收单位',
				prop: 'receivingUnits',
				type: 'receivingUnits',
				width: String(getSize(120)),
				headerAlign: 'center',
				align: 'center',
			},
			{
				label: '审核通过时间',
				prop: 'approveTime',
				type: 'startTime',
				fixWidth: String(getSize(140)),
				headerAlign: 'center',
				align: 'center',
			}
		);
	}
	return arr;
});
const detailScopeId = ref('');
const metricType = ref('');
const tabType = ref('');

const show = ({ row, col }: any) => {
	detailScopeId.value = row.detailScopeId;
	metricType.value = col.metricType;
	tabType.value = row.unitType;
	dialogVisible.value = true;
};
defineExpose({ show });
</script>