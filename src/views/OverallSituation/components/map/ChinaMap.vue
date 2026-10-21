<template>
	<div class="china-map">
		<div id="china-map-chart" :style="{ width: '100%', height: '100%' }"></div>
	</div>
</template>

<script setup lang="ts">
import { getEnterpriseMapCount } from '@/api/runByEnterprise/index';
import { debounce } from 'lodash-es';
import * as echarts from 'echarts';
import useUserStore from '@/stores/user';
import chinaJSON from '@/assets/json/china.json';
import { getCityCoord, getProvinceCoord } from './hotCities';
import { countConfig, chinaProvinces } from './chinaProvinces';

const store = useUserStore();
const emit = defineEmits(['handleMapClick']);
const enterpriseCount = ref([]);
const chartInstance = ref<echarts.ECharts | null>(null);
const selectProvince = ref(store.provinceName);

const getBaseOption = () => ({
	geo: [
		{
			map: 'china',
			zoom: 1.21,
			roam: false,
			top: '10%',
			regions: [
				{
					name: '南海诸岛',
					itemStyle: {
						areaColor: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
					},
					emphasis: {
						itemStyle: {
							areaColor: 'rgba(0, 0, 0, 0)',
							borderColor: 'rgba(0, 0, 0, 0)',
						},
					},
				},
			],
			itemStyle: {
				normal: {
					areaColor: {
						type: 'radial',
						x: 0.5,
						y: 0.5,
						r: 0.8,
						colorStops: [
							{
								offset: 0,
								color: '#09132c',
							},
							{
								offset: 1,
								color: '#274d68',
							},
						],
						globalCoord: true,
					},
					shadowColor: '#386DBB',
					shadowOffsetX: 4,
					shadowOffsetY: 7,
					borderColor: '#ffffff', // 最外层大边框 → 白色
					borderWidth: 3,
				},
				emphasis: {
					scale: false,
					label: {
						show: false,
					},
				},
			},
		},
	],
	series: [
		{
			name: '中国地图',
			type: 'map',
			map: 'china',
			roam: false,
			zoom: 1.2,
			top: '10%',
			regions: [
				{
					name: '南海诸岛',
					itemStyle: {
						areaColor: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
					},
					emphasis: {
						itemStyle: {
							areaColor: 'rgba(0, 0, 0, 0)',
							borderColor: 'rgba(0, 0, 0, 0)',
						},
					},
				},
			],
			emphasis: {
				scale: false,
				label: {
					show: true,
					fontSize: 18,
					fontWeight: 'bold',
					color: '#ffffff',
					textBorderColor: '#2c3e50',
					textBorderWidth: 1,
				},
				itemStyle: {
					areaColor: '#CAE8FC',
				},
			},
			itemStyle: {
				areaColor: '#CAE8FC',
				borderColor: '#3B7EB9',
				borderWidth: 0.3,
				shadowBlur: 0.2,
				shadowColor: '#ffffff',
				shadowOffsetX: 0,
				shadowOffsetY: 0.5,
			},
			label: {
				show: false,
				fontSize: 18,
				color: '#ffffff',
				// fontWeight: '600',
				// textBorderColor: '#ffffff',
				// textBorderWidth: 1,
			},
			selectedMode: false,
			select: {
				label: {
					show: true,
				},
				itemStyle: {
					areaColor: '#ceb4fa',
				},
			},
			data: enterpriseCount.value,
		},
	],
});

const createEffectScatterSeries = (name: string, coord: [number, number]) => ({
	type: 'effectScatter',
	coordinateSystem: 'geo',
	zlevel: 2,
	rippleEffect: {
		brushType: 'stroke',
		scale: 5,
		period: 4,
	},
	label: {
		show: true,
		formatter: '{b}',
		position: 'right',
		fontSize: 14,
		color: '#fff',
		fontWeight: 'bold',
		textBorderColor: '#2c3e50',
		textBorderWidth: 2,
	},
	symbol: 'circle',
	symbolSize: 12,
	itemStyle: {
		color: '#ff6b6b',
		shadowBlur: 10,
		shadowColor: '#ff6b6b',
	},
	data: [
		{
			name,
			value: [...coord, 100],
		},
	],
});

const getEffectScatterSeries = (cityName: string) => {
	const coord = getCityCoord(cityName);
	if (!coord) return null;
	return createEffectScatterSeries(cityName, coord);
};

const getEffectScatterForProvinceSeries = (provinceName: string) => {
	const coord = getProvinceCoord(provinceName);
	if (!coord) return null;
	return createEffectScatterSeries(provinceName, coord);
};

const removeRippleEffect = () => {
	if (!chartInstance.value) return;

	const baseOption = getBaseOption();
	chartInstance.value.setOption(baseOption, true);
};

