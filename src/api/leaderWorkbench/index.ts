/*
 * @Descripttion: 市领导工作台接口
 */
import { method, http, prefix } from '@/api/http';

const base = `${prefix}/leader/workbench`;

/** 获取月份行程概览（顶部年月卡片状态） */
export const getMonthOverview = <T>(params:any) =>
	http<T>(method.GET, `${base}/visit/monthOverview`, { params });

/** 获取某月行程列表 */
export const getVisitList = <T>(data: {
	year: number;
	month: number;
	visitStatus?: string;
	keyword?: string;
	submitLeader?: string;
	pageNum: number;
	pageSize: number;
}) => http<T>(method.POST, `${base}/visit/list`, { data });

/** 获取市领导名单 */
export const getLeaderList = <T>() =>
	http<T>(method.GET, `${base}/visit/leaderOptions`,{});

/** 获取市领导名单（走访交办用） */
export const getVisitLeaderList = <T>() =>
	http<T>(method.GET, `${base}/visit/leaderList`,{});

/** 获取行程列表数量 */
export const getVisitCount = <T>(data: any) => http<T>(method.POST, `${base}/visit/count`, { data });

/** 获取走访情况统计报表 */
export const getVisitStatistics = <T>(leaderName?: string) =>
	http<T>(method.GET, `${base}/visit/statistics`, { params: { leaderName } });

/** 同意走访 */
export const agreeVisit = <T>(id: string) =>
	http<T>(method.POST, `${base}/visit/agree`, { data: { id } });

/** 暂缓走访 */
export const postponeVisit = <T>(data: any) =>
	http<T>(method.POST, `${base}/visit/postpone`, { data });

/** 交办其他市领导 */
export const assignVisit = <T>(data: any) =>
	http<T>(method.POST, `${base}/visit/assign`, { data });

/** 一键督办 */
export const superviseVisit = <T>(data: any) =>
	http<T>(method.POST, `${base}/visit/supervise`, { data });

/** 牵头任务明细（企业明细） */
export const getLeadTaskDetail = <T>(data: any) => http<T>(method.POST, `${base}/visit/leadTaskDetail`, { data });

/** 招商线索明细 */
export const getClueDetail = <T>(data: any) => http<T>(method.POST, `${base}/visit/clueDetail`, { data });

/** 项目明细 */
export const getProjectDetail = <T>(data: any) => http<T>(method.POST, `${base}/visit/projectDetail`, { data });

/** 议定事项明细 */
export const getMatterDetail = <T>(data: any) => http<T>(method.POST, `${base}/visit/matterDetail`, { data });