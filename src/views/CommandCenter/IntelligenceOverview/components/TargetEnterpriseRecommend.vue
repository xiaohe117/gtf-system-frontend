<!--
 * @Descripttion: 目标企业推荐组件
 * @Author: opencode
 * @Date: 2026-06-12
-->
<template>
	<div class="target-enterprise">
		<!-- 	<div class="section-header">
			<div class="title-wrapper">
				<img src="@/assets/images/IntelligenceOverview/TargetEnterpriseRecommend.png" class="title-bg" alt="" />
			</div>
		</div> -->
		<SectionTitle title="推荐企业" />
		<div class="box-flex">
			<div class="chain-recommendation">
				<div class="sub-header">
					<div class="sub-title">
						<div class="dot-text">
							<span>产业强链、补链、延链推荐</span>
							<el-tooltip
								:show-after="500"
								v-if="titleTooltipVisible.chainRecommendation"
								:content="titleTooltipText.chainRecommendation"
								placement="left"
								popper-class="target-module-title-tooltip"
							>
								<span class="title-help-icon"></span>
							</el-tooltip>
						</div>
					</div>
					<div class="view-more" @click="handleViewMore(3)">
						<img src="@/assets/images/IntelligenceOverview/many.png" alt="" />
					</div>
				</div>
				<el-radio-group
					:model-value="activeChainTab"
					class="chain-tabs"
					@change="handleChainTabClick"
				>
					<el-radio-button
						v-for="(tab, index) in chainTabs"
						:key="index"
						:label="index"
						class="chain-tab"
						:class="{ active: activeChainTab === index }"
					>
						{{ tab }}
					</el-radio-button>
				</el-radio-group>
				<div
					ref="chainListRef"
					v-loading="chainLoading"
					class="enterprise-list"
					@scroll="handleChainListScroll"
				>
					<div v-if="!chainLoading && chainEnterprises.length === 0" class="module-empty">
						<img
							src="@/assets/images/IntelligenceOverview/emty.webp"
							class="module-empty-image"
							alt=""
						/>
						<div class="module-empty-text">暂无数据</div>
					</div>
					<div
						v-for="(item, index) in chainEnterprises"
						:key="item.id"
						class="enterprise-card1 chain-enterprise-card"
						@click="handleChainEnterpriseClick(item)"
					>
						<div class="enterprise-name">{{ item.name }}</div>
						<div class="enterprise-meta">
							<div class="chain-reason-meta">
								<div class="reason-label">推荐理由：</div>
								<span class="target-tooltip-wrap">
									<el-tooltip
										:show-after="500"
										:content="item.enterpriseType || '-'"
										placement="top"
										:disabled="
											!item.enterpriseType ||
											!isTargetOverflowTooltip(
												getTargetTextKey('chain', index, 'reason')
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey('chain', index, 'reason')
												)
											"
											class="reason-highlight"
										>
											{{ item.enterpriseType || '-' }}
										</span>
									</el-tooltip>
								</span>
							</div>
							<div class="industry-meta">
								<span class="industry-label">所属产业：</span>
								<el-tooltip
									:show-after="500"
									:content="item.industry"
									placement="top"
									:disabled="
										!item.industry ||
										!isTargetOverflowTooltip(
											getTargetTextKey('chain', index, 'industry')
										)
									"
								>
									<span
										:ref="
											setTargetOverflowTooltipRef(
												getTargetTextKey('chain', index, 'industry')
											)
										"
										class="blackcolor industry-value"
									>
										{{ item.industry }}
									</span>
								</el-tooltip>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="investment-intent">
				<div class="sub-header">
					<div class="sub-title">
						<div class="dot-text">
							<span>有投资意向企业</span>
							<el-tooltip
								:show-after="500"
								:content="titleTooltipText.investmentIntent"
								placement="left"
								popper-class="target-module-title-tooltip"
							>
								<span class="title-help-icon"></span>
							</el-tooltip>
						</div>
					</div>
					<div class="view-more" @click="handleViewMore(1)">
						<img src="@/assets/images/IntelligenceOverview/many.png" alt="" />
					</div>
				</div>
				<div
					ref="investmentListRef"
					v-loading="investmentLoading"
					class="enterprise-list"
					@scroll="handleInvestmentListScroll"
				>
					<div
						v-if="!investmentLoading && investmentEnterprises.length === 0"
						class="module-empty"
					>
						<img
							src="@/assets/images/IntelligenceOverview/emty.webp"
							class="module-empty-image"
							alt=""
						/>
						<div class="module-empty-text">暂无数据</div>
					</div>
					<div v-for="(item, index) in investmentEnterprises" :key="item.id">
						<div
							class="enterprise-card investment-enterprise-card"
							:class="{ 'is-tooltip-card': item.qualityLabel }"
							@click="handleInvestmentEnterpriseClick(item)"
						>
							<div class="enterprise-name">{{ item.name }}</div>
							<img
								src="@/assets/images/IntelligenceOverview/hight.png"
								class="investment-high-tag"
								alt=""
							/>
							<div class="enterprise-meta">
								<div class="investment-industry-meta">
									<span class="industry-label">所属产业：</span>
									<el-tooltip
										:show-after="500"
										:content="item.industry"
										placement="top"
										:disabled="
											!item.industry ||
											!isTargetOverflowTooltip(
												getTargetTextKey('investment', index, 'industry')
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey(
														'investment',
														index,
														'industry'
													)
												)
											"
											class="blackcolor investment-industry-value"
										>
											{{ item.industry || '-' }}
										</span>
									</el-tooltip>
								</div>
								<!-- <span style="width: 42%"
									>新增投资概率：<span class="high-prob">{{
										item.probability || '-'
									}}</span></span
								> -->
								<div class="enterprise-reason">
									<span class="reason-label">推荐理由：</span>
									<span class="target-tooltip-wrap">
										<el-tooltip
											:show-after="500"
											:content="item.reason || '-'"
											placement="top"
											:disabled="
												!item.reason ||
												!isTargetOverflowTooltip(
													getTargetTextKey('investment', index, 'reason')
												)
											"
										>
											<span
												:ref="
													setTargetOverflowTooltipRef(
														getTargetTextKey(
															'investment',
															index,
															'reason'
														)
													)
												"
												class="reason-tag"
											>
												{{ item.reason || '-' }}
											</span>
										</el-tooltip>
									</span>
								</div>
							</div>
							<!-- <div class="enterprise-reason">
								<span class="reason-label">推荐理由：</span>
								<span class="reason-tag">{{ item.reason }}</span>
							</div> -->
						</div>
					</div>
				</div>
			</div>

			<div class="local-connection">
				<div class="sub-header">
					<div class="sub-title">
						<div class="dot-text">
							<span>与本地业务有联系企业</span>
							<el-tooltip
								:show-after="500"
								v-if="titleTooltipVisible.localConnection"
								:content="titleTooltipText.localConnection"
								placement="left"
								popper-class="target-module-title-tooltip"
							>
								<span class="title-help-icon"></span>
							</el-tooltip>
						</div>
					</div>
					<div class="view-more" @click="handleViewMore(2)">
						<img src="@/assets/images/IntelligenceOverview/many.png" alt="" />
					</div>
				</div>
				<el-radio-group
					:model-value="activeFilter"
					class="filter-tags"
					@change="handleFilterClick"
				>
					<el-radio-button
						v-for="(tag, index) in filterTags"
						:key="index"
						:label="index"
						class="filter-tag"
						:class="{ active: activeFilter === index }"
					>
						{{ tag }}
					</el-radio-button>
				</el-radio-group>
				<div v-loading="localLoading" class="enterprise-list">
					<div v-if="!localLoading && localEnterprises.length === 0" class="module-empty">
						<img
							src="@/assets/images/IntelligenceOverview/emty.webp"
							class="module-empty-image"
							alt=""
						/>
						<div class="module-empty-text">暂无数据</div>
					</div>
					<div
						v-for="(item, index) in localEnterprises"
						:key="item.id"
						class="enterprise-card"
						:class="{
							'supplier-enterprise-card': activeFilter === supplierFilterIndex,
						}"
						@click="handleLocalEnterpriseClick(item)"
					>
						<div class="enterprise-title-row">
							<el-tooltip
								:show-after="500"
								:content="item.coEname"
								placement="top"
								:disabled="
									!item.coEname ||
									!isTargetOverflowTooltip(
										getTargetTextKey('local', index, 'name')
									)
								"
							>
								<span
									:ref="
										setTargetOverflowTooltipRef(
											getTargetTextKey('local', index, 'name')
										)
									"
									class="enterprise-name"
								>
									{{ item.coEname || '-' }}
								</span>
							</el-tooltip>
							<div class="title-cooperation-info">
								<span class="title-cooperation-item">
									<span class="amount-label">合作金额(万元)：</span>
									<el-tooltip
										:show-after="500"
										:content="item.cooperationAmount || '-'"
										placement="top"
										:disabled="
											!item.cooperationAmount ||
											!isTargetOverflowTooltip(
												getTargetTextKey(
													'local',
													index,
													'cooperationAmount'
												)
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey(
														'local',
														index,
														'cooperationAmount'
													)
												)
											"
											class="blackcolor title-cooperation-value"
										>
											{{ item.cooperationAmount || '-' }}
										</span>
									</el-tooltip>
								</span>
							</div>
						</div>
						<template v-if="activeFilter === supplierFilterIndex">
							<div
								class="enterprise-meta local-enterprise-meta supplier-enterprise-meta"
							>
								<div class="local-industry-meta">
									<span class="industry-label">所属产业：</span>
									<el-tooltip
										:show-after="500"
										:content="item.industry"
										placement="top"
										:disabled="
											!item.industry ||
											!isTargetOverflowTooltip(
												getTargetTextKey('local', index, 'industry')
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey('local', index, 'industry')
												)
											"
											class="blackcolor industry-value"
										>
											{{ item.industry || '-' }}
										</span>
									</el-tooltip>
								</div>
								<div class="local-count-meta">
									<span>合作次数：</span>
									<span class="blackcolor local-count-value">{{
										item.cooperationCount || '-'
									}}</span>
								</div>
							</div>
							<div class="enterprise-address supplier-enterprise-address">
								<div class="local-address-meta">
									<span class="address-label">注册所在地：</span>
									<el-tooltip
										:show-after="500"
										:content="item.address"
										placement="top"
										:disabled="
											!item.address ||
											!isTargetOverflowTooltip(
												getTargetTextKey('local', index, 'address')
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey('local', index, 'address')
												)
											"
											class="blackcolor address-value"
										>
											{{ item.address || '-' }}
										</span>
									</el-tooltip>
								</div>
								<div class="local-industry-meta supplier-address-industry-meta">
									<span class="industry-label">所属产业：</span>
									<el-tooltip
										:show-after="500"
										:content="item.industry"
										placement="top"
										:disabled="
											!item.industry ||
											!isTargetOverflowTooltip(
												getTargetTextKey(
													'local',
													index,
													'supplierAddressIndustry'
												)
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey(
														'local',
														index,
														'supplierAddressIndustry'
													)
												)
											"
											class="blackcolor industry-value"
										>
											{{ item.industry || '-' }}
										</span>
									</el-tooltip>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="enterprise-meta local-enterprise-meta">
								<div class="local-industry-meta">
									<span class="industry-label">所属产业：</span>
									<el-tooltip
										:show-after="500"
										:content="item.industry"
										placement="top"
										:disabled="
											!item.industry ||
											!isTargetOverflowTooltip(
												getTargetTextKey('local', index, 'industry')
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey('local', index, 'industry')
												)
											"
											class="blackcolor industry-value"
										>
											{{ item.industry || '-' }}
										</span>
									</el-tooltip>
								</div>
								<div class="enterprise-address">
									<span class="address-label">注册所在地：</span>
									<el-tooltip
										:show-after="500"
										:content="item.address"
										placement="top"
										:disabled="
											!item.address ||
											!isTargetOverflowTooltip(
												getTargetTextKey('local', index, 'address')
											)
										"
									>
										<span
											:ref="
												setTargetOverflowTooltipRef(
													getTargetTextKey('local', index, 'address')
												)
											"
											class="blackcolor address-value"
										>
											{{ item.address || '-' }}
										</span>
									</el-tooltip>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	getComplementChainList,
	getextendedChainList,
	getinvestmentrecommendationList,
	getsupplychaindetailList,
	getStrongChainList,
} from '@/api/Intelligence/index';
import useOverflowTooltip from './useOverflowTooltip';

