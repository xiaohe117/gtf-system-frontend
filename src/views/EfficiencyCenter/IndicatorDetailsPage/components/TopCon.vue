<template>
	<div class="top-container indicator-details-top">
		<div class="top-title fx-r">
			<div class="title-left-icon">全市</div>
			<div class="title">
				{{ topData.indicatorName }}
				<span v-if="topData.tagName">【{{ topData.tagName }}】</span>
			</div>
		</div>
		<div class="top-content fx-r">
			<div class="content-left">
				<div>
					<span class="number-font">{{ topData.totalDone ?? '-' }}</span>
					<span class="unit">{{ topData.unit || '-' }}</span>
				</div>
			</div>
			<div class="content-center fx-r">
				<div :class="['rate', 'fx-r', compareClass(topData.yearOnYear)]">
					<div class="left-icon">
						<img src="@/assets/images/IndicatorDetailsPage/top-icon-growth.svg" />
					</div>
					<div class="right-content fx-r">
						<div class="label">同比</div>
						<div class="num-unit fx-r fx-al-c">
							<el-icon v-if="compareClass(topData.yearOnYear) === 'up'"
								><CaretTop
							/></el-icon>
							<el-icon v-if="compareClass(topData.yearOnYear) === 'down'"
								><CaretBottom
							/></el-icon>
							<span class="number-font">{{ topData.yearOnYear ?? '-' }}</span>
							<span class="unit">%</span>
						</div>
					</div>
				</div>
				<div :class="['rate', 'fx-r', 'aim']">
					<div class="left-icon">
						<img src="@/assets/images/IndicatorDetailsPage/top-icon-last-growth.svg" />
					</div>
					<div class="right-content fx-r fx-al-c">
						<div class="label">目标</div>
						<div class="num-unit">
							<span class="number-font">{{ topData.totalTarget ?? '-' }}</span>
							<span class="text-gray">{{ topData.unit || '-' }}</span>
						</div>
					</div>
				</div>
				<div :class="['rate', 'aim', 'fx-r']">
					<div class="left-icon">
						<img src="@/assets/images/IndicatorDetailsPage/top-icon-blue.svg" />
					</div>
					<div class="right-content fx-r fx-al-c">
						<div class="label">完成率</div>
						<div class="num-unit">
							<span class="number-font">{{ topData.totalRate ?? '-' }}</span>
							<span class="unit">%</span>
						</div>
					</div>
				</div>
				<div :class="['light', 'fx-r', lightEngObj[topData.lightStatus]]">
					<span class="label">{{ lightObj[topData.lightStatus] || '灰灯' }}</span>
					<TextRotation class="value" :text="topData.lightReason || '-'" />
				</div>
			</div>
			<div
				class="content-right"
				v-if="['项目', '线索'].includes(attrs?.indicatorData?.indicatorModule)"
			>
				<el-button type="primary" @click="handlePage"
					>查看{{ attrs?.indicatorData?.indicatorModule }}报表</el-button
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import TextRotation from '@/components/widget/TextRotation.vue';
import { indicatorDetail } from '@/api/EfficiencyCenter';
import ServiceUrl from '@/utils/url';
import { useAttrs } from 'vue';

const attrs: any = useAttrs();

const compareClass = (item: any) => {
	const num = item ?? '--';
	if (num === '--') return '';
	// eslint-disable-next-line no-nested-ternary
	return num > 0 ? 'up' : num < 0 ? 'down' : '';
};

const lightObj: any = {
	'01': '红灯',
	'02': '黄灯',
	'03': '绿灯',
	'04': '灰灯',
};
const lightEngObj: any = {
	'01': 'red',
	'02': 'yellow',
	'03': 'green',
	'04': 'grey',
};

const topData = ref<any>({});
const getIndicatorDetail = () => {
	const params = {
		indicatorCode: attrs.indicatorData?.indicatorCode,
		yearMonth: attrs.defaultDate,
		tabType: attrs.tabType,
		// 定制部门页国资委targetId不用传
		targetId: attrs.isGzwDept ? '' : attrs.deptCode
	};
	indicatorDetail(params).then((res: any) => {
		if (res.code === 0) {
			topData.value = res.data || {};
		}
	});
};

// 点击项目、线索指标跳转至项目系统指定页
const handlePage = () => {
	const url = `${ServiceUrl.clientUrl}#/operationCenter/project?url=${ServiceUrl.getQmSysUrl()}/pc/index/components/workStaticList`;
	window.open(url, '_blank');
};

onMounted(() => {
	getIndicatorDetail();
});

watch(
	() => attrs.defaultDate,
	() => {
		getIndicatorDetail();
	}
);
</script>

