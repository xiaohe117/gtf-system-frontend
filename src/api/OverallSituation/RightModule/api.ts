import { method, http, prefix } from '@/api/http';

/**
 *  当年值-招商任务完成率汇总
 */
export const queryAttractionCompletionRate = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterpriseStart/queryAttractionCompletionRate`, { params });

/**
 *  当年值-各区-六个一批相关情况
 */
export const querySixBatchInfoDistrictNow = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterpriseStart/querySixBatchInfoDistrictNow`, { params });

/**
 *  累计值-市直部门-六个一批相关情况
 */
export const querySixBatchInfoDept = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterpriseStart/querySixBatchInfoDept`, { params });

/**
 *  累计值-各区-六个一批相关情况
 */
export const querySixBatchInfoDistrict = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterpriseStart/querySixBatchInfoDistrict`, { params });

/**
 *  当年值-市直部门-产业招商项目汇总
 */
export const queryDepProjectSummary = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/enterpriseStart/queryDepProjectSummary`, { data });

/**
 *  累计值-各区-六个一批相关情况
 */
export const queryTenbillionCompletionRate = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterpriseStart/queryTenbillionCompletionRate`, { params });
// // 新引进高质量产业项目统计
// export const newHighQualityIndustryProjects = <T>(params: Object = {}) =>
// 	http<T>(method.GET, `${prefix}/overall-situation/new-high-quality-industry-projects`, {
// 		params,
// 	});

// // 预计投资总额
// export const enterpriseMonthlyStats = <T>(params: Object = {}) =>
// 	http<T>(method.GET, `${prefix}/enterprise-monthly-stats/data`, { params });

// // 高能级项目清单
// export const highProjectList = <T>(data: Object = {}) =>
// 	http<T>(method.POST, `${prefix}/overall-situation/high-energy-level-project-list`, { data });
