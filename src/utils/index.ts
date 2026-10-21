/**
 * @description 格式化数字
 * @param num 需要格式化的数字或者字符串
 * @returns
 */

const EmptyConst= '—'

const formatNumber = (num: number | string, minimumFractionDigits: number = 0, maximumFractionDigits: number = 2) =>
	Number(num || 0).toLocaleString('zh', {
		minimumFractionDigits,
		maximumFractionDigits
	});

/**
 * @description 获取静态资源路径
 * @param imgPath 图片的相对/assets/images/的绝对路径
 * @returns 图片的绝对路径
 */
const getUrl = (imgPath: string): string =>
	new URL(`../assets/images/${imgPath}`, import.meta.url).href;

/**
 * @description 获取当前月日
 */
const getCurrentDate = () => {
	const date = new Date();
	const MM = date.getMonth() + 1;
	const DD = date.getDate();
	return `${MM}月${DD}日`;
};

/**
 * @description 获取星期几
 */
const getDay = () => {
	const a = ['日', '一', '二', '三', '四', '五', '六'];
	const week = new Date().getDay();
	return `星期${a[week]}`;
};

/**
 * @description 跳转打开新主题
 * @param url 跳转的链接
 */
const switchTo = (url: string) => {
	if (!url) return;
	if (url.includes('http') || url.includes('https')) {
		window.location.href = url;
	} else {
		window.location.href =
			window.location.origin + window.location.pathname + url.replace('./', '');
	}
};

const getSize = (size: number) => {
	const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
	const fontSize = clientWidth / 1920;
	return fontSize * size;
};

const getweekday = (date: any) => {
	const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
	const week = weekArray[new Date(date).getDay()]; // 注意此处必须是先new一个Date
	return `星期${week}`;
};

/**
 * @description 格式化数字为百分比格式
 * @param {Number|String} num 需要格式化的数字
 * @param {Number} fractionDigits 保留的小数位
 * @return {String}
 */
