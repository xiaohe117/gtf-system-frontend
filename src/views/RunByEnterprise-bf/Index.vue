<!--
 * @Descripttion:
 * @Author: zhaochao
 * @Date: 2025-08-11 11:50:34
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-07 17:58:49
-->
<template>
	<div class="overallSituation">
		<Left />
		<div class="middle">
			<div class="map-container">
				<div class="map-search">
					<!-- <div class="search-form">
						<img src="@/assets/images/runByEnterprise/search.png" alt="" />
						<el-input
							v-model="input"
							placeholder="智能找企"
							class="custom-search-input"
							:suffix-icon="Search"
						/>
					</div> -->
					<SearchEnterprise />
					<RoundRectTabs
						class="map-tabs"
						v-model="activeTab"
						:tabsList="['世界', '中国']"
					></RoundRectTabs>
				</div>
				<!--				<div class="map-enterprise">-->
				<!--					<div class="ent-item" @mouseover="mouseover" @mouseout="mouseout">-->
				<!--						<a href="#" class="ent-common ent-1" v-if="!isShowEnt"></a>-->
				<!--						<a href="#" class="ent-common ent-3" v-if="isShowEnt"></a>-->
				<!--					</div>-->
				<!--					<div class="ent-item">-->
				<!--						<a href="#" class="ent-common ent-2"></a>-->
				<!--					</div>-->
				<!--				</div>-->
				<div class="map-content">
					<WorldMap v-if="activeTab === 0" @handleMapClick="handleMapClick" />
					<ChinaMap v-if="activeTab === 1" @handleMapClick="handleMapClick" />
				</div>
				<div>
					<ModalComponent
						v-if="showModal"
						:title="activeTab === 0 ? store.continentName : store.provinceName"
						:total="modalItems.length"
						:items="modalItems"
						@close="handleClose"
						@view-details="handleViewDetails"
						@handle-click="handleClick"
					/>
					<TitleComponent
						v-if="!showModal"
						:title="activeTab === 0 ? store.continentName : store.provinceName"
						:total="modalItems.length"
						@view-expand="handleExpand"
					/>
				</div>
			</div>
			<InvestmentEnterprise />
		</div>
		<Right />
	</div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';
import { useRouter } from 'vue-router';
import { chinaSearch, worldSearch } from '@/api/runByEnterprise';
// 整体情况
// import { Search } from '@element-plus/icons-vue';
import SearchEnterprise from '@/views/RunByEnterprise/Left/components/SearchEnterprise.vue';
import { chinaProvinces } from './components/map/chinaProvinces';
import ChinaMap from './components/map/ChinaMap.vue';
import WorldMap from './components/map/WorldMap.vue';
import ModalComponent from './components/map/ModalComponent.vue';
import TitleComponent from './components/map/TitleComponent.vue';
import InvestmentEnterprise from './components/InvestmentEnterprise/Index.vue';
import Left from './Left/Index.vue';
import Right from './Right/Index.vue';

const store = useUserStore();
const router = useRouter();

// const input = ref('');
const activeTab = ref(0);

const showModal = ref(true);
const modalItems: any = ref([]);

// const isShowEnt = ref(false);
const getChinaSearch = () => {
	const params = {
		provinceCode: '',
		provinceName: chinaProvinces.filter((item: any) => item.shortName === store.provinceName)[0]
			?.name,
		current: 1,
		size: 9999,
	};

	chinaSearch<any>({ data: params }).then((res) => {
		const resData = res?.data;
		if (resData && resData.records.length > 0) {
			resData.records.forEach((item: any) => {
				modalItems.value.push({
					sccode: item.sccode,
					name: item.companyName,
					country: item.areaName,
					category: item.industryName,
					description: item.dynContent,
					department: item.superDept,
					hasPlan: item.hasPlan,
				});
			});
		}
	});
};

const getWorldSearch = () => {
	const params = {
		continentAreaCode: '',
		continentAreaName: store.continentName,
		current: 1,
		size: 9999,
	};

	worldSearch<any>({ data: params }).then((res) => {
		const resData = res?.data;
		if (resData && resData.records.length > 0) {
			resData.records.forEach((item: any) => {
				modalItems.value.push({
					sccode: item.sccode,
					name: item.companyName,
					country: item.areaName,
					category: item.industryName,
					description: item.dynContent,
					department: item.superDept,
					hasPlan: item.hasPlan,
				});
			});
		}
	});
};

const getSearch = (name: string) => {
	modalItems.value = [];
	if (activeTab.value === 0) {
		store.setContinentName(name);
		getWorldSearch();
	} else {
		store.setProvinceName(name);
		getChinaSearch();
	}
};

const handleMapClick = (name: string) => {
	getSearch(name);
};

const handleClick = (item: any) => {
	router.push({
		path: '/runByEnterprise/enterpriseDetail',
		query: {
			sccode: item.sccode,
		},
	});
};

// const mouseover = () => {
// 	isShowEnt.value = true;
// };
//
// const mouseout = () => {
// 	isShowEnt.value = false;
// };

watch(
	() => activeTab.value,
	() => {
		getSearch(activeTab.value === 0 ? store.continentName : store.provinceName);
	},
	{ immediate: true }
);

const handleViewDetails = () => {};

const handleExpand = () => {
	showModal.value = true;
};

const handleClose = () => {
	showModal.value = false;
};

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});

onBeforeMount(() => {});
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
}

.map-search {
	display: flex;
	justify-content: space-between;
	padding-top: 0.6rem;
	width: 100%;
	:deep(.search-box) {
		margin-left: 0.18rem;
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
	line-height: 0.45rem;
	backdrop-filter: none;
	font-size: 0.18rem;
}
:deep(.map-tabs > div.active) {
	border-radius: 0.23rem;
}
.map-tabs {
	margin-right: 0.35rem;
	height: 0.5rem;
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
