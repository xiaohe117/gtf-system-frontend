<!--
 * @Descripttion: 整体概况右侧
 * @Author: lj
 * @Date: 2025-08-12 9:58:31
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-06 16:29:22
-->
<template>
<div class="main">
	<!-- <div class="bossBut">
	
		<el-button class="bossBut-item bossBut-left" @click="goBossDashboard">领导看板设计稿1</el-button>
		<el-button class="bossBut-item bossBut-right" @click="goBossDashboardTwo">领导看板设计稿2</el-button>
	</div> -->
	<div
		class="right-container flex-y-start-start"
		:class="{ 'right-L': activeTitle === 1, 'right-R': activeTitle === 2 }"
	>
		<div class="title-box">
			<template v-if="activeTitle === 1">
				<TitleBody
					name="招商任务"
					class="title-left"
					@click="handleTitleTab(1)"
				></TitleBody>
				<div class="grey-title p-left" @click="handleTitleTab(2)">招商调度</div>
			</template>
			<template v-else>
				<div class="grey-title" @click="handleTitleTab(1)">招商任务</div>
				<TitleBody
					name="招商调度"
					class="title-right"
					@click="handleTitleTab(2)"
				></TitleBody>
			</template>
		</div>
		<div class="content-box fx-1">
			<RoundRectTabs v-model="typeTab" :tabsList="tabsList" @change="handleTypeTab" style="width: auto;"/>
			<!--      招商任务-->
			<template v-if="activeTitle === 1">
				<!--  招商任务-各区- 累计值-->
				<template v-if="typeTab === 0">
					<template v-if="curStatus === 0">
						<DistrictAccumulate :cur-status="curStatus" v-bind="$attrs" />
					</template>
					<!--  招商任务-各区- 当年值-->
					<template v-else>
						<div style="display: grid">
							<small-title
								title="招商任务完成率汇总"
								style="justify-content: unset; margin-bottom: 0"
							>
								<span class="tabParam-text">{{ `(${tipsText})` }}</span>
								<!-- 占用位置 -->
								<div></div>
							</small-title>
							<el-select
								v-model="projectType"
								placeholder="请选择"
								style="justify-self: flex-end"
							>
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
						<template v-if="projectType === 2">
							<div class="title-text">新引进、10亿+项目、央企项目</div>
							<div class="chart-box">
								<chart-container :chart-option="barThreeOption" />
							</div>
							<div class="title-text">100亿+项目</div>
							<MultiHeaderTable
								class="table-box"
								:tableData="tableData"
								:columns="columns"
								height="100%"
								:hasOrder="false"
							>
								<!-- <template #companyName="{ row }">
									<div class="company-name">
										{{ row.companyName }}
									</div>
								</template> -->
							</MultiHeaderTable>
						</template>
						<custom-list
							v-else
							class="summary-list"
							:isShowScale="false"
							:rightTableList="summaryList"
							:customLegend="summaryLegend"
							:maxTableValue="maxSummaryValue"
						/>

						<div style="display: grid">
							<small-title
								title="招商项目全流程管理"
								style="margin-bottom: 0; justify-content: unset"
							>
								<span class="tabParam-text">{{ `(${tipsText})` }}</span>
								<span
									class="tips-icon"
									@click="
										DescriptionDiaologRef?.show(
											'招商项目全流程管理：',
											descriptionConent
										)
									"
								></span>
							</small-title>
							<el-select
									class="areaSelect"
									v-model="selectArea"
									placeholder="请选择"
									style="justify-self: flex-end; margin-bottom: 0.1rem"
								>
								<el-option
									v-for="item in districtList"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
						<ListItem :list="sixBatchInfoDistrictNowPreViewList"></ListItem>
					</template>
				</template>
				<template v-else>
					<!--   招商任务--累计值/当年值-市直部门-->
					<Department v-bind="$attrs" :cur-status="curStatus"></Department>
				</template>
			</template>
			<template v-else>
				<!--          // 招商调度-->
				<DispatchList :typeTab="typeTab"></DispatchList>
			</template>
		</div>
	</div>
