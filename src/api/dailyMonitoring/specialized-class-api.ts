import { method, http, prefix } from '@/api/http';
// import axios from 'axios';
// import { authService } from '@/utils/auth';
// import { saveAs } from 'file-saver';

// 专班总览
export const queryClassLightingCount = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/Lighting/queryClassLightingCount`, more);

// 专班总览亮灯详情
export const queryClassLightingDetails = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/Lighting/queryClassLightingDetails`, more);

// 区工资总额概况
export const regionSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/summary/getRegionSummary`, more);

// 各单位工资预警情况
export const regionUnitSalarySummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/summary/getRegionUnitSalarySummary`, more);

// 预警详情
export const riskDetail = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/summary/getRiskDetail`, more);

// 工资专班总览-查询时间选择器
export const queryTimeScale = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/salary/summary/queryTimeScale`, { params });

// 工资专班总览-工资所属单位情况分析
export const queryRegionSalaryList = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/salary/summary/queryRegionSalaryList`, { params });

// 工资专班总览-获取各行业累计月预测工资总额情况
export const queryIndustrySalaryList = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/salary/summary/queryIndustrySalaryList`, { params });

// 单位-顶部统计查询
export const getScDwTopSummaryApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/institution/getTopSummary`, { params });

// 单位分页查询
export const getDwPageApi = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/salary/institution/page`, { data: params });

// 获取单位明细数据
export const getInstDetailSummaryPageApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/institution/getInstDetailSummaryPage`, { params });

// 获取单位明细数据
export const getSCDatetimeApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/institution/getDatetime`, { params });

// 获取单位明细数据
export const getDwdetailApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/institution/detail`, { params });

// 获取单位明细数据
export const getInstSalaryPageQueryApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/institution/getInstSalaryPageQuery`, { params });

// 获取行业分页
export const getIndustryPageApi = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/salary/industry/page`, { data });

// 获取行业分页
export const getLocationPageApi = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/salary/location/page`, { data });

// 获取单位季度数据
export const getDwQuarterPageApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/institution/detail/quarterPage`, { params });

// 获取单位月度数据
export const getDwMonthPageApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/institution/detail/monthPage`, { params });

// 获取行业季度数据
export const getIndustryQuarterPageApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/industry/detail/quarterPage`, { params });

// 获取行业月度数据
export const getIndustryMonthPageApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/industry/detail/monthPage`, { params });

// 获取季度数据
export const getLocationQuarterPageApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/location/detail/quarterPage`, { params });

// 获取行业月度数据
export const getLocationMonthPageApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/salary/location/detail/monthPage`, { params });

/*
export const exportFileByALink = (urlz: string, fileInstName?: string) => {
	const token = authService.getToken();
	let authorization = '';
	if (token) {
		authorization = 'Bearer ' + token;
	}
	return new Promise<void>((resolve, reject) => {
		axios({
			method: 'get',
			url: `${prefix}${urlz}`,
			responseType: 'blob',
			headers: { Authorization: authorization },
		})
			.then(async (res) => {
				const blob = new Blob([res.data]);
				let filename = fileInstName; // 默认文件名
				const contentDisposition = res.headers['content-disposition'];
				if (contentDisposition && contentDisposition.includes('filename=')) {
					const match = /filename=(.*?)(;|$)/.exec(contentDisposition);
					if (match && match[1]) {
						filename = decodeURIComponent(match[1].trim().replace(/"/g, ''));
					}
				}
				saveAs(blob, filename);
				resolve();
			})
			.catch(() => {
				reject();
			});
	});
};
*/
