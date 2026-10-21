import { computed, onMounted, reactive, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { aggregateSearchApi, categListApi } from '@/api/Intelligence/index';

export const PAGE_SIZE = 10;
export const COLLAPSED_COUNT = 2;

export type SectionKey =
	| 'leader'
	| 'news'
	| 'financing'
	| 'sentiment'
	| 'speech'
	| 'meeting'
	| 'policy';

export type CategoryCode =
	| 'LEADER_DYNAMIC'
	| 'ENTERPRISE_NEWS'
	| 'FINANCING_DYNAMIC'
	| 'ENTERPRISE_SENTIMENT'
	| 'ENTERPRISE_SPEECH'
	| 'MEETING_DYNAMIC'
	| 'POLICY_DYNAMIC';

export type DateRangeValue = [string, string] | null;

export type ResultMeta = {
	label: string;
	value: string;
	valueHtml: string;
	className: string;
};

export type ResultItem = {
	id: string;
	title: string;
	titleHtml: string;
	url: string;
	metas: ResultMeta[];
	policyDynamicId?: string | number;
	companyName?: string;
	companyNameHtml?: string;
};

export type ResultSection = {
	key: SectionKey;
	title: string;
	loading: boolean;
	pageNum: number;
	pageSize: number;
	total: number;
	list: ResultItem[];
	expanded: boolean;
	fetchSeq: number;
};

export type QxbTokenData =
	| string
	| {
			token?: string;
			qxbToken?: string;
			accessToken?: string;
			access_token?: string;
	  };

type ApiListData<T> =
	| T[]
	| {
			records?: T[];
			rows?: T[];
			list?: T[];
			total?: number;
			totalCount?: number;
			count?: number;
	  };

type ApiResponse<T> = {
	code: number;
	data: T;
};

type LeaderVisitRecord = {
	id?: string | number;
	link?: string;
	url?: string;
	title?: string;
	createdAt?: string;
	date?: string;
	authorName?: string;
	source?: string;
};

type NewsRecord = {
	id?: string | number;
	oid?: string;
	title?: string;
	changeContent?: string;
	url?: string;
	link?: string;
	pubTime?: string;
	publishDate?: string;
	date?: string;
	aiCategory?: string;
	industry?: string;
	source?: string;
	name?: string;
	enterpriseName?: string;
	companyName?: string;
	entName?: string;
};

type FinancingRecord = {
	id?: string | number;
	newsTitle?: string;
	newsLink?: string;
	date?: string;
	enterpriseName?: string;
	industry?: string;
	aiCategory?: string;
	industryChainInfoList?: unknown;
};

type MeetingRecord = {
	id?: string | number;
	exhibitionTitle?: string;
	url?: string;
	web?: string;
	beginDate?: string;
	endDate?: string;
	province?: string;
	city?: string;
	industry?: string;
	hostUnit?: string;
};

type PolicyRecord = {
	id?: string | number;
	policyDynamicId?: string | number;
	title?: string;
	url?: string;
	link?: string;
	publishTime?: string;
	dept?: string;
};

/* eslint-disable-next-line no-unused-vars */
type Highlighter = (text: string) => string;

const META_CLASS_MAP: Record<string, string> = {
	发布时间: 'is-pub-time',
	展会时间: 'is-meet-time',
	来源: 'is-source',
	企业: 'is-company',
	所属产业: 'is-industry',
	主办单位: 'is-org',
	所在地区: 'is-region',
	所属地区: 'is-region',
	所属行业: 'is-trade',
};

const SECTION_PRESETS: ReadonlyArray<Pick<ResultSection, 'key' | 'title'>> = [
	{ key: 'leader', title: '高层动态' },
	{ key: 'news', title: '企业资讯' },
	{ key: 'financing', title: '融资动态' },
	{ key: 'sentiment', title: '企业舆情' },
	{ key: 'speech', title: '企业发言' },
	{ key: 'meeting', title: '展会动态' },
	{ key: 'policy', title: '政策动态' },
];

const SECTION_CATEGORY_CODE: Record<SectionKey, CategoryCode> = {
	leader: 'LEADER_DYNAMIC',
	news: 'ENTERPRISE_NEWS',
	financing: 'FINANCING_DYNAMIC',
	sentiment: 'ENTERPRISE_SENTIMENT',
	speech: 'ENTERPRISE_SPEECH',
	meeting: 'MEETING_DYNAMIC',
	policy: 'POLICY_DYNAMIC',
};

type AggregateCategory = {
	categoryCode?: string;
	categoryName?: string;
	records?: unknown[];
	total?: number;
};

type AggregateSearchData = {
	total?: number;
	leaderDynamic?: AggregateCategory;
	enterpriseNews?: AggregateCategory;
	financingDynamic?: AggregateCategory;
	enterpriseSentiment?: AggregateCategory;
	enterpriseSpeech?: AggregateCategory;
	meetingDynamic?: AggregateCategory;
	policyDynamic?: AggregateCategory;
};

const AGGREGATE_FIELD_MAP: Record<SectionKey, keyof Omit<AggregateSearchData, 'total'>> = {
	leader: 'leaderDynamic',
	news: 'enterpriseNews',
	financing: 'financingDynamic',
	sentiment: 'enterpriseSentiment',
	speech: 'enterpriseSpeech',
	meeting: 'meetingDynamic',
	policy: 'policyDynamic',
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeHtml = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const createHighlighter = (keyword: string): Highlighter => {
	const word = keyword.trim();
	const pattern = word ? new RegExp(escapeRegExp(word), 'gi') : null;
	return (text: string) => {
		const safeText = escapeHtml(String(text || '--'));
		if (!pattern) return safeText;
		return safeText.replace(pattern, (match) => `<em>${match}</em>`);
	};
};

const formatDate = (value?: string | number | null) => String(value || '').slice(0, 10);

const toText = (value: unknown, fallback = '') => {
	if (value == null || value === '') return fallback;
	return String(value);
};

const formatIndustryChainNames = (value: unknown): string => {
	if (!value) return '';
	if (Array.isArray(value)) {
		return value.map(formatIndustryChainNames).filter(Boolean).join('、');
	}
	if (typeof value === 'object') {
		const info = value as { industryChainName?: string };
		return info.industryChainName || '';
	}
	if (typeof value !== 'string') return '';
	const names = Array.from(
		value.matchAll(/['"]industryChainName['"]\s*:\s*['"]([^'"]+)['"]/g),
		(match) => match[1]
	).filter(Boolean);
	if (names.length) return names.join('、');
	try {
		return formatIndustryChainNames(JSON.parse(value.replace(/'/g, '"')));
	} catch {
		return '';
	}
};

const createMeta = (label: string, value: string, highlight: Highlighter): ResultMeta => ({
	label,
	value,
	valueHtml: highlight(value),
	className: META_CLASS_MAP[label] ?? '',
});

const createResultItem = (
	id: string,
	title: string,
	url: string,
	metas: ResultMeta[],
	highlight: Highlighter,
	extra: Partial<Pick<ResultItem, 'policyDynamicId' | 'companyName' | 'companyNameHtml'>> = {}
): ResultItem => ({
	id,
	title,
	titleHtml: highlight(title),
	url,
	metas,
	...extra,
});

const unwrapPagedList = <T>(
	data: ApiListData<T> | null | undefined
): { list: T[]; total: number } => {
	if (Array.isArray(data)) return { list: data, total: data.length };
	const list = data?.records || data?.rows || data?.list || [];
	const total = Number(data?.total ?? data?.totalCount ?? data?.count ?? 0) || list.length;
	return { list, total };
};

const unwrapApiResult = <T>(
	res: ApiResponse<ApiListData<T>>,
	/* eslint-disable-next-line no-unused-vars */
	mapItem: (item: T, index: number) => ResultItem
): { list: ResultItem[]; total: number } => {
	if (res.code !== 0) return { list: [], total: 0 };
	const { list, total } = unwrapPagedList(res.data);
	return { list: list.map(mapItem), total };
};

const mapLeaderVisit = (
	item: LeaderVisitRecord,
	index: number,
	highlight: Highlighter
): ResultItem =>
	createResultItem(
		toText(item.id || item.link || `${item.title}-${index}`),
		toText(item.title, '--'),
		toText(item.link || item.url),
		[
			createMeta('发布时间', formatDate(item.createdAt || item.date), highlight),
			createMeta('来源', toText(item.authorName || item.source), highlight),
		],
		highlight
	);

const mapSpeechItem = (
	item: LeaderVisitRecord,
	index: number,
	highlight: Highlighter
): ResultItem =>
	createResultItem(
		toText(item.id || item.link || `${item.title}-${index}`),
		toText(item.title, '--'),
		toText(item.link || item.url),
		[
			createMeta('发布时间', formatDate(item.createdAt || item.date), highlight),
			createMeta('来源', toText(item.authorName || item.source), highlight),
		],
		highlight
	);

const mapNewsItem = (item: NewsRecord, index: number, highlight: Highlighter): ResultItem =>
	createResultItem(
		toText(item.id || item.oid || `${item.title}-${index}`),
		toText(item.title || item.changeContent, '--'),
		toText(item.url || item.link),
		[
			createMeta(
				'发布时间',
				formatDate(item.pubTime || item.publishDate || item.date),
				highlight
			),
			createMeta('所属产业', toText(item.aiCategory || item.industry), highlight),
			createMeta('来源', toText(item.source || item.name), highlight),
		],
		highlight
	);

const mapSentimentItem = (item: NewsRecord, index: number, highlight: Highlighter): ResultItem =>
	createResultItem(
		toText(item.id || item.oid || `${item.title}-${index}`),
		toText(item.title || item.changeContent, '--'),
		toText(item.url || item.link),
		[
			createMeta(
				'发布时间',
				formatDate(item.pubTime || item.publishDate || item.date),
				highlight
			),
			createMeta(
				'企业',
				toText(item.name || item.enterpriseName || item.companyName || item.entName),
				highlight
			),
		],
		highlight
	);

const mapFinancingItem = (
	item: FinancingRecord,
	index: number,
	highlight: Highlighter
): ResultItem =>
	createResultItem(
		toText(item.id || `${item.newsTitle}-${index}`),
		toText(item.newsTitle, '--'),
		toText(item.newsLink),
		[
			createMeta('发布时间', formatDate(item.date), highlight),
			createMeta(
				'所属产业',
				toText(
					formatIndustryChainNames(item.industryChainInfoList) ||
						formatIndustryChainNames(item.industry)
				),
				highlight
			),
			createMeta('企业', toText(item.enterpriseName), highlight),
		],
		highlight
	);

const mapMeetingItem = (item: MeetingRecord, index: number, highlight: Highlighter): ResultItem =>
	createResultItem(
		toText(item.id || `${item.exhibitionTitle}-${index}`),
		toText(item.exhibitionTitle, '--'),
		toText(item.url || item.web),
		[
			createMeta(
				'展会时间',
				[item.beginDate, item.endDate].filter(Boolean).join('-'),
				highlight
			),
			createMeta('所在地区', `${item.province || ''}${item.city || ''}`, highlight),
			createMeta('所属行业', toText(item.industry), highlight),
			createMeta('主办单位', toText(item.hostUnit), highlight),
		],
		highlight
	);

const mapPolicyItem = (item: PolicyRecord, index: number, highlight: Highlighter): ResultItem =>
	createResultItem(
		toText(item.id || item.policyDynamicId || `${item.title}-${index}`),
		toText(item.title, '--'),
		toText(item.url || item.link),
		[
			createMeta('发布时间', formatDate(item.publishTime), highlight),
			createMeta('主办单位', toText(item.dept), highlight),
		],
		highlight,
		{ policyDynamicId: item.policyDynamicId }
	);

const parseAggregateData = (
	data: unknown
): {
	total: number;
	groups: Partial<Record<SectionKey, { title: string; list: unknown[]; total: number }>>;
} => {
	const groups: Partial<Record<SectionKey, { title: string; list: unknown[]; total: number }>> =
		{};
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		return { total: 0, groups };
	}

	const root = data as AggregateSearchData;
	(Object.keys(AGGREGATE_FIELD_MAP) as SectionKey[]).forEach((key) => {
		const category = root[AGGREGATE_FIELD_MAP[key]];
		if (!category || typeof category !== 'object') return;
		groups[key] = {
			title: category.categoryName || '',
			list: Array.isArray(category.records) ? category.records : [],
			total: Number(category.total ?? 0),
		};
	});

	return {
		total: Number(root.total ?? 0),
		groups,
	};
};

type SectionMapper = (
	/* eslint-disable-next-line no-unused-vars */
	item: unknown,
	/* eslint-disable-next-line no-unused-vars */
	index: number,
	/* eslint-disable-next-line no-unused-vars */
	highlight: Highlighter
) => ResultItem;

const SECTION_MAPPERS: Record<SectionKey, SectionMapper> = {
	leader: (item, index, highlight) =>
		mapLeaderVisit(item as LeaderVisitRecord, index, highlight),
	news: (item, index, highlight) => mapNewsItem(item as NewsRecord, index, highlight),
	financing: (item, index, highlight) =>
		mapFinancingItem(item as FinancingRecord, index, highlight),
	sentiment: (item, index, highlight) =>
		mapSentimentItem(item as NewsRecord, index, highlight),
	speech: (item, index, highlight) =>
		mapSpeechItem(item as LeaderVisitRecord, index, highlight),
	meeting: (item, index, highlight) => mapMeetingItem(item as MeetingRecord, index, highlight),
	policy: (item, index, highlight) => mapPolicyItem(item as PolicyRecord, index, highlight),
};

const createSectionState = (preset: Pick<ResultSection, 'key' | 'title'>): ResultSection => ({
	...preset,
	loading: false,
	pageNum: 1,
	pageSize: PAGE_SIZE,
	total: 0,
	list: [],
	expanded: false,
	fetchSeq: 0,
});

const buildCategoryRequest = (
	sectionKey: SectionKey,
	pageNum: number,
	pageSize: number,
	keyword: string,
	startTime: string,
	endTime: string
) => ({
	pageNum,
	pageSize,
	entity: {
		categoryCode: SECTION_CATEGORY_CODE[sectionKey],
		keyword,
		startTime,
		endTime,
	},
});

export default function useSearchResults() {
	const route = useRoute();
	const keyword = ref(String(route.query.keyword || '').trim());
	const dateRange = ref<DateRangeValue>(null);
	const isPageLoading = ref(true);
	const activeTab = ref<SectionKey>('leader');
	const resultBodyRef = ref<HTMLElement | null>(null);
	let pageFetchSeq = 0;

	const sections = reactive<ResultSection[]>(SECTION_PRESETS.map(createSectionState));

	const visibleSections = computed(() => sections.filter((section) => section.total > 0));
	const totalCount = ref(0);
	const isEmptyResult = computed(() => !isPageLoading.value && totalCount.value === 0);

	const resetSections = () => {
		totalCount.value = 0;
		sections.forEach((section) => {
			section.list = [];
			section.total = 0;
			section.pageNum = 1;
			section.pageSize = PAGE_SIZE;
			section.expanded = false;
			section.loading = false;
			section.fetchSeq += 1;
		});
	};

	const fetchSectionPage = async (section: ResultSection, pageNum = 1, pageSize = section.pageSize) => {
		section.fetchSeq += 1;
		const seq = section.fetchSeq;
		section.pageNum = pageNum;
		section.pageSize = pageSize;
		section.loading = true;
		try {
			const highlight = createHighlighter(keyword.value);
			const res = await categListApi<ApiListData<unknown>>(
				buildCategoryRequest(
					section.key,
					pageNum,
					pageSize,
					keyword.value,
					dateRange.value?.[0] || '',
					dateRange.value?.[1] || ''
				)
			);
			const { list, total } = unwrapApiResult(res, (item, index) =>
				SECTION_MAPPERS[section.key](item, index, highlight)
			);
			if (seq !== section.fetchSeq) return;
			section.list = list;
			section.total = total;
		} catch {
			if (seq !== section.fetchSeq) return;
			section.list = [];
			section.total = 0;
		} finally {
			if (seq === section.fetchSeq) section.loading = false;
		}
	};

	const applyAggregateData = (data: unknown) => {
		const { total, groups } = parseAggregateData(data);
		const highlight = createHighlighter(keyword.value);
		totalCount.value = total;
		sections.forEach((section) => {
			const group = groups[section.key];
			section.pageNum = 1;
			section.pageSize = PAGE_SIZE;
			section.expanded = false;
			section.fetchSeq += 1;
			if (!group) {
				section.list = [];
				section.total = 0;
				return;
			}
			if (group.title) section.title = group.title;
			section.list = group.list.map((item, index) =>
				SECTION_MAPPERS[section.key](item, index, highlight)
			);
			section.total = group.total;
		});
	};

	const fetchAllSections = async () => {
		pageFetchSeq += 1;
		const seq = pageFetchSeq;
		if (!keyword.value) {
			resetSections();
			isPageLoading.value = false;
			return;
		}
		isPageLoading.value = true;
		try {
			const res = await aggregateSearchApi<unknown>({
				pageNum: 1,
				pageSize: PAGE_SIZE,
				entity: {
					keyword: keyword.value,
					startTime: dateRange.value?.[0] || '',
					endTime: dateRange.value?.[1] || '',
				},
			});
			if (seq !== pageFetchSeq) return;
			if (res.code !== 0) {
				resetSections();
				return;
			}
			applyAggregateData(res.data);
		} catch {
			if (seq !== pageFetchSeq) return;
			resetSections();
		} finally {
			if (seq === pageFetchSeq) isPageLoading.value = false;
		}
	};

	const toggleSectionExpand = (key: SectionKey) => {
		const section = sections.find((item) => item.key === key);
		if (section) section.expanded = !section.expanded;
	};

	const onKeywordSearch = (value: string) => {
		keyword.value = value.trim();
		fetchAllSections();
	};

	const scrollToSection = (key: SectionKey) => {
		activeTab.value = key;
		const body = resultBodyRef.value;
		const el = body?.querySelector<HTMLElement>(`[data-section-key="${key}"]`);
		if (!el || !body) return;
		body.scrollTo({
			top: el.offsetTop - body.offsetTop,
			behavior: 'smooth',
		});
	};

	watch(
		() => route.query.keyword,
		(value) => {
			keyword.value = String(value || '').trim();
			fetchAllSections();
		}
	);

	watch(visibleSections, (list) => {
		if (!list.some((section) => section.key === activeTab.value)) {
			activeTab.value = list[0]?.key || 'leader';
		}
	});

	onMounted(() => {
		fetchAllSections();
	});

	return {
		PAGE_SIZE,
		keyword,
		dateRange,
		isPageLoading,
		isEmptyResult,
		totalCount,
		visibleSections,
		activeTab,
		resultBodyRef: resultBodyRef as Ref<HTMLElement | null>,
		fetchAllSections,
		fetchSectionPage,
		toggleSectionExpand,
		onKeywordSearch,
		scrollToSection,
	};
}
