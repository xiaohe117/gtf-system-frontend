<template>
	<div class="china-map">
		<div id="china-map-chart" :style="{ width: '100%', height: '6.4rem' }"></div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useUserStore from '@/stores/user';
import chinaJSON from '@/assets/json/china.json';
import { getCityCoord } from './hotCities';

const store = useUserStore();
const emit = defineEmits(['handleMapClick']);

const chartInstance = ref<echarts.ECharts | null>(null);
const selectProvince = ref(store.provinceName);

const getBaseOption = () => ({
	geo: {
		map: 'china',
		zoom: 0.81,
		roam: false,
		top: '-7.5%',
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
				shadowColor: '#3866c8',
				shadowOffsetX: 4,
				shadowOffsetY: 7,
			},
			emphasis: {
				areaColor: '#2AB8FF',
				borderWidth: 0,
				color: 'green',
				label: {
					show: false,
				},
			},
		},
	},
	series: [
		{
			name: '中国地图',
			type: 'map',
			map: 'china',
			roam: false,
			zoom: 0.8,
			top: '-7.5%',
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
				label: {
					show: true,
					fontSize: 18,
					fontWeight: 'bold',
					color: '#ffffff',
					textBorderColor: '#2c3e50',
					textBorderWidth: 1,
				},
				itemStyle: {
					areaColor: '#ceb4fa',
					borderColor: '#ffffff',
					borderWidth: 2,
					shadowOffsetX: 0,
					shadowOffsetY: 4,
					shadowBlur: 15,
					shadowColor: 'rgba(33, 150, 243, 0.3)',
				},
			},
			itemStyle: {
				areaColor: '#5392f7',
				borderColor: '#87dcf3',
				borderWidth: 1,
				shadowBlur: 10,
				shadowColor: 'rgba(25, 118, 210, 0.6)',
				shadowOffsetX: 0,
				shadowOffsetY: 2,
			},
			label: {
				show: false,
				fontSize: 18,
				color: '#1565c0',
				fontWeight: '600',
				textBorderColor: '#ffffff',
				textBorderWidth: 1,
			},
			selectedMode: 'single',
			select: {
				label: {
					show: true,
				},
				itemStyle: {
					areaColor: '#ceb4fa',
				},
			},
		},
	],
});

const getEffectScatterSeries = (cityName: string) => {
	const coord = getCityCoord(cityName);
	if (!coord) return null;

	return {
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
				name: cityName,
				value: [...coord, 100],
			},
		],
	};
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

const initChart = () => {
	const chartDom = document.getElementById('china-map-chart')!;
	chartInstance.value = echarts.init(chartDom);

	echarts.registerMap('china', chinaJSON as any);

	const option = getBaseOption();

	chartInstance.value.setOption(option);

	chartInstance.value.dispatchAction({
		type: 'select',
		seriesIndex: 0,
		name: selectProvince.value,
	});

	chartInstance.value.on('click', (params: any) => {
		if (chartInstance.value) {
			// 点击省份时，清空热门城市选择
			store.setSelectedHotCity('');
			emit('handleMapClick', params.data.name);
			selectProvince.value = params.data.continent;
		}
	});
};

const handleResize = () => {
	if (chartInstance.value) {
		chartInstance.value.resize();
	}
};

onMounted(() => {
	initChart();
	window.addEventListener('resize', handleResize);

	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});
onBeforeMount(() => {});

// 外部下拉框选择省份时反显地图
watch(
	() => store.provinceName,
	(newProvince) => {
		if (!chartInstance.value) {
			return;
		}

		// 如果省份被清空，取消所有选中
		if (!newProvince && selectProvince.value) {
			chartInstance.value.dispatchAction({
				// type: 'unselect',
				type: 'select',
				seriesIndex: 0,
			});
			selectProvince.value = '';
			return;
		}

		// 如果选中了省份，移除涟漪特效并选中省份
		if (newProvince && newProvince !== selectProvince.value) {
			removeRippleEffect();
			chartInstance.value.dispatchAction({
				type: 'select',
				seriesIndex: 0,
				name: newProvince,
			});
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
		} else {
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
	width: 9rem;
	height: 5.8rem;
}
</style>
