import axios from 'axios';
import CryptoJS from 'crypto-js';
import { prefix } from '@/api/http';

/**
 * 生成带签名的请求头（与 http.ts 保持一致的签名算法）
 */
export const generateSignedHeaders = () => {
	const timestamp = (Date.now() / 1000).toFixed();
	const nonce = '2fc62edd-03ee-4c32-8db8-e7e9c77ed05a';
	const token = import.meta.env.VITE_APP_TOKEN;
	const signature = CryptoJS.SHA256(timestamp + token + nonce + timestamp)
		.toString(CryptoJS.enc.Hex)
		.toUpperCase();
	return {
		'x-tif-paasid': 'sjfnjczt',
		'x-tif-signature': signature,
		'x-tif-timestamp': timestamp,
		'x-tif-nonce': nonce,
		nonce,
		timestamp,
		signature,
	};
};

/**
 * 从 content-disposition 解析文件名，解析失败则返回默认名
 */
const parseFilename = (contentDisposition: string, defaultFilename: string): string => {
	if (contentDisposition && contentDisposition.includes('filename=')) {
		const match = /filename=(.*?)(;|$)/.exec(contentDisposition);
		if (match && match[1]) {
			return decodeURIComponent(match[1].trim().replace(/"/g, ''));
		}
	}
	return defaultFilename;
};

/**
 * 下载 Blob 文件
 * @returns true 下载成功；false 为 JSON 错误响应未下载
 */
export const downloadBlob = (
	blob: Blob,
	defaultFilename: string,
	contentDisposition?: string
): boolean => {
	// 后端错误时可能返回 JSON，过滤一下
	if (blob.type && blob.type.includes('application/json')) {
		return false;
	}
	const filename = contentDisposition
		? parseFilename(contentDisposition, defaultFilename)
		: defaultFilename;
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
	return true;
};

/**
 * 导出文件（GET 请求下载 Blob 并触发下载）
 * @param url 接口路径（不含 baseURL），如 `/industry-report/export`
 * @param defaultFilename 默认文件名
 */
export const exportFile = async (url: string, defaultFilename: string): Promise<boolean> => {
	const headers = generateSignedHeaders();
	const res = await axios({
		method: 'get',
		baseURL: import.meta.env.VITE_APP_BASE_API,
		url: `${prefix}${url}`,
		responseType: 'blob',
		timeout: 1000 * 60,
		headers,
	});
	const blob = res.data as Blob;
	const contentDisposition = res.headers['content-disposition'];
	return downloadBlob(blob, defaultFilename, contentDisposition);
};
