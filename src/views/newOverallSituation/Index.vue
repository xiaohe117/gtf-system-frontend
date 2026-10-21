<template>
	<div class="wraper">
		<div class="dept-overview">
			<!-- 项目总览 -->
			<ProjectOverview />
			<!-- 线索总览 -->
			<ClueOverview />
			<!-- 招商项目全流程 -->
			<GiOverview />
			<div class="map-container">
				<div class="map-title">
					<div class="map-month-picker">
						<el-select
							v-model="selectDate"
							:clearable="false"
							:suffix-icon="mapMonthSuffixIcon"
							:teleported="false"
							class="map-month-select"
							popper-class="overview-map-month-popper"
							@visible-change="(v: boolean) => (isMapMonthOpen = v)"
							@change="setYearSelectValue"
						>
							<el-option
								v-for="item in dateOptions"
								:key="item"
								:label="item"
								:value="item"
							/>
						</el-select>
					</div>
				</div>
				<div class="map-content">
					<div class="visit-map-wrap" v-show="heatMapType === 'visit'">
						<ChinaMap
							:hotVisitCityTop5="hotVisitCityTop5"
							:provinceVisitList="provinceVisitList"
							:hoverCityName="hoverCityName"
							@handleMapClick="handleMapClick"
						/>
						<HotCity
							:hotCityList="hotVisitCityTop5"
							@hotCityHover="handleHotCityHover"
						/>
						<RegionCount class="region-count-panel" />
					</div>
					<div class="project-map-wrap" v-show="heatMapType === 'project'">
						<ProjectHeatMap
							ref="projectHeatMapRef"
							:filingRankByArea="districtProjectData"
							:filingRankByProjectCount="districtProjectCountData"
							:filingRankByInvestAmount="districtProjectInvestData"
							v-model:sortType="projectSortType"
						/>
					</div>
					<MapHeatSwitch v-model="heatMapType" class="map-heat-panel" />
				</div>
			</div>
			<!-- 大走访 -->
			<!-- <VisitOverview /> -->
			<!-- 招商情报 -->
			<keyTasks />
			<!-- 活动总览 -->
			<!-- <ActivityOverview /> -->
			<!-- 场景总览 -->
			<!-- <SceneOverview /> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { CaretBottom, CaretTop } from '@element-plus/icons-vue';
import useUserStore from '@/stores/user';
import status from '@/stores/status';
import { getLatestStatTime } from '@/api/OverallSituation';
import { getRegionMapStats, projectMap } from '@/api/map'; // 获取区域地图数据
import type {
	HotVisitCityItem,
	ProvinceVisitItem,
} from '@/views/newOverallSituation/DeptOverview/mapConfig';
import RegionCount from '@/views/newOverallSituation/DeptOverview/RegionCount.vue';
import HotCity from '@/views/newOverallSituation/DeptOverview/HotCity.vue';
import ChinaMap from '@/views/newOverallSituation/DeptOverview/ChinaMap.vue';
import ProjectHeatMap from '@/views/newOverallSituation/DeptOverview/ProjectHeatMap.vue';
import MapHeatSwitch, {
	type HeatMapKey,
} from '@/views/newOverallSituation/DeptOverview/MapHeatSwitch.vue';
// import ActivityOverview from './components/ActivityOverview.vue';
import ClueOverview from './components/ClueOverview.vue';
import GiOverview from './components/GiOverview.vue';
import keyTasks from './components/keyTasks.vue';
import ProjectOverview from './components/ProjectOverview.vue';
// import SceneOverview from './components/SceneOverview.vue';
// import VisitOverview from './components/VisitOverview.vue';
import useHomeBackgroundAdaptation from './composables/useHomeBackgroundAdaptation';

const store = useUserStore();
const { setYearSelectValue } = status();
const activeTab = ref(1);
useHomeBackgroundAdaptation();

const isMapMonthOpen = ref(false);
const mapMonthSuffixIcon = computed(() => (isMapMonthOpen.value ? CaretTop : CaretBottom));

watch(
	() => store.mapMode,
	() => {
		activeTab.value = Number(store.mapMode);
	}
);

store.setContinentName('');
store.setMapMode(activeTab.value);
store.setProvinceName('');

// 获取时间下拉选择项
const dateOptions = ref<string[]>([]);
const selectDate = ref('');

