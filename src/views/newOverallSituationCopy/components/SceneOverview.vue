<template>
	<FrameBox
		v-loading="loading"
		class="module-frame scene-frame"
		element-loading-background="rgba(255, 255, 255, 0.72)"
	>
		<section class="module scene-overview">
			<header class="module-header">
				<div class="header-left">
					<div class="header-title-item">
						<span class="module-title">场景总览</span>
						<div class="title-bg"></div>
					</div>
					<span class="target-text">任务数：</span>
					<strong>{{ resOverview.target.value }}</strong>
					<span class="wcl"
						>个，完成率：<a>{{ resOverview.target.suffix }}%</a></span
					>
				</div>
				<button @click="goScene()" class="enter-btn">
					<img :src="getImage('more.png')" alt="" />
				</button>
			</header>

			<div class="scene-metrics">
				<div>
					<span>提交场景数</span>
					<p>
						<strong>{{ resOverview.summary.submittedSceneCount }}</strong>
						<small>个</small>
					</p>
				</div>
				<div>
					<span>有效待匹配数</span>
					<p>
						<strong>{{ resOverview.summary.qualifiedSceneCount }}</strong>
						<small>个</small>
					</p>
				</div>
				<div>
					<span>完成匹配数</span>
					<p>
						<strong>{{ resOverview.summary.validSceneCount }}</strong>
						<small>个</small>
					</p>
				</div>
			</div>
			<div class="scene-table">
				<el-table
					class="scene-el-table"
					:data="sceneRows"
					height="100%"
					row-key="name"
					scrollbar-always-on
				>
					<el-table-column
						prop="name"
						label="12218产业体系"
						:min-width="110"
						align="center"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="open"
						:label="'开放方\n场景(个)'"
						:min-width="62"
						align="center"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="ability"
						:label="'能力方\n场景(个)'"
						:min-width="62"
						align="center"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="publish"
						:label="'已发布\n场景(个)'"
						:min-width="62"
						align="center"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="project"
						:label="'转化项目\n数(个)'"
						:min-width="62"
						align="center"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="invest"
						:label="'预计总投资\n(万元)'"
						:min-width="76"
						align="center"
						show-overflow-tooltip
					/>
				</el-table>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import router from '@/router';
import { storeToRefs } from 'pinia';
import status from '@/stores/status';
import { querySceneTable } from '@/api/commandCenter/deptOverview';
import { sceneIndustry } from '@/api/OverallSituation';

// 全局年月筛选值
const statusStore = status();
const { yearSelectValue } = storeToRefs(statusStore);
// 获取当前年月对应的查询时间范围
const { getCurrentDate } = statusStore;
const loading = ref(false);

// 场景总览表格展示数据
const sceneRows = ref<
	{
		name: string;
		open: number | string;
		ability: number | string;
		publish: number | string;
		project: number | string;
		invest: string;
	}[]
>([]);

const formatAmount = (val: unknown) => {
	if (val === null || val === undefined || val === '') return '--';
	const num = Number(String(val).replace(/,/g, ''));
	return Number.isFinite(num) ? num.toFixed(2) : String(val);
};

const fallback = (val: any) => (val === 0 || val === '0' ? val : val || '--');

/** 从接口响应中安全取出汇总首行；无数据时返回 null */
const pickSummaryRow = (res: any): Record<string, any> | null => {
	const data = res?.data;
	if (data == null) return null;
	// 场景总览：data.rows 数组
	if (Array.isArray(data.rows)) {
		const first = data.rows[0];
		return first && typeof first === 'object' ? first : null;
	}
	// 兼容 data 直接为数组
	if (Array.isArray(data)) {
		const first = data[0];
		return first && typeof first === 'object' ? first : null;
	}
	// 兼容 data 直接为对象
	if (typeof data === 'object') return data;
	return null;
};

const getSceneIndustry = async () => {
	try {
		const res = await sceneIndustry<
			{
				industryTypeName: string;
				openCount: number;
				abilityCount: number;
				publishedCount: number;
				projectCount: number;
				projectAmount: number;
			}[]
		>({ date: yearSelectValue.value });
		if (res.code === 0 && Array.isArray(res.data) && res.data.length) {
			sceneRows.value = res.data.map((item) => ({
				name: item.industryTypeName,
				open: fallback(item.openCount),
				ability: fallback(item.abilityCount),
				publish: fallback(item.publishedCount),
				project: fallback(item.projectCount),
				invest: formatAmount(item.projectAmount),
			}));
		} else {
			// 无数据时清空表格，避免沿用上一次旧数据
			sceneRows.value = [];
		}
	} catch (error) {
		console.error('getSceneIndustry failed:', error);
		sceneRows.value = [];
	}
};

// 拼接本模块图片路径
const getImage = (name: string) => new URL(`../image/${name}`, import.meta.url).href;

// 进入场景运营中心页面
const goScene = () => {
	router.push({ path: '/operationCenter/scene' });
};

// 初始展示和接口失败时的兜底数据
const getDefaultOverview = () => ({
	target: {
		value: '--',
		suffix: '--',
	},
	summary: {
		submittedSceneCount: '--',
		qualifiedSceneCount: '--',
		validSceneCount: '--',
	},
});

// 场景总览接口回填数据
const resOverview = ref(getDefaultOverview());

