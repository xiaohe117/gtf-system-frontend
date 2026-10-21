<!--
 * @Descripttion: 目标企业概况
 * @Author: zhaochao
 * @Date: 2025-08-08 17:58:31
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-08 17:42:43
-->
<template>
	<div class="aim-content">
		<div class="aim-enterprise fx-r fx-sp-a fx-al-c">
			<div class="top-left">
				<div class="title">全市目标企业</div>
				<div>
					<span class="num">{{ formatNumber(aimEnterpriseData.totalEnterprises) }}</span>
					家
				</div>
			</div>
			<div class="top-right">
				<NumberValue :label="'本月新增'" :value="aimEnterpriseData.monthlyNew" />
				<NumberValue :label="'本月退出'" :value="aimEnterpriseData.monthlyExit" />
			</div>
		</div>
		<div class="aim-type-list">
			<div
				class="aim-type-item fx-r"
				v-for="(item, index) in enterpriseTypeData"
				:key="index"
			>
				<img
					:src="getUrl(`runByEnterprise/left/enterprise-type-${item.iconType}.png`)"
					class="left-icon"
				/>
				<div class="right-content fx-1">
					<div class="label fx-r fx-sp-b" @click="handlerDialog(item.prop)">
						{{ item.label }}
						<img
							class="more-icon"
							src="@/assets/images/runByEnterprise/left/right-circle.png"
							alt=""
						/>
					</div>
					<div class="value fx-r fx-sp-b fx-al-c">
						<div>
							<span class="value-text">{{ formatNumber(item.value) }}</span>
							{{ item.unit }}
						</div>
						<NumberValue :value="item.subValue" :label="item.subLabel" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<component :is="componentObj[currentDialog]" ref="dialogComponentRef" />
</template>
<script lang="ts" setup>
import { getUrl, formatNumber } from '@/utils/index';
import { getTargetEntOverview } from '@/api/runByEnterprise/index';
import { queryRankStatistics } from '@/api/index';
import NumberValue from './components/NumberValue.vue';
import InProgressProjectDialog from './dialog/InProgressProjectDialog.vue';
import PlanProjectDialog from './dialog/PlanProjectDialog.vue';
import EnterpriseFollowDialog from './dialog/EnterpriseFollowDialog.vue';
import CompositeRankDialog from './dialog/CompositeRankDialog.vue';

const dialogComponentRef = ref<any>();
const componentObj: any = {
	InProgressProjectDialog: markRaw(InProgressProjectDialog),
	EnterpriseFollowDialog1: markRaw(EnterpriseFollowDialog),
	EnterpriseFollowDialog2: markRaw(EnterpriseFollowDialog),
	PlanProjectDialog: markRaw(PlanProjectDialog),
	CompositeRankDialog1: markRaw(CompositeRankDialog),
	CompositeRankDialog2: markRaw(CompositeRankDialog),
};
const currentDialog = ref<string>('');
const aimEnterpriseData = ref<any>({}); // 目标企业数据
const compositeRankTotal = ref<number>(0); // 综合性榜单总数
const growthEnterpriseTotal = ref<number>(0); // 成长性企业总数

const enterpriseTypeData = computed(() => [
	{
		label: '已对接企业',
		prop: 'EnterpriseFollowDialog2',
		value: 0,
		unit: '家',
		iconType: '1',
		subLabel: '新跟进',
		subValue: 0,
	},
	{
		label: '形成跟进项目',
		prop: 'InProgressProjectDialog',
		value: 0,
		unit: '家',
		iconType: '2',
		subLabel: '退出跟进',
		subValue: 0,
	},
	{
		label: '综合性榜单',
		prop: 'CompositeRankDialog1',
		value: compositeRankTotal.value,
		unit: '家',
		iconType: '3',
		subLabel: '新增',
		subValue: 0,
	},
	{
		label: '成长性企业',
		prop: 'CompositeRankDialog2',
		value: growthEnterpriseTotal.value,
		unit: '家',
		iconType: '4',
		subLabel: '新增',
		subValue: 0,
	},
]);
const handlerDialog = (prop: string) => {
	currentDialog.value = prop;
	nextTick(() => {
		dialogComponentRef.value.show(prop);
	});
};

