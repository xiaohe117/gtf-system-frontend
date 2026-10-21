<template>
	<div class="mayor-workbench" id="mayorWorkbench">
		<GTFMdTitle :title="`个人事项${curLeader.name ? `(${curLeader.name})` : ''}`"></GTFMdTitle>
		<!-- 顶部：左侧汇总表格 + 右侧分配人员 -->
		<main class="main-content">
			<div class="top-row">
				<div class="top-left">
					<SummaryTable
						:leaderName="curLeader.name"
						:rows="summaryRows"
						:loading="summaryLoading"
					/>
				</div>
				<div class="top-right" v-if="leadersList.length > 1">
					<div
						v-for="p in leadersList"
						:key="p.id"
						class="assigned-item"
						:class="{ active: curLeader.id === p.id }"
						:title="p.name"
						@click="selectedLeader(p)"
					>
						{{ p.name }}
					</div>
				</div>
			</div>
			<div class="bottom-row">
				<!-- 月份时间线 -->
				<MonthTimeline
					v-model="currentYear"
					v-model:selected-month="selectedMonth"
					:months="monthList"
					class="section"
				/>

				<!-- 行程列表 -->
				<div class="trip-list" v-loading="tripLoading">
					<div v-for="trip in tripList" :key="trip.id" class="trip-section">
						<div class="section-header" @click="trip.expanded = !trip.expanded">
							<el-icon class="toggle-icon" :class="{ expanded: trip.expanded }">
								<ArrowDownBold />
							</el-icon>
							<span class="title">{{ trip.title }}</span>
							<span class="count">{{ trip.count }} 项</span>
						</div>
						<Transition name="collapse">
							<div v-if="trip.expanded" class="section-body">
								<TripItem
									v-for="item in trip.items"
									:key="item.id"
									:item="item"
									v-model="selectedItems[item.id]"
								/>
							</div>
						</Transition>
					</div>
					<DefaultEmptyContainer style="height: 3.7rem" v-if="tripList.length === 0" />
				</div>
			</div>
		</main>
		<!-- 底部操作栏 -->
		<div class="action-bar-wrap" v-if="tripList.length > 0">
			<div class="left">
				<el-checkbox :model-value="allChecked" @change="allChecked = !!$event">
					全选
				</el-checkbox>
			</div>
			<div class="right">
				<el-button
					v-for="btn in actionButtons"
					:key="btn.action"
					:type="btn.type"
					:plain="btn.plain"
					@click="handleAction(btn)"
				>
					{{ btn.label }}
				</el-button>
			</div>
		</div>

		<!-- 操作弹窗 -->
		<ActionDialog
			ref="actionDialogRef"
			:selected-month="selectedMonth"
			@refresh="refreshFunc"
			@assign="fetchLeadersList"
		/>
	</div>
</template>

<script lang="ts" setup>
import { authService } from '@/services/auth';
import {
	getLeaderList,
	getMonthOverview,
	getVisitList,
	getVisitStatistics,
} from '@/api/leaderWorkbench';
import { ElMessage } from 'element-plus';
import SummaryTable from './components/SummaryTable.vue';
import MonthTimeline from './components/MonthTimeline.vue';
import TripItem from './components/TripItem.vue';
import ActionDialog from './components/ActionDialog.vue';
import type { TripSection, AssignedPerson, MonthStatus, SummaryRow } from './types';

const curLeader: any = ref({});

const currentYear = ref(new Date().getFullYear());
const monthList = ref<MonthStatus[]>([]);

const summaryRows = ref<SummaryRow[]>([]);
const summaryLoading = ref(false);

/** 获取走访统计报表 */
const fetchSummaryRows = async () => {
	summaryLoading.value = true;
	try {
		const leaderName = curLeader.value.name || '';
		const res = await getVisitStatistics<SummaryRow[]>(leaderName);
		summaryRows.value = res.data || [];
	} catch {
		summaryRows.value = [];
	} finally {
		summaryLoading.value = false;
	}
};

const leadersList = ref<AssignedPerson[]>([]);
const userInfo = computed(() => authService?.getUserInfo() as any);

// 是否市长，市长才可以显示右边领导列表和交办其他市领导按钮
const isMayor = computed(() => userInfo.value.role && userInfo.value.role.includes('sk_sz'));

