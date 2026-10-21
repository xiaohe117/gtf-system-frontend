import { method, http, prefix } from '@/api/http';

// 全市招商任务情况
export const newSigningIndustryProjects = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/overall-situation/new-signing-industry-projects`, { params });

// 新引进高质量产业项目统计
export const newHighQualityIndustryProjects = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/overall-situation/new-high-quality-industry-projects`, {
		params,
	});

// 预计投资总额
export const enterpriseMonthlyStats = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise-quarter-stats/data`, { params });

// "六个一批"相关情况
export const querySixBatchInfoDistrict = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterpriseStart/querySixBatchInfoDistrict`, { params });

// 高能级项目清单
export const highProjectList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/overall-situation/high-energy-level-project-list`, { data });

// 高能级项目清单下拉框筛选
export const higScreeningList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/overall-situation/high-energy-level-project-screening-list`, {
		data,
	});
// 日期下拉框筛选
export const dateSelectOptions = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterpriseStart/queryDate`, { params });

// 获取项目总览顶部汇总卡片数据
export const projectOverview = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/project-overview`, { params });

// 项目总览-获取六批项目汇总数据
export const proSixBatchSummary = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/six-batch-summary`, { params });

// 线索总览-获取项目来源统计数据
export const clueSourceStats = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/project-source-stats`, { params });

// 场景总览-获取场景聚合行业数据
export const sceneIndustry = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/scene-aggregation-industry`, { params });

// 活动总览-获取活动总览数据
export const getactivityoverviewList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/activity-overview`, { params });

// 大走访-获取走访转化成果数据
export const getvisittransformationList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/visit-transformation`, { params });

// 走访-全市大走访大对接情况表
export const queryTargetFollowCity = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/city/list`, { params });

// 获取最新统计时间
export const getLatestStatTime = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/latest-stat-time`, { params });

// 获取项目总览：亿元加项目
export const getinvestmentscaleoverview = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/investment-scale-overview`, { params });

// 新 招商场景-获取场景发布统计数据
export const getScenePublishStats = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/pro-six-batch-summary/getScenePublishStats`, { params });
