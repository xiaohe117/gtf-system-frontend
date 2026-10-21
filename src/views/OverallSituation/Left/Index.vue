<template>
	<div class="LeftBigBox">
		<div class="tabs-box fx-r">
			<div
				class="tab-item"
				:class="{ active: curStatus === index }"
				v-for="(item, index) in tabsArr"
				:key="index"
				@click="changeTab(index)"
			>
				<span class="text">{{ item }}</span>
			</div>
			<CascaderSelect
				v-if="curStatus === 1"
				v-model="dateValue"
				:options="dateOptions"
				@change="handleDateValueChange"
				:clearable="false"
			/>
		</div>
		<FrameBox class="investment-promotion-overview">
			<TitleBody name="招商概况">
				<SmallTitle title="全市招商任务情况" style="justify-content: unset">
					<span class="tabParam-text">{{ `(${tabParam})` }}</span>
				</SmallTitle>
				<div class="title-box fx-r">
					<span class="title">
						新签约产业项目
						<span class="tips-icon" @click="handleTipsDialog('tipsDialog1')"></span>
					</span>
					<div class="progress-box fx-r" v-if="curStatus === 1">
						<span class="text">完成率</span>
						<span class="rate-num">{{ completionRate1 || 0 }}%</span>
						<!-- <el-progress :percentage="completionRate1" color="#F5CA45" /> -->
					</div>
				</div>
				<div class="rect-wrap" :class="{ gap6: signedProjectList.length > 3 }">
					<div
						class="items"
						:class="{ 'padding-left6': signedProjectList.length > 3 }"
						v-for="(item, index) in signedProjectList"
						:key="index"
					>
						<p class="label">{{ item.name }}</p>
						<p class="num-unit">
							<span class="number-font">{{ item.value ?? '-' }}</span>
							<span class="unit">{{ item.unit }}</span>
						</p>
					</div>
				</div>
				<div class="title-box fx-r">
					<span class="title">
						新注册(备案)高质量产业招商项目
						<span class="tips-icon" @click="handleTipsDialog('tipsDialog2')"></span>
					</span>
					<div class="progress-box fx-r" v-if="curStatus === 1">
						<span class="text">完成率</span>
						<span class="rate-num">{{ completionRate2 || 0 }}%</span>
						<!-- <el-progress :percentage="completionRate2" color="#F5CA45" /> -->
					</div>
				</div>
				<div class="rect-wrap high-quality" :class="{ gap6: signedProjectList.length > 3 }">
					<div
						class="items"
						:class="{
							checked: index === active,
							'padding-left6': signedProjectList.length > 3,
						}"
						v-for="(item, index) in highQualityProjectList"
						:key="index"
						@click="handleClick(index)"
					>
						<p class="label">{{ item.name }}</p>
						<p class="num-unit">
							<span class="number-font">{{ item.value ?? '-' }}</span>
							<span class="unit">{{ item.unit }}</span>
						</p>
					</div>
				</div>
				<div class="long-rect fx-r fx-al-c">
					<div class="items fx-w" v-for="(item, index) in longRectList" :key="index">
						<p class="label">
							{{ item.name }}
							<span
								class="tips-icon"
								@click="handleTipsDialog(`tipsDialog${index + 3}`)"
							></span>
						</p>
						<p class="num-unit">
							<span class="number-font">{{ item.value ?? '-' }}</span>
							<span class="unit">{{ highQualityProjectList?.[active]?.unit }}</span>
						</p>
					</div>
				</div>
				<SmallTitle title="预计投资总额" style="justify-content: unset">
					<span class="tabParam-text">{{ `(${tabParam})` }}</span>
				</SmallTitle>
				<div class="chart-box">
					<SelectControl
						class="select-style"
						v-model="selectValue"
						:options="selectOptions"
						@change="handleSelectChange"
						:clearable="false"
					/>
					<ChartContainer :chartOption="lineOption" :isEmpty="isEmpty" />
				</div>
				<SmallTitle title="全市招商项目全流程管理" style="justify-content: unset">
					<span class="tabParam-text">{{ `(${tabParam})` }}</span>
					<span class="tips-icon" @click="handleTipsDialog('tipsDialog6')"></span>
				</SmallTitle>
				<div class="steps-bar">
					<div
						v-for="(step, index) in isCurrentYear(tabParam) ? steps2 : steps"
						:key="index"
						class="step-item"
						:class="{ 'step-item--active': index === activeIndex }"
						@click="handleStepClick(step, index)"
					>
						<span class="step-text">{{ step }}</span>
					</div>
				</div>
				<div class="stats-card fx-r">
					<div
						class="stat-item fx-w"
						v-for="(item, index) in bottomRectList"
						:key="index"
					>
						<p class="stat-label">{{ item.name }}</p>
						<p class="stat-value">
							<span class="number-font">{{ item.value }} </span>
							<span class="unit">{{ item.unit }}</span>
						</p>
					</div>
				</div>
			</TitleBody>
		</FrameBox>
	</div>
	<!-- 新签约产业项目 -->
	<TipsDialog
		title="符合以下任一条件的均属于新签约产业项目"
		:ref="(el) => setDialogRef(el, 'tipsDialog1')"
	>
		<div class="tips-content fx-c">
			<div class="items">
				<span>
					项目类别属于“新设”、“外市迁入”、“增资”、“扩产”这四类之一，且行业门类属于<span
						class="blue-text"
						>“制造业项目”</span
					>，且预计总投资或预计达产年营收<span class="blue-text">大于或等于1亿元</span
					>。基于以上，项目还需满足当年已签约或者当年未签约但已明确有投资意向的项目。
				</span>
			</div>
			<div class="items">
				<span>
					项目类别属于“新设”、“外市迁入”、“增资”、“扩产”这四类之一，且行业门类属于<span
						class="blue-text"
						>“现代服务业项目” </span
					>， 且预计总投资或预计达产年营收<span class="blue-text">大于或等于2000万元</span
					>。基于以上，项目还需满足当年已签约或者当年未签约但已明确有投资意向的项目。
				</span>
			</div>
			<div class="items">
				<span>
					项目类别属于“新设”、“外市迁入”、“增资”、“扩产”这四类之一，且行业门类属于<span
						class="blue-text"
						>“其他项目”</span
					>，且预计总投资或预计达产年营收<span class="blue-text">大于或等于2000万元</span
					>。基于以上，项目还需满足当年已签约或者当年未签约但已明确有投资意向的项目。
				</span>
			</div>
			<div class="items">
				<span>
					产业体系属于“未来产业”，预计总投资或预计<span class="blue-text"
						>达产年产值/营收大于等于0</span
					>。基于以上，项目还需满足当年已签约或者当年未签约但已明确有投资意向的项目。
				</span>
			</div>
		</div>
	</TipsDialog>
	<!-- 新注册(备案)高质量产业招商项目 -->
	<TipsDialog
		title="符合以下任一条件的均属于新注册（备案）高质量产业招商项目"
		:ref="(el) => setDialogRef(el, 'tipsDialog2')"
		width="10.1rem"
	>
		<div class="tips-content fx-c">
			<div class="items">
				<span>
					项目类别属于“新设”、“外市迁入”、“增资”、“扩产”这四类之一，且行业门类属于<span
						class="blue-text"
						>“制造业项目”</span
					>，且预计总投资或预计达产年营收<span class="blue-text">大于或等于1亿元</span>；
				</span>
			</div>
			<div class="items">
				<span>
					项目类别属于“新设”、“外市迁入”、“增资”、“扩产”这四类之一，且行业门类属于<span
						class="blue-text"
						>“现代服务业项目” </span
					>， 且预计总投资或预计达产年营收<span class="blue-text">大于或等于2000万元</span
					>；
				</span>
			</div>
			<div class="items">
				<span>
					项目类别属于“新设”、“外市迁入”、“增资”、“扩产”这四类之一，且行业门类属于<span
						class="blue-text"
						>“其他项目”</span
					>，且预计总投资或预计达产年营收<span class="blue-text">大于或等于2000万元</span
					>；
				</span>
			</div>
			<div class="items">
				<span>
					产业体系属于“非其他”，且属于已注册、已完成增资、已完成扩产备案和已完成
					迁入这四种情况之一，以及符合到达注册阶段时间是当年的项目；
				</span>
			</div>
			<div class="items fx-al-c">
				<span> 至少有一家企业的登记注册类型不是‘分公司’”的情况； </span>
			</div>
			<div class="items fx-al-c">
				<span> 企业行业门类为“（J）金融业”，则分公司也可纳入。 </span>
			</div>
		</div>
	</TipsDialog>
	<!-- 10亿+项目 -->
	<TipsDialog
		title="符合以下任一条件的均属于10亿+项目：（包含100亿+项目）"
		:ref="(el) => setDialogRef(el, 'tipsDialog3')"
		width="10.1rem"
	>
		<div class="tips-content fx-c">
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类和大宗贸易类，
					且预计总投资<span class="blue-text">大于等于10亿元</span>；
				</span>
			</div>
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类和大宗贸易类，
					且<span class="blue-text">达产年营收/产值大于等于10亿元</span>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span>
					已注册或者已完成迁入，且注册资本<span class="blue-text"
						>大于等于10亿元的项目</span
					>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span>已增资，且增资金额<span class="blue-text">大于等于10亿元的项目</span>。</span>
			</div>
		</div>
	</TipsDialog>
	<!-- 100亿+项目 -->
	<TipsDialog
		title="符合以下任一条件的均属于100亿+项目"
		:ref="(el) => setDialogRef(el, 'tipsDialog4')"
		width="10.1rem"
	>
		<div class="tips-content fx-c">
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类、大宗贸易类和
					登记注册类型带“分公司”，且预计总投资<span class="blue-text"
						>大于等于100亿元</span
					>；
				</span>
			</div>
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类、大宗贸易类和
					登记注册类型带“分公司”，且<span class="blue-text"
						>达产年营收/产值大于等于100亿元</span
					>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span>
					已完成注册或者已完成迁入，且注册资本<span class="blue-text"
						>大于等于100亿元的项目</span
					>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span
					>已增资，且增资金额<span class="blue-text">大于等于100亿元</span>的项目。</span
				>
			</div>
		</div>
	</TipsDialog>
	<!-- 央企项目 -->
	<TipsDialog
		title="符合以下任一条件的均属于央企项目"
		:ref="(el) => setDialogRef(el, 'tipsDialog5')"
		width="10.1rem"
	>
		<div class="tips-content fx-c">
			<div class="items fx-al-c">
				<span> 基于满足新注册（备案）高质量产业招商项目条件下，项目性质属于央企； </span>
			</div>
			<div class="items fx-al-c">
				<span>国民经济行业属于建筑业，且项目属于三级央企或以上。</span>
			</div>
		</div>
	</TipsDialog>
	<!-- 全市招商项目全流程管理 -->
	<TipsDialog title="招商项目全流程管理" :ref="(el) => setDialogRef(el, 'tipsDialog6')">
		<div class="tips-content flex-x-center">
			<div class="dialog-con-bg"></div>
		</div>
	</TipsDialog>
