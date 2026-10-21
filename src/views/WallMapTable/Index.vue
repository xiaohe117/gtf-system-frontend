<!--
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2025-08-12 15:02:47
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-01 10:10:09
-->
<template>
	<div class="wall-map-table">
		<SubPageBackBtn />
		<header>
			<div class="title">专项挂图作战</div>
			<div
				v-for="(item, index) in tabs"
				:key="index"
				class="tab-item"
				:class="{ active: curTab.prop === item.prop }"
				@click="selectTab(item)"
			>
				<div class="icon">
					<img :src="item.icon" alt="" />
				</div>
				<div>
					<p class="label">{{ item.label }}</p>
					<p class="num">
						<span>{{ validatenull(item.value) ? '--' : item.value }}</span
						><span class="unit">{{ item.unit }}</span>
					</p>
				</div>
				<div class="bg-img" v-if="curTab.prop === item.prop">
					<img src="@/assets/images/wallMapTable/tab-active-bg.png" alt="" />
				</div>
			</div>
			<!-- 隐藏时间选择器 -->
			<div class="date-picker-wrapper" v-if="false">
				<DateRangePicker v-model="selectedDateRange" />
			</div>
		</header>
		<main ref="frameBoxRef">
			<Dashboard :dateRange="selectedDateRange" v-if="isShowChart" />
			<TableList :curTab="curTab" :dateRange="selectedDateRange" v-else />
		</main>
		<!--<div
			class="change-show"
			v-show="isCanChange"
			@click="toggleShow"
			:class="{ 'show-table': !isShowChart }"
		></div>-->
	</div>
</template>
<script lang="ts" setup>
import { validatenull } from '@/utils/form';
import { queryTabCount } from '@/api/wallMapTable';
import tabIcon1 from '@/assets/images/wallMapTable/tab-icon-1.png';
import tabIcon2 from '@/assets/images/wallMapTable/tab-icon-2.png';
import tabIcon3 from '@/assets/images/wallMapTable/tab-icon-3.png';
import TableList from './TableList/Index.vue';
import Dashboard from './Dashboard/Index.vue';
import DateRangePicker from './components/DateRangePicker.vue';

const tabs: any = ref([
	{ label: '央企挂图', prop: '1', value: null, icon: tabIcon1, unit: '家央企' },
	{ label: '世界500强', prop: '2', value: null, icon: tabIcon2, unit: '家企业' },
	{ label: 'XXXX图', prop: '3', value: null, icon: tabIcon3, unit: '家企业' },
	{ label: 'XXXX图', prop: '4', value: null, icon: tabIcon3, unit: '家企业' },
]);
const curTab: any = ref({});
queryTabCount().then((res: any) => {
	if (!res.data || res.data.length === 0) {
		tabs.value = [];
		return;
	}
	const obj: any = {};
	res.data.forEach((ele: any, index: number) => {
		obj[ele.code || index + 1] = ele;
	});
	tabs.value = tabs.value.slice(0, res.data.length);
	tabs.value.forEach((item: any) => {
		item.value = obj[item.prop].specialCont;
		item.label = obj[item.prop].label || obj[item.prop].specialName;
		item.specialName = obj[item.prop].specialName;
	});
	[curTab.value] = tabs.value;
});
queryTabCount();

const isShowChart = ref(false);
// const isCanChange = computed(() => curTab.value.prop === '1');

const selectTab = (tab: any) => {
	if (curTab.value.prop === tab.prop) {
		return;
	}
	curTab.value = tab;
	// 只有重点央企才有仪表盘
	// isShowChart.value = isCanChange.value;
};
// 日历相关状态
const selectedDateRange = ref<{ start: Date; end: Date } | null>(null);

/*
const toggleShow = () => {
	isShowChart.value = !isShowChart.value;
};
*/
</script>
<style lang="less" scoped>
.wall-map-table {
	// height: calc(100vh - 0.96rem);
	height: 100%;
	display: flex;
	flex-direction: column;
	padding-top: 0.24rem;
	// padding-bottom: 0.24rem;
	header {
		display: flex;
		font-size: 0.28rem;
		width: 18.63rem;
		font-family: YouSheBiaoTiHei;
		height: 0.91rem;
		background-image: url('@/assets/images/wallMapTable/header-bg.png');
		background-size: 100% 100%;
		.title {
			color: #fff;
			font-size: 0.36rem;
			text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
			background-image: url('@/assets/images/wallMapTable/tab-title-bg.png');
			background-size: 100% 100%;
			width: 3.49rem;
			height: 1.03rem;
			line-height: 1.03rem;
			text-align: center;
			margin-top: calc(0.91rem - 1.03rem);
		}
		.tab-item {
			width: 3.46rem;
			margin-top: 0.03rem;
			height: calc(100% - 0.03rem - 0.02rem);
			margin-right: 0.2rem;
			background-image: url('@/assets/images/wallMapTable/tab-bg.png');
			background-size: 100% 100%;
			padding-left: 0.76rem;
			display: flex;
			align-items: center;
			color: rgba(0, 0, 0, 0.6);
			position: relative;
			cursor: pointer;
			&.active {
				color: #fff;
				.label {
					text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
				}
			}
			&.disabled {
				cursor: not-allowed;
			}
			* {
				z-index: 1;
			}
			.icon {
				img {
					height: 0.56rem;
				}
			}
			.label {
				font-size: 0.28rem;
			}
			.num {
				font-size: @g-font-size-base;
				font-family:
					PingFangSC,
					PingFang SC;
				.unit {
					margin-left: 0.04rem;
				}
			}
			.bg-img {
				position: absolute;
				width: 100%;
				height: calc(100% + 0.2rem);
				top: 0;
				left: 0;
				z-index: 0;
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
		.date-picker-wrapper {
			margin-left: auto;
			display: flex;
			align-items: center;
		}
	}
	main {
		height: calc(100% - 0.91rem - 0.3rem);
		flex: 1;
		width: 100% !important;
		margin-top: 0.3rem;
		position: relative;
	}
}

:deep(.main-content) {
	background: url('@/assets/images/wallMapTable/wall-bg.png') center / 100% 100% no-repeat;
	padding-bottom: 0.09rem;
	padding-left: 0.1rem;
	padding-right: 0.1rem;
	height: 100%;
	.outside-content {
		// display: none;
		border-radius: 0.14rem 0.4rem 0.14rem 0.14rem;
	}
	.title-body-content {
		display: flex;
		flex-direction: column;
		.table-container {
			// display: none;
			height: 100%;
		}
	}
}
.change-show {
	background-image: url(@/assets/images/Ipad/list-bg.png);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width: 0.85rem;
	height: 1.04rem;
	position: fixed;
	top: 4rem;
	right: 0;
	cursor: pointer;
	z-index: 2;
	&.show-table {
		background-image: url(@/assets/images/Ipad/chart-bg.png);
		background-size: 100% 100%;
	}
}
</style>
