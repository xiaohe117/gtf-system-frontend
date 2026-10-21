interface Column<T = any> {
	prop: string;
	label?: string;
	type?:
		| 'slot'
		| 'tag'
		| 'tags'
		| 'num'
		| 'number'
		| 'rate'
		| 'column'
		| 'rate-add'
		| 'tag-select'
		| 'amount';
	slotName?: string;
	typeVal?: string | number;
	visible?: boolean;
	sortable?: boolean | 'custom';
	width?: string | any;
	align?: string;
	className?: string;
	showToolTip?: boolean;
	cellWidth?: string | any;
	unit?: string;
	children?: Column<T>[];
	summaryField?: string;
	fixed?: string | boolean;
	isSearch?: boolean;
	searchProp?: string;
	searchType?: 'input' | 'select';
	selectedOptions?: any[];
	slotHeader?: boolean;
	slotHeaderText?: string | any;
	// eslint-disable-next-line no-unused-vars
	changeLabel?: (p: T) => void;
	searchInputType?: string;
	options?: any[];
	valueType?: string;
	actionText?: string;
}

interface ResData<T> {
	data: T;
}
interface Ireporte {
	briefing_link: string;
	word_link: string;
	briefing_time: string;
	briefing_title: string;
	md_id: number;
}

interface ResTableStatTime {
	chart_type: string;
	sign_colon: string;
	show_name: string;
	insert_time: string;
	md_id: number;
	stat_time?: string;
}

export type { ResData, Ireporte, ResTableStatTime, Column };