const updateMapWithEffect = (cityName: string) => {
	if (!chartInstance.value) return;

	chartInstance.value.dispatchAction({
		type: 'unselect',
		seriesIndex: 0,
	});

	const baseOption = getBaseOption();
	const effectScatter = getEffectScatterSeries(cityName);

	const option: any = {
		...baseOption,
		series: effectScatter ? [...baseOption.series, effectScatter] : baseOption.series,
	};

	chartInstance.value.setOption(option, true);
};

const updateMapWithProvinceEffect = (provinceName: string) => {
	if (!chartInstance.value) return;

	const baseOption = getBaseOption();
	const effectScatter = getEffectScatterForProvinceSeries(provinceName);

	const option: any = {
		...baseOption,
		series: effectScatter ? [...baseOption.series, effectScatter] : baseOption.series,
	};

	chartInstance.value.setOption(option, true);
};

const initChart = () => {
	const chartDom = document.getElementById('china-map-chart')!;
	chartInstance.value = echarts.init(chartDom);

	echarts.registerMap('china', chinaJSON as any);

	const option = getBaseOption();

	chartInstance.value.setOption(option);

	selectProvince.value = store.provinceName;
	if (selectProvince.value) {
		updateMapWithProvinceEffect(selectProvince.value);
	}

	chartInstance.value.on('click', (params: any) => {
		if (chartInstance.value) {
			const pixelX = params.event?.offsetX;
			const pixelY = params.event?.offsetY;
			const geoCoord = chartInstance.value.convertFromPixel({ geoIndex: 0 }, [
				pixelX,
				pixelY,
			]);
			const provinceName = params.name;

			// 清空热门城市选择
			store.setSelectedHotCity('');
			emit('handleMapClick', provinceName);
			selectProvince.value = provinceName;

			// 在鼠标点击位置显示红点涟漪特效
			const baseOption = getBaseOption();
			const effectScatter = createEffectScatterSeries(
				provinceName,
				geoCoord as [number, number]
			);
			const clickOption: any = {
				...baseOption,
				series: [...baseOption.series, effectScatter],
			};
			chartInstance.value.setOption(clickOption, true);
		}
	});
};

// 获取企业统计数
const getEnterpriseCount = () => {
	getEnterpriseMapCount({ type: 'province' }).then((res: any) => {
		const specialProvinces: any = [];
		res.data?.forEach((ele: any) => {
			const color = countConfig.find((c) => c.level === ele.level)?.color || '#CAE8FC';
			const name =
				chinaProvinces.find((c) => c.areaCode === ele.areaCode)?.shortName ||
				ele.areaCodeName;
			specialProvinces.push({
				name,
				itemStyle: {
					areaColor: color,
					borderColor: ele.level < 4 ? '#ffffff' : '#3B7EB9',
				},
				emphasis: {
					itemStyle: {
						areaColor: color,
					},
				},
			});
		});
		const series: any = [
			{
				type: 'map',
				map: 'china',
				data: specialProvinces, // 只传需要改色的省份
			},
		];
		enterpriseCount.value = specialProvinces;
		chartInstance.value?.setOption({ series });
	});
};

const handleResize = debounce(() => {
	if (chartInstance.value) {
		chartInstance.value.resize();
	}
}, 100);
let resizeObserver: any = null;
onMounted(() => {
	initChart();
	// window.addEventListener('resize', handleResize);
	resizeObserver = new ResizeObserver(() => handleResize());
	resizeObserver.observe(document.getElementById('china-map-chart'));
	// setTimeout(() => {
	// 	window.dispatchEvent(new Event('resize'));
	// });
	getEnterpriseCount();
});
onUnmounted(() => {
	// 销毁实例与监听器
	chartInstance.value?.dispose();
	resizeObserver?.disconnect();
});

onBeforeMount(() => {});

// 外部下拉框选择省份时反显地图
watch(
	() => store.provinceName,
	(newProvince) => {
		if (!chartInstance.value) {
			return;
		}
		// 如果省份被清空，取消涟漪特效
		if (!newProvince) {
			if (!store.selectedHotCity) {
				removeRippleEffect();
			}
			selectProvince.value = '';
			return;
		}

		// 选中省份时，清空热门城市并显示涟漪特效
		store.setSelectedHotCity('');
		if (newProvince !== selectProvince.value) {
			updateMapWithProvinceEffect(newProvince);
			selectProvince.value = newProvince;
		}
	}
);

watch(
	() => store.selectedHotCity,
	(newCity) => {
		if (!chartInstance.value) return;

		if (newCity) {
			// 有热门城市选中，显示涟漪特效
			updateMapWithEffect(newCity);
		} else if (!store.provinceName)  {
			// 热门城市被清空，移除涟漪特效
			removeRippleEffect();
		}
	}
);
</script>

<style lang="less" scoped>
#china-map-chart {
	width: 100%;
	height: 100%;
}
.china-map {
	width: 100%;
	height: 100%;
}
</style>
