/*
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-03-25 11:11:20
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-01 17:48:56
 */
import { RouteRecordRaw } from 'vue-router';
import MenuLayout from '@/layout/MenuLayout.vue';
import ToolbarLayout from '@/layout/ToolbarLayout.vue';

const routesArr: RouteRecordRaw[] = [
	{
		path: '/commandCenter',
		name: 'commandCenter',
		component: MenuLayout,
		redirect: '/commandCenter/overallSituation',
		children: [
			{
				path: 'soeWallMap',
				name: 'soeWallMap',
				component: () => import('@/views/CommandCenter/SoeWallMap/Index.vue'),
				meta: { title: '央企挂图', icon: '', active: 'commandCenter' },
			},
			{
				path: 'foreignEntMap',
				name: 'foreignEntMap',
				component: () => import('@/views/CommandCenter/SoeWallMap/Index.vue'),
				meta: { title: '外企挂图', icon: '', active: 'commandCenter' },
			},
			{
				path: 'industryOverview',
				name: 'industryOverview',
				component: () => import('@/views/CommandCenter/SoeWallMap/Index.vue'),
				meta: { title: '产业总览', icon: '', active: 'commandCenter' },
			},
			{
				path: 'overallSituation',
				name: 'commandCenter-overallSituation',
				component: () => import('@/views/CommandCenter/OverallSituation/Index.vue'),
				meta: { title: '整体情况', icon: '', active: 'commandCenter' },
			},
			{
				path: 'classifiedByIndustry',
				name: 'commandCenter-classifiedByIndustry',
				component: () => import('@/views/CommandCenter/ClassifiedByIndustry/Index.vue'),
				meta: { title: '按产业分', icon: '', active: 'commandCenter' },
			},
			{
				path: 'runByEnterprise',
				name: 'commandCenter-runByEnterprise',
				component: () => import('@/views/CommandCenter/RunByEnterprise/Index.vue'),
				meta: { title: '按企业跑', icon: '', active: 'commandCenter' },
			},
			{
				path: 'recruitmentByProject',
				name: 'commandCenter-recruitmentByProject',
				component: () => import('@/views/CommandCenter/RecruitmentByProject/Index.vue'),
				meta: { title: '按项目招', icon: '', active: 'commandCenter' },
			},
			{
				path: 'investmentFullProcess',
				name: 'commandCenter-investmentFullProcess',
				component: () => import('@/views/CommandCenter/investmentFullProcess/Index.vue'),
				meta: { title: '招商全流程', icon: '', active: 'commandCenter' },
			},
		],
	},
	{
		path: '/operationCenter',
		name: 'operationCenter',
		component: ToolbarLayout,
		redirect: '/operationCenter/iframe/target',
		children: [
			{
				path: 'dashboard',
				name: 'dashboard',
				component: () => import('@/views/OperationCenter/Dashboard/Index.vue'),
				meta: { title: '工作台', icon: '' },
			},
			{
				path: 'iframe/:system([\\w|\\-]+)',
				name: 'iframeSystem',
				component: () => import('@/views/OperationCenter/Iframe/Index.vue'),
				meta: { title: '第三方系统', icon: '' },
			},
			// {
			// 	path:'project',
			// 	name:'project',
			// 	component: () => import('@/views/OperationCenter/dashboard/Index.vue'),
			// 	meta: { title: '项目', icon: '' },
			// },
			// {
			// 	path:'activity',
			// 	name:'activity',
			// 	component: () => import('@/views/OperationCenter/dashboard/Index.vue'),
			// 	meta: { title: '活动', icon: '' },
			// },
			// {
			// 	path:'target',
			// 	name:'target',
			// 	component: () => import('@/views/OperationCenter/dashboard/Index.vue'),
			// 	meta: { title: '目标', icon: '' },
			// },
			// {
			// 	path:'scene',
			// 	name:'scene',
			// 	component: () => import('@/views/OperationCenter/dashboard/Index.vue'),
			// 	meta: { title: '场景', icon: '' },
			// }
		],
	},
];
export default routesArr;
