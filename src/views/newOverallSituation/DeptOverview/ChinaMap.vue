<template>
	<div class="china-map-container">
		<div class="map-pedestal-wrapper">
			<div class="map-base-pedestal"></div>
		</div>

		<div class="china-map">
			<div id="china-map-chartSvg" ref="chartRef" style="width: 100%; height: 100%"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { debounce } from 'lodash-es';
import * as echarts from 'echarts';
import mapPointImg from '@/assets/images/map/point.png';
// eslint-disable-next-line import/no-unresolved
import chinaSVG from '@/assets/images/map/china2@3X.svg?raw';
// eslint-disable-next-line import/no-unresolved
import chinaBgSVG from '@/assets/images/map/china-bg.svg?raw';
// eslint-disable-next-line import/no-unresolved
import mapDzSVG from '@/assets/images/map/map-dz.svg?raw';
import {
	type HotVisitCityItem,
	type MergedRegionData,
	type ProvinceVisitItem,
	getRegionColorByVisitCount,
	mergeRegionData,
	regionCoordList,
	hotCityCoordList,
} from './mapConfig';

interface Props {
	hotVisitCityTop5?: HotVisitCityItem[];
	provinceVisitList?: ProvinceVisitItem[];
	hoverCityName?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
	hotVisitCityTop5: () => [],
	provinceVisitList: () => [],
	hoverCityName: null,
});

const chartInstance = ref<echarts.ECharts | null>(null);
const regionData = ref<MergedRegionData[]>([]);

let resizeObserver: ResizeObserver | null = null;

let lastWidth = 0;
let lastHeight = 0;
const chartRef = ref<HTMLDivElement>();

let handleResizeDebounced: ReturnType<typeof debounce> | null = null; // 防抖处理后的resize函数

const GUANGDONG_COORD: [number, number] = [278, 272];

const getLinesData = (destinations: MergedRegionData[]) =>
	destinations.map((item) => ({
		coords: [GUANGDONG_COORD, item.coord],
		lineStyle: {
			curveness: 0.2,
			color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: 'rgba(255, 90, 60, 0.2)' },
				{ offset: 0.5, color: 'rgba(255, 172, 78, 0.5)' },
				{ offset: 1, color: 'rgba(255, 172, 78, 0.7)' },
			]),
		},
	}));

const getMapRegions = (stats: MergedRegionData[]) =>
	stats.map((item) => {
		const areaColor = getRegionColorByVisitCount(item.visitCount);
		return {
			name: item.name,
			itemStyle: {
				areaColor,
				borderColor: 'rgba(255,255,255, 1)',
				borderWidth: 1,
			},
			emphasis: {
				itemStyle: {
					areaColor,
				},
			},
		};
	});

// 热门城市像素位置配置与后端数据匹配
const getHotCityPointData = () =>
	props.hotVisitCityTop5
		.map((item) => {
			const matchedCity = hotCityCoordList.find((city) => city.cityName === item.cityName);
			if (!matchedCity) {
				return null;
			}
			return {
				...item,
				coord: matchedCity.coord,
			};
		})
		.filter(
			(
				item
			): item is HotVisitCityItem & {
				coord: [number, number];
			} => item !== null
		);

