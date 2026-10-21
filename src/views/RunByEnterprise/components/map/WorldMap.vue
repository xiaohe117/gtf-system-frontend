<template>
	<div class="world-map">
		<div id="world-map-chart" :style="{ width: '100%', height: '5.8rem' }"></div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useUserStore from '@/stores/user';
import worldZhJSON from '@/assets/json/world.zh.json';
import { worldCountries } from './worldCountries';

const store = useUserStore();
const emit = defineEmits(['handleMapClick']);

const chartInstance = ref<echarts.ECharts | null>(null);

const selectContinent = ref(store.continentName);

const getOption = (): any => ({
	geo: {
		map: 'world-zh',
		aspectScale: 0.75,
		zoom: 1.07,
		top: '2%',
		silent: true,
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: '{b}',
		},
		scaleLimit: {
			min: 1,
			max: 5,
		},
		label: {
			show: !1,
		},
		roam: false,
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
			name: '世界地图',
			type: 'map',
			mapType: 'world-zh',
			roam: false,
			zoom: 1.07,
			top: '2%',
			silent: false,
			data: worldCountries.map((country) => ({
				name: country.name,
				isMainCountry: country.isMainCountry,
			})),
			emphasis: {
				label: {
					show: true,
					fontSize: 18,
					fontWeight: 'bold',
					color: '#fff',
					textBorderColor: '#2c3e50',
					textBorderWidth: 1,
				},
				itemStyle: {
					areaColor: '#ceb4fa',
					color: null,
					borderColor: 'transparent',
					borderWidth: 0,
				},
			},
			itemStyle: {
				borderColor: 'transparent',
				borderWidth: 0,
				areaColor: '#5392f7',
				shadowBlur: 0,
				shadowColor: 'rgba(25, 118, 210, 0.6)',
				shadowOffsetX: 0,
				shadowOffsetY: 0,
			},
			label: {
				show: true,
				formatter: (params: any) => {
					const countryData = worldCountries.find((c) => c.name === params.name);
					return countryData?.isMainCountry ? params.name : '';
				},
				fontSize: 12,
				color: '#fff',
				fontWeight: '500',
			},
			selectedMode: 'single',
			select: {
				label: {
					show: true,
					fontSize: 18,
				},
				itemStyle: {
					areaColor: '#ceb4fa',
				},
			},
		},
	],
});

const initChart = () => {
	const chartDom = document.getElementById('world-map-chart')!;
	chartInstance.value = echarts.init(chartDom);

	echarts.registerMap('world-zh', worldZhJSON as any);

	chartInstance.value.setOption(getOption());

	chartInstance.value.dispatchAction({
		type: 'select',
		seriesIndex: 0,
		name: selectContinent.value,
	});

	chartInstance.value.on('click', (params: any) => {
		if (chartInstance.value) {
			emit('handleMapClick', params.data.name);
			selectContinent.value = params.data.continent;
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

// 外部下拉框选择大洲时反显地图
watch(
	() => store.continentName,
	() => {
		if (store.continentName === selectContinent.value || !chartInstance.value) {
			return;
		}
		chartInstance.value.dispatchAction({
			type: 'select',
			seriesIndex: 0,
			name: store.continentName,
		});
		selectContinent.value = store.continentName;
	}
);
</script>

<style lang="less" scoped>
#world-map-chart {
	width: 100%;
	height: 100%;
}
.china-map {
	width: 9rem;
	height: 5.8rem;
}
</style>
