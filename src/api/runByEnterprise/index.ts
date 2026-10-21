/*
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-09-15 17:26:27
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-24 10:51:36
 */
import { method, http, prefix } from '@/api/http';

export const chinaSearch = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/china/enterprise/search`, more);

export const worldSearch = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/global/enterprise/search`, more);

export const queryList = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-invest-activity/queryList`, more);

// 招商动态列表
export const getInvestDynamicsByLeaderType = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/investDynamic/getInvestDynamicsByLeaderType`, params);

// .获取最近搜索的的企业
export const getRecentSearch = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/nearest/search`, params);

// 获取热门搜索的的企业
export const getHotSearch = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/hop/search`, params);

// 获取推荐企业
export const getRecommendEnterprise = <T>(params: Object = {}) =>
		http<T>(method.GET, `${prefix}/enterprise/search/recommend`, params);

// 根据参数查询企业
export const queryEnterpriseByParams = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/enterprise/search/enterpriseInfo`, more);

	//  根据参数查询企业（开放）-- 不需要做权限隔离
export const queryPublicEnterpriseByParams = <T>(more: Object = {}) =>
http<T>(method.POST, `${prefix}/public/enterprise/search/enterpriseInfo`, more);


// 企业性质下拉
export const getCompanyQuality = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/company/quality`, params);

// 获取是否有策划下拉数据
export const getHasPlanning = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/has/plan`, params);

// 获取企业分类
export const getIndustryCategory = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/industry`, params);

// 获取招商成熟度下拉
export const getMaturity = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/maturity`, params);

// 获取12218产业类型信息下拉
export const getIndustryTypeList = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/targetEnt/getIndustryTypeList`, params);


// 获取区域信息
export const getRegion = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/province/dict`, params);

// 获取单位信息
export const getUnit = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/query/ent/unit`, params);

// 获取研判分析-建议拜访企业
export const getVisitEnterprise = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/keyEnterprise/querySuggestVisit`, params);

// 目标企业分析-概况统计
export const getTargetEntOverview = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/ent/stat/targetEntOverview`, params);

// 招商任务清单 问题清单
export const getInvestIssueTitle = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-project-board/getInvestIssueTitle`, params);

// 目标企业概况
export const targetCompanyOverview = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-project-board/targetCompanyOverview`, params);


// 民企|央企|外企接口
export const getCompanyTable = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/ent/type`, params);

// 企业跑 - 招商对接 - 领导对接提
export const getLeaderContact = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/businessGz/enterprise/detail/business/leader`, params);

	// 企业跑 - 招商对接 - 领导对接提
export const getLeaderPlans = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/businessGz/enterprise/detail/business/leaderPlans`, params);


// 企业跑 - 招商分工饼图数据
export const getDivisionPie = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/businessGz/enterprise/detail/follow/dept/pie`, more);

// 企业跑 - 跟进情况柱状图数据
export const getFollowBar = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/businessGz/enterprise/detail/follow/dept/cloumn`, more);

export const getAreaSelectAll = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/targetEnt/getAreaSelect/all`, params);

// 企业跑 - 目标企业总数
export const targetFollowStatList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/rate-list`, { params });

// 企业跑 - 已对接数
export const connectedRateList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/connected-rate-list`, { params });

// 企业跑 - 走访次数
export const dockingList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/docking-list`, { params });

// 企业地图统计
export const getEnterpriseMapCount = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/enterprise/search/enterpriseMapCount`, {params});

// 企业跑 - 全部已走访统计已对接数
export const connectedListType = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/business/list/type`, { params });

// 根据调度类型查询招商调度计划列表
export const getSchedulePlanList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/biz-schedule-plan/list`, params );
