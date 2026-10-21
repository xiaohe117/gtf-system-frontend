/*
 * @Descripttion: 原本子级页面-减少修改量还是沿用原本根路径
 * @Author: ycyun
 * @Date: 2026-03-25 11:11:20
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-13 17:41:08
 */
import { RouteRecordRaw } from 'vue-router';
import ContentLayout from '@/layout/ContentLayout.vue';

function getRoutesArr(redirectPath: string): RouteRecordRaw {
	return {
		path: '/',
		name: 'Home',
		component: ContentLayout,
		redirect: redirectPath,
		children: [
			{
				path: 'iframeOnlyHeader/:pageType',
				name: 'iframeOnlyHeader',
				component: () => import('@/views/IframeOnlyHeader/Index.vue'),
				meta: { title: '部门总览页' },
			},
			// {
			// 	path: 'overallSituation',
			// 	name: 'overallSituation',
			// 	component: () => import('@/views/OverallSituation/Index.vue'),
			// 	meta: { title: '整体情况', icon: 'nested' },
			// },
			{
				path: 'nanshaDistrict',
				name: 'nanshaDistrict',
				component: () => import('@/views/NanshaDistrict/Index.vue'),
				meta: { title: '三库联动', icon: 'nested' },
			},
			{
				path: 'intelligenceCenter',
				name: 'intelligenceCenter',
				component: () => import('@/views/IntelligenceCenter/Index.vue'),
				meta: { title: '情报中心', icon: 'nested' },
			},
			{
				path: 'industrialInfo',
				name: 'industrialInfo',
				component: () => import('@/views/IndustrialInfo/index.vue'),
				meta: { title: '工信局招商总览-产业规划', icon: 'nested' },
			},
			// {
			// 	path: 'runByEnterprise',
			// 	name: 'runByEnterprise',
			// 	component: () => import('@/views/RunByEnterprise/Index.vue'),
			// 	meta: { title: '按企业跑', icon: 'nested' },
			// },
			{
				path: 'toufawOverview',
				name: 'toufawOverview',
				component: () => import('@/views/ToufawOverview/Index.vue'),
				meta: { title: '投发委办招商总览', icon: 'nested' },
			},
			{
				path: 'wallMapTable',
				name: 'wallMapTable',
				component: () => import('@/views/WallMapTable/Index.vue'),
				meta: { title: '专项挂图作战', icon: 'nested' },
			},
			{
				path: 'runByEnterprise/enterpriseDetail',
				name: 'enterpriseDetail',
				component: () =>
					import('@/views/RunByEnterprise/components/detail/EnterpriseDetail.vue'),
				meta: { title: '企业详情', icon: 'nested' },
			},
			{
				path: 'deptOverview/:deptCode',
				name: 'deptOverview',
				component: () => import('@/views/CommandCenter/OverallSituation/DeptOverview/Index.vue'),
				meta: { title: '部门总览页' },
			}
			// {
			// 	path: 'recruitmentByProject',
			// 	name: 'recruitmentByProject',
			// 	component: () => import('@/views/RecruitmentByProject/Index.vue'),
			// 	meta: { title: '按项目招', icon: 'nested' },
			// },
			// {
			// 	path: 'ActivityFillingPage',
			// 	name: 'ActivityFillingPage',
			// 	component: () => import('@/views/ActivityFillingPage/index.vue'),
			// 	meta: { title: '活动填报页', icon: 'nested' },
			// },
			// {
			// 	path: 'classifiedByIndustry',
			// 	name: 'classifiedByIndustry',
			// 	component: () => import('@/views/ClassifiedByIndustry/Index.vue'),
			// 	meta: { title: '按产业分', icon: 'nested' },
			// },
		],
	};
}
export default getRoutesArr;
