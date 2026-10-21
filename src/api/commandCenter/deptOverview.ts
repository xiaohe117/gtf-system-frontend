/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2026-05-12 14:08:32
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-14 16:51:26
 */
import { method, http, prefix,download } from '@/api/http';

// 获取卡片信息
export const getListBusinessCard = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/investment-promotion/summary/listBusinessCard`, {
		data: params,
	});

// 招商企业分页接口
export const getEntList = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/investment-promotion/summary/pageSsgq`, { data: params });

// 获取招商类别下拉
export const getEntTags = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/investment-promotion/summary/tagSelect`, { params });

// 获取部门列表
export const queryRegionDeptList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/queryRegionDeptList`, { params });

// 获取日期下拉数据
export const queryDateDropDown = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/dateDropDown`, { params });

// 指标-根据部门id获取指标列表
export const queryIndicatorByDeptId = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/queryIndicatorByDeptId`, { params });

// 指标-指标详情
export const queryIndicatorDetail = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/indicator-detail`, { params });

// 指标-指标趋势
export const queryIndicatorTrend = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/indicator-trend`, { params });

// 市属国企完成度排行
export const getCityGovCompletionRank = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/getCityGovernmentCompletionRank`, { params });

// 分局统计分析
export const queryStatisticalAnalysis = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/queryStatisticalAnalysis`, { params });

// 获取卡片信息-临时需求
export const queryListBusinessCardTemp = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/investment-promotion/summary/listBusinessCard/temp`, { data });

// 按年月查询六个一批汇总表数据
export const querySixBatchSummaryByYearMonth = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/projectClue/querySixBatchSummaryByYearMonth`, { data });

// 获取六个一批汇总表最新有数据年月
export const getLatestSixBatchSummaryYearMonth = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/projectClue/getLatestSixBatchSummaryYearMonth`, { data });

// 走访-全市大走访大对接情况表
export const queryTargetFollowCity = <T>(params: Object = {}) => new Promise((resolve, reject) => {
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/city/list`, { params }).then(res => {
		resolve({ data: { rows: res?.data  } })
	}).catch(err => { reject(err) })
})
// 获取卡片信息--投发委
export const queryOneDeptOneCard = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/head-cards`, { data });

// 获取卡片信息--投发委
export const queryTimeOptions = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/oneDeptOneCard/time-options`, { params });

// 查询线索明细分页
export const queryClueDetailPage = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/clue/detail/page`, { data });

// 对接记录统计--线索详情列表
export const clueFollowStatPage = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/clue`, { params });

// 查询线索统计表
export const queryClueTable = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/clue/table`, { data });

// 查询场景明细分页
export const querySceneDetailPage = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/scene/detail/page`, { data });

// 查询场景统计表
export const querySceneTable = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/scene/table`, { data });

// 查询活动明细分页
export const queryActivityDetailPage = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/activity/detail/page`, { data });

// 查询活动统计表
export const queryActivityTable = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/activity/table`, { data });

// 企业明细--全市目标企业分页列表
export const cityWideTargetEntList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/targetEnt/cityWideTargetEntList`, { data });

// 项目明细--对接记录项目详情列表
export const projectDetailPage = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-ent-connection/target-follow-stat/project`, { params });

// 企业招商活动,跳转到齐明的活动详情页
export const queryActivityUrl = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/outside/queryActivityUrl`, { data });

// 查询菜单全量信息（含 deptId 可选参数，不传默认查当前用户部门）
export const getOneDeptOneMenuList = <T>(params: { deptCode?: string } = {}) =>
	http<T>(method.GET, `${prefix}/gtf-one-dept-one-menu/list`, { params });

// 查询当前部门关联菜单（含启用状态）
export const getOneDeptOneMenuRelList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-one-dept-one-menu/rel/list`, { params });

// 批量保存部门菜单关联
export const saveOneDeptOneMenuRelBatch = <T>(data: { deptCode?: string; menuIds: number[] }) =>
	http<T>(method.POST, `${prefix}/gtf-one-dept-one-menu/rel/save-batch`, { data });

// 查询线索及项目统计表
export const queryProjectTable = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/projectProgress/table`, { data });

// 导出场景统计表
export const exportSceneTable = (data: Object, fileName: string) =>
	download({ url: `${prefix}/oneDeptOneCard/scene/table/export`, data, fileName });

// 项目推进-项目/线索明细-项目详情列表
export const projectProgressDetailPage = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/oneDeptOneCard/projectProgress/detail/page`, { data });
