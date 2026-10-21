export interface FilterBarSearch {
	industryChain?: string;
	dateRange?: string[];
}

// 情报卡片展示字段
export interface InfoCardItem {
	id: number | string;
	title: string;
	link: string;
	url: string;
	date: string;
	region: string;
	location: string;
	industryKey: string;
	industry: string;
	organization: string;
	coOrganizer: string;
	website: string;
	sentiment: string;
	source: string;
	dateAndWeb: string;
	content: string;
	// 原始发布时间（未被截断为 date）
	pubTime?: string;
	// 公司统计（接口逗号分隔，已转换为数组）
	companyStats?: string[];
	// 标签数组：情感 + 标签列表（由 sentiment 和 tagList 合并）
	tags?: string[];
}

// 列表接口请求参数（由 InfoComp 组装后传给外部 fetchList）
export interface FetchListParams {
	pageNum: number;
	pageSize: number;
	entity: Record<string, unknown>;
}

// 列表接口返回结果
export interface FetchListResult {
	list: InfoCardItem[];
	total: number;
}
