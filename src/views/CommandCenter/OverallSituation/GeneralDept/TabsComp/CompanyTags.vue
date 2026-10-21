<template>
	<span class="company-tags" ref="wrapRef">
		<span
			class="company-tag"
			v-for="(item, index) in visibleList"
			:key="index"
			@click.stop="handleTagClick(item)"
		>
			{{ item.name }}
		</span>
		<el-tooltip
			v-if="hiddenList.length > 0"
			placement="top"
			popper-class="company-tags-popper"
			effect="light"
		>
			<template #content>
				<div class="company-tags-tooltip">
					<span
						class="company-tag"
						v-for="(item, index) in hiddenList"
						:key="index"
						@click="handleTagClick(item)"
					>
						{{ item.name }}
					</span>
				</div>
			</template>
			<span class="company-tag company-tag-more">+{{ hiddenList.length }}</span>
		</el-tooltip>
		<!-- 隐藏测量副本：渲染全部标签用于宽度计算 -->
		<span class="company-tags-measure" ref="measureRef" aria-hidden="true">
			<span class="company-tag" v-for="(item, index) in stats" :key="index">
				{{ item.name }}
			</span>
		</span>
	</span>
</template>

<script lang="ts" setup>
import { openQxbPage } from '../data';

interface CompanyTagItem {
	eid: string;
	name: string;
}

const props = defineProps<{
	stats: CompanyTagItem[];
}>();

const wrapRef = ref<HTMLElement>();
const measureRef = ref<HTMLElement>();

const visibleCount = ref(props.stats.length);

const visibleList = computed(() => props.stats.slice(0, visibleCount.value));
const hiddenList = computed(() => props.stats.slice(visibleCount.value));

// 点击公司标签，新开企查查企业详情页
const handleTagClick = (item: CompanyTagItem) => {
	if (item.eid) {
		openQxbPage(
			`https://z-plugin.qixin.com/enterprise-valuation/detail/ent-overview?eid=${item.eid}`
		);
	}
};

// 基准字号（px），用于 rem 换算
const getRootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

// 标签间 margin-right 0.04rem 的像素值
const getGapPx = () => 0.04 * getRootFontSize();

// “+N” 占位宽度（px）
const getMoreWidth = (n: number) => {
	const fontSize = getRootFontSize();
	return `+${n}`.length * fontSize * 0.6 + 0.08 * fontSize;
};

// 依据容器宽度计算可见标签数量
const calcVisible = () => {
	if (!wrapRef.value || !measureRef.value) return;
	const wrapWidth = wrapRef.value.clientWidth;
	const tags = Array.from(measureRef.value.querySelectorAll<HTMLElement>('.company-tag'));
	if (tags.length === 0) {
		visibleCount.value = 0;
		return;
	}
	const gapPx = getGapPx();
	// 累加标签宽度（含间距），返回能完整放入 limit 内的最大数量
	const fitCount = (limit: number) => {
		let total = 0;
		return tags.reduce((count, tag) => {
			const w = tag.offsetWidth + gapPx;
			if (total + w > limit) return count;
			total += w;
			return count + 1;
		}, 0);
	};
	let count = fitCount(wrapWidth);
	if (count < tags.length) {
		// 有剩余时，给“+N”预留宽度后重新计算
		count = fitCount(wrapWidth - getMoreWidth(tags.length - count));
	}
	// 空间不足时至少显示一个
	visibleCount.value = Math.max(count, 1);
};

let observer: ResizeObserver | null = null;

onMounted(() => {
	calcVisible();
	observer = new ResizeObserver(() => calcVisible());
	if (wrapRef.value) {
		observer.observe(wrapRef.value);
	}
});

onBeforeUnmount(() => {
	observer?.disconnect();
	observer = null;
});

watch(
	() => props.stats,
	() => {
		nextTick(calcVisible);
	},
	{ deep: true }
);
</script>

<style scoped lang="less">
.company-tags {
	position: relative;
	display: inline-flex;
	align-items: center;
	overflow: hidden;
	white-space: nowrap;
	min-width: 0;
	max-width: 100%;
	vertical-align: middle;

	.company-tag-more {
		cursor: pointer;
	}

	.company-tags-measure {
		position: absolute;
		top: 0;
		left: 0;
		visibility: hidden;
		pointer-events: none;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}
}
.company-tag {
	flex-shrink: 0;
	color: #165dff;
	margin-right: 0.04rem;
	font-size: 0.14rem;
	line-height: 0.2rem;
	cursor: pointer;
}
</style>

<!-- el-tooltip 内容挂载到 body，需全局样式 -->
<style lang="less">
.company-tags-popper {
	.company-tags-tooltip {
		display: flex;
		flex-direction: column;
		gap: 0.04rem;
		max-width: 2.4rem;
	}

	.tooltip-tag {
		color: #fff;
		font-size: 0.13rem;
		line-height: 0.18rem;
		word-break: break-all;
		cursor: pointer;
	}
}
</style>
