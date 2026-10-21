<template>
	<StageCardShell title="谋划">
		<template #left-extra>
			<RoundRectTabs v-model="activeTabIndex" :tabs-list="tabs" class="planning-tabs" />
		</template>

		<template v-if="activeTabIndex === 0">
			<div class="planning-metrics">
				<div v-for="item in metrics" :key="item.label" class="metric-item">
					<div class="metric-label">{{ item.label }}</div>
					<div class="metric-value">
						<span>{{ item.value }}</span>
						<small v-if="item.unit">{{ item.unit }}</small>
					</div>
				</div>
			</div>

			<div class="planning-content">
				<div class="activity-column">
					<div class="column-title">
						近期谋划活动：<span class="number-font">{{ recentActivityCount }}</span
						>场
					</div>
					<div class="activity-list">
						<CardEmptyState v-if="recentActivities.length === 0" />
						<div
							v-for="item in recentActivities"
							:key="`${item.title}-${item.date}`"
							class="activity-item"
							@click="handleRecentActivitiesClick(item)"
						>
							<img
								class="item-icon"
								src="@/assets/images/investmentFullProcess/blue-circle.png"
								alt=""
							/>
							<div class="item-text">
								<EllipsisTooltip :content="item.title">
									<div class="item-title">{{ item.title }}</div>
								</EllipsisTooltip>
								<EllipsisTooltip :content="`${item.date} ${item.location}`">
									<div class="item-meta">{{ item.date }} {{ item.location }}</div>
								</EllipsisTooltip>
							</div>
						</div>
					</div>
				</div>
				<div class="activity-column">
					<div class="column-title">
						其他城市活动：<span class="number-font">{{ otherCityActivityCount }}</span
						>场
					</div>
					<div class="activity-list">
						<CardEmptyState v-if="otherCityActivities.length === 0" />
						<div
							v-for="item in otherCityActivities"
							:key="`${item.title}-${item.date}`"
							class="activity-item"
							@click="openOtherCityActivity(item)"
						>
							<img
								class="item-icon"
								src="@/assets/images/investmentFullProcess/yellow-circle.png"
								alt=""
							/>
							<div class="item-text">
								<EllipsisTooltip :content="item.title">
									<div class="item-title">{{ item.title }}</div>
								</EllipsisTooltip>
								<EllipsisTooltip :content="`${item.date} ${item.location}`">
									<div class="item-meta">{{ item.date }} {{ item.location }}</div>
								</EllipsisTooltip>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template v-else-if="activeTabIndex === 1">
			<SceneMetricsPanel :items="sceneMetrics" />

			<div class="section-title">有效场景</div>
			<div class="enterprise-list">
				<CardEmptyState v-if="validScenes.length === 0" />
				<div
					v-for="(item, index) in validScenes"
					:key="`${item.name}-${index}`"
					class="enterprise-item"
					@click="handleClick(item)"
				>
					<div class="enterprise-top">
						<img class="enterprise-icon" :src="blueIcon" alt="" />
						<div class="enterprise-info">
							<EllipsisTooltip :content="item.name">
								<div class="enterprise-name">{{ item.name }}</div>
							</EllipsisTooltip>
							<EllipsisTooltip :content="`所属产业：${item.industry}`">
								<div class="enterprise-industry">所属产业：{{ item.industry }}</div>
							</EllipsisTooltip>
						</div>
					</div>
					<EllipsisTooltip :content="`成果：${item.achievement}`">
						<div class="enterprise-summary">成果：{{ item.achievement }}</div>
					</EllipsisTooltip>
				</div>
			</div>
		</template>

		<template v-else-if="activeTabIndex === 2">
			<IntelligenceInfoPanel
				v-model:active-info-tab="activeInfoTab"
				:guangdong-meeting-list="guangdongMeetingList"
				:other-province-meeting-list="otherProvinceMeetingList"
				:info-list="enterpriseNewsList"
				:loading="isIntelligenceLoading"
				news-tab-label="企业咨询"
				compact
			/>
		</template>
	</StageCardShell>
</template>

