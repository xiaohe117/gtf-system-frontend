<template>
	<div
		ref="wrapRef"
		class="strength-cards-wrap"
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseLeave"
	>
		<!-- 加载中 -->
		<div v-if="loading" v-loading="true" class="state-empty loading-empty"></div>
		<!-- 空数据 -->
		<EmptyData v-else-if="resolvedCards.length === 0" class="state-empty" />
		<template v-else>
			<div
				class="cards-scroll-btn cards-btn-left"
				:class="{ disabled: scrollOffset <= 0 }"
				@click="prev"
			>
				<span></span>
			</div>

			<div
				class="cards-viewport"
				ref="viewportRef"
				@mouseleave="hoveredCardIdx = null"
				@mousedown="onDragStart"
			>
				<div
					class="cards-track"
					ref="trackRef"
					:style="{
						transform: `translateX(-${scrollOffset}px)`,
						transition: isDragging ? 'none' : 'transform 0.4s ease',
					}"
				>
					<div
						v-for="(card, idx) in resolvedCards"
						:key="card.id"
						:ref="(el) => setCardRef(el, idx)"
						class="strength-card"
						@mouseenter="onCardEnter(idx)"
					>
						<div class="card-header">
							<span class="card-title">{{ card.title }}</span>
						</div>
						<div class="card-body">
							<div class="card-brief-wrap">
								<RichText :html="card.briefContent" class="card-brief"></RichText>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="cards-scroll-btn cards-btn-right"
				:class="{ disabled: scrollOffset >= maxScroll - 0.5 }"
				@click="next"
			>
				<span></span>
			</div>

			<Teleport to="body">
				<div
					v-if="hoveredCardIdx !== null && popoverRect"
					class="card-popover"
					:style="popoverStyle"
				>
					<RichText :html="hoveredCard?.fullContent" class="popover-body"></RichText>
				</div>
			</Teleport>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeUnmount, onMounted, nextTick } from 'vue';
import { getHardStrengthList } from '@/api/industry';
import EmptyData from './EmptyData.vue';
import RichText from './RichText.vue';

export interface StrengthCard {
	id: string;
	title: string;
	briefContent: string;
	fullContent: string;
}

interface HardStrengthItem {
	id: string;
	masterId: string;
	title: string;
	items: unknown[];
	rawDescription: string;
	dataSourceName: string;
	dataTime: string;
	sortOrder: number;
}

const props = withDefaults(
	defineProps<{
		cards?: StrengthCard[];
		masterId?: string;
		cardsPerPage?: number;
		autoplay?: boolean;
		interval?: number;
	}>(),
	{
		cards: () => [],
		masterId: '',
		cardsPerPage: 4,
		autoplay: false,
		interval: 5000,
	}
);

const emit = defineEmits<{
	'data-loaded': [dataSource: string, dataTime: string];
}>();

const internalCards = ref<StrengthCard[]>([]);
const loading = ref(false);

const resolvedCards = computed(() => (props.masterId ? internalCards.value : props.cards));

const fetchCards = async (masterId: string) => {
	loading.value = true;
	try {
		const res = await getHardStrengthList<HardStrengthItem[]>({ masterId });
		if (res.code === 0 && res.data) {
			internalCards.value = res.data.map((item) => ({
				id: item.id,
				title: item.title || '--',
				briefContent: item.rawDescription || '',
				fullContent: `<div class="popover-title">${item.title || '--'}</div>${item.rawDescription || ''}`,
			}));
			const first = res.data[0];
			if (first) {
				emit('data-loaded', first.dataSourceName || '', first.dataTime || '');
			}
		}
	} catch {
		internalCards.value = [];
	} finally {
		loading.value = false;
	}
};

watch(
	() => props.masterId,
	(val) => {
		if (val) fetchCards(val);
	},
	{ immediate: true }
);

const CARD_WIDTH_REM = 3.42;
const CARD_GAP_REM = 0.16;
const POPOVER_WIDTH_REM = 3.42;
const POPOVER_GAP_REM = 0.08;

const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
const cardStridePx = () => (CARD_WIDTH_REM + CARD_GAP_REM) * rem();

const viewportRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
const maxScroll = ref(0);

const updateMaxScroll = () => {
	if (!viewportRef.value || !trackRef.value) return;
	const vw = viewportRef.value.clientWidth;
	const tw = trackRef.value.scrollWidth;
	maxScroll.value = Math.max(0, tw - vw);
	if (scrollOffset.value > maxScroll.value) {
		scrollOffset.value = maxScroll.value;
	}
};

let ro: ResizeObserver | null = null;
onMounted(() => {
	nextTick(() => {
		updateMaxScroll();
	});
	ro = new ResizeObserver(() => {
		updateMaxScroll();
	});
	if (viewportRef.value) ro.observe(viewportRef.value);
	if (trackRef.value) ro.observe(trackRef.value);
});