</template>

<script setup lang="ts">
import FrameBox from '@/components/FrameBox.vue';
import status from '@/stores/status';
import { isCurrentYear } from '@/utils';
import {
	newSigningIndustryProjects,
	newHighQualityIndustryProjects,
	enterpriseMonthlyStats,
	querySixBatchInfoDistrict,
	dateSelectOptions,
} from '@/api/OverallSituation/index';
// import dayjs from 'dayjs';
import TipsDialog from '@/views/OverallSituation/components/TipsDialog.vue';
import lineChartOption from './chartOptions';

interface CascaderOption {
	value: string;
	label: string;
	children?: CascaderOption[];
}

const emits = defineEmits(['handleTabChange']);

const { setYearSelectValue } = status();

const tabsArr = ['累计值', '当年值'];
const curStatus = ref(1);
// 当年值年份
const dateOptions = ref<any[]>([]);
const dateValue = ref<string[]>([]);

const tranDateStr = () => {
	const dateStr = Array.isArray(dateValue.value) ? dateValue.value.join('') : dateValue.value;
	return dateStr;
};
const handleDateValueChange = () => {
	curStatus.value = 1;
	setYearSelectValue(tranDateStr());
};
// 累计值、当年值传参
const tabParam = computed(() => {
	if (curStatus.value === 0) {
		return '累计值';
	}
	return tranDateStr();
	// return dayjs().format('YYYY');
});

