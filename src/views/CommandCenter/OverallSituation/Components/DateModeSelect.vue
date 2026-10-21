<!--
 * @Descripttion: 日期模式选择器（累计月/自定义日期范围）
 * @Author: ycyun
 * @Date: 2026-08-06
-->
<template>
	<div class="date-mode-select">
		<el-select v-model="dateMode" class="mode-select" @change="handleDateModeChange">
			<el-option label="累计月" value="cumulative" />
			<el-option label="自定义" value="custom" :disabled="disableCustom" />
		</el-select>
		<DateSelect
			v-if="dateMode === 'cumulative'"
			class="time-select"
			v-model="selectedCumulativeLabel"
			:options="dateOptions"
			@change="handleCumulativeChange"
		/>
		<DateTimeRangePicker
			v-else
			v-model="customDateRange"
			type="date"
			class="custom-date-picker"
			@change="handleCustomDateChange"
		/>
	</div>
</template>

<script lang="ts" setup>
import DateSelect from '@/views/CommandCenter/OverallSituation/Components/DateSelect.vue';
import DateTimeRangePicker from '@/views/CommandCenter/OverallSituation/Components/DateTimeRangePicker.vue';
import { queryTimeOptions, getLatestSixBatchSummaryYearMonth } from '@/api/commandCenter/deptOverview';

defineOptions({ name: 'DateModeSelect' });

const props = withDefaults(
	defineProps<{
		/** 是否禁用"自定义"选项 */
		disableCustom?: boolean;
		/** 是否自动选中六个一批表的最新有数据年月 */
		autoSelectSixBatch?: boolean;
	}>(),
	{
		disableCustom: false,
		autoSelectSixBatch: false,
	}
);

const emit = defineEmits<{
	'update:dateValue': [value: { startTimeStr: string; endTimeStr: string }];
	change: [value: { startTimeStr: string; endTimeStr: string }];
}>();

const dateMode = ref<'cumulative' | 'custom'>('cumulative');
const customDateRange = ref<[string, string] | null>(null);
const selectedCumulativeLabel = ref('');
const dateOptions: any = ref([]);

/** 日期值对象 */
const dateValue = ref<{ startTimeStr: string; endTimeStr: string }>({
	startTimeStr: '',
	endTimeStr: '',
});

/** 获取月最后一天 */
const getLastDayOfMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

/** 解析 "2026年1-5月" → { startTimeStr, endTimeStr } */
const parseCumulativeMonth = (
	label: string
): { startTimeStr: string; endTimeStr: string } | null => {
	const match = label.match(/^(\d{4})年(\d{1,2})-(\d{1,2})月$/);
	if (!match) return null;
	const year = match[1];
	const endMonth = match[3].padStart(2, '0');
	const lastDay = String(getLastDayOfMonth(Number(year), Number(endMonth))).padStart(2, '0');
	return {
		startTimeStr: `${year}-01-01 00:00:00`,
		endTimeStr: `${year}-${endMonth}-${lastDay} 23:59:59`,
	};
};

const emitDateValue = (val: { startTimeStr: string; endTimeStr: string }) => {
	dateValue.value = val;
	emit('update:dateValue', val);
	emit('change', val);
};

/** 累积月选择变更 */
const handleCumulativeChange = (value: string) => {
	selectedCumulativeLabel.value = value;
	const parsed = parseCumulativeMonth(value);
	if (parsed) {
		emitDateValue(parsed);
	}
};

/** 模式切换 */
const handleDateModeChange = () => {
	if (dateMode.value === 'cumulative') {
		customDateRange.value = null;
		if (selectedCumulativeLabel.value) {
			handleCumulativeChange(selectedCumulativeLabel.value);
		}
	} else {
		selectedCumulativeLabel.value = '';
		emitDateValue({ startTimeStr: '', endTimeStr: '' });
	}
};

/** 自定义日期范围变更 */
const handleCustomDateChange = (val: [string, string] | null) => {
	if (val) {
		emitDateValue({
			startTimeStr: `${val[0]} 00:00:00`,
			endTimeStr: `${val[1]} 23:59:59`,
		});
	} else {
		emitDateValue({ startTimeStr: '', endTimeStr: '' });
	}
};

/** 选中六个一批表的最新有数据年月 */
const selectLatestSixBatchMonth = async () => {
	try {
		const res: any = await getLatestSixBatchSummaryYearMonth({});
		const data = res?.data;
		if (!data?.year || !data?.month) return;
		const { year, month: latestMonth } = data;
		const latestLabel = `${year}年1-${Number(latestMonth)}月`;
		handleCumulativeChange(latestLabel);
	} catch {
		// 接口失败保持现有状态
	}
};

/** 强制切换到累积月模式 */
const forceCumulativeMode = () => {
	if (dateMode.value === 'custom') {
		dateMode.value = 'cumulative';
		handleDateModeChange();
	}
	if (props.autoSelectSixBatch) {
		selectLatestSixBatchMonth();
	}
};

/** 初始化时间选项 */
const initDateOptions = () => {
	queryTimeOptions().then((res: any) => {
		const option = res.data?.accumulatedOptions || [];
		dateOptions.value = option?.map((item: any) => item.label) || [];
		if (props.autoSelectSixBatch) {
			return;
		}
		const defaultObj = option?.find(
			(item: any) => item.defaultSelected
		) || option[0];
		selectedCumulativeLabel.value = defaultObj.label
        emitDateValue({
            ...defaultObj
        })
	});
};

watch(
	() => props.disableCustom,
	(disabled) => {
		if (disabled) {
			forceCumulativeMode();
		}
	}
);

onMounted(() => {
	initDateOptions();
});

defineExpose({
	dateValue,
	dateMode,
	forceCumulativeMode,
	selectLatestSixBatchMonth,
});
</script>

<style lang="less" scoped>
.date-mode-select {
	display: flex;
	align-items: center;

	.mode-select {
		width: 1.4rem;
		margin-right: 0.16rem;
	}   
    .time-select {
		width: 1.8rem;
	}

	.custom-date-picker {
		width: 3rem;
	}
    :deep(.el-select__wrapper) {
		line-height: 0.36rem;
		min-height: 0.36rem;
		font-size: 0.18rem;
	}
}
</style>
