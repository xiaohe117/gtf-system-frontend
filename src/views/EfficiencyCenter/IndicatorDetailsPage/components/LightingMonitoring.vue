<template>
	<SmallTitle class="lighting-monitoring">
		<template #title>
			{{ `${indicatorName || attrs.indicatorData.indicatorName || '--'}指标-亮灯监测` }}
			<!-- <div class="tips-icon">
				<div @click="showTip = !showTip">
					<el-icon><QuestionFilled /></el-icon>亮灯规则
				</div>
				<TrafficLightRules
					@click.stop
					@handelX="handelX"
					v-show="showTip"
					id="tip"
					:lightRulesData="trafficLightRules"
				/>
			</div> -->
		</template>
		<div class="top">
			<TimeLine
				:timelineItems="timelineItems"
				:currentMonth="currentMonth"
				@handleItemClick="handleItemClick"
			/>
		</div>
		<div class="bottom fx-r">
			<div class="new-rect fx-1" :class="dealColor(dataList.lightStatus)">
				<!-- <div class="icon-box">
					<span class="icon"></span>
					<span class="text">{{ dealText(dataList.hd_ZB_DE020) }}灯</span>
				</div>
				<div class="title">亮灯详情</div> -->
				<div class="second-bottom-box">
					<div class="items">
						<p class="name">完成率</p>
						<p class="num-unit" :class="dataList.yearOnYearStatus">
							<el-icon
								class="el-icon-arrow"
								v-if="dataList.yearOnYearStatus === 'UP'"
								><CaretTop
							/></el-icon>
							<el-icon
								class="el-icon-arrow"
								v-if="dataList.yearOnYearStatus === 'DOWN'"
								><CaretBottom
							/></el-icon>
							<span class="number-font">{{ dataList.totalRate ?? '--' }}</span>
							<span class="unit number-font">%</span>
						</p>
					</div>
					<div class="items black">
						<p class="name">目标完成率</p>
						<p class="num-unit">
							<span class="number-font">{{ dataList.targetCompletionRate ?? '--' }}</span>
							<span class="unit number-font">%</span>
						</p>
					</div>
					<div class="items blue">
						<p class="name">亮灯周期</p>
						<p class="value">{{ dataList.yearMonth ?? '--' }}</p>
					</div>
					<div class="items black">
						<p class="name">亮灯时间</p>
						<p class="value">{{ dataList.lightDate ?? '--' }}</p>
					</div>
					<!-- <div class="items black">
						<p class="name">亮灯说明</p>
						<p class="value">{{ dataList.hd_ZB_DE021 ?? '--' }}</p>
					</div> -->
				</div>
			</div>
			<div class="index-analysis fx-1">
				<!-- <div class="text-title">指标分析</div>
				<div class="content">
					{{ dataList.hd_ZB_DE028 ?? '--' }}
				</div> -->
				<div class="cont-box">
					<div class="fx-r items">
						<div class="label">存在问题:</div>
						<div class="value">{{ dataList.existProblem ?? '--' }}</div>
					</div>
					<div class="fx-r items">
						<div class="label">下一步计划:</div>
						<div class="value">{{ dataList.nextStep ?? '--' }}</div>
					</div>
				</div>
			</div>
		</div>
	</SmallTitle>
</template>

<script setup lang="ts">
import {  queryLightingInfo } from '@/api/dailyMonitoring/indicatorDetailsPage';
import { useAttrs, watch, computed } from 'vue';
// import { trafficLightRules } from '@/components/LightRules';
import TimeLine from './TimeLine.vue';
import SmallTitle from './SmallTitle.vue';

const attrs: any = useAttrs();
// 使用 computed 获取响应式的 attrs 属性
const defaultDate = computed(() => attrs.defaultDate);// 时间选择
// const yearRed = ref(0);
// const yearYellow = ref(0);
const dataList = ref<any>({});
const timelineItems = ref<any>([]);
const currentMonth = ref<string>('');
const baseInfoArr = ref<any>([]);
const indicatorCode = ref<string>('');
const indicatorName = ref<string>('');
// const showTip = ref<boolean>(false);
// const compareClass = (item: any) => {
// 	const num = item ?? '--';
// 	if (num === '--') return '';
// 	// eslint-disable-next-line no-nested-ternary
// 	return num > 0 ? 'UP' : num < 0 ? 'DOWN' : '';
// };
// const dealText = (el: any) => {
// 	let color;
// 	switch (el) {
// 		case 1:
// 			color = '红';
// 			break;
// 		case 2:
// 			color = '黄';
// 			break;
// 		case 3:
// 			color = '绿';
// 			break;
// 		default:
// 			color = '灰';
// 	}
// 	return color;
// };
const dealColor = (el: any) => {
	let color;
	switch (el) {
		case '01':
			color = 'red';
			break;
		case '02':
			color = 'yellow';
			break;
		case '03':
			color = 'green';
			break;
		default:
			color = 'grey';
	}
	return color;
};

