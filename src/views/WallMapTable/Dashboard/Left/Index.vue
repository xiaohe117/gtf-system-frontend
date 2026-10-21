<!--
 * @Descripttion: 已对接央企总部
 * @Author: huzhirong
 * @Date: 2025-12-23 14:35:15
 * @LastEditors: zhaochao
 * @LastEditTime: 2026-01-05 17:41:41
-->
<template>
	<div class="left-item">
		<div class="connected-central-enterprises">
			<TitleBody name="已对接央企总部"></TitleBody>
			<div class="enterprises-content">
				<div class="docking">
					<div class="img"></div>
					<div class="count-item">
						<div class="txt">累计对接</div>
						<div class="count">{{ count }} <span class="unit">家</span></div>
					</div>
				</div>
				<div class="progress">
					<div class="img"></div>
					<div class="count-item">
						<div class="txt">
							完成进度
							<el-popover
								trigger="click"
								title="百分比表示"
								popper-class="ipad-popover"
								:width="getSize(360)"
								@show="iconActive = true"
								@hide="iconActive = false"
							>
								<template #reference>
									<img
										class="question-icon"
										:src="
											getUrl(
												`Ipad/question-icon${iconActive ? '-active' : ''}.png`
											)
										"
										alt=""
									/>
								</template>
								<template #default>
									<div class="content">
										已对接到总部央企数量<span class="symbol">/</span>
										所有重点央企
									</div>
								</template>
							</el-popover>
						</div>
						<div class="count">{{ percent }}%</div>
					</div>
				</div>
			</div>
		</div>
		<div class="achievements-docking">
			<TitleBody name="对接成效">
				<div class="docking-content">
					<ChartContainer
						:chartOption="rightBarOptions"
						:isEmpty="rightBarData.length === 0"
					/>
				</div>
			</TitleBody>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { getSize, getUrl } from '@/utils';
// import dayjs from 'dayjs';
import { getHeadquartersConnectionSummary } from '@/api/ipad/index';
import barOption from './chartOption';

/* interface DateRange {
	start: Date;
	end: Date;
}

const props = defineProps({
	dateRange: {
		type: Object as () => DateRange | null,
		default: null,
	},
}); */

const iconActive = ref(false);

const rightBarData = ref<any[]>([]);

const rightBarOptions = computed(() => barOption(rightBarData.value));

const count: any = ref('0');
const percent: any = ref('0');

// 右侧柱状图数据获取
const getRightBarData = () => {
/* 	let startDate = '';

	if (props.dateRange) {
		startDate = dayjs(props.dateRange.start).format('YYYY-MM-DD');
	}

	const params: any = {
		startTime: startDate,
	}; */
	// getHeadquartersConnectionSummary(params).then((res: any) => {
	getHeadquartersConnectionSummary().then((res: any) => {
		if (res.code === 0) {
			count.value = res?.data?.totalConnected || 0;
			// eslint-disable-next-line no-unsafe-optional-chaining
			percent.value = Math.round(res?.data?.completionRate * 100) || 0;
			if (res?.data?.effectItems && res?.data?.effectItems.length > 0) {
				rightBarData.value = res?.data?.effectItems.map((item: any) => ({
					name: item.category || '',
					targets: item.relatedSOECount || 0,
					num: item.totalClueCount || 0,
				}));
			} else {
				rightBarData.value = [];
			}
		} else {
			// eslint-disable-next-line no-console
			console.log('获取数据失败');
		}
	});
};

onMounted(() => {
	getRightBarData();
});

/* // 监听日期范围变化
watch(
	() => props.dateRange,
	(newDateRange) => {
		if (newDateRange) {
			getRightBarData();
		}
	},
	{ immediate: true }
); */
</script>
<style lang="less" scoped>
.left-item {
	height: 100%;
	width: 100%;
}
.connected-central-enterprises {
	margin-bottom: 0.3rem;
}
.achievements-docking {
	height: calc(100% - 1.8rem);
}
.enterprises-content {
	background-image: url(@/assets/images/Ipad/central-enterprises-bg.png);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width: 100%;
	height: 1.12rem;
	display: flex;
	justify-content: space-between;
	padding: 0 0.3rem 0 0.24rem;
	align-items: center;
}
.docking,
.progress {
	display: flex;
	.img {
		background-image: url(@/assets/images/Ipad/docking-bg.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 0.68rem;
		height: 0.64rem;
	}
	.count-item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.txt {
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 500;
			font-size: 0.2rem;
			color: rgba(0, 0, 0, 0.85);
			position: relative;

			.question-icon {
				width: 0.32rem;
				height: 0.32rem;
				position: absolute;
				right: -0.4rem;
				z-index: 99;
			}
		}
		.count {
			font-family: 'DIN-Condensed-Bold';
			font-weight: bold;
			font-size: 0.24rem;
			color: rgba(0, 0, 0, 0.65);
			.unit {
				font-family:
					PingFangSC,
					PingFang SC;
				font-weight: 500;
				font-size: 0.18rem;
				color: rgba(0, 0, 0, 0.6);
				margin-left: 0.25rem;
			}
		}
	}
}
.progress {
	padding-right: 0.4rem;
	.img {
		background-image: url(@/assets/images/Ipad/progress-bg.png);
	}
}
.docking-content {
	width: 100%;
	height: 100%;
}
// .achievements-docking {
// 	:deep(.title-container) {
// 		height: 0.8rem;
// 	}
// }
</style>
