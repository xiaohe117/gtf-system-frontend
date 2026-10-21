<template>
	<div v-loading="loading" class="element-details">
		<!-- 左侧区tab：绝对定位贴在弹窗左外侧 -->
		<div class="district-sidebar">
			<div class="district-scroll">
				<div
					v-for="district in districtTabs"
					:key="district.code"
					class="district-item"
					:class="{ active: activeDistrict === district.code }"
					@click="activeDistrict = district.code"
				>
					{{ district.name }}
				</div>
			</div>
		</div>
		<div class="detail-tabs">
			<div
				v-for="topic in topics"
				:key="topic.key"
				class="tab-item"
				:class="{ active: activeKey === topic.key }"
				@click="activeKey = topic.key"
			>
				{{ topic.title }}
			</div>
		</div>
		<!-- 内容区 -->
		<div class="detail-content" v-if="currentTopic">
			<div class="section-block section-experience">
				<div class="section-title">
					<div class="title-text">{{ currentTopic.sections.experience.title }}</div>
					<div
						v-if="currentTopic.dataSource || currentTopic.dataTime"
						class="section-source"
					>
						（数据来源：{{ currentTopic.dataSource }} · 数据时间：{{
							currentTopic.dataTime
						}}）
					</div>
				</div>
				<div class="section-list">
					<RichText
						v-if="currentTopic.sections.experience.content"
						:html="currentTopic.sections.experience.content"
						class="item-text"
					></RichText>
					<div v-else class="item-text no-data">暂无数据</div>
				</div>
			</div>
			<div class="section-block section-situation">
				<div class="section-title">
					<span class="title-text">{{ currentTopic.sections.situation.title }}</span>
					<div
						v-if="currentTopic.dataSource || currentTopic.dataTime"
						class="section-source"
					>
						（数据来源：{{ currentTopic.dataSource }} · 数据时间：{{
							currentTopic.dataTime
						}}）
					</div>
				</div>
				<div class="section-list">
					<RichText
						v-if="currentTopic.sections.situation.content"
						:html="currentTopic.sections.situation.content"
						class="item-text"
					></RichText>
					<div v-else class="item-text no-data">暂无数据</div>
				</div>
			</div>
		</div>
		<EmptyData v-else />
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { getCustomizeRegionList, industryTypeSixElementList } from '@/api/industry';
import EmptyData from './EmptyData.vue';
import RichText from './RichText.vue';
import type { TopicItem, SixElementItem, DistrictTab } from '../type';

const props = withDefaults(
	defineProps<{
		industryCode?: string;
	}>(),
	{ industryCode: '' }
);

const SITUATION_TITLE_MAP: Record<number, string> = {
	1: '市场情况',
	2: '技术情况',
	3: '人才情况',
	4: '资金情况',
	5: '载体情况',
	6: '政策情况',
};

/** 已启用的地区列表 */
const regionList = ref<{ regionCode: string; regionName: string }[]>([]);
/** 当前选中的区编码（空字符串表示未初始化，"CYDQ01"表示全市） */
const activeDistrict = ref('');
/** 当前选中的要素tab key */
const activeKey = ref<string>('');
/** 六要素数据 */
const sixElementDataList = ref<SixElementItem[]>([]);
const loading = ref(false);

/** 区tab列表：全市始终作为第一个tab，其余取接口返回的地区 */
const districtTabs = computed<DistrictTab[]>(() => {
	const tabs: DistrictTab[] = [{ code: 'CYDQ01', name: '全市' }];
	regionList.value.forEach((item) => {
		if (item.regionName !== '全市') {
			tabs.push({ code: item.regionCode, name: item.regionName });
		}
	});
	return tabs;
});

