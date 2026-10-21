<template>
	<div class="info-comp">
		<!-- 筛选区 -->
		<FilterBar v-model="search" @change="searchFunc" :deptCode="deptCode"/>

		<!-- 列表区 -->
		<div class="info-list" v-loading="loading">
			<default-empty-container
				v-if="!loading && list.length === 0"
				class="info-empty"
				:height="'100%'"
			/>
			<div class="info-grid">
				<div
					v-for="item in list"
					:key="item.id"
					class="info-card"
					@click="handleItemClick(item)"
				>
					<slot :item="item" />
				</div>
			</div>

			<div v-if="total > 0" class="info-pagination">
				<CommonPagination
					v-model="pagination"
					layout="total, prev, pager, next"
					:page-sizes="[8, 16, 24]"
					@change="triggerFetch"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import FilterBar from '../../Components/FilterBar.vue';
import type {
	FilterBarSearch,
	FetchListParams,
} from '../types';

const props = withDefaults(
	defineProps<{
		list: any[];
		total: number;
		loading: boolean;
		deptCode: string;
		defaultDate?:boolean
	}>(),
	{
		defaultDate:true
	}
);

// 分页/筛选变化时通知外部重新查询（由外部更新 list/total 后回传）
const emit = defineEmits<{
	fetch: [params: FetchListParams];
	itemClick: [item: any];
}>();

const search = ref<FilterBarSearch>({
	industryChain: '',
	dateRange: props.defaultDate ? [
		dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
		dayjs().format('YYYY-MM-DD'),
	] : [],
});

// 分页状态（CommonPagination v-model，total 由外部传入同步）
const pagination = ref({
	page: 1,
	size: 20,
	total: 0,
});

// 外部 total 变化时同步到分页组件
watch(
	() => props.total,
	(val) => {
		pagination.value.total = val;
	},
	{ immediate: true }
);

// 组装请求参数（分页 + 筛选）并触发外部查询
const triggerFetch = () => {
	const entity: Record<string, unknown> = {};
	if (search.value.industryChain) {
		entity.industryChainId = search.value.industryChain;
	}
	// 时间范围：优先本页筛选，其次全局日期
	const [startTime, endTime] =
		search.value.dateRange && search.value.dateRange.length >= 2
			? [search.value.dateRange[0], search.value.dateRange[1]]
			: [null, null];
	if (startTime) entity.startTime = startTime
	if (endTime) entity.endTime = endTime
	emit('fetch', {
		pageNum: pagination.value.page,
		pageSize: pagination.value.size,
		entity,
	});
};
const searchFunc = () => {
	pagination.value.page = 1;
	triggerFetch();
};

const handleItemClick = (item: any) => {
	emit('itemClick', item);
};

</script>

<style scoped lang="less">
.info-comp {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
}

.info-list {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 0.1rem 0 0;
	position: relative;
}

.info-empty {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
}

.info-grid {
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	gap: 0.12rem 0.36rem;
	overflow: auto;
}

.info-card {
	width: calc(50% - 0.18rem);
	background-image: url('@/assets/images/DeptOverview/info-list-bg.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	padding: 0.12rem 0.14rem;
	cursor: pointer;
	transition: transform 0.2s ease;
	display: flex;
	flex-direction: column;
}

:deep(.info-card-title) {
	display: flex;
	align-items: flex-start;
	gap: 0.06rem;
	margin-bottom: 0.06rem;
	.info-card-icon {
		width: 0.15rem;
		height: auto;
		flex-shrink: 0;
	}

	.info-card-title-text {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 0.04rem;
	}

	.info-card-title-name {
		color: rgba(0, 0, 0, 0.9);
		font-size: 0.16rem;
		line-height: 0.2rem;
		font-weight: 600;
		line-height: 0.2rem;
		flex-shrink: 1;
		.ellipsis-text{
			white-space: normal !important;
		}
	}

	.info-card-title-date {
		flex-shrink: 0;
		color: rgba(0, 0, 0, 0.9);
		font-size: 0.14rem;
		line-height: 0.16rem;
	}

}

:deep(.info-card-item) {
	display: flex;
	align-items: center;
	gap: 0.08rem;
	.info-card-line {
		width: calc(100% / 3);
		display: flex;
		align-items: center;
		font-size: 0.14rem;
		line-height: 0.2rem;
		color: #4d6587;
		&.is-full {
			flex: 1;
			min-width: 0;
		}
		.info-card-label {
			color: rgba(0, 0, 0, 0.5);
			flex-shrink: 0;
		}

		.info-card-value {
			flex: 1;
			color: rgba(0, 0, 0, 0.9);
			min-width: 0;
		}
	}
}
</style>
