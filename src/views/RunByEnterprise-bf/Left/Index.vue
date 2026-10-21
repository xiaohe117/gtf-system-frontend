<!--
 * @Descripttion: 目标企业概况
 * @Author: zhaochao
 * @Date: 2025-08-08 17:58:31
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-10 16:04:53
-->
<template>
	<FrameBox class="aim-enterprise-overview" size="small-white">
		<TitleBody name="目标企业概况">
			<EnterpriseOverview />
		</TitleBody>
		<TitleBody name="目标企业分析">
			<SmallTitle :title="'基础分析-企业所在地'">
				<img
					class="more-icon"
					src="@/assets/images/runByEnterprise/left/right-circle.png"
					@click="EnterpriseAnalysisDialogRef.show()"
				/>
			</SmallTitle>
			<ChartContainer
				class="enterprise-region-chart"
				:chartOption="chartData"
				:isEmpty="!enterpriseRegionData.length"
			/>
			<SmallTitle :title="`研判分析-建议拜访企业(${currentMonth}月)`" />
			<EnterpriseRank class="enterprise-rank" :rankList="rankList" />
		</TitleBody>
	</FrameBox>
	<EnterpriseAnalysisDialog ref="EnterpriseAnalysisDialogRef" />
</template>
<script lang="ts" setup>
import { queryRegionCount } from '@/api/index';
import { getVisitEnterprise } from '@/api/runByEnterprise/index';
import { pieChartOption2 } from './components/chartOptions';
import EnterpriseOverview from './EnterpriseOverview.vue';
import EnterpriseAnalysisDialog from './dialog/EnterpriseAnalysisDialog.vue';
import EnterpriseRank from './components/EnterpriseRank.vue';

const currentMonth = ref(new Date().getMonth() + 1);
const EnterpriseAnalysisDialogRef = ref<any>();
const enterpriseRegionData = ref<any>([]);
const rankList = ref<any>({
	header: [
		{
			label: '序号',
			type: 'index',
		},
		{
			label: '企业名称',
			prop: 'companyName',
		},
		{
			label: '提请拜会时间',
			prop: 'requestTime',
		},
	],
	listData: [],
});
const chartData = computed(() => pieChartOption2(enterpriseRegionData.value, '家'));

// 获取企业所在地信息
const getEnterpriseRegionData = () => {
	queryRegionCount({ domesticForeign: '0' }).then((res: any) => {
		if (res.code === 0) {
			enterpriseRegionData.value = res.data.map((item: any) => ({
				name: item.label,
				value: item.subCount,
			}));
		}
	});
};

// 获取研判分析-拜访企业数据
const getRankListData = () => {
	getVisitEnterprise().then((res: any) => {
		if (res.code === 0) {
			rankList.value.listData = res.data;
		}
	});
};

onMounted(() => {
	getEnterpriseRegionData();
	getRankListData();
});
</script>
<style lang="less" scoped>
.aim-enterprise-overview {
	flex-shrink: 0;
	height: 9.48rem;
	width: 4.58rem;
	color: rgba(0, 0, 0, 0.6);
	font-size: 0.14rem;
	font-family: MicrosoftYaHei;
	:deep(.small-title) {
		margin: 0.06rem 0 0.1rem 0.16rem;
		.title {
			font-size: 0.18rem;
		}
	}
	:deep(.outside-content) {
		// padding-top: 0.24rem;
		padding-right: 0.14rem;
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
	.more-icon {
		width: 0.2rem;
		height: 0.2rem;
		cursor: pointer;
		margin-right: 0.14rem;
	}
	.enterprise-region-chart {
		height: 2rem;
	}
	.enterprise-rank {
		:deep(.body-content) {
			height: 1.2rem;
			overflow-y: auto;
		}
	}
}
</style>