</div>

	<DescriptionDiaolog ref="DescriptionDiaologRef" />
</template>
<script lang="ts" setup>
// import { getSize } from '@/utils';
import type {
	QueryAttractionCompletionRate,
	ProjectSummaryByDistrict,
	DistrictProjectData,
	TenbillionProjectTableVo,
} from '@/api/OverallSituation/RightModule/type';
import {
	queryAttractionCompletionRate,
	querySixBatchInfoDistrictNow,
	queryTenbillionCompletionRate,
} from '@/api/OverallSituation/RightModule/api';
import _statusStore from '@/stores/status';
import { isCurrentYear } from '@/utils';
import DescriptionDiaolog from '@/components/DescriptionDiaolog.vue';
import SmallTitle from '@/components/SmallTitle.vue';
import DispatchList from '@/views/OverallSituation/Right/DispatchList.vue';
import CustomList from '@/views/OverallSituation/Right/components/CustomList.vue';
import DistrictAccumulate from '@/views/OverallSituation/Right/InvestmentTask/DistrictAccumulate.vue';
import Department from '@/views/OverallSituation/Right/InvestmentTask/Department.vue';
import ListItem from './components/ListItem.vue';
import { getBarOption } from './chartOption';

const DescriptionDiaologRef = ref<InstanceType<typeof DescriptionDiaolog> | null>(null);
const descriptionConent = [
	{
		type: 'img',
		content: 'OverallSituation/dialog-con-bg.png',
	},
];

/**
 * 0-累计值 1-当年值
 */
const props = withDefaults(
	defineProps<{
		curStatus: number;
	}>(),
	{
		curStatus: 1,
	}
);

// ----------------------------当年值/年----------------------------
const statusStore = _statusStore();
const yearSelectValue = computed(() => statusStore.yearSelectValue);
const tipsText = computed<string>(() => (props.curStatus === 0 ? '累计值' : yearSelectValue.value));
// ----------------------------当年值/年----------------------------

/**
 * 1-招商任务 2-招商调度
 */
const activeTitle = ref<1 | 2>(1);
/**
 * 0-各区 1-市直部门/招商主建
 */
const typeTab = ref<any>(0);
const tabsList = computed(() =>
	activeTitle.value === 2 ? ['招商主战', '招商主建'] : ['各区', '市直部门']
);

// 招商任务-各区--当年值
// const cardData = ref<any>([
// 	{
// 		color: '#FFB637FF',
// 		title: '在谈',
// 		num: 307,
// 	},
// 	{
// 		color: '#FE793BFF',
// 		title: '签约',
// 		num: 307,
// 	},
// 	{
// 		color: '#51E1C4FF',
// 		title: '注册(备案)',
// 		num: 307,
// 	},
// 	{
// 		color: '#1EB092FF',
// 		title: '落地',
// 		num: 307,
// 	},
// 	{
// 		color: '#408FFFFF',
// 		title: '开工',
// 		num: 307,
// 	},
// 	{
// 		color: '#37D9FEFF',
// 		title: '投产(开票)',
// 		num: 307,
// 	},
// ]);
const projectType = ref(3);
/**
 * 获取招商任务-各区-当年值-汇总数据
 */
const queryAttractionCompletionRateList = ref<QueryAttractionCompletionRate[]>([]);
/**
 * 当年值-各区-六个一批相关情况
 */
const querySixBatchInfoDistrictNowList = ref<DistrictProjectData>({});

