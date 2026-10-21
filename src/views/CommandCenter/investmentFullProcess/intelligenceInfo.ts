export type InfoTabKey = 'meeting' | 'news';

export type InfoItem = {
	id?: number | string;
	tag: string;
	title: string;
	date: string;
	/** 高层会见跳转链接 */
	link?: string;
	/** 企业咨询跳转链接 */
	url?: string;
};

export const truncateTag = (tag: string) => {
	if (!tag) return '';
	return tag.length > 4 ? `${tag.slice(0, 4)}...` : tag;
};

export const formatInfoDate = (value?: string | null) => (value ?? '').slice(0, 10);

type ApiListData<T> =
	| T[]
	| {
			records?: T[];
			rows?: T[];
			list?: T[];
	  };

/** 接口列表可能直接返回数组，也可能包在 records/rows/list 中 */
export const getApiList = <T>(data: ApiListData<T> | null | undefined): T[] => {
	if (Array.isArray(data)) return data;
	return data?.records || data?.rows || data?.list || [];
};

export const normalizeLeaderVisitInfo = (item: {
	id?: number | string;
	authorName?: string;
	title?: string;
	createdAt?: string | null;
	link?: string | null;
}): InfoItem => ({
	id: item.id,
	tag: item.authorName || '-',
	title: item.title || '-',
	date: formatInfoDate(item.createdAt),
	link: item.link || '',
});

export const normalizeEnterpriseNewsInfo = (item: {
	id?: number | string;
	source?: string;
	title?: string;
	pubTime?: string | null;
	url?: string | null;
}): InfoItem => ({
	id: item.id,
	tag: item.source || '-',
	title: item.title || '-',
	date: formatInfoDate(item.pubTime),
	url: item.url || '',
});

/** 打开情报跳转链接：高层会见用 link，企业咨询用 url */
export const openInfoLink = (item: InfoItem, type: InfoTabKey) => {
	const href = type === 'meeting' ? item.link : item.url;
	if (!href) return;
	window.open(href, '_blank');
};
