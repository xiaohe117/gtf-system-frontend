// 招商任务--市直部门
<template>
	<div class="department fx-1">
		<div style="display: grid;">
			<small-title  title="产业招商项目汇总(产业体系)" style="justify-content: unset;margin-bottom: 0;">
			</small-title>
			<span class="tabParam-text small-right">{{ `(${tipsText})` }}</span>
		</div>
		<EnterpriseRank
			ref="EnterpriseRankRef"
			style="height: auto"
			:rankList="industryList"
			@changePage="handlePageChange"
			@sortChange="handleSort"
		/>
		<div class="grid-auto-1fr">
			<small-title title="招商项目全流程管理">
				<span class="tabParam-text">{{ `(${tipsText})` }}</span>
				<span
					class="tips-icon"
					@click="DescriptionDiaologRef?.show('招商项目全流程管理：', descriptionConent)"
				></span>
			</small-title>
		</div>
		<div class="left-right-chart">
			<ChartContainer :chart-option="leftRightBar" :key="domKey" />
		</div>
		<div class="desc">
			<div class="desc-left">项目数量（个）</div>
			<div class="desc-right">预计投资总额（亿元）</div>
		</div>
		<ListItem class="ov-y fx-h" :list="querySixBatchInfoDeptList"></ListItem>
	</div>
	<DescriptionDiaolog ref="DescriptionDiaologRef" />
</template>

<script lang="ts" setup>
import DescriptionDiaolog from '@/components/DescriptionDiaolog.vue';
import { rightLeftOption } from '@/views/OverallSituation/Right/chartOption';
import _statusStore from '@/stores/status';
import {
	querySixBatchInfoDept,
	queryDepProjectSummary,
} from '@/api/OverallSituation/RightModule/api';
import type { ProjectSummaryByDistrict } from '@/api/OverallSituation/RightModule/type';
import { getSize, isCurrentYear } from '@/utils';
import EnterpriseRank from '../components/EnterpriseRank.vue';
import ListItem from '../components/ListItem.vue';

const props = defineProps<{
	curStatus: number;
}>();

// ----------------------------当年值/年----------------------------
const statusStore = _statusStore();
const yearSelectValue = computed(() => statusStore.yearSelectValue);
const tipsText = computed<string>(() => (props.curStatus === 0 ? '累计值' : yearSelectValue.value));
// ----------------------------当年值/年----------------------------

// 招商任务-市直接部门-累计值/当年值
// const leftRightBar = ref(rightLeftOption());
const leftRightBar = ref({});
const DescriptionDiaologRef = ref<InstanceType<typeof DescriptionDiaolog> | null>(null);
const domKey = ref(Math.random());
const querySixBatchInfoDeptList = ref<ProjectSummaryByDistrict[]>([]);
const industryListData = ref<{ records?: any[]; total?: number }>({});
const EnterpriseRankRef = ref<InstanceType<typeof EnterpriseRank> | null>(null);
const otherParams = ref<Record<string, string>>({});
const descriptionConent = [
	{
		type: 'img',
		content: 'OverallSituation/dialog-con-bg.png',
	},
];
// 预览列表
// const prveiewList = ref(['投产', '开工', '落地', '注册', '签约', '在谈']);
const prveiewList = ref(['在谈', '签约', '注册', '落地', '开工', '投产']);

const industryList = computed(() => ({
	header: [
		{
			label: '序号',
			type: 'slot',
			slotName: 'index',
			width: getSize(75),
			align: 'center',
		},
		{
			label: '产业名称',
			prop: 'industry',
			align: 'left',
		},
		{
			label: '项目数量',
			prop: 'projectCount',
			sortable: true,
		},
		// // 当 curStatus 为 1 时添加 "11月新增" 列
		// ...(props.curStatus === 1 ? [
		//   {
		//     label: '11月新增',
		//     prop: 'newAddedCount', // 假设数据中有 newAddedCount 字段
		//   }
		// ] : []),
		{
			label: '预计投资总额(亿元)',
			prop: 'totalInvestment',
			sortable: true,
			width: getSize(120),
		},
	],
	listData: industryListData.value?.records || [],
	total: industryListData.value?.total || 0,
}));

function initChartOption() {
	const data = querySixBatchInfoDeptList.value;
	const xData: any = [];
	const data1: any = [];
	const data2: any = [];
	data.forEach((item) => {
		xData.push(item.projStage);
		data1.push(item.projSum);
		data2.push(item.totalInvest);
	});
	leftRightBar.value = rightLeftOption(xData, data1, data2);
}

