<template>
	<div v-loading="loading" class="key-enterprises">
		<div class="search-row">
			<el-input
				v-model="searchKeyword"
				class="search-input"
				placeholder="请输入企业名称/统一社会信用代码/地址"
				clearable
			>
				<template #prefix>
					<img :src="SearchIcon" class="search-prefix-icon" alt="" />
				</template>
			</el-input>
		</div>

		<div class="main-tab-row">
			<div class="title-line title-group">
				<div class="active-title">
					<img src="@/assets/images/industry/point.webp" class="dot-img" alt="" />
					在穗链主/龙头企业（{{ inGzChainLeaderEnterpriseCount }}）
				</div>
			</div>
			<div class="title-line title-group">
				<div
					class="investment-title"
					:class="activeTargetTab === 'investment' ? 'active-title' : 'inactive-title'"
					@click="activeTargetTab = 'investment'"
				>
					<img
						src="@/assets/images/industry/point.webp"
						class="dot-img"
						:style="{
							visibility: activeTargetTab === 'investment' ? 'visible' : 'hidden',
						}"
						alt=""
					/>
					产业招商目标企业（{{ industryInvestmentTargetEnterpriseCount }}）
				</div>
				<div
					class="city-title"
					:class="activeTargetTab === 'city' ? 'active-title' : 'inactive-title'"
					@click="activeTargetTab = 'city'"
				>
					<img
						src="@/assets/images/industry/point.webp"
						class="dot-img"
						:style="{ visibility: activeTargetTab === 'city' ? 'visible' : 'hidden' }"
						alt=""
					/>
					市主攻目标企业（{{ cityMainTargetEnterpriseCount }}）
				</div>
			</div>
		</div>

		<div class="enterprise-main">
			<section class="enterprise-column">
				<EmptyData v-if="inGzChainLeaderEnterpriseList.length === 0" />
				<div v-else class="enterprise-list">
					<EnterpriseCard
						v-for="item in inGzChainLeaderEnterpriseList"
						:key="item.enterpriseCode"
						:item="item"
						:industry-label="props.industryLabel"
						@click="goDetail(item)"
					/>
				</div>
			</section>

			<section class="enterprise-column target-column">
				<EmptyData v-if="currentTargetEnterprises.length === 0" />
				<div v-else class="enterprise-list">
					<EnterpriseCard
						v-for="item in currentTargetEnterprises"
						:key="item.enterpriseCode"
						:item="item"
						:industry-label="props.industryLabel"
						@click="goDetail(item)"
					/>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import ServiceUrl from '@/utils/url';
import { keyEnterpriseTabList } from '@/api/industry';
import EmptyData from '@/views/CommandCenter/ClassifiedByIndustry/components/EmptyData.vue';
import EnterpriseCard from '@/views/CommandCenter/ClassifiedByIndustry/components/EnterpriseCard.vue';
import SearchIcon from '@/assets/images/industry/icon-search.svg';
import type { EnterpriseData, KeyEnterpriseTabData } from '../type';

const props = defineProps({
	industryCode: {
		type: String,
		default: '',
	},
	industryLabel: {
		type: String,
		default: '',
	},
});

const activeTargetTab = ref<'investment' | 'city'>('city');
const searchKeyword = ref('');
const loading = ref(false);

const inGzChainLeaderEnterpriseList = ref<EnterpriseData[]>([]);
const industryInvestmentTargetEnterpriseList = ref<EnterpriseData[]>([]);
const cityMainTargetEnterpriseList = ref<EnterpriseData[]>([]);
const inGzChainLeaderEnterpriseCount = ref(0);
const industryInvestmentTargetEnterpriseCount = ref(0);
const cityMainTargetEnterpriseCount = ref(0);

const currentTargetEnterprises = computed(() =>
	activeTargetTab.value === 'city'
		? cityMainTargetEnterpriseList.value
		: industryInvestmentTargetEnterpriseList.value
);

let searchTimer: ReturnType<typeof setTimeout> | null = null;

const clearSearchTimer = () => {
	if (searchTimer) {
		clearTimeout(searchTimer);
		searchTimer = null;
	}
};

const goDetail = (item: EnterpriseData) => {
	const params = new URLSearchParams({
		name: item.enterpriseName || '',
		sccode: item.enterpriseCode || '',
	});
	window.open(`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?${params}`, '_blank');
};

const resetEnterpriseData = () => {
	inGzChainLeaderEnterpriseList.value = [];
	industryInvestmentTargetEnterpriseList.value = [];
	cityMainTargetEnterpriseList.value = [];
	inGzChainLeaderEnterpriseCount.value = 0;
	industryInvestmentTargetEnterpriseCount.value = 0;
	cityMainTargetEnterpriseCount.value = 0;
};

