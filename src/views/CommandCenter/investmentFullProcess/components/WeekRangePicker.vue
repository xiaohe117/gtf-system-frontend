<template>
	<div
		class="week-range-picker-wrap"
		:style="controlStyle"
	>
		<div
			class="week-range-picker"
			:class="{ 'is-active': pickerVisible }"
			:style="controlStyle"
			@click="openPicker"
		>
			<el-icon class="calendar-icon">
				<Calendar />
			</el-icon>
			<span class="range-text">{{ displayText }}</span>
		</div>
		<div class="week-range-picker__anchor">
			<el-date-picker
				ref="pickerRef"
				v-model="anchorDate"
				type="date"
				value-format="YYYY-MM-DD"
				:clearable="clearable"
				:editable="false"
				:cell-class-name="weekCellClassName"
				placement="bottom-start"
				:teleported="true"
				popper-class="investment-week-range-picker-popper"
				@change="handleDateChange"
				@visible-change="handleVisibleChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue';
import type { DatePickerInstance } from 'element-plus';
import dayjs from 'dayjs';
import {
	formatWeekRangeDisplay,
	getDefaultWeekRange,
	getWeekRangeByDate,
} from '../weekRange';

defineOptions({ name: 'WeekRangePicker' });

const props = withDefaults(
	defineProps<{
		modelValue: [string, string] | null;
		clearable?: boolean;
	}>(),
	{
		modelValue: null,
		clearable: false,
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: [string, string] | null];
	change: [value: [string, string] | null];
}>();

const height = inject<Ref<string>>('investmentFilterControlHeight', ref('0.42rem'));
const fontSize = inject<Ref<string>>('investmentFilterControlFontSize', ref('0.18rem'));
const controlStyle = computed(() => ({
	height: height.value,
	minHeight: height.value,
	maxHeight: height.value,
	fontSize: fontSize.value,
	'--filter-control-height': height.value,
	'--filter-control-font-size': fontSize.value,
}));

const pickerRef = ref<DatePickerInstance>();
const pickerVisible = ref(false);
const anchorDate = ref<string | null>(props.modelValue?.[0] ?? null);

const displayText = computed(() => formatWeekRangeDisplay(props.modelValue));

/**
 * 给格子打上 Element Plus 区间类名；起止周五也带 in-range，保证浅蓝底连续覆盖整周。
 */
const weekCellClassName = (date: Date) => {
	const range = props.modelValue;
	if (!range?.[0] || !range?.[1]) return '';

	const day = dayjs(date).startOf('day');
	const start = dayjs(range[0]).startOf('day');
	const end = dayjs(range[1]).startOf('day');

	if (day.isBefore(start, 'day') || day.isAfter(end, 'day')) return '';

	if (day.isSame(start, 'day')) return 'start-date in-range';
	if (day.isSame(end, 'day')) return 'end-date in-range';
	return 'in-range';
};

const emitRange = (range: [string, string] | null) => {
	emit('update:modelValue', range);
	emit('change', range);
};

onMounted(() => {
	if (!props.modelValue) {
		const range = getDefaultWeekRange();
		const [start] = range;
		anchorDate.value = start;
		emitRange(range);
	}
});

watch(
	() => props.modelValue,
	(val) => {
		anchorDate.value = val?.[0] ?? null;
	},
);

const openPicker = () => {
	pickerRef.value?.handleOpen();
};

const handleVisibleChange = (visible: boolean) => {
	pickerVisible.value = visible;
};

const handleDateChange = (value: string | null) => {
	if (!value) {
		anchorDate.value = null;
		emitRange(null);
		return;
	}

	const range = getWeekRangeByDate(value);
	const [start] = range;
	anchorDate.value = start;
	emitRange(range);
};
</script>

<style scoped lang="less">
@import '../filterControl.less';

.week-range-picker-wrap {
	position: relative;
	display: inline-flex;
	align-items: center;
	max-width: 2.9rem;
	flex: 0 0 auto;
	box-sizing: border-box;
	vertical-align: middle;
}

.week-range-picker {
	.filter-control-shell();
	gap: 0.08rem;
	width: 100%;
	cursor: pointer;

	&.is-active {
		border-color: var(--el-color-primary);
	}

	.calendar-icon {
		flex: 0 0 auto;
		width: 0.14rem;
		height: 0.14rem;
		font-size: 0.14rem;
		color: var(--el-text-color-placeholder);
	}

	.range-text {
		flex: 1;
		min-width: 0;
		font-size: @filter-control-font-size;
		line-height: 1;
		color: var(--el-text-color-regular);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.week-range-picker-wrap:hover .week-range-picker {
	border-color: var(--el-border-color-hover);
}

.week-range-picker__anchor {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 0;
	overflow: hidden;
	opacity: 0;
	pointer-events: none;

	:deep(.el-date-editor) {
		width: 100%;
	}
}
</style>

<!-- 单月日历复用 EP 区间视觉：浅蓝底覆盖周五到周五，起止圆点，取消「今天」高亮 -->
<style lang="less">
.investment-week-range-picker-popper {
	.el-date-table td.in-range .el-date-table-cell {
		background-color: #f2f6fc;
	}

	.el-date-table td.start-date .el-date-table-cell {
		margin-left: 5px;
		border-top-left-radius: 15px;
		border-bottom-left-radius: 15px;
		background-color: #f2f6fc;
	}

	.el-date-table td.end-date .el-date-table-cell {
		margin-right: 5px;
		border-top-right-radius: 15px;
		border-bottom-right-radius: 15px;
		background-color: #f2f6fc;
	}

	.el-date-table td.start-date .el-date-table-cell__text,
	.el-date-table td.end-date .el-date-table-cell__text {
		background-color: #409eff;
		color: #fff;
		border-radius: 50%;
	}

	/* 当前「今天」不高亮 */
	.el-date-table td.today .el-date-table-cell__text {
		color: inherit;
		font-weight: normal;
	}

	.el-date-table td.today.start-date .el-date-table-cell__text,
	.el-date-table td.today.end-date .el-date-table-cell__text {
		color: #fff;
	}

	/* 去掉单日选中圆点干扰，只保留周区间起止圆点 */
	.el-date-table td.current:not(.start-date):not(.end-date) .el-date-table-cell__text {
		background-color: transparent;
		color: inherit;
	}
}
</style>
