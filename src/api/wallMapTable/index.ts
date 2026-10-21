/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2025-08-15 15:36:09
 * @LastEditors: ycyun
 * @LastEditTime: 2025-12-31 16:04:07
 */
import { method, http, prefix } from '@/api/http';

export const queryList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-chart/chartV2`, { data });

export const queryDeptOption = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-chart/dept`, { params });

export const queryIndustryOption = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-chart/down`, { params });

export const queryTabCount = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-chart/tab`, { params });

// 获取下拉框数据
export const queryDropDown = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/entTag/queryDropDown`, { params });

// 获取投发委部门
export const getDeptTfwList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-user/queryDeptTfw`, more);

// 获取非投发委部门
export const getOtherDeptList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-user/queryOtherDept`, more);

// 获取整体对接概况数据
export const getOverallConnectionOverview = <T>(more: Object = {}) =>
		http<T>(method.GET, `${prefix}/gtf-chart/getOverallConnectionOverview`, more);

// 获取按责任单位划分的未对接央企数据
export const getUnconnectedByResponsibilityUnit = <T>(more: Object = {}) =>
		http<T>(method.GET, `${prefix}/gtf-chart/getUnconnectedByResponsibilityUnit`, more);
