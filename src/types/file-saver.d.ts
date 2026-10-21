/* eslint-disable no-unused-vars */
// file-saver 未内置类型声明，补充模块声明避免 http.ts 隐式 any 报错
declare module 'file-saver' {
	export function saveAs(data: Blob | string, filename?: string, options?: { autoBom?: boolean }): void;
}
