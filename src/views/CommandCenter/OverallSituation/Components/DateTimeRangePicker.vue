<template>
	<div class="date-time-range-picker">
		<el-date-picker
			v-model="startTime"
			:type="datePickerType"
			:value-format="valueFormat"
			:format="valueFormat"
			:placeholder="startPlaceholder || defaultStartPlaceholder"
			:clearable="clearable"
			:teleported="false"
			popper-class="cur-date-range-picker-popper"
			@change="handleStartChange"
		/>
		<span class="range-separator">至</span>
		<el-date-picker
			v-model="endTime"
			:type="datePickerType"
			:value-format="valueFormat"
			:format="valueFormat"
			:placeholder="endPlaceholder || defaultEndPlaceholder"
			:clearable="clearable"
			:teleported="false"
			popper-class="cur-date-range-picker-popper"
			:disabled-date="endDisabledDate"
			@change="handleEndChange"
		/>
	</div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DateTimeRangePicker' });

type PickerType = 'date' | 'datetime';

const props = withDefaults(
	defineProps<{
		/** 日期范围 [startTime, endTime] */
		modelValue: [string, string] | null;
		/** 选择器类型：date = 仅日期，datetime = 日期+时间 */
		type?: PickerType;
		startPlaceholder?: string;
		endPlaceholder?: string;
		clearable?: boolean;
	}>(),
	{
		modelValue: null,
		type: 'datetime',
		clearable: true,
	}
);

const datePickerType = computed(() => props.type ?? 'datetime');

const valueFormat = computed(() =>
	props.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
);

const defaultStartPlaceholder = computed(() =>
	props.type === 'date' ? '开始日期' : '开始日期时间'
);

const defaultEndPlaceholder = computed(() =>
	props.type === 'date' ? '结束日期' : '结束日期时间'
);

const emit = defineEmits<{
	'update:modelValue': [value: [string, string] | null];
	change: [value: [string, string] | null];
}>();

const startTime = ref<string | null>(props.modelValue?.[0] ?? null);
const endTime = ref<string | null>(props.modelValue?.[1] ?? null);

/** 结束时间不能早于开始时间 */
const endDisabledDate = (date: Date) => {
	if (!startTime.value) return false;
	return date.getTime() < new Date(startTime.value).getTime();
};

/** 同步外部值 */
watch(
	() => props.modelValue,
	(val) => {
		startTime.value = val?.[0] ?? null;
		endTime.value = val?.[1] ?? null;
	}
);

const emitIfComplete = () => {
	const hasStart = !!startTime.value;
	const hasEnd = !!endTime.value;
	if (hasStart && hasEnd) {
		const range: [string, string] = [startTime.value!, endTime.value!];
		emit('update:modelValue', range);
		emit('change', range);
	} else if(!hasStart && !hasEnd){
		emit('update:modelValue', null);
		emit('change', null);
	}
};

const handleStartChange = () => {
	// 如果开始时间晚于结束时间，清空结束时间
	if (startTime.value && endTime.value && new Date(startTime.value).getTime() > new Date(endTime.value).getTime()) {
		endTime.value = null;
	}
	emitIfComplete();
};

const handleEndChange = () => {
	emitIfComplete();
};
</script>

<style scoped lang="less">
.date-time-range-picker {
	display: inline-flex;
	align-items: center;
	gap: 0.08rem;
	height: 0.36rem;
	border: 0.01rem solid var(--el-border-color);
	border-radius: var(--el-border-radius-base);
	padding: 0 0.12rem;
	background: var(--el-fill-color-blank);
	transition: border-color var(--el-transition-duration);
	box-sizing: border-box;

	&:hover {
		border-color: var(--el-border-color-hover);
	}

	&:focus-within {
		border-color: var(--el-color-primary);
	}

	:deep(.el-date-editor) {
		flex: 1;
		min-width: 0;
        &.el-input{
            --el-component-size:0.36rem;
            line-height:  0.36rem;
            height: 0.36rem;
        }
		.el-input__wrapper {
			box-shadow: none;
			background: transparent;
			padding: 0;
			height: 0.36rem;
			min-height: auto;
		}

		.el-input__inner {
			line-height:  0.36rem;
            height: 0.36rem;
			font-size: 0.16rem;
		}
	}

	.range-separator {
		flex: 0 0 auto;
		color: var(--el-text-color-placeholder);
		font-size: 0.18rem;
		white-space: nowrap;
	}
}
</style>
