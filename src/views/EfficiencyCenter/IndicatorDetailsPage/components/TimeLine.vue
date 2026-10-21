<template>
	<div class="timeline fx-r">
		<div
			v-for="(item, index) in timelineItems"
			:key="index"
			class="timeline-item fx-c fx-al-c"
			:class="{ active: active === item.month, 'show-month': isShowMonth(item.month) }"
			@click="handleClick(item)"
		>
			<div class="month">{{ item.month }}</div>

			<div class="line">
				<div :class="[{ circle: isShowMonth(item.month) }, item.color]"></div>
			</div>

			<!--       <div class="content">
        <p class="text-item fx-r fx-jc-ac" v-for="(el, idx) in item.texts" :key="idx">
          {{ el }}
        </p>
      </div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
interface TimelineItem {
	month: string;
	color: string;
	texts?: string[];
}

const props = defineProps({
	currentMonth: {
		type: String,
		default: '',
	},
	timelineItems: {
		type: Array as () => TimelineItem[],
		default: () => [
			{ month: '1月', color: 'grey' },
			{ month: '2月', color: 'grey' },
			{ month: '3月', color: 'grey' },
			{ month: '4月', color: 'grey' },
			{ month: '5月', color: 'grey' },
			{ month: '6月', color: 'grey' },
			{ month: '7月', color: 'grey' },
			{ month: '8月', color: 'grey' },
			{ month: '9月', color: 'grey' },
			{ month: '10月', color: 'grey' },
			{ month: '11月', color: 'grey' },
			{ month: '12月', color: 'red' },
		],
	},
});

const emit = defineEmits(['handleItemClick']);

const active = ref(props.currentMonth);

const isShowMonth = (month: string) => {
	const monthNum = Number(month.replace('月', ''));
	const currentMonthNum = Number(props.currentMonth.replace('月', ''));
	return monthNum <= currentMonthNum;
};
// const active = computed(() => props.currentMonth);
const handleClick = (item: any) => {
	if(!isShowMonth(item.month)) return;
	active.value = item.month;
	emit('handleItemClick', item.month);
};
watch(
	() => props.currentMonth,
	(val: any) => {
		active.value = val;
	}
);
</script>

<style lang="less" scoped>
@font-size-base: 0.16rem;
@color-text: #1d2129;
@color-hover: #2f6bef;
@line-height-base: 0.2rem;

@color-red: #df5953;
@color-yellow: #f5ca45;
@color-green: #53a064;
@color-grey: #999999;
@border-color-red: #efc5c9;
@border-color-yellow: #ffedb4;
@border-color-green: #c5e6c9;
@border-color-grey: #f1f1f1;

.timeline {
	flex: 1;
}
.circle-color(@color, @border-color) {
	background: @color;
	&::before {
		border: 0.05rem solid @border-color;
	}
}

.month {
	font-weight: 400;
	font-size: @font-size-base;
	color: @color-text;
	line-height: 0.22rem;
}

.line {
	margin: 0.1rem 0 0.2rem;
	position: relative;
	width: 100%;
	height: 0.04rem;
	background: #e6f0ff;

	.circle {
		position: absolute;
		width: 0.1rem;
		height: 0.1rem;
		border-radius: 50%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			border-radius: 50%;
			transform: translate(-50%, -50%);
			transition: all 0.3s ease;
			width: 0.1rem;
			height: 0.1rem;
		}

		&.red {
			.circle-color(@color-red, @border-color-red);
		}

		&.yellow {
			.circle-color(@color-yellow, @border-color-yellow);
		}

		&.green {
			.circle-color(@color-green, @border-color-green);
		}
		&.grey {
			.circle-color(@color-grey, @border-color-grey);
		}
	}
}

.content {
	.text-item {
		font-weight: 500;
		font-size: 0.14rem;
		color: #202741;
		line-height: @line-height-base;
		padding: 0.06rem 0.14rem;
		background: linear-gradient(180deg, #ffffff 0%, #ebf1fb 100%);
		box-shadow: 0rem 0.05rem 0.11rem 0.01rem rgba(124, 168, 251, 0.19);
		border-radius: 0.02rem;
		border: 0.02rem solid #ffffff;
		margin-bottom: 0.09rem;
	}
}

.timeline-item {
	width: calc(100% / 12);
	&.show-month {
		&:hover,
		&.active {
			cursor: pointer;

			.month {
				color: @color-hover;
			}

			.line {
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					width: 80%;
					height: 100%;
					background: @color-hover;
					transform: translate(-50%, -50%);
				}
			}

			.content {
				.text-item {
					color: @color-hover;
				}
			}
		}
	}
}
</style>
