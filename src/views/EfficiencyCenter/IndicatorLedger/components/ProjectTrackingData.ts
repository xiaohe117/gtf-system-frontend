// 项目跟进表数据配置
import { getSize } from '@/utils'

export interface LedgerParams {
	pageNum: number
	pageSize: number
	indicatorModule?: string
	date?: string
}

export interface LedgerRow {
	id: number
	serialNumber: number
	industryBranch: string
	indicatorName: string
	subCategory: string
	measurementUnit: string
	monthComplete: number
	monthOnMonth: number
	totalDone: number
}

export interface LedgerResponse {
	code: number
	data: { list: LedgerRow[]; total: number }
	message: string
}

const mockData: LedgerRow[] = [
	{ id: 1, serialNumber: 1, industryBranch: '新一代信息技术', indicatorName: '新签约项目数', subCategory: '制造业', measurementUnit: '个', monthComplete: 12, monthOnMonth: 8.5, totalDone: 45 },
	{ id: 2, serialNumber: 2, industryBranch: '生物医药', indicatorName: '落地项目数', subCategory: '服务业', measurementUnit: '个', monthComplete: 8, monthOnMonth: 12.3, totalDone: 32 },
	{ id: 3, serialNumber: 3, industryBranch: '新材料', indicatorName: '开工项目数', subCategory: '房地产', measurementUnit: '个', monthComplete: 15, monthOnMonth: 5.2, totalDone: 58 },
	{ id: 4, serialNumber: 4, industryBranch: '新能源', indicatorName: '投产项目数', subCategory: '基础设施', measurementUnit: '个', monthComplete: 6, monthOnMonth: -3.2, totalDone: 24 },
	{ id: 5, serialNumber: 5, industryBranch: '数字经济', indicatorName: '续建项目数', subCategory: '民生工程', measurementUnit: '个', monthComplete: 10, monthOnMonth: 6.8, totalDone: 38 },
]

export const getLedgerList = (params: LedgerParams): Promise<LedgerResponse> =>
	new Promise((resolve) => {
		setTimeout(() => {
			const start = (params.pageNum - 1) * params.pageSize
			resolve({ code: 200, data: { list: mockData.slice(start, start + params.pageSize), total: mockData.length }, message: 'success' })
		}, 300)
	})

export const columns = [
	{ label: '序号', prop: 'serialNumber', width: getSize(40), align: 'left', headerAlign: 'center', type: 'slot', slotName: 'customIndex' },
	{ label: '产业分局', prop: 'groupName', minWidth: getSize(160), align: 'left', headerAlign: 'center', /* type: 'slot', slotName: 'industryBranchSlot' */ },
	{ label: '指标名称', prop: 'indicatorName', width: getSize(180), align: 'left', headerAlign: 'center', type: 'slot', slotName: 'searchIndicatorName' },
	{ label: '计量单位', prop: 'unit', width: getSize(100), align: 'left', headerAlign: 'center' },
	{ label: '当月数', align: 'left', headerAlign: 'center', children: [
		{ label: '完成数', prop: 'monthDone', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '个' },
		{ label: '环比', prop: 'monthOnMonth', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'rate', unit: '%' }
	] },
	{ label: '累计完成数', prop: 'totalDone', minWidth: getSize(140), align: 'left', headerAlign: 'center', type: 'number', unit: '个' },
] as any

export default {
	getLedgerList,
	columns,
}