// 注释说明弹窗
const dialogRefs = {
	tipsDialog1: ref<any>(),
	tipsDialog2: ref<any>(),
	tipsDialog3: ref<any>(),
	tipsDialog4: ref<any>(),
	tipsDialog5: ref<any>(),
	tipsDialog6: ref<any>(),
};

const handleTipsDialog = (name: string) => {
	const dialogRef = (dialogRefs as any)[name];
	dialogRef.value?.show?.();
};

// 模板引用需要绑定
const setDialogRef = (el: any, name: keyof typeof dialogRefs) => {
	dialogRefs[name].value = el;
};

// 新签约产业项目
const completionRate1 = ref(0);
const signedProjectList = ref<any[]>([
	{
		name: '项目数量',
		value: 0,
		unit: '个',
	},
	{
		name: '预计投资总额',
		value: 0,
		unit: '亿元',
	},
	{
		name: '达产年营收/产值',
		value: 0,
		unit: '亿元',
	},
]);

// 新注册(备案)高质量产业招商项目
const active = ref(0);
const completionRate2 = ref(0);
const highQualityProjectList = ref<any[]>([
	{
		name: '项目数量',
		value: 0,
		unit: '个',
	},
	{
		name: '预计投资总额',
		value: 0,
		unit: '亿元',
	},
	{
		name: '达产年营收/产值',
		value: 0,
		unit: '亿元',
	},
]);
const longRectList = ref<any[]>([
	{
		name: '10亿+项目',
		value: 0,
		unit: '个',
	},
	{
		name: '100亿+项目',
		value: 0,
		unit: '个',
	},
	{
		name: '央企项目',
		value: 0,
		unit: '个',
	},
]);

