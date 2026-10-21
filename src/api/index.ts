import { method, http, prefix } from '@/api/http';

export const test1 = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/index/test1`, more);

export const test2 = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/index/test2`, more);

// 重点榜单

// 综合榜单统计
export const queryRankStatistics = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/keyEnterprise/comprehensiveStat`, { params });

// 获取榜单企业
export const queryKeyEnterpriseList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/keyEnterprise/list`, { params });

// 获取最近领导拜访企业

export const queryVisitEnterpriseList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/keyEnterprise/queryLastInvestDyn`, { params });

// 最近热点接洽企业
export const queryPlanEnterpriseList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/keyEnterprise/queryLastInvestPlan`, { params });

// 目标企业分析

// 企业区域统计总数
export const queryRegionTotal = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/stat/queryRegionStaTotal`, { params });

// 企业区域统计
export const queryRegionCount = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/stat/regionStat`, { params });

// 企业性质统计
export const queryNatureCount = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/stat/entTypeStat`, { params });

// 所属产业类别统计
export const queryIndustryCategory = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/stat/industryCategoryStat`, { params });

// 所属产业统计
export const queryIndustryCount = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/stat/industryStat`, { params });

// 分页查询产业类型信息表
export const queryIndustryList = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-industry-type-info/list`, { data:params });
// 新增活动填报工作进展
export const addFillPage = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-activity-work-records/save`, { data:params });

// 重点目标企业
export const queryKeyTargetList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-chart/index/stat`, { data:params });

// 指标下拉选项
export const queryMetricOptions = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/indicatorDropDown`, { params });

// 指标数据（按 tabType 查询）
export const queryTabData = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/tab-data`, { params });
