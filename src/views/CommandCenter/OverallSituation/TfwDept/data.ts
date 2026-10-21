

import ProjectTable from './Table/ProjectTable.vue'
import GeneralTable from './Table/GeneralTable.vue'
import IframeTable from './Table/IframeTable.vue'
import VisitTable from './Table/VisitTable.vue'

export const cardData = [
  {
    "type": "XM0000003",
    "cardKey": 'project',
    "name": "在谈项目",
    "assessment": "02",
    "cardTypeName": "招商项目",
    "value": null,
    "target": null,
    "targetUnit": null,
    "valueLabel": '项目数',
    "rateLabel": '预计投资额',
    "rate": null,
    "rateUnit": "亿元",
    "valueUnit": "个",
    "measurementUnit": "个",
    "targetCompletionRate": null,
    "tabs": [
      { name: '全市招商引资项目"六个一批"情况表', value: 'projectCityColumns',comp: markRaw(ProjectTable) },
      { name: '办内分局每周项目推进情况表', value: 'weekIframe',comp: markRaw(IframeTable)},
      { name: '办内分局线索及六个一批项目统计表', value: 'sixBatchIframe',comp: markRaw(IframeTable)},
    ],
   
  },
  {
    "type": "XS0000010",
    "cardKey": 'clue',
    "name": "有效线索意向投资总额",
    "assessment": "01",
    "cardTypeName": "招商线索",
    "value": null,
    "target": null,
    "targetUnit": null,
    "rate": null,
    "rateUnit": null,
    "valueUnit": "亿元",
    "measurementUnit": "亿元",
    "targetCompletionRate": null,
    "tabs": [
      { name: '全市引荐有效招商线索情况表', value: 'clueCityColumns',comp: markRaw(GeneralTable) },
      { name: '市直部门任务完成情况', value: 'clueCityDeptColumns',comp: markRaw(GeneralTable) },
      { name: '市属国企任务完成情况', value: 'clueCityEntColumns',comp: markRaw(GeneralTable) },
      { name: '办内分局线索统计', value: 'clueCityBnColumns',comp: markRaw(GeneralTable) },
    ]
  },
  {
    "type": "CJ0000063",
    "cardKey": 'scene',
    "name": "已收集有效场景数量",
    "assessment": "01",
    "cardTypeName": "招商场景",
    "value": null,
    "target": null,
    "targetUnit": null,
    "rate": null,
    "rateUnit": null,
    "valueUnit": "个",
    "measurementUnit": "个",
    "targetCompletionRate": 100,
    "tabs": [
      { name: '全市提供应用场景情况表', value: 'senceCityColumns',comp: markRaw(GeneralTable) },
      { name: '市直部门任务完成情况', value: 'senceCityDeptColumns',comp: markRaw(GeneralTable) },
      { name: '各区任务完成情况', value: 'senceCityDistrictColumns',comp: markRaw(GeneralTable) },
      { name: '市属国企任务完成情况', value: 'senceCityEntColumns',comp: markRaw(GeneralTable) },
      { name: '办内分局场景统计', value: 'senceCityBnColumns',comp: markRaw(GeneralTable) },
    ],
  },
  {
    "type": "HD0000013",
    "cardKey": 'activity',
    "name": "组织招商活动推介场次",
    "assessment": "01",
    "cardTypeName": "招商活动",
    "value": null,
    "target": null,
    "targetUnit": null,
    "rate": null,
    "rateUnit": null,
    "valueUnit": "次",
    "measurementUnit": "次",
    "targetCompletionRate": null,
    "tabs": [
      { name: '全市组织招商专场活动情况表', value: 'activityCityColumns', comp: markRaw(GeneralTable) },
      { name: '市直部门任务完成情况', value: 'activityDeptColumns', comp: markRaw(GeneralTable) },
      { name: '各区任务完成情况', value: 'activityDistrictColumns', comp: markRaw(GeneralTable) },
      { name: '市属国企任务完成情况', value: 'activityEntColumns', comp: markRaw(GeneralTable) },
      { name: '办内分局活动统计', value: 'activityBnColumns', comp: markRaw(GeneralTable) },
    ]
    
  },
  {
    "type": "QY0000066",
    "cardKey": 'touch',
    "name": "走访对接",
    "assessment": "01",
    "cardTypeName": "走访对接",
    "value": null,
    "target": null,
    "targetUnit": null,
    "rate": null,
    "rateUnit": null,
    "valueUnit": "",
    "measurementUnit": "",
    "targetCompletionRate": null,
    "tabs": [
      { name: '全市大走访大对接情况表', value: 'visitCityColumns',comp: markRaw(GeneralTable)},
      { name: '市直部门任务完成情况', value: 'cityDept',comp: markRaw(VisitTable)},
      { name: '各区任务完成情况', value: 'district',comp: markRaw(VisitTable)},
      { name: '办内分局走访统计', value: 'dept',comp: markRaw(VisitTable)},
    ],
    comp: markRaw(VisitTable)
  },
]
// 全市对接记录表格列配置
export const tableColumnsCityConfig = [
	{ label: '序号', type: 'index', width: '40', fixWidth: 80, align: 'left' },

	{
		label: '企业名称',
		prop: 'companyName',
		width: 280,
		type: 'slot',
		slotName: 'companyName',
	},
	{
		label: '对接时间',
		prop: 'startTime',
		width: 200,
		type: 'slot',
		slotName: 'startTime',
	},
	// {
	// 	label: '对接地点',
	// 	prop: 'dockLocation',
	// 	width: 130,
	// },
	// {
	// 	label: '对接类型',
	// 	prop: 'activityType',
	// 	width: 130,
	// },
	// {
	// 	label: '参与市领导',
	// 	prop: 'cityLeaderName',
	// 	width: 180,
	// 	type: 'slot',
	// 	slotName: 'cityLeaderName',
	// 	showToolTip: false,
	// },
	{
		label: '对接内容',
		prop: 'activityIntro',
		width: 300,
	},
	{
		label: '产生线索',
		prop: 'attractInvestmentClues',
		width: 100,
	},
	{
		label: '产生项目',
		prop: 'attractInvestmentProject',
		width: 100,
	},
	// {
	// 	label: '议定事项',
	// 	prop: 'agendaItemContent',
	// 	width: 150,
	// },
	// {
	// 	label: '企业标签',
	// 	prop: 'entTags',
	// 	width: 230,
	// 	type: 'slot',
	// 	slotName: 'entTags',
	// 	showToolTip: false,
	// },
	// {
	// 	label: '是否全市目标企业',
	// 	prop: 'isTargetEnt',
	// 	width: 120,
	// 	type: 'slot',
	// 	slotName: 'isTargetEnt',
	// },
	{
		label: '填报单位',
		prop: 'fillUnit',
		width: 120,
	},
	// {
	// 	label: '填报人',
	// 	prop: 'filler',
	// 	width: 100,
	// },
	// {
	// 	label: '最新填报时间',
	// 	prop: 'fillTime',
	// 	width: 180,
	// 	type: 'slot',
	// 	slotName: 'fillTime',
	// },
	// {
	// 	label: '首次填报时间',
	// 	prop: 'firstFillTime',
	// 	width: 170,
	// },
	// {
	// 	label: '填报方式',
	// 	prop: 'fillMethod',
	// 	width: 110,
	// },
	{
		label: '操作',
		type: 'slot',
		slotName: 'action',
		fixed: 'right',
		width: 100,
	},
];

export const dd = []