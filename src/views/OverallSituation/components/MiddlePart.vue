<template>
	<div class="midlle-part flex-y-between-stretch">
		<div class="top-box fx-r">
			<TitleBody name="企业风险" class="top-box1">
				<ChartContainer :chartOption="doughnutOption" class="bar-chart" />
			</TitleBody>
			<TitleBody name="企业经营" class="top-box2">
				<div class="flex-y-between" style="gap: 0.16rem">
					<div class="small-card-box">
						<div
							v-for="(d, i) in smallCardData"
							class="small-card flex-x-between"
							:class="{ active: smallCardActive === i }"
							:key="d.name"
							@click="handleSmallCardClick(i)"
						>
							<img :src="d.icon" :alt="d.name" /><span class="name">{{ d.name }}</span
							><span class="value">{{ d.value }}</span>
						</div>
					</div>
					<DynamicTable
						style="width: 100%"
						:tableData="tableData"
						:columns="columns"
            :max-height="'1.9rem'"
					></DynamicTable>
				</div>
			</TitleBody>
		</div>
		<TitleBody name="企业招商记录" class="bottom-big-box">
			<el-scrollbar height="auto">
				<div class="fx-r bottom-box">
					<div v-for="(d, i) in cardData" :key="i" class="card">
						<div class="card-inner">
							<div class="top flex-y-start">
								<div class="w100 flex-x-between">
									<div class="flex-x-start icon-txt">
										<img src="@/assets/images/gtf/date.png" alt="" />
										<span>{{ d.date }}</span>
									</div>
									<div class="flex-x-start icon-txt">
										<img src="@/assets/images/gtf/locate.png" alt="" />
										<span
											:title="d.locate"
											class="over-ellipsis"
											style="width: 8em"
											>{{ d.locate }}</span
										>
									</div>
								</div>
								<div class="w100">
									<div class="name flex-x-center">
										{{ d.name }}
									</div>
								</div>
								<div :title="d.title" class="title over-ellipsis">
									{{ d.title }}
								</div>
								<div :title="d.content" class="content">{{ d.content }}</div>
							</div>
							<el-divider />
							<div class="bottom w100 flex-y-between-stretch">
								<div class="flex-x-start award">
									<img src="@/assets/images/gtf/award.png" alt="" />
									<span>成果归档</span>
								</div>
								<ul class="award-list">
									<li v-for="aw in d.awardList" :key="aw">{{ aw }}</li>
								</ul>
								<div v-if="false" class="checkDetail flex-x-end">
									<span>查看详情&nbsp;&nbsp;&nbsp;&gt;</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</TitleBody>
	</div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { useRoute } from 'vue-router';
import qygd from '@/assets/images/gtf/qygd.png';
import qyrz from '@/assets/images/gtf/qyrz.png';
import gysxx from '@/assets/images/gtf/gysxx.png';
import zykh from '@/assets/images/gtf/zykh.png';
import { getExcelData } from '@/views/ToufawOverview/data';
import { pieChartOption } from './chartOption';
import {entRiskData, entList, cardColumns1, cardColumns2, cardColumns3, cardColumns4} from './data';

const smallCardData = ref([
	{
		name: '企业购地',
		icon: qygd,
		value: 12,
	},
	{
		name: '企业融资',
		icon: qyrz,
		value: 82,
	},
	{
		name: '供应商信息',
		icon: gysxx,
		value: 120,
	},
	{
		name: '主要客户',
		icon: zykh,
		value: 72,
	},
]);
const smallCardActive = ref(0);
const tableData = ref<any>([]);
const columns = computed(() => {
  const columnMap = [cardColumns1, cardColumns2, cardColumns3, cardColumns4];
  return columnMap[smallCardActive.value] || [];
});

const dataInfo = ref<any>({});
const entName = ref<any>('')
const route = useRoute();
const handleSmallCardClick = (index: number)=> {
  smallCardActive.value = index;
  const dataKeys = ['qygdData', 'qyrzData', 'gysData', 'zykhData'];
  tableData.value = dataInfo.value?.[dataKeys[index]];
}
const getEntInfo = () => {
  const entInfo= entList.filter(item => item.entName === entName.value)?.[0]?.entInfo ?? {}
  smallCardData.value[0].value = entInfo?.qygdData?.length;
  smallCardData.value[1].value = entInfo?.qyrzData?.length;
  smallCardData.value[2].value = entInfo?.gysData?.length;
  smallCardData.value[3].value = entInfo?.zykhData?.length;
  dataInfo.value = entInfo;
  handleSmallCardClick(0)
};

const doughnutOption = ref({});
function loadDoughnutOption() {
	const riskData = entRiskData?.find(
		(item: any) => item.entName === entName.value
	)?.riskData;
	if (!riskData) return;
	const chartData = riskData.map((el: any) => ({
		name: el.label,
		value: el.count,
		// percent: el.percent,
	}));
	setTimeout(() => {
		doughnutOption.value = pieChartOption(chartData);
	}, 500);
}

