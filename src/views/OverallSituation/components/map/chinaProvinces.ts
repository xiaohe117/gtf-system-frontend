/*
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-12-05 10:33:34
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-25 10:18:00
 */
export interface ProvinceData {
	shortName: string;
	name: string;
	areaCode: string;
}

export const chinaProvinces: ProvinceData[] = [
	{ shortName: '北京', name: '北京市', areaCode: '110000' },
	{ shortName: '天津', name: '天津市', areaCode: '120000' },
	{ shortName: '上海', name: '上海市', areaCode: '310000' },
	{ shortName: '重庆', name: '重庆市', areaCode: '500000' },
	{ shortName: '河北', name: '河北省', areaCode: '130000' },
	{ shortName: '河南', name: '河南省', areaCode: '410000' },
	{ shortName: '云南', name: '云南省', areaCode: '530000' },
	{ shortName: '辽宁', name: '辽宁省', areaCode: '210000' },
	{ shortName: '黑龙江', name: '黑龙江省', areaCode: '230000' },
	{ shortName: '湖南', name: '湖南省', areaCode: '430000' },
	{ shortName: '安徽', name: '安徽省', areaCode: '340000' },
	{ shortName: '山东', name: '山东省', areaCode: '370000' },
	{ shortName: '新疆', name: '新疆维吾尔自治区', areaCode: '650000' },
	{ shortName: '江苏', name: '江苏省', areaCode: '320000' },
	{ shortName: '浙江', name: '浙江省', areaCode: '330000' },
	{ shortName: '江西', name: '江西省', areaCode: '360000' },
	{ shortName: '湖北', name: '湖北省', areaCode: '420000' },
	{ shortName: '广西', name: '广西壮族自治区', areaCode: '450000' },
	{ shortName: '甘肃', name: '甘肃省', areaCode: '620000' },
	{ shortName: '山西', name: '山西省', areaCode: '140000' },
	{ shortName: '内蒙古', name: '内蒙古自治区', areaCode: '150000' },
	{ shortName: '陕西', name: '陕西省', areaCode: '610000' },
	{ shortName: '吉林', name: '吉林省', areaCode: '220000' },
	{ shortName: '福建', name: '福建省', areaCode: '350000' },
	{ shortName: '贵州', name: '贵州省', areaCode: '520000' },
	{ shortName: '广东', name: '广东省', areaCode: '440000' },
	{ shortName: '青海', name: '青海省', areaCode: '630000' },
	{ shortName: '西藏', name: '西藏自治区', areaCode: '540000' },
	{ shortName: '四川', name: '四川省', areaCode: '510000' },
	{ shortName: '宁夏', name: '宁夏回族自治区', areaCode: '640000' },
	{ shortName: '海南', name: '海南省', areaCode: '460000' },
	{ shortName: '台湾', name: '台湾省', areaCode: '710000' },
	{ shortName: '香港', name: '香港特别行政区', areaCode: '810000' },
	{ shortName: '澳门', name: '澳门特别行政区', areaCode: '820000' },
];

// 六大洲数据
export const sixContinents = [
	{ name: '亚洲' },
	{ name: '大洋洲' },
	{ name: '欧洲' },
	{ name: '北美洲' },
	{ name: '南美洲' },
	{ name: '非洲' },
];

export const countConfig = [
	{ label: '≤ 20', level:4, color: '#CAE8FC'},
	{ label: '20-50', level:3, color: '#ACD7FB' },
	{ label: '50-100', level:2, color: '#5F9EF8'},
	{ label: '≥ 100', level:1, color: '#004E97'},
];
