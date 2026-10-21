<template>
	<FrameBox class="module-frame intelligence-frame">
		<section class="module intelligence-overview">
			<header class="module-header compact-header">
				<div class="tabs-item active">
					<span class="module-title">重点工作</span>
					<div class="title-bg"></div>
				</div>
				<!-- <div class="go-btn">
					<img
						@click="clickParent('intelligenceOverview')"
						src="@/views/newOverallSituation/image/more.png"
						alt=""
					/>
				</div> -->
			</header>

			<div class="module-body equal-five">
				<!-- 1 招商情报 -->
				<div class="equal-block key-work-block">
					<div class="key-work-content">
						<div class="block-side">
							<img class="side-icon" src="../image/lefticon.png" alt="" />
							<span class="side-label">招商情报</span>
						</div>
						<div class="key-work-main">
							<div class="key-work-toolbar">
								<div class="key-work-tabs">
									<span
										class="key-work-tab"
										:class="{ active: keyWorkTab === 'gd' }"
										@click="keyWorkTab = 'gd'"
										>广东广州</span
									>
									<span
										class="key-work-tab"
										:class="{ active: keyWorkTab === 'other' }"
										@click="keyWorkTab = 'other'"
										>其他城市</span
									>
									<span
										class="key-work-tab"
										:class="{ active: keyWorkTab === 'speech' }"
										@click="keyWorkTab = 'speech'"
										>企业发言</span
									>
								</div>
								<div
									class="block-more"
									@click="clickParent('intelligenceOverview')"
								>
									查看更多
									<img
										class="more-arrows"
										src="../image/rightarrowIcon.png"
										alt=""
									/>
								</div>
							</div>
							<div
								v-show="keyWorkTab === 'gd'"
								class="key-work-list"
								v-loading="guangdongLoading"
								element-loading-background="rgba(255, 255, 255, 0.72)"
								element-loading-text="加载中..."
							>
								<div
									v-if="!guangdongLoading && guangdongMeetingList.length === 0"
									class="module-empty"
								>
									<img
										src="@/assets/images/IntelligenceOverview/emty.webp"
										class="module-empty-image"
										alt=""
									/>
									<div class="module-empty-text">暂无数据</div>
								</div>
								<a
									v-for="(item, index) in guangdongMeetingList"
									:key="item.id || `gd-${item.title}-${index}`"
									class="key-work-item"
									:href="item.link || item.url || 'javascript:void(0)'"
									:target="item.link || item.url ? '_blank' : undefined"
								>
									<span class="item-dot"></span>
									<el-tooltip
										:content="item.title"
										placement="top"
										:show-after="500"
										popper-class="my-tip"
									>
										<p class="item-title">{{ item.title }}</p>
									</el-tooltip>
									<time class="item-date">{{ item.date }}</time>
								</a>
							</div>
							<div
								v-show="keyWorkTab === 'other'"
								class="key-work-list"
								v-loading="otherProvinceLoading"
								element-loading-background="rgba(255, 255, 255, 0.72)"
								element-loading-text="加载中..."
							>
								<div
									v-if="
										!otherProvinceLoading &&
										otherProvinceMeetingList.length === 0
									"
									class="module-empty"
								>
									<img
										src="@/assets/images/IntelligenceOverview/emty.webp"
										class="module-empty-image"
										alt=""
									/>
									<div class="module-empty-text">暂无数据</div>
								</div>
								<a
									v-for="(item, index) in otherProvinceMeetingList"
									:key="item.id || `other-${item.title}-${index}`"
									class="key-work-item"
									:href="item.link || item.url || 'javascript:void(0)'"
									:target="item.link || item.url ? '_blank' : undefined"
								>
									<span class="item-dot"></span>
									<el-tooltip
										:content="item.title"
										placement="top"
										:show-after="500"
										popper-class="my-tip"
									>
										<p class="item-title">{{ item.title }}</p>
									</el-tooltip>
									<time class="item-date">{{ item.date }}</time>
								</a>
							</div>
							<div
								v-show="keyWorkTab === 'speech'"
								class="key-work-list"
								v-loading="enterpriseSpeechLoading"
								element-loading-background="rgba(255, 255, 255, 0.72)"
								element-loading-text="加载中..."
							>
								<div
									v-if="
										!enterpriseSpeechLoading &&
										enterpriseSpeechList.length === 0
									"
									class="module-empty"
								>
									<img
										src="@/assets/images/IntelligenceOverview/emty.webp"
										class="module-empty-image"
										alt=""
									/>
									<div class="module-empty-text">暂无数据</div>
								</div>
								<a
									v-for="(item, index) in enterpriseSpeechList"
									:key="item.id || `speech-${item.title}-${index}`"
									class="key-work-item"
									:href="item.link || item.url || 'javascript:void(0)'"
									:target="item.link || item.url ? '_blank' : undefined"
								>
									<span class="item-dot"></span>
									<el-tooltip
										:content="item.title"
										placement="top"
										:show-after="500"
										popper-class="my-tip"
									>
										<p class="item-title">{{ item.title }}</p>
									</el-tooltip>
									<time class="item-date">{{ item.date }}</time>
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- 2 大走访大对接 -->
				<div class="equal-block metric-block" v-loading="visitLoading">
					<div class="metric-content">
						<div class="block-side">
							<img class="side-icon" src="../image/lefticon.png" alt="" />
							<span class="side-label multi">大走访<br />大对接</span>
						</div>
						<div class="metric-main">
							<div
								class="block-more top-more"
								@click="clickParent('runByEnterprise')"
							>
								查看更多
								<img class="more-arrows" src="../image/rightarrowIcon.png" alt="" />
							</div>
							<div class="metric-top visit-top">
								<div class="top-item">
									<div class="top-label">目标企业数</div>
									<div class="top-value">
										<span>{{ visitData.jobTouch }}</span>
										<small>家</small>
									</div>
								</div>
								<div class="top-item">
									<div class="top-label">已完成走访数</div>
									<div class="top-value">
										<span>{{ visitData.touch }}</span>
										<small>家</small>
									</div>
								</div>
								<div class="top-item">
									<div class="top-label">任务完成率</div>
									<div class="top-value">
										<span
											>{{ visitData.rate
											}}{{ visitData.rate !== '--' ? '%' : '' }}</span
										>
									</div>
								</div>
							</div>
							<div class="metric-bottom visit-bottom">
								<div class="bottom-card">
									<div class="card-label">意向企业</div>
									<div class="card-row">
										<span class="card-num">{{ visitData.intentionCount }}</span>
										<small>家</small>
										<span class="card-num">{{
											visitData.intentionAmount
										}}</span>
										<small>亿元</small>
									</div>
								</div>
								<div class="bottom-card">
									<div class="card-label">转化线索</div>
									<div class="card-row">
										<span class="card-num">{{ visitData.clueCount }}</span>
										<small>家</small>
										<span class="card-num">{{ visitData.clueAmount }}</span>
										<small>亿元</small>
									</div>
								</div>
								<div class="bottom-card">
									<div class="card-label">转化项目</div>
									<div class="card-row">
										<span class="card-num">{{ visitData.projectCount }}</span>
										<small>家</small>
										<span class="card-num">{{ visitData.projectAmount }}</span>
										<small>亿元</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 3 招商活动 -->
				<div class="equal-block metric-block" v-loading="activityLoading">
					<div class="metric-content">
						<div class="block-side">
							<img class="side-icon" src="../image/lefticon.png" alt="" />
							<span class="side-label">招商活动</span>
						</div>
						<div class="metric-main">
							<div
								class="block-more top-more"
								@click="clickParent('activityOverview')"
							>
								查看更多
								<img class="more-arrows" src="../image/rightarrowIcon.png" alt="" />
							</div>
							<div class="metric-top activity-top">
								<div class="top-item">
									<div class="top-label">目标活动数</div>
									<div class="top-value">
										<span>{{ activityData.target }}</span>
									</div>
								</div>
								<div class="top-item">
									<div class="top-label">组织活动数</div>
									<div class="top-value">
										<span>{{ activityData.activityCount }}</span>
									</div>
								</div>
								<div class="top-item">
									<div class="top-label">任务完成率</div>
									<div class="top-value">
										<span
											>{{ activityData.rate
											}}{{ activityData.rate !== '--' ? '%' : '' }}</span
										>
									</div>
								</div>
							</div>
							<div class="metric-bottom activity-bottom">
								<div class="bottom-card">
									<div class="card-label">转化线索</div>
									<div class="card-row">
										<span class="card-num">{{ activityData.clueCount }}</span>
										<small>条</small>
										<span class="card-num">{{ activityData.clueAmount }}</span>
										<small>亿元</small>
									</div>
								</div>
								<div class="bottom-card">
									<div class="card-label">转化项目</div>
									<div class="card-row">
										<span class="card-num">{{
											activityData.projectCount
										}}</span>
										<small>条</small>
										<span class="card-num">{{
											activityData.projectAmount
										}}</span>
										<small>亿元</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 4 招商场景 -->
				<div class="equal-block metric-block" v-loading="sceneLoading">
					<div class="metric-content">
						<div class="block-side">
							<img class="side-icon" src="../image/lefticon.png" alt="" />
							<span class="side-label">招商场景</span>
						</div>
						<div class="metric-main">
							<div class="block-more top-more" @click="goScene">
								查看更多
								<img class="more-arrows" src="../image/rightarrowIcon.png" alt="" />
							</div>
							<div class="metric-top scene-top">
								<div class="top-item">
									<div class="top-label">目标场景数</div>
									<div class="top-value">
										<span>{{ sceneData.target }}</span>
									</div>
								</div>
								<div class="top-item">
									<div class="top-label">提交场景数</div>
									<div class="top-value">
										<span>{{ sceneData.submitted }}</span>
									</div>
								</div>
								<div class="top-item">
									<div class="top-label">有效待匹配</div>
									<div class="top-value">
										<span>{{ sceneData.valid }}</span>
									</div>
								</div>
								<div class="top-item">
									<div class="top-label">完成匹配数</div>
									<div class="top-value">
										<span>{{ sceneData.matched }}</span>
									</div>
								</div>
							</div>
							<div class="metric-bottom scene-bottom">
								<div class="bottom-card">
									<div class="card-label">已发布场景数</div>
									<div class="card-row">
										<span class="card-num">{{ sceneData.published }}</span>
										<small>个</small>
									</div>
								</div>
								<div class="bottom-card">
									<div class="card-label">转化项目数</div>
									<div class="card-row">
										<span class="card-num">{{ sceneData.project }}</span>
										<small>个</small>
									</div>
								</div>
								<div class="bottom-card">
									<div class="card-label">预计投资额</div>
									<div class="card-row">
										<span class="card-num">{{ sceneData.invest }}</span>
										<small>万元</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 5 招商GI -->
				<div class="equal-block metric-block" v-loading="giLoading">
					<div class="metric-content">
						<div class="block-side">
							<img class="side-icon" src="../image/lefticon.png" alt="" />
							<span class="side-label">招商GI</span>
						</div>
						<div class="metric-main gi-main">
							<div class="block-more top-more" @click="toGI">
								查看更多
								<img class="more-arrows" src="../image/rightarrowIcon.png" alt="" />
							</div>
							<div class="gi-list">
								<div v-if="!giLoading && giCards.length === 0" class="module-empty">
									<img
										src="@/assets/images/IntelligenceOverview/emty.webp"
										class="module-empty-image"
										alt=""
									/>
									<div class="module-empty-text">暂无数据</div>
								</div>
								<div
									v-for="(item, index) in giCards"
									:key="item.indicatorName || index"
									class="gi-row"
								>
									<span
										class="gi-name"
										:title="formatGiValue(item.indicatorName)"
									>
										{{ formatGiValue(item.indicatorName) }}
									</span>
									<span class="gi-data">
										<span class="gi-value">
											{{ formatGiValue(item.currentValue) }}
										</span>
										<small
											v-if="
												hasGiValue(item.currentValue) &&
												hasGiValue(item.unit)
											"
											class="gi-unit"
											>{{ item.unit }}</small
										>
									</span>
									<span class="gi-yoy">
										同比
										<em
											v-if="hasGiValue(item.yoyPercentage)"
											:class="{ up: isYoyUp(item.yoyPercentage) }"
										>
											{{ isYoyUp(item.yoyPercentage) ? '▲' : '▼' }}
											{{ formatYoy(item) }}
										</em>
										<span v-else class="gi-yoy-empty">--</span>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import {
	getleadervisitGDList,
	getleadervisitList,
	getleadervisitNGDList,
} from '@/api/Intelligence/index';
import { monitoringData } from '@/api/EfficiencyCenter';
import { queryActivityTable, querySceneTable } from '@/api/commandCenter/deptOverview';
import {
	getactivityoverviewList,
	getScenePublishStats,
	getvisittransformationList,
	queryTargetFollowCity,
} from '@/api/OverallSituation/index';
import router from '@/router';
import status from '@/stores/status';
import userStore from '@/stores/user';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';
import useClickParent from '../composables/useClickParent';

