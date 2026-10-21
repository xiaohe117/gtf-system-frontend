import { method, http, prefix } from '@/api/http';

 

// 工作进展-关联项目-弹窗-模糊查询
export const queryProjectList = <T>(data: Object = {}) =>
http<T>(method.POST, `${prefix}/gtf-invest-project/queryProjectList`, { data });

// 工作进展-关联项目-弹窗-历史记录
export const queryProjectHistRecordList = <T>(data: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-invest-project/queryProjectHistRecordList`, { data });


// 工作进展-对接记录-弹窗-模糊查询
export const queryBasicIinfo = <T>(data: Object = {}) =>
http<T>(method.POST, `${prefix}/gtf-attract-investment-records/select/basic_info`, { data });

// 工作进展-对接记录-弹窗-历史记录
export const queryRecentSearchCompany = <T>(data: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-attract-investment-records/select/recent_search_company`, { data });
