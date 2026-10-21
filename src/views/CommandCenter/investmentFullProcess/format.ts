const isEmpty = (val: any) => val === null || val === undefined || val === '';

/** null/undefined/'' → '-'，其余按后端原值显示 */
export function formatDisplayValue(val: any) {
	if (isEmpty(val)) return '-';
	if (typeof val === 'string') {
		const text = val.trim();
		return text || '-';
	}
	if (typeof val === 'number') {
		if (Number.isNaN(val)) return '-';
		return String(val);
	}
	return String(val);
}

/** 百分数主体：后端已 *100，原样保留小数位，整数补 .0（如 0 → 0.0） */
function formatPercentBody(val: any) {
	if (isEmpty(val)) return '-';
	if (typeof val === 'string') {
		const text = val.trim().replace(/%$/, '');
		return text || '-';
	}
	if (typeof val === 'number') {
		if (Number.isNaN(val)) return '-';
		if (Number.isInteger(val)) return val.toFixed(1);
		return String(val);
	}
	const text = String(val).trim();
	return text || '-';
}

/** 百分数，固定带 % */
function formatPercentValue(val: any) {
	const body = formatPercentBody(val);
	return body === '-' ? '-' : `${body}%`;
}

/** 百分数括号展示，如 (12.3%) */
export function formatPercentParen(val: any) {
	const percent = formatPercentValue(val);
	return percent === '-' ? '(-%)' : `(${percent})`;
}

/** 带前缀的百分数，如 (占比 76.2%) */
export function formatLabeledPercent(val: any, label: string) {
	const percent = formatPercentValue(val);
	return percent === '-' ? `(${label} -%)` : `(${label} ${percent})`;
}

/** 线索转化百分数，如 (线索转化4.0%) */
export function formatConvertPercent(val: any) {
	const percent = formatPercentValue(val);
	return percent === '-' ? '(线索转化-%)' : `(线索转化${percent})`;
}

export default formatPercentParen;