const cardData = ref<any[]>([]);
function loadEnterpriseInvestmentRecord() {
	getExcelData('./excel/enterpriseInvestmentRecord.xlsx').then((res: any) => {
		cardData.value = res.slice(0, -1).map((d: any) => ({
			...d,
			date: moment(d.date, 'YYYY年M月').format('YYYY/MM/DD'),
			awardList: ['意向签约企业5家', '发放招商手册100份'],
		}));
	});
}

onMounted(() => {

});
watch(
    () => route.query.name,
    () => {
      entName.value = route.query.name
      getEntInfo();
      loadDoughnutOption();
      loadEnterpriseInvestmentRecord();
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.midlle-part {
	width: 8.63rem;
	height: 8.12rem;
	background: linear-gradient(315deg, rgba(27, 77, 244, 0.04) 0%, rgba(93, 201, 252, 0.04) 100%);
	border-radius: 0.12rem;
	border: 0.01rem solid rgba(27, 77, 244, 0.3);
	padding: 0.16rem;
	margin-right: 0.24rem;
}
.top-box {
	justify-content: space-between;
}
.top-box1 {
	:deep(&.title-container) {
		width: 3.58rem;
	}
}
.top-box2 {
	:deep(&.title-container) {
		width: 4.73rem;
	}
}
.bar-chart {
	width: 3.58rem;
	height: 3.38rem;
}

.small-card-box {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	row-gap: 0.12rem;

	.small-card {
		width: 2.28rem;
		border-radius: 0.08rem;
		background: rgba(169, 181, 255, 0.1);
		padding: 0.12rem 0.14rem;
		// box-sizing: content-box;
		border: 0.01rem solid #ffffff;
		cursor: pointer;

		&.active {
			background:
				linear-gradient(318deg, #1b4df4 0%, #5dc9fc 100%),
				linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 95, 243, 0.3) 100%);

			.value {
				color: #fff;
			}
		}

		img {
			width: 0.36rem;
		}

		.name {
			flex: 1;
			color: #333;
			margin: 0 0.11rem;
		}

		.value {
			background-image: linear-gradient(
				180deg,
				rgba(79, 152, 255, 1) 0,
				rgba(25, 54, 169, 1) 100%
			);
			color: transparent;
			background-clip: text;
			font-size: 0.18rem;
			font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
		}
	}
}

.card {
	width: 2.72rem;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	// box-sizing: content-box;
	padding: 0.12rem 0.16rem 0.16rem;

	.top {
		.icon-txt {
			font-weight: 400;
			font-size: 0.12rem;
			color: rgba(0, 0, 0, 0.45);
			gap: 0.08rem;

			img {
				width: 0.12rem;
			}
		}

		.name {
			width: 0.76rem;
			height: 0.22rem;
			background: rgba(27, 77, 244, 0.1);
			border-radius: 0.02rem;
			border: 0.01rem solid rgba(27, 77, 244, 0.24);
			font-weight: 400;
			font-size: 0.12rem;
			color: #1b4df4;
			margin: 0.07rem 0 0.17rem 0;
		}

		.title {
			font-weight: 600;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.85);
		}

		.content {
			// width: 2.72rem;
			font-weight: 400;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.65);
			margin: 0.08rem 0 0.12rem 0;
			height: 0.8rem;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 4; // 控制最多显示几行
			-webkit-box-orient: vertical;
		}
	}

	.el-divider {
		border-color: rgba(27, 77, 244, 0.24);
		margin: 0 0 0.11rem;
	}

	.bottom {
		.award {
			margin-bottom: 0.08rem;
			gap: 0.07rem;

			img {
				width: 0.16rem;
			}

			span {
				font-weight: 500;
				font-size: 0.14rem;
				color: rgba(0, 0, 0, 0.85);
			}
		}
		.award-list {
			padding-left: 0.16rem;
			li {
				font-weight: 400;
				font-size: 0.14rem;
				color: rgba(0, 0, 0, 0.65);
				position: relative;
				&::before {
					position: absolute;
					content: '';
					width: 0.06rem;
					height: 0.06rem;
					background: #1b4df4;
					top: 0.07rem;
					left: -0.12rem;
					border-radius: 50%;
				}
			}
		}

		.checkDetail {
			// margin-top: 0.29rem;
			font-weight: 400;
			font-size: 0.14rem;
			color: #3a73de;
			cursor: pointer;
		}
	}
}
.bottom-big-box {
  margin-top: 0.24rem;
	:deep(.title-body-content) {
		height: 2.98rem;
	}
}
.bottom-box {
	width: 100%;
	column-gap: 0.08rem;
}
</style>