<style lang="less" scoped>
.top-container {
	background:
		linear-gradient(to right, rgba(210, 223, 251, 0.2), rgba(210, 223, 251, 1)),
		url('@/assets/images/IndicatorDetailsPage/top-bg.png') center/cover no-repeat;

	height: 1.41rem;
	background-size: 100% 100%;
	border-radius: 0.08rem;
	box-sizing: border-box;
	.number-font {
		font-family: @number-font;
	}
	.el-icon-arrow {
		font-size: 0.18rem;
	}
	.top-title {
		position: relative;
		height: 0.48rem;
		.title-left-icon {
			color: #fff;
			font-size: 0.16rem;
			background: #00c5d8;
			border-radius: 0.08rem 0 0.08rem 0;
			margin-right: 0.08rem;
			height: 0.34rem;
			line-height: 0.34rem;
			padding: 0 0.16rem;
			position: absolute;
			top: 0;
			left: 0;
		}
		.title {
			line-height: 0.48rem;
			font-size: 0.28rem;
			min-width: 5.14rem;
			padding: 0 1.2rem;
			box-sizing: border-box;
			width: auto;
			color: #fff;
			text-align: center;
			background: url(/src/assets/images/IndicatorDetailsPage/top-icon-center.svg) no-repeat
				center center;
			background-size: 100%;
			font-family: YouSheBiaoTiHei;
			margin: 0 auto;
		}
		.title-right-icon {
			border-radius: 0 0.08rem 0 0.08rem;
			background: #5286fa;
			height: 0.34rem;
			line-height: 0.34rem;
			font-size: 0.16rem;
			color: #fff;
			padding: 0 0.16rem;
			position: absolute;
			top: 0;
			right: 0;
		}
	}
	.top-content {
		position: relative;
		padding: 0 0.24rem;
		margin-top: 0.12rem;
		gap: 0.12rem;
		align-items: flex-end;
		.content-left {
			margin-right: 0.16rem;
			.number-font {
				font-size: 0.46rem;
				color: #2f6bef;
				line-height: 0.49rem;
			}
			.unit {
				margin-left: 0.04rem;
				font-size: 0.22rem;
				color: #202741;
				line-height: 0.28rem;
				margin-bottom: 0.04rem;
			}
			.time {
				margin-top: 0.04rem;
				color: #000;
				font-size: 0.18rem;
			}
		}
		.content-center {
			flex: 1;
			gap: 0.12rem;
			margin-right: 2.1rem;
			.number-font,
			.unit {
				font-size: 0.2rem;
				font-weight: 600;
			}
			.rate,
			.light {
				height: 0.64rem;
				background: rgba(255, 255, 255, 0.8);
				border-radius: 0.08rem;
				backdrop-filter: blur(0.02rem);
				padding: 0 0.16rem;
				align-items: center;
			}
			.rate {
				color: #202741;

				.left-icon {
					background: linear-gradient(180deg, #5ca4f8 0%, #2f6bef 100%);
					width: 0.32rem;
					height: 0.32rem;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 0.05rem;
					margin-right: 0.08rem;
					vertical-align: middle;
					img {
						width: 0.2rem;
						height: 0.2rem;
					}
				}
				.right-content {
					.label {
						margin-right: 0.3rem;
						font-size: 0.2rem;
					}
					.unit {
						font-weight: 600;
					}
				}
				.right-content {
					.label {
						margin-right: 0.12rem;
						font-size: 0.2rem;
					}
					.unit {
						font-weight: 600;
					}
				}
				&.up {
					.num-unit {
						color: #53a064;
					}
				}
				&.down {
					.num-unit {
						color: #df5953;
					}
				}
				&.aim {
					.num-unit {
						color: #2f6bef;
					}
				}
				.text-gray {
					color: #4e5969;
					font-size: 0.18rem;
					margin-left: 0.01rem;
				}
			}
			.light {
				flex-grow: 1;
				width: 0;
				align-items: center;
				box-sizing: border-box;
				.label {
					font-weight: 500;
					color: #4e5969;
					display: flex;
					align-items: center;
					flex-shrink: 0;
					padding-right: 0.16rem;
					font-size: 0.2rem;
					&::before {
						content: '';
						display: inline-block;
						width: 0.32rem;
						height: 0.32rem;
						background-image: url(/src/assets/images/dailyMonitoring/statistics/stat_icon_5.png);
						background-size: contain;
						background-repeat: no-repeat;
						margin-right: 0.08rem;
						vertical-align: middle;
					}
				}
				&.red {
					.label {
						color: #df5953;
						&::before {
							background-image: url('@/assets/images/dailyMonitoring/statistics/stat_icon_2.png');
						}
					}
				}
				&.green {
					.label {
						color: #53a064;
						&::before {
							background-image: url('@/assets/images/dailyMonitoring/statistics/stat_icon_4.png');
						}
					}
				}
				&.yellow {
					.label {
						color: #ffb10d;
						&::before {
							background-image: url('@/assets/images/IndicatorDetailsPage/yellow-light.png');
						}
					}
				}
				.value {
					flex-grow: 1;
					width: 0;
					text-align: right;
					color: #4e5969;
					font-weight: 400;
					font-size: 0.2rem;
					line-height: 0.2rem;
				}
			}
		}
		.content-right {
			position: absolute;
			right: 0.24rem;
			bottom: 0;
			text-align: right;
			font-size: 0.18rem;
			line-height: 0.3rem;
			color: #000;
		}
	}
}
</style>
<style lang="less">
// ipad 兼容
.ipad-body {
	.indicator-details-top {
		.top-content {
			gap: 0.12rem;
			.content-left {
				margin-right: 0 !important;
			}
		}
	}
}
</style>