const props = defineProps<{
	getQxbToken: () => Promise<string>;
}>();

const titleTooltipText = {
	investmentIntent:
		'基于对企业投资动因分析与识别，从企业基本素质、资金实力、业务增长、投资活跃度、影响动机、行业景气度、负面因素等7大维度设计指标，通过构建机器学习模型对海量样本企业进行训练学习，输出对企业对外投资概率，预测企业未来一年的投资意向',
	localConnection:
		'筛选人工智能产业的供应商数量top10的数据，进入这10个供应商的供应链详情进行爬取数据，过滤注册地非广州市的企业，获取这些企业作为广州企业供应商的数据；',
	chainRecommendation:
		'获取启信宝“人工智能”行业的强链、补链、延链的数据后，入库到数据库，再进行取数展示；',
};

const titleTooltipVisible = {
	localConnection: false,
	chainRecommendation: false,
};

type ApiListData<T> =
	| T[]
	| {
			records?: T[];
			rows?: T[];
			list?: T[];
	  };

type LabelItem =
	| string
	| {
			label?: string;
			name?: string;
			value?: string;
	  };

type LabelCollection = LabelItem[] | string | null | undefined;

const formatLabelCollection = (labels: LabelCollection): string => {
	if (!labels) return '';

	if (Array.isArray(labels)) {
		return labels
			.map((label) => {
				if (typeof label === 'string') return label;
				return label.label || label.name || label.value || '';
			})
			.filter(Boolean)
			.join('、');
	}

	try {
		const parsedLabels = JSON.parse(labels) as LabelItem[];
		return Array.isArray(parsedLabels) ? formatLabelCollection(parsedLabels) : labels;
	} catch {
		return labels;
	}
};

