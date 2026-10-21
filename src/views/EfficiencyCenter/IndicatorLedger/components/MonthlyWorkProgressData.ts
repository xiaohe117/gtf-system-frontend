// 月度工作推进表数据配置
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
	measurementUnit: string
	monthComplete: number
	monthOnMonth: number
	targetCount: number
	completionRate: number
}

export interface LedgerResponse {
	code: number
	data: { list: LedgerRow[]; total: number }
	message: string
}

const mockData: LedgerRow[] = [
	{ id: 1, serialNumber: 1, industryBranch: '新一代信息技术', indicatorName: '人工智能产业规模', measurementUnit: '亿元', monthComplete: 1234, monthOnMonth: 5.2, targetCount: 8000, completionRate: 75.5 },
	{ id: 2, serialNumber: 2, industryBranch: '生物医药', indicatorName: '生物医药产值', measurementUnit: '亿元', monthComplete: 876, monthOnMonth: 3.5, targetCount: 5000, completionRate: 82.3 },
	{ id: 3, serialNumber: 3, industryBranch: '新材料', indicatorName: '新材料产业规模', measurementUnit: '亿元', monthComplete: 654, monthOnMonth: -2.1, targetCount: 3000, completionRate: 68.9 },
	{ id: 4, serialNumber: 4, industryBranch: '新能源', indicatorName: '新能源汽车产量', measurementUnit: '万辆', monthComplete: 543, monthOnMonth: 1.8, targetCount: 800, completionRate: 71.2 },
	{ id: 5, serialNumber: 5, industryBranch: '数字经济', indicatorName: '数字经济核心产业增加值', measurementUnit: '亿元', monthComplete: 432, monthOnMonth: 4.3, targetCount: 600, completionRate: 79.8 },
]

export const getLedgerList = (params: LedgerParams): Promise<LedgerResponse> =>
	new Promise((resolve) => {
		setTimeout(() => {
			const start = (params.pageNum - 1) * params.pageSize
			// 添加搜索行
			const searchRow = {}
			const dataList = [searchRow, ...mockData.slice(start, start + params.pageSize)] as any
			resolve({ code: 200, data: { list: dataList, total: mockData.length + 1 }, message: 'success' })
		}, 300)
	})

export const columns = [
	{ label: '序号', prop: 'serialNumber', width: getSize(40), align: 'left', headerAlign: 'center', type: 'slot', slotName: 'customIndex' },
	{ label: '产业分局', prop: 'groupName', minWidth: getSize(160), align: 'left', headerAlign: 'center', /* type: 'slot', slotName: 'industryBranchSlot' */ },
	{ label: '指标名称', prop: 'indicatorName', width: getSize(180), align: 'left', headerAlign: 'center', type: 'slot', slotName: 'searchIndicatorName' },
	{ label: '计量单位', prop: 'unit', width: getSize(100), align: 'left', headerAlign: 'center' },
	{ label: '当月数', align: 'left', headerAlign: 'center', children: [
		{ label: '完成数', prop: 'monthDone', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '亿元' },
		{ label: '环比', prop: 'monthOnMonth', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'rate', unit: '%' }
	] },
	{ label: '累计数', align: 'left', headerAlign: 'center', children: [
		{ label: '目标数', prop: 'totalTarget', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '亿元' },
		{ label: '完成率', prop: 'totalRate', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'slot', slotName: 'completionRate' }
	] },
] as any

export default {
	getLedgerList,
	columns,
}