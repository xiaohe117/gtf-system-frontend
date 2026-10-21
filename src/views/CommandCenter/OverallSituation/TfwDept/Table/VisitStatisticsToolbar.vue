<template>
	<div class="visit-statistics-toolbar">
		<div class="toolbar-filter">
			<div class="toolbar-row">
				<div class="toolbar-left">
					<div class="subject-tabs">
						<button
							v-for="item in subjectTabs"
							:key="item.value"
							type="button"
							class="subject-tab"
							:class="{ active: localValue.subjectType === item.value }"
							@click="handleSubjectTypeChange(item.value)"
						>
							{{ item.label }}
						</button>
					</div>
					<el-select
						v-model="localValue.tagIds"
						multiple
						clearable
						collapse-tags
						collapse-tags-tooltip
						placeholder="请选择标签"
						class="filter-select tag-select"
						:teleported="false"
						@change="emitChange()"
					>
						<el-option
							v-for="item in tagOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</div>
				<div class="toolbar-right">
					<!-- <template v-if="showFillUnitFilters">
						<el-select
							v-model="localValue.fillUnitScope"
							class="filter-select scope-select"
							@change="emitChange"
						>
							<el-option label="市直部门" value="cityDept" />
							<el-option label="各区" value="district" />
							<el-option label="不限" value="all" />
						</el-select>
					</template> -->
					<el-select
						v-model="localValue.timeType"
						class="filter-select time-type-select"
						:teleported="false"
						@change="emitChange()"
					>
						<el-option label="对接时间" value="dock" />
						<el-option label="填报时间" value="fill" />
					</el-select>
					<DateTimeRangePicker
						v-model="localDateRange"
						start-placeholder="开始日期时间"
						end-placeholder="结束日期时间"
						class="date-range-picker"
						@change="emitChange"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { VisitStatisticsFilters } from '../shared/types';
import {
	DEFAULT_VISIT_FILTERS,
	normalizeTagIdsForSubjectType,
	// shouldShowTagSelect,
} from '../shared/filters';
import DateTimeRangePicker from '../../Components/DateTimeRangePicker.vue';

interface SelectOption {
	label: string;
	value: string;
}

const props = withDefaults(
	defineProps<{
		modelValue: VisitStatisticsFilters;
		tagOptions?: SelectOption[];
		fillUnitOptions?: SelectOption[];
		showFillUnitFilters?: boolean;
	}>(),
	{
		tagOptions: () => [],
		fillUnitOptions: () => [],
		showFillUnitFilters: false,
	}
);

const emit = defineEmits(['update:modelValue', 'change']);

const subjectTabs = [
	{ label: '企业', value: 'enterprise' },
	{ label: '商协会', value: 'association' },
	{ label: '科研机构', value: 'research' },
] as const;

/** dateRange 的本地形态：null = 未选择，[string, string] = 已选择 */
const localDateRange = ref<[string, string] | null>(null);

const localValue = ref<VisitStatisticsFilters>({
	...DEFAULT_VISIT_FILTERS,
	...props.modelValue,
	tagIds: normalizeTagIdsForSubjectType(
		props.modelValue?.subjectType || DEFAULT_VISIT_FILTERS.subjectType,
		props.modelValue?.tagIds?.length ? [...props.modelValue.tagIds] : []
	),
	dateRange: [],
});
/** 将 localDateRange 转为 localValue.dateRange */
const syncDateRange = (range: [string, string] | null) => {
	localValue.value.dateRange = range ? ([...range] as [string, string]) : [];
};
// 初始化时从外部值同步
const initRange = props.modelValue?.dateRange?.length
	? ([...props.modelValue.dateRange] as [string, string])
	: null;
localDateRange.value = initRange;
syncDateRange(initRange);

// const showTagSelect = computed(() => shouldShowTagSelect(localValue.value.subjectType));

