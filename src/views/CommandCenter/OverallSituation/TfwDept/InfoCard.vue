<template>
	<div class="info-card" :class="[color, { selected }]">
		<div class="title">{{ item.cardTypeName }}</div>
		<!-- 只显示总数的盒子 -->
		<div v-if="type === 'onlyCount'" class="only-count">
			<div class="sub-title">
				{{ subTitle }}{{ item.measurementUnit ? `(${item.measurementUnit})` : '' }}
				<el-tooltip effect="dark" :content="item.desc" placement="top">
					<span class="tip-icon" v-if="item.desc"></span>
				</el-tooltip>
			</div>
			<div class="count-item">
				<div class="count-item-left">
					<span class="label">{{ item.valueLabel }}</span>
					<span class="count">{{ getNumberStr(item.value) }}</span>
					<span class="unit">{{ item.valueUnit }}</span>
				</div>
				<div class="count-item-right">
					<span class="label">{{ item.rateLabel }}</span>
					<span class="count">{{ getNumberStr(item.target) }}</span>
					<span class="unit">{{ item.targetUnit }}</span>
				</div>
			</div>
		</div>
		<!-- 显示对比值的盒子 -->
		<div class="compare" v-if="type === 'compare'" :class="{ 'no-margin': isTextWrap }">
			<div class="sub-title" ref="subTitleRef">
				{{ subTitle }}{{ item.valueUnit ? `(${item.valueUnit})` : '' }}
				<el-tooltip effect="dark" :content="item.desc" placement="top">
					<span class="tip-icon" v-if="item.desc"></span>
				</el-tooltip>
			</div>
			<div class="compare-box">
				<div class="compare-label">
					<span>累计完成值</span>
					<span>/</span>
					<span>年度目标值</span>
				</div>
				<div class="compare-value">
					<span :class="color">{{ getNumberStr(item.value) }}</span>
					<span class="split">/</span>
					<span class="total">{{ getNumberStr(item.target) }}</span>
				</div>
			</div>

			<div class="compare-rate">
				<span>完成率：</span
				><span :class="color" class="number">
					{{ getNumberStr(item.rate,'%') }} </span
				>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { getNumberStr } from '../DeptOverview/data';

const props = defineProps({
	type: {
		type: String,
		default: '', // 卡片类型：onlyCount（只显示总数），compare(对比，累计和目标对比)
	},
	color: {
		type: String,
		default: '', // blue|red|green
	},
	subTitle: {
		type: String,
		default: '',
	},
	item: {
		type: Object,
		default: () => ({}),
	},
	selected: {
		type: Boolean,
		default: false,
	},
});
const subTitleRef = ref(null);
const isTextWrap = ref(false);

// 检测是否换行
const checkWrap = () => {
	const el: any = subTitleRef.value;
	if (!el) return;
	// 获取元素当前的 line-height（数值）
	const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
	// 如果 scrollHeight > lineHeight，说明有多行
	const wrapped = el.scrollHeight >= lineHeight * 1.5;
	isTextWrap.value = wrapped;
};
// 在 DOM 更新后重新检测
const updateCheck = () => {
	nextTick(() => {
		checkWrap();
	});
};
watch(() => [props.subTitle, props.item?.valueUnit], updateCheck, { deep: true });
// 监听窗口大小变化
let resizeObserver: any = null;
onMounted(() => {
	updateCheck();
	window.addEventListener('resize', updateCheck);
	// 如果有需要，也可以使用 ResizeObserver 监控元素尺寸变化
	if (window.ResizeObserver) {
		resizeObserver = new ResizeObserver(updateCheck);
		if (subTitleRef.value) resizeObserver.observe(subTitleRef.value);
	}
});

onUpdated(updateCheck);