// 初始化数据位0
const resetProjectList = (list: Ref<any[]>) => {
	list.value.forEach((item) => {
		item.value = 0;
	});
};
const getNewSigningIndustryProjects = (vl: string) => {
	const params = {
		reportBatch: vl,
	};
	newSigningIndustryProjects(params).then((res: any) => {
		const { code, data = {} } = res;
		if (code === 0) {
			const signedProjectListData = data?.find((item: any) => item.tag === '1');
			const highQualityProjectListData = data?.find((item: any) => item.tag === '2');
			completionRate1.value = signedProjectListData?.completionRate;
			signedProjectList.value[0].value = signedProjectListData?.projectCount;
			signedProjectList.value[1].value = signedProjectListData?.investmentTotal;
			signedProjectList.value[2].value = signedProjectListData?.annualOutput;
			completionRate2.value = highQualityProjectListData?.completionRate;
			highQualityProjectList.value[0].value = highQualityProjectListData?.projectCount;
			highQualityProjectList.value[1].value = highQualityProjectListData?.investmentTotal;
			highQualityProjectList.value[2].value = highQualityProjectListData?.annualOutput;
		} else {
			resetProjectList(signedProjectList);
			resetProjectList(highQualityProjectList);
		}
	});
};
// 新注册(备案)高质量产业招商项目
const getNewHighQualityIndustryProjects = (val: number) => {
	const params = {
		reportBatch: tabParam.value,
		projectType: val + 1,
	};
	newHighQualityIndustryProjects(params).then((res: any) => {
		const { code, data = {} } = res;
		if (code === 0) {
			longRectList.value[0].value = data?.over10BillionValue;
			longRectList.value[1].value = data?.over100BillionValue;
			longRectList.value[2].value = data?.stateOwnedEnterpriseValue;
		} else {
			resetProjectList(longRectList);
		}
	});
};
const handleClick = (index: number) => {
	active.value = index;
	getNewHighQualityIndustryProjects(index);
};

