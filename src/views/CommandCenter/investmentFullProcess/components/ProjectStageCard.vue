<template>
	<StageCardShell :title="stage.title">
		<StageMetricsPanel :items="metrics" />

		<div class="top-section">
			<div class="top-header">
				<div class="top-title-wrap">
					<div class="top-title">TOP5项目</div>
					<span v-if="titleTip" class="title-tips-wrap">
						<Tooltips :tips-content="titleTip" placement="top">
							<img
								class="title-tips-icon"
								src="@/assets/images/investmentFullProcess/tips.png"
								alt=""
								draggable="false"
							/>
						</Tooltips>
					</span>
				</div>
				<RoundRectTabs
					v-model="activeTabIndex"
					:tabs-list="tabs"
					class="planning-tabs"
				>
					<template #default="{ index }">
						<span
							v-if="isAttentionTab(index)"
							class="tab-tips-wrap"
							@click.stop
						>
							<img
								class="tab-tips-icon"
								src="@/assets/images/investmentFullProcess/tips.png"
								alt=""
								draggable="false"
							/>
						</span>
					</template>
				</RoundRectTabs>
			</div>
			<div class="project-list">
				<CardEmptyState v-if="projectList.length === 0" />
				<div
					v-for="(item, index) in projectList"
					:key="`${item.name}-${index}`"
					class="project-item"
					:class="{ even: index % 2 === 1, clickable: canJumpDetail }"
					@click="goToDetail(item)"
				>
					<div class="rank-wrap">
						<img
							v-if="index < 3"
							class="rank-medal"
							:src="rankIcons[index]"
							alt=""
						/>
						<span v-else class="rank-num">{{ index + 1 }}</span>
					</div>
					<div class="project-content">
						<EllipsisTooltip :content="item.name" flex>
							<span class="project-name">{{ item.name }}</span>
						</EllipsisTooltip>
					</div>
					<div class="project-district">{{ item.district }}</div>
				</div>
			</div>
		</div>
	</StageCardShell>
</template>

<script setup lang="ts">
import ServiceUrl from '@/utils/url';
import {
	queryProduceCard,
	queryRegCard,
	querySignCard,
	queryStartCard,
	queryTalkCard,
} from '@/api/commandCenter/investmentFullProcess';
import RoundRectTabs from '@/components/RoundRectTabs.vue';
import Tooltips from '@/components/widget/Tooltips.vue';
import rankIcon1 from '@/assets/images/investmentFullProcess/first.png';
import rankIcon2 from '@/assets/images/investmentFullProcess/second.png';
import rankIcon3 from '@/assets/images/investmentFullProcess/third.png';
import { formatConvertPercent, formatDisplayValue } from '../format';
import { toQueryDept } from '../deptTree';
import StageMetricsPanel from './StageMetricsPanel.vue';
import StageCardShell from './StageCardShell.vue';
import CardEmptyState from './CardEmptyState.vue';
import EllipsisTooltip from './EllipsisTooltip.vue';

/** top5Type：1 市领导关注 | 2 预计投资额大 | 3 需关注 */
const TOP5_TYPES = [1, 2, 3];
const LEADER_TAB_INDEX = 0;
const INVEST_TAB_INDEX = 1;

/** 投产、开工暂不跳转项目详情 */
const DETAIL_DISABLED_STAGES = new Set(['production', 'start']);
const STAGE_TITLE_TIP: Record<string, string> = {
	production: '项目来源市统计局，暂时不能跳转查看具体详情。',
	start: '项目来源市统计局，暂时不能跳转查看具体详情。',
};

const STAGE_API_MAP: Record<string, typeof queryTalkCard> = {
	negotiation: queryTalkCard,
	production: queryProduceCard,
	start: queryStartCard,
	register: queryRegCard,
	signing: querySignCard,
};

const props = defineProps<{ stage: any }>();

const queryDateRange = inject<any>('investmentQueryDateRange');
const dept = inject<any>('investmentDept');

const canJumpDetail = computed(() => !DETAIL_DISABLED_STAGES.has(props.stage.key));
const titleTip = computed(() => STAGE_TITLE_TIP[props.stage.key] ?? '');

const tabs = computed(() => props.stage.tabs ?? []);
const activeTabIndex = ref(Math.max(0, tabs.value.indexOf(props.stage.activeTab)));

