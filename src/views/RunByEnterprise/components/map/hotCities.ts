export interface HotCityData {
  name: string;           
  coord: [number, number]; 
}

export const hotCitiesCoord: Record<string, [number, number]> = {
  '北京': [116.4074, 39.9042],
  '上海': [121.4737, 31.2304],
  '广州': [113.2644, 23.1291],
  '深圳': [114.0579, 22.5431],
  '杭州': [120.1551, 30.2741],
  '重庆': [106.5516, 29.5630],
};

export const hotCitiesList: HotCityData[] = [
  { name: '北京', coord: [116.4074, 39.9042] },
  { name: '上海', coord: [121.4737, 31.2304] },
  { name: '广州', coord: [113.2644, 23.1291] },
  { name: '深圳', coord: [114.0579, 22.5431] },
  { name: '杭州', coord: [120.1551, 30.2741] },
  { name: '重庆', coord: [106.5516, 29.5630] },
];

export function getCityCoord(cityName: string): [number, number] | undefined {
  return hotCitiesCoord[cityName];
}
