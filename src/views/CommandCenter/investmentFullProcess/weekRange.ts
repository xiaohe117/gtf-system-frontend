import dayjs from 'dayjs';

/** 周区间默认时刻：周五 18:00 */
export const WEEK_RANGE_TIME = '18:00:00';

/** 将日期对齐到统计周边界时刻（周五 18:00） */
function atWeekBoundary(date: dayjs.Dayjs) {
	const [hour, minute, second] = WEEK_RANGE_TIME.split(':').map(Number);
	return date.hour(hour).minute(minute).second(second).millisecond(0);
}

/** 取某天所在统计周的起始周五（周五 18:00 为界） */
export function getWeekStartFriday(date?: dayjs.Dayjs | Date | string) {
	const d = dayjs(date);
	const friday = d.startOf('day').subtract((d.day() + 2) % 7, 'day');

	if (d.day() === 5) {
		const fridayBoundary = atWeekBoundary(friday);
		if (d.isBefore(fridayBoundary)) {
			return friday.subtract(7, 'day').format('YYYY-MM-DD');
		}
	}

	return friday.format('YYYY-MM-DD');
}

/** 统计周结束周五（下一周五，展示用） */
export function getWeekEndFriday(startFriday: string) {
	return dayjs(startFriday).add(7, 'day').format('YYYY-MM-DD');
}

/** 根据任意日期得到所在周 [起始周五, 结束周五] */
export function getWeekRangeByDate(date?: dayjs.Dayjs | Date | string): [string, string] {
	const start = getWeekStartFriday(date);
	return [start, getWeekEndFriday(start)];
}

/**
 * 最新完整周：本周五 18:00 - 下周五 18:00，且已结束
 * 以当天实时时间为准（默认 dayjs()，不写死日期）
 * 例：当前 7 月 9 日 → 6.26-7.3；7 月 10 日 18:00 后 → 7.3-7.10
 */
export function getLatestCompleteWeekRange(
	now: dayjs.Dayjs | Date | string = dayjs(),
): [string, string] {
	const current = dayjs(now);
	const weekStart = dayjs(getWeekStartFriday(current));
	const weekEnd = weekStart.add(7, 'day');
	const weekEndBoundary = atWeekBoundary(weekEnd);

	const endFriday = current.isAfter(weekEndBoundary)
		? weekEnd
		: weekEnd.subtract(7, 'day');
	const startFriday = endFriday.subtract(7, 'day');

	return [startFriday.format('YYYY-MM-DD'), endFriday.format('YYYY-MM-DD')];
}

/** 页面/控件默认周区间（实时取当天） */
export function getDefaultWeekRange(): [string, string] {
	return getLatestCompleteWeekRange(dayjs());
}

/** 页面展示用日期区间 → 接口查询用（含默认 18:00:00） */
export function toQueryDateTimeRange(range: [string, string]): [string, string] {
	return [`${range[0]} ${WEEK_RANGE_TIME}`, `${range[1]} ${WEEK_RANGE_TIME}`];
}

/** 控件展示：6月19日18:00 -6月26日18:00 */
export function formatWeekRangeDisplay(range: [string, string] | null) {
	if (!range) return '';

	const formatPart = (date: string) =>
		dayjs(`${date} ${WEEK_RANGE_TIME}`).format('M月D日HH:mm');
	const [start, end] = range;

	return `${formatPart(start)} -${formatPart(end)}`;
}