const isAttentionTab = (index: number) => tabs.value[index]?.includes('需关注') ?? false;

const defaultMetrics: Array<{
	label: string;
	value: string;
	unit?: string;
	change?: string;
}> = [
	{ label: '总项目', value: '-', unit: '个' },
	{ label: '预计投资额', value: '-', unit: '亿元' },
	{ label: '本周新增', value: '-', unit: '个' },
	{ label: '预计投资额', value: '-', unit: '亿元' },
];

const metrics = ref([...defaultMetrics]);
const projectList = ref<any[]>([]);
const rankIcons = [rankIcon1, rankIcon2, rankIcon3];
let stageRequestId = 0;
/** 避免程序改 tab 时再触发请求 */
let suppressTabWatch = false;

const mapTopList = (list: any[] = []) =>
	(list ?? [])
		.filter((item) => item != null)
		.map((item) => ({
			name: item.name ?? '',
			district: item.street ?? '',
			projId: item.projId,
		}));

const getQueryParams = () => {
	const range = queryDateRange?.value;
	if (!range) return null;

	return {
		startTime: range[0],
		endTime: range[1],
		dept: toQueryDept(dept?.value),
	};
};

const resetStageData = () => {
	metrics.value = [...defaultMetrics];
	projectList.value = [];
};

const hasWeekNewProjects = (val: unknown) => {
	if (val === null || val === undefined || val === '') return false;
	const num = Number(val);
	return !Number.isNaN(num) && num > 0;
};

const applyStageData = (data: any) => {
	const weekNewItem: (typeof defaultMetrics)[number] = {
		label: '本周新增',
		value: formatDisplayValue(data.weekProjectTimes),
		unit: '个',
	};
	if (hasWeekNewProjects(data.weekProjectTimes)) {
		weekNewItem.change = formatConvertPercent(data.weekRate);
	}

	metrics.value = [
		{
			label: '总项目',
			value: formatDisplayValue(data.allProjectTimes),
			unit: '个',
			change: formatConvertPercent(data.allRate),
		},
		{ label: '预计投资额', value: formatDisplayValue(data.allInvestAmount), unit: '亿元' },
		weekNewItem,
		{ label: '预计投资额', value: formatDisplayValue(data.weekInvestAmount), unit: '亿元' },
	];
	projectList.value = mapTopList(data.tops);
};

const fetchStageData = async (options: { autoFallback?: boolean } = {}) => {
	const { autoFallback = false } = options;
	const queryApi = STAGE_API_MAP[props.stage.key];
	if (!queryApi) return;

	const params = getQueryParams();
	if (!params) return;

	stageRequestId += 1;
	const requestId = stageRequestId;

	const queryByTab = async (tabIndex: number) => {
		const res: any = await queryApi({
			...params,
			top5Type: TOP5_TYPES[tabIndex] ?? 1,
		});
		return res?.data ?? {};
	};

	/** 程序改 tab，期间保持 suppress，避免触发手动切换请求 */
	const setTabSilently = (tabIndex: number) => {
		if (activeTabIndex.value === tabIndex) return;
		activeTabIndex.value = tabIndex;
	};

	try {
		// 初始化/筛选变化：优先市领导关注；无数据再看预计投资额大；都没数据停在第一个
		if (autoFallback) {
			const leaderData = await queryByTab(LEADER_TAB_INDEX);
			if (requestId !== stageRequestId) return;

			if (mapTopList(leaderData.tops).length > 0) {
				setTabSilently(LEADER_TAB_INDEX);
				applyStageData(leaderData);
				return;
			}

			if (tabs.value.length > INVEST_TAB_INDEX) {
				const investData = await queryByTab(INVEST_TAB_INDEX);
				if (requestId !== stageRequestId) return;

				if (mapTopList(investData.tops).length > 0) {
					setTabSilently(INVEST_TAB_INDEX);
					applyStageData(investData);
					return;
				}
			}

			setTabSilently(LEADER_TAB_INDEX);
			applyStageData(leaderData);
			return;
		}

		const data = await queryByTab(activeTabIndex.value);
		if (requestId !== stageRequestId) return;
		applyStageData(data);
	} catch {
		if (requestId === stageRequestId) {
			resetStageData();
		}
	}
};

