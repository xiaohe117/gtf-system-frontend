<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-06-21 16:55:53
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-07 16:46:56
-->
<template>
	<div class="overview-left">
		<div class="top-content">
			<TitleBody name="招商活动" class="left">
				<template #extra>
					<RoundRectTabs
						v-model="activityTab"
						:tabsList="['市领导会见', '部门重点活动']"
					></RoundRectTabs>
				</template>
				<ul class="activity-list">
					<li v-for="(item, index) in activityList" :key="index" class="bg-box">
						<div class="top">
							<span class="tag">{{ item.type }}</span>
							<el-tooltip
								class="box-item"
								effect="dark"
								:content="item.content || '-'"
								placement="top-start"
							>
								<span class="text-content">{{ item.content || '-' }}</span>
							</el-tooltip>
						</div>
						<div class="bottom">
							<span class="add-circle"></span>
							<span class="text-label">拜访企业：</span>
							<span class="text-content">{{ item.companys || '-' }}</span>
							<template v-if="item.dateTime">
								<span class="add-circle"></span>
								<span>{{ item.dateTime || '-' }}</span>
							</template>
						</div>
					</li>
				</ul>
			</TitleBody>
			<TitleBody name="招商部门行动" class="right">
				<template #extra>
					<RoundRectTabs
						v-model="chartTab"
						:tabsList="['招商项目', '目标企业']"
					></RoundRectTabs>
				</template>
				<div class="chart-box">
					<ChartContainer :chartOption="barOption" />
				</div>
			</TitleBody>
		</div>
		<div class="bottom-content">
			<TitleBody name="招商行动策划" class="left">
				<ul class="plan-list">
					<li
						v-for="(item, index) in planList"
						:key="index"
						class="bg-box"
						@click="item.clickFunc"
					>
						<div class="img-box">
							<img :src="item.img" alt="" />
						</div>
						<div class="right-text">
							<p class="label">{{ item.label }}</p>
							<!-- <p class="number">制定{{ item.count }}条计划</p> -->
						</div>
					</li>
				</ul>
				<DynamicTable
					class="table-box"
					:tableData="tableData"
					:columns="columns"
					max-height="2.25rem"
				></DynamicTable>
			</TitleBody>
			<TitleBody name="主抓项目" class="right project">
				<template #extra>
					<el-input
						class="search-input"
						v-model="projectKeyword"
						maxlength="100"
						placeholder="请输入项目名称搜索"
						>>
						<template #prefix>
							<el-icon><Search /></el-icon>
						</template>
					</el-input>
				</template>
				<el-tabs v-model="projectTab">
					<el-tab-pane
						v-for="item in projectTypes"
						:label="`${item.label}(${item.count})`"
						:name="item.prop"
						:key="item.label"
					>
					</el-tab-pane>
				</el-tabs>
				<ul class="project-list">
					<li v-for="(item, index) in projectList" :key="item.projectName + index" @click="goProject(item)">
						<div class="top-name">
							<el-tag v-if="item.stage" type="primary">{{
								item.stage
							}}</el-tag>
							<el-tag v-if="item.isTag === '是'" type="warning">开门红</el-tag>
							<span class="name">{{ item.projectName }}</span>
						</div>
						<div class="count-box">
							<div class="count-item">
								<span>预计总投资</span>
								<span>{{ item.total ? `${item.total}亿元` : '--' }} </span>
							</div>
							<div class="count-item">
								<span>预计达产年产值/营收 </span>
								<span>{{ item.count ? `${item.count}亿元` : '--' }}</span>
							</div>
						</div>
					</li>
				</ul>
			</TitleBody>
		</div>
		<TableDialog ref="tableDialogRef" />
		<PreviewPdf ref="previewPdfRef" />
	</div>
</template>
<script lang="ts" setup>
import RoundRectTabs from '@/components/RoundRectTabs.vue';
import dayjs from 'dayjs';
import { getUrl } from '@/utils';
import DynamicTable from '@/components/table/DynamicTable.vue';
import TableDialog from './components/TableDialog.vue';
import PreviewPdf from './components/PreviewPdf.vue';
import { getBarOption, planColumns, getExcelData } from './data';

