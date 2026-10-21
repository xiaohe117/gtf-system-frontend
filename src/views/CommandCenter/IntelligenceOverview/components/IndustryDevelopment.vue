<!--
 * @Descripttion: 产业发展情报组件
 * @Author: opencode
 * @Date: 2026-06-12
-->
<template>
	<div class="industry-development">
		<div class="industry-info-section">
			<div class="section-header">
				<!-- <div class="title-wrapper">
					<img
						src="@/assets/images/IntelligenceOverview/IndustryDevelopment.png"
						class="title-bg"
						alt=""
					/>
					<div class="view-more" @click="handleViewMore">
						<img src="@/assets/images/IntelligenceOverview/many.png" alt="" />
					</div>
				</div> -->
				<div style="display: flex; justify-content: center">
					<SectionTitle title="产业发展情报"> </SectionTitle>
					<div class="view-more" @click="handleViewMore">
						<img src="@/assets/images/IntelligenceOverview/many.png" alt="" />
					</div>
				</div>

				<el-radio-group :model-value="activeTab" class="tab-bar" @change="handleTabClick">
					<el-radio-button
						v-for="tab in tabs"
						:key="tab.value"
						:label="tab.value"
						class="tab-item"
						:class="{ active: activeTab === tab.value }"
					>
						{{ tab.label }}
					</el-radio-button>
				</el-radio-group>
			</div>

			<div v-loading="loading" class="content-area">
				<div class="exhibition-section">
					<div
						ref="industryListRef"
						class="exhibition-list"
						@scroll="handleIndustryListScroll"
					>
						<div
							v-if="!loading && industryInfoList.length === 0"
							class="module-empty industry-list-empty"
						>
							<img
								src="@/assets/images/IntelligenceOverview/emty.webp"
								class="module-empty-image"
								alt=""
							/>
							<div class="module-empty-text">暂无数据</div>
						</div>
						<a
							v-for="(item, index) in industryInfoList"
							:key="item.id"
							class="exhibition-item"
							:href="getIndustryItemHref(item)"
							target="_blank"
							rel="noopener noreferrer"
							@click="handleIndustryItemClick(item, $event)"
						>
							<div class="exhibition-title">
								<span class="exhibition-icon">
									<img
										src="@/assets/images/IntelligenceOverview/start.png"
										alt=""
									/>
								</span>
								<el-tag
									v-if="activeTab === 1 && item.round"
									class="financing-round-tag"
									type="success"
									effect="light"
								>
									{{ item.round || '--' }}
								</el-tag>
								<span class="exhibition-title-tooltip">
									<el-tooltip
										:show-after="500"
										:content="item.title || '--'"
										placement="top"
										:disabled="
											!item.title ||
											!isIndustryOverflowTooltip(
												getIndustryTextKey(index, 'title')
											)
										"
									>
										<span
											:ref="
												setIndustryOverflowTooltipRef(
													getIndustryTextKey(index, 'title')
												)
											"
											class="exhibition-title-text"
										>
											{{ item.title || '--' }}
										</span>
									</el-tooltip>
								</span>
								<span v-if="item.date" class="exhibition-date">{{
									item.date
								}}</span>
							</div>
							<div
								class="exhibition-info info-grid"
								:class="{ 'financing-info-grid': activeTab === 1 }"
							>
								<div class="info-cell info-date-cell">
									<span class="info-label">开展时间：</span>
									<span class="info-value">{{ item.date || '--' }}</span>
								</div>
								<div v-if="activeTab !== 2" class="info-cell info-region-cell">
									<span class="info-label">所在地区：</span>
									<span class="info-value">{{ item.region || '--' }}</span>
								</div>
								<div v-if="activeTab === 0" class="info-cell info-location-cell">
									<span class="info-label">展馆地点：</span>
									<span class="info-value">{{ item.location || '--' }}</span>
								</div>
								<div
									v-if="activeTab !== 2"
									class="info-cell info-industry-cell industry-info-cell"
								>
									<span class="info-label">所属行业：</span>
									<span class="info-value">
										<el-tooltip
											:show-after="500"
											:content="item.industry || '--'"
											placement="top"
											:disabled="
												!item.industry ||
												!isIndustryOverflowTooltip(
													getIndustryTextKey(index, 'industry')
												)
											"
										>
											<span
												:ref="
													setIndustryOverflowTooltipRef(
														getIndustryTextKey(index, 'industry')
													)
												"
												class="info-tooltip-text"
											>
												{{ item.industry || '--' }}
											</span>
										</el-tooltip>
									</span>
								</div>
								<div class="info-cell info-cell-wide info-organization-cell">
									<span class="info-label">{{
										activeTab === 1 ? '相关企业：' : '主办单位：'
									}}</span>
									<span class="info-value">
										<el-tooltip
											:show-after="500"
											:content="item.organization || '--'"
											placement="top"
											:disabled="
												!item.organization ||
												!isIndustryOverflowTooltip(
													getIndustryTextKey(index, 'organization')
												)
											"
										>
											<span
												:ref="
													setIndustryOverflowTooltipRef(
														getIndustryTextKey(index, 'organization')
													)
												"
												class="info-tooltip-text"
											>
												{{ item.organization || '--' }}
											</span>
										</el-tooltip>
									</span>
								</div>
								<div
									v-if="activeTab === 0"
									class="info-cell info-cell-wide info-co-organizer-cell"
								>
									<span class="info-label">承办单位：</span>
									<span class="info-value">{{ item.coOrganizer || '--' }}</span>
								</div>
								<div v-if="activeTab === 0" class="info-cell info-website-cell">
									<span class="info-label">展会网址：</span>
									<span class="info-value">{{ item.website || '--' }}</span>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="hot-words-section">
			<SectionTitle title="情报热词" />
			<!-- <div class="sub-header">
				<div class="sub-title">
					<div class="dot-text">情报热词</div>
				</div>
			</div> -->
			<div v-loading="hotWordsLoading" class="hot-words-cloud">
				<div class="cloud-box" v-if="hotWordCloud.length">
					<BaseChart
						:chartOption="cloudOption"
						width="90%"
						height="3.55rem"
						@click="bindCloudClick"
					/>
				</div>
			</div>
			<!--<div class="hot-words-cloud">
					<template v-if="hotWordCloud.length > 0">
						<span
							v-for="(word, index) in hotWordCloud"
							:key="`${word.text}-${index}`"
							class="hot-word"
							:class="[word.bgClass, { 'is-top': word.isTop }]"
						>
							{{ word.text }}
						</span>
					</template>
					<div
						v-else
						class="module-empty hot-word-empty"
					>
						<img
							src="@/assets/images/IntelligenceOverview/emty.webp"
							class="module-empty-image"
							alt=""
						/>
						<div class="module-empty-text">暂无数据</div>
					</div>
				</div>-->
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import {
	getFinancingDynamicList,
	gethotWord,
	getMeetingDynamicList,
	getPolicyDynamicList,
	getQxbToken as fetchQxbToken,
} from '@/api/Intelligence/index';
import { chartCloudOption } from './chartOptions';
import useOverflowTooltip from './useOverflowTooltip';

