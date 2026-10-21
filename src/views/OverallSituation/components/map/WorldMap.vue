<template>
	<div class="world-map">
		<div id="world-map-chart" :style="{ width: '100%', height: '100%rem' }"></div>
	</div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import * as echarts from 'echarts';
import useUserStore from '@/stores/user';
import { getEnterpriseMapCount } from '@/api/runByEnterprise/index';
import worldZhJSON from '@/assets/json/world.zh.json';
import { countConfig } from './chinaProvinces';
import { worldCountries } from './worldCountries';

const store = useUserStore();
const emit = defineEmits(['handleMapClick']);

const chartInstance = ref<echarts.ECharts | null>(null);

const selectContinent = ref(store.continentName);
// const enterpriseCount = ref([])

const getBaseOption = (): any => ({
	geo: {
		map: 'world-zh',
		aspectScale: 0.75,
		zoom: 1.2,
		top: '13%',
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
				shadowColor: '#386DBB',
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
			zoom: 1.2,
			top: '13%',
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
					formatter: (params: any) => params.name,
				},
				itemStyle: {
					areaColor: '#ceb4fa',
					borderColor: 'transparent',
					borderWidth: 0,
				},
			},
			itemStyle: {
				borderColor: 'transparent',
				borderWidth: 0,
				areaColor: '#CAE8FC',
				shadowBlur: 0,
				shadowColor: '#ffffff',
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
			selectedMode: false,
		},
	],
});

// 创建涟漪特效 scatter 系列
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

const removeRippleEffect = () => {
	if (!chartInstance.value) return;
	const baseOption = getBaseOption();
	chartInstance.value.setOption(baseOption, true);
};

const initChart = () => {
	const chartDom = document.getElementById('world-map-chart')!;
	chartInstance.value = echarts.init(chartDom);

	echarts.registerMap('world-zh', worldZhJSON as any);

	const option = getBaseOption();
	chartInstance.value.setOption(option);

	chartInstance.value.on('click', (params: any) => {
		if (chartInstance.value) {
			const pixelX = params.event?.offsetX;
			const pixelY = params.event?.offsetY;
			const geoCoord = chartInstance.value.convertFromPixel({ geoIndex: 0 }, [
				pixelX,
				pixelY,
			]);
			const continentName = params.name;

			emit('handleMapClick', continentName);
			selectContinent.value = continentName;

			// 在鼠标点击位置显示红点涟漪特效
			const baseOption = getBaseOption();
			const effectScatter = createEffectScatterSeries(
				continentName,
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

const handleResize = debounce(() => {
	if (chartInstance.value) {
		chartInstance.value.resize();
	}
}, 100);
const enterpriseCount = ref<any[]>([]);
// 获取企业统计数
const getEnterpriseCount = () => {
	getEnterpriseMapCount({ type: 'country' }).then((res: any) => {
		const specialProvinces: any = [];
		console.log(res.data);
		res.data?.forEach((ele: any) => {
			const color = countConfig.find((c) => c.level === ele.level)?.color || '#CAE8FC';
			const country: any = worldCountries.find((c) => c.areaCode === ele.areaCode) || {};
			specialProvinces.push({
				name: country?.name || ele.areaCodeName,
				itemStyle: {
					areaColor: color,
					borderColor: ele.level < 4 ? '#ffffff' : '#3B7EB9',
				},
				isMainCountry: country.isMainCountry,
			});
		});
		const series: any = [
			{
				type: 'map',
				name: '世界地图',
				mapType: 'world-zh',
				data: specialProvinces, // 只传需要改色的省份
			},
		];
		enterpriseCount.value = specialProvinces;
		chartInstance.value?.setOption({ series });
	});
};
let resizeObserver: any = null;
onMounted(() => {
	initChart();
	// window.addEventListener('resize', handleResize);

	// setTimeout(() => {
	// 	window.dispatchEvent(new Event('resize'));
	// });
	resizeObserver = new ResizeObserver(() => handleResize());
	resizeObserver.observe(document.getElementById('world-map-chart'));
	getEnterpriseCount();
});
onBeforeMount(() => {});

// 外部下拉框选择大洲时反显地图
watch(
	() => store.continentName,
	(newContinent) => {
		if (!chartInstance.value) return;

		// 如果大洲被清空，取消涟漪特效
		if (!newContinent) {
			removeRippleEffect();
			selectContinent.value = '';
			return;
		}

		// 外部下拉选择时，移除涟漪特效并更新选中状态
		if (newContinent !== selectContinent.value) {
			selectContinent.value = newContinent;
		}
	}
);
</script>

<style lang="less" scoped>
#world-map-chart {
	width: 100%;
	height: 100%;
}
.world-map {
	width: 100%;
	height: 100%;
}
</style>
