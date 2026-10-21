<template>
	<GDialog
		v-model="dialogVisible"
		title="走访明细"
		width="18rem"
		:align-center="true"
		:close-on-click-modal="false"
		:teleported="false"
		:append-to-body="false"
		destroy-on-close
		class="dept-detail-dialog"
	>
		<VisitDetailTable
			style="width: 100%;height: 60vh;"
			:notIndicator="true"
			:showEmptyHeader="true"
			:indicatorData="{}"
			:tableColumns="tableColumns"
			:searchParams="searchParams"
			v-bind="$attrs"
		>
		</VisitDetailTable>
	</GDialog>
</template>
<script lang="ts" setup>
import VisitDetailTable from '@/views/EfficiencyCenter/IndicatorDetailsPage/Tabs/VisitDetailTable.vue';
import { getTableColumnsConfig } from '@/views/EfficiencyCenter/IndicatorDetailsPage/config/tableColumns';
import GDialog from '@/components/dialog/GDialog.vue';

const dialogVisible = ref(false);
const tableColumns: any = computed(() => {
	const arr = [...getTableColumnsConfig('visitDetail')];
	return arr;
});
const searchParams = ref({});

const show = ({ row,col }: any) => {
	searchParams.value = {
		tagIds: row.tagId || undefined,
		unitCode:row.unitCode,
		unitType:row.unitType,
		unitName:row.unitName,
		columnKey:col.columnKey || row.columnKey,
		unitLevel:row.unitLevel,
		timeType:row.timeType
	}
	dialogVisible.value = true;
};
defineExpose({ show });
</script>