import { method, http, prefix } from '@/api/http';
import type { RegionMapStatsResponse } from '@/views/newOverallSituation/DeptOverview/mapConfig';

export interface RegionMapStatsParams {
	/** 统计月份，如：2026年1-6月 */
	date?: string;
}

/**
 * 部门总览 - 地图区域走访/企业统计数据
 * @param params - 统计月份
 */
export const getRegionMapStats = (params: RegionMapStatsParams = {}) =>
	http<RegionMapStatsResponse>(method.GET, `${prefix}/pro-six-batch-summary/enterprise-visit-footprint`, {
		params,
	});


	// 项目地图-获取项目地图数据
export const projectMap = <T>(data: Object = {}) =>
	http<T>(method.POST, `/prod-api/pro/overview/dashboard`, {
		data,
		headers: {
			'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
			championsofttokenauthorization: `championsoft ${localStorage.getItem('Championsoft-Token') || ''}`,
		},
	});