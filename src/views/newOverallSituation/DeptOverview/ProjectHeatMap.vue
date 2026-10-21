<template>
	<div class="project-heat-map">
		<div id="project-heat-chart" ref="projectChartRef" class="project-heat-chart"></div>
		<div class="project-heat-legend">
			<div class="legend-title">{{ legendTitle }}</div>
			<div class="legend-bar">
				<span class="legend-label">低</span>
				<div class="legend-gradient"></div>
				<span class="legend-label">高</span>
			</div>
		</div>
		<div class="project-rank">
			<div class="rank-sort">
				<label class="sort-option" :class="{ active: sortType === 'count' }">
					<input
						type="checkbox"
						:checked="sortType === 'count'"
						@change="handleSortChange('count')"
					/>
					<span>按项目数排</span>
				</label>
				<label class="sort-option" :class="{ active: sortType === 'invest' }">
					<input
						type="checkbox"
						:checked="sortType === 'invest'"
						@change="handleSortChange('invest')"
					/>
					<span>按投资额排</span>
				</label>
			</div>
			<ul>
				<li v-for="item in sortedDistricts" :key="item.name">
					<span class="rank-name">{{ item.name }}:</span>
					<span class="rank-value">{{ formatNum(item.count) }}</span>
					<span class="rank-unit">个</span>
					<span class="rank-value rank-value-amount">{{
						formatAmount(item.investAmount)
					}}</span>
					<span class="rank-unit">亿元</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';
import guangzhouJSON from '@/assets/json/guangzhou.json';

export type ProjectSortType = 'area' | 'count' | 'invest';

interface DistrictItem {
	name: string;
	count: number;
	investAmount: number;
}

interface Props {
	filingRankByArea?: DistrictItem[];
	filingRankByProjectCount?: DistrictItem[];
	filingRankByInvestAmount?: DistrictItem[];
	sortType?: ProjectSortType;
}

const props = withDefaults(defineProps<Props>(), {
	filingRankByArea: () => [],
	filingRankByProjectCount: () => [],
	filingRankByInvestAmount: () => [],
	sortType: 'area',
});

const emit = defineEmits<{
	'update:sortType': [type: ProjectSortType];
}>();

const projectChartRef = ref<HTMLDivElement>();
const chartInstance = ref<echarts.ECharts | null>(null);
let resizeObserver: ResizeObserver | null = null;
let handleResizeDebounced: ReturnType<typeof debounce> | null = null;
let lastWidth = 0;
let lastHeight = 0;

const formatNum = (val: number | null | undefined) =>
	val == null || val === undefined || (typeof val === 'number' && Number.isNaN(val)) ? 0 : val;

// 投资额保留小数点后一位
const formatAmount = (val: number | null | undefined) =>
	val == null || Number.isNaN(Number(val)) ? '0.0' : Number(val).toFixed(1);

const DEFAULT_DISTRICTS: DistrictItem[] = [
	{ name: '荔湾', count: 0, investAmount: 0 },
	{ name: '黄埔', count: 0, investAmount: 0 },
	{ name: '番禺', count: 0, investAmount: 0 },
	{ name: '增城', count: 0, investAmount: 0 },
	{ name: '南沙', count: 0, investAmount: 0 },
	{ name: '越秀', count: 0, investAmount: 0 },
	{ name: '白云', count: 0, investAmount: 0 },
	{ name: '天河', count: 0, investAmount: 0 },
	{ name: '海珠', count: 0, investAmount: 0 },
	{ name: '花都', count: 0, investAmount: 0 },
	{ name: '从化', count: 0, investAmount: 0 },
];

// 勾选切换：两个选项互斥，再次点击取消回到默认（按地区排）
const handleSortChange = (key: Exclude<ProjectSortType, 'area'>) => {
	emit('update:sortType', props.sortType === key ? 'area' : key);
};

// 当前生效的数据源
const currentDistrictData = computed(() => {
	if (props.sortType === 'count' && props.filingRankByProjectCount?.length)
		return props.filingRankByProjectCount;
	if (props.sortType === 'invest' && props.filingRankByInvestAmount?.length)
		return props.filingRankByInvestAmount;
	return props.filingRankByArea;
});

const legendTitle = computed(() =>
	props.sortType === 'invest'
		? '图例: 各落户区备案(注册)投资金额'
		: '图例: 各落户区备案(注册)项目数量'
);

const sortedDistricts = computed(() => {
	if (!currentDistrictData.value?.length) return DEFAULT_DISTRICTS;
	const list = currentDistrictData.value.map((item) => ({
		name: item.name,
		count: item.count ?? 0,
		investAmount: item.investAmount ?? 0,
	}));
	// 默认（按地区排）保持接口顺序；勾选后按数量/投资额降序
	if (props.sortType === 'count') {
		return list.sort((a, b) => b.count - a.count);
	}
	if (props.sortType === 'invest') {
		return list.sort((a, b) => b.investAmount - a.investAmount);
	}
	return list;
});