/** 获取月份行程概览 */
const fetchMonthOverview = async () => {
	try {
		const params = {
			year: currentYear.value,
			submitLeader: curLeader.value.name,
		};
		const res: any = await getMonthOverview(params);
		const data: any[] =
			(res?.data && res.data.filter((d: any) => d.year === currentYear.value)) || [];
		const list: MonthStatus[] = [];
		for (let m = 1; m <= 12; m += 1) {
			const monthData = data.find((d) => d.month === m);
			let status: MonthStatus['status'] = '';
			if (monthData) {
				status = monthData.allVisited ? 'visited' : 'pending';
			}
			list.push({ month: m, status });
		}
		monthList.value = list;
	} catch {
		// 接口异常时使用空状态
		monthList.value = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, status: '' }));
	}
};

/** 【选中月份】 */
const selectedMonth = ref(new Date().getMonth() + 1);

/** 【行程列表数据 */
const tripList = ref<TripSection[]>([]);

/** 状态映射 */
const STATUS_MAP: Record<string, string> = {
	PENDING_CONFIRM: 'pending',
	PENDING_VISIT: 'unvisited',
	VISITED: 'visited',
};

const tripLoading = ref(false);

/** 获取行程列表 */
const fetchVisitList = async () => {
	tripLoading.value = true;
	try {
		const res: any = await getVisitList({
			year: currentYear.value,
			month: selectedMonth.value,
			submitLeader: curLeader.value.name,
			pageNum: 1,
			pageSize: 999999,
		});
		const data: any[] = res?.data || [];
		tripList.value = data.map((group, gi) => ({
			id: `${gi}-${group.tripLocation}`,
			title: group.tripLocation || '',
			count: group.trips?.length || 0,
			expanded: true,
			items: (group.trips || []).map((t: any) => ({
				companyName: t.enterpriseName || '',
				status: STATUS_MAP[t.visitStatus] || 'unvisited',
				isHandled: false,
				...t,
			})),
		}));
	} catch {
		tripList.value = [];
	} finally {
		tripLoading.value = false;
	}
};

/** 各条目的选中状态 */
const selectedItems = reactive<Record<string, boolean>>({});

watch(selectedMonth, () => {
	Object.keys(selectedItems).forEach((k) => delete selectedItems[k]);
	fetchVisitList();
});

/** 全选状态 */
const allChecked = computed({
	get: () => {
		const allIds = tripList.value.flatMap((t) => t.items.map((i) => i.id));
		return allIds.length > 0 && allIds.every((id) => selectedItems[id]);
	},
	set: (val) => {
		const allIds = tripList.value.flatMap((t) => t.items.map((i) => i.id));
		allIds.forEach((id) => {
			selectedItems[id] = val;
		});
	},
});

const refreshFunc = async () => {
	// 清空行程列表选择
	Object.keys(selectedItems).forEach((k) => delete selectedItems[k]);
	fetchMonthOverview();
	fetchVisitList();
};
watch(currentYear, () => {
	refreshFunc();
});
const selectedLeader = (p: any) => {
	curLeader.value = p;
	refreshFunc();
	fetchSummaryRows();
};
const fetchLeadersList = async () => {
	if (!isMayor.value) {
		leadersList.value = [{ id: userInfo.value.id, name: userInfo.value.username }];
	} else {
		try {
			const res = await getLeaderList<Array<{ leaderId: string; fullName: string }>>();
			leadersList.value = (res.data || []).map(item => ({
				id: item.leaderId,
				name: item.fullName,
			}));
		} catch {
			leadersList.value = [];
		}
	}
	// 指派其他领导成功后刷新领导列表,判断当前已选择的领导是否在列表中，不在则默认选择第一个
	if(curLeader.value.id && leadersList.value.find((l) => l.id === curLeader.value.id)){
		selectedLeader(curLeader.value);
	}else if (leadersList.value.length > 0 ) {
		selectedLeader(leadersList.value[0]);
	}
};

fetchLeadersList();


const actionDialogRef = ref<InstanceType<typeof ActionDialog>>();

interface ActionBtn {
	type: string;
	label: string;
	action: string;
	plain?: boolean;
	clickFunc?: Function;
	allowStatus?: string[];
	msg?: string;
	mayorOnly?: boolean;
}

