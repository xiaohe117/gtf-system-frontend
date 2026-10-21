<template>
	<div class="industry-tabs-container">
		<TabsSidebar
			v-model:active-idx="activeSubIdx"
			:tabs="sidebarTabs"
			@pause="emit('pause')"
			@resume="emit('resume')"
		/>
		<div class="industry-content-panel">
			<div class="panel-top-tags">
				<span
					v-for="(tag, tIdx) in topTags"
					v-show="isCityWideSelected || !RESTRICTED_TAG_NAMES.includes(tag.name)"
					:key="tIdx"
					class="panel-tag"
					:class="{ 'panel-tag-active': activeTopIdx === tIdx }"
					@click="onTopTagClick(tIdx)"
				>
					{{ tag.name }}
				</span>
			</div>
			<div class="panel-divider-line"></div>
			<div class="panel-content-scroll">
				<IndustryContent
					v-if="currentElementTag"
					:industry-code="industryCode"
					:element-type="currentElementTag.elementType"
					:region-code="currentRegionCode"
				/>
				<ActionPanel v-else-if="isActionTag" :industry-code="industryCode" />
				<KeyEnterprisesPanel
					v-else-if="isKeyEnterpriseTag"
					:industry-code="industryCode"
					:industry-label="industryLabel"
				/>
				<AnalysisSuggestPanel
					v-else-if="isAnalysisSuggestTag"
					:industry-code="industryCode"
				/>
				<div v-else class="panel-content-placeholder"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import TabsSidebar from './TabsSidebar.vue';
import IndustryContent from './IndustryContent.vue';
import ActionPanel from './ActionPanel.vue';
import KeyEnterprisesPanel from './KeyEnterprisesPanel.vue';
import AnalysisSuggestPanel from './AnalysisSuggestPanel.vue';
import type { IndustrySubTab, IndustryTopTag } from '../type';

/** 要素名称到 elementType 枚举值的映射 */
const ELEMENT_TYPE_KEYWORDS: { keyword: string; type: number }[] = [
	{ keyword: '市场', type: 1 },
	{ keyword: '技术', type: 2 },
	{ keyword: '人才', type: 3 },
	{ keyword: '资金', type: 4 },
	{ keyword: '载体', type: 5 },
	{ keyword: '政策', type: 6 },
];

/** 仅在"全市"下展示的受限顶部标签名（非"全市"时隐藏） */
const RESTRICTED_TAG_NAMES = ['十大行动', '重点企业', '分析建议'];

/** 根据标签名称解析对应的要素类型 */
const parseElementType = (name: string): number => {
	const match = ELEMENT_TYPE_KEYWORDS.find((item) => name.includes(item.keyword));
	return match ? match.type : 0;
};

const props = withDefaults(
	defineProps<{
		subTabs: IndustrySubTab[];
		topTags: IndustryTopTag[];
		activeSubIdx?: number;
		activeTopIdx?: number;
		industryCode?: string;
		industryLabel?: string;
	}>(),
	{
		activeSubIdx: 0,
		activeTopIdx: 0,
		industryCode: '',
		industryLabel: '',
	}
);

const emit = defineEmits<{
	'update:activeSubIdx': [idx: number];
	'update:activeTopIdx': [idx: number];
	pause: [];
	resume: [];
}>();

const activeSubIdx = ref(props.activeSubIdx);
const activeTopIdx = ref(props.activeTopIdx);

/** 当前选中的地区编码（regionCode） */
const currentRegionCode = computed(() => props.subTabs[activeSubIdx.value]?.code || '');

/** 当前选中的顶部标签 */
const currentTag = computed(() => props.topTags[activeTopIdx.value]);

/** 当前选中的要素标签（仅要素类标签返回 elementType，非要素类返回 null） */
const currentElementTag = computed(() => {
	const tag = currentTag.value;
	if (!tag) return null;
	const type = tag.elementType || parseElementType(tag.name);
	return type > 0 ? { elementType: type } : null;
});

const isActionTag = computed(() => currentTag.value?.name === '十大行动');
const isKeyEnterpriseTag = computed(() => currentTag.value?.name === '重点企业');
const isAnalysisSuggestTag = computed(() => currentTag.value?.name === '分析建议');

/** 判断当前标签是否限制地区选择（十大行动/重点企业/分析建议仅展示全市） */
const isRegionRestricted = computed(
	() => isActionTag.value || isKeyEnterpriseTag.value || isAnalysisSuggestTag.value
);

