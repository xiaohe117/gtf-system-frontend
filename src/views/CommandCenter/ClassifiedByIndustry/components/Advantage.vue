<template>
	<div class="advantage-page">
		<AdvantageSidebar
			:items="navItems"
			:active-key="activeSection"
			:is-customized="isCustomized"
			@select="scrollTo"
			@custom="showCustomDialog = true"
			@exit-custom="onExitCustom"
		/>

		<div class="main-content" ref="mainContentRef" @scroll="onScroll" v-loading="menuLoading">
			<EmptyData v-if="!menuLoading && isAllEmpty" />
			<template v-else>
				<div
					v-if="hasNavItem('strength') || hasNavItem('advantage')"
					class="first-screen"
					:class="{ 'first-screen--single': !hasNavItem('advantage') }"
				>
					<!-- 羊城硬核实力 -->
					<div
						v-if="hasNavItem('strength')"
						class="section section-strength"
						id="section-strength"
					>
						<BlockTitle class="section-title">
							{{ strengthTitle }}
							<template v-if="strengthDataSource || strengthDataTime" #source>
								（数据来源：{{ strengthDataSource }} · 数据时间：{{
									strengthDataTime
								}}）
							</template>
						</BlockTitle>
						<StrengthCardsCarousel
							:master-id="strengthMasterId"
							:cards-per-page="4"
							@data-loaded="onStrengthDataLoaded"
						/>
					</div>
					<!-- 综合投资优势 -->
					<div
						v-if="hasNavItem('advantage')"
						class="section section-advantage"
						id="section-advantage"
					>
						<BlockTitle class="section-title">{{ advantageTitle }}</BlockTitle>
						<AdvantageTabs v-model:active-idx="activeAdvIdx" :tabs="advantageTabs" />
					</div>
				</div>
				<!-- 产业 -->
				<div
					v-for="industry in customIndustries"
					:key="industry.id"
					class="section section-custom"
					:id="`section-${industry.id}`"
				>
					<BlockTitle class="section-title">{{ industry.name }}</BlockTitle>
					<IndustryTabs
						v-if="visibleIndustries.has(industry.id)"
						:sub-tabs="industry.subTabs"
						:top-tags="industry.topTags"
						:industry-code="industry.id"
						:industry-label="industry.name"
						:active-sub-idx="activeSubTab[industry.id] ?? 0"
						:active-top-idx="activeTopTag[industry.id] ?? 0"
						@update:active-sub-idx="(v) => (activeSubTab[industry.id] = v)"
						@update:active-top-idx="(v) => (activeTopTag[industry.id] = v)"
					/>
					<div v-else class="industry-tabs-placeholder"></div>
				</div>
			</template>
		</div>
		<!-- 定制内容 -->
		<CustomContentDialog v-model="showCustomDialog" @confirm="onCustomConfirm" />
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, watch, onMounted, nextTick } from 'vue';
import { getCustomizeMenuList } from '@/api/industry';
import useLazyLoad from '../composables/useLazyLoad';
import StrengthCardsCarousel from './StrengthCardsCarousel.vue';
import AdvantageSidebar from './AdvantageSidebar.vue';
import type {
	NavItem,
	AdvTab,
	IndustrySubTab,
	IndustryTopTag,
	CustomIndustry,
	CategoryTreeNode,
} from '../type';
import AdvantageTabs from './AdvantageTabs.vue';
import IndustryTabs from './IndustryTabs.vue';
import BlockTitle from './BlockTitle.vue';
import CustomContentDialog from './CustomContentDialog.vue';
import EmptyData from './EmptyData.vue';

const customizeMenuTree = ref<CategoryTreeNode[]>([]);
/** 产业(detailCode) → 有数据的区(detailCode) 映射，用于过滤各产业的区 tab */
const industryRegionMap = ref<Record<string, string[]>>({});
/** 定制菜单加载中（避免初次空数据误判） */
const menuLoading = ref(true);

const strengthDataSource = ref('');
const strengthDataTime = ref('');

/** 按 columnCode 查找分类节点 */
const findCategory = (code: string) => customizeMenuTree.value.find((c) => c.columnCode === code);

/** YCHARD 分类（羊城硬核实力） */
const strengthCat = computed(() => findCategory('YCHARD'));
/** ZHYS 分类（综合投资优势） */
const advantageCat = computed(() => findCategory('ZHYS'));
/** CYXZ 分类（产业选择） */
const industryCat = computed(() => findCategory('CYXZ'));

/** YCHARD 分类下首个 isCustomized(true) 子项 */
const customizedStrengthItem = computed(() =>
	strengthCat.value?.children.find((c) => c.isCustomized)
);

/** 羊城硬核实力 masterId（取 customizedStrengthItem 的 detailCode） */
const strengthMasterId = computed(() => customizedStrengthItem.value?.detailCode || '');

