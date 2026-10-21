<!--
 * @Descripttion:投发委办部门页面
 * @Author: ycyun
 * @Date: 2026-06-03 11:16:11
 * @LastEditors: ycyun
 * @LastEditTime: 2026-06-03 11:34:13
-->
<template>
	<TitleBody class="special-dept-overview" :name="`${title}招商总览`">
		<template #extra>
			<div class="title-extra">
				<el-select v-model="dateMode" class="mode-select" @change="handleDateModeChange">
					<el-option label="累计月" value="cumulative" />
					<el-option label="自定义" value="custom" :disabled="isSixBatchTable" />
				</el-select>
				<DateSelect
					v-if="dateMode === 'cumulative'"
					class="time-select"
					v-model="selectedCumulativeLabel"
					:options="dateOptions"
					@change="handleCumulativeChange"
				/>
				<DateTimeRangePicker
					v-else
					v-model="customDateRange"
					type="date"
					class="custom-date-picker"
					@change="handleCustomDateChange"
				/>
			</div>
		</template>
		<NewTopCard v-model="cardCode" :dateValue="dateValue" :department-name="title" />
		<main ref="mainRef" :class="{ 'has-many-tabs': tabs.length > 3 }">
			<TitleSelect :tabs="tabs" v-model="curTitleTab">
				<template #btn>
					<el-button
						v-if="isSceneCard"
						class="export-btn"
						type="primary"
						:loading="exportLoading"
						@click="handleSceneExport"
					>
						导出
					</el-button>
					<div class="full-screen" @click="toggleFullScreen">
						<span>{{ isFullscreen ? '取消全屏' : '全屏' }}</span>
						<el-icon><FullScreen /></el-icon>
					</div>
				</template>
			</TitleSelect>
			<component
				:is="curComponent"
				class="table-box"
				:curTitleTab="curTitleTab"
				:dateValue="dateValue"
				v-bind="$attrs"
			/>
		</main>
	</TitleBody>
</template>

<script lang="ts" setup>
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ElMessage } from 'element-plus';
import { getLatestSixBatchSummaryYearMonth, queryTimeOptions } from '@/api/commandCenter/deptOverview';
import { prefix } from '@/api/http';
import DateSelect from '@/views/CommandCenter/OverallSituation/Components/DateSelect.vue';
import DateTimeRangePicker from '../Components/DateTimeRangePicker.vue';
import { cardData } from './data';
import tableConfig from './Table/config';
import NewTopCard from './NewTopCard.vue';
import TitleSelect from '../Components/TitleSelect.vue';


defineProps({
    title: {
		type: String,
		default: '',
	},
})

const dateMode = ref<'cumulative' | 'custom'>('cumulative');
const customDateRange = ref<[string, string] | null>(null);
const cardCode = ref();
const curTitleTab: any = ref(1);
const currentCard: any = computed(() => cardData.find((item: any) => item.type === cardCode.value));
const tabs: any = computed(() => (currentCard.value && currentCard.value.tabs) || []);
const currentTab = computed(() => tabs.value.find((item: any) => item.value === curTitleTab.value));
const isSceneCard = computed(() => currentCard.value?.cardKey === 'scene');

/** 当前是否在"广州市招商引资项目六个一批情况表" */
const isSixBatchTable = computed(() => curTitleTab.value === 'projectCityColumns');

// 切换tabs的数据，默认选择第一个
watch(
	() => tabs.value,
	(val) => {
		curTitleTab.value = val[0]?.value;
	},
	{ immediate: true }
);

const curComponent = computed(() => currentTab.value?.comp);

const dateOptions: any = ref([]);

/** 累积月选中的标签值 */
const selectedCumulativeLabel = ref('');

/** 日期值对象: { startTimeStr, endTimeStr } */
const dateValue = ref<{ startTimeStr: string; endTimeStr: string }>({
	startTimeStr: '',
	endTimeStr: '',
});
const exportLoading = ref(false);

const downloadBlob = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
};

