/**
 * 待办事项相关类型定义
 */

/** 顶部汇总表格行 */
export interface SummaryRow {
	entTypeName: string; // 企业类型：央企 / 外企 / 民企 / 国企
	visitedCount: number; // 牵头任务 - 已走访
	pendingCount: number; // 牵头任务 - 待走访
	primaryCount: number; // 牵头任务 - 小计
	otherCompany: number; // 其他企业
	clueCount: number; // 形成招商线索 - 个数
	clueAmount: number; // 形成招商线索 - 金额（亿元）
	projectCount: number; // 形成招商项目 - 个数
	projectAmount: number; // 形成招商项目 - 金额（亿元）
	matterCount: number; // 议定事项 - 个数
	followedCount: number; // 议定事项 - 已完成
	matterInProgressCount: number; // 议定事项 - 推进中
	matterPendingCount: number; // 议定事项 - 待推进

}

/** 右侧分配人员 */
export interface AssignedPerson {
	id: string;
	name: string;
	role?: string;
}

/** 月份状态 */
export interface MonthStatus {
	month: number; // 1-12
	status: 'visited' | 'pending' | ''; // 已拜访 / 待拜访
}

/** 附件信息 */
export interface Attachment {
	id: string;
	visitId: string;
	fileName: string;
	filePath: string;
	fileSize: number;
	fileSuffix: string;
	fileType: string;
	fileUrl: string;
	previewUrl: string;
	createdTime: string;
}

/** 单个走访项 */
export interface TripItem {
	id: string;
	companyName: string;
	attachments?: Attachment[]; // 附件列表
	status: 'pending' | 'unvisited' | 'visited'; // 待确认 / 未走访 / 已走访
	submitUnit: string; // 提请单位
	clueCount: number; // 招商线索条数
	clueAmount: string; // 招商线索金额
	industry: string; // 所属产业
	projectCount: number; // 落地项目条数
	projectAmount: string; // 落地项目金额
	latestDockContent: string; // 最新对接记录
	agreedCount: number; // 议定事项条数
	agreedDoneCount: number; // 已完成议定事项条数
	tagNames?: string[]; 
}

/** 行程分组（如 广州行程、香港行程） */
export interface TripSection {
	id: string;
	title: string;
	count: number;
	expanded: boolean;
	items: TripItem[];
}

/** 整个待办事项数据 */
export interface TodoData {
	totalCount: number; // 共 N 条
	summary: SummaryRow[];
	assignedList: AssignedPerson[];
	currentYear: number;
	monthList: MonthStatus[];
	tripList: TripSection[];
}