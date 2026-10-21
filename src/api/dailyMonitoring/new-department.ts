import { method, http, prefix } from '@/api/http';

// 重点关注指标、先行指标
export const deptStatisticResult = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/getDeptStatisticResult`, more);

// 重点企业预警类型分析
export const warn = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/warn`, more);

// 重点企业以及产业链
export const keyPro = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/getKeyPro`, more);

// 重点项目(其他部门)
export const queryIndexProjectCount = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/indexProject/queryIndexProjectCount`, more);

// 重点项目(发改局)
export const queryByHairDeptPageSubjectCount = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/focus/queryByHairDeptPageSubjectCount`, more);

// 指标下拉框
export const queryDeptIndexList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/queryDeptIndexList`, more);

// 财政局-各行业累计月预测工资总额情况
export const queryIndustrySalaryList = <T>(more: Object = {}) =>
	http<T>(method.POST, `${prefix}/departHome/queryIndustrySalaryList`, more);

// 财政局-预警详情
export const riskDetail = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/getRiskDetail`, more);

// 财政局-各单位工资预警情况
export const regionUnitSalarySummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/getRegionUnitSalarySummary`, more);

// 暖企专员
export const nqProblem = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/nqProblem`, more);

// 发改局-项目异动情况排名
export const abnormalInfo = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/abnormalInfo`, more);

// 农业局-农业主要品类总产值分析
export const queryAgricultureOutputChart = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/departHome/queryAgricultureOutputChart`, more);