// 预计投资总额
const selectOptions = [
	{ value: 1, label: '新签约产业项目' },
	{ value: 2, label: '新注册(备案)高质量产业招商项目' },
];
const selectValue = ref(selectOptions[1].value);
const lineOption = ref<any>({});
const isEmpty = ref<boolean>(true);
const getEnterpriseMonthlyStats = () => {
	lineOption.value = {};
	const params = {
		date: curStatus.value === 1 ? tabParam.value : undefined,
		tag: selectValue.value,
	};
	enterpriseMonthlyStats(params).then((res: any) => {
		const { code, data = [] } = res;
		isEmpty.value = data?.length < 1;
		if (code === 0) {
			const xAxisList = data?.map((item: any) => item.quarter);
			let seriesData: any[] = [];
			if (selectValue.value === 1) {
				seriesData = [
					{
						name: `预计投资总额`,
						data: data?.map((item: any) => item.newSignedProjects),
						color: '#1EB092',
					},
				];
			} else {
				seriesData = [
					{
						name: `预计投资总额`,
						data: data?.map((item: any) => item.totalInvestment),
						color: '#FFB637',
					},
					{
						name: '10亿+项目',
						data: data?.map((item: any) => item.over10BillionInvestment),
						color: '#FE793B',
					},
					{
						name: '100亿+项目',
						data: data?.map((item: any) => item.over100BillionInvestment),
						color: '#1EB092',
					},
					{
						name: '央企项目',
						data: data?.map((item: any) => item.stateOwnedEnterpriseInvestment),
						color: '#408FFF',
					},
				];
			}
			xAxisList.unshift('\u200B'); // 需求，让折线图从原点出发
			if (xAxisList.length === 2) {
				xAxisList.push('\u200B'); // 零宽空格占位，让实际数据点居中
				seriesData.forEach((ele) => {
					ele.data.unshift(0);
					ele.data.push(null);
				});
			}else{
				seriesData.forEach((ele) => {
					ele.data.unshift(0);
				});
			}
			const chartData = {
				xAxisList,
				seriesData,
			};
			console.log(chartData)
			lineOption.value = lineChartOption(chartData);
		}
	});
};
const handleSelectChange = () => {
	getEnterpriseMonthlyStats();
};

// 全市招商项目全流程管理
const steps = ['在谈', '签约', '注册\n(备案)', '落地', '开工', '投产\n(开票)'];
const steps2 = ['线索', '在谈', '签约', '注册\n(备案)', '开工', '投产\n(开票)'];
const activeIndex = ref(2);
const bottomRectList = ref<any[]>([
	{
		name: '注册项目数量',
		value: 0,
		unit: '个',
	},
	{
		name: '注册预计投资总额',
		value: 0,
		unit: '亿元',
	},
]);
const bottomData = ref<any[]>([]);
const interData = ref<any>({});
const handleStepClick = (step: string, index: number) => {
	activeIndex.value = index;
	bottomData.value =
		curStatus.value === 0 ? interData.value?.totalAccumulate : interData.value?.totalNow;
	bottomRectList.value = [
		{
			name: `${step.substring(0, 2)}项目数量`,
			value: bottomData?.value?.find((item: any) =>
				item.projStage.includes(step.substring(0, 2))
			)?.projSum,
			unit: '个',
		},
		{
			name: `${step.substring(0, 2)}预计投资总额`,
			value: bottomData?.value?.find((item: any) =>
				item.projStage.includes(step.substring(0, 2))
			)?.totalInvest,
			unit: '亿元',
		},
	];
};
const getQuerySixBatchInfoDistrict = () => {
	const params = { date: tranDateStr() };
	querySixBatchInfoDistrict(params).then((res: any) => {
		const { code, data = {} } = res;
		if (code === 0) {
			interData.value = data; // 接口数据暂存起来
			handleStepClick(steps[2], 2);
		}
	});
};
// 获取默认的日期值
function getLastPeriodValue(data?: CascaderOption[]): Array<string> {
	// 空值处理
	if (!data?.length) return [];
	// 获取最后一项父级
	const lastParent = data.at(-1)!;
	const parentValue = lastParent.value;

	// 无子节点>仅返回父级值
	if (!lastParent.children?.length) {
		return [parentValue];
	}
	// 有子节点>返回父级的最后一个子级
	const lastChild = lastParent.children.at(-1)!;
	return [parentValue, lastChild.value];
}
// 日期下拉数据
const getTableDateOptions = () => {
	dateSelectOptions().then((res: any) => {
		const { code, data = [] } = res;
		if (code === 0) {
			// 过滤2025年之前的数据
			const filteredData = data.filter((item: any) => {
				const year = parseInt(item.value.replace('年', ''), 10);
				return year >= 2025;
			});
			dateOptions.value = filteredData || [];
			dateValue.value = getLastPeriodValue(filteredData);
			setYearSelectValue(tranDateStr());
		}
	});
};
const changeTab = (index: number) => {
	curStatus.value = index;
	selectValue.value = selectOptions[1].value;
	getEnterpriseMonthlyStats();
	emits('handleTabChange', curStatus.value);
};

onMounted(() => {
	getTableDateOptions();
	getNewSigningIndustryProjects(tabParam.value);
	getNewHighQualityIndustryProjects(0);
	getEnterpriseMonthlyStats();
	getQuerySixBatchInfoDistrict();
});