defineProps<{
	getQxbToken: () => Promise<string>;
}>();

type TabIndex = 0 | 1 | 2;

type IndustryChainInfo = {
	industryChainId?: string;
	industryChainName?: string;
};

type IndustryChainInfoValue =
	| IndustryChainInfo
	| Array<IndustryChainInfo | string>
	| string
	| null
	| undefined;

type MeetingDynamicItem = {
	id: number | string;
	exhibitionTitle?: string;
	beginDate?: string;
	endDate?: string;
	province?: string;
	city?: string;
	exhibitionLocation?: string;
	industry?: string;
	hostUnit?: string;
	undertake?: string;
	web?: string;
	url?: string;
};

type FinancingDynamicItem = {
	id: number | string;
	newsTitle?: string;
	newsLink?: string;
	date?: string;
	provinceName?: string;
	cityName?: string;
	industryChainInfoList?: IndustryChainInfoValue;
	enterpriseName?: string;
	round?: string;
};

type PolicyDynamicItem = {
	id: number | string;
	policyDynamicId?: number | string;
	title?: string;
	publishTime?: string;
	dept?: string;
	url?: string;
};

type ApiListData<T> =
	| T[]
	| {
			records?: T[];
			rows?: T[];
			list?: T[];
	  };

type IndustryInfoItem = {
	id: number | string;
	title: string;
	link: string;
	date: string;
	region: string;
	location: string;
	industry: string;
	organization: string;
	coOrganizer: string;
	website: string;
	round: string;
	policyDynamicId?: number | string;
};

