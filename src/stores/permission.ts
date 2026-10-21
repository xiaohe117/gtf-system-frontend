/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2026-04-02 11:44:52
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-19 14:26:27
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { queryListMenu } from '@/api/user';
import router from '@/router';
import MenuLayout from '@/layout/MenuLayout.vue';
import ToolbarLayout from '@/layout/ToolbarLayout.vue';
import ContentLayout from '@/layout/ContentLayout.vue';
import EmptyContainer from '@/layout/EmptyContainer.vue';
import NotFound from '@/views/Error/404.vue';
import ServiceUrl from '@/utils/url';
import pageRoutes from '@/router/pageRoutes';
import authService from '@/services/auth';

const modules = import.meta.glob('@/views/**/*.vue');

function loadComponent(componentPath: string) {
	if (componentPath === 'MenuLayout') {
		return MenuLayout;
	}

	if (componentPath === 'ToolbarLayout') {
		return ToolbarLayout;
	}

	if (componentPath === 'ContentLayout') {
		return ContentLayout;
	}
	if (componentPath === 'null') {
		return EmptyContainer
	}

	let fullPath = componentPath;
	if (!fullPath.startsWith('/')) {
		fullPath = `/src/views/${fullPath}`;
	}
	if (!fullPath.endsWith('.vue')) {
		fullPath = `${fullPath}.vue`;
	}

	const matchedModule = modules[fullPath];
	if (!matchedModule) {
		return null;
	}

	return matchedModule;
}

const transformMenuToRoutes = (menuList: any[], parentPath = '') => {
	const routes: any[] = [];
	menuList.forEach((menu) => {
		
		// 外部链接（http/https 开头）不添加为 Vue Router 路由
		if (menu.path && /^https?:\/\//.test(menu.path)) {
			return;
		}
		// 去除 path 中的查询参数（? 后面的部分），避免注册的路由无法匹配
		const cleanPath = menu.path.split('?')[0];
		const route: any = {
			path: cleanPath,
			name: `${menu.name || cleanPath}`,
			meta: menu.meta || {},
		};
		if (menu.redirect ) {
			const suffix = parentPath ? `${parentPath}/` : ''
			route.redirect = `${suffix}${menu.redirect}`
		}
		if (menu.component) {
			const component = loadComponent(menu.component);
			if (component) {
				route.component = component as any;
			}
		}
		if (menu.children && menu.children.length > 0) {
			route.children = transformMenuToRoutes(
				menu.children,
				parentPath ? `${parentPath}/${cleanPath}` : cleanPath
			);
		}
		routes.push(route);
	});
	return routes;
};

