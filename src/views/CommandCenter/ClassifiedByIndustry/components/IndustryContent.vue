<template>
	<div v-loading="loading" class="industry-content-body">
		<EmptyData v-if="!loading && !comparativeAdvantage && !detailInfo" />
		<template v-else>
			<div v-if="comparativeAdvantage" class="title-wrap advantage-title-wrap">
				<div class="title-row">
					<div class="title">比较优势</div>
					<div v-if="dataSource || dataTime" class="source">
						（数据来源：{{ dataSource }} · 数据时间：{{ dataTime }}）
					</div>
				</div>
				<RichText :html="comparativeAdvantage" class="rich-text-wrap"></RichText>
			</div>
			<div v-if="detailInfo" class="title-wrap detail-title-wrap">
				<div class="title-row">
					<div class="title">{{ tagLabel ? `${tagLabel}情况` : '详情信息' }}</div>
					<div v-if="dataSource || dataTime" class="source">
						（数据来源：{{ dataSource }} · 数据时间：{{ dataTime }}）
					</div>
				</div>
				<RichText :html="detailInfo" class="rich-text-wrap"></RichText>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import { industryTypeSixElementList } from '@/api/industry';
import EmptyData from './EmptyData.vue';
import RichText from './RichText.vue';
import type { SixElementItem } from '../type';

/** 要素类型枚举值与标签名称映射 */
const ELEMENT_TYPE_MAP: Record<number, string> = {
	1: '市场',
	2: '技术',
	3: '人才',
	4: '资金',
	5: '载体',
	6: '政策',
};

const props = withDefaults(
	defineProps<{
		/** 产业编码 */
		industryCode?: string;
		/** 要素类型：1-市场 2-技术 3-人才 4-资金 5-载体 6-政策 */
		elementType?: number;
		/** 地区编码 */
		regionCode?: string;
	}>(),
	{
		industryCode: '',
		elementType: 0,
		regionCode: '',
	}
);

const loading = ref(false);
const comparativeAdvantage = ref('');
const detailInfo = ref('');
const dataSource = ref('');
const dataTime = ref('');
/** 从要素类型推导的标签名称（如"市场"、"技术"等） */
const tagLabel = computed(() => ELEMENT_TYPE_MAP[props.elementType] || '');

/** 请求六要素数据 */
const fetchSixElement = async () => {
	if (!props.industryCode || !props.elementType) {
		comparativeAdvantage.value = '';
		detailInfo.value = '';
		dataSource.value = '';
		dataTime.value = '';
		return;
	}
	loading.value = true;
	try {
		const params: Record<string, unknown> = { industryCode12218: props.industryCode };
		if (props.regionCode) {
			params.regionCode = props.regionCode;
		}
		if (props.elementType) {
			params.elementType = props.elementType;
		}
		const res = await industryTypeSixElementList<SixElementItem[]>(params);
		if (res.code === 0 && res.data && res.data.length > 0) {
			const item = res.data.find((d) => d.elementType === props.elementType) || res.data[0];
			comparativeAdvantage.value = item.comparativeAdvantage || '';
			detailInfo.value = item.detailInfo || '';
			dataSource.value = item.dataSource || '';
			dataTime.value = item.updatedTime || '';
		} else {
			comparativeAdvantage.value = '';
			detailInfo.value = '';
			dataSource.value = '';
			dataTime.value = '';
		}
	} catch {
		comparativeAdvantage.value = '';
		detailInfo.value = '';
		dataSource.value = '';
		dataTime.value = '';
	} finally {
		loading.value = false;
	}
};

/** 参数变化时重新请求数据 */
watch(
	() => [props.industryCode, props.elementType, props.regionCode],
	() => {
		fetchSixElement();
	},
	{ immediate: true }
);

onBeforeUnmount(() => {
	loading.value = false;
});
</script>

<style lang="less" scoped>
.industry-content-body {
	font-family: MicrosoftYaHei;
	font-size: 0.14rem;
	color: rgba(0, 0, 0, 0.78);
	line-height: 1.7;
	word-break: break-all;
	width: 100%;
	height: 100%;
	max-height: 4rem;
	min-height: 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	min-width: 0;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 0.03rem;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(43, 124, 255, 0.25);
		border-radius: 0.02rem;
	}

	.industry-content-body:has(.empty-data) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	:deep(.empty-data) {
		flex: 1;
		width: 100%;
		height: 100%;
	}

	.title-wrap {
		font-family: SourceHanSansSC;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.84);
		margin-bottom: 0.16rem;
		flex-shrink: 0;

		&:last-child {
			margin-bottom: 0;
		}

		.title-row {
			display: flex;
			align-items: center;
			gap: 0.12rem;
			margin-bottom: 0.08rem;
		}

		.title {
			width: 1.18rem;
			height: 0.36rem;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: YouSheBiaoTiHei;
			font-size: 0.18rem;
			color: #fff;
			text-shadow: -0.01rem 0.01rem 0 rgba(38, 111, 232, 0.5);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: 0 0;
			flex-shrink: 0;
		}

		.source {
			font-family: SourceHanSansSC;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.5);
		}
	}

	.advantage-title-wrap .title {
		background-image: url('@/assets/images/industry/sub-title-bg-2.webp');
	}

	.detail-title-wrap .title {
		background-image: url('@/assets/images/industry/sub-title-bg.webp');
	}

	.rich-text-wrap {
		padding: 0 0.2rem;
	}
}
</style>