type HotWord = {
	text: string;
	frequency: number;
};

type HotWordApiItem = {
	word?: string;
	contentCount?: number;
};

const tabs = [
	{ label: '展会动态', value: 0 },
	{ label: '政策动态', value: 2 },
] as const;
const route = useRoute();
const activeTab = ref<TabIndex>((Number(route.query.devTab) as TabIndex) || 0);
const loading = ref(false);
const industryInfoList = ref<IndustryInfoItem[]>([]);
const industryListRef = ref<HTMLElement | null>(null);
const industryPageSize = 15;
const industryHasNext = ref(true);
let industryMinLoadedPage = 1;
let industryMaxLoadedPage = 0;
let industryLoadedPages = new Set<number>();
let industryScrollTimer: ReturnType<typeof setTimeout> | null = null;
type IndustryLoadDirection = 'init' | 'down' | 'up';
type IndustryTooltipField = 'title' | 'industry' | 'organization';

const {
	isOverflowTooltip: isIndustryOverflowTooltip,
	refreshOverflowTooltip: refreshIndustryOverflowTooltip,
	setOverflowTooltipRef: setIndustryOverflowTooltipRef,
} = useOverflowTooltip();

const getIndustryTextKey = (index: number, field: IndustryTooltipField) =>
	`industry-${index}-${field}`;

let listRequestId = 0;
const QXB_BASE_URL = 'https://z-plugin.qixin.com/third-login?tenant=gd_gdyt1';
const viewMoreUrlMap: Record<TabIndex, string> = {
	0: 'recommend/company-recommend-real-time/meeting-dynamic',
	1: 'recommend/company-recommend-real-time/financing-dynamic-new',
	2: 'recommend/company-recommend-real-time/enterprise-layout',
};

const hotWords = ref<HotWord[]>([]);
const hotWordsLoading = ref(false);
/*
const topHotWordIndexes = computed(() =>
	hotWords.value
		.map((word, index) => ({ index, frequency: word.frequency }))
		.sort((prev, next) => next.frequency - prev.frequency)
		.slice(0, 3)
		.map((word) => word.index)
);
*/

const hotWordCloud = computed(() =>
	hotWords.value.map((word) => ({
		name: word.text,
		value: word.frequency,
	}))
);

const cloudOption: any = computed(() => chartCloudOption(hotWordCloud.value));
const router = useRouter();

const bindCloudClick = (chart: { off: Function; on: Function }) => {
	chart.off('click');
	chart.on('click', (params: { name?: string; data?: { name?: string } }) => {
		const word = params?.name || params?.data?.name || '';
		if (!word) return;
		router.push({
			name: 'intelligenceSearch',
			query: { keyword: word },
		});
	});
};

const openQxbPage = async (returnUrl: string) => {
	const res = await fetchQxbToken();
	if (!res.data) return;
	const targetUrl = `${QXB_BASE_URL}&token=${res.data}&returnUrl=${encodeURIComponent(returnUrl)}`;
	window.open(targetUrl, '_blank');
};

const handleViewMore = async () => {
	await openQxbPage(viewMoreUrlMap[activeTab.value]);
};

const getIndustryItemHref = (item: IndustryInfoItem) =>
	activeTab.value === 2 ? undefined : item.link || undefined;

const handleIndustryItemClick = (item: IndustryInfoItem, event: MouseEvent) => {
	if (activeTab.value !== 2) return;
	event.preventDefault();
	if (!item.policyDynamicId) return;
	openQxbPage(`https://z-plugin.qixin.com/recommend/policy-details?id=${item.policyDynamicId}`);
};

const normalizeHotWord = (item: HotWordApiItem): HotWord => ({
	text: item.word || '',
	frequency: Number(item.contentCount || 0),
});

