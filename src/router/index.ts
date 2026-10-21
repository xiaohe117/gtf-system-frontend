/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2026-04-02 17:05:36
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-09 14:39:11
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import authService from '@/services/auth';
import usePermissionStore from '@/stores/permission';
import ServiceUrl from '@/utils/url';
import NoPermission from '@/views/Error/NoPermission.vue';
// import Layout from '@/layout/ContentLayout.vue'

const routesArr: RouteRecordRaw[] = [
	{ path: '/noPermission', name: 'noPermission', component: NoPermission },
	{
		path: '/overallSituation/boss',
		name: 'overallSituationBoss',
		component: () => import('@/views/OverallSituation/boss/index.vue'),
	},
	{
		path: '/overallSituation/boss-two',
		name: 'overallSituationBossTwo',
		component: () => import('@/views/OverallSituation/boss/indextwo.vue'),
	},
];

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: routesArr,
});

// 目标企业原始对外地址重定向
const redirectArr = [
	'/enterprise-form/business-records/BusinessRecordsDetails',
	'/enterprise-form/agendaItems-andIssue-feedback-details',
	'/enterprise-form/enterprise-details',
	'/enterprise-form/enterprise-add',
];

const whiteList = ['/overallSituation/boss', '/overallSituation/boss-two'];

const goNext = (to: any, next: any) => {
	if (redirectArr.includes(to.path)) {
		window.location.href = `${ServiceUrl.adminUrl}${to.fullPath.replace(/^\/+/, '')}`;
		return;
	}
	next();
};
router.beforeEach(async (to, from, next) => {
	// 检查是否有保存的跳转 URL（用于处理登录成功后的跳转）
	const savedRedirectUrl = sessionStorage.getItem('redirect_url');

	if (authService.saveCodeFromUrl()) {
		const hasUserInfo = await authService.ensureUserInfo();
		if (!hasUserInfo) {
			authService.redirectToThirdPartyLogin();
			return;
		}
		// goNext(to,next)
		// return;
	}

	if (!authService.getCodeFromCookie()) {
		// 保存当前 URL 到 sessionStorage，登录成功后跳转
		sessionStorage.setItem('redirect_url', to.fullPath);
		authService.redirectToThirdPartyLogin();
		return;
	}

	const permissionStore = usePermissionStore();
	if (whiteList.includes(to.path)) {
		next();
		return;
	}
	// 如果路由还未生成，则生成并添加动态路由
	if (!permissionStore.isRoutesGenerated) {
		const accessRoutes = await permissionStore.generateRoutes();
		if (accessRoutes.length === 0) {
			sessionStorage.removeItem('redirect_url');
			next('/noPermission');
			return;
		}
		permissionStore.addRoutes(accessRoutes);
		next({ ...to, replace: true });
		return;
	}
	// 如果有保存的跳转 URL，优先跳转到该 URL
	if (savedRedirectUrl) {
		sessionStorage.removeItem('redirect_url');
		const r = router.resolve({ path: savedRedirectUrl });
		// 查看保存的跳转 URL是否存在路由权限中，不存在跳到根路径且不是管理后台重定向地址
		if (
			savedRedirectUrl.indexOf('/noPermission') > -1 ||
			(r.name === 'NotFound' && !redirectArr.includes(to.path))
		) {
			next('/');
			return;
		}
		next(savedRedirectUrl);
		return;
	}

	goNext(to, next);
});

export default router;