// 切换累计值、当年值
watch(
	() => [curStatus.value, tabParam.value],
	() => {
		getNewSigningIndustryProjects(tabParam.value);
		handleClick(0); // 新注册(备案)高质量产业招商项目,初始化为选中第一个
		handleStepClick(steps[2], 2); // "六个一批"相关情况，初始化为选中第3个
		getQuerySixBatchInfoDistrict();
		getEnterpriseMonthlyStats();
	}
);
</script>

<style lang="less" scoped>
.tabParam-text {
	margin-left: 0.08rem;
	font-weight: 500;
	font-size: 0.18rem;
	color: rgba(0, 0, 0, 0.65);
	line-height: 0.25rem;
}
.tips-icon {
	cursor: pointer;
	margin-left: 0.05rem;
	display: inline-block;
	width: 0.2rem;
	height: 0.2rem;
	background-image: url('@/assets/images/OverallSituation/tips-icon.png');
	background-size: 100% 100%;
}
.LeftBigBox {
	width: 4.58rem;
}
.tabs-box {
	position: relative;
	z-index: 3;
	cursor: pointer;
	margin-bottom: 0.06rem;
	align-items: center;
	.tab-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.2rem;
		height: 0.42rem;
		background-image: url('@/assets/images/OverallSituation/top-tab-1.png');
		background-size: 100% 100%;
		.text {
			font-family: YouSheBiaoTiHei;
			font-size: 0.22rem;
			color: #165dff;
			line-height: 0.2rem;
			letter-spacing: 0.02rem;
			// text-shadow: -0.06rem 0 0.1rem rgba(10,65,208,0.2), 0.04rem 0.02rem 0.04rem rgba(0,0,0,0.5);
		}
		&.active {
			background-image: url('@/assets/images/OverallSituation/top-tab-active-1.png');
			.text {
				font-size: 0.2rem;
				color: #fff;
				text-shadow: -0.06rem 0 0.1rem rgba(10, 65, 208, 0.2);
			}
		}
		&:nth-child(2) {
			background-image: url('@/assets/images/OverallSituation/top-tab-2.png') !important;
			&.active {
				background-image: url('@/assets/images/OverallSituation/top-tab-active-2.png') !important;
			}
		}
	}
}
.investment-promotion-overview {
	// width: 4.58rem;
	height: 8.98rem;
	padding: 0.05rem 0.04rem 0.01rem 0.04rem;
	:deep(.outside-content) {
		background: #f8faff;
	}
	:deep(.small-title) {
		margin-bottom: 0;
	}
}
.title-box {
	margin: 0.12rem 0 0.08rem;
	align-items: center;
	justify-content: space-between;
	.title {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: @g-font-size-medium;
		color: rgba(0, 0, 0, 0.88);
		line-height: 0.28rem;
		flex-shrink: 0;
	}
	.text {
		font-size: 0.14rem;
		color: #000000;
		line-height: 0.2rem;
		flex-shrink: 0;
	}
	.rate-num {
		font-weight: bold;
		font-size: 0.16rem;
		color: #3a73de;
		line-height: 0.2rem;
		margin-left: 0.07rem;
	}
	/* 	.progress-box {
		align-items: center;
		.text {
			font-size: @g-font-size-base;
			color: #000000;
			line-height: 0.2rem;
			margin: 0 0.05rem 0 0.17rem;
		}
		:deep(.el-progress) {
			flex-grow: 1;
			width: 0;
			.el-progress-bar__outer {
				background: rgba(245, 202, 69, 0.29);
				border-radius: 0;
				height: 0.08rem;
				.el-progress-bar__inner {
					border-radius: 0;
					height: 0.08rem;
				}
			}
			.el-progress__text {
				font-weight: bold;
				font-size: @g-font-size-medium;
				color: #000000;
				line-height: 0.2rem;
				margin-left: 0.07rem;
			}
		}
	} */
}

