
<!--
 * @Descripttion:通用部门总览页面，除了投发委外其他的部门和区界面
 * @Author: ycyun
 * @Date:  2026-08-05 11:34:13
 * @LastEditors: ycyun
 * @LastEditTime: 2026-08-05 11:34:13
-->
<template>
	<TitleBody class="general-dept-overview" :name="`${title}招商总览`">
		<template #extra>
			<div class="config-box">
				<ModuleConfig
					:deptCode="deptCode"
					@refresh="refresh"
					v-has-permission="['Module_Config']"
				/>
			</div>
			<div class="right-extra">
				<div v-for="item in legendList" :key="item.color" class="legend-item">
					<span class="legend-dot" :style="{ backgroundColor: item.color }" />
					<span class="legend-text">{{ item.label }}</span>
				</div>
				<DateModeSelect
					:autoSelectSixBatch="isSixBatchTable"
					:disableCustom="isProjCard"
					v-show="showDateMode"
					v-model:dateValue="dateValue"
				/>
			</div>
		</template>
		<TopCard
			v-model="curCard"
			:dateValue="dateValue"
			:deptCode="deptCode"
			ref="cardRef"
			@getIsEmpty="(val) => (isEmpty = val)"
		/>
		<main ref="mainRef">
			<TitleSelect :tabs="tabs" v-model="activeTab" v-if="tabs.length > 0">
				<template #btn>
					<el-button
						@click="exportScene"
						class="export-btn"
						type="text"
						:loading="exportLoading"
						v-if="isSceneCard"
					>
						<SvgIcon v-if="!exportLoading" name="export" size="0.24rem" />
						导出
					</el-button>
					<div class="full-screen" @click="toggleFullScreen">
						<SvgIcon name="fullscreen" size="0.28rem" />
						<span>{{ isFullscreen ? '取消全屏' : '全屏' }}</span>
					</div>
					<div class="info-more" v-if="curCard.key === 'info'" @click="goMoreInfo">
						<span class="land-text">查看全市</span>
						<img
							src="@/assets/images/industry/land-arrow.webp"
							class="land-arrow"
							alt=""
						/>
					</div>
				</template>
			</TitleSelect>
			<div class="table-wrap">
				<component
					:is="curComponent"
					:key="activeTab"
					class="table-box"
					:dateValue="dateValue"
					:curTab="tabsConfig[activeTab]"
					:deptCode="deptCode"
					:ownDeptClick="true"
					:curTitleTab="tabsConfig[activeTab]?.titleTab || activeTab"
				/>
			</div>
			<DefaultEmptyContainer v-if="isEmpty" />
		</main>
	</TitleBody>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { exportSceneTable } from '@/api/commandCenter/deptOverview';
import TitleSelect from '../Components/TitleSelect.vue';
import DateModeSelect from '../Components/DateModeSelect.vue';
import ModuleConfig from './BuzComp/ModuleConfig.vue';
import TopCard from './BuzComp/TopCard.vue';
import { legendList, tabsConfig } from './config';

const router = useRouter();
defineProps({
	title: {
		type: String,
		default: '',
	},
	deptCode: {
		type: String,
		default: '',
	},
});
const isEmpty = ref(false);

const dateValue = ref<{ startTimeStr: string; endTimeStr: string }>({
	startTimeStr: '',
	endTimeStr: '',
});

const curCard: any = ref({});

const showDateMode = computed(() => !curCard.value.hideDate);

const tabs: any = computed(() => {
	const data = curCard.value.children || [];
	return data.map((item: any) => ({ name: item.name, value: item.key }));
});
const activeTab = ref('');
const curComponent = computed(() => {
	const tab = tabsConfig[activeTab.value];
	if (!tab) return false;
	return tab.comp;
});
/** 当前是否在"广州市招商引资项目六个一批情况表" */
const isSixBatchTable = computed(() => activeTab.value === 'proj_total');