/** 要素列表，由六要素数据转换 */
const topics = computed<TopicItem[]>(() =>
	sixElementDataList.value.map((item) => ({
		key: String(item.elementType),
		title: item.elementTypeName,
		dataSource: item.dataSource,
		dataTime: item.updatedTime,
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

/** 当前选中的要素 */
const currentTopic = computed(
	() => topics.value.find((t) => t.key === activeKey.value) || topics.value[0]
);

/** 获取已启用的地区列表 */
const fetchRegionList = async () => {
	try {
		const res = await getCustomizeRegionList<{ regionCode: string; regionName: string }[]>({
			industryCode: props.industryCode,
		});
		if (res.code === 0 && res.data) {
			regionList.value = res.data;
		}
	} catch {
		regionList.value = [];
	}
};

/** 请求六要素数据 */
const fetchSixElement = async () => {
	if (!props.industryCode) {
		sixElementDataList.value = [];
		return;
	}
	loading.value = true;
	try {
		const params: Record<string, unknown> = { industryCode12218: props.industryCode };
		if (activeDistrict.value && activeDistrict.value !== 'CYDQ01') {
			params.regionCode = activeDistrict.value;
		}
		const res = await industryTypeSixElementList<SixElementItem[]>(params);
		if (res.code === 0 && res.data) {
			sixElementDataList.value = res.data;
			// 确保当前选中的 tab 有效
			if (
				!activeKey.value ||
				!sixElementDataList.value.some((d) => String(d.elementType) === activeKey.value)
			) {
				activeKey.value =
					sixElementDataList.value.length > 0
						? String(sixElementDataList.value[0].elementType)
						: '';
			}
		} else {
			sixElementDataList.value = [];
		}
	} catch {
		sixElementDataList.value = [];
	} finally {
		loading.value = false;
	}
};

/** 初始化：获取地区列表，选中"全市"并请求数据 */
const init = async () => {
	await fetchRegionList();
	const defaultCode = 'CYDQ01';
	if (activeDistrict.value !== defaultCode) {
		// 值变化时 watch(activeDistrict) 会自动触发 fetchSixElement
		activeDistrict.value = defaultCode;
	} else {
		// 值未变化，watch 不会触发，手动请求
		fetchSixElement();
	}
};

/** industryCode 变化时重置数据并重新初始化 */
watch(
	() => props.industryCode,
	(newCode) => {
		sixElementDataList.value = [];
		activeKey.value = '';
		if (newCode) {
			init();
		} else {
			regionList.value = [];
			activeDistrict.value = '';
		}
	},
	{ immediate: true }
);

/** 切换区时重新请求六要素数据 */
watch(activeDistrict, (district) => {
	if (props.industryCode && district) {
		fetchSixElement();
	}
});

/** 要素列表变化时兜底选中第一个 */
watch(
	() => topics.value,
	(newTopics) => {
		if (newTopics.length > 0 && !newTopics.some((t) => t.key === activeKey.value)) {
			activeKey.value = newTopics[0].key;
		}
	}
);

/** 外部调用：选中指定要素tab */
const selectTopic = (key: string) => {
	activeKey.value = key;
};

/** 外部调用：弹窗重新打开时重新加载数据 */
const reload = () => {
	init();
};

defineExpose({ selectTopic, reload });
</script>

<style lang="less" scoped>
.element-details {
	position: relative;
	width: 100%;
	height: calc(100vh - 4rem);
	display: flex;
	flex-direction: column;
	gap: 0.12rem;
	background-image: url('@/assets/images/industry/detail-ele-bg.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-position: 0 0;

	:deep(.empty-data) {
		flex: 1;
		width: 100%;
	}
}

.detail-tabs {
	display: flex;
	align-items: center;
	height: 0.48rem;
	border: 0.01rem solid rgba(255, 255, 255, 0.4);
	box-sizing: border-box;
	flex-shrink: 0;
	.tab-item {
		flex: 1;
		height: 0.48rem;
		max-width: 1.16rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: YouSheBiaoTiHei;
		font-size: 0.2rem;
		color: #fff;
		letter-spacing: 0.01rem;
		text-shadow: 0.01rem 0.01rem 0.02rem rgba(44, 73, 182, 0.5);
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		&.active {
			font-size: 0.28rem;
			line-height: 0.36rem;
			letter-spacing: 0.05rem;
			text-shadow: 0.01rem 0.01rem 0 #000000;
			background-image: url('@/assets/images/industry/line.webp');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: 0 bottom;
			margin-bottom: -0.04rem;
		}
	}
}

.district-sidebar {
	position: absolute;
	left: -1.02rem;
	top: -16px;
	width: 0.84rem;
	max-height: calc(100% + 18px);
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	z-index: 10;

	.district-scroll {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding: 0 0.04rem;
		.district-item {
			width: 0.84rem;
			height: 0.44rem;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 600;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.65);
			background: #d4e3fc;
			border-radius: 0.12rem 0 0 0.12rem;
			cursor: pointer;
			transition: all 0.2s ease;
			flex-shrink: 0;

			&.active {
				background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
				color: #fff;
			}
		}
	}
}

.detail-content {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.16rem;
	overflow-y: auto;
	padding: 0.12rem 0.12rem 0.12rem 0;

	&::-webkit-scrollbar {
		width: 0.05rem;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(31, 110, 251, 0.3);
		border-radius: 0.03rem;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	.section-block {
		display: flex;
		flex-direction: column;

		.section-title {
			height: 0.48rem;
			padding: 0.12rem 0.08rem;
			background-image: url('@/assets/images/industry/ele-title-bg-2.webp');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: 0 0;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			gap: 0.12rem;
			.title-text {
				width: 1.18rem;
				height: 0.32rem;
				display: flex;
				align-items: center;
				justify-content: center;
				font-family: YouSheBiaoTiHei;
				font-size: 0.2rem;
				color: #fff;
				text-shadow: -0.01rem 0.01rem 0 rgba(38, 111, 232, 0.5);
				flex-shrink: 0;
			}
			.section-source {
				font-family: SourceHanSansSC;
				font-size: 0.16rem;
				color: rgba(0, 0, 0, 0.5);
				min-width: 0;
			}
		}

		.section-list {
			flex: 1;
			background-image: url('@/assets/images/industry/ele-content-bg-2.webp');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: 0 0;
			padding: 0.08rem 0.16rem 0.12rem;

			.item-text {
				font-family: PingFangSC, 'PingFang SC';
				font-size: 0.18rem;
				color: rgba(0, 0, 0, 0.79);
				line-height: 1.6;
				text-align: justify;
				word-break: break-word;

				&.no-data {
					text-align: center;
					color: rgba(0, 0, 0, 0.4);
				}
			}
		}
	}

	.section-experience {
		.section-title .title-text {
			background-image: url('@/assets/images/industry/sub-title-bg-2.webp');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: 0 0;
		}
	}

	.section-situation {
		.section-title {
			height: auto;
			padding: 0 0 0.08rem 0.08rem;
			background-image: none;

			.title-text {
				background-image: url('@/assets/images/industry/sub-title-bg.webp');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: 0 0;
			}
		}

		.section-list {
			background-image: none;
			padding: 0.04rem 0.16rem;
		}
	}
}
</style>