// 根据当前排序方式取数据字段，并计算最低/最高值作为颜色映射区间
const getValueRange = () => {
	const pick = (item: DistrictItem) =>
		props.sortType === 'invest' ? (item.investAmount ?? 0) : (item.count ?? 0);
	const values = currentDistrictData.value.map(pick);
	if (!values.length) return { min: 0, max: 1 };
	const min = Math.min(...values);
	const max = Math.max(...values);
	// 所有区数值相同（如全为 0）时，把下限归 0 避免 min === max 导致插值异常
	return min === max ? { min: 0, max: max || 1 } : { min, max };
};

const getSeriesData = () =>
	(currentDistrictData.value || []).map((item) => ({
		name: item.name,
		value: props.sortType === 'invest' ? (item.investAmount ?? 0) : (item.count ?? 0),
		count: item.count ?? 0,
		investAmount: item.investAmount ?? 0,
	}));

const getBaseOption = () => {
	const { min, max } = getValueRange();
	return {
		tooltip: {
			trigger: 'item',
			backgroundColor: 'rgba(255, 255, 255, 0.95)',
			borderColor: '#8eb8ff',
			borderWidth: 1,
			padding: [0.08, 0.12],
			textStyle: {
				color: '#1b2f4a',
				fontSize: 14,
			},
			formatter: (params: any) => `
					<div style="font-size:0.16rem;font-weight:bold;color:#1b2f4a;margin-bottom:0.04rem;">${params.name}</div>
					<div style="font-size:0.14rem;color:#4f5966;">项目数量: <span style="font-family:SourceHanSansCN-Bold;color:#165dff">${formatNum(params.data?.count)}</span> 个</div>
					<div style="font-size:0.14rem;color:#4f5966;">投资金额: <span style="font-family:SourceHanSansCN-Bold;color:#165dff">${formatAmount(params.data?.investAmount)}</span> 亿元</div>
				`,
		},
		visualMap: {
			show: false,
			min,
			max,
			left: 'left',
			top: 'bottom',
			text: ['高', '低'],
			calculable: true,
			inRange: {
				color: ['#dff3ff', '#77b8ff', '#2d73ef'],
			},
		},
		series: [
			{
				name: props.sortType === 'invest' ? '投资金额' : '项目数量',
				type: 'map',
				map: 'guangzhou',
				roam: false,
				zoom: 1.05,
				layoutCenter: ['50%', '50%'],
				layoutSize: '88%',
				label: {
					show: true,
					color: '#1b2f4a',
					fontSize: 12,
					fontWeight: 500,
				},
				itemStyle: {
					areaColor: '#dff3ff',
					borderColor: '#ffffff',
					borderWidth: 1,
				},
				emphasis: {
					label: {
						show: true,
						color: '#1b2f4a',
					},
					itemStyle: {
						areaColor: '#ffbb00',
						shadowBlur: 10,
						shadowColor: 'rgba(255, 187, 0, 0.5)',
					},
				},
				select: {
					itemStyle: {
						areaColor: '#ffbb00',
					},
					label: {
						show: true,
						color: '#1b2f4a',
					},
				},
				data: getSeriesData(),
			},
		],
	};
};

const initChart = () => {
	echarts.registerMap('guangzhou', guangzhouJSON as any);
	chartInstance.value = echarts.init(projectChartRef.value);
	chartInstance.value.setOption(getBaseOption());
};

const updateChart = () => {
	if (!chartInstance.value || chartInstance.value.isDisposed?.()) return;
	chartInstance.value.setOption(getBaseOption());
};

// 暴露给父组件：切换显示时调用，确保完整重绘
const refresh = () => {
	// 用 setTimeout 确保 display:none 已移除、容器有尺寸
	setTimeout(() => {
		if (!chartInstance.value || chartInstance.value.isDisposed?.()) return;
		// 先销毁旧实例再重新初始化，彻底避免 canvas 状态丢失
		chartInstance.value.dispose();
		chartInstance.value = null;
		initChart();
	}, 50);
};

defineExpose({ refresh });

const handleResize = (width: number, height: number) => {
	if (!chartInstance.value || chartInstance.value.isDisposed?.()) return;
	if (width < 100 || height < 100) return;
	requestAnimationFrame(() => {
		if (chartInstance.value && !chartInstance.value.isDisposed?.()) {
			chartInstance.value.resize();
			// resize 后重新 setOption 确保颜色不丢失
			chartInstance.value.setOption(getBaseOption());
		}
	});
};

handleResizeDebounced = debounce(handleResize, 100);

