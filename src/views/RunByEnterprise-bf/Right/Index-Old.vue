<!--
 * @Descripttion: 整体概况右侧
 * @Author: lj
 * @Date: 2025-08-12 9:58:31
 * @LastEditors: lj
 * @LastEditTime: 2025-08-12 18:00:40
-->
<template>
	<FrameBox class="aim-enterprise-overview" size="small-white">
		<TitleBody name="事项跟进" class="matter">
			<template #extra> <div class="more-icon">查看更多</div></template>
			<div class="matter-top fx-r fx-al-c fx-sp-a">
				<div class="label">待解决问题</div>
				<div><span class="value">123</span> 个</div>
			</div>
			<div class="chart-box">
				<ChartContainer :chartOption="pieOption" />
			</div>
		</TitleBody>
		<TitleBody name="重点榜单" class="key-ranking">
			<template #extra>
				<RoundRectTabs v-model="selectedTab" :tabsList="tabsList" />
			</template>
			<div class="main-content fx-c">
				<LineTabs
					v-model="selectedType"
					:tabsList="tabsType[selectedTab]"
					@change-tab="changeTab"
				/>
				<div class="rank-list-box">
					<div class="list-items header fx-r">
						<p
							v-for="(item, index) in rankList.header"
							:key="index"
							class="list-common-item"
						>
							{{ item }}
						</p>
					</div>
					<template v-if="rankList.listData.length > 0">
						<div
							class="list-items body-items fx-r"
							v-for="(item, index) in rankList.listData"
							:key="index"
              @click="goEnterpriseDetail(item)"
						>
							<p class="list-common-item">{{ index + 1 }}</p>
              <el-tooltip :content="item.companyName" placement="top"  :disabled="!tooltipEnabled[index]">
                <p class="list-common-item text-ellipsis"  @mouseenter="checkTextOverflow(index)">
                  {{ item.companyName }}
                </p>
              </el-tooltip>
							<div class="list-common-item rank-desc">
								<div v-if="item.isPlan === '1'">有策划</div>
								<div v-if="item.isVisit === '1'" class="yellow">有拜访</div>
							</div>
							<p class="list-common-item">{{ item.unitName || '--' }}</p>
						</div>
					</template>
					<default-empty-container :height="'3.0rem'" v-else />
				</div>
				<div class="goto-special" @click="goToSpecial">进入专项挂图作战</div>
			</div>
		</TitleBody>
	</FrameBox>
</template>
<script lang="ts" setup>
import {
	queryRankStatistics,
	queryKeyEnterpriseList,
	queryVisitEnterpriseList,
	queryPlanEnterpriseList,
} from '@/api/index';
import LineTabs from '@/views/RunByEnterprise/Right/components/LineTabs.vue';
import { useRouter } from 'vue-router';
import { pieChartOption } from './chartOption';

const router = useRouter();
const selectedTab = ref<any>(0);
const selectedType = ref<any>(0);
const tabsList = ref<any>(['热点企业', '综合榜单', '成长型企业']);
const tabsType = ref<any>({
	0: [{ name: '最近领导拜访企业' }, { name: '最近热点接洽企业' }],
	1: [
		{ name: '央企100强', num: 12, unit: '家' },
		{ name: '民企100强', num: 10, unit: '家' },
		{ name: '世界500强', num: 10, unit: '家' },
	],
	2: [
		{ name: '专精特性企业', num: 12, unit: '家' },
		{ name: '瞪羚企业', num: 10, unit: '家' },
	],
});
const dataList = ref<any[]>([
	{
		label: '基础配套(土地、园区等)',
		count: 123,
	},
	{
		label: '产业资源(规划、政策等)',
		count: 123,
	},
	{
		label: '流程效率(审批、建设等)',
		count: 123,
	},
]);
const pieOption = ref({});
const getPieOption = () => {
	const chartData = dataList.value.map((el: any) => ({
		name: el.label,
		value: el.count,
	}));
	pieOption.value = pieChartOption(chartData);
};
getPieOption();

const rankList = ref<any>({
	header: ['序号', '企业名称', '*排序说明', '跟进单位'],
	listData: [],
});
const tooltipEnabled = ref<boolean[]>([]);

