<!--
 * @Descripttion: 企业动态情报组件
 * @Author: opencode
 * @Date: 2026-06-12
-->
<template>
	<div class="enterprise-dynamics">
		<SectionTitle title="企业动态情报">
			<template #extra>
				<div v-if="activeSidebarTab === 1" class="view-more" @click="handleViewMore">
					<img src="@/assets/images/IntelligenceOverview/many.png" alt="" />
				</div>
			</template>
		</SectionTitle>
		<div class="content-area">
			<el-radio-group :model-value="activeSidebarTab" class="sidebar-tabs">
				<el-radio-button
					v-for="tab in sidebarTabs"
					:key="tab.value"
					:label="tab.value"
					class="sidebar-tab"
					:class="{ active: activeSidebarTab === tab.value }"
					@click="handleSidebarTabClick(tab.value)"
				>
					{{ tab.label }}
				</el-radio-button>
			</el-radio-group>
			<div v-if="activeSidebarTab === 0" class="visit-columns">
				<div class="visit-column">
					<div class="visit-column-header">
						<span class="visit-column-title">广东·广州</span>
					</div>
					<div v-loading="gdLoading" class="visit-list">
						<div
							v-if="!gdLoading && gdVisitList.length === 0"
							class="news-empty visit-empty"
						>
							<img
								src="@/assets/images/IntelligenceOverview/emty.webp"
								class="news-empty-image"
								alt=""
							/>
							<div class="news-empty-text">暂无数据</div>
						</div>
						<div
							v-for="(item, index) in gdVisitList"
							:key="item.id || `gd-${index}`"
							class="visit-item"
							@click="handleVisitClick(item)"
						>
							<div class="visit-item-top">
								<span class="visit-dot"></span>
								<span class="visit-title-wrap">
									<el-tooltip
										:show-after="500"
										:content="item.title || '--'"
										placement="top"
										:disabled="
											!item.title ||
											!isNewsOverflowTooltip(getVisitTextKey('gd', index))
										"
									>
										<span
											:ref="
												setNewsOverflowTooltipRef(
													getVisitTextKey('gd', index)
												)
											"
											class="visit-title"
										>
											{{ item.title || '--' }}
										</span>
									</el-tooltip>
								</span>
								<span class="visit-date">{{ item.date }}</span>
							</div>
							<div class="visit-source">
								来源：<span>{{ item.source || '-' }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="visit-column">
					<div class="visit-column-header">
						<span class="visit-column-title">其他城市</span>
					</div>
					<div v-loading="ngdLoading" class="visit-list">
						<div
							v-if="!ngdLoading && ngdVisitList.length === 0"
							class="news-empty visit-empty"
						>
							<img
								src="@/assets/images/IntelligenceOverview/emty.webp"
								class="news-empty-image"
								alt=""
							/>
							<div class="news-empty-text">暂无数据</div>
						</div>
						<div
							v-for="(item, index) in ngdVisitList"
							:key="item.id || `ngd-${index}`"
							class="visit-item"
							@click="handleVisitClick(item)"
						>
							<div class="visit-item-top">
								<span class="visit-dot"></span>
								<span class="visit-title-wrap">
									<el-tooltip
										:show-after="500"
										:content="item.title || '--'"
										placement="top"
										:disabled="
											!item.title ||
											!isNewsOverflowTooltip(getVisitTextKey('ngd', index))
										"
									>
										<span
											:ref="
												setNewsOverflowTooltipRef(
													getVisitTextKey('ngd', index)
												)
											"
											class="visit-title"
										>
											{{ item.title || '--' }}
										</span>
									</el-tooltip>
								</span>
								<span class="visit-date">{{ item.date }}</span>
							</div>
							<div class="visit-source">
								来源：<span>{{ item.source || '-' }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				v-else
				ref="newsListRef"
				v-loading="newsLoading"
				class="news-list"
				@scroll="handleNewsListScroll"
			>
				<div v-if="!newsLoading && newsList.length === 0" class="news-empty is-image-empty">
					<img
						src="@/assets/images/IntelligenceOverview/emty.webp"
						class="news-empty-image"
						alt=""
					/>
					<div class="news-empty-text">暂无数据</div>
				</div>
				<div
					v-for="(item, index) in newsList"
					:key="item.id || index"
					class="news-item"
					@click="handleNewsClick(item)"
				>
					<div class="news-top">
						<span
							v-if="item.tag && activeSidebarTab !== 4"
							class="news-tag"
							:class="item.tagType"
							>{{ item.tag }}</span
						>
						<span v-if="item.date" class="news-date">[{{ item.date }}]</span>
						<!-- 企况变动：时间后展示接口 name（固定宽占位，避免标题列不对齐） -->
						<span v-if="activeSidebarTab === 2" class="news-name">
							<el-tooltip
								v-if="item.name"
								:show-after="500"
								:content="item.name"
								placement="top"
							>
								{{ item.name }}
							</el-tooltip>
						</span>
						<span class="news-title-tooltip">
							<el-tooltip
								:show-after="500"
								:content="item.title || '--'"
								placement="top"
								:disabled="
									!item.title ||
									!isNewsOverflowTooltip(getNewsTextKey(index, 'title'))
								"
							>
								<span
									:ref="setNewsOverflowTooltipRef(getNewsTextKey(index, 'title'))"
									class="news-title"
								>
									{{ item.title || '--' }}
								</span>
							</el-tooltip>
						</span>
					</div>
					<!-- 企况变动不展示右侧企业名称 -->
					<div v-if="activeSidebarTab !== 2" class="news-bottom">
						<span class="news-company">
							<el-tooltip
								:show-after="500"
								:content="getNewsCompanyText(item)"
								placement="top"
								:disabled="
									!getNewsCompanyText(item) ||
									!isNewsOverflowTooltip(getNewsTextKey(index, 'company'))
								"
							>
								<span
									:ref="
										setNewsOverflowTooltipRef(getNewsTextKey(index, 'company'))
									"
									class="news-company-text"
								>
									{{
										getNewsCompanyText(item)
											? `(${getNewsCompanyText(item)})`
											: ''
									}}
								</span>
							</el-tooltip>
						</span>
						<span v-if="item.industry" class="news-industry">
							<span class="news-industry-label">所属产业：</span>
							<el-tooltip
								:show-after="500"
								:content="item.industry"
								placement="top"
								:disabled="
									!item.industry ||
									!isNewsOverflowTooltip(getNewsTextKey(index, 'industry'))
								"
							>
								<span
									:ref="
										setNewsOverflowTooltipRef(getNewsTextKey(index, 'industry'))
									"
									class="news-industry-text"
								>
									{{ item.industry }}
								</span>
							</el-tooltip>
						</span>
					</div>
					<div class="news-arrow">
						<img src="@/assets/images/IntelligenceOverview/more.png" alt="" />
					</div>
				</div>
			</div>
		</div>
		<DefaultDialog ref="detailDialogRef" :title="detailDialogTitle" width="12rem">
			<div v-if="selectedOpinionItem" class="opinion-detail-grid">
				<div class="opinion-detail-cell opinion-detail-label">变动内容</div>
				<div class="opinion-detail-cell opinion-detail-value opinion-detail-wide">
					{{ selectedOpinionItem.content || selectedOpinionItem.title || '--' }}
				</div>
				<div class="opinion-detail-cell opinion-detail-label">企业名称</div>
				<div class="opinion-detail-cell opinion-detail-value">
					{{ selectedOpinionItem.company || '--' }}
				</div>
				<div class="opinion-detail-cell opinion-detail-label">最新动态时间</div>
				<div class="opinion-detail-cell opinion-detail-value">
					{{ selectedOpinionItem.date || '--' }}
				</div>
				<div class="opinion-detail-cell opinion-detail-label">维度名称</div>
				<div class="opinion-detail-cell opinion-detail-value">
					{{ selectedOpinionItem.changeName || '--' }}
				</div>
				<div class="opinion-detail-cell opinion-detail-label">所属产业</div>
				<div class="opinion-detail-cell opinion-detail-value">
					{{ selectedOpinionItem.industry || '--' }}
				</div>
			</div>
			<div v-else class="empty-dialog-content">
				<img
					src="@/assets/images/IntelligenceOverview/emty.webp"
					class="empty-dialog-image"
					alt=""
				/>
				<div class="empty-dialog-text">暂无数据</div>
			</div>
		</DefaultDialog>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import {
	getFinancingDynamicList,
	getleadervisitGDList,
	getleadervisitList,
	getleadervisitNGDList,
	getqxmonitorList,
	getqxsentimentList,
	getsentimentdynamiclList,
} from '@/api/Intelligence/index';
import DefaultDialog from '@/components/DefaultDialog.vue';
import useOverflowTooltip from './useOverflowTooltip';

// 接收父组件传入的启信宝 token 获取方法
const props = defineProps<{
	getQxbToken: () => Promise<string>;
}>();

/** 企况变动 tab value */
const QX_MONITOR_TAB = 2;
const allSidebarTabs = [
	{ label: '高层动态', value: 0 },
	{ label: '企业资讯', value: 1 },
	{ label: '融资动态', value: 3 },
	{ label: '企业舆情', value: 4 },
	{ label: '企况变动', value: QX_MONITOR_TAB },
	{ label: '企业发言', value: 5 },
];
/** 企况变动接口有数据才展示该 tab */
const showQxMonitorTab = ref(false);
const sidebarTabs = computed(() =>
	allSidebarTabs.filter((tab) => tab.value !== QX_MONITOR_TAB || showQxMonitorTab.value)
);
// 增加路由参数默认值
const route = useRoute();
const activeSidebarTab = ref(Number(route.query.entTab) || 0);
const detailDialogRef = ref<InstanceType<typeof DefaultDialog>>();
// 启信宝相关页面地址常量
const QXB_BASE_URL = 'https://z-plugin.qixin.com/third-login?tenant=gd_gdyt1';
const QXB_RECOMMEND_DETAIL_URL = 'recommend/defaults';
const QXB_SENTIMENT_DYNAMIC_LIST_URL = 'recommend/company-recommend-real-time/sentiment-dynamic';

type NewsItem = {
	id?: number | string;
	oid?: string;
	tabValue?: number;
	tag?: string;
	tagType: 'neutral' | 'positive' | 'negative';
	title: string;
	content?: string;
	date: string;
	/** 接口 name 字段（企况变动时间后展示） */
	name?: string;
	company: string;
	industry: string;
	changeName?: string;
	url?: string;
};

type SentimentDynamicApiItem = {
	id?: number | string;
	oid?: string;
	sentiment?: string;
	source?: string;
	name?: string;
	pubTime?: string;
	title?: string;
	changeContent?: string;
	changeDate?: string;
	changeName?: string;
	monitorName?: string;
	changeType?: string;
	typeName?: string;
	categoryName?: string;
	content?: string;
	summary?: string;
	digest?: string;
	articleContent?: string;
	description?: string;
	newsContent?: string;
	url?: string;
	link?: string;
	linkUrl?: string;
	newsUrl?: string;
	newsLink?: string;
	articleUrl?: string;
	sourceUrl?: string;
	href?: string;
	URL?: string;
	Link?: string;
	aiCategory?: string;
	industry?: string;
	industryName?: string;
	date?: string;
	enterpriseName?: string;
	companyName?: string;
	entName?: string;
	publishDate?: string;
};

type LeaderVisitApiItem = {
	id?: number | string;
	title?: string;
	authorName?: string;
	link?: string;
	createdAt?: string;
};

type VisitItem = {
	id?: number | string;
	title: string;
	date: string;
	source: string;
	url?: string;
};

type FinancingDynamicApiItem = {
	id?: number | string;
	newsTitle?: string;
	newsLink?: string;
	round?: string;
	date?: string;
	eid?: string;
	enterpriseName?: string;
	logo?: string;
	cityName?: string;
	provinceName?: string;
	industryChainInfoList?: unknown;
	flag?: string | number | null;
	categoryName?: string;
};

type ApiListData<T> =
	| T[]
	| {
			records?: T[];
			rows?: T[];
			list?: T[];
	  };

const gdVisitAllList = ref<VisitItem[]>([]);
const ngdVisitAllList = ref<VisitItem[]>([]);
const gdVisitList = computed(() => gdVisitAllList.value.slice(0, 30));
const ngdVisitList = computed(() => ngdVisitAllList.value.slice(0, 30));
const gdLoading = ref(false);
const ngdLoading = ref(false);
let visitRequestId = 0;

const newsList = ref<NewsItem[]>([]);
const selectedOpinionItem = ref<NewsItem | null>(null);
const newsLoading = ref(false);
const newsListRef = ref<HTMLElement | null>(null);
const pageSize = 15;
const pageHasNext = ref(true);
// 请求自增 id，用于过滤过期请求结果
let newsRequestId = 0;
// 已加载的页码范围，用于向上/向下无限滚动加载
let minLoadedPage = 1;
let maxLoadedPage = 0;
let loadedPages = new Set<number>();
let newsScrollTimer: ReturnType<typeof setTimeout> | null = null;
type NewsLoadDirection = 'init' | 'down' | 'up';
type NewsTooltipField = 'title' | 'company' | 'industry';

const {
	isOverflowTooltip: isNewsOverflowTooltip,
	refreshOverflowTooltip: refreshNewsOverflowTooltip,
	setOverflowTooltipRef: setNewsOverflowTooltipRef,
} = useOverflowTooltip();

const getNewsTextKey = (index: number, field: NewsTooltipField) => `news-${index}-${field}`;
const getVisitTextKey = (side: 'gd' | 'ngd', index: number) => `visit-${side}-${index}`;

function getApiList<T>(data: ApiListData<T> | null | undefined): T[] {
	if (Array.isArray(data)) return data;
	return data?.records || data?.rows || data?.list || [];
}

const getNewsCompanyText = (item: NewsItem): string =>
	activeSidebarTab.value === 0 ? `来源：${item.company || '-'}` : item.company || '';

// 根据舆情情感文本判断正/负/中性标签样式
const getSentimentTagType = (
	sentiment: string | number | null | undefined = ''
): NewsItem['tagType'] => {
	const text = String(sentiment || '');

	if (/积极|正面|利好|positive/i.test(text)) return 'positive';
	if (/消极|负面|利空|negative/i.test(text)) return 'negative';
	return 'neutral';
};

const normalizeTagText = (value: string | number | null | undefined): string => {
	const text = String(value ?? '').trim();
	return text && text !== '0' ? text : '';
};

// 企业资讯 / 企业舆情 / 企况变动：将启信宝舆情接口数据归一化为列表项
const normalizeSentimentNews = (item: SentimentDynamicApiItem): NewsItem => ({
	id: item.id,
	oid: item.oid || '',
	tagType: getSentimentTagType(item.sentiment),
	title: item.changeContent || item.title || '',
	content:
		item.changeContent ||
		item.content ||
		item.summary ||
		item.digest ||
		item.articleContent ||
		item.description ||
		item.newsContent ||
		'',
	date: item.changeDate || item.publishDate || item.pubTime || item.date || '',
	name: item.name || '',
	company:
		item.name || item.enterpriseName || item.companyName || item.entName || item.source || '',
	industry: item.aiCategory || item.industry || item.industryName || '',
	changeName:
		item.changeName ||
		item.monitorName ||
		item.changeType ||
		item.typeName ||
		item.categoryName ||
		'',
	url: item.url || item.link || '',
});

const resetPageState = () => {
	pageHasNext.value = true;
	minLoadedPage = 1;
	maxLoadedPage = 0;
	loadedPages = new Set<number>();
};

const getNewsItemKey = (item: NewsItem) =>
	String(item.id || item.url || `${item.title}-${item.date}`);

// 按 direction 合并新数据到列表：init 重置、up 向上插并保持滚动位置、down 向下追加
const mergeNewsList = (list: NewsItem[], direction: NewsLoadDirection, oldScrollHeight: number) => {
	if (direction === 'init') {
		newsList.value = list;
		nextTick(() => {
			if (newsListRef.value) newsListRef.value.scrollTop = 0;
		});
		return;
	}

	const existingKeys = new Set(newsList.value.map(getNewsItemKey));
	const newList = list.filter((item) => {
		const key = getNewsItemKey(item);
		if (existingKeys.has(key)) return false;
		existingKeys.add(key);
		return true;
	});

	if (direction === 'up') {
		const oldScrollTop = newsListRef.value?.scrollTop || 0;
		newsList.value = [...newList, ...newsList.value];
		nextTick(() => {
			const listEl = newsListRef.value;
			if (listEl) {
				listEl.scrollTop = oldScrollTop + listEl.scrollHeight - oldScrollHeight;
			}
		});
		return;
	}

	newsList.value = [...newsList.value, ...newList];
};

const normalizeLeaderVisitNews = (item: LeaderVisitApiItem): NewsItem => ({
	id: item.link || `${item.title || ''}-${item.createdAt || ''}`,
	tag: '',
	tagType: 'neutral',
	title: item.title || '',
	date: item.createdAt || '',
	company: item.authorName || '',
	industry: '',
	url: item.link || '',
});

const normalizeVisitItem = (item: LeaderVisitApiItem): VisitItem => ({
	id: item.id || item.link || `${item.title || ''}-${item.createdAt || ''}`,
	title: item.title || '',
	date: String(item.createdAt || '').slice(0, 10),
	source: item.authorName || '',
	url: item.link || '',
});

const buildVisitList = (res: { code?: unknown; data?: ApiListData<LeaderVisitApiItem> }) =>
	res.code === 0 ? getApiList(res.data).map(normalizeVisitItem) : [];

const formatTextList = (value: unknown): string => {
	if (!value) return '';

	if (Array.isArray(value)) {
		return value
			.map((item) => {
				if (typeof item === 'string') return formatTextList(item);
				if (item && typeof item === 'object') {
					const record = item as Record<string, unknown>;
					return String(
						record.industryChainName ||
							record.name ||
							record.label ||
							record.value ||
							''
					);
				}
				return '';
			})
			.filter(Boolean)
			.join('、');
	}

	if (value && typeof value === 'object') {
		const record = value as Record<string, unknown>;
		return String(record.industryChainName || '');
	}

	if (typeof value !== 'string') return '';

	const text = value.trim();
	if (!text) return '';

	try {
		const parsed = JSON.parse(text.replace(/'/g, '"'));
		return formatTextList(parsed);
	} catch {
		try {
			const parsed = JSON.parse(`[${text.replace(/'/g, '"')}]`);
			return formatTextList(parsed);
		} catch {
			const names = Array.from(
				text.matchAll(/['"]?industryChainName['"]?\s*:\s*['"]([^'"]+)['"]/g)
			)
				.map((match) => match[1])
				.filter(Boolean);

			return names.length ? names.join('、') : text;
		}
	}
};

// 融资动态：将融资动态接口数据归一化为列表项
const normalizeFinancingDynamicNews = (item: FinancingDynamicApiItem): NewsItem => ({
	id: item.id,
	tag: normalizeTagText(item.flag),
	tagType: getSentimentTagType(item.flag),
	title: item.newsTitle || '',
	date: item.date || '',
	company: item.enterpriseName || '',
	industry: formatTextList(item.industryChainInfoList),
	url: item.newsLink || '',
});

// 当前请求是否仍有效（未过期且未切换 tab）
const isCurrentRequest = (requestId: number, tabValue: number) =>
	requestId === newsRequestId && activeSidebarTab.value === tabValue;

// 按 tab 与页码请求分页数据并归一化（含高层动态，与融资动态同一套分页）
const getPagedNews = async (tabValue: number, pageNum: number): Promise<NewsItem[]> => {
	const params = { pageNum, pageSize };

	switch (tabValue) {
		case 1: {
			const res =
				await getsentimentdynamiclList<ApiListData<SentimentDynamicApiItem>>(params);
			return res.code === 0
				? getApiList(res.data).map((item) => ({
						...normalizeSentimentNews(item),
						tabValue,
					}))
				: [];
		}
		case 2: {
			const res = await getqxmonitorList<ApiListData<SentimentDynamicApiItem>>(params);
			return res.code === 0
				? getApiList(res.data).map((item) => ({
						...normalizeSentimentNews(item),
						tabValue,
					}))
				: [];
		}
		case 3: {
			const res = await getFinancingDynamicList<ApiListData<FinancingDynamicApiItem>>(params);
			return res.code === 0
				? getApiList(res.data).map((item) => ({
						...normalizeFinancingDynamicNews(item),
						tabValue,
					}))
				: [];
		}
		case 4: {
			const res = await getqxsentimentList<ApiListData<SentimentDynamicApiItem>>(params);
			return res.code === 0
				? getApiList(res.data).map((item) => ({
						...normalizeSentimentNews(item),
						tabValue,
					}))
				: [];
		}
		case 5: {
			const case5Params = {
				...params,
				entity: { articleType: 2 },
			};
			const res = await getleadervisitList<ApiListData<LeaderVisitApiItem>>(case5Params);
			return res.code === 0
				? getApiList(res.data).map((item) => ({
						...normalizeLeaderVisitNews(item),
						tabValue,
					}))
				: [];
		}
		default:
			return [];
	}
};

// 分页加载列表：处理 init/down/up 三种加载方向与请求竞态
const loadPagedNews = async (pageNum = 1, direction: NewsLoadDirection = 'init') => {
	if (direction !== 'init' && loadedPages.has(pageNum)) return;

	newsRequestId += 1;
	const requestId = newsRequestId;
	const tabValue = activeSidebarTab.value;
	newsLoading.value = true;
	if (direction === 'init') {
		resetPageState();
		newsList.value = [];
	}

	try {
		const oldScrollHeight = newsListRef.value?.scrollHeight || 0;
		const list = await getPagedNews(tabValue, pageNum);

		if (!isCurrentRequest(requestId, tabValue)) return;

		if (direction === 'down' && list.length === 0) {
			pageHasNext.value = false;
			return;
		}

		loadedPages.add(pageNum);
		minLoadedPage = Math.min(minLoadedPage, pageNum);
		maxLoadedPage = Math.max(maxLoadedPage, pageNum);
		if (direction !== 'up') pageHasNext.value = list.length === pageSize;
		mergeNewsList(list, direction, oldScrollHeight);
	} catch {
		if (isCurrentRequest(requestId, tabValue)) {
			if (pageNum === 1) newsList.value = [];
			else pageHasNext.value = false;
		}
	} finally {
		if (isCurrentRequest(requestId, tabValue)) newsLoading.value = false;
	}
};

// 根据当前 tab 分发到对应加载方法（高层动态与融资动态等统一分页）
const loadVisitColumns = async () => {
	visitRequestId += 1;
	const requestId = visitRequestId;
	gdLoading.value = true;
	ngdLoading.value = true;
	gdVisitAllList.value = [];
	ngdVisitAllList.value = [];

	const loadGd = async () => {
		try {
			const res = await getleadervisitGDList<ApiListData<LeaderVisitApiItem>>();
			if (requestId !== visitRequestId || activeSidebarTab.value !== 0) return;
			gdVisitAllList.value = buildVisitList(res);
		} catch {
			if (requestId === visitRequestId) gdVisitAllList.value = [];
		} finally {
			if (requestId === visitRequestId) gdLoading.value = false;
		}
	};

	const loadNgd = async () => {
		try {
			const res = await getleadervisitNGDList<ApiListData<LeaderVisitApiItem>>();
			if (requestId !== visitRequestId || activeSidebarTab.value !== 0) return;
			ngdVisitAllList.value = buildVisitList(res);
		} catch {
			if (requestId === visitRequestId) ngdVisitAllList.value = [];
		} finally {
			if (requestId === visitRequestId) ngdLoading.value = false;
		}
	};

	await Promise.all([loadGd(), loadNgd()]);
};

const loadCurrentTab = (pageNum = 1, direction: NewsLoadDirection = 'init') => {
	switch (activeSidebarTab.value) {
		case 0:
			return loadVisitColumns();
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			return loadPagedNews(pageNum, direction);

		default:
			return undefined;
	}
};

const detailDialogTitle = ref('');

const showAbnormalDialog = (item: NewsItem) => {
	selectedOpinionItem.value = item;
	detailDialogTitle.value = '企况变动';
	detailDialogRef.value?.show();
};

// 切换 tab 时重置列表与分页、请求状态
const resetNewsState = () => {
	newsRequestId += 1;
	visitRequestId += 1;
	resetPageState();
	selectedOpinionItem.value = null;
	newsLoading.value = false;
	newsList.value = [];
	gdVisitAllList.value = [];
	ngdVisitAllList.value = [];
	gdLoading.value = false;
	ngdLoading.value = false;
};

// 点击侧边 tab：校验后切换并重新加载
const handleSidebarTabClick = (tabValue: number) => {
	if (!sidebarTabs.value.some((tab) => tab.value === tabValue)) return;

	activeSidebarTab.value = tabValue;
	resetNewsState();
	loadCurrentTab();
};

// 列表滚动：到顶向上加载、到底向下加载（节流；加载中不重复请求）
const handleNewsListScroll = (event: Event) => {
	if (newsScrollTimer || newsLoading.value) return;

	const listEl = event.target as HTMLElement;
	newsScrollTimer = setTimeout(() => {
		newsScrollTimer = null;

		if (newsLoading.value) return;

		const isAtTop = listEl.scrollTop <= 0;
		const isAtBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 2;

		if (isAtTop && minLoadedPage > 1) {
			loadCurrentTab(minLoadedPage - 1, 'up');
			return;
		}

		if (isAtBottom && pageHasNext.value && newsList.value.length >= pageSize) {
			loadCurrentTab(maxLoadedPage + 1, 'down');
		}
	}, 200);
};

// 获取启信宝 token 后在新标签页打开指定 returnUrl 页面
const openQxbPage = async (returnUrl: string) => {
	const token = await props.getQxbToken();
	if (!token) return;
	const targetUrl = `${QXB_BASE_URL}&token=${token}&returnUrl=${encodeURIComponent(returnUrl)}`;
	window.open(targetUrl, '_blank');
};

const handleViewMore = () => {
	if (activeSidebarTab.value !== 1) return;
	openQxbPage(QXB_SENTIMENT_DYNAMIC_LIST_URL);
};

// 点击列表项：企业资讯跳启信宝详情页，异动打开详情，其余有链接则新开页
const handleVisitClick = (item: VisitItem) => {
	if (!item.url) return;
	window.open(item.url, '_blank', 'noopener,noreferrer');
};

const handleNewsClick = (item: NewsItem) => {
	const tabValue = item.tabValue ?? activeSidebarTab.value;

	if (tabValue === 1) {
		if (!item.oid) return;

		openQxbPage(`${QXB_RECOMMEND_DETAIL_URL}?oid=${item.oid}`);
		return;
	}
	if (tabValue === 2) {
		showAbnormalDialog(item);
		return;
	}
	if (!item.url) return;
	window.open(item.url, '_blank', 'noopener,noreferrer');
};

watch([newsList, gdVisitList, ngdVisitList, activeSidebarTab], refreshNewsOverflowTooltip, {
	flush: 'post',
});

/** 探测企况变动是否有数据：有则显示 tab，无则隐藏 */
const checkQxMonitorTabVisible = async () => {
	try {
		const res = await getqxmonitorList<ApiListData<SentimentDynamicApiItem>>({
			pageNum: 1,
			pageSize: 1,
		});
		showQxMonitorTab.value = res.code === 0 && getApiList(res.data).length > 0;
	} catch {
		showQxMonitorTab.value = false;
	}
	// 当前已在企况变动但无数据时，切回高层动态
	if (!showQxMonitorTab.value && activeSidebarTab.value === QX_MONITOR_TAB) {
		activeSidebarTab.value = 0;
		resetNewsState();
		loadCurrentTab();
	}
};

onMounted(() => {
	checkQxMonitorTabVisible();
	loadCurrentTab();
});
</script>

<style lang="less" scoped>
.enterprise-dynamics {
	width: 100%;
	height: 100%;
	min-width: 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.view-more {
	font-size: 0.14rem;
	color: #2f6bef;
	cursor: pointer;
	margin-right: 0.12rem;

	img {
		height: 0.24rem;
	}

	&:hover {
		color: #267efb;
	}
}

.content-area {
	display: flex;
	flex: 1;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
	gap: 0.12rem;
}

.visit-columns {
	flex: 1 1 0;
	width: 0;
	min-width: 0;
	min-height: 0;
	display: flex;
	gap: 0.12rem;
	overflow: hidden;
}

.visit-column {
	flex: 1 1 0;
	width: 0;
	min-width: 0;
	min-height: 0;
	display: flex;
	flex-direction: column;
	gap: 0.02rem;
	overflow: hidden;
}

.visit-column-header {
	flex-shrink: 0;
	position: relative;
	height: 0.42rem;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: url('@/assets/images/IntelligenceOverview/selectback.png') no-repeat center / 100%
		100%;

	&::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		z-index: 0;
		width: 2.6rem;
		height: 100%;
		transform: translateX(-50%);
		background: url('@/assets/images/IntelligenceOverview/tabselectback2.png') no-repeat
			center / 100% 100%;
		pointer-events: none;
	}
}

.visit-column-title {
	position: relative;
	z-index: 1;
	font-size: 0.16rem;
	font-weight: 600;
	color: #2f6bef;
	line-height: 0.24rem;
}

.visit-list {
	flex: 1 1 0;
	width: 100%;
	min-width: 0;
	max-width: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 0.04rem 0.16rem 0.1rem;
	box-sizing: border-box;
	background: linear-gradient(180deg, #e3f0ff 0%, #ffffff 100%);
	border-radius: 0.12rem;
	border: 1px solid #dcdfe6;
	opacity: 0.8;
}

.visit-empty {
	flex: 1;
	min-height: 0;
	flex-direction: column;

	.news-empty-image {
		width: 1.6rem;
	}

	.news-empty-text {
		margin-top: 0.1rem;
		font-size: 0.16rem;
		line-height: 0.22rem;
	}
}

.visit-item {
	flex-shrink: 0;
	min-width: 0;
	overflow: hidden;
	padding: 0.08rem 0.02rem 0.08rem;
	border-bottom: 1px solid #789ffe;
	cursor: pointer;
	.visit-title {
		color: #333333;
		font-size: 0.16rem;
		font-weight: 600;
	}
	.visit-date {
		color: #000000;
	}
	&:last-child {
		border-bottom: none;
	}

	&:hover {
		.visit-title,
		.visit-date {
			color: #165dff;
		}
	}
}

.visit-item-top {
	display: flex;
	align-items: center;
	gap: 0.08rem;
	min-width: 0;
	overflow: hidden;
}

.visit-dot {
	flex-shrink: 0;
	width: 0.06rem;
	height: 0.06rem;
	border-radius: 50%;
	background: #2f6bef;
}

.visit-title-wrap {
	flex: 1 1 0;
	min-width: 0;
	overflow: hidden;

	:deep(.el-tooltip__trigger) {
		display: block !important;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}
}

.visit-title {
	display: block;
	width: 100%;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 0.14rem;
	font-weight: 600;
	color: #202741;
	line-height: 0.22rem;
}

.visit-date {
	flex: 0 0 auto;
	white-space: nowrap;
	font-size: 0.13rem;
	color: #4e5969;
	line-height: 0.22rem;
}

.visit-source {
	margin-left: 0.14rem;
	font-family:
		PingFangSC,
		PingFang SC;
	margin-top: 0.02rem;
	font-size: 0.12rem;
	color: #8897b7;
	line-height: 0.18rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	span {
		color: #000000;
		font-family:
			PingFangSC,
			PingFang SC;
	}
}

.sidebar-tabs {
	display: flex;
	flex-direction: column;
	justify-content: start;
	gap: 0.06rem;
	padding: 0.1rem;
	width: 1.6rem;
	flex-shrink: 0;
	position: relative;
	background: url('@/assets/images/IntelligenceOverview/back.png') no-repeat center / cover;
	border-radius: 0.1rem;
}

.sidebar-tab {
	position: relative;
	margin-bottom: 0.05rem;
	width: 100%;

	:deep(.el-radio-button__inner) {
		width: 100%;
		padding: 0.08rem 0.12rem;
		font-size: 0.15rem;
		font-weight: bold;
		color: #4e5969;
		background: #fff;
		border: 1px solid #e0e8ff;
		border-radius: 0.04rem;
		box-shadow: none;
		text-align: left;
		transition: all 0.3s;
	}

	&:hover :deep(.el-radio-button__inner) {
		color: #2f6bef;
		border-color: #2f6bef;
	}

	&.active :deep(.el-radio-button__inner) {
		color: #fff;
		background: linear-gradient(135deg, #4f98ff, #2f6bef);
		border-color: #2f6bef;
		box-shadow: none;
	}

	&.active::after {
		content: '';
		position: absolute;
		right: -0.08rem;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-top: 0.08rem solid transparent;
		border-bottom: 0.08rem solid transparent;
		border-left: 0.08rem solid #2f6bef;
	}
}

.news-list {
	flex: 1;
	width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 0.05rem;
	min-width: 0;
}

.news-empty {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 1.2rem;
	color: #8897b7;
	font-size: 0.16rem;

	&.is-image-empty {
		flex-direction: column;
		min-height: 3.2rem;
	}
}

.news-empty-image {
	width: 2.52rem;
	height: auto;
	display: block;
}

.news-empty-text {
	margin-top: 0.22rem;
	font-size: 0.24rem;
	font-weight: 600;
	line-height: 0.32rem;
	color: #4e5969;
}

.news-item {
	display: flex;
	align-items: center;
	// gap: 0.12rem;
	padding: 0.04rem 0.46rem 0.04rem 0.08rem;
	cursor: pointer;
	// transition: all 0.3s;
	height: 0.42rem;
	flex: 0 0 0.42rem;
	min-height: 0;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	background: linear-gradient(90deg, #e3f0ff 0%, #ffffff 100%);
	box-shadow:
		1px 1px 1px 1px rgba(133, 167, 253, 0.65),
		0px 2px 6px 0px rgba(220, 223, 230, 0.58);
	border-radius: 0.06rem;
	border: 1px solid #dcdfe6;
	&:hover {
		border-color: #2f6bef;
		box-shadow: 0 0.02rem 0.06rem rgba(47, 107, 239, 0.1);
		.news-date,
		.news-name,
		.news-title {
			color: #165dff;
		}
	}
}

.news-top {
	display: flex;
	align-items: center;
	/* 占满日期与右侧来源之间的剩余宽度 */
	flex: 1 1 0;
	gap: 0.08rem;
	margin-bottom: 0;
	font-size: 0.14rem;
	min-width: 0;
	overflow: hidden;
}

/* 企况变动：时间后的 name，固定上限，过长省略 */
.news-name {
	flex: 0 1 1.8rem;
	max-width: 1.8rem;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 600;
	font-size: 0.16rem;
	color: #202741;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.news-tag {
	padding: 0.01rem 0.1rem;
	border-radius: 0.1rem;
	font-size: 0.14rem;
	line-height: 0.18rem;
	flex-shrink: 0;
	border: 1px solid;

	&.neutral {
		color: #ffb10d;
		border-color: #ffb10d;
		background: rgba(255, 177, 13, 0.15);
	}

	&.positive {
		color: #266fe8;
		border-color: #266fe8;
		background: rgba(38, 111, 232, 0.15);
	}

	&.negative {
		color: #df5953;
		border-color: #df5953;
		background: rgba(223, 89, 83, 0.15);
	}
}

/* 标题区域动态铺满剩余空间 */
.news-title-tooltip {
	flex: 1 1 0;
	min-width: 0;
	display: block;
	overflow: hidden;

	/* el-tooltip 触发节点也要铺满，否则宽度只跟文字走 */
	:deep(.el-tooltip__trigger) {
		display: block !important;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}
}

.news-title {
	display: block;
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 600;
	font-size: 0.16rem;
	color: #202741;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.news-arrow {
	position: absolute;
	right: 0.12rem;
	top: 50%;
	transform: translateY(-50%);
	flex-shrink: 0;
	display: flex;
	align-items: center;
}

.news-bottom {
	display: flex;
	/* 企业名 + 所属产业：固定列宽左对齐，上下行对齐 */
	flex: 0 0 auto;
	gap: 0.16rem;
	align-items: center;
	justify-content: flex-start;
	font-size: 0.14rem;
	color: rgba(0, 0, 0, 0.65);
	min-width: 0;
	overflow: hidden;
	margin-left: 0.08rem;
	margin-right: 0.28rem;
}

.news-date {
	flex: 0 0 auto;
	white-space: nowrap;
	color: #202741;
	font-weight: 600;
	font-size: 0.16rem;
}

.news-company {
	flex: 0 0 2.1rem;
	width: 2.1rem;
	min-width: 0;
	overflow: hidden;
	white-space: nowrap;
	text-align: left;
}

.news-company-text {
	display: block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: left;
}

.news-industry {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex: 0 0 2rem;
	width: 2rem;
	min-width: 0;
	overflow: hidden;
	white-space: nowrap;
	text-align: left;
}

.news-industry-label {
	flex-shrink: 0;
}

.news-industry-text {
	display: block;
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: left;
}

:deep(.tips-dialog .text) {
	color: #2f7aff;
	font-size: 0.28rem;
	font-weight: bold;
}

:deep(.tips-dialog .el-dialog__body) {
	background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
}

.opinion-detail-grid {
	display: grid;
	grid-template-columns: 1.55rem minmax(0, 1fr) 1.55rem minmax(0, 1fr);
	width: 100%;
	box-sizing: border-box;
	border-top: 1px solid #dcdfe6;
	border-left: 1px solid #dcdfe6;
	background: #fff;
}

.opinion-detail-cell {
	min-height: 1.18rem;
	padding: 0.16rem;
	box-sizing: border-box;
	border-right: 1px solid #dcdfe6;
	border-bottom: 1px solid #dcdfe6;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 0;
	font-size: 0.16rem;
	line-height: 0.24rem;
	color: #303133;
	text-align: center;
	word-break: break-word;
}

.opinion-detail-label {
	background: #f5f7fa;
	font-weight: 600;
	white-space: nowrap;
}

.opinion-detail-value {
	background: #fff;
}

.opinion-detail-wide {
	grid-column: span 3;
}

.opinion-detail-link {
	display: inline-block;
	max-width: 100%;
	color: #2f6bef;
	text-decoration: none;
	word-break: break-all;

	&:hover {
		color: #165dff;
		text-decoration: underline;
	}
}

.empty-dialog-content {
	width: 100%;
	min-height: 3.86rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	// background: #eef8ff;
	border-radius: 0.08rem;
}

.empty-dialog-image {
	width: 2.52rem;
	height: auto;
	display: block;
}

.empty-dialog-text {
	margin-top: 0.22rem;
	font-size: 0.24rem;
	font-weight: 600;
	line-height: 0.32rem;
	color: #4e5969;
}
</style>