watch(
	() => resolvedCards.value,
	() => {
		scrollOffset.value = 0;
		nextTick(() => updateMaxScroll());
	}
);

const prev = () => {
	if (scrollOffset.value <= 0) return;
	const step = cardStridePx();
	scrollOffset.value = Math.max(0, scrollOffset.value - step);
};
const next = () => {
	if (scrollOffset.value >= maxScroll.value - 0.5) {
		if (props.autoplay) scrollOffset.value = 0;
		return;
	}
	const step = cardStridePx();
	scrollOffset.value = Math.min(maxScroll.value, scrollOffset.value + step);
};

const cardRefs = new Map<number, HTMLElement>();
const setCardRef = (el: unknown, idx: number) => {
	if (el) cardRefs.set(idx, el as HTMLElement);
};

const hoveredCardIdx = ref<number | null>(null);

/** 鼠标拖拽滚动 */
const isDragging = ref(false);
let dragStartX = 0;
let dragStartOffset = 0;

const onDragMove = (e: MouseEvent) => {
	if (!isDragging.value) return;
	const dx = e.clientX - dragStartX;
	scrollOffset.value = Math.max(0, Math.min(maxScroll.value, dragStartOffset - dx));
};

const onDragEnd = () => {
	if (!isDragging.value) return;
	isDragging.value = false;
	window.removeEventListener('mousemove', onDragMove);
	window.removeEventListener('mouseup', onDragEnd);
	// 仅保留边界钳制，不强制吸附，拖拽到哪就停在哪
	scrollOffset.value = Math.max(0, Math.min(maxScroll.value, scrollOffset.value));
};

const onDragStart = (e: MouseEvent) => {
	if (maxScroll.value <= 0) return;
	isDragging.value = true;
	dragStartX = e.clientX;
	dragStartOffset = scrollOffset.value;
	hoveredCardIdx.value = null;
	window.addEventListener('mousemove', onDragMove);
	window.addEventListener('mouseup', onDragEnd);
};
const hoveredCard = computed(() =>
	hoveredCardIdx.value !== null ? resolvedCards.value[hoveredCardIdx.value] : null
);

const popoverRect = ref<{ left: number; top: number; width: number } | null>(null);

const updatePopoverPosition = () => {
	if (hoveredCardIdx.value === null) return;
	const cardEl = cardRefs.get(hoveredCardIdx.value);
	if (!cardEl) return;
	const rect = cardEl.getBoundingClientRect();
	const r = rem();
	const popWidth = POPOVER_WIDTH_REM * r;
	popoverRect.value = {
		left: rect.left + (rect.width - popWidth) / 2,
		top: rect.bottom + POPOVER_GAP_REM * r,
		width: popWidth,
	};
};

const popoverStyle = computed(() => {
	const r = popoverRect.value;
	if (!r) return { display: 'none' as const };
	return {
		position: 'fixed' as const,
		left: `${r.left}px`,
		top: `${r.top}px`,
		width: `${r.width}px`,
		zIndex: 9999,
	};
});

const onCardEnter = (idx: number) => {
	hoveredCardIdx.value = idx;
	nextTick(() => {
		updatePopoverPosition();
	});
};

let timer: ReturnType<typeof setInterval> | null = null;
let isPaused = false;
let rafId: number | null = null;

const tickPosition = () => {
	updatePopoverPosition();
	rafId = requestAnimationFrame(tickPosition);
};

/** 取消 popover 位置追踪的 RAF 循环 */
const cleanupRaf = () => {
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}
};

watch(hoveredCardIdx, (val) => {
	if (val !== null) {
		updatePopoverPosition();
		rafId = requestAnimationFrame(tickPosition);
	} else {
		popoverRect.value = null;
		cleanupRaf();
	}
});

const stop = () => {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
};

const start = () => {
	if (!props.autoplay) return;
	stop();
	timer = setInterval(() => {
		if (!isPaused) next();
	}, props.interval);
};

const onMouseEnter = () => {
	isPaused = true;
};
const onMouseLeave = () => {
	isPaused = false;
};

watch(
	() => [props.autoplay, props.interval],
	() => {
		if (props.autoplay) start();
		else stop();
	},
	{ immediate: true }
);

onBeforeUnmount(() => {
	stop();
	cleanupRaf();
	ro?.disconnect();
	ro = null;
	window.removeEventListener('mousemove', onDragMove);
	window.removeEventListener('mouseup', onDragEnd);
});
</script>

<style lang="less" scoped>
.strength-cards-wrap {
	position: relative;
	display: flex;
	align-items: center;
	padding: 0.16rem 0.4rem 0.12rem;
}

