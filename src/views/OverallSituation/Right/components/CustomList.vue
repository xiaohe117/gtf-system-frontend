<template>
	<!-- 自定义列表数据 -->
	<div class="custom-list-box" ref="customListRef">
		<div class="custom-legend">
			<template v-if="isShowLegend">
				<span v-for="(item, index) in customLegend" :key="index" class="custom-legend-item">
					<i :style="{ background: item.color }"></i>
					{{ item.label }}
				</span>
			</template>
		</div>
		<div class="custom-list" v-if="rightTableList.length > 0">
			<div v-for="(item, index) in rightTableList" :key="index" class="custom-list-item">
				<div class="fx-r fx-al-c">
					<div class="index">{{ index + 1 }}</div>
					<div class="label overflow-ellipsis" :title="item.settleDistrict">
						{{ item.settleDistrict }}
					</div>
					<div class="value flex-x-start fx-1">
						<template v-for="(legend, legendIndex) in customLegend" :key="legendIndex">
							<div
								class="value-item"
								:style="{
									background: legend.color,
									width: item[legend.prop] ?(item[legend.prop] / maxTableValue) * 100 + '%':'0px',
								}"
								@mouseover="handleMouseover(item, $event)"
								@mouseout="handleMouseout"
							></div>

							<span class="value-text" v-if="isShowScale">
								{{ item[legend.prop] }}</span
							>
						</template>
					</div>

					<!-- <div
						class="value flex-x-start fx-1"
						v-for="(legend, legendIndex) in customLegend"
						:key="legendIndex"
					>
						<div
							class="value-item"
							:style="{
								background: legend.color,
								width: (item[legend.prop] / maxTableValue) * 100 + '%',
							}"
							@mouseover="handleMouseover(item, $event)"
							@mouseout="handleMouseout"
						></div>

						<span class="value-text" v-if="isShowScale"> {{ item[legend.prop] }}</span>
					</div> -->
				</div>
			</div>
			<div class="scale-container" v-if="isShowScale">
				<div class="scale-line"></div>
				<div class="scale-points">
					<span
						class="scale-point"
						v-for="i in 5"
						:key="i"
						:style="{ left: (i - 1) * 25 + '%' }"
					>
						<span class="scale-label">
							{{ Math.round(((i - 1) * maxTableValue) / 4) }}
						</span>
					</span>
				</div>
				<div style="margin-top: 0.2rem;color: black;text-align: right;font-size: 0.16rem;margin-right: -0.1rem;color: rgba(0, 0, 0, 0.65);">投资总额/亿元</div>
			</div>
		</div>
		<default-empty-container :height="'3.3rem'" v-else />
		<!-- 鼠标移入提示信息 -->
		<div
			class="custom-list-popover"
			v-show="isShowTooltip"
			:style="{
				left: toolTipPosition.x + 'px',
				top: toolTipPosition.y + 'px',
				minWidth: '1.6rem',
			}"
		>
			<div class="label">{{ currentNode.name }}</div>
			<div class="value">
				<div v-for="(legend, legendIndex) in customLegend" :key="legendIndex" class="item">
					
					<template v-if="legend.label === '新签约产业项目'">
						<div style="margin-bottom: 0.02rem">{{ legend.label }}</div>
						<i :style="{ borderColor: legend.color }"></i>
						{{ currentNode.settleDistrict }}
						<span>{{ currentNode.signedCompletionRate }}%</span>
						({{ currentNode[legend.prop] }}个)
					</template>

					<template v-else-if="legend.label === '年产业招商项目入统备案(注册)金额'">
						<div style="margin-bottom: 0.02rem">{{ legend.label }}</div>
						<i :style="{ borderColor: legend.color }"></i>
						{{ currentNode.settleDistrict }}
						<span>{{ currentNode.registeredCompletionRate }}%</span>
						({{ currentNode[legend.prop] }}亿元)
					</template>

					<template v-else-if="legend.label === '跟进有接洽企业'">
						<i :style="{ borderColor: legend.color }"></i>
						{{ legend.label }} {{ currentNode[legend.prop] }}
					</template>

					<template v-if="legend.code === '3_1'">
						<div style="margin-bottom: 0.02rem">{{ legend.label }}</div>
						<i :style="{ borderColor: legend.color }"></i>
						{{ currentNode.settleDistrict }}
						<span>{{ currentNode.newlySignedIndustrialProRate }}%</span>
						({{ currentNode[legend.prop] }}亿元)
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { getSize } from '@/utils';

defineProps({
	isShowLegend: {
		type: Boolean,
		default: false,
	},
	isShowScale: {
		type: Boolean,
		default: true,
	},
	rightTableList: {
		type: Array as PropType<any[]>,
		default: () => [],
	},
	maxTableValue: {
		type: Number,
		default: 0,
	},
	customLegend: {
		type: Array as PropType<any[]>,
		default: () => [],
	},
});
// const emit = defineEmits(['handleMouseover', 'handleMouseout']);
// const handleMouseover = (item: any, e: any) => {
//   console.log(555);
//   emit('handleMouseover', item, e);
// }
// const handleMouseout = () => {
//   emit('handleMouseout');
// };
const isShowTooltip = ref<boolean>(false);
const customListRef = ref<any>(null);
const toolTipPosition = ref({ x: 0, y: 0 });
const currentNode = ref<any>({});
// const handleMouseover = (item: any, $event: any) => {
// 	currentNode.value = item;
// 	const basePosition = customListRef.value.getBoundingClientRect();
// 	isShowTooltip.value = true;
// 	toolTipPosition.value.x = $event.clientX - basePosition.x + getSize(20);
// 	toolTipPosition.value.y = $event.clientY - basePosition.y - getSize(10);
// };

