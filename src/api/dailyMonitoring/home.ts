import { method, http, prefix } from '@/api/http';


import queryIndicatorTimeScaleListData from '@/views/EfficiencyCenter/json/queryIndicatorTimeScaleList.json';

// Mock 版本接口 - 返回本地 JSON 数据
export const EcoOperationNormalMock = () => Promise.resolve(queryIndicatorTimeScaleListData);

// 首页-日期下拉框
export const queryDateDropDown = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/Lighting/queryDateDropDown`, more);

// 首页-日期下拉框
export const EcoOperationNormal = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/timeScale/queryIndicatorTimeScaleList`, more);
/* export const EcoOperationNormal = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/EcoOperationNormal/queryDropDown`, more); */

// 首页--首页上层卡片
export const queryEcoIndexInfo = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/EcoOperationNormal/queryEcoIndexInfo`, more);

// 首页--首页亮灯占比
export const queryLightingPercent = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/Lighting/queryLightingPercent`, more);

// 首页--首页总亮灯仪表盘
export const queryLightingDashboard = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/Lighting/queryLightingDashboard`, more);

// 首页--
export const queryLightProByObjType = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/EcoOperationNormal/queryLightProByObjType`, more);

// 首页--
export const queryRunway = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/EcoOperationNormal/queryRunway`, more);

// 首页--
export const queryHomeCountInfo = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/EcoOperationNormal/queryHomeCountInfo`, more);

// 首页--重点企业和产业链
export const companyPro = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/nqData/companyPro`, more);

export const getRunwayV2 = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/EcoOperationNormal/queryHDRunwayNew`, more);

// 先行指标
export const getLeadingIndexCountInfo = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/EcoOperationNormal/queryLeadingIndexCountInfo`, more);

// 刷新token
export const refreshTokenPerHour = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/timer/refreshTokenPerHour`, more);

// 产业统计周期接口-12835产业台账
export const queryIndustryTimeScaleList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/timeScale/queryIndustryTimeScaleList`, more);

// 统计局--首页亮灯占比
export const queryLightingPercentForStat = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/Lighting/queryLightingPercentForStat`, more);

// 统计局-首页总亮灯仪表盘
export const queryLightingDashboardForStat = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/Lighting/queryLightingDashboardForStat`, more);