const activityTab = ref(0);
const activityList = ref([]) as any;
const chartTab = ref(0);
const barOption = ref();
watch(
	() => chartTab.value,
	() => {
		barOption.value = getBarOption(chartTab.value);
		console.log(barOption.value);
	},
	{ immediate: true }
);
const tableDialogRef = ref();
const openTableDialog = () => {
	tableDialogRef.value.show();
};
const previewPdfRef = ref();
const planList = ref([
	{
		label: '类松山湖园区方案',
		count: 1234,
		img: getUrl('toufawOverview/plan-icon-1.png'),
		clickFunc: () => {
			previewPdfRef.value.show('类松山湖园区方案', '类松山湖园区方案');
		},
	},
	{
		label: '一企一案',
		count: 1234,
		img: getUrl('toufawOverview/plan-icon-2.png'),
		clickFunc: openTableDialog,
	},
]);
function excelDateToJSDate(serial: any) {
	// Excel日期系统：1900年1月0日为0（但实际1900年有闰年错误）
	// 1970年1月1日在Excel中是25569（1900系统）或24107（1904系统）

	const utcdays = Math.floor(serial - 25569);
	const utcvalue = utcdays * 86400; // 一天86400秒
	const dateinfo = new Date(utcvalue * 1000); // 转换为毫秒

	// 处理小数部分（时间）
	const fractionalday = serial - Math.floor(serial) + 0.0000001;
	const totalseconds = Math.floor(86400 * fractionalday);

	const seconds = totalseconds % 60;
	const minutes = Math.floor(totalseconds / 60) % 60;
	const hours = Math.floor(totalseconds / 3600);

	dateinfo.setSeconds(seconds);
	dateinfo.setMinutes(minutes);
	dateinfo.setHours(hours);

	return dateinfo;
}
// 获取活动列表
const getActivityData = () => {
	getExcelData('./excel/toufawActivity.xlsx', 0).then((res: any) => {
		const type = activityTab.value === 0 ? '会见活动' : '工作会议';
		const arr = res
			.sort((a: any, b: any) => a.index - b.index)
			.filter((item: any) => item.type === type);
		activityList.value = [];
		arr.forEach((item: any) => {
			const text = item.event || '';
			if (item.cleanTime) {
				const time = excelDateToJSDate(item.cleanTime);
				item.dateTime = dayjs(time).format('YYYY-MM-DD');
			}
			// const dayIndex = text.indexOf('日');
			// const part1 = text.substring(0, dayIndex); // +1 包含"日"
			// const part2 = text.substring(dayIndex + 2);
			activityList.value.push({
				...item,
				content: text,
			});
		});
	});
};

watch(
	() => activityTab.value,
	() => {
		getActivityData();
	},
	{ immediate: true }
);

