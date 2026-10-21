<template>
	<div class="world-map">
		<div id="world-map-chart" :style="{ width: '100%', height: '5.8rem' }"></div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useUserStore from '@/stores/user';
import worldJSON from '@/assets/json/world.json';
import continentJSON from '@/assets/json/continent_geo.json';

const store = useUserStore();
const emit = defineEmits(['handleMapClick']);

const chartInstance = ref<echarts.ECharts | null>(null);

const selectContinent = ref(store.continentName);

const getOption = (): any => ({
	geo: {
		map: 'world',
		aspectScale: 0.75,
		zoom: 1.07,
		top: '2%',
		silent: true,
		tooltip: {
			show: !1,
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
			mapType: 'continent',
			roam: false,
			zoom: 1.07,
			top: '2%',
			silent: false,
			data: [
				{ name: '亚洲' },
				{ name: '大洋洲' },
				{ name: '欧洲' },
				{ name: '北美洲' },
				{ name: '南美洲' },
				{ name: '非洲' },
			],
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

	echarts.registerMap('world', worldJSON as any);
	echarts.registerMap('continent', continentJSON as any);

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
