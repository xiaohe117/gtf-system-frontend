<!--
 * @Descripttion: 目标企业概况
 * @Author: zhaochao
 * @Date: 2025-08-08 17:58:31
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-30 10:54:59
-->
<template>
	<FrameBox class="aim-enterprise-overview" size="small-white">
		
		<TitleBody name="招商对接情况" class="dock-content">
			<template #extra>
				<div class="fill-entry-box" @click="handlerFill">
					<div class="fill-entry-bg">
						<img src="@/assets/images/runByEnterprise/left/edit-icon.png" alt="" />
						填报入口
					</div>
				</div>
			</template>
			<el-tabs v-model="dynamicSelectedTab">
				<el-tab-pane
					v-for="item in dockDynamicTabs"
					:label="item"
					:name="item"
					:key="item"
				/>
			</el-tabs>
			<div class="trends-list">
				<template v-if="dynamicDataList.length">
					<LoopScroll :dataSource="dynamicDataList" :waitTime="500" :speed="0.2">
						<template #default="{ item }">
							<div
								class="list-item text-ellipsis2"
								@mouseover="handleMouseover(item, $event)"
								@mouseout="handleMouseout"
							>
								{{ (item as any).dynContent }}
							</div>
						</template>
					</LoopScroll>
					<Teleport to="body">
						<div
							v-if="showTooltip"
							ref="tooltipRef"
							class="custom-tooltip"
							:style="tooltipStyle"
						>
							<div class="tooltip-content">
								{{ currentNode }}
							</div>
							<div class="tooltip-arrow"></div>
						</div>
					</Teleport>
				</template>
				<default-empty-container :height="'3.1rem'" v-else />
			</div>
		</TitleBody>
		<div class="dock-content">
			<!-- 招商计划 -->
			<InvestPlan />
		</div>
	</FrameBox>
	<InfoRecordDialog ref="infoRecordRef"></InfoRecordDialog>
</template>
<script lang="ts" setup>
import ServiceUrl from '@/utils/url'
import { LoopScroll } from '@joyday/vue-loop-scroll';
import { getInvestDynamicsByLeaderType } from '@/api/runByEnterprise/index';
import InfoRecordDialog from '@/views/RunByEnterprise/components/InvestmentEnterprise/dialog/InfoRecordDialog.vue';
import InvestPlan from './InvestPlan.vue';

const dockDynamicTabs = ref<any>(['省市领导', '各单位', '各区', '全部']);
const dynamicSelectedTab = ref('省市领导');
const dynamicDataList = ref<any[]>([]);
const showTooltip = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });
const currentNode = ref('');
const tooltipRef = ref();

const tooltipStyle = computed(() => ({
	left: `${tooltipPosition.value.x}px`,
	top: `${tooltipPosition.value.y}px`,
	opacity: showTooltip.value ? 1 : 0,
}));
const getDynamicsData = () => {
	const dynamicObj = (val: any) => {
		const obj: any = {
			省市领导: '市领导',
			各区: '区领导',
			各单位: '单位领导',
			全部: '',
		};
		return obj[val];
	};
	const params = {
		// leaderType: dynamicSelectedTab.value === '省市领导' ? '市领导' : dynamicSelectedTab.value,
		leaderType: dynamicObj(dynamicSelectedTab.value),
	};
	getInvestDynamicsByLeaderType({
		params,
	})
		.then((res: any) => {
			if (res.code === 0) {
				dynamicDataList.value = res.data?.investDynamicList || [];
			} else {
				dynamicDataList.value = [];
			}
		})
		.catch(() => {
			dynamicDataList.value = [];
		});
};

const handlerFill = () => {
	// infoRecordRef.value.show();
	window.open(
		`${ServiceUrl.adminUrl}enterprise-form/business-records/BusinessRecordsDetails?type=Add`,
		'_blank'
	);
};

