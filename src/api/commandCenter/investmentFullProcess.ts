/*
 * @Descripttion: 招商全流程接口
 */
import { method, http, prefix } from '@/api/http';

// 谋划卡片-活动
export const queryFormulateMeeting = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/formulate/meeting`, { data });

// 谋划卡片-场景
export const queryFormulatePartiing = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/formulate/parting`, { data });

// 谋划卡片-情报
export const queryFormulateNews = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/formulate/news`, { data });

// 会谈卡片
export const queryTouchCard = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/touch`, { data });

// 线索卡片
export const queryClueCard = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/clue`, { data });

// 在谈项目卡片
export const queryTalkCard = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/talk`, { data });

// 投产(开票)卡片
export const queryProduceCard = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/produce`, { data });

// 开工卡片
export const queryStartCard = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/start`, { data });

// 注册(备案)卡片
export const queryRegCard = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/reg`, { data });

// 签约卡片
export const querySignCard = <T>(data: any = {}) =>
	http<T>(method.POST, `${prefix}/investment-flow/sign`, { data });

// 单位下拉树
export const queryDeptTree = <T>(params: any = {}) =>
	http<T>(method.GET, `${prefix}/investment-flow/queryDeptTree`, { params });
