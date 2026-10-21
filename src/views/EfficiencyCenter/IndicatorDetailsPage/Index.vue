<template>
	<div class="indicator-detail">
		<SelectDate class="time-select" :modelValue="selectDate" @change="changeDate" />
		<TopCon v-bind="$attrs" />
		<div class="fx-r main-content">
			<div class="tab-box">
				<div
					v-for="(item, index) in tabConfig"
					:key="index"
					class="box-content"
					:class="['item', { active: index === activeTab }]"
					@click="activeTab = index"
				>
					{{ item.label }}
				</div>
			</div>
			<component
				class="fx-1 content-box"
				:is="getComponent(activeTab)"
				:hasSearchTab="getDisplayChild(activeTab)"
				:isLight="isLight"
				:tableColumns="getTableColumns(activeTab)"
				:specialLabel="getTableSpecialLabel(activeTab)"
				:tagId="getTagId(activeTab)"
				v-bind="$attrs"
				@loaded="loaded"
				:key="activeTab"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';

import { queryIndicatorDropDown,indicatorDropDownByDept } from '@/api/dailyMonitoring/indicatorDetailsPage';
import SelectDate from '@/components/widget/SelectDate.vue';
import { useAttrs } from 'vue';
import TopCon from './components/TopCon.vue';
import IndicatorMonitor from './Tabs/IndicatorMonitor.vue';
import RelatedIndicators from './Tabs/RelatedIndicators.vue';
import AreaBenchmark from './Tabs/AreaBenchmark.vue';
import VisitDetailTable from './Tabs/VisitDetailTable.vue';
import SceneDetailTable from './Tabs/SceneDetailTable.vue';
import ProjectDetailTable from './Tabs/ProjectDetailTable.vue';
import LineDetailTable from './Tabs/LineDetailTable.vue';
import ActivityDetailTable from './Tabs/ActivityDetailTable.vue';
import { getTableColumnsConfig } from './config/tableColumns';

const store = useUserStore();
const attrs: any = useAttrs();

const menuList = ref<any[]>([]); // 接口返回的菜单列表
const baseTabList = ref<any[]>([
	{
		label: '指标趋势',
		name: 'IndicatorMonitor',
		component: markRaw(IndicatorMonitor),
	},
	{
		label: '各区监测',
		name: 'AreaBenchmark',
		component: markRaw(AreaBenchmark),
		columnsKey: 'areaMonitoring',
	},
	{
		label: '部门监测',
		name: 'DepartmentBenchmark',
		component: markRaw(AreaBenchmark),
		columnsKey: 'departmentMonitoring',
	},
	{
		label: '国企监测',
		name: 'GovernmentBenchmark',
		component: markRaw(AreaBenchmark),
		columnsKey: 'enterpriseMonitoring',
	},
	{
		label: '办内监测',
		name: 'BanBenchmark',
		component: markRaw(AreaBenchmark),
		columnsKey: 'officeMonitoring',
	},
	{
		label: '项目明细',
		name: 'ProjectDetail',
		component: markRaw(ProjectDetailTable),
		columnsKey: 'projectDetail',
	},
	{
		label: '线索明细',
		name: 'LineDetail',
		component: markRaw(LineDetailTable),
		columnsKey: 'lineDetail',
	},
	{
		label: '走访明细',
		name: 'VisitDetail',
		component: markRaw(VisitDetailTable),
		columnsKey: 'visitDetail',
	},
	{
		label: '场景明细',
		name: 'SceneDetail',
		component: markRaw(SceneDetailTable),
		columnsKey: 'sceneDetail',
	},
	{
		label: '活动明细',
		name: 'ActivityDetail',
		component: markRaw(ActivityDetailTable),
		columnsKey: 'activityDetail',
	},
	{
		label: '相关指标',
		name: 'RelatedIndicators',
		component: markRaw(RelatedIndicators),
	},
]);
const tabConfig = ref<any>([]); // 展示的tabs
const selectDate = ref<any>('2026年1-3月'); // 选中的时间
const activeTab: any = ref(0);
const emit = defineEmits(['loaded','dateChange']);
const loaded = (id: number, success: boolean) => {
	emit('loaded', id, success);
};