/** 选中数量 */
const selectedCount = computed(() => Object.values(selectedItems).filter(Boolean).length);

const openDialog = (type: 'suspend' | 'assign' | 'supervise' | 'agree') => {
	const ids = Object.keys(selectedItems).filter((k) => selectedItems[k]);
	actionDialogRef.value?.show(type, selectedCount.value, ids);
};

const allActionButtons: ActionBtn[] = [
	{
		type: 'success',
		label: '同意走访',
		action: 'agree',
		clickFunc: () => openDialog('agree'),
		// 同意走访：仅可操作"待确认"状态的行程，否则toast提示"请选择待确认的行程进行操作"
		allowStatus: ['pending'],
		msg: '请选择待确认的行程进行操作',
	},
	{
		type: 'primary',
		label: '暂缓走访',
		action: 'suspend',
		clickFunc: () => openDialog('suspend'),
		// 暂缓走访：仅可操作"未走访"或"待确认"状态的行程，否则toast提示"请选择待确认或未走访的行程进行操作"
		allowStatus: ['pending', 'unvisited'],
		msg: '请选择待确认或未走访的行程进行操作',
	},
	{
		type: 'primary',
		label: '交办其他市领导',
		action: 'assign',
		plain: true,
		clickFunc: () => openDialog('assign'),
		// 交办其他市领导：仅可操作"未走访"或"待确认"状态的行程，否则toast提示"请选择待确认或未走访的行程进行操作"
		allowStatus: ['pending', 'unvisited'],
		msg: '请选择待确认或未走访的行程进行操作',
		mayorOnly: true, // 只有市长有权限控制
	},
	{
		type: 'primary',
		label: '一键督办',
		action: 'supervise',
		clickFunc: () => openDialog('supervise'),
		// 一键督办：仅可操作"已走访"状态的行程，否则toast提示"请选择已走访的行程进行操作"
		allowStatus: ['visited'],
		msg: '请选择已走访的行程进行操作',
	},
];

const actionButtons = computed(() => {
	if (tripList.value.length === 0) {
		return [];
	}
	const arr = allActionButtons.filter((btn) => !btn.mayorOnly || isMayor.value);
	// 一键督办:默认隐藏该按钮，仅勾选的行程全部为”已走访“时，才出现该按钮
	const selectedIds = Object.keys(selectedItems).filter((k) => selectedItems[k]);
	const allItems = tripList.value.flatMap((t) => t.items);
	const selectedStatus: string[] = selectedIds.map(
		(id) => allItems.find((i) => i.id === id)?.status || ''
	);
	if(selectedStatus.length > 0 && selectedStatus.every((s) => s === 'visited')){
		return arr;
	}
	return arr.filter((btn) => btn.action !== 'supervise');
});

/** 操作按钮事件处理 */
const handleAction = async (btn: ActionBtn) => {
	if (selectedCount.value === 0) {
		ElMessage.warning('请先选择需要操作的走访项');
		return;
	}
	const allowStatus = btn.allowStatus || [];
	const selectedIds = Object.keys(selectedItems).filter((k) => selectedItems[k]);
	const allItems = tripList.value.flatMap((t) => t.items);
	const selectedStatus: string[] = selectedIds.map(
		(id) => allItems.find((i) => i.id === id)?.status || ''
	);
	if (allowStatus.length > 0 && !selectedStatus.every((s) => allowStatus.includes(s))) {
		ElMessage.warning(btn.msg);
		return;
	}
	if (btn.clickFunc) btn.clickFunc();
};
</script>