const options = ref([
	{ value: 3, label: '新签约产业项目预计投资总额' },
	{ value: 0, label: '新签约产业项目' },
	{ value: 1, label: '年产业招商项目入统备案(注册)金额' },
	{ value: 2, label: '新注册(备案)高质量产业招商项目' },
]);
const selectArea = ref('');
const areaMap = {
  panyu: '番禺',
  nansha: '南沙',
  zengcheng: '增城',
  conghua: '从化',
  huadu: '花都',
  tianhe: '天河',
  haizhu: '海珠',
  baiyun: '白云',
  yuexiu: '越秀',
  huangpu: '黄埔',
  liwan: '荔湾'
};
const barThreeOption = ref({});
const summaryList = ref<any[]>([]);
const maxSummaryValue = ref<number>(0);
const summaryLegend = computed(() => {
	switch (projectType.value) {
		case 1:
			return [
				{
					label: '年产业招商项目入统备案(注册)金额',
					prop: 'registeredAmount',
					color: '#1EB092',
				},
				{
					label: '完成率',
					prop: 'registeredCompletionRate',
					color: '#d5ebe7',
				},
			];
			case 3:
				return [
					{
						label: '新签约产业项目预计投资总额',
						prop: 'newlySignedIndustrialProjSum',
						color: '#5B8FF9FF',
						code: '3_1'
					},
					{
						label: '完成率',
						prop: 'newlySignedIndustrialProRate',
						color: '#dde7fc',
					},
				];
		default:
			return [
				{
					label: '新签约产业项目',
					prop: 'signedProjSum',
					color: '#5B8FF9FF',
				},

				{
					label: '完成率',
					prop: 'signedCompletionRate',
					color: '#dde7fc',
				},
			];
	}
});

// 获取柱状图数据
const getBarData = () => {
	// const xData = [
	// 	'天河',
	// 	'越秀',
	// 	'荔湾',
	// 	'海珠',
	// 	'白云',
	// 	'黄埔',
	// 	'南沙',
	// 	'番禺',
	// 	'增城',
	// 	'花都',
	// 	'从化',
	// ];
	const list = queryAttractionCompletionRateList.value;

	// 根据选择的项目类型，提取对应的数据
	function getData(key: keyof QueryAttractionCompletionRate) {
		const ratekey: any = {
			highQualityProjSum: 'highQualityCompletionRate',
			billionProjSum: 'billionCompletionRate',
			stateOwnedProjSum: 'stateOwnedCompletionRate',
		};

		const getRatekey = ratekey[key];
		return list.map((item) => ({
			value: item[key],
			rate: item[getRatekey as keyof QueryAttractionCompletionRate],
		}));
	}

	const data = [
		{
			name: '新引进项目',
			data: getData('highQualityProjSum'),
			color: '#408FFF',
		},
		{ name: '10亿+项目', data: getData('billionProjSum'), color: '#FFB637' },
		{ name: '央企项目', data: getData('stateOwnedProjSum'), color: '#51E1C4' },
		// { name: '开工', data: [0, 0, 0], color: '#FE793B' },
		// { name: '投产', data: [0, 0, 0], color: '#1EB092' },
		// { name: '纳税', data: [0, 0, 0], color: '#37D9FE' },
	];

	// console.log("list",list);
	const xData = list.map((item) => item.settleDistrict);

	barThreeOption.value = getBarOption(xData, data);
	console.log('barThreeOption', barThreeOption.value);
};
console.log(props.curStatus);
const getSummaryData = async () => {
	let data = queryAttractionCompletionRateList.value;
	data = data.sort(
		(a: any, b: any) => b[summaryLegend.value[0].prop] - a[summaryLegend.value[0].prop]
	);

	summaryList.value = data;

	let maxValue: any = 0;
	summaryLegend.value.forEach((item: any) => {
		maxValue += Math.max(...summaryList.value.map((list: any) => list[item.prop]));
	});
	console.log('summaryList', summaryList);

	maxSummaryValue.value = maxValue;
};
const tableData = ref([]);
const columns = ref([]);
// const columns = computed(() => {
// 	const arr = [
// 		{
// 			prop: 'companyName',
// 			label: '100亿+项目',
// 			align: 'left',
// 			type: 'slot',
// 			slotName: 'companyName',
// 			showToolTip: true,
// 		},
// 		{
// 			prop: 'industryName',
// 			label: '海珠',
// 			align: 'left',
// 			showToolTip: true,
// 			width: getSize(120),
// 		},
// 		{
// 			prop: '项目名称',
// 			label: '项目名称',
// 			align: 'left',
// 			showToolTip: true,
// 			width: getSize(120),
// 		},
// 		{
// 			prop: 'superDept',
// 			label: '跟进部门（区）',
// 			align: 'left',
// 			showToolTip: true,
// 			width: getSize(120),
// 		},
// 		{
// 			prop: 'hasPlan',
// 			label: '是否已对接',
// 			align: 'left',
// 			showToolTip: true,
// 			showType: ['1'],
// 			type: 'slot',
// 			slotName: 'isFollow',
// 			width: getSize(120),
// 		},
// 	];
// 	return arr;
// });
// 切换标题
const handleTitleTab = (index: 1 | 2) => {
	activeTitle.value = index;
	typeTab.value = 0;
};
const handleTypeTab = (index: number) => {
	typeTab.value = index;
	nextTick(() => {
		// getRightTabData();
	});
};