// 获取区域地图数据
const totalVisitCount = ref(0);
const hotVisitCityTop5 = ref<HotVisitCityItem[]>([]); // 热门走访城市 TOP5
const provinceVisitList = ref<ProvinceVisitItem[]>([]); // 省份走访列表
const hoverCityName = ref<string | null>(null); // 鼠标悬停的热门城市
const heatMapType = ref<HeatMapKey>('visit'); // 走访热力图 / 项目热力图
const projectHeatMapRef = ref<InstanceType<typeof ProjectHeatMap>>();
const projectSortType = ref<'area' | 'count' | 'invest'>('area'); // 项目热力图排序方式

// 区级项目热力图数据（新注册备案：按地区 / 按项目数 / 按投资额）
interface DistrictFilingItem {
	name: string; // 区名（去掉"区"后缀）
	count: number; // 注册项目数量
	investAmount: number; // 投资额（亿元）
}
const districtProjectData = ref<DistrictFilingItem[]>([]);
const districtProjectCountData = ref<DistrictFilingItem[]>([]);
const districtProjectInvestData = ref<DistrictFilingItem[]>([]);

const handleHotCityHover = (cityName: string | null) => {
	hoverCityName.value = cityName;
};

// 切换到项目热力图时主动刷新，确保颜色正确渲染
watch(heatMapType, (val) => {
	if (val === 'project') {
		nextTick(() => {
			projectHeatMapRef.value?.refresh();
		});
	}
});

const getRegionMapStatsFc = async () => {
	const res = await getRegionMapStats({ date: selectDate.value });
	if (res.code === 0 && res.data) {
		totalVisitCount.value = res.data.totalVisitCount || 0;
		hotVisitCityTop5.value = res.data.hotVisitCityTop5 || [];
		provinceVisitList.value = res.data.provinceVisitList || [];
	}
};

const getProjectMapData = async () => {
	// selectDate 格式：2026年1-6月 → 解析出 year 和 month
	const match = selectDate.value.match(/(\d{4})年(\d{1,2})(?:-(\d{1,2}))?月/);
	const year = match ? Number(match[1]) : new Date().getFullYear();
	const month = match ? String(match[3] || match[2]).padStart(2, '0') : '01';
	const res: any = await projectMap<any>({ year, month });
	if (res.code !== 200) return;
	const data = res?.parameters?.data ?? {};
	const parseFilingList = (list: any[] = []) =>
		list.map((item: any) => ({
			name: String(item.name || item.areaName || item.districtName || '').replace(/区$/, ''),
			count: Number(item.count ?? item.projectCount ?? item.filingCount ?? 0) || 0,
			investAmount: Number(item.completed ?? item.investAmount ?? item.amount ?? 0) || 0,
		}));
	// 三个新字段：按地区排（默认）/ 按项目数排 / 按投资额排
	districtProjectData.value = parseFilingList(data.filingRankByArea);
	districtProjectCountData.value = parseFilingList(data.filingRankByProjectCount);
	districtProjectInvestData.value = parseFilingList(data.filingRankByInvestAmount);
	// 兼容旧接口：没有新字段时回退到 projectMap
	if (!districtProjectData.value.length) {
		const list: any[] = data.projectMap ?? [];
		districtProjectData.value = list.map((item: any) => ({
			name: String(item.name || '').replace(/区$/, ''),
			count: Number(item.count) || 0,
			investAmount: 0,
		}));
	}
};

const getTimes = async () => {
	const res = await getLatestStatTime();
	if (res.code !== 0) return;
	const { timeOptions = [], defaultSelected = '' } =
		(res.data as { timeOptions: any[]; defaultSelected: string }) || {};
	dateOptions.value = timeOptions.map((item: any) => item.label || item.value);
	selectDate.value = defaultSelected || '';
	setYearSelectValue(selectDate.value);
};
onMounted(() => {
	getTimes();
});

const handleMapClick = (name: string) => {
	const setter = activeTab.value === 0 ? store.setContinentName : store.setProvinceName;
	setter(name);
};

// 监听时间选择变化，更新区域地图数据
watch(
	() => selectDate.value,
	() => {
		getRegionMapStatsFc();
		getProjectMapData();
	}
);
</script>

<style lang="less" scoped>
.wraper {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	min-height: 0;
	overflow-x: auto;
	overflow-y: auto;
}

.dept-overview {
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(4.9rem, 5.4rem) minmax(5.8rem, 1fr) minmax(4.9rem, 5.4rem);
	grid-template-rows: repeat(3, minmax(0, 1fr));
	align-items: stretch;
	gap: clamp(0.08rem, 0.9vh, 0.12rem);
	width: 100%;
	min-width: 15.8rem;
	height: 100%;
	min-height: 0;
	padding: clamp(0.03rem, 0.45vh, 0.04rem) 0.06rem 0.06rem;
}

