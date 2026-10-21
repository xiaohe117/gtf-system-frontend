// 各区台账数据配置
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
	category: string
	unit: string
	indicatorName: string
	measurementUnit: string
	monthComplete: number
	monthOnMonth: number
	cumulativeComplete: number
	completionRate: number
}

export interface LedgerResponse {
	code: number
	data: { list: LedgerRow[]; total: number }
	message: string
}

const mockData: LedgerRow[] = [
	{ id: 1, serialNumber: 1, category: '经济类', unit: '市统计局', indicatorName: 'GDP', measurementUnit: '亿元', monthComplete: 1234, monthOnMonth: 5.2, cumulativeComplete: 5678, completionRate: 75.5 },
	{ id: 2, serialNumber: 2, category: '税收类', unit: '市税务局', indicatorName: '税收', measurementUnit: '亿元', monthComplete: 876, monthOnMonth: 3.5, cumulativeComplete: 4321, completionRate: 82.3 },
	{ id: 3, serialNumber: 3, category: '投资类', unit: '市发改委', indicatorName: '固定资产投资', measurementUnit: '亿元', monthComplete: 654, monthOnMonth: -2.1, cumulativeComplete: 3210, completionRate: 68.9 },
	{ id: 4, serialNumber: 4, category: '工业类', unit: '市工信局', indicatorName: '规上工业增加值', measurementUnit: '亿元', monthComplete: 543, monthOnMonth: 1.8, cumulativeComplete: 2654, completionRate: 71.2 },
	{ id: 5, serialNumber: 5, category: '消费类', unit: '市商务局', indicatorName: '社会消费品零售总额', measurementUnit: '亿元', monthComplete: 432, monthOnMonth: 4.3, cumulativeComplete: 1987, completionRate: 79.8 },
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
	{ label: '各区', prop: 'groupName', minWidth: getSize(120), align: 'left', headerAlign: 'center', /* type: 'slot', slotName: 'unitSlot' */ },
	{ label: '指标名称', prop: 'indicatorName', width: getSize(180), align: 'left', headerAlign: 'center', type: 'slot', slotName: 'searchIndicatorName' },
	{ label: '计量单位', prop: 'unit', width: getSize(100), align: 'left', headerAlign: 'center' },
	{ label: '当月数', align: 'left', headerAlign: 'center', children: [
		{ label: '完成数', prop: 'monthDone', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '亿元' },
		{ label: '环比', prop: 'monthOnMonth', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'rate', unit: '%' }
	] },
	{ label: '累计数', align: 'left', headerAlign: 'center', children: [
		{ label: '目标', prop: 'totalTarget', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '亿元' },
		{ label: '完成数', prop: 'totalDone', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '亿元' },
		{ label: '完成率', prop: 'totalRate', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'slot', slotName: 'completionRate', className: 'completion-rate-td' },
		{ label: '同比', prop: 'yearOnYear', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'rate', unit: '%' }
	] },
] as any

export default {
	getLedgerList,
	columns,
}