.rect-wrap {
	display: flex;
	justify-content: space-between;
	gap: 0.08rem;
	.items {
		flex: 1;
		height: 0.74rem;
		background-image: url('@/assets/images/OverallSituation/left-rect.png');
		background-size: 100% 100%;
		// padding: 0.12rem 0 0.08rem 0.12rem;
		padding-left: 0.08rem;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		&:nth-child(1) {
			flex: 0.6;
		}
		.label {
			font-weight: 400;
			font-size: @g-font-size-base;
			color: #333333;
			line-height: 0.16rem;
			// padding-bottom: 0.17rem;
			white-space: pre-line; /* 关键！识别 \n 并换行 */
		}
		.number-font {
			font-weight: bold;
			font-size: @g-font-size-base;
			color: #165dff;
			line-height: 0.24rem;
		}
		.unit {
			padding-left: 0.03rem;
			// padding-left: 0.1rem;
			font-weight: 500;
			font-size: @g-font-size-x-small;
			color: rgba(0, 0, 0, 0.6);
			line-height: 0.21rem;
		}
	}
	&.high-quality {
		margin-bottom: 0.07rem;
		.items {
			&:hover {
				cursor: pointer;
				box-shadow: 0 0 0.05rem #3489ff;
				border-radius: 0.1rem;
				border: 0.01rem solid #fff;
			}
			&.checked {
				width: 1.35rem;
				height: 0.84rem;
				background-image: url('@/assets/images/OverallSituation/left-rect-hover.png');
				box-shadow: none;
			}
		}
	}
}
.long-rect {
	margin-bottom: 0.26rem;
	width: 4.27rem;
	height: 0.76rem;
	background-image: url('@/assets/images/OverallSituation/long-rect.png');
	background-size: 100% 100%;
	padding-left: 0.34rem;
	.items {
		.label {
			font-weight: 400;
			font-size: @g-font-size-base;
			color: #333333;
			line-height: 0.16rem;
			display: flex;
			align-items: center;
			.tips-icon {
				margin-left: 0.02rem;
			}
		}
		.num-unit {
			padding-top: 0.12rem;
			.number-font {
				font-weight: bold;
				font-size: @g-font-size-medium;
				color: #165dff;
				line-height: 0.24rem;
			}
			.unit {
				padding-left: 0.08rem;
				font-weight: 500;
				font-size: @g-font-size-x-small;
				color: rgba(0, 0, 0, 0.6);
				line-height: 0.21rem;
			}
		}
	}
}
.chart-box {
	position: relative;
	height: 2rem;
	margin: 0.1rem 0;
}

// 步骤条颜色列表（顺序对应：在谈→签约→注册→落地→开工→投产）
@step-colors: #ffb637, #fe793b, #51e1c4, #1eb092, #408fff, #37d9fe;
@arrow-width: 0.085rem; // 箭头宽度
@step-height: 0.415rem; // 步骤项高度
.steps-bar {
	margin-top: 0.12rem;
	display: flex;
	margin-bottom: 0.23rem; // 预留指针空间
}

