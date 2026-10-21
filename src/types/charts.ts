interface BasicSeriesItem {
	name: string;
	data: number[] | string[];
	id?: string;
}
interface BarSeriesItem extends BasicSeriesItem {
	stack?: string;
}

interface LineSeriesItem extends BasicSeriesItem {
	smooth?: boolean;
}

type BarLineSeriesItem = BarSeriesItem &
	LineSeriesItem & {
		type?: 'bar' | 'line';
		yAxisIndex?: number;
	};

interface CategoryAxisOption {
	type: 'category';
	data: string[];
}

interface ValueAxisOption {
	type: 'value';
	name?: string;
	splitNumber: number;
	alignTicks?: boolean;
	min?: number;
	max?: number;
	interval?: number;
	axisLabel?: {
		formatter: string;
	};
}

interface PieSeriesItem {
	name: string;
	value: number;
	ratio?: number | string;
}

export type {
	BarSeriesItem,
	LineSeriesItem,
	BarLineSeriesItem,
	CategoryAxisOption,
	ValueAxisOption,
	PieSeriesItem,
};
