<template>
	<FrameBox class="aim-enterprise-overview" size="short-white">
		<div class="fx-r fx-sp-b">
			<TitleBody name="招商动态" class="investment-trends">
				<div class="main-content fx-c">
					<RoundRectTabs v-model="selectedTab" :tabsList="tabs" />
					<!--          <div class="trends-top fx-r fx-al-c fx-sp-a">-->
					<!--            <div class="label">-->
					<!--              {{ `${tabsList[selectedTab].subTitle}年度累计拜访企业` }}-->
					<!--            </div>-->
					<!--            <div>-->
					<!--              <span class="value">{{ trendsListData.length }}</span> 个-->
					<!--            </div>-->
					<!--          </div>-->

					<div class="trends-list">
						<template v-if="trendsListData.length">
							<LoopScroll :dataSource="trendsListData" :waitTime="500" :speed="0.5">
								<template #default="{ item }">
									<el-popover
										popper-class="investment-popover"
										placement="top"
										:title="(item as any).dynContent"
									>
										<template #reference>
											<div class="list-item text-ellipsis2">
												{{ (item as any).dynContent }}
											</div>
										</template>
									</el-popover>
								</template>
							</LoopScroll>
						</template>
						<default-empty-container :height="'3.1rem'" v-else />
					</div>
				</div>
			</TitleBody>
			<TitleBody name="企业库">
				<div>
					<SmallTitle title="企业情报" class="title-margin" />
					<div class="tabs-expand-shrink-box">
						<div class="tab-item">
							<span class="left-text">企业潜力</span>
							<span class="right-text">广规经济产业大平台</span>
						</div>
						<div class="tab-item">
							<span class="left-text">投融资</span>
							<span class="right-text right-text2">清科私募通</span>
						</div>
					</div>
					<div class="library-bottom">
						<SmallTitle title="企业档案" class="title-margin" />
						<div class="library-list">
							<div class="library-item" @click="handleClick(1)">跟进信息记录</div>
							<div class="library-item" @click="handleClick(2)">目标企业管理中心</div>
						</div>
					</div>
				</div>
			</TitleBody>
			<info-record-dialog ref="infoRecordRef"></info-record-dialog>
			<tip-Dialog ref="tipRef"></tip-Dialog>
		</div>
	</FrameBox>
</template>
<script lang="ts" setup>
import { LoopScroll } from '@joyday/vue-loop-scroll';
import RoundRectTabs from '@/components/RoundRectTabs.vue';
import { getInvestDynamicsByLeaderType } from '@/api/runByEnterprise/index';
import InfoRecordDialog from './dialog/InfoRecordDialog.vue';
import TipDialog from './dialog/TipDialog.vue';

const infoRecordRef = ref();
const tipRef = ref();
const selectedTab = ref<any>(0);
const tabsList = ref<any>([
	{
		label: '全部',
		value: '',
		subTitle: '领导',
	},
	{
		label: '市领导',
		value: '市领导',
		subTitle: '市领导',
	},
	{
		label: '各单位',
		value: '各单位',
		subTitle: '各单位领导',
	},
	{
		label: '各区',
		value: '各区',
		subTitle: '各区领导',
	},
]);
const tabs = computed(() => tabsList.value.map((item: any) => item.label));
const trendsListData = ref<any>([]);

const getTrendsData = () => {
	const params = {
		leaderType: tabsList.value[selectedTab.value].value,
	};
	getInvestDynamicsByLeaderType({
		params: selectedTab.value === 0 ? {} : params,
	})
		.then((res: any) => {
			if (res.code === 0) {
				trendsListData.value = res.data.investDynamicList;
			} else {
				trendsListData.value = [];
			}
		})
		.catch(() => {
			trendsListData.value = [];
		});
};
const handleClick = (type: number) => {
	if (type === 1) {
		infoRecordRef.value.show();
	} else {
		// tipRef.value.show();
		window.open('http://10.205.25.136/zszh-admin/#/', '_blank');
	}
};

