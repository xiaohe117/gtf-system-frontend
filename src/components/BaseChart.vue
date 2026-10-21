<template>
	<div :style="{ width: width, height: height }">
		<div
			v-show="!showEmpty"
			class="chart-container"
			ref="chartDom"
			style="width: 100%; height: 100%"
		></div>
		<default-empty-container v-if="showEmpty" />
	</div>
</template>

<script lang="ts" setup>
/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }] */
// import { CategoryAxisOption } from '@/types/charts';
import echarts from '@/utils/echarts';
import type { ECOption } from '@/utils/echarts';
// import useUserStore from '@/stores/user';

// const store = useUserStore();

const props = withDefaults(
	defineProps<{
		/*
			'normal': 602 * 220,
			'large': 934 * 329,
			'customized': 自定义，需要同时传width & height
		*/
		size?: 'normal' | 'large' | 'customized';
		width?: string;
		height?: string;
		chartOption: ECOption;
		isEmpty?: boolean;
		isMapTree?: boolean;
	}>(),
	{
		size: 'normal',
		width: '100%',
		height: '100%',
		isMapTree: false,
	}
);

const emit = defineEmits(['click']);

const showEmpty = computed(() => {
	if (props.isEmpty !== undefined) {
		return props.isEmpty;
	}
	const option = props.chartOption;
	if (!option?.series) {
		return true;
	}
	if (option?.series instanceof Array && option?.series?.length < 1) {
		return true;
	}
	return false;
});

const chartInstance = {
	instance: {} as echarts.ECharts,
	tooltipTimer: null as unknown as number,
	autoIndex: 0,
};
const chartDom = ref<HTMLDivElement>();

// const loopInterval = 3 * 1000;

/*
const loopTooltip = () => {
	let dataLength: number = 0;
	if ((props.chartOption?.xAxis as CategoryAxisOption)?.type === 'category') {
		const xAxis = props.chartOption.xAxis as CategoryAxisOption;
		dataLength = xAxis?.data?.length;
	}
	if ((props.chartOption?.yAxis as CategoryAxisOption)?.type === 'category') {
		const yAxis = props.chartOption.yAxis as CategoryAxisOption;
		dataLength = yAxis?.data?.length;
	}
	chartInstance.tooltipTimer && clearInterval(chartInstance.tooltipTimer);
	if (dataLength) {
		const validDataIndices: { dataIndex: number; seriesIndex: number }[] = [];
		const series = props.chartOption?.series;

		if (series instanceof Array && series.length) {
			series?.forEach((ser, seriesIndex) => {
				const seriesData = ser.data;
				if (seriesData instanceof Array && seriesData.length) {
					seriesData.forEach((dataPoint, index) => {
						if (dataPoint != null && !validDataIndices[index]) {
							validDataIndices.push({ dataIndex: index, seriesIndex });
						}
					});
				}
			});
		}
		chartInstance.tooltipTimer = setInterval(() => {
			const maxIndex = dataLength - 1;
			const seriesIndex = validDataIndices[chartInstance.autoIndex]?.seriesIndex;
			chartInstance.instance.dispatchAction({
				type: 'showTip',
				seriesIndex,
				dataIndex: chartInstance.autoIndex,
			});
			if (chartInstance.autoIndex < maxIndex) {
				chartInstance.autoIndex += 1;
			} else {
				chartInstance.autoIndex = 0;
			}
		}, loopInterval);
	}
};
*/

/*
const stopLoopTooltip = () => {
	chartInstance.tooltipTimer && clearInterval(chartInstance.tooltipTimer);
	chartInstance.autoIndex = 0;
};
*/

const setChart = () => {
	const option = props.chartOption;
	chartInstance.instance?.setOption(option, true);
	// loopTooltip();
	// 鼠标移入停止自动轮播
	chartInstance.instance.getZr().on('mouseover', () => {
		// stopLoopTooltip();
	});
	// 鼠标移出开启自动轮播
	chartInstance.instance.on('globalout', () => {
		// loopTooltip();
	});
};
const resizeHandler = () => {
	if (props.isMapTree) {
		setTimeout(() => {
			chartInstance.instance.id && chartInstance.instance?.resize();
			setTimeout(() => {
				chartInstance.instance.id && chartInstance.instance?.resize();
			}, 5);
		}, 3);
	} else {
		chartInstance.instance.id && chartInstance.instance?.resize();
	}
};

const resizeChart = () => {
	setTimeout(() => {
		window.addEventListener('resize', resizeHandler);
	}, 1);
};

const initChart = () => {
	// const { width, height } = props;
	/*
	if (props.size === 'large') {
		width = 934;
		height = 329;
	}
	*/
	chartInstance.instance = echarts.init(chartDom.value, 'common');
	emit('click', chartInstance.instance);
	setChart();
	resizeChart();
	// resizeHandler();
};
const destroyChart = () => {
	chartInstance.instance.id && chartInstance.instance.dispose();
	chartInstance.instance = {} as echarts.ECharts;
	window.removeEventListener('resize', resizeHandler);
};

watch(
	() => props.chartOption,
	() => {
		setChart();
		// resizeChart();
		resizeHandler();
	},
	{
		deep: true,
	}
);

watch(
	() => props.isEmpty,
	() => {
		if (!props.isEmpty) {
			nextTick(resizeHandler);
		}
	}
);

/*
watch(
	() => store.isOpenSidebar,
	() => {
		setTimeout(() => {
			resizeHandler();
			setTimeout(() => {
				resizeHandler();
			}, 5);
		}, 5);
	}
);
*/

onMounted(() => {
	initChart();
	resizeHandler();
});

onBeforeUnmount(() => {
	destroyChart();
	// stopLoopTooltip();
});
defineExpose({ chartInstance });
</script>

<style lang="less" scoped>
.chart-container {
	width: 100%;
	height: 100%;
}
</style>