/** 羊城硬核实力 BlockTitle（取 customizedStrengthItem 的 detailName） */
const strengthTitle = computed(() => customizedStrengthItem.value?.detailName || '');

/** 综合投资优势 BlockTitle（取 ZHYS 分类的 columnName） */
const advantageTitle = computed(() => advantageCat.value?.columnName || '');

/** 羊城硬核实力卡片数据加载完成回调，更新数据来源和时间 */
const onStrengthDataLoaded = (dataSource: string, dataTime: string) => {
	strengthDataSource.value = dataSource;
	strengthDataTime.value = dataTime;
};

/** 综合投资优势 tab 列表（取 ZHYS 分类下 isCustomized(true) 子项，详情数据由 AdvantageTabs 内部按需请求） */
const advantageTabs = computed<AdvTab[]>(() =>
	(advantageCat.value?.children || [])
		.filter((c) => c.isCustomized)
		.map((c) => ({ id: c.detailCode, title: c.detailName }))
);

/** 要素名称关键词到 elementType 枚举值的映射 */
const ELEMENT_TYPE_KEYWORDS: { keyword: string; type: number }[] = [
	{ keyword: '市场', type: 1 },
	{ keyword: '技术', type: 2 },
	{ keyword: '人才', type: 3 },
	{ keyword: '资金', type: 4 },
	{ keyword: '载体', type: 5 },
	{ keyword: '政策', type: 6 },
];

/** 根据标签名称解析对应的要素类型 */
const parseElementType = (name: string): number => {
	const match = ELEMENT_TYPE_KEYWORDS.find((item) => name.includes(item.keyword));
	return match ? match.type : 0;
};

/** 产业列表（取 CYXZ 分类下 isCustomized(true) 子项，subTabs 来自 CYDQ，topTags 来自 CYYS） */
const customIndustries = computed<CustomIndustry[]>(() => {
	if (!industryCat.value) return [];

	// 产业所在地区：isCustomized 为 true 的子项作为全部地区，后续按 industryRegionMap 过滤
	const allSubTabs: IndustrySubTab[] =
		findCategory('CYDQ')
			?.children.filter((c) => c.isCustomized)
			.map((c) => ({ name: c.detailName, code: c.detailCode })) || [];

	// 产业优势：isCustomized 为 true 的子项作为 topTags，elementType 从 detailName 解析
	const topTags: IndustryTopTag[] =
		findCategory('CYYS')
			?.children.filter((c) => c.isCustomized)
			.map((c) => ({ name: c.detailName, elementType: parseElementType(c.detailName) })) ||
		[];

	return industryCat.value.children
		.filter((c) => c.isCustomized)
		.map((c) => {
			const regionCodes = industryRegionMap.value[c.detailCode] || [];
			// 仅保留有数据的区；"全市"始终保留作为默认可选项
			const subTabs = allSubTabs.filter(
				(t) => t.name === '全市' || regionCodes.includes(t.code)
			);
			return { id: c.detailCode, name: c.detailName, subTabs, topTags };
		});
});

/** 侧边栏导航项（羊城硬核实力、综合投资优势、产业选择按 isCustomized 过滤后同级展示） */
const navItems = computed<NavItem[]>(() => {
	const items: NavItem[] = [];

	// 羊城硬优势：子项有 isCustomized 为 true 则展示，label 取接口 columnName
	if (strengthCat.value?.children.some((c) => c.isCustomized)) {
		items.push({ id: 'strength', label: strengthCat.value.columnName });
	}

	// 综合投资优势：子项有 isCustomized 为 true 则展示，label 取接口 columnName
	if (advantageCat.value?.children.some((c) => c.isCustomized)) {
		items.push({ id: 'advantage', label: advantageCat.value.columnName });
	}

	// 产业选择：isCustomized 为 true 的子项同级展示
	industryCat.value?.children
		.filter((c) => c.isCustomized)
		.forEach((c) => {
			items.push({ id: c.detailCode, label: c.detailName });
		});

	return items;
});

/** 判断指定 id 的导航项是否存在 */
const hasNavItem = (id: string) => navItems.value.some((n) => n.id === id);

/** 所有模块都为空（无羊城硬核实力、综合投资优势、产业选择） */
const isAllEmpty = computed(
	() => !hasNavItem('strength') && !hasNavItem('advantage') && customIndustries.value.length === 0
);

/** 当前滚动高亮的 section id（侧边栏导航高亮项） */
const activeSection = ref('strength');
/** 定制内容弹窗显隐状态 */
const showCustomDialog = ref(false);
/** 是否已确认定制（控制侧边栏底部按钮互斥显示） */
const isCustomized = ref(false);
/** 主内容滚动容器引用（用于滚动定位与滚动监听） */
const mainContentRef = ref<HTMLElement | null>(null);
/** 综合投资优势当前激活 tab 索引 */
const activeAdvIdx = ref(0);
/** 各产业当前选中的子 tab（产业所在地区）索引，key 为产业 id */
const activeSubTab = reactive<Record<string, number>>({});
/** 各产业当前选中的顶部标签（产业优势）索引，key 为产业 id */
const activeTopTag = reactive<Record<string, number>>({});