watch(
	() => selectedTab.value,
	() => {
		getTrendsData();
	},
	{
		immediate: true,
	}
);
</script>
<style lang="less" scoped>
.aim-enterprise-overview {
	font-family:
		PingFangSC,
		PingFang SC;
	width: 100%;
	height: 4.52rem;
	:deep(.small-title) {
		margin-bottom: 0.15rem;
	}
	.investment-trends {
		margin-right: 0.24rem;
		.main-content {
			// padding-left: 0.12rem;
			// padding-right: 0.08rem;
			.tabs-control {
				width: 100%;
			}
			.trends-top {
				width: 100%;
				height: 0.66rem;
				background: url('@/assets/images/runByEnterprise/left/trends-top.png') no-repeat
					center;
				background-size: 100%;
				text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
				color: #fff;
				font-size: 0.14rem;
				padding-left: 0.36rem;
				margin-top: 0.18rem;
				.label {
					font-size: 0.16rem;
					font-weight: 500;
				}
				.value {
					font-size: 0.24rem;
					font-weight: bold;
					font-family: @number-font;
				}
			}
			.trends-list {
				height: 3.1rem;
				overflow-y: auto;
				margin-top: 0.1rem;
				:deep(.scroll-loop-viewport) {
					&:hover {
						// overflow-y: auto;
					}
				}
				.list-item {
					color: #4b4b4b;
					font-size: 0.14rem;
					line-height: 0.22rem;
					padding-left: 0.28rem;
					margin-bottom: 0.12rem;
					position: relative;
					cursor: pointer;

					&::before {
						content: '';
						display: inline-block;
						width: 0.04rem;
						height: 0.04rem;
						background: #176bf9;
						position: absolute;
						left: 0.16rem;
						top: 0.07rem;
					}
				}
			}
		}
	}
	.tabs-expand-shrink-box {
		background-size: 100% 100%;
		background-image: url('@/assets/images/runByEnterprise/library-bg.png');
		display: flex;
		align-items: flex-end;
		height: 1.29rem;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.15rem 0.08rem;
		.tab-item {
			//cursor: pointer;
			width: 2.65rem;
			height: 0.42rem;
			line-height: 0.42rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/tabs-expand.png');
			//transition:
			//    width 0.3s ease-out,
			//    background-image 0.3s ease-out;
			//overflow: hidden;
			display: flex;
			align-items: center;
			box-shadow: 0 0 0.06rem 0 rgba(44, 118, 226, 0.4);
			border-radius: 0.25rem;
			.left-text {
				flex-shrink: 0;
				white-space: nowrap;
				width: 0.95rem;
				text-align: center;
				font-weight: bold;
				font-size: 0.18rem;
				padding-left: 0.1rem;
				color: #ffffff;
				line-height: 0.24rem;
				text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
				transition: all 0.3s ease-out;
			}

			.right-text {
				white-space: nowrap;
				width: 1.7rem;
				padding-left: 0.15rem;
				font-family:
					PingFangSC,
					PingFang SC;
				font-weight: 600;
				font-size: 0.16rem;
				color: #3489ff;
				line-height: 0.22rem;
				opacity: 1; // 初始透明
				//transform: translateX(-0.1rem); // 初始向左偏移
				//transition:
				//    opacity 0.2s ease-out 0.1s,
				//      // 延迟淡入
				//    transform 0.3s ease-out; // 平滑移动
				&.right-text2 {
					padding-left: 0.2rem;
				}
			}

			//&:hover {
			//  width: 2.71rem;
			//  height: 0.42rem;
			//  background-image: url('@/assets/images/runByEnterprise/newDetail/tabs-expand.png');
			//  .left-text {
			//    width: auto;
			//    padding: 0 0.1rem;
			//  }
			//
			//  .right-text {
			//    opacity: 1; // 完全显示
			//    transform: translateX(0); // 回到原位
			//  }
			//}
		}
	}
	.library-bottom {
		margin-top: 0.18rem;
		.library-list {
			font-family: MicrosoftYaHei, MicrosoftYaHei;
			font-weight: bold;
			font-size: 0.18rem;
			color: #ffffff;
			display: flex;
			height: 1.29rem;
			justify-content: flex-end;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/library-bg.png');
			padding: 0.31rem 0.08rem 0.2rem;
			.library-item {
				cursor: pointer;
				width: 1.51rem;
				height: 0.78rem;
				padding: 0.1rem 0.38rem 0.2rem;
				background-size: 100% 100%;
				background-image: url('@/assets/images/runByEnterprise/libarary-blue-bg.png');
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