const { clickParent } = useClickParent();
const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
const { getCurrentDate } = statusStore;

type InfoItem = {
	id?: number | string;
	title: string;
	date: string;
	url?: string;
	link?: string;
};

type ApiListData<T> =
	| T[]
	| {
			records?: T[];
			rows?: T[];
			list?: T[];
	  };

type LeaderVisitApiItem = {
	id?: number | string;
	title?: string;
	createdAt?: string;
	link: string;
};

type GiIndicator = {
	indicatorName?: string | number | null;
	currentValue?: string | number | null;
	unit?: string | number | null;
	yoyPercentage?: string | number | null;
	yoyUnit?: string | number | null;
};

const keyWorkTab = ref<'gd' | 'other' | 'speech'>('gd');
const guangdongMeetingList = ref<InfoItem[]>([]);
const otherProvinceMeetingList = ref<InfoItem[]>([]);
const enterpriseSpeechList = ref<InfoItem[]>([]);
const guangdongLoading = ref(false);
const otherProvinceLoading = ref(false);
const enterpriseSpeechLoading = ref(false);
let meetingRequestId = 0;

const fallback = (val: unknown) => (val === 0 || val === '0' ? val : val || '--');
const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};

const pickSummaryRow = (res: any): Record<string, any> | null => {
	const data = res?.data;
	if (data == null) return null;
	if (Array.isArray(data?.rows)) {
		const first = data.rows[0];
		return first && typeof first === 'object' ? first : null;
	}
	if (Array.isArray(data)) {
		const first = data[0];
		return first && typeof first === 'object' ? first : null;
	}
	if (typeof data === 'object') return data;
	return null;
};