type InvestmentRecommendationApiItem = {
	id?: number | string;
	eid?: string;
	enterpriseName?: string;
	name?: string;
	qualityLabelArr?: LabelCollection;
	industryNameList?: LabelCollection;
	industryChains?: string;
	industry?: string;
	industryProduct?: string;
	recommendedReason?: string;
	recommendedReasonDesc?: string;
	recommendationPriority?: string;
	investPridiction?: string;
	investmentGrade?: string;
	investProbabilityValue?: string;
	investmentProbability?: string;
};

type InvestmentEnterprise = {
	id: number | string;
	eid: string;
	name: string;
	industry: string;
	reason: string;
	probability: string;
	qualityLabel: string;
};

const investmentEnterprises = ref<InvestmentEnterprise[]>([]);
const investmentLoading = ref(false);
const investmentListRef = ref<HTMLElement | null>(null);
const investmentPageSize = 15;
const investmentHasNext = ref(true);
let investmentMinLoadedPage = 1;
let investmentMaxLoadedPage = 0;
let investmentLoadedPages = new Set<number>();
let investmentScrollTimer: ReturnType<typeof setTimeout> | null = null;
let investmentRequestId = 0;
type InvestmentLoadDirection = 'init' | 'down' | 'up';
const QXB_BASE_URL = 'https://z-plugin.qixin.com/third-login?tenant=gd_gdyt1';
const QXB_ENTERPRISE_DETAIL_URL = 'enterprise-valuation/detail/ent-overview';
const QXB_INVESTMENT_RECOMMEND_URL = 'recommend/company-recommend/clue';
const QXB_SUPPLY_CHAIN_DASHBOARD_URL = 'supply-chain/dashboard/supply-dashboard';
const QXB_STRONG_CHAIN_LIST_URL =
	'industrial-insight/layout/strong-weak-upgrade/strong-chain?id=545df85ec696ad9781e25f7240b4700d&locationFlag=2&areaCode=440100&industryName=&title=%E5%BC%BA%E9%93%BE%E6%8E%A8%E8%8D%90&areaType=2&areaName=%E5%B9%BF%E5%B7%9E%E5%B8%82&parentCode=440000&parentLabel=%E5%B9%BF%E4%B8%9C&isFrom=&products=';
const QXB_COMPLEMENT_CHAIN_LIST_URL =
	'industrial-insight/layout/strong-weak-upgrade/complement-chain?id=545df85ec696ad9781e25f7240b4700d&locationFlag=2&areaCode=440100&industryName=&title=%E8%A1%A5%E9%93%BE%E6%8E%A8%E8%8D%90&areaType=2&areaName=%E5%B9%BF%E5%B7%9E%E5%B8%82&parentCode=440000&parentLabel=%E5%B9%BF%E4%B8%9C&isFrom=&products=';
