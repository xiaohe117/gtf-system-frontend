<template>
	<FrameBox class="aim-enterprise-overview" size="small-white">
		<TitleBody name="招商主体跟进统计" class="target-enterprise">
			<template #extra>
				<el-select
					v-model="activeUnit"
					suffix-icon="CaretBottom"
					@change="handleSelectChange"
				>
					<el-option
						v-for="item in unitLevelOptions"
						:label="item.label"
						:value="item.value"
						:key="item.value"
					/>
				</el-select>
			</template>
			<el-tabs v-model="activeTag" @tab-change="handleTabChange">
				<el-tab-pane
					v-for="item in tagListTab"
					:label="item.label"
					:name="item.value"
					:key="item.value"
				>
					<template #label>
						{{ item.label }}
						<el-popover
							title="百分比表示"
							:width="getSize(360)"
							popper-class="tabs-popover"
						>
							<template #default>
								<div class="content">
									已跟进的企业数量<span class="symbol">/</span>本单位目标企业总数
								</div>
							</template>
							<template #reference>
								<el-icon class="tabs-icon" v-if="item.value == '2'"
									><QuestionFilled
								/></el-icon>
							</template>
						</el-popover>
					</template>
				</el-tab-pane>
			</el-tabs>
			<SmallTitle title="走访任务总数" />
			<div class="stack-bar-chart-box">
				<ChartContainer :chartOption="stackBarChartOption" :isEmpty="targetChartEmpty" />
			</div>
			<SmallTitle title="全部已走访企业">
				<el-select v-model="activeType" suffix-icon="CaretBottom">
					<el-option
						v-for="item in enterpriseOptions"
						:label="item.label"
						:value="item.value"
						:key="item.value"
					/>
				</el-select>
			</SmallTitle>

			<div class="enterprise-follow">
				<ChartContainer
					:chartOption="stackedHorizontalBarChartOption"
					:isEmpty="followChartEmpty"
				/>
			</div>
		</TitleBody>
	</FrameBox>
</template>

<script lang="ts" setup>
import { getSize } from '@/utils';
import { targetFollowStatList, connectedListType } from '@/api/runByEnterprise/index';
import { stackBarOption, stackedHorizontalBarOption } from './chartOption';

const unitLevelOptions = ref<any>([
	{ label: '市直部门', value: '2' },
	{ label: '各区', value: '3' },
	{ label: '国企', value: '6' },
	{ label: '市领导', value: '8' },
]);
const activeUnit = ref<any>(unitLevelOptions.value[0].value);

const tagListTab = ref<any>([
	{
		label: '全部企业走访',
		value: '',
	},
	{
		label: '重点央企对接',
		value: 'qy0001001',
	},
	{
		label: '重点外企对接',
		value: 'qy0001003',
	},
	{
		label: '重点民企对接',
		value: 'qy0001002',
	},
	{
		label: '省属国企对接',
		value: '17727596619101',
	},
]);
const activeTag = ref(tagListTab.value[0].value);

// 目标企业总数
const targetChartEmpty = ref(false);
const targetChartData = reactive<any>({
	colorArr: ['#FFB20D', '#3489FF'],
	xData: [],
	yData: [],
});
const stackBarChartOption = computed(() => stackBarOption(targetChartData));
const getTargetData = async () => {
	try {
		targetChartEmpty.value = false;
		const params = {
			tagId: activeTag.value,
			unitLevel: activeUnit.value,
		};
		const { code, data = [] } = await targetFollowStatList<any>(params);
		if (code !== 0) {
			return;
		}
		targetChartEmpty.value = !data.length;
		targetChartData.xData = data.map((item: any) => item.unitName);
		targetChartData.yData = [
			{
				name: '走访任务总数',
				data: data.map((item: any) => {
					const primaryCount = item.primaryCount || 0;
					// const supportCount = ['2', '3', '6'].includes(activeUnit.value)
					// 	? item.supportCount || 0
					// 	: 0;

					return primaryCount 
				}),
			},
		];
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		targetChartEmpty.value = true;
	}
};