// const goBossDashboard = () => {
// 	window.open(`${window.location.origin}${window.location.pathname}#/overallSituation/boss`);
// };

// const goBossDashboardTwo = () => {
// 	window.open(`${window.location.origin}${window.location.pathname}#/overallSituation/boss-two`);
// };

/**
 * 获取当年值-各区-所有数据
 */
async function getAllDistrictData(dateStr: string) {
	const params = { date: dateStr };
	const { data } = await queryAttractionCompletionRate<QueryAttractionCompletionRate[]>(params);
	queryAttractionCompletionRateList.value = data;
	getSummaryData();
	getBarData();
}
/**
 * 获取当年值-各区-六个一批相关情况
 */
const districtList = ref<any>([]);
async function getSixBatchInfoDistrictNow(dateStr: string) {
	const params = { date: dateStr };
	const { data } = await querySixBatchInfoDistrictNow<DistrictProjectData>(params);
	// 广州11区下拉选项格式转换
	districtList.value = Object.entries(data).map(([value]) => ({
		label: areaMap[value as keyof typeof areaMap],
		value
	}));
	const fistKey = Object.keys(data)[0];
	selectArea.value = fistKey;
}

/**
 * 显示当前选中-各区-六个一批相关情况
 */
const sixBatchInfoDistrictNowPreViewList = computed<ProjectSummaryByDistrict[]>(() => {
	if (!selectArea.value) return [];

	const CurrutSelectArea = selectArea.value as string;
	const previewList = ['在谈', '签约', '注册', '落地', '开工', '投产（开票）'];
	const previewList2 = ['线索', '在谈', '签约', '注册(备案)', '开工', '投产(开票)'];
	const piveViewData = querySixBatchInfoDistrictNowList.value[CurrutSelectArea] || [];

	// 创建一个映射，方便快速查找已有数据
	const dataMap = new Map<string, ProjectSummaryByDistrict>();
	piveViewData.forEach((item) => {
		dataMap.set(item.projStage, item);
	});
	// 2026年六个一批流程文案处理
	const list = isCurrentYear(tipsText.value) ? previewList2 : previewList;
	// 构造完整列表，缺失项用 '-' 填充
	return list.map((stage) => {
		// 使用正则匹配查找对应项
		const matchedItem = Array.from(dataMap.values()).find(
			(value) => value.projStage.match(stage) || stage.match(value.projStage)
		);

		if (matchedItem) {
			return matchedItem;
		}

		// 如果没找到匹配项，返回填充了默认值的对象
		return {
			projStage: stage,
			projSum: '-',
			projectTotalInvest: '-',
			projectYearInvest: '-',
		} as unknown as ProjectSummaryByDistrict;
	});
});

// 定义原始数据结构
interface RawDataRow {
	readonly label: string;
	readonly values: readonly number[];
}

interface RawData {
	readonly headers: readonly string[];
	readonly rows: readonly RawDataRow[];
}

// 定义转换后的表格行类型（动态 key）
// type DistrictName = Exclude<string, 'metric'>; // 所有区名都是 string，但排除 'metric'
interface TableRecord {
	metric: string; // 第一列：指标名称（如 "完成率%"）
	[district: string]: number | string; // 其他列：区名 → 值
}

