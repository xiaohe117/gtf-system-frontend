/* eslint-disable no-shadow */
import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import CryptoJS from 'crypto-js';
import authService from '@/services/auth';
import { saveAs } from 'file-saver';

export const method = {
	POST: 'post',
	GET: 'get',
	DEL: 'delete',
	PUT: 'put',
};

export const prefix = import.meta.env.VITE_URL_PREFIX;

const token = import.meta.env.VITE_APP_TOKEN;

const instance: AxiosInstance = axios.create({
	baseURL : import.meta.env.VITE_APP_BASE_API, 
	timeout: 1000 * 60,
});

instance.interceptors.request.use(
	(config) => config,
	(err) => Promise.reject(err)
);

instance.interceptors.response.use(
	(result: AxiosResponse) => {
		// blob 响应保留原始响应头，便于下载时从 Content-Disposition 解析文件名
		if (result.config.responseType === 'blob' && result.data) {
			result.data.headers = result.headers;
		}
		return result.data;
	},
	(err) => {
		console.log('err', err)
		if (err.response?.status === 401) {
			// console.log('401')
			authService.loginTimeout();
		} else if (err.response?.status === 403) {
			// console.log('403')
			authService.loginTimeout();
		} else if (err.response?.status === 500) {
			console.log('500')
		} else if (err.response?.status === 404) {
			// 404 时返回空数据，避免页面一直请求该接口
			return { data: [], code: 404 };
		}
		return Promise.reject(err);
	}
);

interface IResponse<T> {
	errcode: number;
	errCode: number | string;
	code: number;
	errmsg: string;
	msg: string;
	data: T;
	success: boolean;
}


/** 从 Content-Disposition 响应头解析文件名，兼容 filename= 与 filename*=UTF-8'' 两种格式 */
const parseFileNameFromDisposition = (disposition: string): string => {
	if (!disposition) return '';
	// 优先 filename*=UTF-8''xxx（文件名通常被 URL 编码）
	const starMatch = disposition.match(/filename\*\s*=\s*[^']*''([^;]+)/i);
	const name = (
		starMatch?.[1] ||
		disposition.match(/filename\s*=\s*"?([^";]+)"?/i)?.[1] ||
		''
	)
		.trim()
		.replace(/^"|"$/g, '');
	if (!name) return '';
	try {
		return decodeURIComponent(name);
	} catch {
		return name;
	}
};

// 下载文件
export function download({ url, data, method, params, fileName }: any) {
	return new Promise<void>((resolve, reject) => {
		instance({
			method: method || 'post',
			url,
			responseType: 'blob',
			data,
			params,
		}).then(async (res: any) => {
			if(res.type === 'application/json'){
				const reader = new FileReader()
				reader.onload = (e) => {
				  const data = e?.target?.result
				  try {
					const json = JSON.parse(String(data))
					reject(json)
				  } catch (err) {
					reject(res)
				  }
				}
				reader.readAsText(res)
				return
			  }
				const blob = new Blob([res], { type: res.type });
				// 未传 fileName 时，回退到接口 Content-Disposition 响应头中的文件名
				const disposition = String(
					res.headers?.['content-disposition'] ||
						res.headers?.get?.('content-disposition') ||
						''
				);
				saveAs(blob, fileName || parseFileNameFromDisposition(disposition))
				resolve()
			})
			.catch(err => {
				reject(err);
			});
	});
}

/*
instance.interceptors.response.use(
	(result: AxiosResponse) => result.data,
	(err) => Promise.reject(err)
);
*/

export function http<T>(
	method: string,
	url: string,
	reqParams: AxiosRequestConfig
): Promise<IResponse<T>> {
	const timestamp = (Date.now() / 1000).toFixed();
	const nonce = '2fc62edd-03ee-4c32-8db8-e7e9c77ed05a';
	const signature = CryptoJS.SHA256(timestamp + token + nonce + timestamp).toString(CryptoJS.enc.Hex).toUpperCase();
	const commonHeader = {
		'x-tif-paasid': 'sjfnjczt',
		'x-tif-signature': signature,
		'x-tif-timestamp': timestamp,
		'x-tif-nonce': nonce,
		nonce,
		timestamp,
		signature,
	};

	// 公共或私有请求头
	const headers: object = Object.assign(commonHeader, reqParams.headers);

	const requestData = {
		url,
		headers,
		method,
		params: reqParams.params,
		data: reqParams.data,
	};
	return instance(requestData);
}