// ---------- 重点工作 ----------
function getApiList<T>(data: ApiListData<T> | null | undefined): T[] {
	if (Array.isArray(data)) return data;
	if (data && typeof data === 'object') {
		return data.records || data.rows || data.list || [];
	}
	return [];
}

const isSuccessCode = (code: unknown) => Number(code) === 0;
const formatDate = (value?: string | null) => String(value ?? '').slice(0, 10);

const normalizeLeaderVisitInfo = (item: LeaderVisitApiItem | null | undefined): InfoItem | null => {
	if (!item || typeof item !== 'object') return null;
	return {
		id: item.id,
		title: item.title || '-',
		date: formatDate(item.createdAt),
		link: item.link || '',
	};
};

const buildLeaderVisitList = (res: {
	code?: unknown;
	data?: ApiListData<LeaderVisitApiItem>;
}): InfoItem[] => {
	if (!isSuccessCode(res?.code)) return [];
	const rawList = getApiList(res.data);
	return rawList
		.map((item) => normalizeLeaderVisitInfo(item))
		.filter((item): item is InfoItem => item !== null)
		.slice(0, 30);
};

const getLeaderVisitGDInfoList = async (requestId: number) => {
	guangdongLoading.value = true;
	try {
		const res = await getleadervisitGDList<ApiListData<LeaderVisitApiItem>>();
		if (requestId !== meetingRequestId) return;
		guangdongMeetingList.value = buildLeaderVisitList(res);
	} catch {
		if (requestId !== meetingRequestId) return;
		guangdongMeetingList.value = [];
	} finally {
		if (requestId === meetingRequestId) guangdongLoading.value = false;
	}
};