// 查询场景总览统计数据
const getSceneOverview = async () => {
	// 当前筛选时间范围
	const currentDate = getCurrentDate();
	if (!currentDate) return;
	const { startTimeStr, endTimeStr } = currentDate;
	try {
		const res: any = await querySceneTable({
			startTimeStr,
			endTimeStr,
			tabType: 'CITY_OVERVIEW',
		});
		// 接口只取汇总首行；data / rows 为空时走兜底
		const row = pickSummaryRow(res);
		if (res?.code === 0 && row) {
			resOverview.value.target.value = fallback(row.taskCount);
			resOverview.value.target.suffix = fallback(row.completionRate);
			resOverview.value.summary.submittedSceneCount = fallback(row.submittedSceneCount);
			resOverview.value.summary.qualifiedSceneCount = fallback(row.pendingMatchCount);
			resOverview.value.summary.validSceneCount = fallback(row.completedMatchCount);
		} else {
			resOverview.value = getDefaultOverview();
		}
	} catch (error) {
		console.error('getSceneOverview failed:', error);
		// 请求异常时回退占位，避免沿用上一次旧数据
		resOverview.value = getDefaultOverview();
	}
};

const refreshData = async () => {
	loading.value = true;
	try {
		await Promise.all([getSceneOverview(), getSceneIndustry()]);
	} finally {
		loading.value = false;
	}
};

// 年月切换后刷新接口数据
watch(
	() => yearSelectValue.value,
	(newVal) => {
		if (newVal) {
			refreshData();
		}
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import './moduleCommon.less';

.wcl {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.17rem;
	line-height: 0.25rem;
	color: rgba(0, 0, 0, 0.7);
	a {
		font-family: DINAlternate, DINAlternate;
		font-weight: bold;
		font-size: 0.2rem;
		color: #165dff;
	}
}

.scene-frame {
	min-height: 0;
	overflow: hidden;

	:deep(.outside-content) {
		min-height: 0;
		overflow: hidden;
		box-shadow: none;
	}

	:deep(.outside-content > div) {
		min-height: 0;
		overflow: hidden;
	}
}

.scene-overview {
	min-height: 0;
	overflow: hidden;
}

.scene-metrics {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	flex: 0 0 clamp(0.55rem, 6.6vh, 0.7rem);
	align-items: start;
	padding: clamp(0.07rem, 1.1vh, 0.12rem) clamp(0.16rem, 1.8vw, 0.36rem) 0;
	background: url('../image/section-line.png') center bottom / 100% 0.11rem no-repeat;

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-weight: 700;
	}

	span {
		font-size: 0.15rem;
		line-height: clamp(0.15rem, 1.7vh, 0.18rem);
		color: #202a36;
		font-family:
			PingFangSC,
			PingFang SC;
	}

	p {
		display: flex;
		align-items: baseline;
		margin: 0.07rem 0 0;
	}

	strong {
		font-family: DINAlternate, DINAlternate;
		font-weight: bold;
		font-size: 0.24rem;
		color: #165dff;
		line-height: clamp(0.21rem, 2.3vh, 0.25rem);
	}

	small {
		margin-left: 0.15rem;
		line-height: clamp(0.17rem, 1.9vh, 0.2rem);
		font-weight: 400;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.65);
	}
}

.scene-table {
	flex: 1 1 0;
	height: 0;
	min-height: 0;
	overflow-x: auto;
	overflow-y: hidden;
	padding-top: 0.04rem;
}

.scene-el-table {
	width: 100%;
	height: 100%;
	min-width: 4.66rem;
	border: 0.01rem solid #b6d7ff;
	background: transparent;
	color: #4c5968;
	font-size: 0.13rem;
	font-weight: 700;

	:deep(.el-table__inner-wrapper::before),
	:deep(.el-table__inner-wrapper::after) {
		display: none;
	}

	:deep(.el-table__border-left-patch) {
		display: none;
	}

	:deep(.el-table__header-wrapper th.el-table__cell) {
		height: clamp(0.3rem, 3.4vh, 0.36rem);
		padding: 0;
		border-right: 0.01rem solid #bddcff;
		border-bottom: 0.01rem solid #bddcff;
		background: #e7f5ff;
		color: #3f4d5c;
		font-weight: 700;
	}

	:deep(.el-table__header-wrapper th.el-table__cell:last-child),
	:deep(.el-table__body-wrapper td.el-table__cell:last-child) {
		border-right: 0;
	}

	:deep(.el-table__cell .cell) {
		padding: 0 0.04rem;
		line-height: 0.17rem;
		white-space: pre-line;
	}

	:deep(.el-table__body-wrapper td.el-table__cell) {
		height: clamp(0.28rem, 3.1vh, 0.33rem);
		padding: 0;
		border-right: 0.01rem solid #bddcff;
		border-bottom: 0.01rem solid #bddcff;
		background: rgba(255, 255, 255, 0.9);
		color: #4b5665;
		font-size: 0.13rem;
		font-weight: 700;
	}

	:deep(.el-table__body tr:nth-child(even) td.el-table__cell) {
		background: #e5f2ff;
	}

	:deep(.el-table__body tr:hover > td.el-table__cell) {
		background: #e5f2ff;
	}

	:deep(.el-table__body-wrapper td.el-table__cell:first-child .cell) {
		padding-left: 0.08rem;
		white-space: nowrap;
		text-align: center;
	}

	:deep(.el-table__header),
	:deep(.el-table__body),
	:deep(.el-table__header-wrapper),
	:deep(.el-table__body-wrapper) {
		background: transparent;
	}
}
</style>
