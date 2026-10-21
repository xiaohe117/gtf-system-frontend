<template>
	<div class="calendar-wrapper">
		<el-popover
			placement="bottom-start"
			:width="400"
			trigger="click"
			v-model:visible="calendarVisible"
		>
			<template #reference>
				<div class="calendar-trigger">
					<span v-if="selectedDateRange">
						{{ formatDateRange(selectedDateRange) }}
					</span>
					<span v-else class="placeholder">请选择日期</span>
					<el-icon><Calendar /></el-icon>
				</div>
			</template>
			<div class="custom-calendar">
				<div class="calendar-header">
					<el-button text @click="changeMonth(-1)" :icon="ArrowLeft"></el-button>
					<span class="current-month">{{ currentYear }}年 / {{ currentMonth }}月</span>
					<el-button text @click="changeMonth(1)" :icon="ArrowRight"></el-button>
				</div>
				<div class="calendar-body">
					<div class="weekdays">
						<div v-for="day in weekdays" :key="day" class="weekday">
							{{ day }}
						</div>
					</div>
					<div class="dates">
						<div
							v-for="date in calendarDates"
							:key="date.key"
							class="date-cell"
							:class="{
								'other-month': !date.isCurrentMonth,
								selected: isDateInRange(date.date),
								'range-start': isRangeStart(date.date),
								'range-end': isRangeEnd(date.date),
								'in-range': isInRange(date.date),
							}"
							@click="selectDate(date)"
						>
							{{ date.day }}
						</div>
					</div>
				</div>
				<div class="calendar-footer">
					<el-button @click="resetDate" class="reset-btn">重置</el-button>
					<el-button type="primary" @click="confirmDate">确认</el-button>
				</div>
			</div>
		</el-popover>
	</div>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight, Calendar } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

interface DateRange {
	start: Date;
	end: Date;
}

interface Props {
	modelValue?: DateRange | null;
}

interface Emits {
	// eslint-disable-next-line no-unused-vars
	(e: 'update:modelValue', value: DateRange | null): void;
	// eslint-disable-next-line no-unused-vars
	(e: 'change', value: DateRange | null): void;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: null,
});

const emit = defineEmits<Emits>();

const getDefaultDateRange = (): DateRange => {
	const startDate = dayjs().startOf('day').toDate();
	const endDate = dayjs().add(6, 'day').endOf('day').toDate();
	return { start: startDate, end: endDate };
};

const calendarVisible = ref(false);
const currentYear = ref(dayjs().year());
const currentMonth = ref(dayjs().month() + 1);
const selectedDateRange = ref<DateRange | null>(props.modelValue || getDefaultDateRange());
const tempDateRange = ref<DateRange | null>(props.modelValue || getDefaultDateRange());

const weekdays = ['一', '二', '三', '四', '五', '六', '七'];

watch(
	() => props.modelValue,
	(newVal) => {
		selectedDateRange.value = newVal;
		tempDateRange.value = newVal;
	}
);

const calendarDates = computed(() => {
	const year = currentYear.value;
	const month = currentMonth.value;
	const firstDay = dayjs(`${year}-${month}-01`);
	const lastDay = firstDay.endOf('month');
	const firstDayOfWeek = firstDay.day() === 0 ? 7 : firstDay.day();

	const dates = [];

	const prevMonthDays = firstDayOfWeek - 1;
	const prevMonth = firstDay.subtract(1, 'month');
	const prevMonthLastDay = prevMonth.endOf('month').date();

	// eslint-disable-next-line no-plusplus
	for (let i = prevMonthDays - 1; i >= 0; i--) {
		const day = prevMonthLastDay - i;
		dates.push({
			day,
			date: prevMonth.date(day).toDate(),
			isCurrentMonth: false,
			key: `prev-${day}`,
		});
	}

	// eslint-disable-next-line no-plusplus
	for (let i = 1; i <= lastDay.date(); i++) {
		dates.push({
			day: i,
			date: firstDay.date(i).toDate(),
			isCurrentMonth: true,
			key: `current-${i}`,
		});
	}

	const remainingDays = 42 - dates.length; // 6行 x 7列 = 42个格子
	// eslint-disable-next-line no-plusplus
	for (let i = 1; i <= remainingDays; i++) {
		dates.push({
			day: i,
			date: lastDay.add(i, 'day').toDate(),
			isCurrentMonth: false,
			key: `next-${i}`,
		});
	}

	return dates;
});

const changeMonth = (offset: number) => {
	const newDate = dayjs(`${currentYear.value}-${currentMonth.value}-01`).add(offset, 'month');
	currentYear.value = newDate.year();
	currentMonth.value = newDate.month() + 1;
};

const selectDate = (dateInfo: any) => {
	const startDate = dayjs(dateInfo.date).startOf('day').toDate();
	const endDate = dayjs(dateInfo.date).add(6, 'day').endOf('day').toDate();

	tempDateRange.value = {
		start: startDate,
		end: endDate,
	};
};