// 跳转齐明项目详情（投产、开工除外）
const goToDetail = (item: any) => {
	if (!canJumpDetail.value || !item?.projId) return;
	window.open(
		`${ServiceUrl.getLoginUrl()}/pc/projectManage/create?projectId=${item.projId}`,
		'_blank'
	);
};

/**
 * 筛选变化时：整段自动回落请求期间保持 suppress，
 * 避免「预计投资额大 → 切时间」时 tab 回落触发的异步 watch
 * 用无回落请求冲掉正在进行的 autoFallback。
 */
watch(
	[queryDateRange, dept, () => props.stage.key],
	async () => {
		suppressTabWatch = true;
		activeTabIndex.value = LEADER_TAB_INDEX;
		try {
			await fetchStageData({ autoFallback: true });
		} finally {
			await nextTick();
			suppressTabWatch = false;
		}
	},
	{ immediate: true, deep: true },
);

/** 手动切换 tab：按当前 tab 拉数，不自动跳走 */
watch(activeTabIndex, () => {
	if (suppressTabWatch) return;
	fetchStageData({ autoFallback: false });
});
</script>

<style lang="less" scoped>
:deep(.stage-metrics) {
	flex-shrink: 0;
}

.title-tips-wrap {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	margin-left: 0.04rem;
	line-height: 0;
	font-size: 0;

	:deep(.el-tooltip__trigger) {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		width: 0.14rem;
		height: 0.14rem;
		line-height: 0;
		font-size: 0;
	}
}

.title-tips-icon,
.tab-tips-icon {
	display: block;
	box-sizing: border-box;
	width: 0.14rem;
	height: 0.14rem;
	min-width: 0.14rem;
	min-height: 0.14rem;
	max-width: 0.14rem;
	max-height: 0.14rem;
	flex: 0 0 auto;
	object-fit: contain;
	object-position: center;
	cursor: pointer;
	vertical-align: top;
}

.top-section {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
}

.top-header {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: space-between;
	gap: 0.06rem;
	margin-bottom: 0.02rem;
}

.top-title-wrap {
	display: inline-flex;
	align-items: center;
	flex-shrink: 0;
	min-width: 0;
}

.top-title {
	flex-shrink: 0;
	font-weight: 600;
	font-size: 0.17rem;
	line-height: 0.27rem;
	color: rgba(0, 0, 0, 0.88);
}

.planning-tabs {
	flex-shrink: 1;
	min-width: 0;
	max-width: 3.2rem;
	height: 0.31rem;
	background: rgba(255, 255, 255, 0.4);
	box-shadow: 0rem 0.02rem 0.04rem 0rem rgba(162, 169, 213, 0.66);
	border-radius: 0.17rem;
	border: 0.01rem solid #ffffff;
	backdrop-filter: blur(0.1134rem);

	:deep(> div) {
		padding: 0 0.06rem;
		margin: 0;
		font-size: 0.11rem;
		line-height: 0.27rem;
	}

	:deep(.tabs-control_item) {
		display: inline-flex;
		align-items: center;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.65);

		&.active {
			color: #ffffff;
		}
	}
}

.tab-tips-wrap {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	margin-left: 0.02rem;
	line-height: 0;
	font-size: 0;
}

.project-list {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
	min-height: 0;
	gap: 0.02rem;
	overflow-x: hidden;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 0.04rem;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(22, 93, 255, 0.35);
		border-radius: 0.02rem;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}
}

.project-item {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	gap: 0.06rem;
	height: 0.28rem;
	padding: 0 0.06rem;
	border-radius: 0.02rem;
	background: rgba(245, 248, 255, 0.9);

	&.even {
		background: transparent;
	}

	&.clickable {
		cursor: pointer;
	}
}

.rank-wrap {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 0.18rem;
	height: 0.18rem;
}

.rank-medal {
	width: 0.18rem;
	height: 0.18rem;
	object-fit: contain;
}

.rank-num {
	font-weight: bold;
	font-size: 0.12rem;
	line-height: 0.18rem;
	color: #165dff;
}

.project-content {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	overflow: hidden;
}

.project-name {
	display: block;
	width: 100%;
	overflow: hidden;
	font-weight: 400;
	font-size: 0.13rem;
	line-height: 0.2rem;
	color: #333333;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.project-district {
	flex-shrink: 0;
	font-weight: 400;
	font-size: 0.12rem;
	line-height: 0.18rem;
	color: rgba(0, 0, 0, 0.45);
}
</style>
