<template>
	<div class="search-results">
		<div class="search-top">
			<div class="back-btn" @click="goBack">
				<el-icon><DArrowLeft /></el-icon>
				返回
			</div>
			<SearchHeader
				class="search-top-header"
				:get-qxb-token="getLatestQxbToken"
				@search="onKeywordSearch"
			/>
		</div>
		<div v-loading="isPageLoading" class="result-panel">
			<div class="filter-bar">
				<div class="filter-total">
					<span class="filter-dot"></span>
					共找到 <span class="filter-text">{{ totalCount }}</span> 条结果
				</div>
				<div class="filter-tabs">
					<span
						v-for="section in visibleSections"
						:key="section.key"
						class="filter-tab"
						:class="{ active: activeTab === section.key }"
						@click="scrollToSection(section.key)"
					>
						{{ section.title }} ({{ section.total }})
					</span>
				</div>
				<div class="filter-date-wrap">
					<span class="filter-date-label">发布时间：</span>
					<el-date-picker
						v-model="dateRange"
						class="filter-date"
						style="width: 3rem"
						type="daterange"
						unlink-panels
						placement="bottom-end"
						range-separator="—"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD"
						@change="fetchAllSections"
					/>
				</div>
			</div>
			<div v-if="isEmptyResult" class="result-empty">
				<img
					src="@/assets/images/IntelligenceOverview/emty.webp"
					class="result-empty-image"
					alt=""
				/>
				<div class="result-empty-text">暂无数据</div>
			</div>
			<div v-else ref="resultBodyRef" class="result-body">
				<SearchResultSection
					v-for="section in visibleSections"
					:key="section.key"
					:section="section"
					:page-loading="isPageLoading"
					@toggle="toggleSectionExpand(section.key)"
					@page-change="
						(page: number, size: number) => fetchSectionPage(section, page, size)
					"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getQxbToken } from '@/api/Intelligence/index';
import { DArrowLeft } from '@element-plus/icons-vue';
import useClickParent from '@/views/newOverallSituation/composables/useClickParent';
import SearchHeader from './components/SearchHeader.vue';
import SearchResultSection from './components/SearchResultSection.vue';
import useSearchResults, { type QxbTokenData } from './composables/useSearchResults';

const { clickParent } = useClickParent();
const {
	dateRange,
	isPageLoading,
	isEmptyResult,
	totalCount,
	visibleSections,
	activeTab,
	resultBodyRef,
	fetchAllSections,
	fetchSectionPage,
	toggleSectionExpand,
	onKeywordSearch,
	scrollToSection,
} = useSearchResults();

const normalizeQxbToken = (data: QxbTokenData | null | undefined): string => {
	if (!data) return '';
	if (typeof data === 'string') return data;
	return data.token || data.qxbToken || data.accessToken || data.access_token || '';
};

const getLatestQxbToken = async (): Promise<string> => {
	try {
		const res = await getQxbToken<QxbTokenData>();
		return res.code === 0 ? normalizeQxbToken(res.data) : '';
	} catch {
		return '';
	}
};

const goBack = () => {
	clickParent('intelligenceOverview');
};
</script>

<style lang="less" scoped>
.search-results {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	overflow: hidden;
}

.result-panel {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.search-top {
	position: relative;
	flex-shrink: 0;

	:deep(.search-header) {
		height: 1.6rem;
	}
}

.back-btn {
	position: absolute;
	left: 0.16rem;
	top: 0.12rem;
	z-index: 2;
	display: flex;
	align-items: center;
	gap: 0.04rem;
	padding: 0.04rem 0.12rem;
	font-size: 0.2rem;
	color: #fff;
	cursor: pointer;
}

.search-top-header {
	width: 100%;
	height: 1.6rem;
}

.filter-bar {
	display: flex;
	align-items: center;
	gap: 0.12rem;
	margin: 0.1rem 0;
	padding: 0.08rem 0.16rem;
	background: #fff;
	border-radius: 0.08rem;
	min-width: 0;
}

.filter-total {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	font-size: 0.16rem;
	font-weight: 600;
	color: #202741;
	white-space: nowrap;
}

.filter-dot {
	width: 0.08rem;
	height: 0.08rem;
	margin-right: 0.08rem;
	border-radius: 50%;
	background: #2f6bef;
}

.filter-text {
	color: #2f6bef;
}

.filter-tabs {
	flex: 3 1 auto;
	min-width: 0;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.08rem;
}

.filter-tab {
	flex-shrink: 0;
	height: 0.28rem;
	padding: 0 0.12rem;
	border: 1px solid #d0d7e6;
	border-radius: 0.16rem;
	font-size: 0.13rem;
	line-height: 0.26rem;
	color: #4e5969;
	cursor: pointer;
	white-space: nowrap;
	background: #fff;

	&.active {
		color: #2f6bef;
		border-color: #8eb6ff;
		background: #eef5ff;
	}
}

.filter-date-wrap {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	margin-left: auto;
}

.filter-date-label {
	flex-shrink: 0;
	margin-right: 0.08rem;
	font-size: 0.16rem;
	color: #4e5969;
	white-space: nowrap;
}

.filter-date {
	flex: 0 0 2.4rem;
	width: 2.4rem !important;
	min-width: 2.4rem;
	max-width: 2.4rem;

	:deep(.el-range-input) {
		font-size: 0.12rem;
	}

	:deep(.el-input__wrapper) {
		width: 2.4rem !important;
		height: 0.32rem;
		border-radius: 0.16rem;
	}
}

.result-empty {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #fff;
	border-radius: 0.12rem;
}

.result-empty-image {
	width: 2.52rem;
	height: auto;
	display: block;
}

.result-empty-text {
	margin-top: 0.22rem;
	font-size: 0.24rem;
	font-weight: 600;
	line-height: 0.32rem;
	color: #4e5969;
}

.result-body {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	background: white;
	padding-right: 0.06rem;
	border-radius: 0.1rem;
}
</style>
