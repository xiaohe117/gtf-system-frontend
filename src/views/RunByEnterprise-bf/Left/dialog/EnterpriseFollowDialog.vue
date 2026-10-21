<!--
 * @Descripttion: 跟进企业情况
 * @Author: zhaochao
 * @Date: 2025-08-12 09:23:35
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-09 09:47:52
-->
<template>
	<el-dialog v-model="dialogVisible" width="9.85rem" class="enterprise-follow-dialog">
		<TitleBody :name="dialogType === 1 ? '已跟进企业情况' : '已对接企业情况'">
			<!-- <template v-if="dialogType === 2" #extra>
				<div>*未有分派跟进的目标企业、或既无未有招商策划项目的企业为待跟进企业</div>
			</template> -->
			<!-- 顶部统计数据 -->
			<div class="top-statistics fx-r fx-sp-b">
				<div class="top-left">
					<div class="label">
						{{ topItem.label }}
					</div>
					<div class="value fx-r fx-al-c">
						<div class="value-text">
							<span>{{ formatNumber(topItem.value) }}</span
							>{{ topItem.unit }}
						</div>
						<div class="proportion">
							{{ topItem.subLabel }} {{ topItem.proportion || 0 }}%
						</div>
					</div>
				</div>
				<div class="top-right fx-r">
					<div v-for="(item, index) in topList" :key="index" class="top-right-item fx-r">
						<img :src="getUrl(`runByEnterprise/left/${item.icon}.png`)" alt="" />
						<div class="top-right-content">
							<div class="label">{{ item.label }}</div>
							<div class="value fx-r fx-sp-b">
								<div class="value-item">
									<span class="value-text">{{ formatNumber(item.value) }}</span
									>{{ item.unit }}
								</div>
								<div class="fx-r fx-al-c" v-if="item.showProportion">
									{{ item.proportion || 0 }}%
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 各单位跟进企业概况 -->
			<SmallTitle
				:title="`${dialogType === 1 ? '各单位跟进企业概况' : '各单位已对接企业概况'}`"
			/>
			<div class="follow-overview fx-r">
				<ChartContainer class="fx-1" :chartOption="pieChartOptionData" :isEmpty="dockSituation.length === 0"/>
				<div class="tabs-box">
					<RoundRectTabs v-model="selectedTab" :tabsList="tabsList" />
					<el-tabs v-model="activeOrder" @tab-click="handleTabClick">
						<template v-for="item in orderListTab" :key="item.value">
							<el-tab-pane
								v-if="item.visible"
								:label="item.label"
								:name="item.value"
							/>
						</template>
					</el-tabs>
					<!-- 自定义列表数据 -->
					<div class="custom-list-box" ref="customListRef">
						<div class="custom-legend">
							<template v-if="customLegend.length > 1">
								<span
									v-for="(item, index) in customLegend"
									:key="index"
									class="custom-legend-item"
								>
									<i :style="{ background: item.color }"></i>
									{{ item.label }}
								</span>
							</template>
						</div>
						<div class="custom-list" v-if="rightTableList.length > 0">
							<div
								v-for="(item, index) in rightTableList"
								:key="index"
								class="custom-list-item"
							>
								<div class="fx-r fx-al-c">
									<div class="index">{{ index + 1 }}</div>
									<div class="label overflow-ellipsis" :title="item.name">
										{{ item.name }}
									</div>
									<div class="value fx-r fx-1">
										<div
											class="value-item"
											v-for="(legend, legendIndex) in customLegend"
											:key="legendIndex"
											:style="{
												background: legend.color,
												width:
													(item[legend.prop] / maxTableValue) * 100 + '%',
											}"
											@mouseover="handleMouseover(item, $event)"
											@mouseout="handleMouseout"
										/>
									</div>
								</div>
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
								minWidth: dialogType === 1 ? '1.6rem' : '1.3rem',
							}"
						>
							<div class="label">{{ currentNode.name }}</div>
							<div class="value">
								<div
									v-for="(legend, legendIndex) in customLegend"
									:key="legendIndex"
									class="item"
								>
									<i :style="{ borderColor: legend.color }"></i>
									{{ legend.label }} {{ currentNode[legend.prop] }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</TitleBody>
	</el-dialog>
</template>
<script setup lang="ts">
import { formatNumber, getUrl, getSize } from '@/utils/index';
import { pieChartOption } from '../components/chartOptions';

const dialogVisible = ref(false);
const dialogType = ref<number>();
const tabsList = ref<any>(['各区', '各单位', '国企']);
const selectedTab = ref(0);
const activeOrder = ref('orderByEnterprise');
const rightTableList = ref<any[]>([]);
const maxTableValue = ref<number>(0);
const currentNode = ref<any>({});
const customListRef = ref<any>(null);
const isShowTooltip = ref(false);
const toolTipPosition = ref({ x: 0, y: 0 });
const dockSituation = ref<any[]>([]); // 对接情况

const orderListTab = computed(() => [
	{
		label: '按跟进企业数量排',
		value: 'orderByEnterprise',
		visible: true,
	},
	{
		label: '按有工作记录排',
		value: 'orderByRecords',
		visible: dialogType.value === 1,
	},
	{
		label: '按默认顺序',
		value: 'defaultOrder',
		visible: true,
	},
]);

const topItem = computed(() => ({
	label: dialogType.value === 1 ? '当前已分派跟进企业数量' : '当前已对接企业',
	value: 0,
	unit: dialogType.value === 1 ? '个' : '家',
	subLabel: dialogType.value === 1 ? '占比' : '总体占比',
	proportion: '0',
}));
const topList = computed(() => [
	{
		label: dialogType.value === 1 ? '主动认领或新增' : '未对接',
		value: 0,
		icon: 'add-icon',
		unit: dialogType.value === 1 ? '个' : '家',
		showProportion: dialogType.value === 1,
		proportion: '0',
	},
	{
		label: dialogType.value === 1 ? '指定分派' : '无招商策划项目及工作记录',
		value: 0,
		icon: 'start-icon',
		unit: dialogType.value === 1 ? '个' : '家',
		showProportion: dialogType.value === 1,
		proportion: '0',
	},
]);
const pieChartOptionData = computed(() => {
	const data = [
		{
			name: '各区',
			value: 0,
			unit: '家',
			subValue: 0,
			subUnit: '个区',
		},
		{
			name: '各单位',
			value: 0,
			unit: '家',
			subValue: 0,
			subUnit: '个单位',
		},
		{
			name: '国企平台',
			value: 0,
			unit: '家',
			subValue: 0,
			subUnit: '家国企',
		},
	];
	return pieChartOption(data);
});
const customLegend = computed(() => {
	if (dialogType.value === 1) {
		return [
			{
				label: '跟进有接洽企业',
				prop: 'concatCompanyCount',
				color: '#408FFF',
			},
			{
				label: '跟进企业',
				prop: 'followCompanyCount',
				color: '#F5CA45',
			},
		];
	}
	return [
		{
			label: '待跟进企业',
			prop: 'waitFollowCompanyCount',
			color: '#408FFF',
		},
	];
});

// 获取右侧echarts数据
const getRightTabData = () => {
	if (dialogType.value === 2) {
		rightTableList.value = [];
		return;
	}
	let data: any = [];
	if (selectedTab.value === 0) {
		data = [
			{
				concatCompanyCount: 12, // 跟进有接洽企业数
				followCompanyCount: 20, // 跟进企业数
				waitFollowCompanyCount: 30,
				name: '天河区',
			},
			{
				concatCompanyCount: 11, // 跟进有接洽企业数
				followCompanyCount: 4, // 跟进企业数
				waitFollowCompanyCount: 27,
				name: '海珠区',
			},
			{
				concatCompanyCount: 12, // 跟进有接洽企业数
				followCompanyCount: 0, // 跟进企业数
				waitFollowCompanyCount: 26,
				name: '白云区',
			},
			{
				concatCompanyCount: 12, // 跟进有接洽企业数
				followCompanyCount: 29, // 跟进企业数
				waitFollowCompanyCount: 15,
				name: '番禺区',
			},
			{
				concatCompanyCount: 8, // 跟进有接洽企业数
				followCompanyCount: 25, // 跟进企业数
				waitFollowCompanyCount: 13,
				name: '黄埔区',
			},
			{
				concatCompanyCount: 4, // 跟进有接洽企业数
				followCompanyCount: 3, // 跟进企业数
				waitFollowCompanyCount: 12,
				name: '南沙区',
			},
			{
				concatCompanyCount: 5, // 跟进有接洽企业数
				followCompanyCount: 18, // 跟进企业数
				waitFollowCompanyCount: 8,
				name: '越秀区',
			},
			{
				concatCompanyCount: 8, // 跟进有接洽企业数
				followCompanyCount: 14, // 跟进企业数
				waitFollowCompanyCount: 5,
				name: '从化区',
			},
			{
				concatCompanyCount: 5, // 跟进有接洽企业数
				followCompanyCount: 12, // 跟进企业数
				waitFollowCompanyCount: 4,
				name: '增城区',
			},
			{
				concatCompanyCount: 8, // 跟进有接洽企业数
				followCompanyCount: 4, // 跟进企业数
				waitFollowCompanyCount: 3,
				name: '海珠区',
			},
			{
				concatCompanyCount: 1, // 跟进有接洽企业数
				followCompanyCount: 4, // 跟进企业数
				waitFollowCompanyCount: 2,
				name: '花都区',
			},
		];
	} else if (selectedTab.value === 1) {
		data = [
			{
				concatCompanyCount: 32, // 跟进有接洽企业数
				followCompanyCount: 42, // 跟进企业数
				waitFollowCompanyCount: 53,
				name: '天河区政府',
			},
			{
				concatCompanyCount: 22, // 跟进有接洽企业数
				followCompanyCount: 12, // 跟进企业数
				waitFollowCompanyCount: 32,
				name: '越秀区政府',
			},
			{
				concatCompanyCount: 25, // 跟进有接洽企业数
				followCompanyCount: 22, // 跟进企业数
				waitFollowCompanyCount: 12,
				name: '海珠区政府',
			},
		];
	} else if (selectedTab.value === 2) {
		data = [];
	}
	if (activeOrder.value === 'orderByEnterprise') {
		data = data.sort((a: any, b: any) => b.followCompanyCount - a.followCompanyCount);
	} else if (activeOrder.value === 'orderByRecords') {
		data = data.sort(
			(a: any, b: any) =>
				b.followCompanyCount +
				b.concatCompanyCount -
				(a.followCompanyCount + a.concatCompanyCount)
		);
	} else {
		data = data.sort((a: any, b: any) => b.concatCompanyCount - a.concatCompanyCount);
	}
	rightTableList.value = data;

	let maxValue: any = 0;
	customLegend.value.forEach((item: any) => {
		maxValue += Math.max(...rightTableList.value.map((list: any) => list[item.prop]));
	});
	maxTableValue.value = maxValue;
};

const handleTabClick = () => {
	nextTick(() => {
		getRightTabData();
	});
};

watch(
	() => selectedTab.value,
	() => {
		activeOrder.value = 'orderByEnterprise';
		getRightTabData();
	}
);

const handleMouseover = (item: any, $event: any) => {
	currentNode.value = item;
	const basePosition = customListRef.value.getBoundingClientRect();
	isShowTooltip.value = true;
	toolTipPosition.value.x = $event.clientX - basePosition.x + getSize(20);
	toolTipPosition.value.y = $event.clientY - basePosition.y - getSize(10);
};
const handleMouseout = () => {
	isShowTooltip.value = false;
};

const show = (type: string) => {
	dialogVisible.value = true;
	dialogType.value = type === 'EnterpriseFollowDialog1' ? 1 : 2;
	activeOrder.value = 'orderByEnterprise';
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
				margin-top: 0.2rem;
				margin-bottom: 0.1rem;
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
						margin-top: 0.12rem;
						color: #666;
						.value-item {
							margin-right: 0.28rem;
							.value-text {
								color: #383838;
								font-size: 0.22rem;
								font-family: @number-font;
								margin-right: 0.06rem;
							}
						}
					}
				}
			}
		}
	}
	.follow-overview {
		height: 4.5rem;
		.tabs-box {
			width: 52%;
			.tabs-control {
				width: 3.2rem;
				:deep(.tabs-control_item) {
					font-size: 0.14rem;
					height: 0.3rem;
					display: flex;
					align-items: center;
				}
			}
			.el-tabs {
				margin-top: 0.2rem;
				--el-tabs-header-height: 0.4rem;
				:deep(.el-tabs__header) {
					margin: 0 0 0.06rem 0;
				}
				:deep(.el-tabs__active-bar) {
					background-color: #2e79f8;
				}
				:deep(.el-tabs__nav-wrap) {
					&::after {
						display: none;
					}
				}
				:deep(.el-tabs__item) {
					font-size: 0.14rem;
					padding: 0 0.2rem;
					--el-text-color-primary: rgba(0, 0, 0, 0.5);
					&:hover {
						color: #2e79f8;
					}
					&.is-active {
						color: #2e79f8;
					}
				}
			}
		}
		.custom-list-box {
			position: relative;

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
				padding: 0 0.2rem;
				overflow-y: auto;
				height: 3.3rem;
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
						color: #000;
						margin-right: 0.12rem;
					}

					.value {
						.value-item {
							height: 0.08rem;
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
					font-size: 0.14rem;
					margin-bottom: 0.1rem;
					font-weight: 600;
				}
				.value {
					font-size: 0.14rem;
					.item {
						margin-bottom: 0.06rem;
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
		}
	}
}
</style>