const getLeaderVisitNGDInfoList = async (requestId: number) => {
	otherProvinceLoading.value = true;
	try {
		const res = await getleadervisitNGDList<ApiListData<LeaderVisitApiItem>>();
		if (requestId !== meetingRequestId) return;
		otherProvinceMeetingList.value = buildLeaderVisitList(res);
	} catch {
		if (requestId !== meetingRequestId) return;
		otherProvinceMeetingList.value = [];
	} finally {
		if (requestId === meetingRequestId) otherProvinceLoading.value = false;
	}
};

const getEnterpriseSpeechList = async (requestId: number) => {
	enterpriseSpeechLoading.value = true;
	try {
		const res = await getleadervisitList<ApiListData<LeaderVisitApiItem>>({
			pageNum: 1,
			pageSize: 30,
			entity: { articleType: 2 },
		});
		if (requestId !== meetingRequestId) return;
		enterpriseSpeechList.value = buildLeaderVisitList(res);
	} catch {
		if (requestId !== meetingRequestId) return;
		enterpriseSpeechList.value = [];
	} finally {
		if (requestId === meetingRequestId) enterpriseSpeechLoading.value = false;
	}
};

const getMeetingInfoList = async () => {
	meetingRequestId += 1;
	const requestId = meetingRequestId;
	await Promise.all([
		getLeaderVisitGDInfoList(requestId),
		getLeaderVisitNGDInfoList(requestId),
		getEnterpriseSpeechList(requestId),
	]);
};

// ---------- 大走访 ----------
const visitLoading = ref(false);
const visitData = reactive({
	jobTouch: '--' as string | number,
	touch: '--' as string | number,
	rate: '--' as string | number,
	intentionCount: '--' as string | number,
	intentionAmount: '--' as string | number,
	clueCount: '--' as string | number,
	clueAmount: '--' as string | number,
	projectCount: '--' as string | number,
	projectAmount: '--' as string | number,
});

const getVisitData = async () => {
	const currentDate = getCurrentDate();
	if (!currentDate) return;
	const { startTimeStr, endTimeStr, label: date } = currentDate;
	visitLoading.value = true;
	try {
		const [res = {}, transformRes = {}]: any = await Promise.all([
			queryTargetFollowCity({ startTimeStr, endTimeStr }),
			getvisittransformationList({ date }),
		]);
		const row = pickSummaryRow(res);
		if (res.code === 0 && row) {
			visitData.jobTouch = fallback(row.jobTouch) as string | number;
			visitData.touch = fallback(row.touch) as string | number;
			visitData.rate = fallback(row.rate) as string | number;
		} else {
			visitData.jobTouch = '--';
			visitData.touch = '--';
			visitData.rate = '--';
		}
		if (transformRes.code === 0 && transformRes.data) {
			const d = transformRes.data;
			visitData.intentionCount = fallback(d.intentionEnterpriseCount) as string | number;
			visitData.intentionAmount = formatAmount(d.intentionEnterpriseAmount);
			visitData.clueCount = fallback(d.convertedClueCount) as string | number;
			visitData.clueAmount = formatAmount(d.convertedClueAmount);
			visitData.projectCount = fallback(d.convertedProjectCount) as string | number;
			visitData.projectAmount = formatAmount(d.convertedProjectAmount);
		} else {
			visitData.intentionCount = '--';
			visitData.intentionAmount = '--';
			visitData.clueCount = '--';
			visitData.clueAmount = '--';
			visitData.projectCount = '--';
			visitData.projectAmount = '--';
		}
	} catch {
		Object.assign(visitData, {
			jobTouch: '--',
			touch: '--',
			rate: '--',
			intentionCount: '--',
			intentionAmount: '--',
			clueCount: '--',
			clueAmount: '--',
			projectCount: '--',
			projectAmount: '--',
		});
	} finally {
		visitLoading.value = false;
	}
};