const QXB_EXTENDED_CHAIN_LIST_URL =
	'industrial-insight/layout/strong-weak-upgrade/extended-chain?id=545df85ec696ad9781e25f7240b4700d&locationFlag=2&areaCode=440100&industryName=&title=%E5%BB%B6%E9%93%BE%E6%8E%A8%E8%8D%90&areaType=2&areaName=%E5%B9%BF%E5%B7%9E%E5%B8%82&parentCode=440000&parentLabel=%E5%B9%BF%E4%B8%9C&isFrom=&products=';
const QXB_CHAIN_LIST_URL_MAP: Record<number, string> = {
	0: QXB_STRONG_CHAIN_LIST_URL,
	1: QXB_COMPLEMENT_CHAIN_LIST_URL,
	2: QXB_EXTENDED_CHAIN_LIST_URL,
};

function getApiList<T>(data: ApiListData<T> | null | undefined): T[] {
	if (Array.isArray(data)) return data;
	return data?.records || data?.rows || data?.list || [];
}

const isHighInvestmentPrediction = (item: InvestmentRecommendationApiItem): boolean =>
	item.investPridiction?.trim() === '高';

const normalizeInvestmentEnterprise = (
	item: InvestmentRecommendationApiItem,
	index: number
): InvestmentEnterprise => ({
	id: item.id || item.eid || item.enterpriseName || item.name || `investment-${index}`,
	eid: item.eid || '',
	name: item.enterpriseName || item.name || '',
	industry:
		formatLabelCollection(item.industryNameList) ||
		item.industryChains ||
		item.industry ||
		item.industryProduct ||
		'',
	reason:
		item.recommendedReason || item.recommendedReasonDesc || item.recommendationPriority || '',
	probability:
		item.investPridiction ||
		item.investmentGrade ||
		item.investProbabilityValue ||
		item.investmentProbability ||
		'',
	qualityLabel: formatLabelCollection(item.qualityLabelArr),
});

const resetInvestmentPageState = () => {
	investmentHasNext.value = true;
	investmentMinLoadedPage = 1;
	investmentMaxLoadedPage = 0;
	investmentLoadedPages = new Set<number>();
};

const getInvestmentEnterpriseKey = (item: InvestmentEnterprise) =>
	String(item.id || item.eid || item.name);

const mergeInvestmentEnterprises = (
	list: InvestmentEnterprise[],
	direction: InvestmentLoadDirection,
	oldScrollHeight: number
) => {
	if (direction === 'init') {
		investmentEnterprises.value = list;
		nextTick(() => {
			if (investmentListRef.value) investmentListRef.value.scrollTop = 0;
		});
		return;
	}

	const existingKeys = new Set(investmentEnterprises.value.map(getInvestmentEnterpriseKey));
	const newList = list.filter((item) => {
		const key = getInvestmentEnterpriseKey(item);
		if (existingKeys.has(key)) return false;
		existingKeys.add(key);
		return true;
	});

	if (direction === 'up') {
		const oldScrollTop = investmentListRef.value?.scrollTop || 0;
		investmentEnterprises.value = [...newList, ...investmentEnterprises.value];
		nextTick(() => {
			const listEl = investmentListRef.value;
			if (listEl) {
				listEl.scrollTop = oldScrollTop + listEl.scrollHeight - oldScrollHeight;
			}
		});
		return;
	}

	investmentEnterprises.value = [...investmentEnterprises.value, ...newList];
};

const getInvestmentRecommendationList = async (
	pageNum = 1,
	direction: InvestmentLoadDirection = 'init'
) => {
	if (direction !== 'init' && investmentLoadedPages.has(pageNum)) return;

	investmentRequestId += 1;
	const requestId = investmentRequestId;

	investmentLoading.value = true;
	if (direction === 'init') {
		resetInvestmentPageState();
		investmentEnterprises.value = [];
	}

	try {
		const oldScrollHeight = investmentListRef.value?.scrollHeight || 0;
		const res = await getinvestmentrecommendationList<
			ApiListData<InvestmentRecommendationApiItem>
		>({
			pageNum,
			pageSize: investmentPageSize,
			entity: {
				investPridiction: '高',
			},
		});

		if (requestId === investmentRequestId) {
			const list =
				res.code === 0
					? getApiList(res.data)
							.filter(isHighInvestmentPrediction)
							.map(normalizeInvestmentEnterprise)
					: [];

			if (direction === 'down' && list.length === 0) {
				investmentHasNext.value = false;
				return;
			}

			investmentLoadedPages.add(pageNum);
			investmentMinLoadedPage = Math.min(investmentMinLoadedPage, pageNum);
			investmentMaxLoadedPage = Math.max(investmentMaxLoadedPage, pageNum);
			if (direction !== 'up') {
				investmentHasNext.value = list.length === investmentPageSize;
			}
			mergeInvestmentEnterprises(list, direction, oldScrollHeight);
		}
	} catch {
		if (requestId === investmentRequestId) {
			if (pageNum === 1) {
				investmentEnterprises.value = [];
			} else {
				investmentHasNext.value = false;
			}
		}
	} finally {
		if (requestId === investmentRequestId) {
			investmentLoading.value = false;
		}
	}
};

const filterTags = ref(['广州企业供应商']);
// const filterTags = ref(['运营总部在穗，但非在穗上市', '广州企业供应商']);
const activeFilter = ref(0);
const supplierFilterIndex = 0;
const localLoading = ref(false);
let localRequestId = 0;

type LocalEnterpriseApiItem = {
	id?: number | string;
	eid?: string;
	ename?: string;
	coEname?: string;
	coName?: string;
	name?: string;
	area?: string;
	registeredAddress?: string;
	registeredAddressAbroad?: string;
	registerAddress?: string;
	address?: string;
	provinceName?: string;
	cityName?: string;
	industryChainNameList?: LabelCollection;
	industry?: string;
	industryProduct?: string;
	allAmount?: number | string;
	tradeAmountSummary?: number | string;
	cnt?: number | string;
	totalCoTimesCnt?: number | string;
	totalTradeAmountSummary?: number | string;
};