watch(
	() => props.modelValue,
	(value) => {
		const newRange = value?.dateRange?.length
			? ([...value.dateRange] as [string, string])
			: null;
		localDateRange.value = newRange;
		localValue.value = {
			...DEFAULT_VISIT_FILTERS,
			...value,
			tagIds: normalizeTagIdsForSubjectType(
				value?.subjectType || DEFAULT_VISIT_FILTERS.subjectType,
				value?.tagIds?.length ? [...value.tagIds] : []
			),
			dateRange: newRange ? ([...newRange] as [string, string]) : [],
		};
	},
	{ deep: true }
);

const emitChange = (range?: [string, string] | null) => {
	// 如果是日期选择触发，先同步 range
	if (range !== undefined) {
		localDateRange.value = range;
		syncDateRange(range);
	}
	const nextValue = {
		...localValue.value,
		tagIds: normalizeTagIdsForSubjectType(
			localValue.value.subjectType,
			localValue.value.tagIds
		),
	};
	emit('update:modelValue', nextValue);
	emit('change', nextValue);
};

const handleSubjectTypeChange = (value: VisitStatisticsFilters['subjectType']) => {
	if (localValue.value.subjectType === value) return;
	localValue.value.subjectType = value;
	localValue.value.tagIds = [];
	emitChange();
};
</script>

<style scoped lang="less">
.visit-statistics-toolbar {
	display: flex;
	flex-direction: column;
	padding: 0 0 0.2rem;

	.toolbar-filter {
		display: block;
	}

	.toolbar-row {
		display: flex;
		align-items: center;
		gap: 0.16rem;
		flex-wrap: nowrap;
	}

	.toolbar-left {
		display: inline-flex;
		align-items: center;
		gap: 0.16rem;
		flex: 1 1 auto;
		min-width: 0;
	}

	.toolbar-right {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.16rem;
		flex: 0 0 auto;
	}

	.subject-tabs {
		display: flex;
		align-items: center;
		flex: 0 0 auto;
		gap: 0.14rem;
	}

	.subject-tab {
		min-width: 1.32rem;
		height: 0.48rem;
		line-height: 0.48rem;
		padding: 0 0.16rem;
		border: none;
		background: url('@/assets/images/common/grey-tab-bg.png') no-repeat center center;
		background-size: 100% 100%;
		color: rgba(0, 0, 0, 0.6);
		font-size: 0.18rem;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.2s ease;
		box-sizing: border-box;
		white-space: nowrap;

		&.active {
			background: url('@/assets/images/common/blue-tab-bg.png') no-repeat center center;
			background-size: 100% 100%;
			color: #165dff;
			font-weight: 600;
		}
	}

	.filter-select {
		flex: 0 0 auto;
	}

	.tag-select {
		width: 2.4rem;
	}

	.time-type-select {
		width: 1.45rem;
	}

	.scope-select {
		width: 1.7rem;
	}

	.date-range-picker {
		width: 4.3rem;
		min-width: 4.3rem;
		max-width: 4.3rem;
		flex: 0 0 4.3rem;
	}

	:deep(.el-select__wrapper),
	:deep(.el-input__wrapper) {
		min-height: 0.48rem;
		border-radius: 0.08rem;
		font-size: 0.18rem;
	}

	:deep(.el-date-editor.el-input__wrapper) {
		padding-left: 0.12rem;
	}

	:deep(.el-date-editor--datetimerange) {
		width: 4.3rem !important;
		min-width: 4.3rem !important;
		max-width: 4.3rem !important;
	}

	:deep(.el-select__placeholder),
	:deep(.el-input__inner),
	:deep(.el-tag),
	:deep(.el-range-input) {
		font-size: 0.18rem;
	}

	:deep(.el-select__selected-item),
	:deep(.el-select__input-wrapper) {
		font-size: 0.18rem;
	}

	:deep(.el-button) {
		height: 0.48rem;
		padding: 0 0.2rem;
		border-radius: 0.1rem;
		font-size: 0.18rem;
	}

	@media (max-width: 1200px) {
		.toolbar-row {
			overflow-x: auto;
			overflow-y: hidden;
			white-space: nowrap;
		}

		.toolbar-left,
		.toolbar-right {
			white-space: nowrap;
		}
	}
	:deep(.el-select__wrapper) {
		line-height: 0.36rem;
		min-height: 0.36rem;
		font-size: 0.18rem;
	}
}
</style>
