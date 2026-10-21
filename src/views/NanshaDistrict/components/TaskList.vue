<template>
	<div class="task-section">
		<div class="task-stats">
			<div class="task-stat-item item-1">
				<div class="icon"></div>
				<span class="task-count">6 <i>项</i></span>
				<span class="task-label">招商任务</span>
			</div>
			<div class="task-stat-item item-2">
				<div class="icon"></div>
				<span class="task-count">6 <i>项</i></span>
				<span class="task-label">考核</span>
			</div>
			<div class="task-stat-item item-3">
				<div class="icon"></div>
				<span class="task-count">5 <i>项</i></span>
				<span class="task-label">已完成</span>
			</div>
		</div>

		<DynamicTable :table-data="tableData" :columns="columns" />
	</div>
</template>

<script setup lang="ts">
import { getSize } from '@/utils/index';

const columns = ref<any[]>([
	{
		prop: 'id',
		label: '序号',
		width: getSize(80),
		align: 'center',
	},
	{
		prop: 'projectName',
		label: '产业名称',
		width: getSize(250),
		align: 'left',
	},
	{
		prop: 'target',
		label: '目标',
		width: getSize(80),
		align: 'center',
	},
	{
		prop: 'completion',
		label: '完成情况',
		// width: getSize(80),
		align: 'center',
		type: 'custom',
	},
	/* {
		prop: 'lampStatus',
		label: '亮灯',
		width: getSize(80),
		align: 'center',
		type: 'custom',
	}, */
]);

const tableData = ref<any[]>([
	{
		id: 1,
		projectName: '新签约产业招商项目数',
		target: 330,
		completion: 221.21,
		// lampStatus: 'yellow',
	},
	{
		id: 2,
		projectName: '新引进高质量产业招商项目数量（个）',
		target: 145,
		completion: 341.38,
		// lampStatus: 'green',
	},
	{
		id: 3,
		projectName: '十亿级项目数（个）',
		target: 25,
		completion: 132.00,
		// lampStatus: 'green',
	},
	{
		id: 4,
		projectName: '百亿级项目数（个）',
		target: 3,
		completion: 100.00,
		// lampStatus: 'yellow',
	},
	{
		id: 5,
		projectName: '央企项目数（个）',
		target: 5,
		completion: 300.00,
		// lampStatus: 'green',
	},
	{
		id: 6,
		projectName: '2025年产业招商项目入统备案（注册）（亿元）',
		target: 200,
		completion: 211.65,
		// lampStatus: 'yellow',
	},
]);
</script>

<style lang="less" scoped>
.task-stats {
	display: flex;
	gap: 0.16rem;
	margin-bottom: 0.16rem;
}

.task-stat-item {
	flex-direction: column;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #fff;
	width: 1.72rem;
	height: 0.78rem;
	display: flex;
	padding-top: 0.05rem;
	box-sizing: border-box;
	padding-left: 0.6rem;
	position: relative;
}

.item-1,
.item-2,
.item-3 {
	.icon {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		background-image: url('@/assets/images/nanShaDistrict/icon-2.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 0.3rem;
		height: 0.3rem;
	}
}

.item-2 {
	.icon {
		background-image: url('@/assets/images/nanShaDistrict/icon-3.png');
	}
}

.item-3 {
	.icon {
		background-image: url('@/assets/images/nanShaDistrict/icon-4.png');
	}
}

.task-count {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.28rem;
	color: rgba(0, 0, 0, 0.85);
	i {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-base;
		color: #666;
		font-style: normal;
	}
}

.task-label {
	font-size: @g-font-size-base;
	color: #666;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
}
</style>
