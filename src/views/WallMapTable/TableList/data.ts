/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2025-08-12 17:27:17
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-05 15:54:06
 */
import { getSize } from '@/utils';

const commonCols: any[] = [
	{
		prop: 'dept',
		label: '填报单位',
		align: 'left',
		width: getSize(250),
		showToolTip: false,
	},
	{
		prop: 'time',
		label: '填报时间',
		align: 'left',
		width: getSize(250),
		showToolTip: false,
	},
];
export const columns: any[] = [
	{
		prop: 'companyName',
		label: '企业名称',
		width: getSize(250),
		align: 'left',
		type: 'slot',
		slotName: 'companyName',
		showToolTip: false,
	},
	{
		prop: 'industryName',
		label: '产业体系',
		width:getSize(160),
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
	},
	// {
	// 	prop: 'headLocation',
	// 	label: '总部所在地',
	// 	align: 'left',
	// 	type: 'slot',
	// 	slotName: 'text',
	// 	showToolTip: false,
	// },
	{
		prop: 'respLeader',
		label: '牵头市领导',
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
		width: getSize(120),
	},
	{
		prop: 'deptName',
		label: '责任市级单位',
		width:getSize(180),
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
	},
	{
		prop: 'dynContentList',
		label: '对接情况',
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
		width: getSize(540),
	},
	{
		prop: 'investLead',
		label: '招商线索',
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
		width: getSize(180),
	},
	{
		prop: 'investProject',
		label: '招商项目',
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
		width: getSize(180),
	},
	// {
	// 	prop: 'suggestion',
	// 	label: '建议市领导2026年会见时间、地点和场合',
	// 	align: 'left',
	// 	type: 'slot',
	// 	slotName: 'text',
	// 	showToolTip: false,
	// },
	{
		prop: 'mainList',
		label: '主攻招引方向策划',
		width: getSize(300),
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
		columns: [
			{
				prop: 'content',
				label: '主攻招引方向策划',
				align: 'left',
				showToolTip: false,
			},
			...commonCols,
		],
	},
	// {
	// 	prop: 'bureauName',
	// 	label: '办内责任分局',
	// 	align: 'left',
	// 	type: 'slot',
	// 	slotName: 'text',
	// 	showToolTip: false,
	// },
	{
		prop: 'whetherInclude',
		label: '是否省重点',
		align: 'left',
		type: 'slot',
		slotName: 'text',
		showToolTip: false,
		width: getSize(140),
	},
];

// 问题状态 1-待解决 2-处理中 3-已解决 4-已关闭
export const statusOption: any[] = [
	{ label: '待解决', value: 1, color: '#F04747' },
	{ label: '处理中', value: 2, color: '#FFC359' },
	{ label: '已解决', value: 3, color: '#00C462' },
	{ label: '已关闭', value: 4, color: '#4B4B4B' },
];