const fetchTabData = async () => {
	if (!props.industryCode) return;
	loading.value = true;
	resetEnterpriseData();
	try {
		const res = await keyEnterpriseTabList({
			industryCode: props.industryCode,
			searchKeyword: searchKeyword.value.trim(),
		});
		if (res.code === 0) {
			const {
				inGzChainLeaderEnterpriseList: igList = [],
				industryInvestmentTargetEnterpriseList: itList = [],
				cityMainTargetEnterpriseList: cmList = [],
				inGzChainLeaderEnterpriseCount: igCount = 0,
				industryInvestmentTargetEnterpriseCount: itCount = 0,
				cityMainTargetEnterpriseCount: cmCount = 0,
			} = res.data as KeyEnterpriseTabData;
			inGzChainLeaderEnterpriseList.value = igList;
			industryInvestmentTargetEnterpriseList.value = itList;
			cityMainTargetEnterpriseList.value = cmList;
			inGzChainLeaderEnterpriseCount.value = igCount;
			industryInvestmentTargetEnterpriseCount.value = itCount;
			cityMainTargetEnterpriseCount.value = cmCount;
			if (itList.length > 0) {
				activeTargetTab.value = 'investment';
			} else if (cmList.length > 0) {
				activeTargetTab.value = 'city';
			}
		}
	} finally {
		loading.value = false;
	}
};

watch(searchKeyword, (newVal, oldVal) => {
	if (newVal.trim() === oldVal.trim()) return;
	clearSearchTimer();
	searchTimer = setTimeout(() => {
		fetchTabData();
	}, 300);
});

watch(
	() => props.industryCode,
	() => {
		clearSearchTimer();
		fetchTabData();
	},
	{ immediate: true }
);

onUnmounted(() => {
	clearSearchTimer();
});
</script>

<style lang="less" scoped>
.key-enterprises {
	width: 100%;
	height: 100%;
	padding: 0 0.28rem 0.14rem;
	display: flex;
	flex-direction: column;
	min-width: 0;
	overflow: hidden;

	.search-row {
		height: 0.36rem;
		flex-shrink: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 0.16rem;
		margin-bottom: 0.16rem;
	}

	.search-input {
		width: 3.8rem;

		:deep(.el-input__wrapper) {
			height: 0.36rem;
			padding: 0 0.1rem;
		}

		:deep(.el-input__inner) {
			height: 0.36rem;
			line-height: 0.36rem;
			font-size: 0.18rem;
		}

		:deep(.el-input__inner::placeholder) {
			font-family: PingFangSC;
			font-size: 0.18rem;
			line-height: 1.6;
			padding-top: 0.04rem;
			color: rgba(0, 0, 0, 0.4);
		}

		:deep(.el-input__icon) {
			line-height: 0.36rem;
		}

		:deep(.el-input__prefix) {
			display: flex;
			align-items: center;
		}

		.search-prefix-icon {
			width: 0.16rem;
			height: 0.16rem;
			display: block;
		}
	}

	.main-tab-row {
		display: flex;
		gap: 0.92rem;
		align-items: flex-end;
		flex-shrink: 0;
		min-width: 0;
	}

	.enterprise-main {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		column-gap: 0.5rem;
		min-width: 0;
	}

	.enterprise-column {
		height: 100%;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
	}

	.target-column {
		padding-top: 0.02rem;
	}

	.title-line {
		flex: 1;
		height: 0.32rem;
		display: flex;
		align-items: flex-end;
		gap: 0.2rem;
		min-width: 0;
		padding-left: 0.16rem;
		padding-bottom: 0.06rem;
		letter-spacing: 0.01rem;
		white-space: nowrap;
		background-image: url('@/assets/images/industry/title-bg-line.webp');
		background-size: 100% 0.1rem;
		background-repeat: no-repeat;
		background-position: 0 bottom;
		cursor: pointer;
	}

	.title-group {
		> div {
			cursor: pointer;
		}
	}

	.dot-img {
		width: 0.14rem;
		height: 0.1rem;
		vertical-align: middle;
		margin-right: 0.04rem;
	}

	.active-title,
	.inactive-title {
		font-family: MicrosoftYaHei;
		font-weight: bold;
		font-size: 0.22rem;
		color: #3a73de;
		line-height: 0.28rem;
		text-shadow: 0.01rem 0.01rem 0 #ffffff;
		text-align: left;
	}

	.inactive-title {
		color: #8b8b8b;
	}

	.enterprise-list {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		margin-top: 0.08rem;
		padding-right: 0.06rem;
		overflow-y: auto;
		overflow-x: hidden;
	}
}
</style>