onUnmounted(() => {
	window.removeEventListener('resize', updateCheck);
	if (resizeObserver) resizeObserver.disconnect();
});
</script>
<style lang="less" scoped>
@text-red: #df5953;
@text-green: #17ba7f;
@text-blue: #165dff;
.info-card {
	width: 100%;
	height: 100%;
	background-image: url(@/assets/images/DeptOverview/card-blue.png);
	background-size: 100% 100%;
	position: relative;
	border-radius: 0.08rem;

	.number {
		font-family: DIN-Condensed-Bold;
	}

	&.red {
		background-image: url(@/assets/images/DeptOverview/card-red.png);
		.count .number {
			color: @text-red;
		}
		&.selected {
			border-color:  @text-red;
			&::after {
				border-top-color: @text-red;
			}
		}
	}
	&.green {
		background-image: url(@/assets/images/DeptOverview/card-green.png);
		.count .number {
			color: @text-green;
		}
		&.selected {
			border-color:  @text-green;
			&::after {
				border-top-color: @text-green;
			}
		}
	}

	&.selected {
		border: 0.03rem solid @text-blue;
		box-sizing: border-box;
		border-radius: 0.16rem;
		&::after {
			content: '';
			position: absolute;
			bottom: -0.16rem;
			left: 50%;
			transform: translateX(-50%);
			width: 0;
			height: 0;
			border-left: 0.16rem solid transparent;
			border-right: 0.16rem solid transparent;
			border-top: 0.16rem solid @text-blue;
		}
	}
	.title {
		height: 0.54rem;
		font-family: PingFangSC, PingFang SC;
		font-weight: 600;
		font-size: 0.2rem;
		color: #ffffff;
		line-height: 0.24rem;
		padding-left: 0.32rem;
		padding-top: 0.04rem;
	}
	.sub-title {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 0.18rem;
		color: #333333;
		line-height: 0.24rem;

		.tip-icon {
			display: inline-block;
			width: 0.24rem;
			height: 0.24rem;
			background-image: url(@/assets/images/DeptOverview/tip-icon.svg);
			background-size: 100% 100%;
			vertical-align: middle;
			cursor: pointer;
			&:hover {
				background-image: url(@/assets/images/DeptOverview/tip-icon-active.svg);
			}
		}
	}
	.sub-number {
		color: rgba(0, 0, 0, 0.65);
		font-size: 0.16rem;
		em {
			font-style: normal;
			font-family: PingFangSC, PingFang SC;
		}
	}
	.only-count {
		padding: 0 0.16rem;
		.sub-title {
			margin-bottom: 0.18rem;
		}
		.count-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			white-space: nowrap;
			&-left {
				padding-right: 0.24rem;
			}

			&-right {
				min-width: 55%;
			}
			&-left,
			&-right {
				flex: 1;
				display: flex;
				align-items: center;
				font-size: 0.16rem;
				color: rgba(0, 0, 0, 0.66);
				font-family: PingFangSC, PingFang SC;
				font-weight: 400;
				line-height: 0.2rem;
				.label {
					flex: 1;
				}
				.count {
					color: #595959;
					font-family: DIN-Condensed-Bold;
					font-weight: bold;
					font-size: 0.24rem;
					color: #595959;
					line-height: 0.32rem;
				}
				.unit {
					font-size: 0.14rem;
					color: rgba(0, 0, 0, 0.6);
				}
			}
		}
	}
	.compare {
		padding: 0 0.16rem;
		color: rgba(0, 0, 0, 0.45);
		.red {
			color: @text-red;
		}
		.green {
			color: @text-green;
		}
		.blue {
			color: #595959;
		}
		.sub-title {
			margin-bottom: 0.08rem;
		}
		.compare-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.compare-label {
			font-size: 0.16rem;
			margin-bottom: 0.1rem;
			white-space: nowrap;
			span {
				margin-right: 0.04rem;
			}
		}
		.compare-value {
			font-size: 0.26rem;
			font-family: DIN-Condensed-Bold;
			line-height: 0.32rem;
			.split {
				margin: 0 0.05rem;
			}
			.sub-value {
				font-size: 0.16rem;
			}
			.total {
				color: @text-blue;
			}
		}
		.compare-rate {
			font-size: 0.16rem;
			.number {
				font-size: 0.2rem;
				&.goal {
					color: @text-blue;
				}
			}
		}
	}
}
</style>