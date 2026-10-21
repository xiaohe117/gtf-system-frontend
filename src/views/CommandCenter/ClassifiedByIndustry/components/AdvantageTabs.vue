<template>
	<div class="advantage-tabs-container">
		<TabsSidebar
			v-model:active-idx="activeIdx"
			:tabs="tabs"
			@pause="pauseAutoScroll"
			@resume="resumeAutoScroll"
		/>
		<div
			v-loading="loading"
			class="adv-content-wrapper"
			@mouseenter="pauseAutoScroll"
			@mouseleave="resumeAutoScroll"
		>
			<EmptyData v-if="!loading && tabs.length === 0" />
			<template v-else>
				<div class="adv-content-header">
					<span class="adv-content-title-text">{{ titleWithIndex }}</span>
				</div>
				<div class="adv-content-divider-line"></div>
				<div class="adv-content-scroll-area">
					<EmptyData v-if="!currentTab?.content" />
					<RichText v-else :html="currentTab.content" class="adv-content-body"></RichText>
				</div>
				<div v-if="dataSource || dataTime" class="adv-data-source">
					（数据来源：{{ dataSource }} · 数据时间：{{ dataTime }}）
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { getComprehensiveStrengthDetail } from '@/api/industry';
import TabsSidebar from './TabsSidebar.vue';
import EmptyData from './EmptyData.vue';
import RichText from './RichText.vue';
import type { AdvTab, ComprehensiveAdvItem } from '../type';

const props = withDefaults(
	defineProps<{
		tabs: AdvTab[];
		activeIdx?: number;
		titlePrefix?: string;
		showIndex?: boolean;
	}>(),
	{
		activeIdx: 0,
		titlePrefix: '优势',
		showIndex: true,
	}
);

const emit = defineEmits<{
	'update:activeIdx': [idx: number];
}>();

const innerActive = ref(props.activeIdx);

watch(
	() => props.activeIdx,
	(val) => {
		innerActive.value = val;
	}
);

const activeIdx = computed({
	get: () => props.activeIdx,
	set: (val: number) => emit('update:activeIdx', val),
});

/** 综合投资优势详情缓存，key 为 tab.id（masterId） */
const comprehensiveAdvMap = ref<Record<string, ComprehensiveAdvItem>>({});
/** 详情数据加载状态 */
const loading = ref(false);
/** 当前 tab 的数据来源 */
const dataSource = ref('');
/** 当前 tab 的数据时间 */
const dataTime = ref('');

/** 当前 tab 关联的详情数据 */
const currentAdv = computed(() => {
	const tab = props.tabs[innerActive.value];
	return tab ? comprehensiveAdvMap.value[tab.id] : undefined;
});

/** 当前 tab 信息（合并菜单子项与接口详情数据） */
const currentTab = computed(() => {
	const tab = props.tabs[innerActive.value];
	if (!tab) return undefined;
	const adv = currentAdv.value;
	return {
		...tab,
		content: adv?.rawDescription || '',
	};
});

const CN_NUM = [
	'一',
	'二',
	'三',
	'四',
	'五',
	'六',
	'七',
	'八',
	'九',
	'十',
	'十一',
	'十二',
	'十三',
	'十四',
	'十五',
];
const titleWithIndex = computed(() => {
	if (!props.showIndex) return currentTab.value?.title || '';
	const idx = CN_NUM[innerActive.value] || String(innerActive.value + 1);
	return `${props.titlePrefix}${idx}：${currentTab.value?.title || ''}`;
});

/** 按需请求综合投资优势详情数据（已缓存则直接返回） */
const fetchComprehensiveAdvData = async (masterId: string) => {
	if (comprehensiveAdvMap.value[masterId]) return comprehensiveAdvMap.value[masterId];
	loading.value = true;
	try {
		const res = await getComprehensiveStrengthDetail<ComprehensiveAdvItem>(masterId);
		if (res.code === 0 && res.data) {
			comprehensiveAdvMap.value[masterId] = res.data;
		}
	} catch {
		// ignore
	} finally {
		loading.value = false;
	}
	return comprehensiveAdvMap.value[masterId];
};