// 跟进企业统计
const followChartEmpty = ref(false);
const followChartData = reactive<any>({
	colorArr: ['#FFB20D', '#3489FF', '#ABCDFF'],
	xData: [],
	yData: [],
});
const enterpriseOptions = ref<any>([
	{ label: '走访数量', value: '1' },
	{ label: '走访次数', value: '2' },
	{ label: '走访成果', value: '3' },
]);
const activeType = ref<any>(enterpriseOptions.value[0].value);
const shouldMergeVisitedEnterprise = computed(
	() => ['2', '3', '6','8'].includes(activeUnit.value) && ['1', '2'].includes(activeType.value)
);

const getFollowLegendName = (name: string, type: string) => `${name}${type === '2' ? '次数' : ''}`;
const stackedHorizontalBarChartOption = computed(() => {
	let currentUnit: any = [];
	if (activeType.value === '1') {
		currentUnit = ['家', '家', '家', '家'];
	} else if (activeType.value === '2') {
		currentUnit = ['次', '次', '次', '次'];
	} else if (activeType.value === '3') {
		currentUnit = ['', '条', '个', '条'];
	}
	let legendArr: any = [];
	if (activeType.value === '3') {
		legendArr = ['产生线索', '产生项目', '产生议定事项'];
	} else if (shouldMergeVisitedEnterprise.value) {
		legendArr = [
			getFollowLegendName('已走访任务企业', activeType.value),
			getFollowLegendName('自主走访企业', activeType.value),
		];
	} else {
		legendArr = [
			getFollowLegendName('已走访任务企业', activeType.value),
			getFollowLegendName('自主走访企业', activeType.value),
		];
	}
	const option: any = stackedHorizontalBarOption(followChartData, currentUnit, legendArr);
	
	return option;
});
const transformChartData = (data: any[], type: string) => {
	/*
	const fieldMap: any = {
		'1': {
			primary: 'primaryConnectedCount',
			support: 'supportConnectedCount',
			self: 'selfFollowCount',
		},
		'2': {
			primary: 'primaryDockingCount',
			support: 'supportDockingCount',
			self: 'selfDockingCount',
		},
	};
	*/

	// const fields = fieldMap[type] || fieldMap['1']; // 默认兜底

	if (['1', '2'].includes(type) && shouldMergeVisitedEnterprise.value) {
		return [
			{
				name: getFollowLegendName('已走访任务企业', type),
				data: data.map((item) => ({
					value: item.value1 || 0
				})),
			},
			{
				name: getFollowLegendName('自主走访企业', type),
				data: data.map((item) => ({
					value: item.value2 || 0,
				})),
			},
		];
	}
	
	const ret = [
		{
			name: '产生线索',
			data: data.map((item) => ({
				value: item.value1 || 0,
			})),
		},
		{
			name: '产生项目',
			data: data.map((item) => ({
				value: item.value2 || 0,
			})),
		},
	];


	if (type === '3') {
		ret.push({
			name: '产生议定事项',
			data: data.map((item) => ({
				value: item.value3 || 0,
			})),
		});
	} 
	return ret;
};
const getFollowData = async () => {
	try {
		followChartEmpty.value = false;
		const params = {
			tagId: activeTag.value,
			unitLevel: activeUnit.value,
			watchType: activeType.value,
		};

		/*
		const apiMap: any = {
			1: connectedRateList,
			2: dockingList,
			3: connectedListType,
		};
		*/

		// const { code, data = [] } = await apiMap[activeType.value](params);
		const { code, data = [] }: any = await connectedListType(params);
		// const data: any = await connectedListType(params);
		if (code !== 0) {
			return;
		}

		followChartEmpty.value = !data.length;
		// followChartData.xData = data.map((item: any) => item.unitName);
		followChartData.xData = data.map((item: any) => item.label);
		followChartData.yData = transformChartData(data, activeType.value);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		followChartEmpty.value = true;
	}
};

// 初始化tab栏、跟进企业统计-select栏
const handleSelectChange = () => {
	activeTag.value = tagListTab.value[0].value;
	activeType.value = enterpriseOptions.value[0].value;
};