.step-item {
	flex: 1; // 平分宽度
	height: 0.4rem;
	position: relative; // 为伪元素提供定位基准
	cursor: pointer;

	// 按索引设置背景色+文字颜色
	&:nth-child(1) {
		--bg: extract(@step-colors, 1);
	}
	&:nth-child(2) {
		--bg: extract(@step-colors, 2);
	}
	&:nth-child(3) {
		--bg: extract(@step-colors, 3);
	}
	&:nth-child(4) {
		--bg: extract(@step-colors, 4);
	}
	&:nth-child(5) {
		--bg: extract(@step-colors, 5);
	}
	&:nth-child(6) {
		--bg: extract(@step-colors, 6);
	}

	// 背景色+文字颜色（复用变量）
	background-color: var(--bg);
	color: var(--bg); // 关键：箭头用currentColor继承背景色

	// 步骤文字（支持换行，如“注册（备案）”）
	.step-text {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-weight: 500;
		font-size: @g-font-size-small;
		color: #ffffff;
		line-height: 0.17rem;
		white-space: pre-line; /* 关键！识别 \n 并换行 */
	}
	&:not(:last-child) {
		.step-text {
			// 【核心】向右三角形箭头（除最后一个步骤项）
			&::after {
				content: '';
				position: absolute;
				top: 0;
				right: -0.075rem;
				width: 0;
				height: 0;
				border-top: calc(@step-height / 2) solid transparent;
				border-bottom: calc(@step-height / 2) solid transparent;
				border-left: @arrow-width solid var(--bg);
				z-index: 2;
			}
		}
	}

	// 激活状态：指针+圆圈
	&--active {
		&::before {
			content: '';
			position: absolute;
			bottom: -0.23rem;
			left: 50%;
			transform: translateX(-50%);
			width: 0.01rem;
			height: 0.11rem;
			background-color: var(--bg);
			border-radius: 0.02rem;
		}

		// 圆圈（激活标识）
		&::after {
			content: '';
			position: absolute;
			bottom: -0.12rem;
			left: 50%;
			transform: translateX(-50%);
			width: 0.12rem;
			height: 0.12rem;
			background: #ffffff;
			border-color: var(--bg);
			border-width: 0.02rem;
			border-style: solid;
			border-radius: 50%;
		}
	}
}
.stats-card {
	height: 0.74rem;
	background-image: url('@/assets/images/OverallSituation/bottom-rect.png');
	background-size: 100% 100%;
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.stat-label {
			font-weight: 400;
			font-size: @g-font-size-base;
			color: #333333;
			line-height: 0.16rem;
		}
		.stat-value {
			padding-top: 0.12rem;
			.number-font {
				font-weight: bold;
				font-size: @g-font-size-medium;
				color: #165dff;
				line-height: 0.24rem;
			}
			.unit {
				padding-left: 0.08rem;
				font-weight: 500;
				font-size: @g-font-size-x-small;
				color: rgba(0, 0, 0, 0.6);
				line-height: 0.21rem;
			}
		}
	}
}
.select-style {
	z-index: 2;
	position: absolute;
	right: 0;
	top: 0;
	width: fit-content;
	:deep(.el-select__wrapper) {
		width: 2.28rem;
		height: 0.32rem;
		background: rgba(255, 255, 255, 0.4);
		box-shadow: 0rem 0.03rem 0.05rem 0rem rgba(162, 169, 213, 0.66);
		border-radius: 0.23rem;
		border: 0.01rem solid #ffffff;
		backdrop-filter: blur(0.15rem);
		min-height: fit-content;
		.el-select__caret {
			width: 0;
			height: 0;
			border-left: 0.065rem solid transparent;
			border-right: 0.065rem solid transparent;
			border-top: 0.1rem solid #898989;
			border-bottom: 0;
		}
		.el-select__placeholder {
			font-weight: 400;
			font-size: @g-font-size-base;
			color: rgba(0, 0, 0, 0.65);
			line-height: 0.22rem;
		}
	}
}
.select-style-year {
	margin-left: auto;
	margin-right: 0.24rem;
	width: fit-content;
	:deep(.el-select__wrapper) {
		width: 1.64rem;
		height: 0.32rem;
		min-height: auto;
		background: #fbfcff;
		box-shadow: 0.06rem 0rem 0.1rem 0rem rgba(10, 65, 208, 0.2);
		border-radius: 0.23rem;
		border: 0.01rem solid #165dff;
		backdrop-filter: blur(0.15rem);
		display: flex;
		align-items: center;
		.el-select__caret {
			width: 0;
			height: 0;
			border-left: 0.08rem solid transparent;
			border-right: 0.08rem solid transparent;
			border-top: 0.1rem solid #165dff;
			border-bottom: 0;
			margin-left: 0.1rem;
		}
		.el-select__placeholder,
		.el-select__value {
			font-weight: 400;
			font-size: 0.18rem;
			color: #165dff;
			line-height: 0.25rem;
		}
	}
}
.gap6 {
	gap: 0.05rem !important;
}
.padding-left6 {
	padding-left: 0.06rem !important;
	&:nth-child(3) {
		.number-font {
			font-size: @g-font-size-base;
		}
		.unit {
			padding-left: 0;
		}
	}
}
.tips-content {
	gap: 0.22rem;
	.items {
		display: flex;
		font-weight: 400;
		font-size: 0.18rem;
		color: #111111;
		line-height: 0.24rem;
		.blue-text {
			color: #165dff;
		}
		&::before {
			flex-shrink: 0;
			content: '';
			display: inline-block;
			width: 0.52rem;
			height: 0.55rem;
			background-size: 100% 100%;
			margin-right: 0.15rem;
		}
		&:nth-child(1) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/01.png');
			}
		}
		&:nth-child(2) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/02.png');
			}
		}
		&:nth-child(3) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/03.png');
			}
		}
		&:nth-child(4) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/04.png');
			}
		}
		&:nth-child(5) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/05.png');
			}
		}
		&:nth-child(6) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/06.png');
			}
		}
	}
	.dialog-con-bg {
		width: 8.28rem;
		height: 2.45rem;
		background-image: url('@/assets/images/OverallSituation/dialog-con-bg.png');
		background-size: 100% 100%;
	}
}
</style>
