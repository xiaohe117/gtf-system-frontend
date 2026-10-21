<!--
 * @Descripttion: 招商策划项目
 * @Author: zhaochao
 * @Date: 2025-08-12 09:23:35
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-09 10:07:02
-->
<template>
	<el-dialog v-model="dialogVisible" width="9.85rem" class="plan-project-dialog">
		<TitleBody name="目标企业招商策划项目">
			<!-- 顶部统计数据 -->
			<div class="top-statistics fx-r fx-sp-b">
				<div class="top-left fx-r fx-sp-a fx-al-c">
					<div class="top-left-label">
						<div class="title">当前在跟招商策划项目</div>
						<div>
							<span class="num">{{ formatNumber(topItemData.allCount) }}</span> 家
						</div>
					</div>
					<div class="top-left-value">
						<NumberValue :label="'新增'" :value="topItemData.addCount" />
						<NumberValue :label="'退出'" :value="topItemData.quitCount" />
					</div>
				</div>
				<div class="top-right fx-r">
					<div class="top-right-item fx-r">
						<img src="@/assets/images/runByEnterprise/left/add-icon.png" alt="" />
						<div class="top-right-content">
							<div class="label">招商策划项目转化</div>
							<div class="value fx-r">
								<div>
									<span class="value-text">{{
										formatNumber(topItemData.transformData)
									}}</span
									>个
								</div>
								<div class="fx-r fx-al-c">
									本月转化 {{ topItemData.currentMonthTransform || 0 }}个
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="follow-overview fx-r">
				<div class="fx-1 fx-c">
					<SmallTitle title="产业项目策划分析" />
					<div class="fx-1">
						<ChartContainer
							:chartOption="pieChartOptionData"
							:isEmpty="!planAnalysisData.length"
						/>
					</div>
				</div>
				<div class="right-list">
					<SmallTitle title="优秀策划项目案例" />
					<template v-if="rightTableList.length">
						<div class="list-box">
							<div
								class="list-item"
								v-for="(item, index) in rightTableList"
								:key="index"
								@click="showProjectDetail(item)"
							>
								<div class="label overflow-ellipsis" :title="item.name">
									{{ item.name }}
								</div>
								<div class="text" :title="item.text">{{ item.text }}</div>
							</div>
						</div>
					</template>
					<default-empty-container :height="'4.5rem'" v-else />
				</div>
			</div>
		</TitleBody>
	</el-dialog>
	<ProjectDetail ref="ProjectDetailRef" :data="projectDetail" />
</template>
<script setup lang="ts">
import { formatNumber } from '@/utils/index';
import ProjectDetail from '@/views/RecruitmentByProject/components/dialog.vue';
import { pieChartOption } from '../components/chartOptions';
import NumberValue from '../components/NumberValue.vue';

const ProjectDetailRef = ref<any>(null);
const dialogVisible = ref(false);
const topItemData = ref<any>({});
const rightTableList = ref<any[]>([]);
const planAnalysisData = ref<any[]>([]); // 产业项目策划分析数据
const pieChartOptionData = computed(() => {
	const data = [
		{
			name: '战略性产业集群项目',
			value: 0,
			unit: '个',
		},
		{
			name: '未来产业项目',
			value: 0,
			unit: '个',
		},
		{
			name: '现代服务业项目',
			value: 0,
			unit: '个',
		},
	];
	return pieChartOption(data);
});

const getRightTabData = () => {
	rightTableList.value = [];
};
const projectDetail = ref<any>({});

const showProjectDetail = (item: any) => {
	// 请求接口给projectDetail赋值
	ProjectDetailRef.value.show();
	console.log(item);
};
const show = () => {
	dialogVisible.value = true;
	getRightTabData();
};

defineExpose({ show });
</script>
<style scoped lang="less">
.plan-project-dialog {
	.top-statistics {
		height: 0.88rem;
		font-size: 0.14rem;
		margin-bottom: 0.16rem;
		.top-left {
			width: 4.27rem;
			height: 0.88rem;
			background: url('@/assets/images/runByEnterprise/left/arrow-bg.png') no-repeat left
				center;
			background-size: 100% 100%;
			padding: 0 0.48rem;
			line-height: 0.32rem;
			.top-left-label {
				color: #fff;
				font-weight: 500;
				text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
				width: 50%;
				margin-left: 0.1rem;
				.title {
					font-size: 0.16rem;
				}
				.num {
					font-family: @number-font;
					font-size: 0.24rem;
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
				padding-left: 0.73rem;
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
						width: 3rem;
						margin-top: 0.12rem;
						color: #666;
						gap: 0.64rem;
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
	.follow-overview {
		height: 5rem;
		.right-list {
			width: 58%;
			overflow-y: auto;
			padding-left: 0.18rem;
			.list-box {
				overflow-y: auto;
				display: flex;
				flex-wrap: wrap;
				gap: 0.1rem;
				.list-item {
					height: 0.9rem;
					width: calc(50% - 0.05rem);
					background: url('@/assets/images/runByEnterprise/left/project-bg.png') no-repeat
						left center;
					background-size: 100% 100%;
					margin-bottom: 0.13rem;
					padding: 0 0.18rem;
					cursor: pointer;
					.label {
						text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
						font-size: 0.18rem;
						color: #fff;
						font-weight: 500;
						height: 0.37rem;
						line-height: 0.37rem;
					}
					.text {
						height: 0.47rem;
						line-height: 0.47rem;
						color: #176bf9;
						font-size: 0.14rem;
					}
				}
			}
		}
	}
}
</style>