const handleMouseover = (item: any, event: any) => {
	showTooltip.value = true;
	currentNode.value = item.dynContent;
	nextTick(() => {
		const rect = event.target.getBoundingClientRect();
		const tooltipWidth = tooltipRef.value.offsetWidth;
		const tooltipHeight = tooltipRef.value.offsetHeight;

		let x = rect.left + rect.width / 2 - tooltipWidth / 2;
		let y = rect.top - tooltipHeight - 8;

		if (y < 10) y = rect.bottom + 8;
		if (x < 10) x = 10;
		if (x + tooltipWidth > window.innerWidth - 10) {
			x = window.innerWidth - tooltipWidth - 10;
		}
		tooltipPosition.value = { x, y };
	});
};

const handleMouseout = () => {
	showTooltip.value = false;
};

watch(
	() => dynamicSelectedTab.value,
	() => {
		// 获取对接动态数据
		getDynamicsData();
	},
	{
		immediate: true,
	}
);
</script>
<style lang="less" scoped>
.custom-tooltip {
	position: fixed;
	z-index: 9999;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 0.06rem;
	box-shadow: 0 0 0.12rem rgba(0, 0, 0, 0.25);
	padding: 0.12rem 0.16rem;
	max-width: 5rem;
	min-width: 2rem;
	transition:
		opacity 0.2s,
		transform 0.2s;
	transform-origin: bottom center;
	font-size: @g-font-size-base;
	color: rgba(0, 0, 0, 0.85);
}

.tooltip-arrow {
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-width: 0.08rem;
	border-style: solid;
	border-color: rgba(255, 255, 255, 1) transparent transparent transparent;
}

