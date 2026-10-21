<!--
 * @Descripttion: 招商计划
 * @Author: zhaochao
 * @Date: 2025-09-08 09:31:21
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-30 11:10:50
-->
<template>
	<div class="rank-list-box">
		<TitleBody name="招商计划">
			<template #extra>
				<RoundRectTabs
					class="rank-list-tabs"
					v-model="taskSelectedTab"
					:tabsList="taskListTabs"
				/>
			</template>
			<el-tabs v-model="investSelectedTab">
				<el-tab-pane
					v-for="item in investPlanTabs"
					:label="item"
					:name="item"
					:key="item"
				/>
			</el-tabs>
			<CustomTable
				class="table-box"
				:tableData="taskList.listData"
				:columns="taskList.header"
				:hasOrder="true"
				:height="'3.8rem'"
			>
				<template #companyName="{ row, col }">
					<div v-if="col.prop === 'companyName'" class="text-ellipsis active-text" @click="goEnterpriseDetail(row)">
						{{ row[col.prop] }}
					</div>
					<div v-if="col.prop === 'leader'" class="text-ellipsis leader-text">
						{{ row[col.prop] }}
					</div>
				</template>
			</CustomTable>
		</TitleBody>
	</div>
</template>
<script lang="ts" setup>
import ServiceUrl from '@/utils/url'
import { getSize } from '@/utils/index';
import { getLeaderContact, getLeaderPlans , getSchedulePlanList } from '@/api/runByEnterprise/index';
import CustomTable from './components/CustomTable.vue';
// import { schedulingPlan } from './planData';

const taskListData = ref<any[]>([]);
const taskSelectedTab = ref(2);
const investSelectedTab = ref('');

const taskListTabs = ref<any>(['央企走访', '对接计划', '调度计划']);
const investPlanTabs = computed(() => {
	if (taskSelectedTab.value === 0) {
		return [];
	}
	if (taskSelectedTab.value === 1) {
		return ['提请市领导对接', '市区联合对接'];
	}
	return ['提请市领导调度', '市投发委办调度'];
});

// 招商计划配置
const taskListConfig = computed(() => {
	if (taskSelectedTab.value === 0) {
		return {
			header: [
				{
					label: '企业名称',
					prop: 'companyName',
					type: 'slot',
					slotName: 'companyName',
					width: getSize(180),
					align: 'left',
				},
				{
					label: `牵头<br/>市领导`,
					prop: 'leader',
					width: getSize(76),
					type: 'slot',
					slotName: 'companyName',
				},
				{
					label: `计划<br/>走访时间`,
					prop: 'startTime',
					width: getSize(110),
					align:'left'
				},
			],
			api: getLeaderPlans,
			params: {
				type: '1',
			},
		};
	}
	if (investSelectedTab.value === '提请市领导对接') {
		return {
			header: [
				{
					label: '企业名称',
					prop: 'companyName',
					type: 'slot',
					slotName: 'companyName',
					width: getSize(180),
					align: 'left',
				},
				{
					label: `提请<br/>市领导`,
					prop: 'leader',
					width: getSize(76),
					type: 'slot',
					slotName: 'companyName',
				},
				{
					label: `提请<br/>拜会时间`,
					prop: 'startTime',
					width: getSize(150),
					align:'left'
				},
				{
					label: '拜会地点',
					prop: 'place',
					align:'left'
				},
				{
					label: '拜会场合',
					prop: 'scene',
					align:'left'
				},
			],
			api: getLeaderContact,
			params: {
				type: '1',
			},
		};
	}
	if (investSelectedTab.value === '市区联合对接') {
		return {
			header: [
				{
					label: '企业名称',
					prop: 'companyName',
					type: 'slot',
					slotName: 'companyName',
					width: getSize(180),
					align: 'left',
				},
				{
					label: `对接<br/>牵头单位`,
					prop: 'leader',
					width: getSize(100),
					align:'left'
				},
				{
					label: '对接时间',
					prop: 'startTime',
					width: getSize(150),
					align:'left'
				},
			],
			api: getLeaderContact,
			params: {
				type: '2',
			},
		};
	}
	if (investSelectedTab.value === '提请市领导调度') {
		return {
			header: [
				{
					label: '企业名称',
					prop: 'companyName',
					type: 'slot',
					slotName: 'companyName',
					width: getSize(180),
					align: 'left',
				},
				{
					label: '提请<br/>市领导',
					prop: 'leaderName',
					width: getSize(76),
					// type: 'slot',
					// slotName: 'companyName',
				},
				{
					label: '提请<br/>调度时间',
					prop: 'scheduleTime',
					width: getSize(110),
					align:'left'
				},
			],
			api: getSchedulePlanList,
			params: {
				scheduleType: '1',
			},
			// listData: schedulingPlan.leaderScheduling,
		};
	}
	return {
		header: [
			{
				label: '企业名称',
				prop: 'companyName',
				type: 'slot',
				slotName: 'companyName',
				width: getSize(180),
				align: 'left',
			},
			{
				label: '牵头分局',
				prop: 'leaderName',
				width: getSize(80),
				align:'left'
			},
			{
				label: '调度时间',
				prop: 'scheduleTime',
				width: getSize(110),
				align:'left'
			},
		],
		api: getSchedulePlanList,
			params: {
				scheduleType: '2',
		},
		// listData: schedulingPlan.districtScheduling,
	};
});

const taskList = computed(() => ({
	header: taskListConfig.value.header,
	listData: taskListData.value,
}));
watch(
	() => taskSelectedTab.value,
	() => {
		const selected = investPlanTabs.value[0];
		investSelectedTab.value = selected;
	},
	{
		immediate: true,
	}
);

watch(
	() => investSelectedTab.value,
	() => {
		// 存在api 调取接口获取数据
		if (taskListConfig.value.api) {
			taskListConfig.value
				.api({
					params: { ...taskListConfig.value.params, page: 1, pageSize: 999999 },
				})
				.then((res: any) => {
					taskListData.value = res.data?.records || res.data || [];
				});
			// return;
		}
		// 否则直接取模拟数据
		// taskListData.value = taskListConfig.value.listData || [];
	},
	{
		immediate: true,
	}
);

const goEnterpriseDetail = (item: any) => {
	if (item.sccode) {
		window.open(
			`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?name=${item.companyName}&sccode=${item.sccode}`,
			'_blank'
		);
	}
};
</script>
<style lang="less" scoped>
.rank-list-box {
	width: 100%;
	:deep(.title-container) {
		.name {
			min-width: auto;
			padding-right: 0.04rem;
		}
		.rank-list-tabs {
			.tabs-control_item {
				padding: 0 0.08rem;
			}
		}
	}
	.text-ellipsis {
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.active-text {
		color: #176bf9 !important;
		cursor: pointer;
	}
	.leader-text{
		color: rgba(0, 0, 0, 0.85);
		font-weight: 500;
	}
	:deep(.el-table) {
		th.el-table__cell {
			text-align: center;
		}
	}
	.rank-list-tabs {
		:deep(.tabs-control_item) {
			padding: 0 0.12rem;
		}
	}
}
</style>
