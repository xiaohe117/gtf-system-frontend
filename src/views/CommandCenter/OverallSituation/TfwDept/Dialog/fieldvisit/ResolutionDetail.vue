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
		<ResolutionDetailTable
			style="width: 100%; height: 60vh"
			:searchParams="searchParams"
			:defaultDate="props.defaultDate"
			:notIndicator="true"
			:showEmptyHeader="true"
			v-bind="$attrs"
		/>
	</GDialog>
</template>
<script lang="ts" setup>
/**
 * 产生议定事项 / 产生企业述求 明细弹窗
 * 接口：getresolutionList
 */
import GDialog from '@/components/dialog/GDialog.vue';
import ResolutionDetailTable from './ResolutionDetailTable.vue';

const props = defineProps({
	defaultDate: {
		type: Object,
		default: () => ({}),
	},
});

const dialogVisible = ref(false);
const dialogTitle = ref('产生议定事项');
const searchParams = ref({});

const show = ({ row, title }: any) => {
	searchParams.value = row || {};
	dialogTitle.value = title || '产生议定事项';
	dialogVisible.value = true;
};

defineExpose({ show });
</script>
