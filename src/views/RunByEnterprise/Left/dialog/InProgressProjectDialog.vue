<!--
 * @Descripttion: 在跟招商项目
 * @Author: zhaochao
 * @Date: 2025-08-12 09:23:35
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-09 10:07:59
-->
<template>
	<el-dialog v-model="dialogVisible" width="9.85rem" class="enterprise-follow-dialog">
		<TitleBody name="目标企业在跟招商项目">
			<!-- 顶部统计数据 -->
			<div class="top-statistics fx-r fx-sp-b">
				<div class="top-left">
					<div class="fx-r fx-al-c">
						<div class="label">已有在跟或落地招商项目</div>
						<NumberValue :label="'新增'" :value="topItem.addCount" />
					</div>
					<div class="value fx-r fx-al-c">
						<div class="value-text">
							<span>{{ formatNumber(topItem.value) }}</span
							>个
						</div>
						<div class="proportion">({{ topItem.relationCount || 0 }} 家相关企业)</div>
					</div>
				</div>
				<div class="top-right fx-r">
					<div v-for="(item, index) in topList" :key="index" class="top-right-item fx-r">
						<img :src="getUrl(`runByEnterprise/left/${item.icon}.png`)" alt="" />
						<div class="top-right-content fx-1">
							<div class="label">{{ item.label }}</div>
							<div class="value fx-r">
								<div class="fx-r fx-al-end">
									<span class="value-text">{{ formatNumber(item.value) }}</span>
									<div class="unit">{{ item.unit }}</div>
								</div>
								<div class="fx-c">
									<div>
										{{ item.subLabel1 }}
										<span class="subUnit"
											>{{ item.subValue1 }}{{ item.subUnit }}</span
										>
									</div>
									<div v-if="item.subLabel2">
										{{ item.subLabel2 }}
										<span class="subUnit"
											>{{ item.subValue2 }}{{ item.subUnit }}</span
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="follow-overview fx-r">
				<div class="fx-1 fx-c">
					<SmallTitle title="入库到转化时间" />
					<div class="fx-1">
						<ChartContainer
							:chartOption="pieChartOptionData"
							:isEmpty="!conversionTime.length"
						/>
					</div>
				</div>
				<div class="right-list fx-c">
					<SmallTitle title="有落地项目企业新增趋势">
						<RoundRectTabs v-model="selectedTab" :tabsList="tabsList" />
					</SmallTitle>
					<div class="fx-1">
						<ChartContainer
							:chartOption="lineChartOptionData"
							:isEmpty="!rightTableList.length"
						/>
					</div>
				</div>
			</div>
		</TitleBody>
	</el-dialog>
</template>
<script setup lang="ts">
import { formatNumber, getUrl } from '@/utils/index';
import { pieChartOption, lineChartOption } from '../components/chartOptions';
import NumberValue from '../components/NumberValue.vue';

const dialogVisible = ref(false);
const tabsList = ref<any>(['月度', '年度']);
const selectedTab = ref(0);
const rightTableList = ref<any[]>([]);
const topItem: any = computed(() => ({
	value: 0,
	addCount: 0,
	relationCount: '0',
}));
const conversionTime = ref<any[]>([]); // 入库到转化时间
const topList = computed(() => [
	{
		label: '平均入库到转化时间',
		value: 0,
		icon: 'add-icon',
		unit: '个月',
		subLabel1: '最短',
		subValue1: 0,
		subLabel2: '最长',
		subValue2: 0,
		subUnit: '个月',
	},
	{
		label: '存在进度更新（本月）',
		value: 0,
		icon: 'start-icon',
		unit: '个',
		subLabel1: '进展更新',
		subValue1: 0,
	},
]);
const pieChartOptionData = computed(() => {
	const data = [
		{
			name: '0-3 个月',
			value: 0,
			unit: '家',
		},
		{
			name: '3-6 个月',
			value: 0,
			unit: '家',
		},
		{
			name: '6+个月',
			value: 0,
			unit: '家',
		},
	];
	return pieChartOption(data);
});
const lineChartOptionData = computed(() => lineChartOption(rightTableList.value));

