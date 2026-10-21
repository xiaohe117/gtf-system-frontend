<template>
	<div class="investment-card" :class="`card-${lightClass[data.lightStatus]}`">
		<div class="card-title text-ellipsis2">
			{{ data.indicatorName }}（{{ data.unit || EmptyConst }}）
		</div>
		<div class="card-tag">{{ data.indicatorModule }}</div>
		<div class="card-amount">
			<div class="amount">{{ data.currentValue ?? '-' }}</div>
			<div class="completion-rate">
				完成率
				<span class="rate number-font">{{
					formatPercentValue(data.completionRate, '-')
				}}</span>
			</div>
		</div>
		<div class="card-trend">
			<div class="trend-text">同比</div>
			<div class="trend-value" :class="getUpDownClass(data.yoyPercentage)">
				<span class="trend-arrow" v-if="!isEmpty(data.yoyPercentage)"> ▲ </span>
				{{ formatPercentValue(data.yoyPercentage) }}
			</div>
		</div>
		<!-- <div class="card-btn">{{ data.batchTag }}</div> -->
	</div>
</template>

<script lang="ts" setup>
import { EmptyConst, isEmpty } from '@/utils';

defineProps<{
	data: any;
}>();

// 计算样式类名 (up/down)
const getUpDownClass = (value: any) => {
	if (isEmpty(value)) {
		return '';
	}

	const num = Number(value);
	return num >= 0 ? 'up' : 'down';
};

// 计算显示的文本
const formatPercentValue = (value: any, defaultText = EmptyConst) => {
	if (isEmpty(value)) {
		return defaultText;
	}

	return `${value}%`;
};

// 亮灯样式
const lightClass: any = {
	'01': 'red',
	'02': 'yellow',
	'03': 'green',
	'04': 'gray',
};
</script>

<style lang="less" scoped>
.investment-card {
	position: relative;
	height: 100%;
	background-size: 100% 100%;
	background-image: url('@/assets/images/EfficiencyCenter/gray-card.png');
	padding: 0.2rem 0.2rem 0.2rem 0.56rem;
	box-shadow: 0rem 0rem 0.08rem 0rem rgba(25, 43, 138, 0.34);
	border-radius: 0.08rem;

	.card-title {
		height: 0.56rem;
		font-weight: 600;
		font-size: 0.2rem;
		color: #1d2129;
		line-height: 0.28rem;
		margin-bottom: 0.05rem;
		white-space: pre-wrap;
	}

	.card-tag {
		position: absolute;
		bottom: 0.06rem;
		right: 0.08rem;
		font-family: YouSheBiaoTiHei;
		font-size: 0.42rem;
		color: rgba(164, 164, 164, 0.16);
		line-height: 0.58rem;
	}

	.card-amount {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 0.08rem;
		color: #4e5969;
		.amount {
			font-family: @number-font;
			font-weight: bold;
			font-size: 0.36rem;
			line-height: 0.42rem;
		}

		.completion-rate {
			font-weight: 500;
			font-size: 0.18rem;
			line-height: 0.25rem;
			padding-right: 0.18rem;
			.rate {
				font-weight: bold;
				font-size: 0.18rem;
				line-height: 0.21rem;
			}
		}
	}

	.card-trend {
		display: flex;
		align-items: center;

		.trend-text {
			font-weight: 500;
			font-size: 0.18rem;
			color: #4e5969;
			line-height: 0.25rem;
		}

		.trend-value {
			display: flex;
			align-items: center;
			margin-left: 0.5rem;
			font-weight: bold;
			font-size: 0.18rem;
			color: #545759;
			line-height: 0.21rem;
			&.up {
				color: #53a064;
			}
			&.down {
				color: #d76a66;
				.trend-arrow {
					transform: rotate(180deg);
				}
			}
			.trend-arrow {
				margin-right: 0.05rem;
			}
		}
	}
	/* 	.card-btn {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 0.81rem;
		height: 0.28rem;
		display: flex;
		align-items: center;
		padding-left: 0.15rem;
		background: linear-gradient(0deg, #5dc9fc 0%, #1b4df4 100%);
		border-radius: 0.31rem 0rem 0.08rem 0rem;
		border: 0.01rem solid;
		border-image: linear-gradient(190deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)) 1 1;
		font-weight: 500;
		font-size: 0.15rem;
		color: #ffffff;
		line-height: 0.21rem;
		text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
	} */
}
.card-red {
	background-image: url('@/assets/images/EfficiencyCenter/red-card.png');
	.card-tag {
		color: rgba(213, 117, 109, 0.16);
	}
	.amount,
	.rate {
		color: #d76a66;
	}
}
.card-green {
	background-image: url('@/assets/images/EfficiencyCenter/green-card.png');
	.card-tag {
		color: rgba(127, 180, 133, 0.16);
	}
	.amount,
	.rate {
		color: #73aa76;
	}
}
</style>
