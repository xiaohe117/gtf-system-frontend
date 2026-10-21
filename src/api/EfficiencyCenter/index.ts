import { method, http, prefix } from '@/api/http';

// 全市招商工作任务指标仪表盘 - 完整数据（包含顶部汇总和下方指标卡片列表）
export const monitoringData = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/monitoring-data`, { params });

// 高能级项目清单下拉框筛选
export const higScreeningList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/overall-situation/high-energy-level-project-screening-list`, {
		data,
	});

// 指标下拉选项
export const indicatorDropDown = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/indicatorDropDown`, { params });


// 统一入口：按 tabType 查询指标数据
export const tabData = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/tab-data`, { params });

export const dateDropDown = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/dateDropDown`, { params });

// 指标-指标详情
export const indicatorDetail = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/indicator-detail`, { params });

// 指标-相关指标
export const indicatorTree = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indicator-hub/indicator-tree`, { params });
// 查询走访明细列表
export const visitDetailList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/indicator-detail/visit-detail/list`, { data });

// 查询场景明细列表
export const sceneDetailList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/indicator-detail/scene-detail/list`, { data });

// 查询线索明细分页列表
export const clueDetailPage = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/indicator-detail/clue-detail/page`, { data });

// 获取所有企业标签（按类型分组，用于下拉选择框）
export const getTagsGroupeds = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/entTag/tags/grouped`, { params });