const handleMouseover = (item: any, event: MouseEvent) => {
	currentNode.value = item;
	isShowTooltip.value = true;

	// 获取鼠标位置
	const mouseX = event.clientX;
	const mouseY = event.clientY;

	// 设置安全边距（使用getSize转换为px）
	const safeMargin = getSize(20); // 20px 转换为 rem 对应的 px 值

	// 获取窗口尺寸
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	// 估算提示框尺寸（可以根据实际情况调整）
	const tooltipWidth = getSize(160); // 1.6rem 转换为 px
	const tooltipHeight = getSize(100); // 估计高度 1rem 转换为 px

	// 计算是否靠近右边界或底部
	const isNearRightEdge = mouseX + tooltipWidth + safeMargin > windowWidth;
	const isNearBottomEdge = mouseY + tooltipHeight + safeMargin > windowHeight;

	// 获取容器基准位置
	const basePosition = customListRef.value?.getBoundingClientRect();
	if (!basePosition) return;

	// 根据位置调整提示框显示位置
	if (isNearRightEdge) {
		// 在鼠标左侧显示
		toolTipPosition.value.x = mouseX - basePosition.left - tooltipWidth - getSize(10);
	} else {
		// 在鼠标右侧显示（默认）
		toolTipPosition.value.x = mouseX - basePosition.left + getSize(10);
	}

	if (isNearBottomEdge) {
		// 在鼠标上方显示
		toolTipPosition.value.y = mouseY - basePosition.top - tooltipHeight - getSize(10);
	} else {
		// 在鼠标下方显示（默认）
		toolTipPosition.value.y = mouseY - basePosition.top + getSize(10);
	}
};
const handleMouseout = () => {
	isShowTooltip.value = false;
};
</script>

<style scoped lang="less">
.custom-list-box {
	position: relative;
	min-height: 4.2rem;
	.custom-legend {
		text-align: right;
		color: #4b4b4b;
		margin-bottom: 0.1rem;
		.custom-legend-item {
			margin-left: 0.16rem;
			i {
				display: inline-block;
				width: 0.1rem;
				height: 0.1rem;
				margin-right: 0.08rem;
				border-radius: 0.01rem;
			}
		}
	}
	.custom-list {
		padding-right: 0.2rem;
		overflow-y: auto;
		height: 3.65rem;
		.custom-list-item {
			margin-bottom: 0.1rem;
			cursor: pointer;
			.index {
				width: 0.2rem;
				height: 0.2rem;
				line-height: 0.2rem;
				border-radius: 50%;
				background: #4787f0;
				color: #fff;
				text-align: center;
				font-size: 0.12rem;
				margin-right: 0.12rem;
			}
			&:nth-of-type(1) {
				.index {
					background: #ff7a0d;
				}
			}
			&:nth-of-type(2) {
				.index {
					background: #ffb20d;
				}
			}
			&:nth-of-type(3) {
				.index {
					background: #00bbc4;
				}
			}
			.label {
				max-width: 1.3rem;
				text-align: left;
				font-family: MicrosoftYaHei;
				font-size: @g-font-size-base;
				color: #000000;
				margin-right: 0.12rem;
			}
			.value {
				.value-item {
					height: 0.1rem;
					position: relative;
					// .value-text {
					// 	position: absolute;
					// 	right: -0.2rem;
					// 	top: 50%;
					// 	transform: translateY(-50%);
					// 	font-size: 0.14rem;
					// 	color: rgba(0, 0, 0, 0.65);
					// 	font-family:
					// 		PingFangSC,
					// 		PingFang SC;
					// 	font-weight: 400;
					// 	white-space: nowrap;
					// }
				}
				.value-text {
					padding-left: 0.1rem;
					font-size: @g-font-size-base;
					color: rgba(0, 0, 0, 0.65);
					font-family:
						PingFangSC,
						PingFang SC;
					font-weight: 400;
					white-space: nowrap;
				}
			}
		}
	}
	.custom-list-popover {
		font-family: MicrosoftYaHei;
		position: absolute;
		z-index: 2;
		background: rgba(255, 255, 255, 0.9);
		padding: 0.1rem;
		border-radius: 0.04rem;
		box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.1);
		.label {
			color: rgba(0, 0, 0, 0.6);
			font-size: @g-font-size-base;
			margin-bottom: 0.1rem;
			font-weight: 600;
		}
		.value {
			font-size: @g-font-size-base;
			color: rgba(0, 0, 0, 0.6);
			.item {
				margin-bottom: 0.06rem;
				text-align: left;
				i {
					display: inline-block;
					border-width: 0.03rem;
					width: 0.1rem;
					height: 0.1rem;
					border-style: solid;
					border-radius: 50%;
				}
			}
		}
	}
	.scale-container {
		margin-top: 0.1rem;
		padding-left: 0.86rem;
		.scale-line {
			height: 0.01rem;
			background: rgba(0, 0, 0, 0.25);
			position: relative;
		}
		.scale-points {
			position: relative;
			height: 0.1rem;
			.scale-point {
				position: absolute;
				transform: translateX(-50%);
				.scale-label {
					font-size: @g-font-size-base;
					color: rgba(0, 0, 0, 0.65);
					position: absolute;
					top: 0.05rem;
					left: 50%;
					transform: translateX(-50%);
					white-space: nowrap;
				}
				&::before {
					content: '';
					position: absolute;
					width: 0.01rem;
					height: 0.05rem;
					background: rgba(0, 0, 0, 0.25);
					top: -0.02rem;
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}
	}
}
</style>
