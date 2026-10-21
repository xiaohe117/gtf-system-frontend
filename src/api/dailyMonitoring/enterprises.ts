/*
 * @Descripttion:
 * @Author: zhaochao
 * @Date: 2025-02-20 10:00:08
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-02-24 11:53:22
 */
import { method, http, prefix } from '@/api/http';

// 重点企业列表
export const getEnterprisePageListApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/page`, { params });

// 重点企业列表-指标
export const getIndexEnterpriseListApi = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/indexEnterprise/index/page`, { data:params });

// 重点企业-经营概况-查询统计图表年份
export const summaryYear = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getSummaryYear`, more);

// 重点企业-经营概况-企业产值统计图
export const outputValueSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getOutputValueSummary`, more);

// 重点企业-经营概况-纳税情况统计图
export const taxSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getTaxSummary`, more);

// 重点企业-经营概况-用电情况统计图
export const powerSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getPowerSummary`, more);

// 重点企业-经营概况-用水情况统计图
export const waterSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getWaterSummary`, more);

// 重点企业-经营概况-参保人员统计图
export const insuredSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getInsuredSummary`, more);
export const getEnterpriseOptionsApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getIndexEnterprisePageQuery`, { params });

export const getIndexEnterpriseOptionsApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/index/getIndexEnterprisePageQuery`, { params });


// 重点企业-获取指标-产值TOP10企业列表
export const getIndexEntRank = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getIndexEntRank`, more);

// 重点企业-获取指标-重点企业产值分布
export const getIndexEntAmountDistribute = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getIndexEntAmountDistribute`, more);

// 重点企业-异动预警年月下拉
export const getMetricsWarnMonthYear = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/warn/metricsWarnMonthYear`, more);

// 重点企业-异动预警列表
export const getMetricsWarnList = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/warn/metricsWarnList`, more);

// 重点企业-异动预警数据统计
export const getMetricsWarnCount = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/warn/metricsWarnCount`, more);

// 企业迁入迁出
export const getIndexMoveBasicInfo = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/entMove/getIndexMoveBasicInfo`, more);

// 暖企问题
export const getEnterpriseSummary = <T>(more: Object = {}) =>
	http<T>(method.GET, `${prefix}/hdoanqzyqyxx/getProblemSummary`, more);

// 查询诉求问题列表查询字典
export const getProblemPageQueryApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/nqData/queryProblemTypeTree`, { params });

// 暖企专员
export const getProblemPageListApi = <T>(params: Object = {}) =>
    http<T>(method.GET, `${prefix}/hdoanqzyqyxx/entProblemPage`, {params});

// 通过企业id查询重点企业画像详情
export const queryDetailByEntId = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/indexEnterprise/queryDetailByEntId`, more);

// 查询风险预警统计数
export const riskWarningSummary = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/riskWarning/riskWarningSummary`, more);

// 查询风险预警分页查询参数
export const getRiskWarningQuery = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/riskWarning/getRiskWarningQuery`, more);

// 根据风险分类查询风险类型
export const getRiskTypeByCategory = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/riskWarning/getRiskTypeByCategory`, more);

// 风险预警分页查询
export const riskWarningPage = <T>(more: Object = {}) =>
  http<T>(method.GET, `${prefix}/riskWarning/page`, more);

// 分析视图-获取指标-重点企业增速变化分布
export const getIndexEntRateChangeApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getIndexEntRateChange`, { params });

// 分析视图-获取指标-重点企业增速变化分布
export const getIndexEntAmountDistributeApi = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/indexEnterprise/getIndexEntAmountDistribute`, { params });
