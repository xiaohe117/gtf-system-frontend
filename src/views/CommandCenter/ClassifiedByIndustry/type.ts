export interface TabItem {
	id: number;
	label: string;
}

export interface IndustryItem {
	key: string;
	label: string;
	disabled?: boolean;
}

export interface IndustryGroup {
	title: string;
	items: IndustryItem[];
}

export interface IndustryTypeItem {
	industryCode: number;
	industrialCategory: string;
	subIndustry: string;
	industryType: string;
}

export interface EnterpriseData {
	id: string;
	industryCode: string;
	enterpriseType: string;
	enterpriseTypeName: string;
	enterpriseCode: string;
	enterpriseName: string;
	registeredCapital: string;
	belongIndustry: string;
	sort: number;
	dataSource: string;
	dataTime: string;
	sourceChannel: string;
	createdTime: string;
	updatedTime: string;
	remark: string;
	recReason: string;
}

export interface TopicSection {
	title: string;
	content: string;
}

export interface TopicItem {
	key: string;
	title: string;
	subtitle?: string;
	dataSource?: string;
	dataTime?: string;
	sections: {
		experience: TopicSection;
		situation: TopicSection;
	};
}

/** 综合优势侧边栏导航项 */
export interface NavItem {
	id: string;
	label: string;
}

/** 综合优势 tab 项 */
export interface AdvTab {
	id: string;
	title: string;
}

/** 综合优势 tab 项（含禁用态） */
export interface AdvTabItem {
	id: string;
	title: string;
	/** 是否禁用点击 */
	disabled?: boolean;
}

/** 产业侧边栏子 tab 项（地区） */
export interface IndustrySubTab {
	name: string;
	code: string;
}

/** 产业顶部标签项（要素类型） */
export interface IndustryTopTag {
	name: string;
	elementType: number;
}

/** 定制菜单树叶子节点（子项） */
export interface CategoryItem {
	detailId: string;
	columnId: string;
	detailName: string;
	detailCode: string;
	sortOrder: number;
	isCustomized: boolean | null;
}

/** 定制菜单树分类节点 */
export interface CategoryTreeNode {
	columnId: string;
	columnName: string;
	columnCode: string;
	sortOrder: number;
	children: CategoryItem[];
}

/** getCustomizeMenuList 响应数据结构 */
export interface CustomizeMenuResult {
	customizedDetailIds: string[];
	categoryTree: CategoryTreeNode[];
	/** 产业(detailCode) → 有数据的区(detailCode) 映射 */
	industryRegionMap: Record<string, string[]>;
}

/** 复选项 */
export interface CheckOption {
	key: string;
	label: string;
}

/** 产业内容项 */
export interface CustomIndustry {
	id: string;
	name: string;
	subTabs: IndustrySubTab[];
	topTags: IndustryTopTag[];
}

/** 六要素接口返回项 */
export interface SixElementItem {
	id: string;
	industryCode12218: string;
	elementType: number;
	elementTypeName: string;
	comparativeAdvantage: string;
	detailInfo: string;
	dataSource: string;
	sourceChannel: string;
	createdTime: string;
	updatedTime: string;
	remake: string;
}

/** 区 tab 项 */
export interface DistrictTab {
	code: string;
	name: string;
}

/** 十大行动成效接口返回项 */
export interface EffectItem {
	effectCode: string;
	progress: string;
	progressStatus: string;
	effectName: string;
	detailInfo: string;
	detailDataSource?: string;
	detailDataTime?: string;
}

/** 综合投资优势接口返回项 */
export interface ComprehensiveAdvItem {
	id: string;
	masterId: string;
	title: string;
	items: unknown[];
	rawDescription: string;
	dataSourceName: string;
	dataTime: string;
	sortOrder: number;
	defaultActive: boolean;
}

/** 羊城硬核实力接口返回项 */
export interface HardStrengthItem {
	id: string;
	masterId: string;
	title: string;
	items: unknown[];
	rawDescription: string;
	dataSourceName: string;
	dataTime: string;
	sortOrder: number;
}

/** 羊城硬核实力卡片 */
export interface StrengthCard {
	id: string;
	title: string;
	briefContent: string;
	fullContent: string;
}

/** 分析建议附件项 */
export interface MaterialItem {
	id: string;
	fileName: string;
	filePath: string;
	fileSize: string;
	fileSuffix: string;
	fileType: string;
	fileUrl: string;
	previewUrl: string;
	targetId: string;
	targetType: string;
	targetInt: string;
	isValid: string;
	dataSourceName?: string;
	dataTime?: string;
	createTime: string;
	detailDataSource?: string;
	detailDataTime?: string;
}

/** 分析建议项 */
export interface AnalySuggestItem {
	id: string;
	industryCode: string;
	existingProblem: string;
	nextPlan: string;
	unit: string;
	dateSource: string;
	sourceChannel: string;
	createdTime: string;
	updatedTime: string;
	remark: string;
	detechTeam: string;
	directionDataSource?: string;
	directionDataTime?: string;
	problemDataSource?: string;
	problemDataTime?: string;
	planDataSource?: string;
	planDataTime?: string;
}

/** 重点企业 tab 数据 */
export interface KeyEnterpriseTabData {
	inGzChainLeaderEnterpriseList: EnterpriseData[];
	industryInvestmentTargetEnterpriseList: EnterpriseData[];
	cityMainTargetEnterpriseList: EnterpriseData[];
	inGzChainLeaderEnterpriseCount: number;
	industryInvestmentTargetEnterpriseCount: number;
	cityMainTargetEnterpriseCount: number;
	dataSource?: string;
	dataTime?: string;
}