// 初始化跟进企业统计-select栏
const handleTabChange = () => {
	activeType.value = enterpriseOptions.value[0].value;
};

watch(
	[activeUnit, activeTag, activeType],
	([newUnit, newTag, newType], [oldUnit, oldTag, oldType]) => {
		// 1. 如果是 Unit 或 Tag 变了（顶部 select、Tab 切换），需要刷新所有数据
		const isMainChange = newUnit !== oldUnit || newTag !== oldTag;

		// 2. 如果是 Type 变了（下方 Select 切换），只需要刷新 Follow 数据
		const isSubChange = newType !== oldType;

		if (isMainChange) {
			// 场景：初始化 或 切换顶部 Tab
			// 动作：调用两个接口
			getTargetData();
			getFollowData();
		} else if (isSubChange) {
			// 场景：只切换下方 Select
			// 动作：只调用 Follow 接口
			getFollowData();
		}
	},
	{ immediate: true }
);
</script>
<style lang="less" scoped>
:deep(.el-tabs__nav) {
	overflow-x: auto;
	overflow-y: auto;
	padding-bottom: 0 !important; /* 移除容器底部的预留空隙 */

	.el-tabs__active-bar {
		display: none;
	}
	/* === 核心代码：修改滚动条宽度 === */
	&::-webkit-scrollbar {
		width: 0.08rem; /* 控制垂直滚动条的粗细，默认通常是 0.08rem-0.16rem */
		height: 0.08rem; /* 控制横向滚动条的粗细 */
	}

	/* 滚动条轨道（可选：设置背景色） */
	&::-webkit-scrollbar-track {
		background: transparent; /* 轨道背景透明 */
		border-radius: 0.05rem;
	}

	/* 滚动条滑块（可选：设置滑块颜色和圆角） */
	&::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2); /* 滑块颜色，稍微深一点方便看 */
		background-color: #bcc3f1;
		border-radius: 0.05rem; /* 滑块圆角 */
	}
}

.aim-enterprise-overview {
	flex-shrink: 0;
	height: 9.48rem;
	width: 4.58rem;
	color: rgba(0, 0, 0, 0.6);
	font-size: 0.14rem;
	font-family: MicrosoftYaHei;
	:deep(.outside-content) {
		padding: 0.1rem 0.15rem !important;
		> div,
		.title-container {
			height: auto;
		}
		.header {
			margin-bottom: 0;
		}
	}
	.target-enterprise {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 0.16rem;
		.el-select {
			width: 1.4rem;
			:deep(.el-icon) {
				color: #898989;
			}
			:deep(.el-select__wrapper) {
				font-size: @g-font-size-base;
				min-height: 0.32rem;
				gap: 0.06rem;
				line-height: 0.24rem;
				padding: 0.04rem 0.12rem;
				border-radius: 0.16rem;
			}
		}
		.tabs-icon {
			margin-left: 0.04rem;
			font-size: @g-font-size-medium;
			color: #d2e1ff !important;
			&:hover {
				color: #165dff !important;
			}
		}
	}
	:deep(.tabs-control) {
		> div {
			padding: 0 0.2rem;
		}
	}
	.el-tabs {
		margin-top: 0.2rem;
	}
	.stack-bar-chart-box {
		position: relative;
		height: 3.2rem;
		margin-bottom: 0.2rem;
	}
	.enterprise-follow {
		height: 4.5rem;
	}
}
</style>
<style lang="less">
.el-select-dropdown {
	font-family:
		PingFangSC,
		PingFang SC;
	color: rgba(0, 0, 0, 0.65);
	.el-select-dropdown__item {
		font-size: @g-font-size-base;
		&.is-selected {
			color: #165dff;
		}
	}
}
.tabs-popover {
	padding: 0.16rem 0.24rem;

	.el-popover__title {
		color: rgba(0, 0, 0, 0.85);
		font-size: @g-font-size-medium;
		font-weight: 500;
	}
	.content {
		color: rgba(0, 0, 0, 0.65);
		font-size: @g-font-size-base;
	}
	.symbol {
		color: #266fe8;
		margin: 0 0.04rem;
		font-weight: 500;
	}
}
</style>