/** 延迟加载：产业 section 进入可视区域后才渲染 IndustryTabs */
const { visibleSet: visibleIndustries, observe: observeIndustry } = useLazyLoad({
	root: mainContentRef,
	rootMargin: '200px 0px',
});

/** 滚动到指定 section 并同步侧边栏高亮 */
const scrollTo = (sectionId: string) => {
	activeSection.value = sectionId;
	const el = document.getElementById(`section-${sectionId}`);
	const container = mainContentRef.value;
	if (el && container) {
		container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
	}
};

/** 获取定制菜单列表并初始化综合投资优势默认选中项 */
const fetchCustomizeMenu = async () => {
	menuLoading.value = true;
	try {
		const res = await getCustomizeMenuList<{
			customizedDetailIds: string[];
			categoryTree: CategoryTreeNode[];
			industryRegionMap: Record<string, string[]>;
		}>();
		if (res.code === 0 && res.data) {
			customizeMenuTree.value = res.data.categoryTree || [];
			industryRegionMap.value = res.data.industryRegionMap || {};
			// 默认选中第一个定制化的综合投资优势 tab，详情数据由 AdvantageTabs 内部按需请求
			activeAdvIdx.value = 0;
		}
	} catch {
		customizeMenuTree.value = [];
	} finally {
		menuLoading.value = false;
	}
};

/** 定制弹窗确认回调：进入定制模式，重新拉取菜单数据 */
const onCustomConfirm = () => {
	isCustomized.value = true;
	fetchCustomizeMenu();
};

/** 退出定制：重置为未定制状态，重新拉取初始菜单数据 */
const onExitCustom = () => {
	isCustomized.value = false;
	fetchCustomizeMenu();
};

/** 滚动时根据偏移量同步侧边栏高亮项 */
const onScroll = () => {
	const container = mainContentRef.value;
	if (!container) return;
	const { scrollTop } = container;
	const ids = navItems.value.map((n) => n.id);
	const current = ids.reduce((acc, id) => {
		const el = document.getElementById(`section-${id}`);
		return el && scrollTop + 20 >= el.offsetTop ? id : acc;
	}, ids[0]);
	activeSection.value = current;
};

/** 产业列表变化时初始化各产业的子 tab 和顶部标签选中索引 */
watch(
	() => customIndustries.value,
	(industries) => {
		industries.forEach((ind) => {
			if (activeSubTab[ind.id] === undefined) activeSubTab[ind.id] = 0;
			if (activeTopTag[ind.id] === undefined) activeTopTag[ind.id] = 0;
		});
		// DOM 更新后注册到 IntersectionObserver
		nextTick(() => {
			industries.forEach((ind) => {
				const el = document.getElementById(`section-${ind.id}`);
				if (el) observeIndustry(ind.id, el);
			});
		});
	},
	{ immediate: true }
);

/** 组件挂载：获取定制菜单 */
onMounted(() => {
	fetchCustomizeMenu();
});
</script>

<style lang="less" scoped>
.advantage-page {
	flex: 1;
	height: 100%;
	display: flex;
	gap: 0.12rem;
	min-height: 0;
	overflow: hidden;
	background: linear-gradient(180deg, #f0f7ff 0%, #e8f2ff 50%, #edf5ff 100%);
	border-radius: 0.08rem;
	position: relative;
}

.main-content {
	flex: 1;
	min-height: 0;
	min-width: 0;
	position: relative;
	overflow-y: auto;
	overflow-x: hidden;
	scroll-behavior: smooth;
	padding: 0.16rem 0.2rem 0.16rem 0;
	box-sizing: border-box;

	:deep(.empty-data) {
		width: 100%;
		height: 100%;
	}
}
.section-title {
	:deep(.title-text) {
		font-size: 0.22rem;
	}
}
.first-screen {
	display: flex;
	flex-direction: column;
	min-height: calc(100% - 0.08rem);
	box-sizing: border-box;
	gap: 0.12rem;

	&.first-screen--single {
		min-height: auto;
	}
}

.section {
	&.section-strength {
		flex-shrink: 0;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	&.section-advantage {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	&.section-custom {
		margin-top: 0.2rem;
		flex-shrink: 0;
		min-height: 5rem;
		display: flex;
		flex-direction: column;

		:deep(.industry-tabs-container) {
			flex: 1;
			min-height: 0;
		}

		.industry-tabs-placeholder {
			flex: 1;
			min-height: 4rem;
		}
	}
}
</style>
