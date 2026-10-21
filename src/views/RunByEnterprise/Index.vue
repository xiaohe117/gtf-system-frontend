<template>
	<div class="overallSituation">
		<Left />
		<div class="middle">
			<div class="map-container">
				<div class="map-search">
					<TargetSearchEnterprise />
					<div class="title-box">目标企业</div>
					<div class="right-box">
						<RoundRectTabs
							class="map-tabs"
							v-model="activeTab"
							:tabsList="['世界', '中国']"
							@change="changeTab"
						></RoundRectTabs>
						<div class="reset-btn" @click="initStore">
							<img
								src="@/assets/images/runByEnterprise/center/reset-icon.png"
								alt=""
							/>
						</div>
					</div>
					<HotCity v-if="activeTab === 1" />
				</div>

				<div class="map-content">
					<WorldMap v-if="activeTab === 0" @handleMapClick="handleMapClick" />
					<ChinaMap v-if="activeTab === 1" @handleMapClick="handleMapClick" />
				</div>
				<!-- <ToolbarLeft />
				<ToolbarRight /> -->
				<RegionCount />
			</div>
			<Center />
		</div>
		<Right />
	</div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';
import RegionCount from '@/views/OverallSituation/Center/components/RegionCount.vue';
import TargetSearchEnterprise from '@/views/RunByEnterprise/Left/components/TargetSearchEnterprise.vue';
import ChinaMap from '@/views/OverallSituation/components/map/ChinaMap.vue';
import WorldMap from '@/views/OverallSituation/components/map/WorldMap.vue';
// import ToolbarLeft from './Center/toolbar/Left.vue';
// import ToolbarRight from './Center/toolbar/Right.vue';
import Center from './Center/Index.vue';
import HotCity from './Center/components/HotCity.vue';
import Left from './Left/Index.vue';
import Right from './Right/Index.vue';

const store = useUserStore();
// 默认展示中国
const activeTab = ref(1) as any;

watch(
	() => store.mapMode,
	() => {
		activeTab.value = store.mapMode;
	},
	{ deep: true }
);
// 进入该页面默认不选中地区，初始化所有相关store
const initStore = () => {
	store.setContinentName('');
	store.setMapMode(activeTab.value);
	store.setProvinceName('');
	store.setSelectedHotCity(''); // 清空热门城市选择
};
initStore();
const changeTab = () => {
	store.setMapMode(activeTab.value);
};

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});
const handleMapClick = (name: string) => {
	if (activeTab.value === 0) {
		store.setContinentName(name);
		return;
	}
	store.setProvinceName(name);
};
</script>

<style lang="less" scoped>
.overallSituation {
	padding-top: 0.15rem;
	display: flex;
	gap: 0.2rem;
	// height: calc(100% - 0.24rem);
	background-image: url('@/assets/images/common/bg.jpg');
	background-repeat: no-repeat;
	// background-size: cover;
	background-size: 100% 100%;
	padding-bottom: 0.2rem;
}
.middle {
	flex: 1;
	height: 100%;
	min-width: 0;
}
.map-container {
	height: 4.92rem;
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	.map-content{
		flex: 1;
		.china-map{
			padding-right: 0.4rem;
		}
	}
}

.map-search {
	display: flex;
	justify-content: space-between;
	// padding-top: 0.6rem;
	width: 100%;
	position: relative;
	:deep(.search-box) {
		// margin-left: 0.18rem;
	}
	.title-box {
		width: 3.3rem;
		height: 0.38rem;
		font-family: YouSheBiaoTiHei;
		font-size: @g-font-size-large;
		text-align: center;
		color: #ffffff;
		line-height: 0.38rem;
		letter-spacing: 0.05rem;
		text-shadow: 0px 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
		background: url('@/assets/images/runByEnterprise/center/title-bg.png');
		background-size: 100% 100%;
	}
	.right-box {
		display: flex;
		align-items: flex-start;
		.reset-btn {
			cursor: pointer;
			margin-left: 0.08rem;
			img {
				width: 0.5rem;
				height: 0.5rem;
			}
		}
	}
}

.search-form {
	display: flex;
	img {
		width: 0.47rem;
		height: 0.47rem;
	}
	.custom-search-input {
		margin-left: 0.05rem;
		height: 0.4rem;
		--el-input-placeholder-color: #409eff;
		:deep(.el-input__wrapper) {
			width: 1.67rem;
			background: #fff3;
			box-shadow: 0 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
			border-radius: 0.08rem;
			border: #fff;
			backdrop-filter: blur(0.15);
		}
	}
}
:deep(.tabs-control > div) {
	line-height: 0.3rem;
}
:deep(.map-tabs > div) {
	line-height: 0.42rem;
	backdrop-filter: none;
	font-size: 0.18rem;
}
:deep(.map-tabs > div.active) {
	border-radius: 0.23rem;
}
.map-tabs {
	// margin-right: 0.35rem;
	height: 0.46rem;
	border-radius: 0.23rem;
}
.map-enterprise {
	position: absolute;
	left: 0.25rem;
	top: 1.15rem;
	z-index: 1200;
	.ent-item {
		margin-bottom: 0.1rem;
		height: 0.42rem;
	}
	.ent-common {
		background-repeat: no-repeat;
		background-size: cover;
		height: 0.42rem;
		width: 1.11rem;
		display: block;
		cursor: pointer;
	}
	.ent-1 {
		background-image: url('@/assets/images/runByEnterprise/map-icon-1.png');
	}
	.ent-2 {
		background-image: url('@/assets/images/runByEnterprise/map-icon-2.png');
	}
	.ent-3 {
		width: 2.71rem;
		background-image: url('@/assets/images/runByEnterprise/map-icon-3.png');
	}
}
</style>
