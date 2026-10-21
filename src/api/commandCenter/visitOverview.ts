/*
 * @Descripttion: 走访统计接口
 * @Author:
 * @Date:
 */
import { method, http, prefix } from '@/api/http';

const reportBase = `${prefix}/gtf-ent-connection`;

// 部门/区走访统计
export const getDepartmentVisitStatistics = <T>(params: Record<string, unknown>) =>
	http<T>(method.GET, `${reportBase}/target-follow-stat/unit/list`, { params });

// 部门/区走访统计
export const getDepartmentTfwVisitStatistics = <T>(params: Record<string, unknown>) =>
	http<T>(method.GET, `${reportBase}/target-follow-stat/tfw/list`, { params });

// 走访统计数据更新时间
export const getVisitStatisticsUpdateTime = <T>(params: Record<string, unknown>) =>
	http<T>(method.GET, `${reportBase}/target-follow-stat/time`, { params });

// 获取统计筛选企业标签（用于跟进统计）
export const getTagOptionsForDocking = <T>(params: Record<string, unknown> = {}) =>
	http<T>(method.GET, `${reportBase}/target-follow-stat/leader/select`, { params });

// 查询全市分页列表数据（走访明细表使用tableColumnsCityConfig配置的表格）
export const cityRecordList = <T>(data: Record<string, unknown> = {}) =>
	http<T>(method.POST, `${prefix}/gtf-workFollowing-record/queryList`, { data });

// 议定事项｜企业诉求详情列表
export const getresolutionList = <T>(data: Record<string, unknown> = {}) =>
	http<T>(method.POST, `${prefix}/gtf-ent-connection/target-follow-stat/resolution/list`, {
		data,
	});
