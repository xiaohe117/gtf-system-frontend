<template>
	<FrameBox size="small" style="width: 5.4rem; height: 9.35rem">
		<TitleBody name="招商项目策划概况" class="right-big-box">
			<template #extra>
				<RoundRectTabs v-model="projectTab" :tabsList="projectTypes"></RoundRectTabs>
			</template>
			<div class="topOne">
				<img
					class="topOne-jianto"
					src="@/assets/images/RecruitmentByProject/jianto.png"
					alt=""
				/>
				<div class="topOne-box">
					<img src="@/assets/images/RecruitmentByProject/one.png" alt="" />
					<div class="conm">
						<p>当前在跟招商策划项目（本月）</p>
						<div>
							<span> {{ projectTabData.followStaticVO.currentFollowingCount }}</span
							>&nbsp;&nbsp;&nbsp;&nbsp;个
						</div>
					</div>
					<div class="rigth">
						<span>新增</span>&nbsp;&nbsp;
						<div class="jdt">
							<div class="add" :style="'width: ' + widthPercentages.newWidth + '%'">
								<div class="popover">
									{{ projectTabData.followStaticVO.monthlyNewCount.toString() }}
								</div>
							</div>
							<div
								class="del"
								:style="'width: ' + widthPercentages.stoppedWidth + '%'"
							>
								<div class="popover">
									{{
										projectTabData.followStaticVO.monthlyStoppedCount.toString()
									}}
								</div>
							</div>
						</div>
						&nbsp;&nbsp;
						<span>结束</span>
					</div>
				</div>
			</div>
			<div class="topOne">
				<img
					class="topOne-jianto"
					src="@/assets/images/RecruitmentByProject/jianto.png"
					alt=""
				/>
				<div class="topOne-box">
					<img src="@/assets/images/RecruitmentByProject/tow.png" alt="" />
					<div class="conm">
						<p>招商策划项目转化（本年）</p>
						<div>
							转化&nbsp;&nbsp;&nbsp;
							<span> {{ projectTabData.convertedStaticVO.totalConvertedCount }}</span
							>&nbsp;&nbsp;&nbsp;个
						</div>
					</div>
					<div class="rigth">
						<span>转化</span>&nbsp;&nbsp;
						<div class="jdt">
							<div class="add" style="width: 60%">
								<div class="popover">
									{{
										projectTabData.convertedStaticVO.yearlyConvertedCount.toString()
									}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<TitleBox name="产业项目策划分析" />
			<ChartContainer :chartOption="pieOption" class="pie-chart" v-if="hasChartData" />
			<DefaultEmptyContainer height="2.75rem" v-else />
			<TitleBox name="优秀策划项目案例" />
			<DefaultEmptyContainer height="2.85rem" v-if="ProjectList.length === 0" />
			<div class="right-bottom-box fx-r fx-sp-b" v-else>
				<div
					class="right-bottom-rect"
					:class="{ 'c-pointer': index === 0 }"
					v-for="(item, index) in ProjectList"
					:key="index"
					@click="handleShowDialog(item)"
				>
					<div class="name text-ellipsis">{{ item.planProjName }}</div>
					<div class="arrow text-ellipsis">{{ item.planProjDesc }}</div>
				</div>
			</div>
		</TitleBody>
		<dialogForm ref="dialogRef" :data="ProjectInfo" />
	</FrameBox>
</template>

<script setup lang="ts">
import { getSize } from '@/utils';
import { ref, onMounted } from 'vue';
import {
	queryInvestProjectStatic,
	queryStatisticsByIndustry,
	queryOutstandingProjectList,
	queryProjectInfoById,
} from '@/api/RecruitmentByProject';

import TitleBox from '@/components/TitleBox.vue';

import ChartContainer from '@/components/ChartContainer.vue';
import dialogForm from './dialog.vue';
// import RoundRectTabs from './RoundRectTabs.vue';

// 顶部tab切换
const projectTab = ref(0);
const projectTypes = ['全市', '主抓'];
const projectTabData: any = ref({
	followStaticVO: {
		currentFollowingCount: '',
		monthlyNewCount: '0',
		monthlyStoppedCount: '0',
	},
	convertedStaticVO: {
		totalConvertedCount: '',
		yearlyConvertedCount: '0',
	},
});
const getqueryInvestProjectStatic = (category: any) => {
	queryInvestProjectStatic(category).then((res) => {
		const resData = res?.data;
		if (resData) {
			projectTabData.value = resData;
			console.log('测试：', projectTabData.value);
		}
	});
};
watch(
	() => projectTab.value,
	(newVal: any) => {
		getqueryInvestProjectStatic(newVal === 1 ? '1' : '');
	},
	{ immediate: true }
);
// echarts数据
const echartsData: any = ref({
	zlxProjectCount: '',
	wlProjectCount: '',
	xdFwProjectCount: '',
});
const getqueryStatisticsByIndustry = () => {
	queryStatisticsByIndustry({}).then((res) => {
		const resData = res?.data;
		if (resData) {
			console.log(resData, 'echarts数据');
			echartsData.value = resData;
		}
	});
};
getqueryStatisticsByIndustry();

// 优秀策划查询
const ProjectList: any = ref({});
const getqueryOutstandingProjectList = () => {
	queryOutstandingProjectList().then((res) => {
		const resData = res?.data;
		if (resData) {
			console.log(resData, '优秀策划项目列表');
			ProjectList.value = resData;
		}
	});
};
getqueryOutstandingProjectList();
// 优秀策划详情
const ProjectInfo: any = ref({});
const getqueryProjectInfoById = (id: any) => {
	queryProjectInfoById({ id }).then((res) => {
		const resData = res?.data;
		if (resData) {
			console.log('详情页数据', resData);
			ProjectInfo.value = resData;
		}
	});
};
const dialogRef = ref();
const handleShowDialog = (item: any) => {
	dialogRef.value?.show();
	getqueryProjectInfoById(item.id);
};
// 环形图配置
const pieOption = ref<any>({});
// 添加一个计算是否有图表数据的函数
const hasChartData = computed(() => {
	const { wlProjectCount, zlxProjectCount, xdFwProjectCount } = echartsData.value;

	// 检查每个值是否有效（不为null/undefined/空字符串）且不为0
	const hasValidData = [wlProjectCount, zlxProjectCount, xdFwProjectCount].some(
		(value) => value !== null && value !== undefined && value !== '' && value !== 0
	);

	return hasValidData;
});

const widthPercentages = computed(() => {
	const newCount = projectTabData.value.followStaticVO.monthlyNewCount;
	const stoppedCount = projectTabData.value.followStaticVO.monthlyStoppedCount;
	const total = newCount + stoppedCount;
	if (total === 0) {
		return { newWidth: 50, stoppedWidth: 50 };
	}
	return {
		newWidth: ((newCount / total) * 100).toFixed(2),
		stoppedWidth: ((stoppedCount / total) * 100).toFixed(2),
	};
});
onMounted(() => {
	setTimeout(() => {
		const data = [
			{ name: '未来产业项目', value: echartsData.value.wlProjectCount },
			{ name: '战略性产业集群项目', value: echartsData.value.zlxProjectCount },
			{ name: '现代服务业项目', value: echartsData.value.xdFwProjectCount },
		];

		const color2 = ['#b8a459', '#35b8d2', '#3e95f3'];

		const maxCircleData = data.map((item, index) => ({
			...item,
			itemStyle: {
				color: color2[index],
			},
		}));

		pieOption.value = {
			backgroundColor: 'transparent',
			textStyle: {
				color: '#000',
			},
			color: ['#FFB637', '#68EEFF', '#176BF9'],
			grid: {
				left: '0%',
				right: '50%',
				top: '0%',
				bottom: '0%',
				containLabel: true, // 强制标签在 grid 内
				confine: true, // 强制元素不超出容器
			},
			legend: {
				show: true,
				orient: 'vertical',
				right: '0%',
				icon: 'rect', // 关键修改：将圆形改为方块
				top: 'center',
				textStyle: {
					color: '#000',
					fontSize: getSize(18),
				},
				formatter: (name: any) => {
					const foundItem = data.find((d) => d.name === name);
					return `${name}  ${foundItem?.value || ''}`;
				},
				itemGap: 15,
				itemWidth: 10,
				itemHeight: 10,
			},
			series: [
				{
					silent: true,
					type: 'pie',
					center: ['38%', '50%'],
					padAngle: 2,
					radius: ['42%', '75%'],
					label: {
						show: false,
					},
					emphasis: {
						scale: true,
						scaleSize: 10,
						itemStyle: {
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 1)',
						},
					},

					labelLine: {
						show: true,
						length: 10, // 第一段线（饼图到转折点）
						length2: 20, // 第二段线（转折点到标签）
						smooth: true, // 平滑曲线
						lineStyle: {
							color: '#000',
							width: 1,
						},
						// 新增：动态调整引导线位置
						alignTo: 'edge', // 自动避开遮挡（ECharts 5+ 支持）
						minTurnAngle: 90, // 最小转折角度（避免重叠）
					},
					data: maxCircleData,
				},
				{
					type: 'pie',
					center: ['38%', '50%'],
					padAngle: 2,
					radius: ['52%', '75%'],
					label: {
						show: true,
						position: 'outside', // 固定标签位置
						alignTo: 'labelLine', // 标签与引导线对齐
						distanceToLabelLine: 0, // 标签与引导线的距离
						formatter: (params: any) => {
							const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
							const value = params.data?.value || 0;
							const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
							return `{labelBox|${percent}%}`;
						},
						color: '#111',
						fontFamily: 'DIN',
						rich: {
							labelBox: {
								padding: [4, 8],
								backgroundColor: '#e2e4f6',
								borderRadius: 4,
								fontSize: getSize(18),
							},
						},
						// 新增：调整标签位置和布局
						avoidLabelOverlap: true, // 自动避开标签重叠
						minMargin: 5, // 标签与饼图的最小间距
						edgeDistance: 10, // 标签与容器边缘的最小距离
					},
					labelLine: {
						show: true,
					},
					emphasis: {
						label: {
							show: true,
						},
						labelLine: {
							show: true,
						},
						scale: true,
						scaleSize: 10,
						itemStyle: {
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 0.1)',
						},
					},
					data,
				},
			],
			// tooltip: {
			// 	trigger: 'item',
			// 	formatter: '{b}: {c} ({d}%)', // 固定显示格式：名称: 值 (百分比)
			// 	position: [0, 0], // 固定显示位置（相对于图表容器左上角）
			// 	alwaysShowContent: false, // 只有鼠标悬停时才显示
			// 	backgroundColor: 'rgba(0,0,0,0.7)', // 固定背景色
			// 	borderColor: '#333', // 固定边框颜色
			// 	textStyle: {
			// 		color: '#fff', // 固定文字颜色
			// 		fontSize: 14, // 固定文字大小
			// 	},
			// 	extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);', // 固定阴影样式
			// },
			graphic: [
				{
					type: 'circle',
					z: 2,
					shape: {
						r: 43,
					},
					style: {
						fill: '#b0c6d7',
					},
					left: '28.5%',
					top: 'middle',
				},
			],
		};
	}, 500);
});
</script>

