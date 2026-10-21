<template>
	<GDialog
		v-model="dialogVisible"
		:title="dialogTitle"
		width="18rem"
		:align-center="true"
		:close-on-click-modal="false"
		:teleported="false"
		:append-to-body="false"
		destroy-on-close
		class="dept-detail-dialog"
	>
		<CityRecordDetailTable
			style="width: 100%; height: 60vh"
			:searchParams="searchParams"
			:tableColumns="tableColumns"
			:indicatorData="{}"
			:defaultDate="props.defaultDate"
			:notIndicator="true"
			:showEmptyHeader="true"
			v-bind="$attrs"
		></CityRecordDetailTable>
	</GDialog>
</template>
<script lang="ts" setup>
import GDialog from '@/components/dialog/GDialog.vue';
import { tableColumnsCityConfig } from '@/views/CommandCenter/OverallSituation/TfwDept/data';
import CityRecordDetailTable from './CityRecordDetailTable.vue';

const props = defineProps({
	defaultDate: {
		type: Object,
		default: () => ({}),
	},
});

const dialogVisible = ref(false);
const dialogTitle = ref('走访明细');
const tableColumns = [...tableColumnsCityConfig];
const searchParams = ref({});

const show = ({ row, title }: any) => {
	searchParams.value = row;
	dialogTitle.value = title || '走访明细';
	dialogVisible.value = true;
};

defineExpose({ show });
</script>
