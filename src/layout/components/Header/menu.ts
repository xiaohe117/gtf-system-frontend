/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2026-03-24 10:02:50
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-08 20:39:44
 */
import ServiceUrl from '@/utils/url'

export default [
	{
		path: '/commandCenter/overallSituation',
		label: '指挥中心',
		children: [
			// {
			// 	label: '挂图作战',
			// 	path: '',
			// 	children: [
			// 		{ label: '央企挂图', path: '/commandCenter/soeWallMap' },
			// 		{ label: '外企挂图', path: '/commandCenter/foreignEntMap' },
			// 	],
			// },
			{
				label: '整体情况',
				path: '/commandCenter/overallSituation',
			},
			{
				label: '按产业分',
				path: '/commandCenter/classifiedByIndustry',
			},
			{
				label: '按企业跑',
				path: '/commandCenter/runByEnterprise',
			},
			{
				label: '按项目招',
				path: '/commandCenter/recruitmentByProject',
			},
		],
	},
	{
		path: '/operationCenter/iframe/target',
		label: '操作中心',
		children: [
			// {
			// 	label:'工作台',
			// 	path:'/operationCenter/dashboard',
			// 	icon:'dashboard'
			// },
			{
				label:'企业',
				path:'/operationCenter/iframe/target',
				icon:'target',
				iframeUrl:`${ServiceUrl.adminUrl}`
			},
			{
				label:'场景',
				path:'/operationCenter/iframe/scene',
				icon:'scene',
				iframeUrl:`${ServiceUrl.adminUrl}?iframe_menu_key=scene`
			},
			{
				label:'线索',
				path:'/operationCenter/iframe/clue',
				icon:'clue',
				iframeUrl:`${ServiceUrl.getQmSysUrl()}/pc/projectManage/clue/clueHouse`
			},
			{
				label:'项目',
				path:'/operationCenter/iframe/project',
				icon:'project',
				iframeUrl:`${ServiceUrl.getQmSysUrl()}/pc/ALL`,
			},
			{
				label:'活动',
				path:'/operationCenter/iframe/activity',
				icon:'activity',
				iframeUrl:`${ServiceUrl.getQmSysUrl()}/pc/activity/major/list`
			},
		]
	},
	// {
	// 	path: '/center',
	// 	label: '效能中心',
	// },
	// {
	// 	path: '/center',
	// 	label: '协同调度',
	// },
];
