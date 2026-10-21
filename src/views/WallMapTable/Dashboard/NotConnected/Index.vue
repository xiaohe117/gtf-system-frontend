<!--
 * @Descripttion: 未对接央企总部
 * @Author: zhaochao
 * @Date: 2025-12-24 09:35:45
 * @LastEditors: zhaochao
 * @LastEditTime: 2026-01-08 17:47:16
-->
<template>
	<div class="not-connected-box">
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
					v-show="activeOrder === 'unitList'"
					class="question-icon"
					:src="getUrl(`Ipad/question-icon${iconActive ? '-active' : ''}.png`)"
					alt=""
				/>
			</template>
			<template #default>
				<div class="content">
					未对接到总部央企数量 <span class="symbol">/</span> 单位牵头央企
				</div>
			</template>
		</el-popover>
		<el-tabs v-model="activeOrder">
			<el-tab-pane
				v-for="item in orderListTab"
				:label="item.label"
				:name="item.value"
				:key="item.value"
			>
			</el-tab-pane>
		</el-tabs>
		<!-- 自定义列表数据 -->
		<div class="custom-list-box">
			<div class="custom-list" v-if="listData.length">
				<div
					v-for="(item, index) in listData"
					:key="`${item.name + index}`"
					:class="[
						'custom-list-item',
						{ 'short-label': activeOrder === 'municipalLeaderList' },
					]"
				>
					<div class="fx-r fx-al-c">
						<div class="index">{{ (index as number) + 1 }}</div>
						<div class="label text-ellipsis2" :title="item.name">
							{{ item.name }}
						</div>
						<div class="value fx-r fx-1">
							<div class="value-item fx-r fx-al-c">
								<div
									class="progress-bar"
									:style="{
										background: '#3489FF',
										borderRadius: ' 0.04rem',
										height: '100%',
										width: (item.unconnectedSOECount / maxData) * (activeOrder === 'unitList' ? 67 : 74) + '%',
									}"
								></div>
								<div class="value-label fx-r">
									<span class="value">{{ item.unconnectedSOECount || 0 }}</span>
									<span class="unit">家</span>
									<span class="rate">{{
										(item.unconnectedRate || 0) + ' %'
									}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<default-empty-container v-else />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { getSize, getUrl } from '@/utils';
// import dayjs from 'dayjs';
import { getUnconnectedByResponsibilityUnit } from '@/api/wallMapTable';

/* interface DateRange {
	start: Date;
	end: Date;
}

const props = defineProps({
	dateRange: {
		type: Object as () => DateRange | null,
		default: () => {},
	},
}); */
const unConnectedList = ref<any>({});
const iconActive = ref(false);

const activeOrder = ref('unitList');
const orderListTab = ref<any>([
	{
		label: '按责任市领导划分',
		value: 'municipalLeaderList',
	},
	{
		label: '按责任单位划分',
		value: 'unitList',
	},
]);
const listData = computed(() => unConnectedList.value[activeOrder.value] || []);
const maxData = computed(() => {
	const max = Math.max(...listData.value.map((item: any) => item.unconnectedSOECount));
	return max;
});

const getListData = () => {
	// if (!props.dateRange?.start) return;
	getUnconnectedByResponsibilityUnit({
		// params: { startTime: dayjs(props.dateRange.start).format('YYYY-MM-DD') },
	}).then((res: any) => {
		unConnectedList.value = res.data;
	});
};

/* watch(
	() => props.dateRange,
	() => {
		getListData();
	},
	{
		immediate: true,
	}
); */

onMounted(() => {
	getListData();
});
</script>
<style lang="less" scoped>
.not-connected-box {
	width: 100%;
	height: 100%;
	padding: 0 0.1rem;
	position: relative;
	.question-icon {
		width: 0.32rem;
		height: 0.32rem;
		position: absolute;
		right: 1.3rem;
		cursor: pointer;
		z-index: 9;
	}
	:deep(.el-tabs) {
		--el-tabs-header-height: 0.4rem !important;
		margin-bottom: 0.2rem;
		.el-tabs__nav {
			width: 100%;
		}
		.el-tabs__header {
			margin: 0 0 0.06rem 0;
		}
		.el-tabs__active-bar {
			background-color: #2e79f8;
			&::before {
				content: '';
				display: inline-block;
				position: absolute;
				left: -0.2rem; // 左侧延长
				right: -0.2rem; // 右侧延长
				top: 0;
				bottom: 0;
				background-color: inherit;
				z-index: -1;
			}
		}
		.el-tabs__nav-wrap {
			&::after {
				content: '';
				display: inline-block;
				width: 100%;
				height: 0.01rem;
				border: 0.01rem solid;
				border-image: linear-gradient(
						90deg,
						rgba(213, 232, 255, 0.45),
						rgba(192, 218, 255, 1),
						rgba(170, 204, 255, 0.16)
					)
					1 1;
			}
		}
		.el-tabs__item {
			font-size: 0.18rem;
			padding: 0 0.2rem 0.1rem;
			--el-text-color-primary: rgba(0, 0, 0, 0.5);
			&:hover {
				color: #2e79f8;
			}
			&.is-active {
				color: #2e79f8;
				font-size: 0.2rem;
				background: linear-gradient(
					180deg,
					rgba(232, 244, 255, 0.5) 0%,
					rgba(184, 216, 255, 0.5) 100%
				);
				backdrop-filter: blur(10px);
			}
			&:nth-child(2) {
				padding-left: 0 !important;
				text-indent: 0.2rem !important;
			}
			&:last-child {
				padding-right: 0.2rem !important;
			}
		}
	}
	.custom-list-box {
		width: 100%;
		height: calc(100% - 1.3rem);
		.custom-list {
			overflow-y: auto;
			height: 100%;
			position: relative;
			.custom-list-item {
				margin-bottom: 0.2rem;
				cursor: pointer;
				.index {
					width: 0.24rem;
					height: 0.24rem;
					line-height: 0.24rem;
					border-radius: 50%;
					background: #4787f0;
					color: #fff;
					text-align: center;
					font-size: 0.16rem;
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
					width: 1.6rem;
					text-align: left;
					color: rgba(0, 0, 0, 0.85);
					margin-right: 0.08rem;
					line-height: 0.16rem;
					line-height: 0.24rem;
				}

				.value {
					flex: 1; 
					min-width: 0; 

					.value-item {
						height: 0.2rem;
						width: 100%; 
						min-width: 0; 
						overflow: hidden;

						.progress-bar {
							min-width: 0;
							flex-shrink: 0;
							z-index: 1;
						}

						.value-label {
							margin-left: 0.1rem;
							color: rgba(0, 0, 0, 0.65);
							height: 0.08rem;
							line-height: 0.08rem;
							white-space: nowrap;
							font-size: 0.18rem;
							min-width: 0; // 防止 flex 项溢出
							flex-shrink: 0; // 防止被压缩

							.value {
								font-family: 'DIN Alternate Bold';
								font-size: 0.2rem;
								margin-right: 0.02rem;
							}
							.unit {
								font-size: 0.16rem;
								font-family: 'PingFangSC';
								font-weight: 400;
								margin-right: 0.04rem;
							}
							.rate {
								color: #165dff;
								margin: 0 0.08rem 0 0.1rem;
								position: relative;
								font-family: 'DIN Alternate Bold';
								&::before {
									content: '';
									display: inline-block;
									width: 1px;
									height: 0.14rem;
									background: rgba(0, 0, 0, 0.65);
									position: absolute;
									left: -0.08rem;
									top: -0.04rem;
								}
							}
						}
					}
				}
			}
			.short-label {
				.label {
					width: 0.7rem;
				}
			}
		}
	}
}
</style>
<style lang="less">
.ipad-popover {
	padding: 0.16rem 0.24rem;

	.el-popover__title {
		color: rgba(0, 0, 0, 0.85);
		font-size: 0.21rem;
		font-family: 'PingFangSC, PingFang SC;';
		font-weight: 600;
	}
	.content {
		color: #202741;
		font-size: 0.18rem;
	}
	.symbol {
		color: #266fe8;
		margin: 0 0.04rem;
		font-weight: 500;
	}
}
</style>
