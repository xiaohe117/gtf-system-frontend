import { method, http, prefix } from '@/api/http';

export const uploadApi = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/file/upload`, { data:params });

// export const downloadFile = <T>(params: Object = {}) =>
// 	http<T>(method.GET, `${prefix}/file/download`, { params });


export const deleteFileById = <T>(params: Object = {}) =>
	http<T>(method.POST, `${prefix}/file/deleteFileById`, { data:params });


export const getFileNamesById = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/file/getFileNamesById`, { params });

export const downloadFile = (id:any) => {
	setTimeout(()=>{
		const url = `${prefix}/file/download?id=${id}`;
		const link = document.createElement("a");
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	}, 500)
}
