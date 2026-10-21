export interface ProcessItem {
	key: string;
	label: string;
	card: string;
	row: 'top' | 'bottom';
	multiline?: boolean;
}

/** 轨道背景图高度 480px（纯装饰） */
export const TRACK_HEIGHT = '4.8rem';

/** 轨道背景距顶部 50px */
export const TRACK_TOP = '0.5rem';

/** 菜单收起时轨道距左侧 100px */
export const TRACK_LEFT_COLLAPSED = '1rem';

/** 第一行距顶部 -20px */
export const ROW_1_TOP = '-0.1rem';

/** 第二行距顶部 430px */
export const ROW_2_TOP = '4.4rem';

/** 节点与卡片间距 6px */
export const CARD_NODE_GAP = '0.06rem';

/** 流程节点整体宽 95px，高 110px */
export const NODE_WIDTH = '0.95rem';
export const NODE_HEIGHT = '1.09rem';

/** 节点球图 process-ball 103×90px */
export const NODE_BALL_WIDTH = '1.03rem';
export const NODE_BALL_HEIGHT = '0.9rem';

/** 节点底座 process-under 95×44px */
export const NODE_UNDER_WIDTH = '0.95rem';
export const NODE_UNDER_HEIGHT = '0.44rem';

/** 卡片高度 329px */
export const CARD_HEIGHT = '3.25rem';

/**
 * 流程区内容最小高度（第二行 top + 节点 + 间距 + 卡片 + 悬停余量）
 * 4.4 + 1.09 + 0.06 + 3.25 + 0.2 ≈ 9.0rem
 * 矮屏优先按可用高度压缩布局 rem（见 Index layoutFit），避免 transform:scale 发糊；
 * 仅在压缩到下限仍不够时才滚动。
 */
export const PROCESS_CONTENT_HEIGHT_REM = 9;

/** 内容区右侧距轨道 40px */
export const CARD_ROW_RIGHT_MARGIN = '0.4rem';

/** 菜单展开：卡片宽 403px，列间距 16px */
export const CARD_WIDTH_EXPANDED = '4.03rem';
export const CARD_COL_GAP_EXPANDED = '0.16rem';

/** 菜单收起：卡片宽 430px，列间距 29px */
export const CARD_WIDTH_COLLAPSED = '4.3rem';
export const CARD_COL_GAP_COLLAPSED = '0.29rem';

export const processItems: ProcessItem[] = [
	{ key: 'planning', label: '谋划', card: 'planning', row: 'top' },
	{ key: 'meeting', label: '会谈', card: 'meeting', row: 'top' },
	{ key: 'leads', label: '线索', card: 'leads', row: 'top' },
	{
		key: 'negotiation',
		label: '在谈\n项目',
		card: 'negotiation',
		row: 'top',
		multiline: true,
	},
	{
		key: 'production',
		label: '投产\n(开票)',
		card: 'production',
		row: 'bottom',
		multiline: true,
	},
	{ key: 'start', label: '开工', card: 'start', row: 'bottom' },
	{
		key: 'register',
		label: '注册\n(备案)',
		card: 'register',
		row: 'bottom',
		multiline: true,
	},
	{ key: 'signing', label: '签约', card: 'signing', row: 'bottom' },
];

const PROJECT_TOP5_TABS = ['市领导关注', '预计投资额大', '需关注'];

export const projectStages = [
	{ key: 'negotiation', title: '在谈项目', tabs: PROJECT_TOP5_TABS, activeTab: '市领导关注' },
	{ key: 'signing', title: '签约', tabs: PROJECT_TOP5_TABS, activeTab: '市领导关注' },
	{ key: 'register', title: '注册(备案)', tabs: PROJECT_TOP5_TABS, activeTab: '市领导关注' },
	{ key: 'start', title: '开工', tabs: PROJECT_TOP5_TABS, activeTab: '市领导关注' },
	{ key: 'production', title: '投产(开票)', tabs: PROJECT_TOP5_TABS, activeTab: '市领导关注' },
];
