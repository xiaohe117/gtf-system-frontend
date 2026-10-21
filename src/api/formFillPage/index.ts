/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2025-09-07 16:37:44
 * @LastEditors: ycyun
 * @LastEditTime: 2025-09-08 16:02:37
 */
import { method, http, prefix } from '@/api/http';

// 在穗业务情况-录入
export const addBusinessSituation = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/input/businessSituation`, { data });

// 企业投资合作建议-录入
export const addInvestmentSuggestion = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/input/investmentSuggestion`, { data });

  // 工作进展-录入
export const insertWorkProgressInfo = <T>(data: Object = {}) =>
http<T>(method.POST, `${prefix}/gtf-project-progress/insertWorkProgressInfo`, { data });
// 反馈问题-录入
export const addProblemFeedback= <T>(data: Object = {}) =>
http<T>(method.POST, `${prefix}/input/problem`, { data });

// 反馈问题-责任单位
export const queryDeptOption = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-chart/dept`, {params});
// 新增招商对接记录
export const recordSave = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-attract-investment-records/save`, { data });

// 查询企业工作跟进记录填报暂存数据
export const queryWorkRecordTempInfo = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-workFollowing-record/queryWorkRecordTempInfo`, {params});

// 保存工作跟进记录填报数据
export const addWorkRecord = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-workFollowing-record/insertWorkRecordInfo`, { data });