const shuffleHotWords = (words: HotWord[]): HotWord[] => [...words].sort(() => Math.random() - 0.5);

function getApiList<T>(data: ApiListData<T> | null | undefined): T[] {
	if (Array.isArray(data)) return data;
	return data?.records || data?.rows || data?.list || [];
}

const loadHotWords = async () => {
	hotWordsLoading.value = true;
	try {
		const res = await gethotWord<HotWordApiItem[]>();
		const words =
			res.code === 0 && Array.isArray(res.data)
				? res.data.map(normalizeHotWord).filter((word) => word.text)
				: [];

		hotWords.value = shuffleHotWords(words);
	} catch {
		hotWords.value = [];
	} finally {
		hotWordsLoading.value = false;
	}
};

const formatIndustryChainNames = (value: unknown): string => {
	if (!value) return '';

	if (Array.isArray(value)) {
		return value.map(formatIndustryChainNames).filter(Boolean).join('、');
	}

	if (typeof value === 'object') {
		const industryChainInfo = value as IndustryChainInfo;
		return industryChainInfo.industryChainName || '';
	}

	if (typeof value === 'string') {
		try {
			return formatIndustryChainNames(JSON.parse(value) as unknown);
		} catch {
			const industryChainNames = Array.from(
				value.matchAll(/["']industryChainName["']\s*:\s*["']([^"']+)["']/g),
				(match) => match[1]
			).filter(Boolean);

			return industryChainNames.length > 0 ? industryChainNames.join('、') : value;
		}
	}

	return '';
};

const normalizeMeetingItem = (item: MeetingDynamicItem): IndustryInfoItem => ({
	id: item.id,
	title: item.exhibitionTitle || '',
	link: item.url || '',
	date: [item.beginDate, item.endDate].filter(Boolean).join('-'),
	region: `${item.province || ''}${item.city || ''}`,
	location: item.exhibitionLocation || '',
	industry: item.industry || '',
	organization: item.hostUnit || '',
	coOrganizer: item.undertake || '',
	website: item.web || '',
	round: '',
});

const normalizeFinancingItem = (item: FinancingDynamicItem): IndustryInfoItem => ({
	id: item.id,
	title: item.newsTitle || '',
	link: item.newsLink || '',
	date: item.date || '',
	region: `${item.provinceName || ''}${item.cityName || ''}`,
	location: '',
	industry: formatIndustryChainNames(item.industryChainInfoList),
	organization: item.enterpriseName || '',
	coOrganizer: '',
	website: '',
	round: item.round || '',
});

const normalizePolicyItem = (item: PolicyDynamicItem): IndustryInfoItem => ({
	id: item.id,
	title: item.title || '',
	link: item.url || '',
	date: item.publishTime || '',
	region: '',
	location: '',
	industry: '',
	organization: item.dept || '',
	coOrganizer: '',
	website: '',
	round: '',
	policyDynamicId: item.policyDynamicId,
});

const resetIndustryPageState = () => {
	industryHasNext.value = true;
	industryMinLoadedPage = 1;
	industryMaxLoadedPage = 0;
	industryLoadedPages = new Set<number>();
};

const getIndustryItemKey = (item: IndustryInfoItem) =>
	String(item.id || item.link || `${item.title}-${item.date}`);

const mergeIndustryInfoList = (
	list: IndustryInfoItem[],
	direction: IndustryLoadDirection,
	oldScrollHeight: number
) => {
	if (direction === 'init') {
		industryInfoList.value = list;
		nextTick(() => {
			if (industryListRef.value) industryListRef.value.scrollTop = 0;
		});
		return;
	}

	const existingKeys = new Set(industryInfoList.value.map(getIndustryItemKey));
	const newList = list.filter((item) => {
		const key = getIndustryItemKey(item);
		if (existingKeys.has(key)) return false;
		existingKeys.add(key);
		return true;
	});

	if (direction === 'up') {
		const oldScrollTop = industryListRef.value?.scrollTop || 0;
		industryInfoList.value = [...newList, ...industryInfoList.value];
		nextTick(() => {
			const listEl = industryListRef.value;
			if (listEl) {
				listEl.scrollTop = oldScrollTop + listEl.scrollHeight - oldScrollHeight;
			}
		});
		return;
	}

	industryInfoList.value = [...industryInfoList.value, ...newList];
};

const loadIndustryInfoList = async (
	tabIndex: TabIndex,
	pageNum = 1,
	direction: IndustryLoadDirection = 'init'
) => {
	if (direction !== 'init' && industryLoadedPages.has(pageNum)) return;

	listRequestId += 1;
	const requestId = listRequestId;

	loading.value = true;
	if (direction === 'init') {
		resetIndustryPageState();
		industryInfoList.value = [];
	}

	try {
		let nextList: IndustryInfoItem[] = [];
		const oldScrollHeight = industryListRef.value?.scrollHeight || 0;
		const params = {
			pageNum,
			pageSize: industryPageSize,
		};

		if (tabIndex === 0) {
			const res = await getMeetingDynamicList<ApiListData<MeetingDynamicItem>>(params);
			nextList = res.code === 0 ? getApiList(res.data).map(normalizeMeetingItem) : [];
		} else if (tabIndex === 1) {
			const res = await getFinancingDynamicList<ApiListData<FinancingDynamicItem>>(params);
			nextList = res.code === 0 ? getApiList(res.data).map(normalizeFinancingItem) : [];
		} else {
			const res = await getPolicyDynamicList<ApiListData<PolicyDynamicItem>>(params);
			nextList = res.code === 0 ? getApiList(res.data).map(normalizePolicyItem) : [];
		}

		if (requestId === listRequestId && activeTab.value === tabIndex) {
			if (direction === 'down' && nextList.length === 0) {
				industryHasNext.value = false;
				return;
			}

			industryLoadedPages.add(pageNum);
			industryMinLoadedPage = Math.min(industryMinLoadedPage, pageNum);
			industryMaxLoadedPage = Math.max(industryMaxLoadedPage, pageNum);
			if (direction !== 'up') {
				industryHasNext.value = nextList.length === industryPageSize;
			}
			mergeIndustryInfoList(nextList, direction, oldScrollHeight);
		}
	} catch {
		if (requestId === listRequestId) {
			if (pageNum === 1) {
				industryInfoList.value = [];
			} else {
				industryHasNext.value = false;
			}
		}
	} finally {
		if (requestId === listRequestId) {
			loading.value = false;
		}
	}
};

const handleTabClick = (tabIndex: string | number | boolean) => {
	const index = Number(tabIndex);
	const nextTabIndex: TabIndex = index === 2 ? 2 : 0;

	activeTab.value = nextTabIndex;
	loadIndustryInfoList(nextTabIndex);
};

const handleIndustryListScroll = (event: Event) => {
	if (industryScrollTimer) return;

	const listEl = event.target as HTMLElement;
	industryScrollTimer = setTimeout(() => {
		industryScrollTimer = null;

		if (loading.value) return;

		const isAtTop = listEl.scrollTop <= 0;
		const isAtBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 2;

		if (isAtTop && industryMinLoadedPage > 1) {
			loadIndustryInfoList(activeTab.value, industryMinLoadedPage - 1, 'up');
			return;
		}

		if (
			isAtBottom &&
			industryHasNext.value &&
			industryInfoList.value.length >= industryPageSize
		) {
			loadIndustryInfoList(activeTab.value, industryMaxLoadedPage + 1, 'down');
		}
	}, 200);
};

watch([industryInfoList, activeTab], refreshIndustryOverflowTooltip, { flush: 'post' });

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
	loadIndustryInfoList(activeTab.value);
	loadHotWords();
});
</script>

<style lang="less" scoped>
.industry-development {
	width: 100%;
	height: 100%;
	display: flex;
	gap: 0.25rem;
}

.industry-info-section {
	width: 8.5rem;
	min-width: 8.5rem;
	max-width: 8.5rem;
	flex: 0 0 8.5rem;
	height: 100%;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	width: 8.5rem;
	min-width: 8.5rem;
	max-width: 8.5rem;
	height: 0.6rem;
	margin-bottom: -1px;
	gap: 0.24rem;
	position: relative;
	z-index: 2;
	padding-right: 0rem;
}

.title-wrapper {
	position: relative;
	display: inline-block;
	display: flex;
	align-items: center;
	gap: 0.1rem;
	margin-bottom: 0.08rem;

	.title-bg {
		height: 0.45rem;
		width: auto;
	}
}

.view-more {
	font-size: 0.14rem;
	width: 0.86rem;
	color: #2f6bef;
	cursor: pointer;
	margin-top: 0.12rem;

	img {
		width: 0.86rem;
		height: auto;
		display: block;
		margin-left: 0.4rem;
	}

	&:hover {
		color: #267efb;
	}
}

.content-area {
	width: 8.5rem;
	min-width: 8.5rem;
	max-width: 8.5rem;
	min-height: 0;
	height: calc(100% - 0.6rem);
	box-sizing: border-box;
	background: #fff;
	border-radius: 0.03rem;
	overflow: hidden;
}

.exhibition-section {
	height: 100%;
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.tab-bar {
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	gap: 0;
	height: 0.45rem;
	margin-top: 0;
	margin-left: auto;
	flex-shrink: 0;
	background: transparent;
	overflow: visible;
}

.tab-item {
	position: relative;
	z-index: 1;
	width: 1.25rem;
	height: 0.36rem;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	font-size: 0.14rem;
	line-height: 0.2rem;
	color: #222b3a;
	background: transparent;
	cursor: pointer;
	transition: color 0.3s;
	border: 0;
	font-weight: 600;
	white-space: nowrap;
	isolation: isolate;

	:deep(.el-radio-button__inner) {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		color: inherit;
		font-size: inherit;
		font-weight: inherit;
		line-height: inherit;
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none !important;
	}

	:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
		color: inherit;
		background: transparent;
		border-color: transparent;
		box-shadow: none !important;
	}

	& + .tab-item {
		margin-left: -0.08rem;
	}

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: #f3f9ff;
		border-radius: 0;
	}

	&:first-child::before {
		border-top-left-radius: 0.08rem;
	}

	&:last-child::before {
		border-top-right-radius: 0.08rem;
	}

	&:hover {
		color: #2f6bef;
	}

	&.active {
		z-index: 2;
		height: 0.45rem;
		color: #2f6bef;
		font-weight: bold;

		&::before {
			background: url('@/assets/images/IntelligenceOverview/tabselectback.png') no-repeat
				center bottom / 100% 100%;
			border-radius: 0;
		}
	}
}

