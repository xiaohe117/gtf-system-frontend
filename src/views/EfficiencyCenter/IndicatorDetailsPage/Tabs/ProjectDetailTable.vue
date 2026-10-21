<template>
	<div class="project-detail-table" :class="{ 'is-iframe-mode': useProjectDrillIframe }">
		<SmallTitle
			:title="`${attrs.indicatorData?.indicatorName || ''}指标-${attrs.specialLabel || '项目明细'}`"
		>
			<!-- 指定指标：弹窗内 iframe 嵌入齐明项目明细 -->
			<div v-if="useProjectDrillIframe" class="project-iframe-wrap">
				<IframeView v-if="iframeUrl" :src="iframeUrl" @loaded="handleIframeLoaded" />
			</div>
			<GrowthRateTable
				v-else
				:height="'5.6rem'"
				:tableData="areaData"
				:tableColumns="tableColumns"
				:special-label="attrs.specialLabel || ''"
				:special-prop="'deptName'"
				@handleSortChange="handleSortChange"
			>
				<template #btn>
					<div class="detail-btn" @click="handleClick">详情</div>
				</template>
				<template #entTags="{ row }">
					<EntTagsView :value="row.entTags" />
				</template>
			</GrowthRateTable>
		</SmallTitle>
	</div>
</template>
<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';
import EntTagsView from '@/components/EntTagsView.vue';
import IframeView from '@/components/IframeView.vue';
import ServiceUrl from '@/utils/url';
import SmallTitle from '../components/SmallTitle.vue';
import GrowthRateTable from '../components/GrowthRateTable.vue';

const attrs: any = useAttrs();
const emit = defineEmits(['loaded']);
const areaData = ref<any>([]);
const orderProp = ref<string>('');

/** 需 iframe 嵌入齐明项目明细的指标（按 indicatorCode 匹配） */
const PROJECT_DRILL_IFRAME_INDICATORS = [
	{ indicatorCode: 'XM0000003', indicatorType: 'NEW_SIGN' }, // 新签约招商项目投资总额
	{ indicatorCode: 'XM0000005', indicatorType: 'TEN_INVEST' }, // 投资十亿级项目数
	{ indicatorCode: 'XM0000006', indicatorType: 'HUNDRED_INVEST' }, // 投资百亿级项目数
	{ indicatorCode: 'XM0000007', indicatorType: 'HUNDRED_INCOME' }, // 产值/营收百亿级项目数
	{ indicatorCode: 'XM0000008', indicatorType: 'FILING_TOTAL' }, // 新备案（注册）招商项目计划投资总额
];

const matchedIframeConfig = computed(() =>
	PROJECT_DRILL_IFRAME_INDICATORS.find(
		(item) => item.indicatorCode === attrs.indicatorData?.indicatorCode,
	),
);

const useProjectDrillIframe = computed(() => Boolean(matchedIframeConfig.value));

/**
 * 从「2026年1-3月 / 2026年5月」解析 year、month（区间取结束月）
 */
const parseYearMonth = (dateStr: string) => {
	const year = dateStr?.match(/(\d{4})年/)?.[1] || `${new Date().getFullYear()}`;
	const rangeMatch = dateStr?.match(/年(\d{1,2})-(\d{1,2})月/);
	const singleMatch = dateStr?.match(/年(\d{1,2})月/);
	let month = '01';
	if (rangeMatch?.[2]) {
		month = rangeMatch[2].padStart(2, '0');
	} else if (singleMatch?.[1]) {
		month = singleMatch[1].padStart(2, '0');
	}
	return { year, month };
};

const iframeUrl = computed(() => {
	const config = matchedIframeConfig.value;
	if (!config || !attrs.defaultDate) return '';

	const { year, month } = parseYearMonth(String(attrs.defaultDate));
	const params = [`year=${year}`, `month=${month}`, `indicatorType=${config.indicatorType}`].join(
		'&',
	);

	// 本地用当前域 + Vite /pc 代理，避免跨域丢登录态
	return `${ServiceUrl.getQmEmbedUrl()}/pc/projectManage/projectList/projectDrillListIframe?${params}`;
});

const tableColumns = computed(() => {
	if (attrs.tableColumns && attrs.tableColumns.length > 0) {
		return attrs.tableColumns;
	}
	return [];
});

const handleIframeLoaded = () => {
	emit('loaded', attrs.indicatorData?.id, true);
};

const getTabData = async (defaultDate: any) => {
	if (!defaultDate || useProjectDrillIframe.value) return;
	areaData.value = [];
};

const getData = () => {
	getTabData(attrs.defaultDate);
};

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	orderProp.value = prop;
	areaData.value = areaData.value.sort((a: any, b: any) => {
		if (order === 'asc') {
			return Number(a[prop]) - Number(b[prop]);
		}
		return Number(b[prop]) - Number(a[prop]);
	});
};

const handleClick = () => {
	console.log('click');
};

watch(
	() => [attrs.indicatorData, attrs.defaultDate, useProjectDrillIframe.value] as const,
	() => {
		getData();
	},
	{
		immediate: true,
		deep: true,
	},
);
</script>
<style lang="less" scoped>

.tips {
	color: #202741;
	float: right;
	margin-top: -0.16rem;
}
.detail-btn {
	color: #2d8cf0;
	cursor: pointer;
}
/* 仅 iframe 嵌入时铺满右侧，不影响其他表格 Tab */
.project-detail-table.is-iframe-mode {
	height: 6.1rem;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	:deep(.small-title-wrapper) {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding-bottom: 0;
		box-sizing: border-box;
	}
	:deep(.content-part) {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.project-iframe-wrap {
		flex: 1;
		min-height: 0;
		width: 100%;
		overflow: hidden;
	}
	:deep(.iframe-container) {
		height: 100% !important;
		min-height: 0 !important;
	}
	:deep(.iframe-content) {
		height: 100% !important;
	}
}
</style>