// 当前是否是项目推进
const isProjCard = computed(() => curCard.value.key === 'proj');
// 当前是否是场景
const isSceneCard = computed(() => curCard.value.key === 'scene');

const cardRef = ref();
const refresh = () => {
	cardRef.value.refresh();
};
// 切换tabs的数据，默认选择第一个
watch(
	() => tabs.value,
	(val) => {
		activeTab.value = val[0]?.value;
	},
	{ immediate: true }
);

const mainRef = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);
const toggleFullScreen = () => {
	if (!mainRef.value) return;
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		mainRef.value.requestFullscreen();
	}
};
const onFullscreenChange = () => {
	isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
	document.addEventListener('fullscreenchange', onFullscreenChange);
});
onUnmounted(() => {
	document.removeEventListener('fullscreenchange', onFullscreenChange);
});
const exportLoading = ref(false);
const exportScene = () => {
	const config = tabsConfig[activeTab.value];
	const params = {
		...dateValue.value,
		...config.searchParams,
	};
	const tab = tabs.value.find((item: any) => item.value === activeTab.value);
	exportLoading.value = true;
	exportSceneTable(params, `${tab.name}.xlsx`).finally(() => {
		exportLoading.value = false;
	});
};
const goMoreInfo = () => {
	const entTab: any = {
		info_industry: 1,
		info_finance: 3,
	};
	const devTab: any = {
		info_expo: 0,
		info_policy: 2,
	};
	router.push({
		name: 'intelligenceOverview',
		query: {
			entTab: entTab[activeTab.value] || 0,
			devTab: devTab[activeTab.value] || 0,
		},
	});
};
</script>
<style lang="less" scoped>
.general-dept-overview {
	:deep(.header) {
		align-items: center;
	}
	:deep(.extra) {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.config-box {
			display: flex;
			align-items: center;
		}
	}
	:deep(.title-body-content) {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: auto;
		min-height: 0;
	}
	main {
		display: flex;
		flex: 1;
		min-height: 0;
		flex-direction: column;
		background: #fff;
		margin-top: 0.3rem;
		border-radius: 0.14rem 0.14rem 0 0;
		padding-bottom: 0.24rem;
		.table-wrap {
			flex: 1;
			min-height: 0;
			position: relative;
			display: flex;
			flex-direction: column;
			.table-box {
				flex: 1;
				min-height: 0;
				padding: 0 0.24rem;
			}
			.switch-mask {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: #fff;
				z-index: 10;
			}
		}
	}
	.full-screen,
	.export-btn {
		font-size: 0.18rem;
		margin-right: 0.28rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 400;
		white-space: nowrap;
		border: 1px solid #0068fb;
		color: #0068fb;
		height: 0.36rem;
		min-width: 1.04rem;
		padding-left: 0.13rem;
		padding-right: 0.12rem;
		border-radius: 0.06rem;
		.icon {
			margin-right: 0.04rem;
		}
	}
	.export-btn {
		justify-content: flex-start;
		.icon {
			margin-right: 0.06rem;
		}
	}
}

.right-extra {
	display: flex;
	align-items: center;
	gap: 0.2rem;
	margin-left: 0.2rem;

	.legend-item {
		display: flex;
		align-items: center;
		font-size: 0.16rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.85);
	}

	.legend-dot {
		width: 0.1rem;
		height: 0.1rem;
		margin-right: 0.08rem;
		border-radius: 0.01rem;
		border: 0.01rem solid #ffffff;
	}
}
.info-more {
	margin-left: auto;
	height: 0.35rem;
	width: 1.06rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.12rem;
	background-image: url('@/assets/images/industry/land-bg.webp');
	background-size: 100% 100%;
	cursor: pointer;
	margin-right: 0.28rem;

	.land-text {
		font-family: PingFangSC, 'PingFang SC';
		font-weight: 500;
		font-size: 0.14rem;
		color: #165dff;
		line-height: 0.2rem;
	}

	.land-arrow {
		width: 0.12rem;
		height: 0.08rem;
	}
}
</style>