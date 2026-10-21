<!--
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2025-06-06 16:32:06
 * @LastEditors: ycyun
 * @LastEditTime: 2025-06-23 18:44:04
-->
<template>
	<el-dialog
		v-model="dialogVisible"
		width="9rem"
		:append-to-body="true"
		:before-close="handleClose"
		title="一企一案"
	>
		<DynamicTable class="table-box" :tableData="tableData" :columns="columns" max-height="6rem">
			<template #btn="scope">
				<el-button style="font-size:.14rem" type="text" @click="openPdf(scope.row)">一企一案</el-button>
			</template>
		</DynamicTable>
		<PreviewPdf ref="previewPdfRef"/>

	</el-dialog>
</template>
<script lang="ts" setup>
// import { ElMessage } from 'element-plus';
import DynamicTable from '@/components/table/DynamicTable.vue';
import { getExcelData, companyColumns } from '../data';
import PreviewPdf from './PreviewPdf.vue'

const dialogVisible: any = ref(false);

const emit = defineEmits(['close']);

const handleClose = () => {
	dialogVisible.value = false;
	emit('close');
};
const tableData = ref([]) as any;
const columns: any = companyColumns;
const show = () => {
	dialogVisible.value = true;
};
onMounted(() => {
	getExcelData('./excel/toufawOneCompany.xlsx', 0).then((res: any) => {
		tableData.value = res.map((item: any) => ({
			...item,
			tableIndex: Number(item.index),
			tags: item.tags ? [{ name: item.tags, type: 'warning' }] : [],
		}));
	});
});
const previewPdfRef = ref()
const openPdf = (row: any) => {
	const fileName = row.index + row.direct
	previewPdfRef.value.show(row.direct,fileName)
};
defineExpose({ show });
</script>
<style lang="less">
.preview-file-dialog {
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: 0 !important;
}
</style>
<style lang="less" scoped>
main {
	width: 100%;
	height: 80vh;
	.iframe {
		width: 100%;
		height: 100%;
	}
}
</style>