.module-frame {
	min-width: 0;
	min-height: 0;
	height: 100%;
	overflow: hidden;
}

.project-overview-frame {
	grid-column: 1;
	grid-row: 1;
}

.clue-overview-frame {
	grid-column: 1;
	grid-row: 2;
}

.gi-overview-frame {
	grid-column: 1;
	grid-row: 3;
}

.visit-overview-frame {
	grid-column: 2;
	grid-row: 3;
}

.intelligence-frame {
	grid-column: 3;
	grid-row: 1 / span 3;
	height: 100%;
	align-self: stretch;
}

.activity-frame {
	grid-column: 3;
	grid-row: 2;
}

.scene-frame {
	grid-column: 3;
	grid-row: 3;
}

.map-container {
	position: relative;
	grid-column: 2;
	grid-row: 1 / span 3;
	min-width: 0;
	min-height: 0;
	overflow: visible;
}

.map-title {
	position: absolute;
	top: 0.04rem;
	left: 50%;
	z-index: 4;
	width: 3rem;
	height: 0.76rem;
	transform: translateX(-50%);
	background: url('./image/headerback.png') center top / 100% auto no-repeat;
	pointer-events: auto;
}

.map-month-picker {
	position: absolute;
	left: 50%;
	top: 0.39rem;
	width: 1.58rem;
	height: 0.24rem;
	transform: translateX(-50%);
}

.map-month-select {
	width: 100% !important;
	height: 0.24rem;

	:deep(.el-select__wrapper) {
		min-height: 0.24rem;
		width: 1.7rem;
		height: 0.24rem;
		padding: 0 0.18rem 0 0;
		background: transparent;
		border-radius: 0;
		box-shadow: none;
	}

	:deep(.el-select__placeholder),
	:deep(.el-select__selected-item) {
		color: #fff;
		font-family: SourceHanSansCN-Bold;
		font-size: 0.2rem;
		line-height: 0.24rem;
		text-align: center;
		text-shadow: 0 0.02rem 0.04rem rgba(0, 81, 185, 0.9);
	}

	:deep(.el-select__selected-item) {
		justify-content: center;
	}

	:deep(.el-select__suffix) {
		right: 0;
	}

	:deep(.el-select__caret) {
		color: #fff;
		font-size: 0.18rem;
		filter: drop-shadow(0 0.01rem 0.02rem rgba(0, 81, 185, 0.8));
	}
}

:deep(.overview-map-month-popper) {
	border: 0;
	border-radius: 0;
	box-shadow: 0 0.04rem 0.14rem rgba(24, 74, 143, 0.16);

	.el-popper__arrow {
		display: none;
	}

	.el-select-dropdown {
		border-radius: 0;
	}

	.el-select-dropdown__wrap {
		max-height: 4rem;
	}

	.el-select-dropdown__list {
		padding: 0;
	}

	.el-select-dropdown__item {
		height: 0.48rem;
		padding: 0 0.2rem;
		color: #5d626b;
		font-size: 0.17rem;
		font-family: SourceHanSansCN-Bold;
		line-height: 0.48rem;
	}

	.el-select-dropdown__item.is-hovering {
		background: #f0f2f5;
	}

	.el-select-dropdown__list.is-selected {
		color: #0d6fff;
		font-family: SourceHanSansCN-Bold;
	}
}

.map-content {
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 0;
}

.visit-map-wrap,
.project-map-wrap {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	min-height: 0;
	pointer-events: auto;
}

.visit-map-wrap[v-show='false'],
.project-map-wrap[v-show='false'] {
	pointer-events: none;
}

:deep(.china-map),
:deep(.world-map) {
	width: 100%;
	height: 100%;
}

.region-count-panel {
	left: 0 !important;
	bottom: 0 !important;
	z-index: 3;
}

.map-heat-panel {
	right: 0 !important;
	bottom: 0 !important;
	z-index: 3;
}
</style>

<style lang="less">
.app-container.new-overall-situation-app-bg {
	position: relative;
	background: url('@/assets/images/menuLayout/back.png') center / 100% 100% no-repeat !important;

	&::before {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 0;
		width: 100%;
		height: var(--new-overall-situation-bg-height, 100%);
		min-height: 100%;
		content: '';
		pointer-events: none;
		background: url('@/assets/images/menuLayout/back.png') center / 100% 100% no-repeat;
	}

	> * {
		position: relative;
		z-index: 1;
	}
}
</style>