const checkTextOverflow = (index: number) => {
  nextTick(() => {
    const elements = document.querySelectorAll('.text-ellipsis');
    if (elements[index]) {
      const element = elements[index] as HTMLElement;
      const isOverflowing = element.scrollWidth > element.clientWidth;

      const newTooltipEnabled = [...tooltipEnabled.value];
      newTooltipEnabled[index] = isOverflowing;
      tooltipEnabled.value = newTooltipEnabled;
    }
  });
};
const goEnterpriseDetail = (item: any) => {
  router.push({
    name: 'enterpriseDetail',
    query: {
      sccode: item.sccode,
    },
  });
};
// 重点榜单 -热点企业
const getEnterpriseList = async (type: 'visit' | 'plan') => {
	try {
		const apiCall = type === 'visit' ? queryVisitEnterpriseList : queryPlanEnterpriseList;
		const res = await apiCall<any>();
		rankList.value.listData = res?.data || [];
	} catch (error) {
		rankList.value.listData = [];
	}
};
// 综合榜首、成长型企业
const getKeyEnterpriseList = async (tagName: string) => {
	try {
		const res = await queryKeyEnterpriseList<any>({ tagName });
		rankList.value.listData = res?.data || [];
	} catch (error) {
		rankList.value.listData = [];
	}
};
const getStatistics = async (tag: string) => {
	try {
		const res = await queryRankStatistics<any>({ tagTypeCn: tag });
		const resData = res?.data || [];
		tabsType.value[selectedTab.value] = resData.map((el: any) => ({
			name: el.label,
			num: el.count,
			unit: el.count === 0 ? '' : '家',
		}));
		if (resData.length > 0 && resData[0].label) {
			await getKeyEnterpriseList(resData[0].label);
		} else {
			rankList.value.listData = [];
		}
	} catch (error) {
		tabsType.value[selectedTab.value] = [];
		rankList.value.listData = [];
	}
};
const changeTab = (tab: any) => {
	if (selectedTab.value !== 0) {
		getKeyEnterpriseList(tab.name);
	}
};
const loadDataByTab = () => {
	switch (selectedTab.value) {
		case 0: // 热点企业
			if (selectedType.value === 0) {
				getEnterpriseList('visit'); // 最近领导拜访企业
			} else {
				// 最近热点接洽企业
				getEnterpriseList('plan');
			}
			break;
		case 1: // 综合榜单
			getStatistics('榜单企业'); // 获取统计数据
			break;
		case 2: // 成长型企业
			getStatistics('成长性企业'); //
			break;
		default:
			break;
	}
};
const goToSpecial = () => {
	router.push({
		path: '/wallMapTable',
		query: {},
	});
};
watch(
	() => selectedTab.value,
	() => {
		selectedType.value = 0;
		loadDataByTab();
	},
	{ immediate: true }
);
watch(
	() => selectedType.value,
	() => {
		if (selectedTab.value === 0) {
			loadDataByTab();
		}
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
		}
		.header {
			margin-bottom: 0;
		}
	}
	.matter {
		.more-icon {
			cursor: pointer;
			width: 1.6rem;
			height: 0.38rem;
			background-image: url('@/assets/images/runByEnterprise/newDetail/left-main-enter-icon.png');
			background-size: 100% 100%;
			font-size: 0.14rem;
			color: #165dff;
			text-align: center;
			line-height: 0.38rem;
		}
		.matter-top {
			width: 100%;
			height: 0.66rem;
			background: url('@/assets/images/runByEnterprise/left/trends-top.png') no-repeat center;
			background-size: 100%;
			text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
			color: #fff;
			font-size: 0.14rem;
			padding-left: 0.14rem;
			margin-top: 0.16rem;
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
		.chart-box {
			height: 2rem;
		}
	}
	.key-ranking {
		margin-top: 0.16rem;
		:deep(.tabs-control) {
			> div {
				padding: 0rem 0.1rem;
			}
		}
		.main-content {
			padding-left: 0.12rem;
			padding-right: 0.08rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 5.3rem;
			padding-bottom: 0.15rem;
			.rank-list-box {
				height: 100%;
				width: 100%;
				overflow-y: auto;
				.list-items {
					align-items: center;
					.list-common-item {
						text-align: center;
						font-weight: 500;
						font-size: 0.16rem;
						color: rgba(0, 0, 0, 0.7);
						line-height: 0.22rem;
						flex: 1;
						&:nth-child(1) {
							flex: 0.5;
						}
						&:nth-child(2) {
							flex: 2;
						}
						&.text-ellipsis {
							text-align: left;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						&.rank-desc {
							display: flex;
							gap: 0.04rem;
							align-items: center;
							justify-content: center;
							> div {
								width: 0.55rem;
								height: 0.18rem;
								background: #00c462;
								border-radius: 0.01rem;
								font-family: MicrosoftYaHei;
								font-size: 0.11rem;
								color: #ffffff;
								line-height: 0.18rem;
								&.yellow {
									background: #ffc359;
								}
							}
						}
					}
					&.header {
						margin-bottom: 0.11rem;
					}
					&.body-items {
						position: relative;
						cursor: pointer;
						height: 0.36rem;
						background: rgba(169, 181, 255, 0.1);
						border-radius: 1rem;
						border: 0.01rem solid #ffffff;
						&:not(:last-child) {
							margin-bottom: 0.05rem;
						}
					}
					&.active {
						background: linear-gradient(180deg, #1b4df4 0%, #5dc9fc 100%);
						.list-common-item {
							color: #ffffff;
						}
						&::after {
							position: absolute;
							right: -0.22rem;
							content: '';
							display: inline-block;
							width: 0;
							height: 0;
							border-top: 0.16rem solid transparent;
							border-bottom: 0.16rem solid transparent;
							border-left: 0.16rem solid #ff8900;
						}
					}
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
				background: url('@/assets/images/runByEnterprise/right/bottom-bg.png') no-repeat
					center;
				background-size: 100%;
				margin-top: 0.18rem;
			}
		}
	}
}
</style>