// 获取右侧echarts数据
const getRightTabData = () => {
	if (selectedTab.value === 0) {
		rightTableList.value = [
			// {
			// 	name: '1月',
			// 	value: 10,
			// },
			// {
			// 	name: '2月',
			// 	value: 3,
			// },
			// {
			// 	name: '3月',
			// 	value: 7,
			// },
		];
	} else {
		rightTableList.value = [
			// {
			// 	name: '2021',
			// 	value: 100,
			// },
			// {
			// 	name: '2022',
			// 	value: 321,
			// },
			// {
			// 	name: '2023',
			// 	value: 211,
			// },
			// {
			// 	name: '2024',
			// 	value: 231,
			// },
			// {
			// 	name: '2025',
			// 	value: 431,
			// },
		];
	}
};

watch(
	() => selectedTab.value,
	() => {
		getRightTabData();
	}
);

const show = () => {
	dialogVisible.value = true;
	selectedTab.value = 0;
	getRightTabData();
};

defineExpose({ show });
</script>
<style scoped lang="less">
.enterprise-follow-dialog {
	.top-statistics {
		height: 0.88rem;
		font-size: 0.14rem;
		margin-bottom: 0.16rem;
		.top-left {
			font-size: 0.14rem;
			height: 100%;
			width: 3.87rem;
			background: url('@/assets/images/runByEnterprise/left/arrow-bg.png') no-repeat;
			background-size: 100% 100%;
			color: #fff;
			padding-left: 0.95rem;
			.label {
				font-weight: 500;
				font-size: 0.16rem;
				text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
				margin: 0.2rem 0.2rem 0.1rem 0;
			}
			.number-value {
				margin-top: 0.1rem;
			}
			.value {
				.value-text {
					width: 1.1rem;
					text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
					span {
						font-size: 0.24rem;
						font-family: @number-font;
						margin-right: 0.16rem;
					}
				}
				.proportion {
					color: rgba(0, 0, 0, 0.6);
				}
			}
		}
		.top-right {
			width: 5.43rem;
			height: 0.88rem;
			position: relative;
			&::after {
				content: '';
				width: 100%;
				height: 0.2rem;
				background: url('@/assets/images/runByEnterprise/left/box-decoration.png') no-repeat;
				background-size: 100% 100%;
				position: absolute;
				bottom: 0;
				left: 0;
			}
			.top-right-item {
				flex: 1;
				position: relative;
				z-index: 2;
				padding-left: 0.3rem;
				align-items: flex-end;
				margin-bottom: 0.12rem;
				&:nth-of-type(1) {
					.top-right-content {
						.value {
							position: relative;
							.fx-c {
								position: absolute;
								left: 52%;
								top: -0.04rem;
								div:nth-of-type(1) {
									margin-bottom: 0.04rem;
								}
							}
						}
					}
				}
				img {
					width: 0.56rem;
					height: 0.56rem;
					margin-bottom: 0.04rem;
				}
				.top-right-content {
					margin-left: 0.08rem;
					.label {
						color: #4b4b4b;
						line-height: 0.18rem;
					}
					.value {
						width: 100%;
						margin-top: 0.12rem;
						color: #666;
						.value-text {
							color: #383838;
							font-size: 0.22rem;
							font-family: @number-font;
							margin-right: 0.06rem;
						}
						.unit {
							margin-bottom: 0.04rem;
							margin-right: 0.24rem;
						}
						.subUnit {
							margin-left: 0.06rem;
						}
					}
				}
			}
		}
	}
	.follow-overview {
		height: 4.5rem;
		.right-list {
			width: 58%;
			padding-left: 0.18rem;
			.tabs-control {
				width: 2.1rem;
				:deep(.tabs-control_item) {
					font-size: 0.14rem;
					height: 0.3rem;
					display: flex;
					align-items: center;
				}
			}
		}
	}
}
</style>