type LocalEnterprise = {
	id: number | string;
	eid: string;
	name: string;
	registerAmount: string;
	cooperationAmount: string;
	cooperationCount: string;
	industry: string;
	address: string;
	coEname: string;
	companyName: string;
	sccode: string;
};

const localEnterprises = ref<LocalEnterprise[]>([]);

const formatAmountText = (value: number | string | null | undefined): string => {
	if (value === null || value === undefined || value === '') return '';

	const text = String(value);
	return /万|元|人民币/.test(text) ? text : `${text} 万人民币元`;
};

const formatPlainText = (value: number | string | null | undefined): string => {
	if (value === null || value === undefined || value === '') return '';
	return String(value);
};

const normalizeLocalEnterprise = (
	item: LocalEnterpriseApiItem,
	index: number
): LocalEnterprise => ({
	id: item.id || item.eid || item.ename || item.coName || item.name || `local-${index}`,
	eid: item.eid || '',
	name: item.ename || item.coName || item.name || '',
	registerAmount: formatAmountText(item.allAmount ?? item.tradeAmountSummary),
	cooperationAmount: formatPlainText(item.totalTradeAmountSummary),
	cooperationCount:
		item.totalCoTimesCnt === null ||
		item.totalCoTimesCnt === undefined ||
		item.totalCoTimesCnt === ''
			? ''
			: String(item.totalCoTimesCnt),
	industry: '人工智能',
	address:
		item.area ||
		item.registeredAddress ||
		item.registeredAddressAbroad ||
		item.registerAddress ||
		item.address ||
		[item.provinceName, item.cityName].filter(Boolean).join('') ||
		'',
	coEname: item.ename || item.coEname || item.coName || item.name || '',
	companyName: item.ename || item.coEname || item.coName || item.name || '',
	sccode: '',
});

const getSupplyChainDetailList = async () => {
	localRequestId += 1;
	const requestId = localRequestId;

	localLoading.value = true;
	localEnterprises.value = [];

	try {
		const res = await getsupplychaindetailList<ApiListData<LocalEnterpriseApiItem>>();

		if (requestId === localRequestId) {
			localEnterprises.value =
				res.code === 0 ? getApiList(res.data).map(normalizeLocalEnterprise) : [];
		}
	} catch {
		if (requestId === localRequestId) {
			localEnterprises.value = [];
		}
	} finally {
		if (requestId === localRequestId) {
			localLoading.value = false;
		}
	}
};

const handleFilterClick = (tabIndex: string | number | boolean) => {
	const index = Number(tabIndex);

	activeFilter.value = index;

	if (index === supplierFilterIndex) {
		getSupplyChainDetailList();
	}
};

const openQxbPage = async (returnUrl: string) => {
	const token = await props.getQxbToken();
	if (!token) return;
	const targetUrl = `${QXB_BASE_URL}&token=${token}&returnUrl=${encodeURIComponent(returnUrl)}`;
	window.open(targetUrl, '_blank');
};

const handleLocalEnterpriseClick = (item: LocalEnterprise) => {
	if (activeFilter.value === supplierFilterIndex) {
		openQxbPage(`${QXB_ENTERPRISE_DETAIL_URL}?eid=${item.eid}`);
	}
};

const chainTabs = ref(['强链', '补链', '延链']);
const activeChainTab = ref(0);
const chainLoading = ref(false);
const chainListRef = ref<HTMLElement | null>(null);
const chainPageSize = 15;
const chainHasNext = ref(true);
let chainMinLoadedPage = 1;
let chainMaxLoadedPage = 0;
let chainLoadedPages = new Set<number>();
let chainScrollTimer: ReturnType<typeof setTimeout> | null = null;

type ChainEnterpriseApiItem = {
	id: number | string;
	eid?: string;
	name?: string;
	qualityLabelArr?: LabelCollection;
	productType?: string;
	enterpriseType?: string;
	cardAutoList?: LabelCollection;
	elabels?: string;
	prediction?: string;
	industryProduct?: any;
};

type ChainEnterprise = {
	id: number | string;
	eid: string;
	name: string;
	reason: string;
	industry: string;
	enterpriseType: string;
};

const chainEnterprises = ref<ChainEnterprise[]>([]);
let chainRequestId = 0;
type ChainLoadDirection = 'init' | 'down' | 'up';
type TargetTooltipModule = 'chain' | 'investment' | 'local';
type TargetTooltipField =
	| 'reason'
	| 'industry'
	| 'name'
	| 'cooperationAmount'
	| 'address'
	| 'supplierAddressIndustry';

const {
	isOverflowTooltip: isTargetOverflowTooltip,
	refreshOverflowTooltip: refreshTargetOverflowTooltip,
	setOverflowTooltipRef: setTargetOverflowTooltipRef,
} = useOverflowTooltip();

const getTargetTextKey = (module: TargetTooltipModule, index: number, field: TargetTooltipField) =>
	`${module}-${index}-${field}`;

const normalizeChainEnterprise = (item: ChainEnterpriseApiItem): ChainEnterprise => ({
	id: item.id,
	eid: item.eid || String(item.id || ''),
	name: item.name || '',
	reason:
		formatLabelCollection(item.qualityLabelArr) ||
		formatLabelCollection(item.cardAutoList) ||
		item.elabels ||
		item.prediction ||
		'',
	industry: item.industryProduct || '',
	enterpriseType: item.enterpriseType || '',
});