/** 监听当前激活 tab 变化（含 tabs 异步加载完成），按需请求详情数据并更新数据来源/时间 */
watch(
	() => props.tabs[innerActive.value]?.id,
	async (masterId) => {
		if (!masterId) return;
		const adv = await fetchComprehensiveAdvData(masterId);
		if (adv) {
			dataSource.value = adv.dataSourceName || '';
			dataTime.value = adv.dataTime || '';
		} else {
			dataSource.value = '';
			dataTime.value = '';
		}
	},
	{ immediate: true }
);

/** 自动轮播间隔（毫秒） */
const AUTO_SCROLL_INTERVAL = 5000;
/** 自动轮播定时器 */
const autoScrollTimer = ref<ReturnType<typeof setInterval> | null>(null);
/** 是否暂停自动轮播 */
let isPaused = false;

/** 停止综合优势 tab 自动轮播 */
const stopAutoScroll = () => {
	if (autoScrollTimer.value) {
		clearInterval(autoScrollTimer.value);
		autoScrollTimer.value = null;
	}
};

/** 启动综合优势 tab 自动轮播定时器 */
const startAutoScroll = () => {
	stopAutoScroll();
	autoScrollTimer.value = setInterval(() => {
		if (!isPaused && props.tabs.length > 0) {
			innerActive.value = (innerActive.value + 1) % props.tabs.length;
			emit('update:activeIdx', innerActive.value);
		}
	}, AUTO_SCROLL_INTERVAL);
};

/** 暂停自动轮播 */
const pauseAutoScroll = () => {
	isPaused = true;
};
/** 恢复自动轮播 */
const resumeAutoScroll = () => {
	isPaused = false;
};

/** 组件挂载：启动自动轮播 */
onMounted(() => {
	startAutoScroll();
});

/** 组件卸载前：停止轮播定时器 */
onBeforeUnmount(() => {
	stopAutoScroll();
});
</script>

<style lang="less" scoped>
.advantage-tabs-container {
	flex: 1;
	min-height: 0;
	max-height: 5.14rem;
	display: flex;
	gap: 0.16rem;
	margin-top: 0.08rem;
	position: relative;
	overflow: hidden;
}

.advantage-tabs-container > :first-child {
	flex-shrink: 0;
}

.adv-content-wrapper {
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

.adv-content-header {
	flex-shrink: 0;
	padding: 0 0.24rem 0.08rem;
	line-height: 1.4;
}

.adv-content-title-text {
	font-family: YouSheBiaoTiHei;
	font-size: 0.27rem;
	color: #165dff;
	letter-spacing: 0.01rem;
	white-space: nowrap;
}

.adv-content-divider-line {
	display: flex;
	align-items: center;
	margin-bottom: 0.12rem;
	height: 0.08rem;
	background-image: url('@/assets/images/industry/title-bg-line-av.webp');
	background-size: 100% 100%;
}

.adv-content-scroll-area {
	flex: 1;
	min-height: 0;
	max-height: 3.9rem;
	overflow-y: auto;
	padding-right: 0.08rem;

	&::-webkit-scrollbar {
		width: 0.03rem;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(43, 124, 255, 0.3);
		border-radius: 0.02rem;
	}
}

.adv-content-body {
	font-family: MicrosoftYaHei;
	font-size: 0.16rem;
	color: rgba(0, 0, 0, 0.84);
	line-height: 2;
	word-break: break-all;
	padding: 0 0.24rem 0.16rem;

	// :deep(p) {
	// 	margin: 0 0 0.08rem 0;
	// 	text-indent: 0;
	// }
	// :deep(strong),
	// :deep(b) {
	// 	color: #256eff;
	// 	font-weight: bold;
	// }
	// :deep(.highlight) {
	// 	color: #256eff;
	// 	font-weight: bold;
	// }
}

.adv-data-source {
	flex-shrink: 0;
	margin-top: 0.08rem;
	font-family: MicrosoftYaHei;
	font-size: 0.12rem;
	color: #8a9bb5;
	text-align: right;
}
</style>
