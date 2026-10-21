<!--
 * @Descripttion: 招商全流程
-->
<template>
	<div class="investment-full-process">
		<div class="page-header">
			<div class="page-title"></div>
			<div
				class="page-filters title-extra"
				:style="filterControlStyle"
			>
				<WeekRangePicker v-model="dateRange" />
				<DeptCascader v-model="dept" />
			</div>
		</div>

		<div
			ref="boardRef"
			class="process-board"
			:class="{ 'is-scrollable': boardScrollable }"
		>
			<div
				class="process-grid"
				:class="{ 'is-menu-collapsed': !userStore.sideMenusIsExpand }"
			>
				<!-- 轨道背景，纯装饰 -->
				<div
					class="track-bg"
					:class="{ 'is-menu-collapsed': !userStore.sideMenusIsExpand }"
				>
					<img
						class="process-bg"
						src="@/assets/images/investmentFullProcess/process-bg.png"
						alt=""
					/>
				</div>

				<!-- 第一行：4 列均匀分布，top 0 -->
				<div class="process-row process-row-top">
					<div
						v-for="item in topRowItems"
						:key="item.key"
						class="process-unit"
					>
						<ProcessNode
							class="unit-node"
							:label="item.label"
							:compact="item.multiline"
						/>
						<div class="unit-card">
							<ProcessUnitCard :item="item" :stage-map="stageMap" />
						</div>
					</div>
				</div>

				<!-- 第二行：4 列均匀分布，top 454px -->
				<div class="process-row process-row-bottom">
					<div
						v-for="item in bottomRowItems"
						:key="item.key"
						class="process-unit"
					>
						<ProcessNode
							class="unit-node"
							:label="item.label"
							:compact="item.multiline"
						/>
						<div class="unit-card">
							<ProcessUnitCard :item="item" :stage-map="stageMap" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';
import DeptCascader from './components/DeptCascader.vue';
import WeekRangePicker from './components/WeekRangePicker.vue';
import ProcessNode from './components/ProcessNode.vue';
import ProcessUnitCard from './components/ProcessUnitCard.vue';
import { ALL_DEPT_VALUE } from './deptTree';
import { getDefaultWeekRange, toQueryDateTimeRange } from './weekRange';
import { useFilterControlSize } from './useFilterControlSize';
import {
	processItems,
	TRACK_HEIGHT,
	TRACK_TOP,
	TRACK_LEFT_COLLAPSED,
	ROW_1_TOP,
	ROW_2_TOP,
	CARD_NODE_GAP,
	CARD_HEIGHT,
	CARD_ROW_RIGHT_MARGIN,
	CARD_WIDTH_EXPANDED,
	CARD_COL_GAP_EXPANDED,
	CARD_WIDTH_COLLAPSED,
	CARD_COL_GAP_COLLAPSED,
	PROCESS_CONTENT_HEIGHT_REM,
	projectStages,
} from './processLayout';

const userStore = useUserStore();

/** 时间 / 部门选择器统一高度、字号（设计 42px / 18px，缩放时用 getSize 同步） */
const { height: filterControlHeight, fontSize: filterControlFontSize } = useFilterControlSize();
provide('investmentFilterControlHeight', filterControlHeight);
provide('investmentFilterControlFontSize', filterControlFontSize);
const filterControlStyle = computed(() => ({
	'--filter-control-height': filterControlHeight.value,
	'--filter-control-font-size': filterControlFontSize.value,
	'--el-component-size': filterControlHeight.value,
	'--el-font-size-base': filterControlFontSize.value,
	height: filterControlHeight.value,
	fontSize: filterControlFontSize.value,
}));

/** 默认展示最新完整周（实时取当天日期计算） */
const dateRange = ref<[string, string] | null>(getDefaultWeekRange());
/** 单位 name，全市为 '' */
const dept = ref(ALL_DEPT_VALUE);

/** 页面数据查询区间（周五 18:00 - 下周五 18:00） */
const queryDateRange = computed<[string, string] | null>(() =>
	dateRange.value ? toQueryDateTimeRange(dateRange.value) : null,
);

provide('investmentQueryDateRange', queryDateRange);
provide('investmentDept', dept);

const topRowItems = computed(() => processItems.filter((item) => item.row === 'top'));
const bottomRowItems = computed(() => processItems.filter((item) => item.row === 'bottom'));

const stageMap = computed(() =>
	Object.fromEntries(projectStages.map((stage) => [stage.key, stage])),
);

/**
 * 按可用高度压缩布局 rem 数值（非 transform:scale），文字仍按真实字号排版，避免发糊。
 * 仅在极端矮屏压到下限后才允许滚动。
 */
const BOARD_PAD_TOP_REM = 0.15;
/** 最低压缩比，再低则保留滚动，避免卡片内容挤爆 */
const LAYOUT_FIT_MIN = 0.78;

const boardRef = ref<HTMLElement | null>(null);
const layoutFit = ref(1);
const boardScrollable = ref(false);
let boardResizeObserver: ResizeObserver | null = null;

provide('investmentLayoutFit', layoutFit);

const scaleRem = (value: string, fit = layoutFit.value) => {
	const num = Number.parseFloat(value);
	if (Number.isNaN(num)) return value;
	return `${num * fit}rem`;
};

