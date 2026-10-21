<!--
 * @Descripttion: 目标企业概况
 * @Author: zhaochao
 * @Date: 2025-08-08 17:58:31
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-07 17:49:29
-->
<template>
	<FrameBox class="aim-enterprise-overview" size="small-white">
		<TitleBody name="目标企业概况">
			<template #extra>
				<SearchEnterprise />
			</template>
			<EnterpriseOverview />
		</TitleBody>
		<TitleBody name="招商动态" class="investment-trends">
			<div class="main-content fx-c">
				<RoundRectTabs v-model="selectedTab" :tabsList="tabs" />
				<div class="trends-top fx-r fx-al-c fx-sp-a">
					<div class="label">
						{{ `${tabsList[selectedTab].subTitle}年度累计拜访企业` }}
					</div>
					<div>
						<span class="value">{{ trendsListData.length }}</span> 个
					</div>
				</div>

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
					<default-empty-container :height="'3.3rem'" v-else />
				</div>
			</div>
		</TitleBody>
		<SearchDialog ref="SearchDialogRef" />
	</FrameBox>
</template>
<script lang="ts" setup>
import { LoopScroll } from '@joyday/vue-loop-scroll';
import RoundRectTabs from '@/components/RoundRectTabs.vue';
import { getInvestDynamicsByLeaderType } from '@/api/runByEnterprise/index';
import EnterpriseOverview from './EnterpriseOverview.vue';
import SearchEnterprise from './components/SearchEnterprise.vue';

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
			font-size: 0.14rem;
		}
		.header {
			margin-bottom: 0;
		}
	}
	.inputBox {
		width: 1.6rem;
	}

	.investment-trends {
		margin-top: 0.3rem;
		.main-content {
			// padding-left: 0.12rem;
			// padding-right: 0.08rem;
			.tabs-control {
				margin-top: 0.14rem;
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
				height: 3.3rem;
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
