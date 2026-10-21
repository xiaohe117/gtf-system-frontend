// 招商任务--各区-累计值
<template>
	<div class="district">
		<div class="grid-auto-1fr">
			<small-title title="招商项目全流程管理"> </small-title>
			<span class="tabParam-text">{{ `(${tipsText})` }}</span>
			<span
				class="tips-icon"
				@click="DescriptionDiaologRef?.show('招商项目全流程管理：', descriptionConent)"
			></span>
		</div>
		<div class="area-tab">
			<div
				class="area-item"
				v-for="(item, index) in areaList"
				:key="index"
				:class="{ 'select-area': index === activeArea }"
				@click="handleArea(index)"
			>
				{{ item }}
			</div>
		</div>
		<div class="title-text">各区项目数汇总</div>
		<div class="bar-chart">
			<ChartContainer :chartOption="barOption" :key="ChartContainerKey" />
		</div>
		<!-- <div class="title-text">各区预计投资总额汇总</div> -->

		<div class="grad-auto-auto" v-if="true">
			<div class="title-text">各区预计投资总额汇总</div>
			<div class="icon-bnt" @click="navToWorkStaticListPage">查看详情</div>
			<!-- <img :src="getUrl('OverallSituation/navToOrtherPage-btn.png')" class="icon-bnt" @click="navToWorkStaticListPage"/> -->
		</div>
		<custom-list
			:rightTableList="rightTableList"
			:customLegend="customLegend"
			:maxTableValue="maxTableValue"
		/>
	</div>

	<DescriptionDiaolog ref="DescriptionDiaologRef" />
</template>

<script lang="ts" setup>
import _statusStore from '@/stores/status';
import { getBarOption } from '@/views/OverallSituation/Right/chartOption';
import CustomList from '@/views/OverallSituation/Right/components/CustomList.vue';
import { querySixBatchInfoDistrict } from '@/api/OverallSituation/RightModule/api';
import type { ProjectSummaryData } from '@/api/OverallSituation/RightModule/type';
import DescriptionDiaolog from '@/components/DescriptionDiaolog.vue';
import ServiceUrl from '@/utils/url';
// import {getUrl} from "@/utils"

const props = defineProps<{
	curStatus: number;
}>();

// ----------------------------当年值/年----------------------------
const statusStore = _statusStore();
const yearSelectValue = computed(() => statusStore.yearSelectValue);
const tipsText = computed<string>(() => (props.curStatus === 0 ? '累计值' : yearSelectValue.value));
// ----------------------------当年值/年----------------------------

/**
 * 项目汇总数据字段索引枚举（按 ProjectSummaryData 字段声明顺序）
 */
//  enum ProjectSummaryIndex {
//   talking,               // 0 → 再谈
//   commenceWork,          // 1 → 签约
//   putIntoProduction,     // 2 → 注册
//   register,              // 3 → 开工
//   signContract,          // 4 → 投产
// }
const DescriptionDiaologRef = ref<InstanceType<typeof DescriptionDiaolog> | null>(null);
const descriptionConent = [
	{
		type: 'img',
		content: 'OverallSituation/dialog-con-bg.png',
	},
];

const PROJECT_SUMMARY_KEYS = [
	'talking', // 0 - 在谈
	'signContract', // 1 - 签约 （注意：你 areaList 第2项是“签约”）
	'register', // 2 - 注册
	'land', // 3 - 落地
	'commenceWork', // 3 - 开工 （你 areaList 第5项是“开工”）
	'putIntoProduction', // 4 - 投产
	// 注意：你的 areaList 有 6 项，但 ProjectSummaryData 可能有更多？
];

const areaList = ref<any>(['在谈', '签约', '注册\n(备案)', '落地', '开工', '投产\n(开票)']);
const activeArea = ref<number>(2);

const barOption = ref({});
const rightTableList = ref<any[]>([]);
const maxTableValue = ref<number>(0);
const ChartContainerKey = ref<number>(0); // 用于强制刷新图表组件
/**
 * 累计值-各区-模块数据
 */
const querySixBatchInfoDeptList = ref<ProjectSummaryData | undefined>();

