/**
 * 各区监测、部门监测、国企监测、办内监测的表格字段配置
 * 用于 GrowthRateTable 组件
 */
import { getSize } from '@/utils';

// 表格列定义类型
interface TableColumn {
	label: string;
	type: string;
	width?: string | number;
	align?: string;
	prop?: string;
	sortable?: string | boolean;
	headerAlign?: string;
	showToolTip?: boolean;
	lineProp?: string;
	lightingType?: string;
	slotName?:string;
	showHeaderTooltip?: boolean;
	fixWidth?: string | number;
}

// 各区监测表格字段配置
export const areaMonitoringColumns: TableColumn[] = [
	{ label: '序号', type: 'index', width: '40', align: 'left' },
	{
		label: '各区',
		prop: 'groupName',
		width: '65',
		type: 'lighting',
		align: 'left',
		lightingType: 'lightStatus',
	},
	{
		label: '当月完成数\n{{unit}}',
		prop: 'monthDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '环比',
		prop: 'monthOnMonth',
		type: 'growRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '目标\n{{unit}}',
		prop: 'totalTarget',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '累计完成\n{{unit}}',
		prop: 'totalDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '完成率',
		prop: 'totalRate',
		type: 'lightingGrowRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '完成率排名',
		headerAlign: 'center',
		type: 'percent',
		prop: 'totalRate',
		lineProp: '',
		width: '300',
		showToolTip: false,
		align: 'left',
		showHeaderTooltip: true,
	},
	{
		label: '同比',
		prop: 'yearOnYear',
		type: 'growRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
];

// 部门监测表格字段配置
export const departmentMonitoringColumns: TableColumn[] = [
	{ label: '序号', type: 'index', width: getSize(80), align: 'left' },
	{
		label: '类别',
		prop: 'orgName',
		width: '90',
		type: 'orgName',
		align: 'left',
	},
	{
		label: '部门',
		prop: 'groupName',
		width: '160',
		type: 'lighting',
		align: 'left',
		lightingType: 'lightStatus',
	},
	{
		label: '当月完成数\n{{unit}}',
		prop: 'monthDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '环比',
		prop: 'monthOnMonth',
		type: 'growRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '目标\n{{unit}}',
		prop: 'totalTarget',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '累计完成\n{{unit}}',
		prop: 'totalDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '完成率',
		prop: 'totalRate',
		type: 'lightingGrowRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '完成率排名',
		headerAlign: 'center',
		type: 'percent',
		prop: 'totalRate',
		lineProp: '',
		width: '300',
		showToolTip: false,
		align: 'left',
		showHeaderTooltip: true,
	},
];

// 国企监测表格字段配置
export const enterpriseMonitoringColumns: TableColumn[] = [
	{ label: '序号', type: 'index', width: '80', align: 'left' },
	{
		label: '类别',
		prop: 'orgName',
		width: '90',
		type: 'orgName',
		align: 'left',
	},
	{
		label: '国企',
		prop: 'groupName',
		width: '150',
		type: 'lighting',
		align: 'left',
		lightingType: 'lightStatus',
	},
	{
		label: '当月完成数\n{{unit}}',
		prop: 'monthDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '环比',
		prop: 'monthOnMonth',
		type: 'growRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '目标\n{{unit}}',
		prop: 'totalTarget',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '累计完成\n{{unit}}',
		prop: 'totalDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '完成率',
		prop: 'totalRate',
		type: 'lightingGrowRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '完成率排名',
		headerAlign: 'center',
		type: 'percent',
		prop: 'totalRate',
		lineProp: '',
		width: '300',
		showToolTip: false,
		align: 'left',
		showHeaderTooltip: true,
	},
];

// 办内监测表格字段配置
export const officeMonitoringColumns: TableColumn[] = [
	{ label: '序号', type: 'index', width: '40', align: 'left' },
	{
		label: '产业分局',
		prop: 'groupName',
		width: '65',
		type: 'groupName',
		align: 'left',
	},
	{
		label: '当月完成数\n{{unit}}',
		prop: 'monthDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '环比',
		prop: 'monthOnMonth',
		type: 'growRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '目标\n{{unit}}',
		prop: 'totalTarget',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '累计完成\n{{unit}}',
		prop: 'totalDone',
		type: 'num',
		width: '80',
		align: 'right',
		headerAlign: 'center',
		sortable: 'custom',
	},
	{
		label: '完成率',
		prop: 'totalRate',
		type: 'lightingGrowRate',
		width: '75',
		align: 'right',
		sortable: 'custom',
	},
	{
		label: '完成率排名',
		headerAlign: 'center',
		type: 'percent',
		prop: 'totalRate',
		lineProp: '',
		width: '300',
		showToolTip: false,
		align: 'left',
		showHeaderTooltip: true,
	},
];

// 走访明细表格字段配置
export const visitDetailColumns: TableColumn[] = [
	{ label: '序号', type: 'index', width: '40', fixWidth: String(getSize(80)), align: 'left' },
	{
		label: '企业名称',
		prop: 'companyName',
		width: '180',
		type: 'companyName',
		headerAlign: 'center',
		align: 'left',
	},
	/*
	{
		label: '企业标签',
		prop: 'entTags',
		type: 'slot',
		slotName:'entTags',
		width: '110',
		showToolTip: false,
		align: 'center',
	},
	*/
	{
		label: '招商线索',
		prop: 'clueName',
		type: 'clueName',
		width: '75',
		align: 'center',
	},
	{
		label: '招商项目',
		prop: 'projName',
		type: 'projName',
		width: '80',
		align: 'center',
	},
	{
		label: '对接内容',
		prop: 'activityIntro',
		type: 'activityIntro',
		width: '200',
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '对接时间',
		prop: 'startTime',
		type: 'startTime',
		fixWidth: String(getSize(140)),
		align: 'center',
	},
	{
		label: '填报单位',
		prop: 'fillUnit',
		type: 'fillUnit',
		width: '75',
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '操作',
		prop: 'btn',
		type: 'slot',
		slotName:'btn',
		width: '100',
		fixWidth: String(getSize(120)),
		align: 'center',
	},
];

// 场景明细表格字段配置
export const sceneDetailColumns: TableColumn[] = [
	{ label: '序号', type: 'index', width: '40', fixWidth: String(getSize(80)), align: 'left' },
	{
		label: '场景名称',
		prop: 'sceneName',
		width: '80',
		type: 'sceneName',
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '场景类型',
		prop: 'sceneType',
		type: 'sceneType',
		width: '60',
		fixWidth: String(getSize(120)),
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '主体名称',
		prop: 'subjectName',
		type: 'subjectName',
		width: '75',
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '需求（供给）领域',
		prop: 'needSupplyField',
		type: 'needSupplyField',
		width: '100',
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '操作',
		prop: 'btn',
		type: 'slot',
		slotName:'btn',
		fixWidth: String(getSize(120)),
		align: 'center',
	},
];

// 项目明细
export const projectDetailColumns: TableColumn[] = [
]

// 线索明细
export const lineDetailColumns: TableColumn[] = [
	{ label: '序号', type: 'index', fixWidth: String(getSize(80)), align: 'left' },
	{
		label: '线索名称',
		prop: 'clueName',
		type: 'clueName',
		width: '140',
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '投资主体',
		prop: 'investors',
		type: 'investors',
		width: '160',
		headerAlign: 'center',
		align: 'left',
	},
	{
		label: '重要程度',
		prop: 'leadImportance',
		type: 'slot',
		slotName: 'leadImportance',
		width: '80',
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '预计投资总额\n（亿元）',
		prop: 'investAmount',
		type: 'num',
		width: '100',
		headerAlign: 'center',
		align: 'center',
		sortable: 'custom',
	},
	{
		label: '12218产业分类',
		prop: 'cityIndustrialChainName',
		type: 'cityIndustrialChainName',
		width: '120',
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '线索状态',
		prop: 'cluePhaseNew',
		type: 'cluePhaseNew',
		width: '80',
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '录入单位',
		prop: 'unitShortName',
		type: 'unitShortName',
		width: '100',
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '录入时间',
		prop: 'createdDate',
		type: 'startTime',
		width: '100',
		headerAlign: 'center',
		align: 'center',
	},
	{
		label: '操作',
		prop: 'btn',
		type: 'slot',
		slotName: 'btn',
		width: '80',
		fixWidth: String(getSize(120)),
		align: 'center',
	},
]

// 活动明细
export const activityDetailColumns: TableColumn[] = [
]

// 表格字段配置映射
export const tableColumnsMap: Record<string, TableColumn[]> = {
	areaMonitoring: areaMonitoringColumns,
	departmentMonitoring: departmentMonitoringColumns,
	enterpriseMonitoring: enterpriseMonitoringColumns,
	officeMonitoring: officeMonitoringColumns,
	visitDetail: visitDetailColumns,
	sceneDetail: sceneDetailColumns,
	projectDetail: projectDetailColumns,
	lineDetail: lineDetailColumns,
	activityDetail: activityDetailColumns,
};

// 特殊标签映射
export const specialLabelMap: Record<string, string> = {
	areaMonitoring: '',
	departmentMonitoring: '',
	enterpriseMonitoring: '',
	officeMonitoring: '',
};

// 获取表格字段配置
export const getTableColumnsConfig = (columnsKey: string): TableColumn[] =>
	tableColumnsMap[columnsKey] || areaMonitoringColumns;

// 获取特殊标签
export const getSpecialLabel = (columnsKey: string): string =>
	specialLabelMap[columnsKey] || '';
