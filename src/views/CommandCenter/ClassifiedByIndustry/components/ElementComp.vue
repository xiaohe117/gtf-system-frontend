<template>
	<div ref="elementCompRef" v-loading="loading" class="element-comp">
		<EmptyData v-if="topics.length === 0" />
		<div v-else class="elements-grid">
			<ElementItem
				v-for="topic in topics"
				:key="topic.key"
				:topic="topic"
				:bottom-hidden="bottomHiddenValues[topic.key]"
				:text-style-top="getItemTextStyle('top-' + topic.key)"
				:text-style-bottom="getItemTextStyle(topic.key)"
				@more="handleMore"
			/>
		</div>
	</div>
	<TipsDialog
		class="elementComp-tipsDialog"
		:destroy-on-close="true"
		:title="`六要素-${props.industryLabel}`"
		ref="dialogRef"
		width="11.54rem"
	>
		<ElementDtails ref="detailsRef" :industry-code="industryCode" />
	</TipsDialog>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { industryTypeSixElementList } from '@/api/industry';
import TipsDialog from '@/views/OverallSituation/components/TipsDialog.vue';
import ElementDtails from '@/views/CommandCenter/ClassifiedByIndustry/components/ElementDtails.vue';
import ElementItem from '@/views/CommandCenter/ClassifiedByIndustry/components/ElementItem.vue';
import EmptyData from '@/views/CommandCenter/ClassifiedByIndustry/components/EmptyData.vue';
import { useTextLineClamp } from '@/views/CommandCenter/ClassifiedByIndustry/composables/useTextLineClamp';
import type { TopicItem, SixElementItem } from '../type';

const props = defineProps({
	industryCode: {
		type: String,
		default: '',
	},
	industryLabel: {
		type: String,
		default: '',
	},
});

const sixElementDataList = ref<SixElementItem[]>([]);

const SITUATION_TITLE_MAP: Record<number, string> = {
	1: '市场情况',
	2: '技术情况',
	3: '人才情况',
	4: '资金情况',
	5: '载体情况',
	6: '政策情况',
};

const topics = computed<TopicItem[]>(() =>
	sixElementDataList.value.map((item) => ({
		key: String(item.elementType),
		title: item.elementTypeName,
		sections: {
			experience: {
				title: '比较优势',
				content: item.comparativeAdvantage,
			},
			situation: {
				title: SITUATION_TITLE_MAP[item.elementType] || '详情信息',
				content: item.detailInfo,
			},
		},
	}))
);

const dialogRef = ref<InstanceType<typeof TipsDialog> | null>(null);
const detailsRef = ref<InstanceType<typeof ElementDtails>>();
const loading = ref(false);
const handleMore = (topic: TopicItem) => {
	dialogRef.value?.show();
	nextTick(() => {
		detailsRef.value?.selectTopic(topic.key);
	});
};

const elementCompRef = ref<HTMLElement | null>(null);

const { lineClampValues, bottomHiddenValues, initResizeObserver, scheduleCalc } = useTextLineClamp({
	containerRef: elementCompRef,
	itemSelector: '.element-item',
	bodySelector: '.item-body',
	topSectionSelector: '.section-top',
	bottomSectionSelector: '.section-bottom',
});

const UNLIMITED_LINES = 999;

const getItemTextStyle = (key: string) => ({
	WebkitLineClamp: lineClampValues.value[key] || UNLIMITED_LINES,
	lineClamp: lineClampValues.value[key] || UNLIMITED_LINES,
});

const fetchSixElementList = async () => {
	if (!props.industryCode) {
		sixElementDataList.value = [];
		scheduleCalc();
		return;
	}
	loading.value = true;
	try {
		const res = await industryTypeSixElementList({ industryCode12218: props.industryCode });
		if (res.code === 0) {
			sixElementDataList.value = (res.data as SixElementItem[]) || [];
			scheduleCalc();
		} else {
			sixElementDataList.value = [];
		}
	} finally {
		loading.value = false;
	}
};

watch(
	() => props.industryCode,
	() => {
		fetchSixElementList();
	},
	{ immediate: true }
);

onMounted(() => {
	initResizeObserver();
});
</script>

<style lang="less" scoped>
.element-comp {
	width: 100%;
	height: 100%;
	overflow: hidden;

	.elements-grid {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.08rem;
	}
}
</style>
<style lang="less">
.elementComp-tipsDialog {
	overflow: visible;
	.el-dialog {
		overflow: visible;
	}
	.el-dialog__body {
		padding: 0.18rem !important;
		overflow: visible;
	}
}
</style>