.state-empty {
	flex: 1;
	min-height: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: MicrosoftYaHei;
	font-size: 0.16rem;
	color: rgba(0, 0, 0, 0.45);
}
.loading-empty {
	min-height: 1.5rem;
}

/* 缩小 EmptyData 组件图片和文字尺寸 */
:deep(.empty-data) {
	gap: 0.04rem;
	.empty-img {
		width: 1.4rem;
	}
	.empty-text {
		font-size: 0.16rem;
	}
}

.cards-viewport {
	flex: 1;
	overflow: hidden;
	cursor: grab;
	user-select: none;

	&:active {
		cursor: grabbing;
	}
}

.cards-track {
	display: flex;
	gap: 0.16rem;
}

.strength-card {
	width: 3.42rem;
	height: 1.6rem;
	flex-shrink: 0;
	background: linear-gradient(303deg, #f1f7ff 0%, #f1f7ff 100%);
	box-shadow: 0 0 0.2rem rgba(0, 61, 240, 0.2);
	border: 0.01rem solid rgba(22, 93, 255, 1);
	border-radius: 0.08rem;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	backdrop-filter: blur(4px);
	z-index: 1;
	display: flex;
	flex-direction: column;

	.card-header {
		flex-shrink: 0;
		height: 0.36rem;
		background: linear-gradient(90deg, #176bf9 0%, #176bf9 18.71%, rgba(93, 201, 252, 0) 100%);
		box-shadow: 0 0 0.2rem rgba(0, 61, 240, 0.2);
		border-radius: 0.08rem 0.08rem 0.08rem 0;
		display: flex;
		align-items: center;
		justify-content: left;
		padding: 0 0.16rem 0 0.24rem;
	}

	.card-title {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 600;
		font-size: 0.2rem;
		color: #ffffff;
		letter-spacing: 0.01rem;
		line-height: 1;
		text-shadow:
			0 0 0.2rem rgba(0, 61, 240, 0.2),
			0 0.04rem 0.08rem rgba(0, 0, 0, 0.5);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-body {
		flex: 1;
		min-height: 0;
		padding: 0.12rem 0.16rem;
		overflow: hidden;
	}

	.card-brief-wrap {
		height: 100%;
		overflow-y: auto;
		padding-bottom: 0.12rem;
		box-sizing: border-box;

		&::-webkit-scrollbar {
			width: 0.03rem;
		}
		&::-webkit-scrollbar-thumb {
			background: rgba(43, 124, 255, 0.3);
			border-radius: 0.02rem;
		}
	}

	.card-brief {
		font-family: MicrosoftYaHei;
		font-size: 0.15rem;
		color: rgba(0, 0, 0, 0.84);
	}
}

.cards-scroll-btn {
	width: 0.36rem;
	height: 0.36rem;
	border-radius: 50%;
	background: #4d8afa;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	flex-shrink: 0;
	transition: all 0.3s ease;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	z-index: 10;
	span {
		display: block;
		width: 0;
		height: 0;
		border-style: solid;
	}

	&:hover:not(.disabled) {
		background: rgba(37, 110, 255, 0.8);
	}

	&.disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
}

.cards-btn-left {
	left: 0;
	span {
		border-width: 0.08rem 0.1rem 0.08rem 0;
		border-color: transparent #fff transparent transparent;
	}
}

.cards-btn-right {
	right: 0;
	span {
		border-width: 0.08rem 0 0.08rem 0.1rem;
		border-color: transparent transparent transparent #fff;
	}
}
</style>

<style lang="less">
.card-popover {
	background: #ffffff;
	box-shadow: 0 0 0.24rem 0 rgba(25, 43, 138, 0.2);
	border-radius: 0.08rem;
	border: 0.01rem solid rgba(22, 93, 255, 1);
	backdrop-filter: blur(4px);
	overflow: hidden;
	font-size: 0.14rem;
	width: 3.42rem;
	min-height: 1.6rem;
	box-sizing: border-box;

	.popover-title {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 600;
		font-size: 0.2rem;
		color: #165dff;
		line-height: 1;
		margin: 0 0 0.1rem;
	}

	.popover-body {
		padding: 0.16rem 0.16rem 0.12rem;
		min-height: 2.8rem;
		font-family: MicrosoftYaHei;
		font-size: 0.15rem;
		color: rgba(0, 0, 0, 0.84);
		overflow-y: auto;

		// &::-webkit-scrollbar {
		// 	width: 0.03rem;
		// }
		// &::-webkit-scrollbar-thumb {
		// 	background: rgba(43, 124, 255, 0.3);
		// 	border-radius: 0.02rem;
		// }
	}
}
</style>
