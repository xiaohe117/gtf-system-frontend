<!--
 * @Descripttion: 整体概况右侧
 * @Author: lj
 * @Date: 2025-08-12 9:58:31
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-12-16 10:24:58
-->
<template>
	<FrameBox class="aim-enterprise-overview" size="small-white">
		<TitleBody name="招商分工" class="target-enterprise">
			<template #extra>
				<RoundRectTabs v-model="selectedWorkTab" :tabsList="workListTabs" />
			</template>
			<div style="height: 2.5rem; position: relative">
				<ChartContainer
					:chartOption="pieChartOptionData"
					:isEmpty="dockSituation.length === 0"
				/>
				<div class="tips"><span>*</span> 截至2025年11月累计值</div>
			</div>
		</TitleBody>
		<TitleBody name="跟进情况统计">
			<template #extra>
				<RoundRectTabs v-model="selectedFollowTab" :tabsList="followTabs" />
			</template>
			<div class="enterprise-follow">
				<RoundRectTabs
					v-model="selectedTab"
					v-if="selectedFollowTab === 1"
					:tabsList="tabsList"
				/>
				<el-tabs v-model="activeOrder" @tab-click="handleTabClick">
					<el-tab-pane
						v-for="item in orderListTab"
						:label="item.label"
						:name="item.value"
						:key="item.value"
					/>
				</el-tabs>
				<!-- 自定义列表数据 -->
				<div
					:class="['custom-list-box', { 'letter-tabs': selectedFollowTab === 0 }]"
					ref="customListRef"
				>
					<div class="tips" v-if="rightTableList.length">
						<span>*</span> 截至2025年11月累计值
					</div>
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
					<div class="custom-list" v-if="rightTableList.length">
						<div
							v-for="(item, index) in rightTableList"
							:key="index"
							class="custom-list-item"
						>
							<div class="fx-r fx-al-c">
								<div class="index">{{ index + 1 }}</div>
								<div class="label text-ellipsis2" :title="item.name">
									{{ item.name }}
								</div>
								<div class="value fx-r fx-1">
									<div
										class="value-item"
										v-for="(legend, legendIndex) in customLegend"
										:key="legendIndex"
										:style="{
											background: legend.color,
											width: (item[legend.prop] / maxTableValue) * 100 + '%',
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
							minWidth: '1.6rem',
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
		</TitleBody>
	</FrameBox>
</template>
<script lang="ts" setup>
import { getSize } from '@/utils';
import { getDivisionPie, getFollowBar } from '@/api/runByEnterprise/index';
import { pieChartOption3 } from './chartOption';

const rightTableList = ref<any[]>([]);
const maxTableValue = ref<number>(0);
const toolTipPosition = ref({ x: 0, y: 0 });
const isShowTooltip = ref<boolean>(false);
const customListRef = ref<any>(null);

const selectedWorkTab = ref<any>(0);
const workListTabs = ref<any>(['办内分工', '办外分工']);
const dockSituation = ref<any[]>([]);

watch(
	() => selectedWorkTab.value,
	(newV) => {
		getDivisionPie({
			data: {
				type: newV === 0 ? '1' : '3',
			},
		}).then((res: any) => {
			dockSituation.value = res.data.map((item: any) => ({ ...item, value: item.num }));
		});
	},
	{ immediate: true }
);
const pieChartOptionData = computed(() => pieChartOption3(dockSituation.value));

const selectedFollowTab = ref<any>(0);
const selectedTab = ref<any>(0);
const activeOrder = ref('1');
const followTabs = ref<any>(['办内跟进', '办外跟进']);
const tabsList = computed(() => {
	if (selectedFollowTab.value === 0) {
		return ['未来产业分局', '新兴产业分局', '重点产业分局'];
	}
	return ['各区', '市直单位', '国企平台'];
});

const customLegend = computed(() => [
	{
		label: '跟进有接洽企业',
		prop: 'num',
		color: '#408FFF',
	},
	{
		label: '跟进企业',
		prop: 'targets',
		color: '#F5CA45',
	},
]);
const orderListTab = ref<any>([
	{
		label: '按跟进企业数量排',
		value: '1',
	},
	{
		label: '按有工作记录排',
		value: '2',
	},
	{
		label: '按默认顺序',
		value: '',
	},
]);
const currentNode = ref<any>({});
const getRightTabData = () => {
	const params: any = {
		type: selectedFollowTab.value === 0 ? '1' : '3',
		sort: activeOrder.value,
	};
	// 办外跟进多3个tab
	if (selectedFollowTab.value === 1) {
		params.outSizeType = `${selectedTab.value + 1}`;
	}
	getFollowBar({
		data: params,
	}).then((res: any) => {
		rightTableList.value = res.data;
		let maxValue: any = 0;
		customLegend.value.forEach((item: any) => {
			maxValue += Math.max(...rightTableList.value.map((list: any) => list[item.prop]));
		});
		maxTableValue.value = maxValue;
	});
};
const handleTabClick = () => {
	nextTick(() => {
		getRightTabData();
	});
};
watch(
	() => [selectedTab.value, selectedFollowTab.value],
	() => {
		activeOrder.value = '1';
		getRightTabData();
	},
	{
		immediate: true,
	}
);

watch(
	() => activeOrder.value,
	() => {
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
</script>
<style lang="less" scoped>
.aim-enterprise-overview {
	flex-shrink: 0;
	height: 9.48rem;
	width: 4.58rem;
	color: rgba(0, 0, 0, 0.6);
	font-size: 0.14rem;
	font-family: MicrosoftYaHei;
	:deep(.outside-content) {
		padding-top: 0.24rem;
		padding-right: 0.14rem;
		> div,
		.title-container {
			height: auto;
		}
		.header {
			margin-bottom: 0;
		}
	}
	.target-enterprise {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 0.34rem;
	}
	:deep(.tabs-control) {
		> div {
			padding: 0 0.2rem;
		}
	}
	.enterprise-follow {
		margin-top: 0.15rem;
		.tabs-control {
			width: 4.22rem;
			:deep(.tabs-control_item) {
				font-size: 0.14rem;
				height: 0.3rem;
				display: flex;
				align-items: center;
			}
		}
		.el-tabs {
			margin-top: 0.2rem;
		}
		.letter-tabs {
			height: 4.7rem !important;
		}
		.custom-list-box {
			position: relative;
			height: 4.2rem;
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
				height: calc(100% - 0.6rem);
				position: relative;
				.tips {
					bottom: 0.3rem;
				}
				.custom-list-item {
					margin-bottom: 0.12rem;
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
						width: 0.5rem;
						text-align: left;
						color: #000;
						margin-right: 0.12rem;
						line-height: 0.16rem;
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
	.tips {
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.85);
		position: absolute;
		right: 0.05rem;
		bottom: 0.1rem;
		z-index: 2;
		span {
			color: #f4333c;
		}
	}
}
</style>