// ---------- 招商活动 ----------
const activityLoading = ref(false);
const activityData = reactive({
	target: '--' as string | number,
	activityCount: '--' as string | number,
	rate: '--' as string | number,
	clueCount: '--' as string | number,
	clueAmount: '--' as string | number,
	projectCount: '--' as string | number,
	projectAmount: '--' as string | number,
});

const getActivityData = async () => {
	const currentDate = getCurrentDate();
	if (!currentDate) return;
	const { startTimeStr, endTimeStr, label: date } = currentDate;
	activityLoading.value = true;
	try {
		const [res = {}, detailRes = {}]: any = await Promise.all([
			queryActivityTable({ startTimeStr, endTimeStr, tabType: 'CITY_OVERVIEW' }),
			getactivityoverviewList({ date }),
		]);
		const row = pickSummaryRow(res);
		if (res.code === 0 && row) {
			activityData.target = fallback(row.taskCount) as string | number;
			activityData.rate = fallback(row.completionRate) as string | number;
			activityData.activityCount = fallback(row.totalCount) as string | number;
		} else {
			activityData.target = '--';
			activityData.rate = '--';
			activityData.activityCount = '--';
		}
		if (detailRes.code === 0 && detailRes.data) {
			const d = detailRes.data;
			if (d.activityCount != null) {
				activityData.activityCount = fallback(d.activityCount) as string | number;
			}
			activityData.clueCount = fallback(d.convertedClueCount) as string | number;
			activityData.clueAmount = formatAmount(d.convertedClueAmount);
			activityData.projectCount = fallback(d.convertedProjectCount) as string | number;
			activityData.projectAmount = formatAmount(d.convertedProjectAmount);
		} else {
			activityData.clueCount = '--';
			activityData.clueAmount = '--';
			activityData.projectCount = '--';
			activityData.projectAmount = '--';
		}
	} catch {
		Object.assign(activityData, {
			target: '--',
			activityCount: '--',
			rate: '--',
			clueCount: '--',
			clueAmount: '--',
			projectCount: '--',
			projectAmount: '--',
		});
	} finally {
		activityLoading.value = false;
	}
};

// ---------- 招商场景 ----------
const sceneLoading = ref(false);
const sceneData = reactive({
	target: '--' as string | number,
	submitted: '--' as string | number,
	valid: '--' as string | number,
	matched: '--' as string | number,
	published: '--' as string | number,
	project: '--' as string | number,
	invest: '--' as string | number,
});

const getSceneData = async () => {
	const currentDate = getCurrentDate();
	if (!currentDate) return;
	const { startTimeStr, endTimeStr } = currentDate;
	sceneLoading.value = true;
	try {
		const [res = {}, publishRes = {}]: any = await Promise.all([
			querySceneTable({ startTimeStr, endTimeStr, tabType: 'CITY_OVERVIEW' }),
			getScenePublishStats({ date: yearSelectValue.value }),
		]);
		const row = pickSummaryRow(res);
		if (res?.code === 0 && row) {
			sceneData.target = fallback(row.taskCount) as string | number;
			sceneData.submitted = fallback(row.submittedSceneCount) as string | number;
			sceneData.valid = fallback(row.pendingMatchCount) as string | number;
			sceneData.matched = fallback(
				row.matchedSceneCount ?? row.completedMatchCount ?? row.qualifiedSceneCount
			) as string | number;
		} else {
			sceneData.target = '--';
			sceneData.submitted = '--';
			sceneData.valid = '--';
			sceneData.matched = '--';
		}

		// getScenePublishStats 直接赋值
		if (Number(publishRes.code) === 0 && publishRes.data) {
			const d = publishRes.data;
			sceneData.published = fallback(d.publishedSceneCount) as string | number;
			sceneData.project = fallback(d.projectCount) as string | number;
			sceneData.invest = formatAmount(d.projectAmount);
		} else {
			sceneData.published = '--';
			sceneData.project = '--';
			sceneData.invest = '--';
		}
	} catch {
		Object.assign(sceneData, {
			target: '--',
			submitted: '--',
			valid: '--',
			matched: '--',
			published: '--',
			project: '--',
			invest: '--',
		});
	} finally {
		sceneLoading.value = false;
	}
};

const goScene = () => {
	router.push({ path: '/operationCenter/scene' });
};

// ---------- 招商GI ----------
const giLoading = ref(false);
const giCards = ref<GiIndicator[]>([]);