const isDateInRange = (date: Date) => {
	if (!tempDateRange.value) return false;
	const d = dayjs(date).startOf('day');
	const start = dayjs(tempDateRange.value.start).startOf('day');
	const end = dayjs(tempDateRange.value.end).startOf('day');
	return d.isSame(start) || d.isSame(end) || (d.isAfter(start) && d.isBefore(end));
};

const isRangeStart = (date: Date) => {
	if (!tempDateRange.value) return false;
	return dayjs(date).startOf('day').isSame(dayjs(tempDateRange.value.start).startOf('day'));
};

const isRangeEnd = (date: Date) => {
	if (!tempDateRange.value) return false;
	return dayjs(date).startOf('day').isSame(dayjs(tempDateRange.value.end).startOf('day'));
};

const isInRange = (date: Date) => {
	if (!tempDateRange.value) return false;
	const d = dayjs(date).startOf('day');
	const start = dayjs(tempDateRange.value.start).startOf('day');
	const end = dayjs(tempDateRange.value.end).startOf('day');
	return d.isAfter(start) && d.isBefore(end);
};

const resetDate = () => {
	const defaultRange = getDefaultDateRange();
	tempDateRange.value = defaultRange;
	selectedDateRange.value = defaultRange;
	emit('update:modelValue', defaultRange);
	emit('change', defaultRange);
	currentYear.value = dayjs().year();
	currentMonth.value = dayjs().month() + 1;
};

const confirmDate = () => {
	if (tempDateRange.value) {
		selectedDateRange.value = { ...tempDateRange.value };
		emit('update:modelValue', selectedDateRange.value);
		emit('change', selectedDateRange.value);
	}
	calendarVisible.value = false;
};

const formatDateRange = (range: DateRange) => {
	const start = dayjs(range.start).format('YYYY-MM-DD');
	const end = dayjs(range.end).format('YYYY-MM-DD');
	return `${start} 至 ${end}`;
};

onMounted(() => {
	if (!props.modelValue && selectedDateRange.value) {
		emit('update:modelValue', selectedDateRange.value);
		emit('change', selectedDateRange.value);
	}
});
</script>

<style lang="less" scoped>
.calendar-wrapper {
	.calendar-trigger {
		display: flex;
		align-items: center;
		gap: 0.08rem;
		padding: 0.08rem 0.16rem;
		background: #fff;
		border-radius: 0.08rem;
		cursor: pointer;
		font-size: @g-font-size-base;
		color: #333;
		border: 1px solid #dcdfe6;
		transition: all 0.3s;
		min-width: 3rem;
		height: 0.4rem;
		justify-content: space-around;
		border-color: #409eff;
		font-family:
			PingFangSC,
			PingFang SC;
		&:hover {
			border-color: #409eff;
		}

		.el-icon {
			font-size: 0.18rem;
			color: #409eff;
		}

		.placeholder {
			color: #999;
		}
	}
}

:deep(.el-popover.el-popper) {
	padding: 0.16rem;
	border-radius: 0.08rem;
}

.custom-calendar {
	user-select: none;

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.16rem;
		padding: 0.08rem 0;

		.current-month {
			font-size: 0.24rem;
			font-weight: 600;
			color: #1890ff;
		}

		.el-button {
			padding: 0.04rem;
		}
	}

	.calendar-body {
		.weekdays {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			gap: 0.04rem;
			margin-bottom: 0.08rem;

			.weekday {
				text-align: center;
				font-size: 0.14rem;
				color: #999;
				padding: 0.08rem 0;
				font-weight: 500;
			}
		}

		.dates {
			display: grid;
			grid-template-columns: repeat(7, 1fr);

			.date-cell {
				aspect-ratio: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.18rem;
				color: #333;
				cursor: pointer;
				// border-radius: 0.04rem;
				transition: all 0.2s;
				position: relative;

				&.other-month {
					color: #999;
					opacity: 0.6;
				}

				&:hover:not(.other-month),
				&.other-month:hover {
					background: #f5f7fa;
				}

				&.range-start {
					background: #1890ff;
					color: #fff;
					font-weight: 600;
					border-radius: 0.04rem;

					&:hover {
						background: #40a9ff;
					}
				}

				&.in-range,
				&.range-end {
					background: #ebf2ff;
					color: #0054e1;

					&:hover {
						background: #ebf2ff;
					}
				}

				&.selected {
					position: relative;
				}
			}
		}
	}

	.calendar-footer {
		display: flex;
		justify-content: center;
		gap: 0.12rem;
		margin-top: 0.16rem;
		padding-top: 0.16rem;
		border-top: 1px solid #f0f0f0;

		.el-button {
			padding: 0.06rem 0.16rem;
			font-size: 0.16rem;
			width: 1rem;
			height: 0.35rem;
			&.reset-btn {
				border-color: #0081ff;
				color: #0081ff;
			}
		}
	}
}
</style>