<style lang="less" scoped>
.mayor-workbench {
	display: flex;
	flex-direction: column;
	height: calc(100vh - 1.2rem);

	:deep(.title-part) {
		padding: 0.12rem 0.24rem;
		border-bottom: 0.01rem solid #aaccff;
	}
	.main-content {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.16rem;
		padding: 0.04rem 0;
		background: #f7f9fe;
		padding: 0.12rem 0.28rem;
	}

	.top-row {
		display: flex;
		gap: 0.2rem;
		height: 2.3rem;
		.top-left {
			flex: 1;
			height: 100%;
			overflow: auto;
			min-width: 0;
			box-shadow: 0 0 0.08rem 0 rgba(0, 0, 0, 0.2);
			background: #fff;
			border-radius: 0.02rem;
			border-left: 0.04rem solid #3177ec;
		}
		.top-right {
			width: 1.62rem;
			height: 100%;
			overflow: auto;
			position: relative;
			box-shadow: 0 0 0.08rem 0 rgba(0, 0, 0, 0.2);
			background: #fff;
			border-radius: 0.02rem;
			padding: 0.12rem 0.1rem 0.12rem 0.14rem;
			display: flex;
			flex-direction: column;

			.assigned-item {
				cursor: pointer;
				text-align: center;
				white-space: nowrap;
				border-radius: 0.04rem;
				padding: 0.02rem 0;
				transition: all 0.2s;
				font-size: 0.16rem;
				line-height: 0.22rem;
				margin-bottom: 0.04rem;
				color: #4e5969;
				&:last-child {
					margin-bottom: 0;
				}
				&.active,
				&:hover {
					background: linear-gradient(
						270deg,
						rgba(90, 140, 252, 0.15) 0%,
						rgba(90, 140, 252, 0.23) 51.41%,
						rgba(90, 140, 252, 0.08) 100%
					);
				}
			}
		}
	}
	.bottom-row {
		background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
		box-shadow: 0 0 0.08rem 0 rgba(0, 0, 0, 0.2);
		border-radius: 0.12rem;
		padding: 0.19rem 0.24rem;
	}
	.section {
		// 月份时间线占位
		flex-shrink: 0;
	}

	.trip-list {
		display: flex;
		flex-direction: column;
		gap: 0.16rem;
		flex: 1;
		margin-top: 0.2rem;

		.trip-section {
			background: #fff;
			border-radius: 0.08rem;
			padding: 0.12rem 0.16rem;

			.section-header {
				display: flex;
				align-items: center;
				height: 0.48rem;
				cursor: pointer;
				background: linear-gradient(90deg, #eff6ff 0%, #e8f4ff 100%);
				border-left: 0.03rem solid #165dff;
				border-radius: 0 0.04rem 0.04rem 0;
				padding-left: 0.22rem;
				padding-right: 0.2rem;
				.toggle-icon {
					font-size: 0.18rem;
					color: #165dff;
					margin-right: 0.14rem;
					transform: rotate(180deg);
					transition: transform 0.3s ease;
					&.expanded {
						transform: rotate(0deg);
					}
				}
				.title {
					font-size: 0.18rem;
					font-weight: 500;
					color: #4e5969;
				}
				.count {
					margin-left: auto;
					font-size: 0.14rem;
					color: #000000;
					background: #dcdfe6;
					border-radius: 0.04rem;
					padding: 0.04rem 0.19rem 0.04rem 0.08rem;
				}
			}
			.section-body {
				border: 0.01rem solid #cbd5e1;
			}
		}

		// 折叠过渡动画
		.collapse-enter-active,
		.collapse-leave-active {
			transition: all 0.3s ease;
			overflow: hidden;
		}
		.collapse-enter-from,
		.collapse-leave-to {
			opacity: 0;
			max-height: 0;
		}
		.collapse-enter-to,
		.collapse-leave-from {
			opacity: 1;
			max-height: 20rem;
		}
	}

	.action-bar-wrap {
		flex-shrink: 0;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.16rem 0.2rem;
		background: #fff;
		border-radius: 0.08rem;
		border: 0.01rem solid #e8eef7;

		.left {
			position: absolute;
			left: 0.2rem;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.85);
		}

		.right {
			display: flex;
			align-items: center;
			gap: 0.12rem;

			:deep(.el-button) {
				height: 0.36rem;
				padding: 0 0.16rem;
				font-size: 0.16rem;
			}
		}
	}
}
:deep(.el-checkbox) {
	height: 0.2rem;
	--el-checkbox-font-size: 0.16rem;
	--el-checkbox-checked-text-color: #165dff;
	--el-checkbox-checked-bg-color: #165dff;
	--el-checkbox-checked-input-border-color: #165dff;
	--el-checkbox-input-border-color-hover: #165dff;
	--el-checkbox-input-height: 0.2rem;
	--el-checkbox-input-width: 0.2rem;
	position: relative;
	.el-checkbox__inner:after {
		width: 0.05rem;
		height: 0.09rem;
		top: 50%;
		left: 50%;
		transform: translate(-45%, -60%) rotate(45deg) scaleY(1);
	}
}
</style>