.aim-enterprise-overview {
	flex-shrink: 0;
	height: 9.48rem;
	width: 4.58rem;
	color: rgba(0, 0, 0, 0.6);
	font-size: 0.14rem;
	font-family: MicrosoftYaHei;
	:deep(.outside-content) {
		padding: 0.1rem 0.15rem !important;
		> div,
		.title-container {
			height: auto;
			font-size: 0.14rem;
		}
		.header {
			margin-bottom: 0;
		}
		.title-container:nth-of-type(n + 1) {
			margin-top: 0.1rem;
		}
	}
	:deep(.tabs-control) {
		width: 100%;
		margin-bottom: 0.15rem;
	}
	.task-content {
		margin-top: 0.15rem;
		:deep(.body-content) {
			height: 3.2rem !important;
			overflow-y: auto;
		}
	}

	.dock-content {
		:deep(.dock-content-tabs) {
			width: 1.8rem;
			margin-bottom: 0;
			> div {
				padding: 0 0.14rem;
			}
		}

		.trends-list {
			height: 3.2rem;
			overflow-y: auto;
			margin-top: 0.1rem;
			:deep(.scroll-loop-viewport) {
				&:hover {
					// overflow-y: auto;
				}
			}
			.list-item {
				color: rgba(0, 0, 0, 0.85);
				font-size: @g-font-size-base;
				line-height: 0.22rem;
				padding-left: 0.28rem;
				padding-top: 0.06rem;
				padding-bottom: 0.01rem;
				margin-bottom: 0.05rem;
				position: relative;
				cursor: pointer;
				overflow: hidden;
				&:hover {
					color: #176bf9;
				}

				&::before {
					content: '';
					display: inline-block;
					width: 0.04rem;
					height: 0.04rem;
					background: #176bf9;
					position: absolute;
					left: 0.16rem;
					top: 0.14rem;
				}
			}
		}
		.enterprise-list {
			display: flex;
			flex-direction: column;
			margin-top: 0.12rem;
			.enterprise-item {
				width: 100%;
				display: flex;
				height: 1rem;
				background: url('@/assets/images/runByEnterprise/right/target-bg1.png') no-repeat
					center;
				background-size: 100%;
				padding-left: 0.88rem;
				color: #ffffff;
				font-size: 0.16rem;
				align-items: center;
				.left-dec {
					// padding-top: 0.1rem;
					.name {
						width: 0.8rem;
						font-family:
							PingFangSC,
							PingFang SC;
						font-weight: 500;
						text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
					}
					.count {
						display: flex;
						align-items: center;
						justify-items: flex-start;
						font-weight: 500;
						text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
						font-weight: bold;
						font-family: @number-font;
						font-size: 0.24rem;
						.unit {
							font-family:
								PingFangSC,
								PingFang SC;
							font-weight: 500;
							text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
							font-size: 0.14rem;
							color: #ffffff;
							margin-left: 0.07rem;
						}
					}
				}

				.progress-box {
					width: 1.68rem;
					margin-left: 0.4rem;
					display: flex;
					flex-direction: column;
					// padding-top: 0.16rem;
					.progress-text {
						height: 0.25rem;
						display: flex;
						color: rgba(0, 0, 0, 0.6);
						justify-content: space-between;
						align-items: center;
						.label {
							font-family: MicrosoftYaHei;
							font-size: 0.14rem;
							margin-right: 0.24rem;
						}
						.value {
							font-size: 0.2rem;
							font-weight: bold;
							font-family: @number-font;
							color: rgba(0, 0, 0, 0.6);
						}
						.unit1 {
							font-family: MicrosoftYaHei;
							margin-left: 0.02rem;
							font-family: MicrosoftYaHei;
							font-size: 0.14rem;
							color: rgba(0, 0, 0, 0.6);
							margin-right: 0.28rem;
						}
						.rate {
							font-family: @number-font;
							color: rgba(0, 0, 0, 0.6);
							font-weight: bold;
							font-size: 0.16rem;
							color: rgba(0, 0, 0, 0.6);
						}
					}
					.progress-bar {
						width: 1.68rem;
						height: 0.09rem;
						background: #fff0e0;
						.progress-bar-inner {
							height: 100%;
							background: linear-gradient(270deg, #ffdc68 0%, #fe793b 100%);
						}
					}
				}
			}
			.enterprise-item:nth-child(2) {
				background: url('@/assets/images/runByEnterprise/right/target-bg2.png') no-repeat
					center;
				background-size: 100%;
			}
			.enterprise-item:nth-child(3) {
				background: url('@/assets/images/runByEnterprise/right/target-bg3.png') no-repeat
					center;
				background-size: 100%;
			}
		}

		.goto-special {
			cursor: pointer;
			height: 0.28rem;
			line-height: 0.28rem;
			font-family: MicrosoftYaHei;
			font-size: 0.14rem;
			color: #176bf9;
			text-align: center;
			background: url('@/assets/images/runByEnterprise/right/wall-chart-bg.png') no-repeat
				center;
			background-size: 100%;
			margin-top: 0.18rem;
		}
	}
	.dock-content:nth-of-type(2) {
		:deep(.header) {
			align-items: flex-end;
		}
		.el-tabs {
			margin-top: 0.14rem;
		}
	}
	.fill-entry-box {
		width: 1.56rem;
		height: 0.34rem;
		background: linear-gradient(142deg, rgba(212, 219, 255, 0) 0%, #d7e8fe 100%);
		box-shadow: 0 0 0.08rem 0 rgba(188, 200, 255, 0.5);
		border-radius: 0.08rem 0 0.56rem 0.08rem;
		cursor: pointer;
		.fill-entry-bg {
			width: 1.38rem;
			height: 0.34rem;
			background: linear-gradient(to top, #1b4df4 0%, #5dc9fc 100%);
			border-radius: 0.08rem 0 0.56rem 0.08rem;
			color: #fff;
			font-size: @g-font-size-base;
			display: flex;
			align-items: center;
			img {
				width: 0.24rem;
				height: 0.24rem;
				margin-right: 0.1rem;
				margin-left: 0.1rem;
			}
		}
	}
}
</style>
<style lang="less">
.investment-popover {
	width: 5.5rem !important;
	.el-popover__title {
		margin-bottom: 0;
		font-size: 0.14rem;
		font-family: 'MicrosoftYaHei';
		line-height: 0.22rem;
	}
}
</style>