const resetChainPageState = () => {
	chainHasNext.value = true;
	chainMinLoadedPage = 1;
	chainMaxLoadedPage = 0;
	chainLoadedPages = new Set<number>();
};

const getChainEnterpriseKey = (item: ChainEnterprise) => String(item.id || item.eid || item.name);

const mergeChainEnterprises = (
	list: ChainEnterprise[],
	direction: ChainLoadDirection,
	oldScrollHeight: number
) => {
	if (direction === 'init') {
		chainEnterprises.value = list;
		nextTick(() => {
			if (chainListRef.value) chainListRef.value.scrollTop = 0;
		});
		return;
	}

	const existingKeys = new Set(chainEnterprises.value.map(getChainEnterpriseKey));
	const newList = list.filter((item) => {
		const key = getChainEnterpriseKey(item);
		if (existingKeys.has(key)) return false;
		existingKeys.add(key);
		return true;
	});

	if (direction === 'up') {
		const oldScrollTop = chainListRef.value?.scrollTop || 0;
		chainEnterprises.value = [...newList, ...chainEnterprises.value];
		nextTick(() => {
			const listEl = chainListRef.value;
			if (listEl) {
				listEl.scrollTop = oldScrollTop + listEl.scrollHeight - oldScrollHeight;
			}
		});
		return;
	}

	chainEnterprises.value = [...chainEnterprises.value, ...newList];
};

const getChainList = async (
	chainIndex: number,
	pageNum = 1,
	direction: ChainLoadDirection = 'init'
) => {
	if (direction !== 'init' && chainLoadedPages.has(pageNum)) return;

	chainRequestId += 1;
	const requestId = chainRequestId;

	chainLoading.value = true;
	if (direction === 'init') {
		resetChainPageState();
		chainEnterprises.value = [];
	}

	try {
		const oldScrollHeight = chainListRef.value?.scrollHeight || 0;
		const params = {
			pageNum,
			pageSize: chainPageSize,
		};
		let res;

		if (chainIndex === 0) {
			res = await getStrongChainList<ApiListData<ChainEnterpriseApiItem>>(params);
		} else if (chainIndex === 1) {
			res = await getComplementChainList<ApiListData<ChainEnterpriseApiItem>>(params);
		} else {
			res = await getextendedChainList<ApiListData<ChainEnterpriseApiItem>>(params);
		}

		if (requestId === chainRequestId && activeChainTab.value === chainIndex) {
			const list = res.code === 0 ? getApiList(res.data) : [];

			if (direction === 'down' && list.length === 0) {
				chainHasNext.value = false;
				return;
			}

			chainLoadedPages.add(pageNum);
			chainMinLoadedPage = Math.min(chainMinLoadedPage, pageNum);
			chainMaxLoadedPage = Math.max(chainMaxLoadedPage, pageNum);
			if (direction !== 'up') {
				chainHasNext.value = list.length === chainPageSize;
			}
			mergeChainEnterprises(list.map(normalizeChainEnterprise), direction, oldScrollHeight);
		}
	} catch {
		if (requestId === chainRequestId) {
			if (pageNum === 1) {
				chainEnterprises.value = [];
			} else {
				chainHasNext.value = false;
			}
		}
	} finally {
		if (requestId === chainRequestId) {
			chainLoading.value = false;
		}
	}
};

const handleChainTabClick = (tabIndex: string | number | boolean) => {
	const index = Number(tabIndex);

	activeChainTab.value = index;
	getChainList(index, 1, 'init');
};

const handleChainListScroll = (event: Event) => {
	if (chainScrollTimer) return;

	const listEl = event.target as HTMLElement;
	chainScrollTimer = setTimeout(() => {
		chainScrollTimer = null;

		if (chainLoading.value) return;

		const isAtTop = listEl.scrollTop <= 0;
		const isAtBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 2;

		if (isAtTop && chainMinLoadedPage > 1) {
			getChainList(activeChainTab.value, chainMinLoadedPage - 1, 'up');
			return;
		}

		if (isAtBottom && chainHasNext.value && chainEnterprises.value.length >= chainPageSize) {
			getChainList(activeChainTab.value, chainMaxLoadedPage + 1, 'down');
		}
	}, 200);
};

const handleChainEnterpriseClick = (item: ChainEnterprise) => {
	if (!item.eid) return;
	openQxbPage(`${QXB_ENTERPRISE_DETAIL_URL}?eid=${item.eid}`);
};

const handleInvestmentEnterpriseClick = (item: InvestmentEnterprise) => {
	if (!item.eid) return;
	openQxbPage(`${QXB_ENTERPRISE_DETAIL_URL}?eid=${item.eid}`);
};

const handleInvestmentListScroll = (event: Event) => {
	if (investmentScrollTimer) return;

	const listEl = event.target as HTMLElement;
	investmentScrollTimer = setTimeout(() => {
		investmentScrollTimer = null;

		if (investmentLoading.value) return;

		const isAtTop = listEl.scrollTop <= 0;
		const isAtBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 2;

		if (isAtTop && investmentMinLoadedPage > 1) {
			getInvestmentRecommendationList(investmentMinLoadedPage - 1, 'up');
			return;
		}

		if (
			isAtBottom &&
			investmentHasNext.value &&
			investmentEnterprises.value.length >= investmentPageSize
		) {
			getInvestmentRecommendationList(investmentMaxLoadedPage + 1, 'down');
		}
	}, 200);
};

const handleViewMore = (value: number) => {
	if (value === 1) {
		openQxbPage(QXB_INVESTMENT_RECOMMEND_URL);
		return;
	}

	if (value === 2) {
		openQxbPage(QXB_SUPPLY_CHAIN_DASHBOARD_URL);
		return;
	}

	if (value === 3) {
		openQxbPage(QXB_CHAIN_LIST_URL_MAP[activeChainTab.value] || QXB_STRONG_CHAIN_LIST_URL);
	}
};