/** 判断导出结果是否为后端错误 JSON */
const isExportErrorBlob = async (data: Blob) => {
	if (!(data instanceof Blob)) return true;
	if (data.type && data.type.includes('application/json')) return true;
	if (data.size > 0 && data.size < 2048) {
		try {
			const text = await data.text();
			const json = JSON.parse(text);
			return json && (json.code !== undefined || json.msg !== undefined);
		} catch {
			return false;
		}
	}
	return false;
};

/** 场景表导出：本页直接 axios + blob，不走公共 http（其未透传 responseType） */
const handleSceneExport = async () => {
	const c = tableConfig[String(curTitleTab.value)];
	if (!c?.searchParams || !dateValue.value.startTimeStr || !dateValue.value.endTimeStr) {
		ElMessage.warning('请先选择时间范围');
		return;
	}
	exportLoading.value = true;
	try {
		const timestamp = (Date.now() / 1000).toFixed();
		const nonce = '2fc62edd-03ee-4c32-8db8-e7e9c77ed05a';
		const token = import.meta.env.VITE_APP_TOKEN;
		const signature = CryptoJS.SHA256(timestamp + token + nonce + timestamp)
			.toString(CryptoJS.enc.Hex)
			.toUpperCase();
		const res = await axios({
			method: 'post',
			baseURL: import.meta.env.VITE_APP_BASE_API,
			url: `${prefix}/oneDeptOneCard/scene/table/export`,
			data: {
				...dateValue.value,
				...c.searchParams,
			},
			responseType: 'blob',
			timeout: 1000 * 60,
			headers: {
				'x-tif-paasid': 'sjfnjczt',
				'x-tif-signature': signature,
				'x-tif-timestamp': timestamp,
				'x-tif-nonce': nonce,
				nonce,
				timestamp,
				signature,
			},
		});
		const blob = res.data as Blob;
		if (await isExportErrorBlob(blob)) {
			ElMessage.error('导出失败');
			return;
		}
		downloadBlob(blob, `${currentTab.value?.name || '招商场景'}.xlsx`);
		ElMessage.success('导出成功');
	} catch {
		ElMessage.error('导出失败');
	} finally {
		exportLoading.value = false;
	}
};

/** 获取月最后一天 */
const getLastDayOfMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

/** 解析 "2026年1-5月" → { startTimeStr, endTimeStr } */
const parseCumulativeMonth = (
	label: string
): { startTimeStr: string; endTimeStr: string } | null => {
	const match = label.match(/^(\d{4})年(\d{1,2})-(\d{1,2})月$/);
	if (!match) return null;
	const year = match[1];
	const endMonth = match[3].padStart(2, '0');
	const lastDay = String(getLastDayOfMonth(Number(year), Number(endMonth))).padStart(2, '0');
	return {
		startTimeStr: `${year}-01-01 00:00:00`,
		endTimeStr: `${year}-${endMonth}-${lastDay} 23:59:59`,
	};
};

/** 累积月选择变更（DateSelect v-model） */
const handleCumulativeChange = (value: string) => {
	selectedCumulativeLabel.value = value;
	const parsed = parseCumulativeMonth(value);
	if (parsed) {
		dateValue.value = { startTimeStr: parsed.startTimeStr, endTimeStr: parsed.endTimeStr };
	}
};

/** 模式切换 */
const handleDateModeChange = () => {
	if (dateMode.value === 'cumulative') {
		customDateRange.value = null;
		if (selectedCumulativeLabel.value) {
			handleCumulativeChange(selectedCumulativeLabel.value);
		}
	} else {
		selectedCumulativeLabel.value = '';
		dateValue.value = { startTimeStr: '', endTimeStr: '' };
	}
};

/** 自定义日期范围变更 */
const handleCustomDateChange = (val: [string, string] | null) => {
	if (val) {
		dateValue.value = {
			startTimeStr: `${val[0]} 00:00:00`,
			endTimeStr: `${val[1]} 23:59:59`,
		};
	} else {
		dateValue.value = { startTimeStr: '', endTimeStr: '' };
	}
};