<style lang="less" scoped>
.pie-chart {
	height: 2.29rem;
	margin-top: 0.1rem;
	margin-left: -0.3rem;
	margin-bottom: 0.36rem;
	:deep(.echarts) {
		width: 100% !important;
		height: 100% !important;
	}
}

.right-bottom-box {
	flex-wrap: wrap;
	cursor: pointer;
	height: 2.72rem;
	overflow: auto;
}

.right-bottom-rect {
	width: 2.43rem;
	height: 0.91rem;
	background: url('@/assets/images/RecruitmentByProject/yiuxiu.png') no-repeat;
	background-size: contain;
	padding: 0 0.25rem;
	.name {
		font-weight: 500;
		font-size: @g-font-size-medium;
		color: #fff;
		margin: 0.05rem 0 0.18rem;
	}
	.arrow {
		height: 0.24rem;
		color: #347efa;
		font-size: @g-font-size-base;
	}
	.text-ellipsis {
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

:deep(.title-body-content) {
	display: flex;
	flex-direction: column;
}

//.right-big-box {
//	:deep(.title-body-content) {
//		padding: 0.1rem 0rem 0.15rem;
//	}
//}

:deep(.small-title) {
	margin-bottom: 0.16rem;
}

.topOne {
	width: 4.62rem;
	height: 0.62rem;
	position: relative;
	margin-bottom: 0.21rem;
	&-jianto {
		width: 4.17rem;
		position: absolute;
		bottom: 0;
	}
	&-box {
		display: flex;
		justify-content: space-between;
		position: absolute;
		img {
			width: 0.56rem;
			height: 0.56rem;
		}
		.conm {
			width: 2.05rem;
			font-size: @g-font-size-small;
			white-space: nowrap;
			color: #000;
			div {
				span {
					font-size: 0.26rem;
					color: #176bf9;
				}
			}
		}
		.rigth {
			width: 1.95rem;
			height: 0.48rem;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			color: #4b4b4b;
			font-size: @g-font-size-small;
			white-space: nowrap;
			margin-top: 0.2rem;
			margin-left: 0.4rem;
			.jdt {
				width: 1.17rem;
				height: 0.05rem;
				display: flex;
				.box-item {
					width: 0.43rem;
					height: 0.33rem;
					background-color: #000;
				}
				.add {
					background-color: #17ba7f;
					color: #17ba7f;
					height: 0.05rem;
					position: relative;
				}
				.del {
					background-color: #ff4d4f;
					color: #ff4d4f;
					border-radius: 0 0.68rem 0.68rem 0;
					height: 0.05rem;
					position: relative;
				}
				.popover {
					width: 0.43rem;
					height: 0.336rem;
					text-align: center;
					line-height: 0.3rem;
					position: absolute;
					bottom: 0.1rem;
					left: 50%;
					transform: translateX(-50%);
					background: url('@/assets/images/RecruitmentByProject/popover.png');
					background-size: cover;
				}
			}
		}
	}
}
</style>