const formatNumberToPercent = (num: number | string, fractionDigits: number): string => {
	const transNum = Number(num) || 0;
	return transNum.toLocaleString('zh', {
		style: 'percent',
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
};

/**
 * @description 格式化echarts表格取值
 * @param list
 * @param monthKey 月份字段名
 * @param valKey 取值字段名
 * @returns
 */
const formatValueList = (list: any, monthKey: string, valKey: string) => {
	const arr = new Array(12).fill(0);
	list.forEach((item: any) => {
		arr[Number(item[monthKey])-1] = item[valKey];
	});
	return arr;
}
const monthList = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

/**
 * 将 Excel 日期序列号转换为 YYYY-MM-DD 格式
 * @param serial Excel 日期序列号（从 1900-01-01 开始的天数）
 * @returns 格式化后的日期字符串
 */
const excelToFormattedDate = (serial: number): string => {
    // 1. 处理 Excel 的 1900 年闰年错误（1900-02-29 不存在）
    const needsFix = serial >= 60; // 序列号 >=60 时需要修正

    // 2. 计算基准日期（1899-12-31 00:00:00 UTC）
    // 注意：Excel 的 1900-01-01 = 序列号 1
    const baseDate = new Date(Date.UTC(1899, 11, 31));

    // 3. 计算目标日期（UTC 时间避免时区问题）
    const targetDate = new Date(baseDate.getTime() + serial * 86400000);

    // 4. 应用闰年修正（序列号 >=60 时减 1 天）
    if (needsFix) {
        targetDate.setUTCDate(targetDate.getUTCDate() - 1);
    }

    // 5. 格式化为 YYYY-MM-DD（UTC 时间）
    return [
        targetDate.getUTCFullYear(),
        String(targetDate.getUTCMonth() + 1).padStart(2, '0'),
        String(targetDate.getUTCDate()).padStart(2, '0')
    ].join('-');
};
const isEmpty = (val: null | undefined | number | string) => {
	if (val === 0 || val === '0') {
		return false;
	}
	if (!val) {
		return true;
	}
	if (val === 'NULL' || val === 'null' || val === 'undefined') {
		return true;
	}
	return false;
};
const generateUUID = () =>{
	let uuid = ''
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length

	for (let i = 0; i < 32; i +=1) {
		const randomIndex = Math.floor(Math.random() * charactersLength)
		uuid += characters[randomIndex]
	}

	return uuid
}

const formatNumber2 =(num: number | string) =>
	num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const handleRateValue = (
	val: null | undefined | number | string,
	number:number = 1
) => {
	if (isEmpty(val)) {
		return ''
	}
	const rate = parseFloat(`${val}`)
	if (rate < 0.1 && rate > -0.1) {
		return rate.toFixed(2);
	}
	return rate.toFixed(number)
};

/**
 *  @description 处理空值，用于前端展示
 *  @param val 需要处理的值
 *  @param defaultText 可选传，需要返回的默认展示文案
 *  @returns 空值 -> '--' or defaultText, 其余返回输入值
 */
const handleNullishValue = (
	val: null | undefined | number | string,
	isZero?: boolean,
	defaultText?: string | number
) => {
	if (defaultText !== undefined) {
		return val ?? defaultText;
	}
	if (isZero) {
		return (isEmpty(val) || Number(val) === 0) ? '0' : val
	}
	return (isEmpty(val) || Number(val) === 0) ? EmptyConst : val
};

/**
 * 计算堆叠图表的最大值（适配 data 为对象数组的情况）
 * @param {Array} seriesData - 图表的 series 数据数组
 * @param {number} minLimit - Y轴最小保底值，默认为 5
 * @returns {number} 计算后的最大值
 */
const getStackMaxValue = (seriesData: any[] = [], minLimit: number = 5): number => {
    if (!seriesData || seriesData.length === 0) {
        return minLimit;
    }

    const dataLength = seriesData[0]?.data?.length || 0;
    if (dataLength === 0) return minLimit;

    // 核心修改：取值逻辑从 series.data[i] 改为 series.data[i]?.value
    const stackSums = Array.from({ length: dataLength }, (_, i) => 
        seriesData.reduce((sum, series) => {
            const item = series.data?.[i];
            // 兼容两种情况：如果是对象取 .value，如果是数字直接取
            const val = (typeof item === 'object' && item !== null) ? (item.value ?? 0) : (item ?? 0);
            return sum + val;
        }, 0)
    );

    return Math.max(minLimit, ...stackSums);
};
/**
 * 判断是否为当年值
 * @param {string} str 
 * @returns {boolean} 年份为当年值 返回 true，否则返回 false
 */
const isCurrentYear  = (str: string | undefined): boolean => {
	if (!str) return false;
	const yearMatch = str.match(/^(\d{4})/);
	if (!yearMatch) return false;
	const year = Number(yearMatch[1]);
	if (Number.isNaN(year)) return false;
	const currentYear = new Date().getFullYear();
	return year === currentYear;
};
/**
 * @description 替换富文本中图片地址的 host，保留 gtf-api 路径前缀
 * 用于兼容不同网络环境
 * @param html 富文本字符串
 * @returns 替换后的富文本字符串
 */
const replaceGtfApiUrl = (html: string | undefined | null): string => {
	if (!html) return '';
	return html.replace(/https?:\/\/[^/]+(\/[^/\s"']*gtf-api\/)/g, `${window.location.origin}$1`);
};

export {
	formatNumber,
	formatNumber2,
	handleRateValue,
	EmptyConst,
	getUrl,
	getCurrentDate,
	getDay,
	switchTo,
	getSize,
	getweekday,
	formatNumberToPercent,
	formatValueList,
	monthList,
	excelToFormattedDate,
	isEmpty,
	generateUUID,
	handleNullishValue,
	getStackMaxValue,
	isCurrentYear,
	replaceGtfApiUrl
};
