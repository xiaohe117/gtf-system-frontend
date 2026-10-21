import { method, http, prefix } from '@/api/http';

// 根据产业编码查询六要素列表
export const industryTypeSixElementList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/industry-six-element/list`, { data });
// 十大行动
export const industryEffectList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/industry-effect/list`, { params });
// 重点企业- 四个 Tab 企业集合
export const keyEnterpriseTabList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/industry-key-enterprise/tab-list`, { data });
// 查询产业类型列表
export const industryTypeList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/industry-key-enterprise/industry-type/list`, { data });
// 分析建议- 查询产业分析建议列表
export const analySuggestList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/industry-key-enterprise/analy-suggest/list`, {
		data,
	});
// 分析建议- 查询产业分析建议材料列表
export const analySuggestMaterialList = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/industry-key-enterprise/material/list`, {
		data,
	});
// 招商赋能工具-获取token
export const getQxbToken = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/industry-effect/getQxbToken`, { params });
// 获取已启用的地区列表
export const getCustomizeRegionList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/industryBoard/customize/region`, { params });
// 走进广州-获取用户定制的菜单列表
export const getCustomizeMenuList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/industryBoard/customize/menu`, { params });
// 走进广州-获取用户定制的硬核实力列表
export const getHardStrengthList = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/industryBoard/hard-strength`, { params });

// 走进广州-获取综合投资优势详情
export const getComprehensiveStrengthDetail = <T>(id: string) =>
	http<T>(method.GET, `${prefix}/industryBoard/comprehensive/detail/${id}`, { params: {} });
// 走进广州-保存用户定制的菜单
export const saveCustomize = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/industryBoard/customize/save`, {
		data,
	});
// 走进广州-退出定制
export const resetCustomize = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/industryBoard/customize/reset`, {
		data,
	});
// 走进广州-导出招商报告(Word,直返 .docx 流)
export const exportReport = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/industry-report/export`, { params });