// 2026年六个一批流程文案、数据转换
function transformProjData(sourceData: any[]): any[] {
  const stageOrder: string[] = [
    '线索',
    '在谈',
    '签约',
    '注册(备案)',
    '开工',
    '投产(开票)',
  ];
//   const stageMap: Record<string, string> = {
//     开工: '动工',
//   };
  const processedData = sourceData.map((item) => ({
    ...item,
    // projStage: stageMap[item.projStage] || item.projStage,
    projStage: item.projStage,
  }));

  const result = stageOrder.map((stage) => {
    const findItem = processedData.find((item) => item.projStage === stage);
    if (findItem) return findItem;
    return {
      settleDistrict: null,
      reportBatch: null,
      projStage: stage,
      projSum: null,
      totalInvest: '',
      revenueAtFull: null,
      unit: '亿元',
    } as any;
  });

  return result;
}
// 获取“六个一批”相关情况-市直部门
async function getQuerySixBatchInfoDept() {
	const params = { date: tipsText.value };
	let { data } = await querySixBatchInfoDept<ProjectSummaryByDistrict[]>(params);
	if (isCurrentYear(tipsText.value)) {
		// 当年值的六个一批流程文案
		prveiewList.value = ['线索', '在谈', '签约', '注册', '开工', '投产'];
		data = transformProjData(data); // TODO: 后端数据还没适配，适配后可删除该方法
	}else {
		prveiewList.value = ['在谈', '签约', '注册', '落地', '开工', '投产'];
	}
	// 需求返回data只显示prveiewList包含的数据,,用item.projStage 来判断是否相似,用正则匹配
	data = data.filter((item) => prveiewList.value.some((val) => item.projStage.match(val)));
	// 创建辅助函数，使用match方法查找索引
	const findIndexByMatch = (stage: string) => {
		for (let i = 0; i < prveiewList.value.length; i += 1) {
			if (stage.match(prveiewList.value[i])) {
				return i;
			}
		}
		return -1; // 如果没有匹配项，返回-1
	};
	// 需求data按照prveiewList数值顺序排序
	data = data.sort((a, b) => {
		const indexA = findIndexByMatch(a.projStage);
		const indexB = findIndexByMatch(b.projStage);
		return indexB - indexA;
	});

	querySixBatchInfoDeptList.value = data || [];
	initChartOption();
	domKey.value = Math.random();
}

// 获取招商项目数据列表
async function handlePageChange(params: { page: number; pageSize: number }) {
	// 示例：根据页码请求数据
	const { data } = await queryDepProjectSummary<any>({
		date: tipsText.value,
		queryRequest: {
			pageNum: params.page,
			pageSize: params.pageSize,
			...otherParams.value,
		},
	});
	industryListData.value = data;
}

// 切换排序
async function handleSort(params: { prop: string; direction: 'asc' | 'desc' }) {
	otherParams.value = {
		field: params.direction ? params.prop : '',
		order: params.direction,
	};
	EnterpriseRankRef.value?.handleCurrentChange(1);
}

watch(
	() => [tipsText.value, yearSelectValue.value],
	() => {
		getQuerySixBatchInfoDept();
		handlePageChange({ page: 1, pageSize: 5 });
		},
	{ immediate: true }
);
</script>

<style scoped lang="less">
.department {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	:deep(.small .right-box .title) {
		white-space: nowrap;
		font-size: @g-font-size-small;
	}
	.left-right-chart {
		height: 1.95rem;
	}
	.desc {
		margin-bottom: 0.12rem;
		font-size: @g-font-size-small;
		color: rgba(0, 0, 0, 0.65);
		display: flex;
		justify-content: space-between;
	}
	:deep(.rank-list-box) {
		.list-items {
			&.header {
				.list-common-item {
					&:nth-child(n + 3) {
						flex: 1;
					}
					&:nth-child(4) {
						line-height: 0.2rem;
					}
				}
			}
		}
	}
	:deep(.current-value) {
		.list-items {
			&.header {
				.list-common-item {
					&:nth-child(2) {
						flex: 1;
					}
					&:nth-child(3) {
						flex: 0.6;
					}
					&:nth-child(4) {
						flex: 0.6;
					}
					&:nth-child(n + 2) {
						line-height: 0.2rem;
					}
				}
			}
		}
	}
}

.grid-auto-1fr {
	display: grid;
	grid-template-columns: auto 1fr;
	// column-gap: 0.15rem;
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

:dee(.small-title .right-box .title) {
	padding-left: 0;
}

.tabParam-text {
	// margin-left: 0.08rem;
	font-weight: 500;
	font-size: 0.18rem;
	color: rgba(0, 0, 0, 0.65);
	line-height: 0.25rem;
	&.small {
		// font-size: 0.05rem;
	}
	&.small-right{
		text-align: right;
	}
}
</style>