watch(
	[chainEnterprises, investmentEnterprises, localEnterprises, activeChainTab, activeFilter],
	refreshTargetOverflowTooltip,
	{ flush: 'post' }
);

onMounted(() => {
	getInvestmentRecommendationList();
	getSupplyChainDetailList();
	getChainList(activeChainTab.value);
});
</script>

<style lang="less" scoped>
.header {
	display: flex;
	align-items: baseline;
	margin-bottom: 0.16rem;

	.name {
		min-width: 1.61rem;
		min-height: 0.44rem;
		padding-right: 0.36rem;
		background: url('@/assets/images/gtf/title-bg-yellow.png') bottom right / 1.55rem 0.17rem
			no-repeat;
		&::before {
			content: '';
			position: absolute;
			width: 0.89rem;
			height: 0.28rem;
			background: url('@/assets/images/gtf/title-bg-text.png');
			background-size: 100% 100%;
		}
		> span {
			display: inline-block;
			padding-top: 0.1rem;
			padding-left: 0.14rem;
			font-family: YouSheBiaoTiHei;
			font-size: 0.3rem;
			line-height: 0.25rem;
			background: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
			background-clip: text;
			-webkit-text-fill-color: transparent;
			filter: drop-shadow(0.02rem 0.02rem 0 #ffffff);
		}
	}
}
.blackcolor {
	color: black;
}
.target-enterprise {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0rem;
}

.title-wrapper {
	position: relative;
	display: inline-block;

	.title-bg {
		height: 0.45rem;
		width: auto;
	}
}

.sub-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0rem;
	flex-shrink: 0;
	padding: 0.08rem 0.06rem;
	background: url('@/assets/images/IntelligenceOverview/link.png') no-repeat bottom 6px center /
		100% auto;
	border-radius: 0.06rem;
}

.sub-title {
	gap: 0.06rem;
	font-size: 0.14rem;
	color: #202741;
	font-weight: bold;

	.dot-text {
		display: inline-flex;
		align-items: center;
		gap: 0.06rem;
		font-weight: bold;
		font-size: 16px;
		color: #3a73de;
		line-height: 26px;
		text-shadow: 1px 1px 0px #ffffff;
		text-align: left;
		font-style: normal;
		margin-left: 0.2rem;
	}
}

.title-help-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 0.16rem;
	height: 0.16rem;
	border: 1px solid #2f6bef;
	border-radius: 50%;
	background: #eaf3ff;
	color: #2f6bef;
	text-shadow: none;
	cursor: help;
	flex-shrink: 0;
	transition: all 0.2s;
	box-sizing: border-box;

	&::before {
		content: '?';
		display: block;
		width: 100%;
		height: 100%;
		font-size: 0.12rem;
		font-weight: 700;
		line-height: 0.14rem;
		text-align: center;
	}

	&:hover {
		background: #2f6bef;
		color: #fff;
		box-shadow: 0 0 0.04rem rgba(47, 107, 239, 0.4);
	}
}

.view-more {
	font-size: 0.12rem;
	color: #2f6bef;
	cursor: pointer;

	img {
		height: 0.24rem;
	}

	&:hover {
		color: #267efb;
	}
}
.box-flex {
	display: flex;
	flex-direction: column;
	align-items: inherit;
	flex: 1;
	min-height: 0;
}