// 第三方系统地址配置，由于有互联网地址兼容需满足动态，无法用后端配置数据方式
const IframeConfig: any = {
	enterprise: `${ServiceUrl.adminUrl}`,
	scene: `${ServiceUrl.adminUrl}?iframe_menu_key=scene`,
	clue: `${ServiceUrl.getQmSysUrl()}/pc/projectManage/clue/list`, // 线索
	project: `${ServiceUrl.getQmSysUrl()}/pc/ALL`, // 项目
	cityProject: `${ServiceUrl.getQmSysUrl()}/pc/CITY_QY?pp=2`, // 全市项目
	activity: `${ServiceUrl.getQmSysUrl()}/pc/activity/major/list`, // 活动
	investmentDynamic: `${ServiceUrl.getQmSysUrl()}/pc/WXZ?pp=1`, // 招商动态
};
// 处理菜单渲染数据
const transformMenu = (data: any[], parentPath = '') => {
	const Menus: any[] = [];
	data.forEach((menu) => {
		// 去除 path 中的查询参数，转成 query 对象（只按第一个 ? 分割，避免 iframeUrl 中的 ? 被截断）
		const firstQuestionMarkIdx = menu.path.indexOf('?');
		const cleanPath = firstQuestionMarkIdx === -1 ? menu.path : menu.path.substring(0, firstQuestionMarkIdx);
		const queryString = firstQuestionMarkIdx === -1 ? '' : menu.path.substring(firstQuestionMarkIdx + 1);
		const query: Record<string, string> = {};
		if (queryString) {
			const params = new URLSearchParams(queryString);
			params.forEach((value, key) => {
				query[key] = value;
			});
		}
		const path = parentPath && cleanPath.indexOf('http') !== 0 ? `${parentPath}/${cleanPath}` : cleanPath;
		// 处理 query 中的 iframeUrl，替换 ${qmurl} 为实际地址
		let iframeUrl: string | null = IframeConfig[cleanPath] || null;
		if (query.iframeUrl) {
			iframeUrl = query.iframeUrl.replace(/\$\{qmurl\}/, ServiceUrl.getQmSysUrl()).replace(/\$\{adminurl\}/, ServiceUrl.adminUrl);
			delete query.iframeUrl;
		}
		const obj = {
			...menu,
			path,
			label: menu.meta?.title,
			icon: menu.meta?.icon,
			query: Object.keys(query).length > 0 ? query : undefined,
			iframeUrl,
		};
		if (menu.children && menu.children.length > 0) {
			obj.children = transformMenu(menu.children, path);
		}
		Menus.push(obj);
	});
	return Menus;
};
// 特定用户配置特定默认路径
const UserPathConfig = [{ account: '13889908100', path: '/operationCenter/clue' }];
// 获取到根路径重定向地址
function getRedirectPath(route: any[]): string {
	// eslint-disable-next-line no-restricted-syntax
	for (const item of route) {
		if (item.component.indexOf('Layout') === -1) {
			return item.path;
		}
		if (item.children && item.children.length > 0) {
			return getRedirectPath(item.children);
		}
	}
	return 'null';
}
// 过滤一部门一界面/一区一界面，不是办内的，需要仅保留当前用户所属部门的页面
const traverseAndFilter = (menuList: any[], userInfo: any) => {
	if (userInfo?.bn) {
		return
	}

	const deptFilterNames = new Set(['oneDeptOverview', 'oneDistrictOverview']);
	if (!menuList || !userInfo?.orgId) return;
	// 先递归处理子级
	menuList.forEach((menu: any) => {
		if (menu.children?.length > 0) {
			traverseAndFilter(menu.children, userInfo);
		}
	});
	// 再过滤当前层级，子级为空则移除父级
	for (let i = menuList.length - 1; i >= 0; i -= 1) {
		const menu = menuList[i];
		if (deptFilterNames.has(menu.name)) {
			menu.children = (menu.children || []).filter((child: any) => {
				const queryIdx = child.path?.indexOf('?');
				if (queryIdx === -1) return false;
				const queryStr = child.path.slice(queryIdx + 1);
				const params = new URLSearchParams(queryStr);
				const deptCode = params.get('deptCode') || '';
				return deptCode.includes(userInfo.orgId);
			});
			if (menu.children.length === 0) {
				menuList.splice(i, 1);
			}
		}
	}
}
const usePermissionStore = defineStore('permission', () => {
	const routes = ref<any[]>([]);
	const menuRoutes = ref<any[]>([]);
	const isRoutesGenerated = ref(false);
	const menus = ref<any[]>([]);

	const generateRoutes = () =>
		queryListMenu<any[]>({ key: 'board' })
			.then((response) => {
				let menuData: any[] = [];
				if (response && (response as any).data) {
					menuData = (response as any).data;
				} else if (Array.isArray(response)) {
					menuData = response;
				}

				isRoutesGenerated.value = true;
				if (menuData.length === 0) {
					return [];
				}
				const filterMenus: any =
					menuData.find((ele: any) => ele.name === 'zszh_admin') || {};
				const userInfo: any = authService.getUserInfo() || {};

				traverseAndFilter(filterMenus.children, userInfo);

				routes.value = transformMenuToRoutes(filterMenus.children || []);
				menus.value = transformMenu(filterMenus.children || []);
				// 特定用户特定默认路径
				const obj = UserPathConfig.find((ele) => ele.account === userInfo.loginId)
				const redirectPath = obj ? obj.path : getRedirectPath(menus.value)
				// 拼接根路径重定向和其他原本子级页面
				routes.value.unshift(pageRoutes(redirectPath));

				return routes.value;
			})
			.catch((err) => {
				console.log('err', err);
				return [];
			});

	const addRoutes = (data: any[]) => {
		data.forEach((route) => {
			router.addRoute(route);
		});

		router.addRoute({
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: NotFound,
		});
	};

	const resetRoutes = () => {
		routes.value = [];
		menuRoutes.value = [];
		isRoutesGenerated.value = false;
	};

	return {
		routes,
		menuRoutes,
		isRoutesGenerated,
		generateRoutes,
		addRoutes,
		resetRoutes,
		menus,
		transformMenu
	};
});
export default usePermissionStore;
