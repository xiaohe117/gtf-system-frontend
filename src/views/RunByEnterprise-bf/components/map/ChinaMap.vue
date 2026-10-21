<template>
	<div class="china-map">
		<div id="china-map-chart" :style="{ width: '100%', height: '5.8rem' }"></div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useUserStore from '@/stores/user';
import chinaJSON from '@/assets/json/china.json';

const store = useUserStore();
const emit = defineEmits(['handleMapClick']);

const chartInstance = ref<echarts.ECharts | null>(null);
const selectProvince = ref(store.provinceName);
const initChart = () => {
	const chartDom = document.getElementById('china-map-chart')!;
	chartInstance.value = echarts.init(chartDom);

	echarts.registerMap('china', chinaJSON as any);

	const option = {
		geo: {
			map: 'china',
			zoom: 0.81,
			roam: false,
			top: '-6%',
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
				top: '-6%',
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
	};

	chartInstance.value.setOption(option);

	chartInstance.value.dispatchAction({
		type: 'select',
		seriesIndex: 0,
		name: selectProvince.value,
	});

	chartInstance.value.on('click', (params: any) => {
		if (chartInstance.value) {
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