/** 查找"全市" tab 的索引 */
const cityWideIdx = computed(() => props.subTabs.findIndex((t) => t.name === '全市'));

/** 判断当前 sidebar 是否选中"全市" */
const isCityWideSelected = computed(() => activeSubIdx.value === cityWideIdx.value);

/** 将 subTabs 转换为 TabsSidebar 所需的 {id, title, disabled} 格式 */
const sidebarTabs = computed(() =>
	props.subTabs.map((item, idx) => ({
		id: String(idx),
		title: item.name,
		// 受限标签下，非"全市" tab 全部禁用
		disabled: isRegionRestricted.value && idx !== cityWideIdx.value,
	}))
);

watch(
	() => props.activeSubIdx,
	(val) => {
		activeSubIdx.value = val;
	}
);

watch(
	() => props.activeTopIdx,
	(val) => {
		activeTopIdx.value = val;
	}
);

/** 顶部标签点击事件 */
const onTopTagClick = (idx: number) => {
	activeTopIdx.value = idx;
	emit('update:activeTopIdx', idx);
};

/** 受限标签下自动切回"全市"，避免停留在已禁用的 tab */
watch(
	isRegionRestricted,
	(restricted) => {
		if (restricted && cityWideIdx.value >= 0 && activeSubIdx.value !== cityWideIdx.value) {
			activeSubIdx.value = cityWideIdx.value;
			emit('update:activeSubIdx', cityWideIdx.value);
		}
	},
	{ immediate: true }
);

/** 切到非"全市" sidebar 时，若当前激活的是受限标签，自动切到第一个可见标签 */
watch(isCityWideSelected, (isCityWide) => {
	if (isCityWide) return;
	const activeTag = props.topTags[activeTopIdx.value];
	if (activeTag && RESTRICTED_TAG_NAMES.includes(activeTag.name)) {
		const firstVisibleIdx = props.topTags.findIndex(
			(t) => !RESTRICTED_TAG_NAMES.includes(t.name)
		);
		if (firstVisibleIdx >= 0) {
			activeTopIdx.value = firstVisibleIdx;
			emit('update:activeTopIdx', firstVisibleIdx);
		}
	}
});

watch(activeSubIdx, (val) => {
	emit('update:activeSubIdx', val);
});
</script>

<style lang="less" scoped>
.industry-tabs-container {
	flex: 1;
	min-height: 0;
	display: flex;
	gap: 0.16rem;
	margin-top: 0.08rem;
	position: relative;
}

.industry-tabs-container > :first-child {
	flex-shrink: 0;
}

.industry-content-panel {
	flex: 1;
	min-height: 0;
	min-width: 0;
	background: rgba(255, 255, 255, 0.9);
	border: 0.01rem solid rgba(22, 93, 255, 1);
	border-radius: 0.08rem;
	display: flex;
	flex-direction: column;
	padding: 0.16rem 0.2rem;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
}

.panel-top-tags {
	display: flex;
	gap: 0.08rem;
	flex-wrap: nowrap;
	justify-content: flex-end;
	padding: 0 0.12rem 0;
	margin-bottom: -0.04rem;
	flex-shrink: 0;

	&::-webkit-scrollbar {
		display: none;
	}

	.panel-tag {
		padding: 0.04rem 0.16rem;
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.85);
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 0.04rem 0.04rem 0 0;
		border: 0.01rem solid transparent;
		border-bottom: none;
		white-space: nowrap;
		flex-shrink: 0;
		background: #f3f3f3;
		border-radius: 0.06rem 0.06rem 0 0;
		&:hover {
			color: #165dff;
		}

		&.panel-tag-active {
			position: relative;
			color: #0068fb;
			background: #eff7ff;
			border: 1px solid rgba(0, 104, 251, 1);
			border-bottom: none;
		}
	}
}

.panel-divider-line {
	display: flex;
	align-items: center;
	height: 0.08rem;
	background-image: url('@/assets/images/industry/title-bg-line-av.webp');
	background-size: 100% 100%;
}

.panel-content-scroll {
	flex: 1;
	min-height: 0;
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 0.16rem 0 0;
	box-sizing: border-box;

	&::-webkit-scrollbar {
		width: 0.03rem;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(43, 124, 255, 0.25);
		border-radius: 0.02rem;
	}
}
</style>
