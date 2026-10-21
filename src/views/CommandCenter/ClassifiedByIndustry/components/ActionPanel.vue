<template>
	<div v-loading="loading" class="action-panel-wrapper">
		<EmptyData v-if="actionItems.length === 0" />
		<template v-else>
			<BlockTitle class="section-title">
				十大行动成效
				<template #source v-if="dataSource || dataTime">
					（数据来源：{{ dataSource }} · 数据时间：{{ dataTime }}）
				</template>
			</BlockTitle>
			<div class="analysis-body">
				<div class="action-panel">
					<div class="action-rail">
						<span>十大行动</span>
					</div>
					<div class="action-list">
						<div
							v-for="(item, index) in actionItems"
							:key="item.code"
							class="action-item"
							:class="[
								{ active: index === activeActionIndex },
								{ unfinished: !item.completed },
							]"
							@click="activeActionIndex = index"
						>
							<span class="item-status">{{ item.statusText }}</span>
							<span class="item-label">{{ item.label }}</span>
						</div>
					</div>
				</div>

				<div class="content-card" :class="{ empty: !currentActionItem?.detailInfo }">
					<EmptyData v-if="!currentActionItem?.detailInfo" />
					<RichText
						v-else
						:html="currentActionItem.detailInfo"
						class="content-text"
					></RichText>
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { industryEffectList } from '@/api/industry';
import BlockTitle from '@/views/CommandCenter/ClassifiedByIndustry/components/BlockTitle.vue';
import EmptyData from '@/views/CommandCenter/ClassifiedByIndustry/components/EmptyData.vue';
import RichText from './RichText.vue';
import type { EffectItem } from '../type';

const props = defineProps({
	industryCode: {
		type: String,
		default: '',
	},
});

const activeActionIndex = ref(0);
const loading = ref(false);
const effectList = ref<EffectItem[]>([]);
const dataSource = ref('');
const dataTime = ref('');

const actionItems = computed(() =>
	effectList.value.map((item) => ({
		code: item.effectCode,
		statusText: item.progress,
		completed: item.progressStatus === '1',
		label: item.effectName,
	}))
);

const currentActionItem = computed(() => effectList.value[activeActionIndex.value] ?? null);

/** 获取十大行动列表数据并更新数据来源信息 */
const fetchEffectList = async () => {
	if (!props.industryCode) {
		effectList.value = [];
		activeActionIndex.value = 0;
		dataSource.value = '';
		dataTime.value = '';
		return;
	}
	loading.value = true;
	try {
		const res = await industryEffectList({ industryCode: props.industryCode });
		if (res.code === 0) {
			const list = (res.data as EffectItem[]) || [];
			effectList.value = list;
			activeActionIndex.value = 0;
			const first = list[0];
			dataSource.value = first?.detailDataSource || '';
			dataTime.value = first?.detailDataTime || '';
		} else {
			effectList.value = [];
			activeActionIndex.value = 0;
			dataSource.value = '';
			dataTime.value = '';
		}
	} finally {
		loading.value = false;
	}
};

watch(
	() => props.industryCode,
	() => {
		fetchEffectList();
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
.action-panel-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
	overflow: hidden;
}

.analysis-body {
	width: 100%;
	height: 4.8rem;
	flex-shrink: 0;
	display: flex;
	align-items: flex-start;
	gap: 0.28rem;
}

.action-panel {
	display: flex;
	align-items: flex-start;
	gap: 0.25rem;
	width: 4.72rem;
	height: 100%;
	flex-shrink: 0;
}

.action-rail {
	width: 0.39rem;
	height: 100%;
	margin-top: 0.04rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background-image: url('@/assets/images/industry/action-title-bg-1.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;

	span {
		font-family: YouSheBiaoTiHei;
		font-size: 0.22rem;
		line-height: 1;
		color: #ffffff;
		letter-spacing: 0.09rem;
		writing-mode: vertical-rl;
		text-orientation: upright;
		text-shadow: 0 0.03rem 0.06rem rgba(0, 67, 185, 0.55);
	}
}

.action-list {
	width: 4.08rem;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-shrink: 0;
	overflow-y: auto;
	overflow-x: hidden;
	&::-webkit-scrollbar {
		width: 0.03rem;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(43, 124, 255, 0.25);
		border-radius: 0.02rem;
	}
}

.action-item {
	width: 4.08rem;
	height: 0.4rem;
	display: flex;
	align-items: center;
	flex-shrink: 0;
	background-image: url('@/assets/images/industry/action-item-bg.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	cursor: pointer;
	font-family: MicrosoftYaHei;

	&.active {
		background-image: url('@/assets/images/industry/action-item-bg-act.webp');

		.item-label {
			font-family: PingFangSC, 'PingFang SC';
			font-weight: 500;
			font-size: 0.18rem;
			color: #fff;
			line-height: 0.24rem;
			text-shadow: 0 0.02rem 0.04rem rgba(0, 54, 166, 0.4);
		}
	}
	&.unfinished {
		background-image: url('@/assets/images/industry/action-item-bg-2.webp');
		.item-status {
			color: #979797;
		}
		&.active {
			background-image: url('@/assets/images/industry/action-item-bg-2-act.webp');
		}
	}
	.item-status {
		font-family: PingFangSC, 'PingFang SC';
		width: 1.3rem;
		padding-left: 0.24rem;
		line-height: 0.4rem;
		font-size: 0.18rem;
		color: #00a870;
	}

	.item-label {
		font-family: PingFangSC, 'PingFang SC';
		margin-left: 0.15rem;
		font-weight: 500;
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.24rem;
	}
}

.content-card {
	flex: 1 1 0;
	width: auto;
	min-width: 0;
	min-height: 0;
	height: 100%;
	background-image: url('@/assets/images/industry/action-content-bg.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;

	&.empty {
		background-image: none;
	}
}

.content-text {
	height: 100%;
	padding: 0.16rem 0.2rem 0 0.2rem;
	overflow-y: auto;
	font-family: PingFangSC, 'PingFang SC';
	font-weight: 500;
	font-size: 0.2rem;
	color: rgba(0, 0, 0, 0.74);
	line-height: 0.35rem;
	text-align: justify;

	&::-webkit-scrollbar {
		width: 0.03rem;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(43, 124, 255, 0.25);
		border-radius: 0.02rem;
	}
}
</style>