const getBaseOption = () => {
	const layoutCenter = ['50%', '40%'];
	const layoutSize = '90%';
	const allRegions = regionData.value;
	// 只对有数据的省份进行打点
	const destinations = allRegions.filter((item) => item.entCount > 0);
	const mapRegions = getMapRegions(allRegions);
	const hotCityPointData = getHotCityPointData();

	// 找到鼠标悬停的热门城市
	const hoverHotCity = props.hoverCityName
		? hotCityPointData.find((city) => city.cityName === (props.hoverCityName || '')) || null
		: null;

	// 热门城市数据 - 只在悬停时显示对应城市
	const hotCityData = hoverHotCity
		? [
				{
					name: hoverHotCity.cityName,
					value: [...hoverHotCity.coord, 100],
					entCount: hoverHotCity.entCount || 0,
					visitCount: hoverHotCity.visitCount || 0,
				},
			]
		: [];

	return {
		tooltip: {
			trigger: 'item',
			triggerOn: 'mousemove',
			className: 'china-map-tooltip-global-container',
			enterable: true,
			appendToBody: true,
			backgroundColor: 'transparent',
			borderWidth: 0,
			padding: 0,
			extraCssText: 'box-shadow: none; z-index: 999; pointer-events: auto;',
			position(point: any) {
				return [point[0] - 60, point[1] - 90];
			},
			formatter(params: any) {
				if (params.seriesName === '城市站点' || params.seriesName === '热门城市') {
					return `
            <div class="echarts-custom-popup">
              <div class="popup-title">${params.name}</div>
              <div class="popup-info"><span></span><span>累计对接企业：</span><span>${params.data.entCount}</span><span>家</span></div>
              <div class="popup-info"><span></span><span>累计走访次数：</span><span>${params.data.visitCount}</span><span>次</span></div>
            </div>
          `;
				}
				return '<div class="echarts-hide-target" style="width:0;height:0;"></div>';
			},
		},
		geo: [
			{
				map: 'china-dz-svg',
				roam: false,
				layoutCenter: ['50%', '30%'],
				layoutSize: '150%',
				zlevel: 0,
				itemStyle: {
					areaColor: 'transparent',
					borderColor: 'transparent',
					borderWidth: 1,
				},
			},
			{
				map: 'china-bg-svg',
				roam: false,
				layoutCenter: ['50%', '40%'],
				layoutSize,
				zlevel: 1,
				itemStyle: {
					areaColor: 'transparent',
					borderColor: 'transparent',
					borderWidth: 1,
				},
			},
			{
				map: 'china-custom-svg',
				roam: false,
				layoutCenter,
				layoutSize,
				zlevel: 2,
				regions: mapRegions,
				itemStyle: {
					areaColor: 'transparent',
					borderColor: 'transparent',
					borderWidth: 0,
				},
				label: {
					show: false,
					position: 'inside',
					formatter: () => '',
				},
				emphasis: {
					scale: false,
					itemStyle: {
						areaColor: 'rgba(88, 167, 245, 0.15)',
					},
				},
			},
		],
		series: [
			{
				name: '城市站点',
				type: 'effectScatter',
				coordinateSystem: 'geo',
				geoIndex: 2,
				zlevel: 4,
				label: { show: false },
				symbol: `image://${mapPointImg}`,
				symbolSize: [30, 30],
				itemStyle: {
					color: 'transparent',
					shadowBlur: 0,
				},
				data: destinations.map((item) => ({
					name: item.name,
					value: [...item.coord, 100],
					entCount: item.entCount,
					visitCount: item.visitCount,
				})),
			},
			{
				name: '发光飞线',
				type: 'lines',
				coordinateSystem: 'geo',
				geoIndex: 2,
				zlevel: 5,
				effect: {
					show: true,
					period: 3.2,
					trailLength: 0,
					symbol: 'arrow',
					symbolSize: 4,
					color: '#ffbe4e',
				},
				lineStyle: { width: 2, opacity: 0.8, curveness: 0.2 },
				data: getLinesData(destinations),
			},
			// 热门城市点位（完全不可见）
			{
				name: '热门城市',
				type: 'effectScatter',
				coordinateSystem: 'geo',
				geoIndex: 2,
				zlevel: 6,
				label: { show: false },
				symbol: `image://${mapPointImg}`,
				symbolSize: [1, 1],
				itemStyle: {
					color: 'transparent',
					opacity: 0,
					shadowBlur: 0,
				},
				tooltip: {
					show: !!hoverHotCity,
					triggerOn: 'none',
					alwaysShowContent: true,
				},
				data: hotCityData,
			},
		],
	};
};
// 更新图表
const updateChart = () => {
	if (!chartInstance.value || chartInstance.value.isDisposed?.()) {
		return;
	}

	// 彻底替换 series 避免旧飞线动画残留
	chartInstance.value.setOption(getBaseOption(), {
		notMerge: true,
		replaceMerge: ['series'],
	});

	// 取消之前的 tooltip
	chartInstance.value.dispatchAction({
		type: 'hideTip',
	});

	// 如果有悬停的热门城市，显示对应的 tooltip
	if (props.hoverCityName) {
		const hoverHotCity = getHotCityPointData().find(
			(city) => city.cityName === props.hoverCityName || ''
		);
		if (hoverHotCity) {
			chartInstance.value.dispatchAction({
				type: 'showTip',
				seriesIndex: 2,
				dataIndex: 0,
			});
		}
	}
};

const loadRegionData = () => {
	regionData.value = mergeRegionData(regionCoordList, props.provinceVisitList);
	updateChart();
};

// 避免重复注册地图
let mapRegistered = false;
const registerMaps = () => {
	if (mapRegistered) return;
	echarts.registerMap('china-custom-svg', {
		svg: chinaSVG,
	});
	echarts.registerMap('china-bg-svg', {
		svg: chinaBgSVG,
	});
	echarts.registerMap('china-dz-svg', {
		svg: mapDzSVG,
	});
	mapRegistered = true;
};
const initChart = () => {
	registerMaps();
	chartInstance.value = echarts.init(chartRef.value);
	loadRegionData();
};

