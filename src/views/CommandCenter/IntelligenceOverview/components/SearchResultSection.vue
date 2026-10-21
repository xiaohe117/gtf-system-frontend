<template>
	<div class="result-section" :data-section-key="section.key">
		<div class="section-head">
			<div class="section-head-left">
				<span class="section-title">{{ section.title }}</span>
				<span class="section-count">{{ section.total }}条</span>
			</div>
			<img
				v-if="section.total > collapsedCount"
				class="section-toggle"
				:src="section.expanded ? collapseImg : expandMoreImg"
				alt=""
				@click="emit('toggle')"
			/>
		</div>
		<div class="section-list" v-loading="section.loading && !pageLoading">
			<div v-if="section.list.length === 0" class="section-empty">暂无数据</div>
			<SearchResultItem
				v-for="item in visibleItems"
				:key="item.id"
				:item="item"
				:section-key="section.key"
			/>
		</div>
		<CommonPagination
			v-if="section.expanded && section.total > section.pageSize"
			v-model="pagination"
			class="section-page"
			@change="onPageChange"
		/>
	</div>
</template>

<script setup lang="ts">
import collapseImg from '@/assets/images/IntelligenceOverview/collapse.png';
import expandMoreImg from '@/assets/images/IntelligenceOverview/expand-more.png';
import { COLLAPSED_COUNT, type ResultSection } from '../composables/useSearchResults';
import CommonPagination from './CommonPagination.vue';
import SearchResultItem from './SearchResultItem.vue';

const props = defineProps<{
	section: ResultSection;
	pageLoading: boolean;
}>();

const emit = defineEmits<{
	toggle: [];
	'page-change': [page: number, size: number];
}>();

const collapsedCount = COLLAPSED_COUNT;

const pagination = reactive({
	page: props.section.pageNum,
	size: props.section.pageSize,
	total: props.section.total,
});

watch(
	() => [props.section.pageNum, props.section.pageSize, props.section.total] as const,
	([page, size, total]) => {
		pagination.page = page;
		pagination.size = size;
		pagination.total = total;
	}
);

const visibleItems = computed(() =>
	props.section.expanded ? props.section.list : props.section.list.slice(0, collapsedCount)
);

const onPageChange = (page: number, size: number) => {
	const nextPage = size !== props.section.pageSize ? 1 : page;
	emit('page-change', nextPage, size);
};
</script>

<style lang="less" scoped>
.result-section {
	padding: 0.12rem 0.16rem 0rem;
	background: #fff;
	border-radius: 0.1rem;
}

.section-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.1rem;
}

.section-head-left {
	display: flex;
	align-items: center;
	gap: 0.08rem;
	width: 5rem;
	padding: 0.08rem 0.12rem;
	background: url('@/assets/images/IntelligenceOverview/link.png') no-repeat bottom center / 100%
		auto;
	border-radius: 0.06rem;
}

.section-toggle {
	height: 0.24rem;
	cursor: pointer;
}

.section-title {
	font-size: 0.18rem;
	margin-left: 0.3rem;
	font-weight: 600;
	color: #202741;
}

.section-count {
	padding: 0 0.08rem;
	height: 0.22rem;
	line-height: 0.22rem;
	border-radius: 0.12rem;
	border: 1px solid #8eb6ff;
	font-size: 0.12rem;
	color: #2f6bef;
	background: #eef5ff;
}

.section-list {
	min-height: 0.8rem;
}

.section-empty {
	padding: 0.24rem 0;
	text-align: center;
	color: #8897b7;
	font-size: 0.14rem;
}

.section-page {
	margin-bottom: 0.1rem;
}
</style>
