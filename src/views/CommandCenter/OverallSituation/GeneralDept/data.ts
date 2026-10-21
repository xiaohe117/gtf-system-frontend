
import { getQxbToken } from '@/api/industry';
// 解析 companyStats 字符串为对象数组
// 入参形如：{'eid':'xxx','name':'yyy'},{'eid':'zzz','name':'www'}
// 将单引号替换为双引号后整体作为 JSON 数组解析
export const parseStringData = (raw: unknown): any[] => {
	if (!raw) return [];
	const str = String(raw).trim();
	if (!str) return [];
	try {
		const parsed = JSON.parse(`[${str.replace(/'/g, '"')}]`);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

// 启信宝相关页面地址常量
const QXB_BASE_URL = 'https://z-plugin.qixin.com/third-login?tenant=gd_gdyt1';
export const openQxbPage = async (returnUrl: string) => {
	const res = await getQxbToken();

	if (!res.data) return;

	const targetUrl = `${QXB_BASE_URL}&token=${res.data}&returnUrl=${encodeURIComponent(returnUrl)}`;

	window.open(targetUrl, '_blank');
};