interface TableColumn {
	readonly label: string;
	readonly prop: string;
}

// 转换结果
interface TransformedTableData {
	readonly columns: readonly TableColumn[];
	readonly tableData: readonly TableRecord[];
}

// 数据重新整理返回el-table需要的数据格式
function transformToElTableData(rawData: RawData): TransformedTableData {
	if (!rawData) return { columns: [], tableData: [] };
	const { headers, rows } = rawData;

	if (headers.length === 0) {
		return {
			columns: [],
			tableData: [],
		};
	}

	const columns1: TableColumn[] = headers.map((header, index) => ({
		label: header,
		prop: index === 0 ? 'metric' : header,
	}));

	const tableData1: TableRecord[] = rows.map((row) => {
		const record: TableRecord = { metric: row.label };

		for (let i = 1; i < headers.length; i += 1) {
			const district = headers[i];
			const valueIndex = i - 1;
			record[district] = valueIndex < row.values.length ? row.values[valueIndex] : '-';
		}

		return record;
	});

	return { columns: columns1, tableData: tableData1 };
}

// 获取十亿完成率数据
async function getQueryTenbillionCompletionRate(dateStr: string) {
	const { data } = await queryTenbillionCompletionRate<TenbillionProjectTableVo>({ date: dateStr});
	const result = transformToElTableData(data);
	tableData.value = result.tableData as any;
	columns.value = result.columns as any;
	// console.log(result, 'result');
}
// watch(
//     () => activeArea.value,
//     () => {
//       getRightTabData();
//     }
// );

watch(
	() => projectType.value,
	() => {
		if (!queryAttractionCompletionRateList.value.length) return;
		getSummaryData();
	},
	{ immediate: true }
);