const handleResize = (width: number, height: number) => {
	if (!chartInstance.value || chartInstance.value.isDisposed?.()) return;

	// SVG地图最容易在0宽高时出问题
	if (width < 100 || height < 100) {
		return;
	}

	requestAnimationFrame(() => {
		if (chartInstance.value && !chartInstance.value.isDisposed?.()) {
			chartInstance.value.resize();
		}
	});
};

handleResizeDebounced = debounce(handleResize, 100); // 防抖处理后的resize函数

// 监听 prop 变化
watch(
	() => props.provinceVisitList,
	() => {
		loadRegionData();
	},
	{ deep: true }
);

watch(
	() => props.hotVisitCityTop5,
	() => {
		updateChart();
	},
	{ deep: true }
);

// 监听热门城市悬停变化
watch(
	() => props.hoverCityName,
	() => {
		updateChart();
	}
);

onMounted(() => {
	initChart();

	resizeObserver = new ResizeObserver((entries) => {
		const entry = entries[0];
		if (!entry) return;
		const width = Math.round(entry.contentRect.width);
		const height = Math.round(entry.contentRect.height);

		// 容器隐藏
		if (width <= 0 || height <= 0) {
			return;
		}
		// 避免重复resize
		if (width === lastWidth && height === lastHeight) {
			return;
		}
		lastWidth = width;
		lastHeight = height;
		handleResizeDebounced?.(width, height);
	});

	if (chartRef.value) {
		resizeObserver.observe(chartRef.value);
	}
});

onUnmounted(() => {
	// 取消 pending 的 debounce
	handleResizeDebounced?.cancel?.();
	handleResizeDebounced = null;

	// 清理 resizeObserver
	resizeObserver?.disconnect();
	resizeObserver = null;

	// 彻底清理图表实例
	if (chartInstance.value && !chartInstance.value.isDisposed?.()) {
		// 清除所有 tooltip 和 动画
		chartInstance.value.dispatchAction({
			type: 'hideTip',
		});
		chartInstance.value.clear();
		chartInstance.value.dispose();
		chartInstance.value = null;
	}
});
</script>

<style lang="less">
.echarts-custom-popup {
	position: relative;
	min-width: 1.69rem;
	height: 0.84rem;
	padding: 0.06rem 0.08rem;
	background: url('@/assets/images/map/popup-bg.png') no-repeat center center;
	background-size: 100% 100%;
	border-radius: 0.08rem;
	pointer-events: auto;

	.popup-title {
		font-size: 0.18rem;
		font-family: SourceHanSansCN-Bold;
		color: #ffd543;
		margin-bottom: 0.02rem;
		text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	}

	.popup-info {
		font-size: 0.14rem;
		color: #e0f0ff;
		line-height: 1.4;
		span:nth-child(1) {
			width: 4px;
			height: 4px;
			background: #ff7a0d;
			display: inline-block;
			border-radius: 50%;
		}
		span:nth-child(2) {
			font-size: 0.12rem;
			margin-left: 0.04rem;
			font-family: SourceHanSansCN-Bold;
			display: inline-block;
		}
		span:nth-child(3) {
			font-family: SourceHanSansCN-Bold;
			font-size: 0.14rem;
			color: #ffd543;
			display: inline-block;
			margin-left: 0.4rem;
		}
		span:nth-child(4) {
			font-family: SourceHanSansCN-Bold;
			font-size: 0.08rem;
			color: #ffffff;
			display: inline-block;
		}
	}
}

body {
	//  只有地图组件蹦出来的 Tooltip 外壳，才执行“找不到点位就自毁”的逻辑
	> div.china-map-tooltip-global-container {
		&:not(:has(.echarts-custom-popup)) {
			display: none !important;
		}
	}
}
</style>

<style lang="less" scoped>
.china-map-container {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.map-base-pedestal {
	position: absolute;
	bottom: -60%;
	left: 50%;
	transform: translateX(-50%) rotateX(62deg);
	width: 12.9rem;
	height: 12.88rem;
	// background: url(/src/assets/images/map/map-dz.png) no-repeat center center;
	background-size: 100% 100%;
	opacity: 1;
	pointer-events: none;
	z-index: 1;
}

.china-map {
	position: absolute;
	top: 0.48rem;
	left: 0;
	/* 右侧给热门城市留空，避免遮挡地图 */
	width: calc(100% - 0.96rem);
	height: 100%;
	z-index: 2;
}
</style>
