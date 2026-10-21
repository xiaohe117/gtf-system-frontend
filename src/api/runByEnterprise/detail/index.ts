import { method, http, prefix } from '@/api/http';

// 查询目标企业基础表
export const queryEntDetail = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-info/queryEntDetail`, more);

// 查询投资合作建议列表
export const investAdviceList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-project-progress/getInvestAdviceList`, more);

// 查询招商对接情况列表
export const investContactLogList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-project-progress/getInvestContactLogList`, more);

// 查询招商工作进展列表
export const workProgressList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-project-progress/getWorkProgressList`, more);

// 查询招商问题反馈列表
export const investIssueList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-project-progress/getInvestIssueList`, more);

// 查询企业关联关系
export const entRelation = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getEntRelation`, more);

// 获取企业风险饼图
export const riskSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getRiskSummary`, more);

// 查询风险列表
export const riskArray = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getRiskArray`, more);

// 查询风险详情信息
export const riskDetail = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getRiskDetail`, more);

// 根据信用代码查询在穗情况
export const guangzhouBusiness = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getGuangzhouBusiness`, more);

// 企业经营-查询企业经营头部统计数据
export const topStatistic = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getTopStatistic`, more);

// 企业经营-查询购地列表
export const landTransactionList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getLandTransactionList`, more);

// 企业经营-查询企业融资列表
export const investmentList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getInvestmentList`, more);

// 企业经营-查询企业供应商列表
export const supplierCooperationList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getSupplierCooperationList`, more);

// 企业经营-查询主要客户列表
export const customerCooperationList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-intelligence/getCustomerCooperationList`, more);

// 企业资讯
export const newsByEnterpriseId = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/news/getNewsByEnterpriseId`, more);

// 查询招商项目列表
export const projectQueryList = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-invest-project/queryList`, more);

// 查询招商活动列表
export const activityQueryList = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-invest-activity/queryList`, more);