const customLegend = computed(() => [
	{
		label: '跟进有接洽企业',
		prop: 'totalInvest',
		color: '#1EB092',
	},
]);
// 六个一批相关情况
const getBarData = () => {
	//   const xData = ['天河', '越秀', '荔湾','海珠','白云','黄埔','南沙','番禺','增城','花都','从化'];
	//   const data = [
	//   { name: '目标数', data: [309, 117, 4,349, 117, 4,349, 117, 4, 117, 4].sort(() => Math.random() - 0.5), color: '#3489FF' },
	// ];

	if (!querySixBatchInfoDeptList.value) return;
	const curStatus = PROJECT_SUMMARY_KEYS[activeArea.value] as keyof ProjectSummaryData;
	const xData: any = [];
	const data: any = [{ name: '项目数', data: [], color: '#3489FF' }];

	querySixBatchInfoDeptList.value[curStatus]
		.sort((a, b) => b.projSum - a.projSum)
		.forEach((item) => {
			if (item.settleDistrict === '总计') return;
			xData.push(item.settleDistrict);
			data[0].data.push(item.projSum);
		});

	barOption.value = getBarOption(xData, data, 1);
	ChartContainerKey.value += 1;
};

/**
 * 预计总额汇总
 */
const getRightTabData = () => {
	// let data: any = [];
	// data = [
	//   {
	//     concatCompanyCount: 12, // 跟进有接洽企业数
	//     followCompanyCount: 20, // 跟进企业数
	//     waitFollowCompanyCount: 30,
	//     name: '天河区',
	//   },
	//   {
	//     concatCompanyCount: 11, // 跟进有接洽企业数
	//     followCompanyCount: 4, // 跟进企业数
	//     waitFollowCompanyCount: 27,
	//     name: '海珠区',
	//   },
	//   {
	//     concatCompanyCount: 12, // 跟进有接洽企业数
	//     followCompanyCount: 0, // 跟进企业数
	//     waitFollowCompanyCount: 26,
	//     name: '白云区',
	//   },
	//   {
	//     concatCompanyCount: 12, // 跟进有接洽企业数
	//     followCompanyCount: 29, // 跟进企业数
	//     waitFollowCompanyCount: 15,
	//     name: '番禺区',
	//   },
	//   {
	//     concatCompanyCount: 8, // 跟进有接洽企业数
	//     followCompanyCount: 25, // 跟进企业数
	//     waitFollowCompanyCount: 13,
	//     name: '黄埔区',
	//   },
	//   {
	//     concatCompanyCount: 4, // 跟进有接洽企业数
	//     followCompanyCount: 3, // 跟进企业数
	//     waitFollowCompanyCount: 12,
	//     name: '南沙区',
	//   },
	//   {
	//     concatCompanyCount: 5, // 跟进有接洽企业数
	//     followCompanyCount: 18, // 跟进企业数
	//     waitFollowCompanyCount: 8,
	//     name: '越秀区',
	//   },
	//   {
	//     concatCompanyCount: 8, // 跟进有接洽企业数
	//     followCompanyCount: 14, // 跟进企业数
	//     waitFollowCompanyCount: 5,
	//     name: '从化区',
	//   },
	//   {
	//     concatCompanyCount: 5, // 跟进有接洽企业数
	//     followCompanyCount: 12, // 跟进企业数
	//     waitFollowCompanyCount: 4,
	//     name: '增城区',
	//   },
	//   {
	//     concatCompanyCount: 8, // 跟进有接洽企业数
	//     followCompanyCount: 4, // 跟进企业数
	//     waitFollowCompanyCount: 3,
	//     name: '海珠区',
	//   },
	//   {
	//     concatCompanyCount: 1, // 跟进有接洽企业数
	//     followCompanyCount: 4, // 跟进企业数
	//     waitFollowCompanyCount: 2,
	//     name: '花都区',
	//   },
	// ].sort(() => Math.random() - 0.5);
	// // data = data.sort(
	// //     (a: any, b: any) =>
	// //         b.followCompanyCount +
	// //         b.concatCompanyCount -
	// //         (a.followCompanyCount + a.concatCompanyCount)
	// // );
	// data = data.sort((a: any, b: any) => b.followCompanyCount - a.followCompanyCount);

	// rightTableList.value = data;

	// let maxValue: any = 0;
	// customLegend.value.forEach((item: any) => {
	//   maxValue += Math.max(...rightTableList.value.map((list: any) => list[item.prop]));
	// });
	// maxTableValue.value = maxValue;

	if (!querySixBatchInfoDeptList.value) return;
	let data =
		querySixBatchInfoDeptList.value[
			PROJECT_SUMMARY_KEYS[activeArea.value] as keyof ProjectSummaryData
		];
	data = data
		.sort((a: any, b: any) => b[customLegend.value[0].prop] - a[customLegend.value[0].prop])
		.filter((item: any) => item.settleDistrict !== '总计');

	rightTableList.value = data;
	let maxValue: any = 0;
	customLegend.value.forEach((item: any) => {
		maxValue += Math.max(...rightTableList.value.map((list: any) => list[item.prop]));
	});
	maxTableValue.value = maxValue;
};
const handleArea = (index: any) => {
	activeArea.value = index;
	nextTick(() => {
		getBarData();
		getRightTabData();
	});
};

