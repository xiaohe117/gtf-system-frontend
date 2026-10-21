// /gtf-chart/getHeadquartersConnectionSummary
import { method, http, prefix } from '@/api/http';

// 查询产业链字典列表
export const getIndustryChainList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/intelligence-overview/industry-chain/list`, { params });

// 查询融资动态列表
export const getFinancingDynamicList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/financing-dynamic/list`, { data });

// 查询会展动态列表
export const getMeetingDynamicList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/meeting-dynamic/list`, { data });

// 查询政策动态列表
export const getPolicyDynamicList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/policy-dynamic/list`, { data });

// 查询强链推荐列表
export const getStrongChainList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/strong-chain/list`, { data });

// 查询补链推荐列表
export const getComplementChainList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/complement-chain/list`, { data });

// 查询延链推荐列表
export const getextendedChainList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/extended-chain/list`, { data });

// 查询招商推荐列表（目标企业推荐）
export const getinvestmentrecommendationList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/investment-recommendation/list`, {
		data,
	});

// 查询供应链详情列表
export const getsupplychaindetailList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/intelligence-overview/supply-chain-detail/list`, { params });

// 查询全市目标企业临时列表
export const getcityWideTargetEntTempList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/targetEntTemp/cityWideTargetEntTempList`, { data });

// 查询企业咨询
export const getsentimentdynamiclList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/sentiment-dynamic/list`, { data });

// 查询高层动态，企业会见：动态列表
export const getleadervisitList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/leader-visit/list`, { data });

// 启信宝-获取token
export const getQxbToken = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/industry-effect/getQxbToken`, { params });

// 查询热词列表
export const gethotWord = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/intelligence-overview/hot-word/list`, { params });

// 数据更新时间
export const getlatestupdateTime = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/intelligence-overview/crawl-run-history/latest-update-time`, {
		params,
	});

// 查询领导走访动态列表(广东)
export const getleadervisitGDList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/intelligence-overview/leader-visit/list/gd`, { params });

// 查询领导走访动态列表（广东省外）
export const getleadervisitNGDList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/intelligence-overview/leader-visit/list/not-gd`, { params });

// 查询启信宝舆情
export const getqxsentimentList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/qixin/sentiment/list`, { data });

// 查询启信宝企业监控推送记录
export const getqxmonitorList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/qixin/monitor/list`, { data });

// 聚合搜索首页查询
export const aggregateSearchApi = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/aggregate-search`, { data });

// 聚合搜索类目分页查询
export const categListApi = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/intelligence-overview/aggregate-search/category-list`, {
		data,
	});