const hasGiValue = (value: unknown) => value !== null && value !== undefined && value !== '';
const formatGiValue = (value: unknown) => (hasGiValue(value) ? String(value) : '--');
const isYoyUp = (value: unknown) => Number(value) > 0;
const formatYoy = (item: GiIndicator) =>
	hasGiValue(item.yoyPercentage)
		? `${item.yoyPercentage}${hasGiValue(item.yoyUnit) ? item.yoyUnit : ''}`
		: '--';

const getGiData = async () => {
	if (!yearSelectValue.value) return;
	giLoading.value = true;
	try {
		const res = await monitoringData<{ indicators?: GiIndicator[] }>({
			yearMonth: yearSelectValue.value,
		});
		if (res?.code !== 0) {
			giCards.value = [];
			return;
		}
		const list = res.data?.indicators;
		giCards.value = Array.isArray(list) ? list : [];
	} catch {
		giCards.value = [];
	} finally {
		giLoading.value = false;
	}
};

const toGI = () => {
	userStore().setDateSelect(yearSelectValue.value);
	router.push({ name: 'efficiencyIndex' });
};

const refreshMetricBlocks = async () => {
	await Promise.all([getVisitData(), getActivityData(), getSceneData(), getGiData()]);
};

onMounted(() => {
	getMeetingInfoList();
});

