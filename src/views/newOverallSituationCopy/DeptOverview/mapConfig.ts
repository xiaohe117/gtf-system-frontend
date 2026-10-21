
export interface RegionCoordConfig {
	name: string;
	provinceName: string;
	code: string;
	coord: [number, number];
}

/** 地图点位坐标（前端写死，按 code 与接口数据匹配 name与svg的一致） */
export const regionCoordList: RegionCoordConfig[] = [
	{ name: '黑龙江', provinceName: '黑龙江省', code: '230000', coord: [380, 72] },
	{ name: '吉林', provinceName: '吉林省', code: '220000', coord: [362, 105] },
	{ name: '辽宁', provinceName: '辽宁省', code: '210000', coord: [345, 128] },
	{ name: '内蒙古', provinceName: '内蒙古自治区', code: '150000', coord: [280, 106] },
	{ name: '北京', provinceName: '北京市', code: '110000', coord: [298, 138] },
	{ name: '天津', provinceName: '天津市', code: '120000', coord: [304, 148] },
	{ name: '河北', provinceName: '河北省', code: '130000', coord: [290, 150] },
	{ name: '山西', provinceName: '山西省', code: '140000', coord: [272, 162] },
	{ name: '山东', provinceName: '山东省', code: '370000', coord: [310, 173] },
	{ name: '河南', provinceName: '河南省', code: '410000', coord: [278, 190] },
	{ name: '陕西', provinceName: '陕西省', code: '610000', coord: [250, 176] },
	{ name: '宁夏', provinceName: '宁夏回族自治区', code: '640000', coord: [228, 164] },
	{ name: '甘肃', provinceName: '甘肃省', code: '620000', coord: [210, 172] },
	{ name: '青海', provinceName: '青海省', code: '630000', coord: [158, 178] },
	{ name: '新疆', provinceName: '新疆维吾尔自治区', code: '650000', coord: [88, 128] },
	{ name: '西藏', provinceName: '西藏自治区', code: '540000', coord: [108, 218] },
	{ name: '四川', provinceName: '四川省', code: '510000', coord: [204, 218] },
	{ name: '重庆', provinceName: '重庆市', code: '500000', coord: [238, 224] },
	{ name: '湖北', provinceName: '湖北省', code: '420000', coord: [270, 216] },
	{ name: '安徽', provinceName: '安徽省', code: '340000', coord: [304, 208] },
	{ name: '江苏', provinceName: '江苏省', code: '320000', coord: [320, 202] },
	{ name: '上海', provinceName: '上海市', code: '310000', coord: [334, 214] },
	{ name: '浙江', provinceName: '浙江省', code: '330000', coord: [322, 232] },
	{ name: '江西', provinceName: '江西省', code: '360000', coord: [292, 242] },
	{ name: '湖南', provinceName: '湖南省', code: '430000', coord: [264, 240] },
	{ name: '贵州', provinceName: '贵州省', code: '520000', coord: [238, 252] },
	{ name: '云南', provinceName: '云南省', code: '530000', coord: [200, 268] },
	{ name: '广西', provinceName: '广西壮族自治区', code: '450000', coord: [248, 278] },
	{ name: '广东', provinceName: '广东省', code: '440000', coord: [278, 272] },
	{ name: '福建', provinceName: '福建省', code: '350000', coord: [312, 254] },
	{ name: '海南', provinceName: '海南省', code: '460000', coord: [252, 308] },
	{ name: '香港', provinceName: '香港特别行政区', code: '810000', coord: [282, 282] },
	{ name: '澳门', provinceName: '澳门特别行政区', code: '820000', coord: [274, 286] },
	{ name: '台湾', provinceName: '台湾省', code: '710000', coord: [328, 272] },
];

/** 区域企业数色阶，与 RegionCount 图例保持一致 */
export const regionCountConfig = [
	{ label: '<1', max: 1, color: 'rgba(221, 242, 255, 0.9)' },
	{label: '1-5', min: 1, max:5, color: 'rgba(135, 200, 255, 0.9)' },
	{ label: '6-10', min: 6, max: 10, color: 'rgba(64, 141, 251, 0.9)' },
	{ label: '10-50', min: 10, max: 50, color: 'rgba(22, 93, 255, 0.9)' },
	{ label: '≥50', min: 50, color: 'rgba(59, 96, 165, 0.9)' },
];

/** 后端返回的省份走访数据结构 */
export interface ProvinceVisitItem {
	provinceCode: string;
	provinceName: string;
	visitCount: number;
	entCount: number;
}

export interface HotVisitCityItem {
	cityName: string;
	visitCount: number;
	entCount: number;
}

/** 后端返回的接口数据结构 */
export interface RegionMapStatsResponse {
	totalVisitCount: number;
	hotVisitCityTop5: HotVisitCityItem[];
	industryDistributionTop5: { industryName: string; visitCount: number }[];
	provinceVisitList: ProvinceVisitItem[];
}

/** 处理后的地图数据结构 */
export interface ProcessedRegionData {
	name: string;
	code: string;
	visitCount: number;
	entCount: number;
}

export interface MergedRegionData extends RegionCoordConfig {
	visitCount: number;
	entCount: number;
}

/** 热门城市配置 */
export interface HotCityConfig {
	cityName: string;
	coord: [number, number];
}

/** 热门城市像素位置配置（前端写死） */
export const hotCityCoordList: HotCityConfig[] = [
	{ cityName: '北京市', coord: [298, 138] },
	{ cityName: '上海市', coord: [334, 214] },
	{ cityName: '广州市', coord: [278, 272] },
	{ cityName: '深圳市', coord: [278, 282] },
	{ cityName: '杭州市', coord: [322, 232] },
];

/** 按走访数（visitCount）计算区域色阶 */
export const getRegionColorByVisitCount = (visitCount: number) => {
	if (visitCount > 50) {
		return regionCountConfig[4].color;
	}
	if (visitCount > 10) {
		return regionCountConfig[3].color;
	}
	if (visitCount > 5) {
		return regionCountConfig[2].color;
	}
	if (visitCount >= 1) {
		return regionCountConfig[1].color;
	}
	return regionCountConfig[0].color;
};

/** ECharts SVG 地图读取 name 属性，将 data-name 同步为 name */
export const prepareChinaMapSvg = (svg: string) =>
	svg.replace(/\sdata-name="([^"]+)"/g, ' name="$1" data-name="$1"');

/** 将接口返回的数据按 provinceName 与前端坐标配置合并，返回所有省份，没有数据的 entCount 设为 0 */
export const mergeRegionData = (
	coordList: RegionCoordConfig[],
	provinceList: ProvinceVisitItem[]
): MergedRegionData[] => {
	const statMap = new Map(provinceList.map((item) => [item.provinceName, item]));

	return coordList.map((coord) => {
		const stat = statMap.get(coord.provinceName);
		return {
			...coord,
			visitCount: stat?.visitCount ?? 0,
			entCount: stat?.entCount ?? 0,
		};
	});
};