const trackHeight = computed(() => scaleRem(TRACK_HEIGHT));
const trackTop = computed(() => scaleRem(TRACK_TOP));
const row1Top = computed(() => scaleRem(ROW_1_TOP));
const row2Top = computed(() => scaleRem(ROW_2_TOP));
const cardNodeGap = computed(() => scaleRem(CARD_NODE_GAP));
const cardHeight = computed(() => scaleRem(CARD_HEIGHT));
const processContentHeight = computed(() => `${PROCESS_CONTENT_HEIGHT_REM * layoutFit.value}rem`);
const boardPadTop = computed(() => `${BOARD_PAD_TOP_REM * Math.min(1, layoutFit.value)}rem`);

const updateLayoutFit = () => {
	const board = boardRef.value;
	if (!board) return;

	const rootFontSize = Number.parseFloat(
		window.getComputedStyle(document.documentElement).fontSize,
	);
	if (!rootFontSize) return;

	const padTopPx = BOARD_PAD_TOP_REM * rootFontSize;
	const needGridPx = PROCESS_CONTENT_HEIGHT_REM * rootFontSize;
	/** 预留 2px，避免亚像素差导致偶发滚动条 */
	const availableGridPx = Math.max(0, board.clientHeight - padTopPx + 2);

	if (availableGridPx <= 0 || needGridPx <= 0) {
		layoutFit.value = 1;
		boardScrollable.value = false;
		return;
	}

	const rawFit = availableGridPx / needGridPx;
	if (rawFit >= 0.998) {
		layoutFit.value = 1;
		boardScrollable.value = false;
		return;
	}

	layoutFit.value = Math.max(LAYOUT_FIT_MIN, Math.min(1, rawFit));
	boardScrollable.value = rawFit < LAYOUT_FIT_MIN;
};

watch(
	() => userStore.sideMenusIsExpand,
	() => {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
			updateLayoutFit();
		}, 320);
	},
);

onMounted(() => {
	nextTick(() => {
		updateLayoutFit();
		if (boardRef.value && typeof ResizeObserver !== 'undefined') {
			boardResizeObserver = new ResizeObserver(() => updateLayoutFit());
			boardResizeObserver.observe(boardRef.value);
		}
	});
	window.addEventListener('resize', updateLayoutFit);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateLayoutFit);
	boardResizeObserver?.disconnect();
	boardResizeObserver = null;
});
</script>

<style lang="less" scoped>
.investment-full-process {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	min-width: 0;
	min-height: 0;
	overflow: hidden;
}

.page-header {
	position: relative;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 0.5rem;
}

.page-title {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	min-width: 3.1rem;
	height: 0.5rem;
	background-image: url('@/assets/images/investmentFullProcess/title.png');
	background-size: contain;
}

.page-filters {
	display: flex;
	align-items: center;
	gap: 0.12rem;
	box-sizing: border-box;
}

.process-board {
	flex: 1;
	min-width: 0;
	min-height: 0;
	overflow-x: hidden;
	overflow-y: hidden;
	padding-top: v-bind(boardPadTop);

	&.is-scrollable {
		overflow-y: auto;
	}
}

.process-grid {
	position: relative;
	width: 100%;
	height: v-bind(processContentHeight);
}

.track-bg {
	position: absolute;
	top: v-bind(trackTop);
	left: 0;
	width: 100%;
	height: v-bind(trackHeight);
	z-index: 0;
	pointer-events: none;
	transition:
		left 0.3s linear,
		width 0.3s linear;

	&.is-menu-collapsed {
		left: v-bind(TRACK_LEFT_COLLAPSED);
		width: calc(100% - v-bind(TRACK_LEFT_COLLAPSED));
	}
}

.process-bg {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: fill;
}

.process-row {
	position: absolute;
	left: 0;
	right: v-bind(CARD_ROW_RIGHT_MARGIN);
	z-index: 1;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: v-bind(CARD_COL_GAP_EXPANDED);
}

.process-grid.is-menu-collapsed .process-row {
	column-gap: v-bind(CARD_COL_GAP_COLLAPSED);
}

.process-row-top {
	top: v-bind(row1Top);
	z-index: 2;
}

.process-row-bottom {
	top: v-bind(row2Top);
	z-index: 2;
}

.process-unit {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: v-bind(cardNodeGap);
	width: 100%;
	min-width: 0;
	position: relative;

	&:hover {
		z-index: 5;
		cursor: pointer;

		:deep(.ball-wrap) {
			transform: translate(-50%, calc(-1 * v-bind(cardNodeGap)));
		}

		:deep(.stage-card) {
			transform: translateY(calc(-1 * v-bind(cardNodeGap)));
			background-image: url('@/assets/images/investmentFullProcess/card-bg-hover.png');
		}
	}
}

.unit-node {
	position: relative;
	z-index: 4;
	flex-shrink: 0;
}

.unit-card {
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: v-bind(CARD_WIDTH_EXPANDED);
	height: v-bind(cardHeight);
	flex-shrink: 0;

	:deep(.stage-card) {
		width: 100%;
		height: 100%;
	}
}

.process-grid.is-menu-collapsed .unit-card {
	max-width: v-bind(CARD_WIDTH_COLLAPSED);
}
</style>

<style lang="less">
main.investment-full-process-page,
main.investment-full-process-page.hide-side-menu {
	padding: 0.1rem 0.14rem !important;

	.side-menu {
		top: 0.1rem !important;
		height: calc(100% - 0.2rem) !important;
	}
}
</style>
