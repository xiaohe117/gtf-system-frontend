<template>
	<div class="enterprise-card" @click="emit('click')">
		<img class="card-icon" src="@/assets/images/industry/marker-quantityicon.webp" alt="" />
		<div class="card-content">
			<div ref="headerRef" class="card-header">
				<el-tooltip :content="item.enterpriseName || '--'" placement="top" effect="dark">
					<span ref="nameRef" class="enterprise-name">
						{{ item.enterpriseName || '--' }}
					</span>
				</el-tooltip>
				<div v-if="tags.length" class="tag-area">
					<span
						v-for="(tagName, tagIndex) in visibleTags"
						:key="`vis-${tagIndex}`"
						class="tag"
						:class="TAG_COLORS[tagIndex % TAG_COLORS.length]"
					>
						{{ tagName }}
					</span>
					<el-popover
						v-if="hiddenTags.length"
						placement="top"
						trigger="hover"
						width="auto"
						popper-class="enterprise-tag-popover"
					>
						<template #reference>
							<span class="tag-more" @click.stop> +{{ hiddenTags.length }} </span>
						</template>
						<div class="enterprise-hidden-tags">
							<span
								v-for="(tagName, tagIndex) in hiddenTags"
								:key="`${tagName}-${tagIndex}`"
								class="tag"
								:class="TAG_COLORS[(visibleCount + tagIndex) % TAG_COLORS.length]"
							>
								{{ tagName }}
							</span>
						</div>
					</el-popover>
				</div>
			</div>
			<div class="card-meta">
				<span class="meta-item-l"
					><span class="meta-item-label">注册资本：</span
					>{{ item.registeredCapital ? `${item.registeredCapital}万元` : '--' }}</span
				>
				<span class="meta-item-r"
					><span class="meta-item-label">所属产业：</span
					>{{ props.industryLabel || item.belongIndustry || '--' }}</span
				>
			</div>
		</div>
		<div class="tag-measure" aria-hidden="true">
			<span
				v-for="(tagName, tagIndex) in tags"
				:key="`m-${tagIndex}`"
				ref="measureTagRefs"
				class="tag"
				:class="TAG_COLORS[tagIndex % TAG_COLORS.length]"
			>
				{{ tagName }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { EnterpriseData } from '../type';

const props = defineProps({
	item: {
		type: Object as () => EnterpriseData,
		required: true,
	},
	industryLabel: {
		type: String,
		default: '',
	},
});

const emit = defineEmits<{
	click: [];
}>();

const TAG_COLORS = ['tag-green', 'tag-blue', 'tag-orange'] as const;
const MAX_VISIBLE_TAGS = 2;
const TAG_GAP_PX = 0.08 * 16; // 项目没设根字号，1rem = 16px
const NAME_TAG_GAP_PX = 0.24 * 16;

const headerRef = ref<HTMLElement | null>(null);
const nameRef = ref<HTMLElement | null>(null);
const measureTagRefs = ref<HTMLElement[]>([]);

const tags = computed(() => (props.item.enterpriseTypeName || '').split('/').filter(Boolean));

const defaultVisibleCount = () => Math.min(tags.value.length, MAX_VISIBLE_TAGS);

const visibleCount = ref(defaultVisibleCount());

const visibleTags = computed(() => tags.value.slice(0, visibleCount.value));
const hiddenTags = computed(() => tags.value.slice(visibleCount.value));

const measureTagWidths = () => measureTagRefs.value.map((el) => el.getBoundingClientRect().width);

const calcVisibleCount = () => {
	const header = headerRef.value;
	const nameEl = nameRef.value;
	if (!header || !nameEl) {
		visibleCount.value = defaultVisibleCount();
		return;
	}
	const available = header.clientWidth - nameEl.clientWidth - NAME_TAG_GAP_PX;
	if (available <= 0) {
		visibleCount.value = 0;
		return;
	}
	const widths = measureTagWidths();
	let used = 0;
	let count = 0;
	for (let i = 0; i < widths.length && count < MAX_VISIBLE_TAGS; i += 1) {
		const need = widths[i] + (count > 0 ? TAG_GAP_PX : 0);
		if (used + need > available) break;
		used += need;
		count += 1;
	}
	visibleCount.value = count;
};

let calcRaf = 0;
const scheduleCalc = () => {
	if (calcRaf) {
		window.cancelAnimationFrame(calcRaf);
	}
	calcRaf = window.requestAnimationFrame(() => {
		calcRaf = 0;
		calcVisibleCount();
	});
};

let resizeObserver: ResizeObserver | null = null;

watch(
	() => props.item.enterpriseTypeName,
	() => {
		scheduleCalc();
	},
	{ flush: 'post' }
);

onMounted(() => {
	scheduleCalc();
	if (headerRef.value) {
		resizeObserver = new ResizeObserver(() => {
			scheduleCalc();
		});
		resizeObserver.observe(headerRef.value);
	}
});

onUnmounted(() => {
	if (calcRaf) {
		window.cancelAnimationFrame(calcRaf);
		calcRaf = 0;
	}
	resizeObserver?.disconnect();
	resizeObserver = null;
});
</script>

<style lang="less" scoped>
.enterprise-card {
	width: 100%;
	height: 0.82rem;
	display: flex;
	align-items: center;
	flex-shrink: 0;
	padding: 0.12rem 0.16rem 0.12rem 0.12rem;
	background-image: url('@/assets/images/industry/marker-uantity-bg.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	box-sizing: border-box;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.tag-measure {
	position: absolute;
	left: -9999rem;
	top: 0;
	visibility: hidden;
	pointer-events: none;
	display: flex;
	align-items: center;
	gap: 0.08rem;
	white-space: nowrap;
}

.card-icon {
	width: 0.42rem;
	height: 0.42rem;
	margin-right: 0.12rem;
	flex-shrink: 0;
}

.card-content {
	flex: 1;
	min-width: 0;
}

.card-header {
	height: 0.3rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.24rem;
}

.enterprise-name {
	max-width: 4.16rem;
	flex-shrink: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-family: PingFangSC, 'PingFang SC';
	font-weight: 600;
	font-size: 0.16rem;
	color: #333333;
	line-height: 0.24rem;
}

.tag-area {
	display: flex;
	align-items: center;
	gap: 0.08rem;
	flex-shrink: 0;
	margin-left: auto;
}

.tag {
	height: 0.24rem;
	padding: 0 0.16rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.04rem;
	font-family: PingFangSC, 'PingFang SC';
	font-size: 0.14rem;
	line-height: 0.22rem;
	white-space: nowrap;
}

.tag-more {
	flex-shrink: 0;
	font-family: PingFangSC, 'PingFang SC';
	font-weight: 600;
	font-size: 0.14rem;
	line-height: 0.24rem;
	color: #165dff;
	white-space: nowrap;
	cursor: pointer;
}

.tag-green {
	color: #00c462;
	background: #e8f8f2;
	border: 0.01rem solid #67c23a;
}

.tag-blue {
	background: #e4f1ff;
	border-radius: 0.02rem;
	border: 0.01rem solid rgba(22, 93, 255, 0.5);
	color: #165dff;
}

.tag-orange {
	background: #fef3e6;
	border-radius: 0.02rem;
	border: 0.01rem solid rgba(237, 123, 47, 0.5);
	color: #ed7b2f;
}

.card-meta {
	display: flex;
	margin-top: 0.04rem;
	padding-right: 1.28rem;
	font-family: PingFangSC, 'PingFang SC';
	font-weight: 400;
	font-size: 0.14rem;
	color: #606266;
	line-height: 0.16rem;
	white-space: nowrap;

	.meta-item-l {
		min-width: 2.6rem;
	}
	.meta-item-label {
		color: rgba(0, 0, 0, 0.51);
	}
}
</style>

<style lang="less">
.enterprise-tag-popover {
	min-width: 1.6rem !important;
	max-width: 3.8rem;
	padding: 0.12rem 0.16rem !important;

	.enterprise-hidden-tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.08rem;
	}

	.tag {
		height: 0.24rem;
		padding: 0 0.16rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.04rem;
		font-family: PingFangSC, 'PingFang SC';
		font-size: 0.14rem;
		line-height: 0.22rem;
		white-space: nowrap;
	}

	.tag-green {
		color: #00c462;
		background: #e8f8f2;
		border: 0.01rem solid #67c23a;
	}

	.tag-blue {
		color: #165dff;
		background: #e4f1ff;
		border: 0.01rem solid rgba(22, 93, 255, 0.5);
		border-radius: 0.02rem;
	}

	.tag-orange {
		color: #ed7b2f;
		background: #fef3e6;
		border: 0.01rem solid rgba(237, 123, 47, 0.5);
		border-radius: 0.02rem;
	}
}
</style>