.exhibition-list {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
	overflow-y: auto;
	overflow-x: hidden;
	box-sizing: border-box;
	width: 8.5rem;
	min-width: 8.5rem;
	max-width: 8.5rem;
	height: 100%;
	padding-right: 0.06rem;
	padding-top: 0.02rem;
	scrollbar-width: thin;
	scrollbar-color: rgba(47, 107, 239, 0.3) transparent;

	&::-webkit-scrollbar {
		width: 0.04rem;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(47, 107, 239, 0.3);
		border-radius: 0.02rem;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}
}

.module-empty {
	flex: 1;
	min-height: 1.4rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #4e5969;
}

.module-empty-image {
	width: 1.8rem;
	height: auto;
	display: block;
}

.module-empty-text {
	margin-top: 0.12rem;
	font-size: 0.18rem;
	font-weight: 600;
	line-height: 0.24rem;
}

.industry-list-empty {
	min-height: 100%;
}

.exhibition-item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 0.52rem;
	padding: 0.04rem 0.11rem;
	background: #fff;
	border-radius: 0.06rem;
	border: 1px solid #789ffe;
	flex-shrink: 0;
	box-sizing: border-box;
	cursor: pointer;
	text-decoration: none;
}

.exhibition-title {
	display: flex;
	align-items: center;
	width: 100%;
	min-width: 0;
	gap: 0.08rem;
	font-size: 0.16rem;
	line-height: 0.22rem;
	font-weight: bold;
	margin-bottom: 0.04rem;
	color: #202741;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; /* 强制不换行 */

	.exhibition-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		img {
			width: 0.14rem;
			height: 0.18rem;
			display: block;
		}
	}
}