/**
 * 获取-累计值-各区-模块数据
 */
async function getqQuerySixBatchInfoDept() {
	// 后端接口会返回一个总计的数据项，需要在前端过滤掉
	const dateStr = Array.isArray(yearSelectValue.value)
		? yearSelectValue.value.join('')
		: yearSelectValue.value;
	const params = { date: dateStr };
	const { data } = await querySixBatchInfoDistrict<ProjectSummaryData>(params);
	querySixBatchInfoDeptList.value = data;
	getBarData();
	getRightTabData();
}

function navToWorkStaticListPage() {
	window.open(`${ServiceUrl.getQmSysUrl()}/pc/index/components/workStaticList`, '_blank');
}

watch(
	() => yearSelectValue.value,
	() => {
		getqQuerySixBatchInfoDept();
	},
	{ immediate: true }
);
</script>

<style scoped lang="less">
.district {
	.area-tab {
		display: flex;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-base;
		color: #999999;
		.area-item {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			height: 0.5rem;
			text-align: center;
			line-height: 0.25rem;
			background: linear-gradient(180deg, #e8f4ff 0%, #b8d8ff 100%);
			opacity: 0.8;
			-webkit-backdrop-filter: blur(0.1rem);
			backdrop-filter: blur(0.1rem);
			cursor: pointer;
			position: relative;
			&:nth-of-type(3),
			&:last-of-type {
				line-height: 0.2rem;
				white-space: pre-line;
			}
			&.select-area {
				color: #333;
				border-bottom: 0.04rem solid #3489ff;
				font-weight: 500;
				opacity: 1;
			}
			&:not(:last-child)::before {
				position: absolute;
				content: '';
				width: 0.01rem;
				height: 0.16rem;
				background: #a7c7ff;
				opacity: 0.9;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				backdrop-filter: blur(0.1rem);
			}
		}
	}
	.title-text {
		text-align: left;
		font-weight: 600;
		font-size: @g-font-size-medium;
		color: rgba(0, 0, 0, 0.88);
		line-height: 0.28rem;
		margin: 0.1rem 0;
	}
	.bar-chart {
		height: 2.25rem;
	}

	.grid-auto-1fr {
		margin-bottom: 0.2rem;
		display: grid;
		grid-template-columns: repeat(3, max-content);
		align-items: center;
		.tips-icon {
			cursor: pointer;
			margin-left: 0.1rem;
			display: inline-block;
			width: 0.2rem;
			height: 0.2rem;
			background-image: url('@/assets/images/OverallSituation/tips-icon.png');
			background-size: 100% 100%;
		}
	}
	:deep(.small-title) {
		margin-bottom: 0;
	}

	.grad-auto-auto {
		display: flex;
		column-gap: 0.15rem;
		align-items: center;
		.title-text {
			margin: 0.1rem 0;
		}
	}
	.icon-bnt {
		cursor: pointer;
		line-height: 0.4rem;
		width: 1rem;
		text-align: left;
		padding-left: 0.12rem;
		background-image: url('@/assets/images/home/btn-gb-icon.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #5392f7;
		font-size: 0.15rem;
		font-weight: bold;
	}
	.tabParam-text {
		margin-left: 0.08rem;
		font-weight: 500;
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.25rem;
	}
}
</style>