.investment-intent,
.local-connection,
.chain-recommendation {
	margin-bottom: 0.04rem;
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.chain-recommendation {
	margin-bottom: 0;
}

.enterprise-list {
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	min-width: 0;

	&::-webkit-scrollbar {
		width: 0.04rem;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(47, 107, 239, 0.2);
		border-radius: 0.02rem;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}
}

.module-empty {
	flex: 1;
	min-height: 1.2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #4e5969;
}

.module-empty-image {
	width: 1.35rem;
	height: auto;
	display: block;
}

.module-empty-text {
	margin-top: 0.08rem;
	font-size: 0.15rem;
	font-weight: 600;
	line-height: 0.22rem;
}

.enterprise-card {
	padding: 0.08rem 0.12rem;
	background: #fff;
	border-radius: 8px;
	border: 1px solid #789ffe;
	flex-shrink: 0;
	box-sizing: border-box;
	overflow: hidden;
	// cursor: pointer;
}

.enterprise-card1 {
	padding: 0.07rem 0.14rem;
	background: #fff;
	border-radius: 8px;
	border: 1px solid #789ffe;
	flex-shrink: 0;
	box-sizing: border-box;
	overflow: hidden;
	// cursor: pointer;
}

.city-wide-enterprise-card,
.supplier-enterprise-card,
.chain-enterprise-card {
	cursor: pointer;
}

.investment-enterprise-card.is-tooltip-card {
	cursor: pointer;
}

.investment-enterprise-card {
	position: relative;
	height: 0.66rem;
	// padding-right: 0.58rem;
	overflow: hidden;
}

.local-connection .enterprise-card {
	height: 0.56rem;
}

.chain-enterprise-card {
	height: 0.62rem;
}

.investment-high-tag {
	position: absolute;
	top: -1px;
	right: -1px;
	width: 0.43rem;
	height: 0.27rem;
	pointer-events: none;
}

.enterprise-name {
	display: block;
	flex: 1 1 0;
	min-width: 0;
	font-size: 0.16rem;
	line-height: 0.22rem;
	color: #202741;
	font-weight: bold;
	margin-bottom: 0.04rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.enterprise-title-row {
	display: flex;
	align-items: center;
	gap: 0;
	min-width: 0;
	margin-bottom: 0.04rem;
}

.enterprise-title-row .enterprise-name {
	flex: 0 0 60%;
	max-width: 60%;
	margin-bottom: 0;
}

.title-cooperation-info {
	display: flex;
	align-items: center;
	flex: 0 0 40%;
	max-width: 40%;
	min-width: 0;
	gap: 0.04rem;
	font-size: 0.14rem;
	line-height: 0.22rem;
	color: #8897b7;
	padding-left: 0.08rem;
	box-sizing: border-box;
	white-space: nowrap;
}

.title-cooperation-item {
	display: flex;
	align-items: center;
	flex: 1 1 0;
	min-width: 0;
}

.amount-label {
	flex-shrink: 0;
	color: #8897b7;
}

.title-cooperation-value,
.register-amount-value {
	display: block;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.enterprise-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.08rem;
	font-size: 0.14rem;
	line-height: 0.2rem;
	color: #8897b7;
	margin-bottom: 0.04rem;
	min-width: 0;
}

.investment-industry-meta {
	display: flex;
	align-items: center;
	width: 60%;
	min-width: 60%;
	flex: 0 0 60%;
	max-width: 60%;
	box-sizing: border-box;
}

.investment-industry-value {
	display: block;
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	width: auto;
	white-space: nowrap;
}

.local-enterprise-meta {
	gap: 0.08rem;
	min-width: 0;
}

.local-connection .local-enterprise-meta {
	margin-bottom: 0;
}

.local-amount-meta {
	display: flex;
	align-items: center;
	min-width: 0;
	width: 60%;
}

.local-amount-value {
	display: block;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.local-count-meta {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
}

.local-count-value {
	display: block;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.local-industry-meta {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
}

.local-connection .local-industry-meta {
	width: 60%;
	min-width: 60%;
	flex: 0 0 60%;
	max-width: 60%;
	box-sizing: border-box;
}

.local-connection .enterprise-address {
	flex: 1 1 0;
}

.industry-meta {
	display: flex;
	align-items: center;
	flex: 1 1 0;
	min-width: 0;
}

.industry-label {
	flex-shrink: 0;
}

.industry-value {
	display: block;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.high-prob {
	color: #165dff;
	font-weight: bold;
}

.enterprise-reason,
.enterprise-address {
	display: flex;
	align-items: center;
	flex: 1 1 0;
	font-size: 0.14rem;
	line-height: 0.2rem;
	color: #8897b7;
	min-width: 0;
	overflow: hidden;
}

.supplier-enterprise-meta,
.supplier-enterprise-address {
	gap: 0.08rem;
	min-width: 0;
}

.supplier-enterprise-meta .local-amount-meta,
.supplier-enterprise-address .local-address-meta {
	width: 60%;
}

.local-address-meta {
	display: flex;
	align-items: center;
	min-width: 0;
}

.address-value {
	display: block;
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.supplier-address-industry-meta {
	flex: 1;
}

.reason-label,
.address-label {
	color: #8897b7;
	flex-shrink: 0;
}

.target-tooltip-wrap {
	display: block;
	flex: 1;
	min-width: 0;
}

.reason-tag {
	display: block;
	width: 100%;
	box-sizing: border-box;
	padding: 0.02rem 0.02rem;
	background: rgba(47, 107, 239, 0.08);
	color: #2f6bef;
	border-radius: 0.06rem;
	min-width: 0;
	font-size: 0.14rem;
	line-height: 0.2rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.filter-tags {
	display: flex;
	gap: 0.06rem;
	margin-bottom: 0.08rem;
	flex-shrink: 0;
}

.filter-tag {
	:deep(.el-radio-button__inner) {
		padding: 0.05rem 0.12rem;
		font-size: 0.12rem;
		color: #4e5969;
		background: #fff;
		border: 1px solid #e0e8ff;
		border-radius: 0.12rem;
		box-shadow: 0px 0px 4px 0px rgba(162, 169, 213, 0.66);
		transition: all 0.3s;
	}

	&:hover :deep(.el-radio-button__inner) {
		color: #2f6bef;
		border-color: #2f6bef;
	}

	&.active :deep(.el-radio-button__inner) {
		color: #2f6bef;
		background: #e8eeff;
		border-color: #2f6bef;
		box-shadow: 0px 0px 4px 0px rgba(162, 169, 213, 0.66);
	}
}

.chain-tabs {
	display: flex;
	gap: 0.03rem;
	margin-bottom: 0.06rem;
	flex-shrink: 0;
}

.chain-tab {
	:deep(.el-radio-button__inner) {
		min-width: 1rem;
		padding: 0.04rem 0.14rem;
		font-size: 0.14rem;
		color: #4e5969;
		background: #fff;
		border: 1px solid #e0e8ff;
		border-radius: 0.12rem;
		box-shadow: 0px 0px 4px 0px rgba(162, 169, 213, 0.66);
		transition: all 0.3s;
	}

	&:hover :deep(.el-radio-button__inner) {
		color: #2f6bef;
		border-color: #2f6bef;
	}

	&.active :deep(.el-radio-button__inner) {
		color: #2f6bef;
		border-color: #2f6bef;
		background: #e8eeff;
		font-weight: bold;
		box-shadow: 0px 0px 4px 0px rgba(162, 169, 213, 0.66);
	}
}
.reason-highlight {
	display: block;
	width: 100%;
	box-sizing: border-box;
	min-width: 0;
	// font-weight: bold;
	background: rgba(47, 107, 239, 0.08);
	color: #2f6bef;
	border-radius: 0.06rem;
	padding: 0 0.1rem;
	font-size: 0.14rem;
	line-height: 0.2rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.chain-reason-meta {
	display: flex;
	align-items: center;
	width: 60%;
	min-width: 60%;
	flex: 0 0 60%;
	max-width: 60%;
	box-sizing: border-box;
}
</style>