watch(
	() => yearSelectValue.value,
	(dateStr) => {
		getAllDistrictData(dateStr);
		getSixBatchInfoDistrictNow(dateStr);
		getQueryTenbillionCompletionRate(dateStr);
	},
	{ immediate: true }
);
</script>
<style lang="less" scoped>
.bossBut {
	display: flex;
	align-items: stretch;
	width: 4rem;
	height: 0.33rem;
	margin: 0.08rem 0.14rem 0 0.14rem;
	border-radius: 0.08rem;
	overflow: hidden;
	// box-shadow: 0 0.03rem 0.08rem rgba(0, 0, 0, 0.12);
	background: rgba(255, 255, 255, 0.2);
	position: absolute;
	top: -0.2rem;
	.bossBut-link {
		position: absolute;
		top: 0;
		z-index: 2;
		width: 50%;
		height: 100%;
		padding: 0;
		cursor: pointer;
		background: transparent;
		border: 0;
	}
	.bossBut-link-left {
		left: 0;
	}
	.bossBut-link-right {
		right: 0;
	}
	:deep(.el-button) {
		flex: 1;
		width: 50%;
		height: 100%;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
		box-shadow: none;
		appearance: none;
	}
	.bossBut-item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: YouSheBiaoTiHei;
		font-size: 0.2rem;
		line-height: 1;
		color: #fff;
		letter-spacing: 0.02em;
		text-shadow: 0 0.02rem 0.03rem rgba(0, 0, 0, 0.2);
	}
	.bossBut-left {
		background: linear-gradient(180deg, #25a7ff 0%, #0d77eb 100%);
		border-radius: 0.08rem 0 0 0.08rem;
		position: relative;
		&::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 1px;
			height: 100%;
			background: rgba(255, 255, 255, 0.22);
		}
	}
	.bossBut-right {
		background: linear-gradient(180deg, #25a7ff 0%, #0d77eb 100%);
		border-radius: 0 0.08rem 0.08rem 0;
	}
}
.right-container {
	flex-shrink: 0;
	height: 9.58rem;
	width: 4.58rem;
	padding: 0.2rem 0.14rem 0.12rem 0.14rem;
	//.outside-box {
	//  display: flex;
	//  flex-direction: column;
	//  align-items: center;
	//  height: 100%;
	//  padding: 0.1rem 0.14rem 0.12rem 0.14rem;
	//  background: rgba(255, 255, 255, 0.05);
	//  box-shadow: -0.08rem 0rem 0.2rem 0rem rgba(25, 43, 138, 0.1), 0.08rem 0rem 0.2rem 0rem rgba(188, 200, 255, 0.5);
	//  border-radius: 0.25rem 0.25rem 0.2rem 0.2rem;
	//  overflow: hidden;
	//}
	&.right-L {
		background-image: url('@/assets/images/OverallSituation/task-bg.png');
		background-size: 100% 100%;
		margin: 0 -0.08rem;
	}
	&.right-R {
		background-image: url('@/assets/images/OverallSituation/dispatch-bg.png');
		background-size: 100% 100%;
		margin: 0 -0.08rem;
	}
	.title-box {
		display: flex;
		cursor: pointer;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		padding: 0 0.25rem;
		.grey-title {
			cursor: pointer;
			width: 100%;
			font-family: YouSheBiaoTiHei;
			/* 原有样式保持不变 */
			font-size: 0.3rem;
			line-height: 0.39rem;
			text-align: left;
			font-style: normal;
			padding-left: 0.25rem;
			/* 使用渐变背景 */
			background: linear-gradient(180deg, #ecf8fe 0%, #4b4b4b 70%, #4b4b4b 100%);
			/* 设置文字颜色为透明，让背景渐变显示出来 */
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			&.p-left {
				padding-left: 0.8rem;
			}
		}
	}
	.content-box {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		width: 100%;
		text-align: center;
		padding: 0.14rem;
		:deep(.tabs-control) {
			width: 3.6rem;
			margin-bottom: 0.14rem;
			> div {
				width: 50%;
			}
		}
		.title-text {
			text-align: left;
			font-weight: 600;
			font-size: @g-font-size-base;
			color: rgba(0, 0, 0, 0.88);
			line-height: 0.28rem;
			margin: 0.1rem 0;
		}
		.summary-list {
			:deep(.custom-list) {
				height: 100%;
				margin-bottom: 0;
				.custom-list-item {
					margin-bottom: 0.17rem;
				}
			}
		}
		.areaSelect {
			width: 1.3rem !important;
		}
		:deep(.el-select) {
			width: 1.35rem;
			height: 0.32rem;
			box-shadow: 0px 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
			border-radius: 0.23rem;
			backdrop-filter: blur(0.15rem);
			.el-select__wrapper {
				border-radius: 0.23rem;
				backdrop-filter: blur(0.15rem);
				box-shadow: none;
				font-size: @g-font-size-base;
				color: rgba(0, 0, 0, 0.65);
				padding: 0.02rem 0.08rem;
				.el-select__caret {
					width: 0;
					height: 0;
					// 绘制向下三角形：左右边框透明，上边框为三角形高度，下边框为0
					border-left: 0.065rem solid transparent;
					border-right: 0.065rem solid transparent;
					border-top: 0.1rem solid #898989;
					border-bottom: 0;
				}
				.el-select__selection {
					box-shadow: none;
					background: transparent;
					padding: 0.01rem 0.08rem;
				}
			}
		}
		.chart-box {
			height: 2.25rem;
		}
		.table-box {
			margin-bottom: 0.14rem;
		}
	}
	.tips-icon {
		cursor: pointer;
		margin-left: 0.1rem;
		display: inline-block;
		width: 0.2rem;
		height: 0.2rem;
		background-image: url('@/assets/images/OverallSituation/tips-icon.png');
		background-size: 100% 100%;
	}
	.tabParam-text {
		margin-left: 0.08rem;
		font-weight: 500;
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.25rem;
	}
	.small {
		margin-bottom: 0.1rem;
		justify-content: flex-start;
		display: grid;
		grid-template-columns: auto auto 1fr auto;
	}
	:deep(.small .right-box .title) {
		white-space: nowrap;
		font-size: @g-font-size-small;
	}


	:deep(.el-table thead th.el-table__cell){
		font-size: @g-font-size-small;
	}
}
</style>