const getComponent = (index: number) => {
	const isComponent = tabConfig.value[index]?.component;
	return isComponent;
};
// 获取表格字段配置
const getTableColumns = (index: number) => {
	const columnsKey = tabConfig.value[index]?.columnsKey;
	if (columnsKey) {
		return getTableColumnsConfig(columnsKey);
	}
	return [];
};
// 获取标题
const getTableSpecialLabel = (index: number) => {
	const label = tabConfig.value[index]?.label;
	if (label) {
		return label;
	}
	return '';
};
// 获取 tagId
const getTagId = (index: number) => tabConfig.value[index]?.tagId || '';
// 是否展示搜索条件
const getDisplayChild = (name: string) => {
	console.log('name', name);
	return '1';
	/*
	const label = baseTabList.value
		.flatMap((item) => item.children)
		.find((item) => item.name === name)?.label;
	return menuList.value.find((item) => item.menuName === label)?.displayChild;
	*/
	// return '1';
};
// 判断是否亮灯指标
const isLight = ref(false);

// 设置选中时间
const setSelectData = () => {
	if (attrs.defaultDate) {
		selectDate.value = attrs.defaultDate;
	} else if (store.dateSelect) {
		selectDate.value = store.dateSelect;
	}
	store.setDateSelect(selectDate.value);
};

const changeDate = (val: any) => {
	selectDate.value = val;
	emit('dateChange',val)
};

const handleClose = () => {
	// activeTab.value = tabConfig.value[0]?.children[0]?.name;
};

// 获取当前指标拥有的tab列表
const getIndicatorTabs = () => {
	const func = attrs.isDept ? indicatorDropDownByDept : queryIndicatorDropDown;
	const params = {
		indicatorCode: attrs.indicatorData?.indicatorCode,
		deptId:attrs.isDept ? attrs.deptCode : undefined,
	}
	func(params).then(
		(res: any) => {
			if (res.code === 0) {
				// console.log('queryIndicatorMenuConfigList', res);
				menuList.value = res.data;
				let tabList = res.data.map((item: any) => item.tagName);
				if (!tabList.length) {
					tabList = [
						'指标趋势',
						'各区监测',
						'部门监测',
						'国企监测',
						'办内监测',
						'项目明细',
						'线索明细',
						'走访明细',
						'场景明细',
						'活动明细',
						'相关指标',
					];
				}
				tabConfig.value = [];
				baseTabList.value.forEach((item: any) => {
					if (tabList.includes(item.label)) {
						// 从 menuList 中找到对应的 tagId
						const menuItem = res.data.find((menu: any) => menu.tagName === item.label);
						tabConfig.value.push({
							...item,
							tagId: menuItem?.tagId || '',
						});
					}
				});

				// activeTab.value = 0;
			}
		}
	);
};

onMounted(() => {
	console.log('attrs', attrs);
});

watch(
	() => attrs.defaultDate,
	() => {
		setSelectData();
	}
);
watch(
	() => attrs.indicatorData,
	() => {
		setSelectData();
		getIndicatorTabs();
	},
	{
		immediate: true,
		deep: true,
	}
);

onMounted(() => {
	// getIndicatorTabs();
});

defineExpose({ handleClose });
</script>

<style lang="less" scoped>
.indicator-detail {
	background: #fff;
	position: relative;
	:deep(.el-radio-group) {
		.el-radio-button__inner {
			font-size: 0.16rem;
			padding: 0.06rem 0.12rem;
		}
	}
	:deep(.title-part) {
		margin-bottom: 0.1rem;
	}
	:deep(.small-title-wrapper) {
		padding-top: 0.12rem;
		padding-bottom: 0;
		padding-right: 0;
	}
	.time-select {
		width: 1.8rem;
		right: 0.24rem;
		top: 0.13rem;
	}
	.main-content {
		height: 6.1rem;
		.tab-box {
			width: 1.3rem;
			/* 顶部与右侧标题齐平，底部与右侧内容底齐平 */
			height: calc(100% - 0.12rem);
			margin-top: 0.12rem;
			flex-shrink: 0;
			background: rgba(47, 107, 239, 0.1);
			border-radius: 0.08rem;
			font-size: 0.18rem;
			text-align: center;
			overflow-x: hidden;
			overflow-y: auto;
			padding-top: 0.05rem;
			box-sizing: border-box;
			.box-content {
				img {
					width: 1.14rem;
					margin-left: 0.18rem;
				}
				height: 0.4rem;
				line-height: 0.4rem;
				border-radius: 0.04rem;
				color: #202741;
				cursor: pointer;
				margin: 0 0.04rem;
				&.active {
					background: #2f6bef !important;
					color: #fff;
				}
				&:hover {
					background: rgba(47, 107, 239, 0.1);
				}
				&:nth-of-type(n + 2) {
					margin-top: 0.1rem;
				}
			}
		}
		.content-box {
			width: calc(100% - 1.3rem);
		}
	}
}
</style>
