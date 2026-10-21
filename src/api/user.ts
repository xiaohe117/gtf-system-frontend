/*
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-04-09 09:27:45
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-17 10:13:55
 */
import { method, http, prefix } from '@/api/http';

// 获取token code:授权码
export const getToken = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-user/login`, { data:params });

// oa进入系统获取token
export const getOaToken = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/auth/oa/login`, { data:params });


// 获取⽤户信息
export const queryUserInfo = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-user/getUserInfo`, { params });

// 退出登录
export const logout = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-user/logout`, { params });

	// 获取菜单列表
export const queryListMenu = <T>(params: Object = {}) =>
http<T>(method.GET, `${prefix}/gtf-user/queryListMenu`, { params });


// 获取中智AI的ticket
export const getEmbedTickets = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-user/embed-tickets`, { data:params });