// 去重和补齐
const fillMissingMonths = (input: any) => {
	const defaults = [
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
		{ month: '12月', color: 'grey' },
	];
	const inputMap = new Map<string, { month: string; color: string }>();
	input.forEach((item: any) => {
		if (!inputMap.has(item.month)) {
			inputMap.set(item.month, { ...item });
		}
	});

	return defaults.map((defaultItem: any) => {
		const existingItem = inputMap.get(defaultItem.month);
		return existingItem || { ...defaultItem };
	});
};
// 获取月份
const getMonth = (str: any) => {
	const result = str.split('-')[1];
	return result;
};
const getQueryLightingInfo = () => {
	timelineItems.value = [];
	// currentMonth.value = '';
	dataList.value = {};
	const params = {
		indicatorCode: attrs?.indicatorData?.indicatorCode || '',
		yearMonth: defaultDate.value || '',
		tabType: attrs.tabType || '',
		targetId: attrs.isGzwDept ? '' : attrs.deptCode
	};
	// eslint-disable-next-line no-console
	queryLightingInfo({ params }).then((res) => {
		if (res.code === 0) {
			const { data } = res as any;
			// currentMonth.value = `${data.currentMonth}月`;
			// yearRed.value = data.currentRedCount ?? '--';
			// yearYellow.value = data.currentYellowCount ?? '--';
			// baseInfoArr.value = data.baseInfoList;
			// dataList.value =
			// 	data.baseInfoList.find((item: any) => `${item.month}月` === currentMonth.value) ||
			// 	{};
			// const baseInfoList = data.baseInfoList.map((item: any) => ({
			// 	month: `${item.month}月`,
			// 	color: dealColor(item.hd_ZB_DE020),
			// }));
			if(!Array.isArray(data)) return
			currentMonth.value = defaultDate.value ? getMonth(defaultDate.value) : '';
			baseInfoArr.value = data || [];		
			indicatorCode.value = data[0]?.indicatorCode || '';
			indicatorName.value = data[0]?.indicatorName || '';
			const baseInfoList = data.map((item: any) => ({
				month: getMonth(item.yearMonth),
				color: dealColor(item.lightStatus),
			}));
			dataList.value = data.find((item: any) => getMonth(item.yearMonth) === currentMonth.value) || {};
			timelineItems.value = fillMissingMonths(baseInfoList) as any;
		}
	});
};

const handleItemClick = (item: any) => {
	// currentMonth.value = item;
	dataList.value = baseInfoArr.value?.find((el: any) => getMonth(el.yearMonth) === item) || {};
};
// function handelX(item: boolean) {
// 	showTip.value = item;
// }

watch(
  [defaultDate, () => attrs.indicatorData, () => attrs.tabType],
  () => getQueryLightingInfo(),
  { immediate: true }
)
</script>