watch(
	() => yearSelectValue.value,
	(val) => {
		if (val) refreshMetricBlocks();
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import './moduleCommon.less';

a {
	text-decoration: none;
	color: inherit;
}

.intelligence-frame.module-frame.outside {
	/* 与网格 stretch 配合，避免 height:100% 在跨行时高度偏短 */
	height: 100.5%;
	// min-height: 100%;
	overflow: hidden;
	/* FrameBox 原有内边距 */
	padding: 0.06rem 0.06rem 0.01rem 0.064rem;
	background: url('../image/boxback2.png') center / 100% 100% no-repeat !important;
	box-shadow: none !important;

	:deep(.outside-content) {
		min-height: 0;
		overflow: hidden;
		box-shadow: none;
	}

	:deep(.outside-content > div) {
		min-height: 0;
		overflow: hidden;
	}

	.intelligence-overview {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		padding: 0.06rem;
		.compact-header {
			display: flex;
			flex-shrink: 0;
			align-items: center;
			gap: clamp(0.08rem, 0.8vw, 0.12rem);

			.tabs-item {
				position: relative;
				--info-title-tab-height: clamp(0.36rem, 4.4vh, 0.46rem);
				width: clamp(1.45rem, 9vw, 1.8rem);
				height: var(--info-title-tab-height);

				&.active {
					background: url('../image/step-base.png') left top / 1rem 74% no-repeat;
				}

				.module-title {
					font-family: SourceHanSansCN-Bold;
					font-size: clamp(0.18rem, 2.3vh, 0.24rem);
					line-height: var(--info-title-tab-height);
					text-align: left;
					padding-left: 0.22rem;
					margin-right: 0;
					color: rgba(78, 89, 105, 0.51);
					text-shadow: 2px 2px 0px #ffffff;
					background: unset;
				}

				&.active .module-title,
				&:hover .module-title {
					background: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
					-webkit-background-clip: text;
					background-clip: text;
					color: transparent;
					text-shadow: none;
				}

				.title-bg {
					position: absolute;
					inset: 0;
					pointer-events: none;
				}
			}

			.go-btn {
				width: clamp(0.82rem, 5.3vw, 1rem);
				height: clamp(0.2rem, 2.4vh, 0.26rem);
				cursor: pointer;
				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
		}
	}

	.module-body.equal-five {
		display: grid;
		grid-template-rows: repeat(5, minmax(0, 1fr));
		flex: 1 1 0;
		min-height: 0;
		gap: 0;
		overflow: hidden;
	}

	.equal-block {
		min-height: 0;
		overflow: hidden;
		border-bottom: 0.02rem solid rgba(91, 143, 249, 0.35);

		&:last-child {
			border-bottom: 0;
		}
	}

	.block-side {
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		align-items: center;
		align-self: center;
		justify-content: center;
		gap: 0.04rem;
		width: 0.9rem;
		min-height: 0;
		.side-icon {
			width: 0.63rem;
			height: 0.74rem;
			object-fit: contain;
			flex-shrink: 0;
		}

		.side-label {
			font-family: SourceHanSansCN-Bold;
			font-size: 0.19rem;
			color: rgba(0, 0, 0, 0.8);
			line-height: 0.24rem;
			text-align: left;
			font-style: normal;
			white-space: nowrap;

			&.multi {
				white-space: normal;
			}
		}
	}

	.block-more {
		position: relative;
		top: -0.05rem;
		display: inline-flex;
		align-items: center;
		gap: 0.04rem;
		font-family: SourceHanSansCN;
		font-weight: 400;
		font-size: 0.12rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.12rem;
		text-align: right;
		cursor: pointer;

		.more-arrows {
			width: 0.12rem;
			height: 0.12rem;
			object-fit: contain;
		}

		&:hover {
			color: #2f7bff;
			.more-arrows {
				color: #2f7bff;
			}
		}

		&.top-more {
			margin-left: auto;
		}
	}

	// ----- 重点工作 -----
	.key-work-block {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	.key-work-content {
		display: flex;
		align-items: center;
		flex: 1 1 0;
		height: 100%;
		min-height: 0;
		gap: 0.06rem;
		overflow: hidden;
	}

	.key-work-main {
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		align-self: stretch;
		min-width: 0;
		min-height: 0;
		max-height: 100%;
		overflow: hidden;
		padding-bottom: 0.1rem;
	}

	.key-work-toolbar {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.04rem;
	}

	.key-work-tabs {
		display: flex;
		align-items: center;
		gap: 0.04rem;
		padding: 0.02rem;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 0.16rem;
		border: 1px solid #ccd4ff;
	}

	.key-work-tab {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 0.9rem;
		height: clamp(0.24rem, 2.8vh, 0.28rem);
		padding: 0 0.12rem;
		font-family: SourceHanSansCN-Bold;
		font-size: clamp(0.12rem, 1.4vh, 0.14rem);
		color: rgba(0, 0, 0, 0.45);
		cursor: pointer;
		border: 0.01rem solid transparent;
		border-radius: 0.14rem;
		background: transparent;
		box-sizing: border-box;

		&.active {
			color: #2f7bff;
			font-family: SourceHanSansCN-Bold;
			background: #fff;
			border-color: #5aa0ff;
			box-shadow: 0 0.02rem 0.06rem rgba(90, 160, 255, 0.18);
		}
	}

	.key-work-list {
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		height: 0;
		min-width: 0;
		min-height: 0;
		gap: 0.04rem;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;

		&::-webkit-scrollbar {
			width: 0.04rem;
		}
		&::-webkit-scrollbar-thumb {
			background: rgba(47, 123, 255, 0.28);
			border-radius: 0.04rem;
		}
	}

	.key-work-item {
		display: flex;
		align-items: center;
		flex: 0 0 auto;
		min-width: 0;
		height: clamp(0.28rem, 3.2vh, 0.34rem);
		padding: 0 0.1rem 0 0.08rem;
		background: #f2f4fe;
		border-radius: 0.06rem;

		.item-dot {
			width: 0.1rem;
			height: 0.1rem;
			margin-right: 0.08rem;
			flex-shrink: 0;
			box-sizing: border-box;
			border: 0.015rem solid #3d8bff;
			border-radius: 50%;
			background: #fff;
		}

		.item-title {
			flex: 1 1 auto;
			min-width: 0;
			margin: 0;
			padding-right: 0.08rem;
			font-family: SourceHanSansCN;
			font-size: clamp(0.12rem, 1.4vh, 0.14rem);
			color: #4b4b4b;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.item-date {
			flex: 0 0 auto;
			font-family: SourceHanSansCN;
			font-size: clamp(0.12rem, 1.35vh, 0.13rem);
			color: #8a93a3;
			white-space: nowrap;
		}
	}

	// ----- 指标块通用 -----
	.metric-block {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	.metric-content {
		display: flex;
		align-items: center;
		flex: 1 1 0;
		height: 100%;
		min-height: 0;
		gap: 0.06rem;
		overflow: hidden;
	}

	.metric-main {
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		align-self: stretch;
		justify-content: space-between;
		min-width: 0;
		min-height: 0;
		max-height: 100%;
		overflow: hidden;
		padding: 0.1rem 0;
	}

	.metric-top {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		flex-shrink: 0;
		margin-bottom: 0.06rem;
	}

	// @media (max-height: 1080px) and (min-resolution: 2dppx) {
	// 	.metric-top {
	// 		margin-bottom: 0.05rem !important;
	// 	}
	// 	.bottom-card {
	// 		height: 0.57rem !important;
	// 	}
	// 	.side-label {
	// 		font-size: 0.16rem !important;
	// 		line-height: 0.16rem !important;
	// 	}
	// 	/* 你的样式，针对高度 ≤ 1080 的高分屏 */
	// }

	.top-item {
		position: relative;
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		align-items: center;
		min-width: 0;
		text-align: center;

		&:not(:last-child) {
			&::after {
				position: absolute;
				right: 0;
				top: 50%;
				width: 0.01rem;
				height: 0.36rem;
				content: '';
				transform: translateY(-50%);
				background: linear-gradient(
					180deg,
					rgba(147, 183, 255, 0) 0%,
					rgba(147, 183, 255, 0.9) 50%,
					rgba(147, 183, 255, 0) 100%
				);
			}
		}

		.top-label {
			font-family: SourceHanSansCN-Bold;
			font-size: 0.15rem;
			color: rgba(0, 0, 0, 0.8);
			line-height: 0.24rem;
			text-align: center;
			font-style: normal;
		}

		.top-value {
			display: flex;
			align-items: baseline;
			justify-content: center;
			gap: 0.02rem;
			min-width: 0;

			span {
				font-family: SourceHanSansCN-Bold;
				font-size: 0.18rem;
				color: #165dff;
				line-height: 0.13rem;
				text-align: center;
				font-style: normal;
			}

			small {
				font-family: SourceHanSansCN;
				font-weight: 400;
				font-size: 0.1rem;
				color: rgba(0, 0, 0, 0.65);
				line-height: 0.14rem;
				text-align: center;
				font-style: normal;
			}
		}
	}

	.metric-bottom {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 0.06rem;
		min-height: 0;
		margin-bottom: 0.1rem;
		justify-content: space-between;

		&.activity-bottom .bottom-card {
			flex: 0 0 1.87rem;
			width: 1.87rem;
		}
	}

	.bottom-card {
		display: flex;
		flex: 0 0 1.28rem;
		flex-direction: column;
		justify-content: center;
		width: 1.28rem;
		height: 0.62rem;
		padding: 0.06rem 0.08rem;
		background: #f2f4fe;
		border-radius: 0.06rem;
		box-sizing: border-box;
		box-shadow: inset 0 0 0 0.01rem rgba(78, 151, 244, 0.18);

		.card-label {
			font-family: SourceHanSansCN;
			font-weight: 400;
			font-size: 0.14rem;
			color: #000000;
			line-height: 0.2rem;
			text-align: center;
			font-style: normal;
			margin-bottom: 0.02rem;
		}

		.card-row {
			display: flex;
			align-items: baseline;
			justify-content: center;
			flex-wrap: wrap;
			gap: 0 0.02rem;
			min-width: 0;

			.card-num {
				font-family: SourceHanSansCN-Bold;
				font-size: 0.18rem;
				color: #000000;
				line-height: 0.24rem;
				text-align: center;
				font-style: normal;
			}

			small {
				font-family: SourceHanSansCN;
				font-size: clamp(0.1rem, 1.2vh, 0.12rem);
				color: rgba(0, 0, 0, 0.45);

				&:not(:last-child) {
					margin-right: 0.5em;
				}
			}
		}
	}

	// ----- GI -----
	.gi-main {
		justify-content: flex-start;
	}

	.gi-list {
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		height: 0;
		min-height: 0;
		gap: 0.04rem;
		overflow-x: hidden;
		overflow-y: auto;
		margin-top: 0.05rem;
		&::-webkit-scrollbar {
			width: 0.04rem;
		}
		&::-webkit-scrollbar-thumb {
			background: rgba(47, 123, 255, 0.28);
			border-radius: 0.04rem;
		}
	}

	.gi-row {
		display: flex;
		align-items: center;
		flex: 0 0 auto;
		min-width: 0;
		height: clamp(0.28rem, 3.1vh, 0.34rem);
		padding: 0 0.06rem 0 0.1rem;
		background: url('../image/listback.png') center / 100% 100% no-repeat;
		box-sizing: border-box;

		.gi-name {
			flex: 1 1 auto;
			min-width: 0;
			margin-right: 0.08rem;
			font-family: SourceHanSansCN;
			font-weight: 400;
			font-size: 0.14rem;
			color: #000000;
			line-height: 0.2rem;
			text-align: left;
			font-style: normal;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.gi-data {
			display: flex;
			flex: 0 0 0.95rem;
			align-items: baseline;
			justify-content: flex-end;
			margin-left: auto;
			white-space: nowrap;
		}

		.gi-value {
			font-family: SourceHanSansCN-Bold;
			font-size: 0.16rem;
			color: #000000;
			line-height: 0.28rem;
			text-align: right;
			font-style: normal;
		}

		.gi-unit {
			margin-left: 0.02rem;
			font-family: SourceHanSansCN;
			font-size: clamp(0.11rem, 1.25vh, 0.12rem);
			color: rgba(0, 0, 0, 0.45);
		}

		.gi-yoy {
			flex: 0 0 0.9rem;
			margin-left: 0.1rem;
			white-space: nowrap;
			// width: rem;
			text-align: left;
			font-family: SourceHanSansCN;
			font-size: clamp(0.11rem, 1.25vh, 0.12rem);
			color: rgba(0, 0, 0, 0.45);

			em {
				margin-left: 0.02rem;
				font-style: normal;
				color: #f53f3f;

				&.up {
					color: #00b42a;
				}
			}

			.gi-yoy-empty {
				margin-left: 0.02rem;
				color: #000000;
			}
		}
	}

	.module-empty {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.04rem;
		min-height: 0;
	}

	.module-empty-image {
		width: 0.4rem;
		height: 0.4rem;
		object-fit: contain;
	}

	.module-empty-text {
		font-size: 0.12rem;
		color: rgba(0, 0, 0, 0.45);
	}
}

:global(.el-popper.my-tip) {
	background: #ffffff !important;
	color: #000000 !important;
	border: 0.01rem solid rgba(0, 0, 0, 0.12) !important;
	box-shadow: 0 0.04rem 0.12rem rgba(0, 0, 0, 0.12) !important;
}
:global(.el-popper.my-tip .el-popper__arrow::before) {
	background: #ffffff !important;
	border-color: rgba(0, 0, 0, 0.12) !important;
}
</style>
