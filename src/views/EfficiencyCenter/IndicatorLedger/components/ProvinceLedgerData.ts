// 省内台账数据配置
import { getSize } from '@/utils';

export interface LedgerParams {
	pageNum: number;
	pageSize: number;
	indicatorModule?: string;
	date?: string;
}

export interface LedgerRow {
	id: number;
	district: string;
	indicatorName: string;
	unit: string;
	currentMonthComplete: number;
	monthOnMonth: number;
	cumulativeComplete: number;
	yearOnYear: number;
}

export interface LedgerResponse {
	code: number;
	data: { list: LedgerRow[]; total: number };
	message: string;
}

const mockData: LedgerRow[] = [
	{
		id: 1,
		district: '总计',
		indicatorName: 'GDP',
		unit: '亿元',
		currentMonthComplete: 1234,
		monthOnMonth: 5.2,
		cumulativeComplete: 5678,
		yearOnYear: 6.8,
	},
	{
		id: 2,
		district: '南沙区',
		indicatorName: 'GDP',
		unit: '亿元',
		currentMonthComplete: 1234,
		monthOnMonth: 5.2,
		cumulativeComplete: 5678,
		yearOnYear: 6.8,
	},
	{
		id: 3,
		district: '天河区',
		indicatorName: '税收',
		unit: '亿元',
		currentMonthComplete: 876,
		monthOnMonth: 3.5,
		cumulativeComplete: 4321,
		yearOnYear: 4.2,
	},
	{
		id: 4,
		district: '黄埔区',
		indicatorName: '投资',
		unit: '亿元',
		currentMonthComplete: 654,
		monthOnMonth: -2.1,
		cumulativeComplete: 3210,
		yearOnYear: 5.6,
	},
	{
		id: 5,
		district: '番禺区',
		indicatorName: '规上工业',
		unit: '亿元',
		currentMonthComplete: 543,
		monthOnMonth: 1.8,
		cumulativeComplete: 2654,
		yearOnYear: 3.9,
	},
	{
		id: 6,
		district: '花都区',
		indicatorName: '社消零',
		unit: '亿元',
		currentMonthComplete: 432,
		monthOnMonth: 4.3,
		cumulativeComplete: 1987,
		yearOnYear: 7.1,
	},
];

export const getLedgerList = (params: LedgerParams): Promise<LedgerResponse> =>
	new Promise((resolve) => {
		setTimeout(() => {
			const start = (params.pageNum - 1) * params.pageSize;
			// 添加搜索行
			const searchRow = {};
			const dataList = [searchRow, ...mockData.slice(start, start + params.pageSize)] as any;
			resolve({
				code: 200,
				data: { list: dataList, total: mockData.length + 1 },
				message: 'success',
			});
		}, 300);
	});

export const columns = [
	{
		label: '序号',
		prop: 'serialNumber',
		width: getSize(40),
		align: 'left',
		headerAlign: 'center',
		type: 'slot',
		slotName: 'customIndex',
	},
	{
		label: '所在区',
		prop: 'groupName',
		minWidth: getSize(120),
		align: 'left',
		headerAlign: 'center',
		// type: 'slot',
		// slotName: 'districtSlot',
	},
	{
		label: '指标名称',
		prop: 'indicatorName',
		minWidth: getSize(180),
		align: 'left',
		headerAlign: 'center',
		type: 'slot',
		slotName: 'searchIndicatorName',
	},
	{ label: '计量单位', prop: 'unit', width: getSize(120), align: 'left', headerAlign: 'center' },
	{
		label: '当月数',
		align: 'left',
		headerAlign: 'center',
		children: [
			{ label: '完成数', prop: 'monthDone', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '亿元' },
			{ label: '环比', prop: 'monthOnMonth', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'rate', unit: '%' },
		],
	},
	{
		label: '累计数',
		align: 'left',
		headerAlign: 'center',
		children: [
			{ label: '完成数', prop: 'totalDone', minWidth: getSize(120), align: 'left', headerAlign: 'center', type: 'number', unit: '亿元' },
			{ label: '同比', prop: 'yearOnYear', minWidth: getSize(100), align: 'left', headerAlign: 'center', type: 'slot', unit: '%', slotName: 'yearOnYear' },
		],
	},
] as any;

export default {
	getLedgerList,
	columns,
};