<style lang="less" scoped>
.lighting-monitoring {
	box-sizing: border-box;
	background: #ffffff;
	border-radius: 0.08rem;
	padding-bottom: 0;
	padding-right: 0;
	:deep(.title-part) {
		overflow: visible;
		.tips-icon {
			cursor: pointer;
			font-size: 0.14rem;
			margin-left: 0.1rem;
			color: #4f5c6d;
			display: flex;
			align-items: center;
			position: relative;
			.el-icon {
				margin-right: 0.02rem;
			}
		}
		#tip {
			position: absolute;
			left: 0.8rem;
			top: -0.4rem;
			z-index: 1112;
		}
	}
}
.top {
	margin-top: 0.16rem;
	gap: 0.26rem;
}
.bottom {
	margin-top: 0.16rem;
	gap: 0.16rem;
	.new-rect {
		flex: 1.5;
		position: relative;
		box-sizing: border-box;
		padding: 0.16rem;
		height: 0.92rem;

		border-radius: 0.08rem;

		.icon-box {
			position: absolute;
			top: 0;
			right: -0.04rem;
			width: 0.92rem;
			height: 0.34rem;
			border-radius: 0.08rem 0rem 0.08rem 0rem;
			display: flex;
			align-items: center;
			justify-content: center;
			.icon {
				width: 0.25rem;
				height: 0.24rem;
				background-image: url('@/assets/images/IndicatorDetailsPage/alpha-light.png');
				background-size: 100% 100%;
				margin-right: 0.04rem;
			}
			.text {
				font-weight: 500;
				font-size: 0.16rem;
				color: #ffffff;
				line-height: 0.22rem;
			}
		}
		&.red {
			background: linear-gradient(
				90deg,
				rgba(223, 89, 83, 0.2) 0%,
				rgba(223, 89, 83, 0.06) 100%
			);
			border: 0.01rem solid rgba(223, 89, 83, 0.1);
			.icon-box {
				background: linear-gradient(180deg, #f1928b 0%, #df5953 100%);
			}
		}
		&.yellow {
			background: linear-gradient(
				270deg,
				rgba(255, 177, 13, 0.06) 0%,
				rgba(255, 177, 13, 0.2) 100%
			);
			border: 0.01rem solid rgba(255, 177, 13, 0.1);
			.icon-box {
				background: linear-gradient(180deg, #ffedb4 0%, #f5ca45 100%);
			}
		}
		&.green {
			background: linear-gradient(
				90deg,
				rgba(83, 160, 100, 0.2) 0%,
				rgba(83, 160, 100, 0.06) 100%
			);
			border: 0.01rem solid rgba(83, 160, 100, 0.1);
			.icon-box {
				background: linear-gradient(180deg, #c5e6c9 0%, #53a064 100%);
			}
		}
		&.grey {
			background: linear-gradient(
				90deg,
				rgba(153, 153, 153, 0.2) 0%,
				rgba(153, 153, 153, 0.06) 100%
			);
			border: 0.01rem solid rgba(153, 153, 153, 0.1);
			.icon-box {
				background: linear-gradient(180deg, #f1f1f1 0%, #999999 100%);
			}
		}
		.title {
			font-weight: 600;
			font-size: 0.16rem;
			color: #202741;
			line-height: 0.22rem;
			padding-bottom: 0.16rem;
		}
		.second-bottom-box {
			display: flex;
			justify-content: space-between;
			.name {
				font-weight: 400;
				font-size: 0.16rem;
				color: #4e5969;
				line-height: 0.22rem;
			}
			.num-unit {
				padding-top: 0.05rem;
				.number-font {
					font-weight: 600;
					color: #202741;
					font-size: 0.24rem;
					line-height: 0.33rem;
				}
				.unit {
					padding-left: 0.02rem;
					font-size: 0.16rem;
					line-height: 0.22rem;
				}
				&.up {
					.number-font,
					.el-icon-arrow {
						color: #53a064;
					}
				}
				&.down {
					.number-font,
					.el-icon-arrow {
						color: #df5953;
					}
				}
			}
			.black {
				.number-font,
				.value {
					color: #202741;
				}
				.value {
					font-weight: 400;
					font-size: 0.16rem;
					line-height: 0.22rem;
				}
			}
			.blue {
				.value {
					font-weight: 500;
					font-size: 0.16rem;
					color: #2f6bef;
					line-height: 0.22rem;
				}
			}
			.items {
				.value {
					padding-top: 0.13rem;
				}
			}
		}
	}
	.index-analysis {
		display: flex;
		align-items: center;
		padding: 0.08rem 0.16rem 0.08rem 0.16rem;
		background: linear-gradient(
			90deg,
			rgba(210, 223, 251, 0.4) 0%,
			rgba(210, 223, 251, 0.2) 100%
		);
		border: 0.01rem solid rgba(210, 223, 251, 0.3);
		border-radius: 0.08rem;
		height: 0.92rem;
		box-sizing: border-box;

		// .text-title {
		// 	font-weight: 600;
		// 	font-size: 0.16rem;
		// 	color: #202741;
		// 	writing-mode: vertical-rl;
		// 	text-orientation: upright;
		// 	letter-spacing: 0.02rem;
		// 	margin-right: 0.16rem;
		// }
		// .content {
		// 	color: #4e5969;
		// 	font-size: 0.16rem;
		// 	overflow-y: scroll;
		// 	line-height: 0.24rem;
		// }
		.cont-box {
			width: 100%;
			.items {
				width: 100%;
				margin-bottom: 0.08rem;
				&:last-of-type {
					margin-bottom: 0;
				}
				.label {
					font-family:
						PingFangSC,
						PingFang SC;
					font-weight: 600;
					font-size: 0.14rem;
					color: #202741;
					margin-right: 0.08rem;
				}
				.value {
					font-family:
						PingFangSC,
						PingFang SC;
					font-weight: 400;
					font-size: 0.14rem;
					width: calc(100% - 66px);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
}
</style>
