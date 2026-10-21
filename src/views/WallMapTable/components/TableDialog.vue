<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-08-15 17:01:12
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-05 16:44:55
-->
<template>
	<el-dialog
		v-model="dialogVisible"
		width="12rem"
		:append-to-body="true"
		:before-close="handleClose"
		:title="title"
	>
		<template #header>
			<div class="el-dialog__title wall-map-table_dialog-title">
				<span>{{ title }}</span>
				<span class="num-box"
					><span class="num">{{ tableData.length }}</span
					>条记录</span
				>
			</div>
		</template>
		<DynamicTable class="table-box" :tableData="tableData" :columns="columns" max-height="6rem">
			<template #status="scope">
				<span class="status" :style="{ background: scope.row.color }">
					{{ scope.row.statusText }}
				</span>
			</template>
		</DynamicTable>
	</el-dialog>
</template>
<script lang="ts" setup>
import DynamicTable from '@/components/table/DynamicTable.vue';
import { statusOption } from '../TableList/data';

const dialogVisible: any = ref(false);

const emit = defineEmits(['close']);

const handleClose = () => {
	dialogVisible.value = false;
	emit('close');
};
const tableData = ref([]) as any;
const columns: any = ref([]);
const title = ref('');
const show = ({ col, row, value }: any) => {
	title.value = `【${row.companyName}】${col.label}`;
	columns.value = col.columns || [];
	value?.forEach((item: any) => {
		const obj: any = statusOption.find((ele) => ele.value === item.status) || {};
		item.statusText = obj.label;
		item.color = obj.color;
	});
	tableData.value = value || [];
	dialogVisible.value = true;
};

defineExpose({ show });
</script>
<style lang="less" scoped>
.status {
	display: inline-block;
	width: 0.55rem;
	height: 0.22rem;
	line-height: 0.22rem;
	border-radius: 0.03rem;
	text-align: center;
	color: #fff;
}
</style>
<style lang="less" >
.wall-map-table_dialog-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.num-box {
		flex-shrink: 0;
		font-size: .16rem;
		color: #4B4B4B;
		font-family: PingFangSC, PingFang SC;
		font-weight:400;
		padding-right: 0.24rem;
		.num {
			font-family: DINAlternate, DINAlternate;
			font-weight: bold;
			font-size: 0.26rem;
			color: #176BF9;
			margin-right: 0.02rem;
		}
	}
}
</style>
