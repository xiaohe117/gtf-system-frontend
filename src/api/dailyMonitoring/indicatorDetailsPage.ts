import axios from 'axios';
import * as XLSX from 'xlsx';
import { method, http, prefix } from '@/api/http';

// 导入本地 JSON mock 数据
import queryBaseInfoData from '@/views/EfficiencyCenter/json/queryBaseInfo.json';
import queryTrendListData from '@/views/EfficiencyCenter/json/queryTrendList.json';
import queryLightingInfoData from '@/views/EfficiencyCenter/json/queryLightingInfo.json';

// Mock 版本接口 - 返回本地 JSON 数据
export const queryBaseInfoMock = () => Promise.resolve(queryBaseInfoData);
export const queryTrendListMock = () => Promise.resolve(queryTrendListData);
export const queryLightingInfoMock  = () => Promise.resolve(queryLightingInfoData);

// 获取指标基本信息接口
export const queryBaseInfo = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryBaseInfo`, more);

// 指标个性化配置
export const queryIndicatorDropDown = <T>(params: Object = {}) =>
  http<T>(method.GET, `${prefix}/indicator-hub/indicator-dropDown`, { params });

// 指标个性化配置
export const indicatorDropDownByDept = <T>(params: Object = {}) =>
  http<T>(method.GET, `${prefix}/indicator-hub/indicator-indicatorDropDownByDept`, { params });


// 监测分析-亮灯监测接口
export const queryLightingInfo = <T>(more: Object = {}) =>
  	http<T>(method.GET, `${prefix}/indicator-hub/indicator-light-status`, more);

// 通用-获取时间周期接口
export const queryTimeScaleById = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryTimeScaleById`, more);

// 监测分析-运行趋势接口
export const queryTrendList = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indicator-hub/indicator-trend`, { params: more });

// 监测分析-镇街对标接口
export const queryStreetCompareList = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryStreetCompareList`, more);

// 监测分析-各区对标接口
export const queryTabData = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indicator-hub/tab-data-detail`, more);

// 穿透解析-细分门类产值接口
export const queryIndexXMList = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryIndexXMList`, more);

// 穿透解析-重点项目接口
export const queryIndexProjectList = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryIndexProjectList`, more);

// 穿透解析-重点产业获取时间周期接口
export const queryTimeScaleFromIndustry = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryTimeScaleFromIndustry`, more);

// 穿透解析-查询相关产业数据列表接口
export const queryIndexIndustryList = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryIndexIndustryList`, more);

// 穿透解析-查询是否有数据接口
export const isHasData = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/isHasData`, more);

// 支柱行业-列表汇总信息
export const queryIndustryListByIndexId = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexDetail/queryIndustryListByIndexId`, more);

// 农业主要品类总产值分析-列表
export const queryAgricultureOutputListByType = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/departHome/queryAgricultureOutputListByType`, {params});

// 支柱板块-获取固投相关层级指标
export const queryGtRelationIndexList = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/indexDetail/queryGtRelationIndexList`, {params});

// 获取重点项目分析表头
export const getIndexProjectAnalysisHeading = <T>(params: Object = {}) =>
http<T>(method.POST, `${prefix}/indexProject/getIndexProjectAnalysisHeading`, { data: params});

// 重点项目分析列表（分页）
export const queryIndexProjectAnalysis = <T>(params: Object = {}) =>
http<T>(method.POST, `${prefix}/indexProject/queryIndexProjectAnalysis`, { data: params});

// 重点项目分析计算总和
export const queryIndexProjectAnalysisSum = <T>(params: Object = {}) =>
http<T>(method.POST, `${prefix}/indexProject/queryIndexProjectAnalysisSum`, { data: params});

// 重点项目 - 下拉列表
export const getDropDrownList = <T>(params: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexProject/getDropDrownList`, {params});

// 重点企业 - 产值口径
export const getIndexCompanyOutputList = <T>(params: Object = {}) =>
  http<T>(method.POST, `${prefix}/indexEnterprise/index/page/types`, { data: params});

// 读取本地文件列表
export const getExcelData = async (url: string, sheetIndex: number = 0) => {
	console.log(url,sheetIndex);
	return new Promise<void>((resolve, reject) => {
		if (!url) reject();
		axios.get(url, { responseType: 'arraybuffer' }).then((res:any) => {
			const data = new Uint8Array(res.data);
			const workbook = XLSX.read(data, { type: 'array' });
			const firstSheetName = workbook.SheetNames[sheetIndex];
			const worksheet = workbook.Sheets[firstSheetName];
			// 转换为JSON
			const jsonData: any = XLSX.utils.sheet_to_json(worksheet);
			resolve(jsonData);
		});
	});
};