<script setup lang="ts">
import ServiceUrl from '@/utils/url';
import { ElMessage } from 'element-plus';
import { queryActivityUrl } from '@/api/commandCenter/deptOverview';
import {
	queryFormulateMeeting,
	queryFormulatePartiing,
	queryFormulateNews,
} from '@/api/commandCenter/investmentFullProcess';
import RoundRectTabs from '@/components/RoundRectTabs.vue';
import blueIcon from '@/assets/images/investmentFullProcess/blue-icon.png';
import type { InfoItem, InfoTabKey } from '../intelligenceInfo';
import {
	getApiList,
	normalizeEnterpriseNewsInfo,
	normalizeLeaderVisitInfo,
} from '../intelligenceInfo';
import { formatDisplayValue } from '../format';
import { toQueryDept } from '../deptTree';
import IntelligenceInfoPanel from './IntelligenceInfoPanel.vue';
import SceneMetricsPanel from './SceneMetricsPanel.vue';
import StageCardShell from './StageCardShell.vue';
import CardEmptyState from './CardEmptyState.vue';
import EllipsisTooltip from './EllipsisTooltip.vue';

const tabs = ['活动', '场景', '情报'];
const activeTabIndex = ref(0);
const activeInfoTab = ref<InfoTabKey>('meeting');

const queryDateRange = inject<any>('investmentQueryDateRange');
const dept = inject<any>('investmentDept');

const defaultMetrics = [
	{ label: '已举办', value: '-', unit: '场' },
	{ label: '关联项目数量', value: '-', unit: '个' },
	{ label: '总投资额', value: '-', unit: '亿元' },
];

const defaultSceneMetrics = [
	{ label: '总提交场景', value: '-', unit: '个' },
	{ label: '有效待匹配', value: '-', unit: '个' },
	{ label: '已匹配', value: '-', unit: '个' },
	{ label: '本周提交', value: '-', unit: '个' },
	{ label: '有效待匹配', value: '-', unit: '个' },
	{ label: '已匹配', value: '-', unit: '个' },
];

const metrics = ref([...defaultMetrics]);
const sceneMetrics = ref([...defaultSceneMetrics]);
const recentActivities = ref<any[]>([]);
const otherCityActivities = ref<any[]>([]);
const validScenes = ref<Array<{ name: string; industry: string; achievement: string }>>([]);
const recentActivityCount = ref(0);
const otherCityActivityCount = ref(0);
const guangdongMeetingList = ref<InfoItem[]>([]);
const otherProvinceMeetingList = ref<InfoItem[]>([]);
const enterpriseNewsList = ref<InfoItem[]>([]);
const isIntelligenceLoading = ref(false);
let intelligenceRequestId = 0;