// 获取目标企业概况数据
const getTargetEntOverviewData = () => {
	getTargetEntOverview().then((res: any) => {
		if (res.code === 0) {
			aimEnterpriseData.value = res.data[0] || {};
		}
	});
};
// 获取综合性榜单总数
const getCompositeRankTotal = () => {
	queryRankStatistics({ tagTypeCn: '榜单企业' }).then((res: any) => {
		if (res.code === 0) {
			compositeRankTotal.value = res.data.reduce((acc: any, cur: any) => acc + cur.count, 0);
		}
	});
};

// 获取成长性企业总数
const getGrowthEnterpriseTotal = () => {
	queryRankStatistics({ tagTypeCn: '成长性企业' }).then((res: any) => {
		if (res.code === 0) {
			growthEnterpriseTotal.value = res.data.reduce(
				(acc: any, cur: any) => acc + cur.count,
				0
			);
		}
	});
};
onMounted(() => {
	getTargetEntOverviewData();
	getCompositeRankTotal();
	getGrowthEnterpriseTotal();
});
</script>
<style lang="less" scoped>
.aim-content {
	.aim-enterprise {
		width: 100%;
		height: 0.88rem;
		background: url('@/assets/images/runByEnterprise/left/arrow-bg.png') no-repeat left center;
		background-size: 100% 100%;
		padding: 0 0.48rem;
		line-height: 0.32rem;
		.top-left {
			color: #fff;
			font-weight: 500;
			text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
			.title {
				font-size: 0.16rem;
			}
			.num {
				font-family: @number-font;
				font-size: 0.24rem;
			}
		}
	}
	.top-left,
	.top-right {
		margin-top: 0.06rem;
	}
	.aim-type-list {
		display: flex;
		flex-wrap: wrap;
		.aim-type-item {
			height: 0.9rem;
			padding-top: 0.12rem;
			padding-right: 0.12rem;
			width: 50%;
			margin-top: 0.45rem;
			position: relative;
			&:nth-child(odd) {
				&::after {
					content: '';
					display: inline-block;
					width: calc(200% - 0.12rem);
					height: 0.2rem;
					background: url('@/assets/images/runByEnterprise/left/box-decoration.png')
						no-repeat center center;
					background-size: 100%;
					position: absolute;
					margin-left: 0.06rem;
					margin-right: 0.06rem;
					left: 0;
					bottom: 0;
				}
			}

			.left-icon {
				width: 0.56rem;
				height: 0.56rem;
			}
			.right-content {
				position: relative;
				z-index: 2;
				.label {
					color: #4b4b4b;
					font-weight: 500;
					height: 0.46rem;
					cursor: pointer;
					.more-icon {
						width: 0.2rem;
						height: 0.2rem;
					}
				}
				.value {
					.value-text {
						color: #165dff;
						font-size: 0.22rem;
						font-family: @number-font;
					}
				}
			}
			&:nth-of-type(n + 3) {
				.value-text {
					color: #383838 !important;
				}
			}
		}
		.aim-type-item:nth-of-type(1),
		.aim-type-item:nth-of-type(3) {
			&::before {
				content: '2025年度跟进情况';
				display: inline-block;
				width: 1.74rem;
				height: 0.34rem;
				line-height: 0.34rem;
				position: absolute;
				background: url('@/assets/images/runByEnterprise/left/text-bg.png') no-repeat;
				background-size: 100% 100%;
				color: #fff;
				font-weight: 600;
				text-indent: 0.24rem;
				top: -0.34rem;
				left: 0.1rem;
			}
		}
		.aim-type-item:nth-of-type(3) {
			&::before {
				content: '重点关注企业';
			}
		}
	}
}
</style>
