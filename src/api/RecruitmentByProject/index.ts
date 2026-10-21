import { method, http, prefix } from '@/api/http';
/*
 根据产业类别查询不同产业列表 category: 1:15个战略性产业集群，2:6个未来产业，3:8个现代服务业
头部三个选择器 
*/
export const queryIndustryListByCategory = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-invest-plan/queryIndustryListByCategory?category=${params}`, {});

  /*
根据产业编码查询策划项目列表 industryCode-产业编码，projectName-策划项目名称（模糊查找）
*/
export const queryProjectListByIndustryCode = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-invest-plan/queryProjectListByIndustryCode`, {params});

 // =============右边菜单==============
 /*
 招商项目策划概况 category: 1-主抓（查询全市数据无需传参）
*/
export const queryInvestProjectStatic = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-invest-plan/queryInvestProjectStatic?category=${params}`, {});

// echarts
export const queryStatisticsByIndustry = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-invest-plan/queryStatisticsByIndustry`, {params});

// 优秀策划项目案例查询
export const queryOutstandingProjectList = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-invest-plan/queryOutstandingProjectList`, {params});
// 优秀策划项目案例详情页
export const queryProjectInfoById = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-invest-plan/queryProjectInfoById`, {params});