/** 选中六个一批表的最新有数据年月 */
const selectLatestSixBatchMonth = async () => {
	try {
		const res: any = await getLatestSixBatchSummaryYearMonth({});
		const data = res?.data;
		if (!data?.year || !data?.month) return;
		const { year, month: latestMonth } = data;
		const latestLabel = `${year}年1-${Number(latestMonth)}月`;
		handleCumulativeChange(latestLabel);
	} catch {
		// 接口失败保持现有状态
	}
};

// 六个一批表不允许自定义日期，强制切回累积月
watch(isSixBatchTable, (isSixBatch) => {
	if (isSixBatch) {
		if (dateMode.value === 'custom') {
			dateMode.value = 'cumulative';
			handleDateModeChange();
		}
		selectLatestSixBatchMonth();
	}
});
const mainRef = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);
const toggleFullScreen = () => {
	if (!mainRef.value) return;
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		mainRef.value.requestFullscreen();
	}
};

// 获取时间下拉选择项
queryTimeOptions().then((res: any) => {
	const option = res.data?.accumulatedOptions || [];
	dateOptions.value = option?.map((item: any) => item.label) || [];
	if (isSixBatchTable.value) {
		// 若初始化已经选择了全市招商引资项目"六个一批"情况表，不能使用接口默认数据
		return;
	}
	const { defaultStartTimeStr, defaultEndTimeStr } = res.data;
	const defaultObj = option?.find(
		(item: any) =>
			item.startTimeStr === defaultStartTimeStr && item.endTimeStr === defaultEndTimeStr
	);
	selectedCumulativeLabel.value = defaultObj ? defaultObj.label : dateOptions.value[0];
});

const onFullscreenChange = () => {
	isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
	document.addEventListener('fullscreenchange', onFullscreenChange);
});
onUnmounted(() => {
	document.removeEventListener('fullscreenchange', onFullscreenChange);
});
</script>
<style lang="less" scoped>
.special-dept-overview {
	:deep(.title-body-content) {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: auto;
		min-height: 0;
	}
	main {
		display: flex;
		flex: 1;
		min-height: 0;
		flex-direction: column;
		background: #fff;
		margin-top: 0.3rem;
		border-radius: 0.14rem 0.14rem 0 0;
		padding-bottom: 0.24rem;
		.table-box {
			flex: 1;
			min-height: 0;
			padding: 0 0.24rem;
		}
		&.has-many-tabs {
			.type-list .type-item {
				width: 1rem;
			}
		}
		.type-list {
			display: flex;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.45);
			font-weight: 400;
			margin-left: 0.24rem;
			.type-item {
				width: 1.2rem;
				height: 0.36rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #ffffff;
				border-radius: 0.05rem;
				border: 0.01rem solid #8c8c8c;
				margin-right: 0.16rem;
				cursor: pointer;
				&.active {
					background: #165dff;
					color: #ffffff;
				}
			}
		}
	}
	.full-screen {
		font-size: 0.18rem;
		margin-right: 0.3rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 400;
		white-space: nowrap;
		min-height: 0.56rem;
		&:hover {
			color: #165dff;
		}
		.el-icon {
			font-size: 0.26rem;
			margin-left: 0.04rem;
		}
	}
	.export-btn {
		height: 0.32rem;
		margin-right: 0.18rem;
		font-size: 0.16rem;
	}
	:deep(.el-select__wrapper) {
		line-height: 0.36rem;
		min-height: 0.36rem;
		font-size: 0.18rem;
	}
	.cycle-select {
		width: 1.8rem;
		margin-right: 0.16rem;
	}
	.title-extra {
		display: flex;
		align-items: center;
	}
	.mode-select {
		width: 1.4rem;
		margin-right: 0.16rem;
	}

	.custom-date-picker {
		width: 3rem;
	}
}
</style>
<style lang="less">
.dept-detail-dialog {
	.el-table thead .cell {
		font-size: @g-font-size-base !important;
	}
}
</style>
