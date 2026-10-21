/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2026-03-30 09:57:50
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-02 17:54:01
 */

class ServiceUrl {
	private readonly locationUrl = window.location.origin;

	// 统一框架入口地址
	public clientUrl = `${this.locationUrl}${import.meta.env.VITE_APP_REDIRECT_PREFIX}`;

	// 管理后台地址
	public adminUrl = import.meta.env.DEV
		? `http://localhost:5180/#/`
		: `${this.locationUrl}${import.meta.env.VITE_APP_ADMIN_PREFIX}#/`;

	// 内网登陆地址
	private loginIntraneUrl = import.meta.env.VITE_APP_PROJECT_CENTER_URL;

	public getQmSysUrl(): string {
		// 本地开发
		if (import.meta.env.DEV) {
			return this.loginIntraneUrl;
		}
		return this.locationUrl;
	}

	/**
	 * 齐明 iframe 嵌入基址：始终用当前域。
	 * 本地通过 Vite 代理 /pc → 齐明，从而共享 localStorage 登录态。
	 */
	public getQmEmbedUrl(): string {
		return this.locationUrl;
	}

	public originUrl = this.locationUrl;

	// 获取中智ai地址
	public getAiUrl(): string {
		const origin = import.meta.env.DEV ? this.loginIntraneUrl : this.locationUrl;
		return `${origin}${import.meta.env.VITE_APP_ZZAI_PREFIX}`;
	}

	// 获取奇明登陆地址
	public getLoginUrl(): string {
		// 本地开发
		if (import.meta.env.DEV) {
			return this.loginIntraneUrl;
		}
		return this.locationUrl;
	}
}

export default new ServiceUrl();
