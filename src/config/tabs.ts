/*
 * @Descripttion:
 * @Author: zhaochao
 * @Date: 2025-06-21 17:37:32
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-11-13 15:42:58
 */
import { TabConfig, MenuItem } from '../types/menu';

export const tabs: TabConfig[] = [
	{
		id: 'commandCenter',
		label: '指挥中枢',
		path: '/commandCenter',
	},
	{
		id: 'projectCenter',
		label: '项目中心',
		path: '/projectCenter',
	},
	{
		id: 'intelligenceCenter',
		label: '情报中心',
		path: '/intelligenceCenter',
	},
	{
		id: 'efficiencyCenter',
		label: '效能中心',
		path: '/efficiencyCenter',
	},
	{
		id: 'overallSituation',
		label: '整体情况',
		path: '/overallSituation',
	},
	{
		id: 'classifiedByIndustry',
		label: '按产业分',
		path: '/classifiedByIndustry',
	},
	{
		id: 'runByEnterprise',
		label: '按企业跑',
		path: '/runByEnterprise',
	},
	{
		id: 'recruitmentByProject',
		label: '按项目招',
		path: '/recruitmentByProject',
	},
];

export const menuList: MenuItem[] = [];

export const externalLink:any[] = [
	{ name: '企业发展潜力评估', subName: '(广州市城规院企业分析平台)', path: '' },
	{ name: '企业投融资信息', subName: '(清科私募通)', path: 'https://max.pedata.cn' },
	{ name: '大数据招商', subName: '(万楼数据)', path: 'https://app.wanlou.com' },
]