watch(
	() => [props.filingRankByArea, props.filingRankByProjectCount, props.filingRankByInvestAmount],
	() => {
		updateChart();
	},
	{ deep: true }
);

watch(
	() => props.sortType,
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
		// 容器被隐藏时记录为 0，重新显示后需要完整重绘
		if (width <= 0 || height <= 0) {
			lastWidth = 0;
			lastHeight = 0;
			return;
		}
		// 从隐藏状态恢复（lastWidth/lastHeight 为 0）时完整重绘
		if (lastWidth === 0 || lastHeight === 0) {
			lastWidth = width;
			lastHeight = height;
			requestAnimationFrame(() => {
				updateChart();
				chartInstance.value?.resize();
			});
			return;
		}
		if (width === lastWidth && height === lastHeight) return;
		lastWidth = width;
		lastHeight = height;
		handleResizeDebounced?.(width, height);
	});
	if (projectChartRef.value) {
		resizeObserver.observe(projectChartRef.value);
	}
});

onUnmounted(() => {
	handleResizeDebounced?.cancel?.();
	handleResizeDebounced = null;
	resizeObserver?.disconnect();
	resizeObserver = null;
	if (chartInstance.value && !chartInstance.value.isDisposed?.()) {
		chartInstance.value.clear();
		chartInstance.value.dispose();
		chartInstance.value = null;
	}
});
</script>

<style lang="less" scoped>
.project-heat-map {
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 0;
	overflow: hidden;
}

.project-heat-chart {
	position: absolute;
	top: 0.48rem;
	left: 0;
	width: 100%;
	height: calc(100% - 0.48rem);
	z-index: 2;
}

.project-heat-legend {
	position: absolute;
	left: 0rem;
	bottom: 0;
	z-index: 3;
	padding: 0.08rem 0.1rem;
	background: rgba(255, 255, 255, 0.88);
	border: 0.01rem solid #8eb8ff;
	border-radius: 0.08rem;
	box-shadow: 0 0.04rem 0.12rem rgba(24, 74, 143, 0.12);

	.legend-title {
		margin-bottom: 0.06rem;
		font-family: SourceHanSansCN-Bold;
		font-size: 0.13rem;
		color: rgba(0, 0, 0, 0.8);
	}

	.legend-bar {
		display: flex;
		align-items: center;
		gap: 0.06rem;
	}

	.legend-gradient {
		width: 1.2rem;
		height: 0.1rem;
		border-radius: 0.02rem;
		background: linear-gradient(90deg, #dff3ff 0%, #77b8ff 50%, #2d73ef 100%);
	}

	.legend-label {
		font-family: SourceHanSansCN;
		font-size: 0.12rem;
		color: rgba(0, 0, 0, 0.65);
	}
}

.project-rank {
	position: absolute;
	bottom: 8.5%;
	left: 0.04rem;
	z-index: 3;
	width: 1.95rem;
	max-height: calc(100% - 0.9rem);
	overflow-y: auto;
	padding: 0.08rem 0.1rem;
	background: rgba(255, 255, 255, 0.88);
	border: 0.01rem solid #8eb8ff;
	border-radius: 0.08rem;
	box-shadow: 0 0.04rem 0.12rem rgba(24, 74, 143, 0.12);

	.rank-sort {
		display: flex;
		align-items: center;
		gap: 0.12rem;
		padding-bottom: 0.06rem;
		margin-bottom: 0.06rem;
		border-bottom: 0.01rem dashed rgba(78, 151, 244, 0.25);

		.sort-option {
			display: flex;
			align-items: center;
			gap: 0.03rem;
			font-family: SourceHanSansCN;
			font-size: 0.12rem;
			color: rgba(0, 0, 0, 0.65);
			cursor: pointer;

			input {
				width: 0.13rem;
				height: 0.13rem;
				margin: 0;
				accent-color: #165dff;
				cursor: pointer;
			}

			&.active {
				color: #165dff;
				font-family: SourceHanSansCN-Bold;
			}
		}
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		align-items: baseline;
		padding: 0.04rem 0;
		font-family: SourceHanSansCN;
		font-size: 0.13rem;
		line-height: 1.3;
		color: rgba(0, 0, 0, 0.8);

		&:not(:last-child) {
			border-bottom: 0.01rem dashed rgba(78, 151, 244, 0.25);
		}
	}

	.rank-name {
		flex: 1;
		min-width: 0;
	}

	.rank-value {
		margin-left: 0.04rem;
		font-family: SourceHanSansCN-Bold;
		color: #165dff;

		&.rank-value-amount {
			margin-left: 0.06rem;
		}
	}

	.rank-unit {
		margin-left: 0.02rem;
		font-size: 0.12rem;
		color: rgba(0, 0, 0, 0.6);
	}
}
</style>