.exhibition-title-tooltip {
	flex: 1 1 0;
	min-width: 0;
	display: block;
}

.exhibition-title-text {
	display: block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.exhibition-date {
	margin-left: auto;
	flex-shrink: 0;
	color: rgba(0, 0, 0, 0.65);
	font-size: 0.14rem;
	font-weight: 600;
	white-space: nowrap;
}

.financing-round-tag {
	height: 0.22rem;
	padding: 0 0.08rem;
	border-color: transparent;
	font-size: 0.14rem;
	font-weight: 600;
	flex-shrink: 0;
}

.exhibition-info {
	font-size: 0.14rem;
	line-height: 0.2rem;
}

.info-grid {
	display: flex;
	align-items: center;
	gap: 0.28rem;
	min-width: 0;
}

.info-cell {
	display: flex;
	align-items: center;
	min-width: 0;
	white-space: nowrap;
}

.info-cell-wide {
	grid-column: auto;
}

.info-date-cell,
.info-location-cell,
.info-co-organizer-cell,
.info-website-cell {
	display: none;
}

.info-region-cell {
	flex: 0 0 1.9rem;
}

.info-industry-cell {
	flex: 0 0 2.25rem;
}

.info-organization-cell {
	flex: 1 1 0;
}

.financing-info-grid {
	display: flex;

	.info-cell-wide {
		grid-column: auto;
	}

	.industry-info-cell {
		align-items: center;
		white-space: normal;

		.info-value {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			word-break: normal;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}

.info-label {
	color: #9aa5b7;
	flex-shrink: 0;
	font-weight: 600;
}

.info-value {
	color: #4e5969;
	font-weight: 600;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.info-tooltip-text {
	display: block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.hot-words-section {
	flex: 1;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.cloud-box {
	width: 100%;
}

.hot-words-cloud {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-content: center;
	gap: 0.05rem 0.05rem;
	width: 100%;
	margin: 0 auto;
	height: calc(100% - 0.5rem);
	box-sizing: border-box;
	overflow: hidden;
}

.hot-word-empty {
	width: 100%;
	height: 100%;
	min-height: 100%;
}

.hot-word {
	position: relative;
	z-index: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 0.29rem;
	padding: 0 0.2rem;
	box-sizing: border-box;
	font-size: 0.13rem;
	line-height: 1;
	color: #2f7aff;
	font-weight: 600;
	background: none;
	text-align: center;
	text-shadow: 1px 1px 0 #fff;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		filter 0.2s ease;
	white-space: nowrap;
	isolation: isolate;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: var(--hot-word-bg) no-repeat center / 100% 100%;
		box-sizing: border-box;
	}

	&:hover {
		transform: translateY(-0.03rem) scale(1.16);
		filter: drop-shadow(0 0.04rem 0.08rem rgba(47, 122, 255, 0.35));
	}

	&.hot-word-left {
		--hot-word-bg: url('@/assets/images/IntelligenceOverview/ciyunleft.png');
	}

	&.hot-word-right {
		--hot-word-bg: url('@/assets/images/IntelligenceOverview/ciyunright.png');
	}

	&.hot-word-center {
		--hot-word-bg: url('@/assets/images/IntelligenceOverview/ciyun.png');
	}

	&.is-top {
		height: 0.46rem;
		padding: 0 0.3rem;
		font-size: 0.18rem;
		color: #fff;
		font-weight: bold;
		text-shadow: 0 1px 2px rgba(13, 85, 220, 0.35);

		&:hover {
			transform: translateY(-0.03rem) scale(1.12);
		}
	}
}
.sub-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.08rem;
	flex-shrink: 0;
	padding: 0.08rem 0.12rem;
	background: url('@/assets/images/IntelligenceOverview/link.png') no-repeat bottom 8px center /
		100% auto;
	border-radius: 0.06rem;
}

.sub-title {
	gap: 0.06rem;
	font-size: 0.14rem;
	color: #202741;
	font-weight: bold;

	.dot-text {
		font-weight: bold;
		font-size: 20px;
		color: #3a73de;
		line-height: 26px;
		text-shadow: 1px 1px 0px #ffffff;
		text-align: left;
		font-style: normal;
		margin-left: 0.12rem;
	}
}
</style>