const tableData = ref([]) as any;
const columns: any = planColumns;
const getCompanyData = () => {
	getExcelData('./excel/toufawTargetCompany.xlsx', 0).then((res: any) => {
		tableData.value = res.map((item: any) => ({
			...item,
			tableIndex: Number(item.index),
			tags: item.tag ? [{ name: item.tag, type: 'warning' }] : [],
		}));
	});
};
getCompanyData();
const projectTab = ref('全部');
const projectTypes = ref([
	{ label: '全部', count: 0, prop: '全部' },
	{ label: '重点分局', count: 0, prop: '重点' },
	{ label: '未来分局', count: 0, prop: '未来' },
	{ label: '新兴分局', count: 0, prop: '新兴' },
	{ label: '活动专班', count: 0, prop: '联络' },
	{ label: '现服分局', count: 0, prop: '现代' },
]);
const allProjects = ref([]) as any;
const projectKeyword = ref('');
const projectList = computed(() => {
	const arr =
		projectTab.value === '全部'
			? allProjects.value
			: allProjects.value.filter(
					(item: any) => item.dept?.substring(0, 2) === projectTab.value
			  );
	return arr.filter(
		(item: any) => !projectKeyword.value || item.projectName.indexOf(projectKeyword.value) > -1
	);
}) as any;
const getProjectData = () => {
	getExcelData('./excel/toufawProject.xlsx', 0).then((res: any) => {
		projectTypes.value.forEach((ele) => {
			ele.count =
				ele.prop === '全部'
					? res.length
					: res.filter((item: any) => item.dept?.substring(0, 2) === ele.prop)?.length;
		});
		allProjects.value = res;
	});
};
getProjectData();
watch(
	() => projectTab.value,
	() => {
		// getProjectData();
	},
	{ immediate: true }
);
const goProject = (item: any) => {
	if (!item.url) return;
	window.open(item.url);
};
</script>
<style lang="less" scoped>
:deep(.el-tabs__nav-scroll){
	overflow: auto;
	padding-bottom: 0.04rem;
	&::-webkit-scrollbar {
		height: 0.08rem;
	}
	/*定义滑块 内阴影+圆角*/
	&::-webkit-scrollbar-thumb {
		border-radius: 0.08rem;
	}
}
.overview-left {
	height: 100%;
	width: 100%;
	color: rgba(0, 0, 0, 0.85);
	font-size: @g-font-size-base;
	font-weight: 400;
	font-family: PingFangSC, PingFang SC;
	.add-circle {
		display: inline-block;
		width: 0.12rem;
		height: 0.12rem;
		background: #ffffff;
		border: 0.02rem solid #408fff;
		border-radius: 50%;
		margin-right: 0.08rem;
	}
	.top-content,
	.bottom-content {
		height: 50%;
		display: flex;
		.left,
		.right {
			width: calc(50% - 0.12rem);
		}
		.right {
			margin-left: 0.24rem;
		}
	}
	.bottom-content {
		margin-top: 0.1rem;
		height: calc(50% - 0.1rem);
	}
	.bg-box {
		background: rgba(169, 181, 255, 0.1);
		border-radius: 8px;
		border: 1px solid #ffffff;
	}
	.activity-list {
		li {
			padding: 0.08rem;
			margin-top: 0.16rem;
			&:first-child {
				margin-top: 0;
			}
		}
		.top {
			margin-bottom: 0.08rem;
		}
		.bottom {
			color: rgba(0, 0, 0, 0.65);
		}
		.top,
		.bottom {
			display: flex;
			align-items: center;
			.text-content {
				display: inline-block;
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.text-label {
				flex-shrink: 0;
			}
		}
		.tag {
			background: #e6f7ff;
			border-radius: 0.02rem;
			border: 0.01rem solid #91d5ff;
			font-size: @g-font-size-x-small;
			color: #1890ff;
			line-height: 0.2rem;
			font-weight: 400;
			padding: 0.02rem 0.08rem;
			margin-right: 0.08rem;
		}
	}
	.chart-box {
		height: 100%;
		overflow: hidden;
	}
	:deep(.title-container) {
		header {
			align-content: center;
		}
		.title-body-content {
			width: 100%;
			height: auto;
			flex: 1;
			overflow: auto;
			&:hover {
				&::-webkit-scrollbar {
					background-color: rgba(169, 181, 255, 0.9);
				}
				/*定义滑块 内阴影+圆角*/
				&::-webkit-scrollbar-thumb {
					background-color: rgba(169, 181, 255, 0.9);
				}
			}
			&::-webkit-scrollbar {
				width: 0.04rem;
				height: 0.06rem;
				opacity: 0;
			}
			/*定义滑块 内阴影+圆角*/
			&::-webkit-scrollbar-thumb {
				border-radius: 0.02rem;
				background-color: rgba(169, 181, 255, 0);
				opacity: 0;
			}
		}
	}
	.plan-list {
		display: flex;
		justify-content: space-between;
		li {
			width: calc(50% - 0.08rem);
			display: flex;
			align-items: center;
			padding: 0.05rem 0;
			cursor: pointer;
			.img-box {
				width: 1.02rem;
				height: 0.9rem;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.right-text {
				.label {
					font-size: @g-font-size-medium;
					line-height: 0.22rem;
					color: rgba(0, 0, 0, 0.85);
					font-weight: 500;
				}
				.number {
					font-size: 0.14rem;
					line-height: 0.22rem;
					color: rgba(0, 0, 0, 0.65);
					margin-top: 0.08rem;
				}
			}
		}
	}
	.table-box {
		margin-top: 0.16rem;
		flex: 1;
	}
	.project {
		:deep(.title-body-content) {
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: hidden;
		}
	}
	.search-input {
		height: 0.36rem;
		line-height: 0.36rem;

		:deep(.el-input__wrapper) {
			border-radius: 0.02rem;
			box-shadow: 0 0 0 0.01rem #aaccff inset;
		}
	}
	:deep(.el-tabs__nav) {
		.el-tabs__item {
			width: 25% !important;
		}
	}
	.project-list {
		flex: 1;
		overflow: auto;
		li {
			font-size: @g-font-size-base;
			border-bottom: 1px solid #aaccff;
			padding-bottom: 0.09rem;
			padding-top: 0.13rem;
			width: 100%;
			&:last-child {
				border-bottom: 0;
			}
			.top-name {
				display: flex;
				align-items: center;
				.el-tag {
					font-size: @g-font-size-x-small;
					border-radius: 0.02rem;
					--el-color-primary-light-8: rgba(22, 93, 255, 0.5);
					--el-color-primary: #165dff;
					--el-color-warning: #ed7b2f;
					--el-color-warning-light-8: #ed7b2f;
					--el-color-success: #00a870;
					--el-color-success-light-8: rgba(0, 168, 112, 0.5);

					line-height: 0.2rem;
					height: auto;
					padding: 0.01rem 0.08rem;
					& + .el-tag {
						margin-left: 0.05rem;
					}
				}
				.name {
					margin-left: 0.08rem;
				}
			}
			.count-box {
				display: flex;
				align-items: center;
				font-size: @g-font-size-small;
				color: rgba(0, 0, 0, 0.45);
				margin-top: 0.08rem;
				.count-item {
					&:first-child {
						width: 2rem;
					}
					span {
						&:first-child {
							margin-right: 0.08rem;
						}
					}
				}
			}
		}
	}

	.project-tabs {
		:deep(.tabs-control_item) {
			padding: 0.02rem 0.16rem;
		}
	}
}
</style>
<style lang="less"></style>