const mapActivityList = (list: any[] = []) =>
	(list ?? [])
		.filter((item) => item != null)
		.map((item) => ({
			title: item.name ?? '',
			date: item.date ?? '',
			location: item.street ?? '',
			activityId: item.activityId ?? '',
			url: item.url ?? '',
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

const resetActivityData = () => {
	metrics.value = [...defaultMetrics];
	recentActivities.value = [];
	otherCityActivities.value = [];
	recentActivityCount.value = 0;
	otherCityActivityCount.value = 0;
};

const resetSceneData = () => {
	sceneMetrics.value = [...defaultSceneMetrics];
	validScenes.value = [];
};

const resetIntelligenceData = () => {
	guangdongMeetingList.value = [];
	otherProvinceMeetingList.value = [];
	enterpriseNewsList.value = [];
};

const fetchActivityData = async (params: any) => {
	const res: any = await queryFormulateMeeting(params);
	const data = res?.data ?? {};

	metrics.value = [
		{ label: '已举办', value: formatDisplayValue(data.host), unit: '场' },
		{ label: '关联项目数量', value: formatDisplayValue(data.sighProject), unit: '个' },
		{ label: '总投资额', value: formatDisplayValue(data.investAmount), unit: '亿元' },
	];
	recentActivities.value = mapActivityList(data.hostDetail);
	otherCityActivities.value = mapActivityList(data.otherCityHostDetail);
	recentActivityCount.value = recentActivities.value.length;
	otherCityActivityCount.value = otherCityActivities.value.length;
};

const mapValidSceneList = (list: any[] = []) =>
	(list ?? [])
		.filter((item) => item != null)
		.map((item) => ({
			sceneId: item.id,
			name: item.name ?? '',
			industry: item.industryTypeName ?? '',
			achievement: item.result ?? '',
		}));

const fetchSceneData = async (params: any) => {
	const res: any = await queryFormulatePartiing(params);
	const data = res?.data ?? {};

	sceneMetrics.value = [
		{ label: '总提交场景', value: formatDisplayValue(data.submittedSceneCount), unit: '个' },
		{ label: '有效待匹配', value: formatDisplayValue(data.qualifiedSceneCount), unit: '个' },
		{ label: '已匹配', value: formatDisplayValue(data.validSceneCount), unit: '个' },
		{
			label: '本周提交',
			value: formatDisplayValue(data.submittedSceneCountWeek),
			unit: '个',
		},
		{
			label: '有效待匹配',
			value: formatDisplayValue(data.qualifiedSceneCountWeek),
			unit: '个',
		},
		{ label: '已匹配', value: formatDisplayValue(data.validSceneCountWeek), unit: '个' },
	];
	validScenes.value = mapValidSceneList(data.sceneInfos ?? []);
};

const fetchIntelligenceData = async (params: any) => {
	intelligenceRequestId += 1;
	const requestId = intelligenceRequestId;
	const viewType = activeInfoTab.value === 'meeting' ? 1 : 2;

	isIntelligenceLoading.value = true;
	if (activeInfoTab.value === 'news') {
		enterpriseNewsList.value = [];
	} else {
		guangdongMeetingList.value = [];
		otherProvinceMeetingList.value = [];
	}

	try {
		const res: any = await queryFormulateNews({
			...params,
			viewType,
			page: 1,
			pageSize: 30,
		});

		if (requestId !== intelligenceRequestId || activeTabIndex.value !== 2) return;
		if (res?.code != null && res.code !== 0) {
			resetIntelligenceData();
			return;
		}

		const data = res?.data ?? {};

		if (activeInfoTab.value === 'meeting') {
			guangdongMeetingList.value = getApiList<Parameters<typeof normalizeLeaderVisitInfo>[0]>(
				data.leaderVisit
			).map(normalizeLeaderVisitInfo);
			otherProvinceMeetingList.value = getApiList<
				Parameters<typeof normalizeLeaderVisitInfo>[0]
			>(data.notLeaderVisit).map(normalizeLeaderVisitInfo);
			return;
		}

		enterpriseNewsList.value = getApiList<Parameters<typeof normalizeEnterpriseNewsInfo>[0]>(
			data.pageList?.records ?? data.pageList
		).map(normalizeEnterpriseNewsInfo);
	} catch {
		if (requestId === intelligenceRequestId && activeTabIndex.value === 2) {
			resetIntelligenceData();
		}
	} finally {
		if (requestId === intelligenceRequestId && activeTabIndex.value === 2) {
			isIntelligenceLoading.value = false;
		}
	}
};

const fetchData = async () => {
	const params = getQueryParams();
	if (!params) return;

	try {
		if (activeTabIndex.value === 0) {
			await fetchActivityData(params);
			return;
		}

		resetActivityData();

		if (activeTabIndex.value === 1) {
			await fetchSceneData(params);
			return;
		}

		if (activeTabIndex.value === 2) {
			await fetchIntelligenceData(params);
		}
	} catch {
		if (activeTabIndex.value === 0) {
			resetActivityData();
			return;
		}
		if (activeTabIndex.value === 1) {
			resetSceneData();
			return;
		}
		if (activeTabIndex.value === 2) {
			resetIntelligenceData();
		}
	}
};

/** 其他城市活动：直接打开列表返回的 url */
const openOtherCityActivity = (item: { url?: string }) => {
	if (!item.url) return;
	window.open(item.url, '_blank');
};

const handleRecentActivitiesClick = async (item: any) => {
	const { data }: any = await queryActivityUrl({ activityId: item.activityId });
	const url = data?.activityUrl;

	if (url) {
		window.open(ServiceUrl.getQmSysUrl() + url, '_blank');
	} else {
		ElMessage.error('该活动无法查看详情');
	}
};
const handleClick = (item: any) => {
	const targetUrl = `enterprise-form/aggregation-detail?sceneId=${item.sceneId}&iframe_menu_key=scene&type=cityDetail&to=efficiency`;
	window.open(ServiceUrl.adminUrl + targetUrl, '_blank');
};

watch([queryDateRange, dept, activeTabIndex, activeInfoTab], fetchData, {
	immediate: true,
	deep: true,
});
</script>

<style lang="less" scoped>
.planning-tabs {
	margin-left: auto;
	flex-shrink: 1;
	min-width: 0;
	max-width: 3.2rem;
	height: 0.31rem;
	display: inline-flex;
	align-items: center;
	background: rgba(255, 255, 255, 0.4);
	box-shadow: 0rem 0.02rem 0.04rem 0rem rgba(162, 169, 213, 0.66);
	border-radius: 0.17rem;
	border: 0.01rem solid #ffffff;
	backdrop-filter: blur(0.1134rem);

	:deep(.tabs-control_item) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 0.27rem;
		padding: 0 0.14rem;
		margin: 0;
		font-size: 0.14rem;
		line-height: 0.27rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.65);

		&.active {
			color: #ffffff;
		}
	}
}

.planning-metrics {
	display: flex;
	flex-shrink: 0;
	gap: 0.08rem;
	margin-bottom: 0.04rem;
}

.metric-item {
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
	min-width: 0;
	height: 0.65rem;
	padding: 0.07rem 0.12rem;
	background: url('@/assets/images/investmentFullProcess/plan-rect-bg.png') center / 100% 100%
		no-repeat;
}

.metric-label {
	font-weight: 500;
	font-size: 0.14rem;
	line-height: 0.2rem;
	color: #333333;
}

.metric-value {
	display: flex;
	align-items: baseline;

	span {
		font-weight: bold;
		font-size: 0.2rem;
		line-height: 0.21rem;
		color: #165dff;
	}

	small {
		margin-left: 0.02rem;
		font-weight: 400;
		font-size: 0.14rem;
		line-height: 0.21rem;
		color: rgba(0, 0, 0, 0.6);
	}
}

.planning-content {
	display: flex;
	flex: 1;
	min-width: 0;
	min-height: 0;
	gap: 0.1rem;
	overflow: hidden;
}

.activity-column {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
}

.column-title {
	flex-shrink: 0;
	margin-bottom: 0.02rem;
	font-size: 0.17rem;
	font-weight: 600;
	line-height: 0.27rem;
	color: rgba(0, 0, 0, 0.88);

	.number-font {
		padding-right: 0.06rem;
		color: #165dff;
	}
}

.activity-list {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
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

.activity-item {
	position: relative;
	height: 0.46rem;
	margin-bottom: 0.04rem;
	padding: 0.03rem 0.1rem 0.03rem 0.26rem;
	background-image: url('@/assets/images/investmentFullProcess/plan-column-bg.png');
	background-size: contain;
	background-repeat: no-repeat;
	&:last-child {
		margin-bottom: 0;
	}
}

.item-icon {
	position: absolute;
	top: 0.05rem;
	left: 0.07rem;
	width: 0.12rem;
	height: 0.12rem;
	object-fit: contain;
}

.item-text {
	flex: 1;
	min-width: 0;
}

.item-title,
.item-meta {
	font-weight: 400;
	font-size: 0.14rem;
	line-height: 0.2rem;
	color: #333333;
}

.item-title {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.item-meta {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.section-title {
	flex-shrink: 0;
	margin-bottom: 0.02rem;
	font-weight: 600;
	font-size: 0.17rem;
	line-height: 0.24rem;
	color: rgba(0, 0, 0, 0.88);
}

:deep(.scene-metrics) {
	flex-shrink: 0;
}

.enterprise-list {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
	min-height: 0;
	gap: 0.06rem;
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

.enterprise-item {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	justify-content: center;
	width: 100%;
	min-height: 0.76rem;
	height: 0.76rem;
	padding: 0.04rem 0.08rem;
	overflow: hidden;
	background: #f8fbff;
	border: 0.01rem solid #dcdfe6;
	border-radius: 0.05rem;
	box-shadow: 0 0.01rem 0.04rem 0 rgba(220, 223, 230, 0.58);
}

.enterprise-top {
	display: flex;
	align-items: flex-start;
	gap: 0.08rem;
	min-width: 0;
}

.enterprise-icon {
	flex-shrink: 0;
	width: 0.3rem;
	height: 0.32rem;
	object-fit: contain;
}

.enterprise-info {
	flex: 1;
	min-width: 0;
}

.enterprise-name {
	overflow: hidden;
	font-weight: 400;
	font-size: 0.14rem;
	line-height: 0.22rem;
	color: #333333;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.enterprise-industry {
	overflow: hidden;
	font-weight: 400;
	font-size: 0.13rem;
	line-height: 0.19rem;
	color: rgba(102, 102, 102, 0.51);
	text-overflow: ellipsis;
	white-space: nowrap;
}

.enterprise-summary {
	overflow: hidden;
	font-weight: 400;
	font-size: 0.14rem;
	line-height: 0.22rem;
	color: #165dff;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
