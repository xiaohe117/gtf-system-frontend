<template>
	<div v-loading="loading" class="classified-by-industry">
		<HeaderTabs :tabs="headerTabs" :active-id="activeTabId" @change="handleTabChange" />
		<div class="page-body">
			<IndustrySidebar
				:groups="industryGroups"
				:active-key="activeIndustryKey"
				@select="handleIndustrySelect"
			/>
			<ContentPanel :industry="currentIndustry" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { industryTypeList } from '@/api/industry';
import HeaderTabs from '@/views/CommandCenter/ClassifiedByIndustry/components/HeaderTabs.vue';
import IndustrySidebar from '@/views/CommandCenter/ClassifiedByIndustry/components/IndustrySidebar.vue';
import ContentPanel from '@/views/CommandCenter/ClassifiedByIndustry/components/ContentPanel.vue';
import type { IndustryTypeItem, IndustryGroup } from './type';

const activeTabId = ref<number>(0);
const activeIndustryKey = ref<string>('');
const industryTypeData = ref<IndustryTypeItem[]>([]);
const loading = ref(false);
// 一级菜单-产业类别
const headerTabs = computed(() => {
	const categories = [...new Set(industryTypeData.value.map((item) => item.industrialCategory))];
	return categories.map((cat, index) => ({ id: index + 1, label: cat }));
});
// 二级菜单-产业分类
const industryGroups = computed(() => {
	const currentTab = headerTabs.value.find((tab) => tab.id === activeTabId.value);
	if (!currentTab) return [];

	const filteredData = industryTypeData.value.filter(
		(item) => item.industrialCategory === currentTab.label
	);

	const groupMap = new Map<string, IndustryGroup>();
	filteredData.forEach((item) => {
		let group = groupMap.get(item.subIndustry);
		if (!group) {
			group = { title: item.subIndustry, items: [] };
			groupMap.set(item.subIndustry, group);
		}
		if (!item.industryCode || item.industryCode === 40000) return; // 该产业暂不需要展示
		const key = String(item.industryCode);
		group.items.push({
			key,
			label: item.industryType,
		});
	});

	return [...groupMap.values()];
});
// 产业大类下的首个产业（二级菜单）
const firstItem = computed(() => industryGroups.value.flatMap((group) => group.items)[0]);

const selectFirstIndustry = () => {
	const item = firstItem.value;
	if (item) {
		activeIndustryKey.value = item.key;
	}
};
// 一级菜单-切换
const handleTabChange = (id: number) => {
	activeTabId.value = id;
	selectFirstIndustry();
};
// 二级菜单-切换
const handleIndustrySelect = (key: string) => {
	activeIndustryKey.value = key;
};
// 选中的产业（二级菜单）
const currentIndustry = computed(() => {
	const found = industryGroups.value
		.flatMap((group) => group.items)
		.find((item) => item.key === activeIndustryKey.value);
	return found || firstItem.value;
});
// 获取产业tab数据
const fetchIndustryTypeList = async () => {
	loading.value = true;
	try {
		const res = await industryTypeList();
		if (res.code === 0) {
			industryTypeData.value = (res.data as IndustryTypeItem[]) || [];
			// 默认选中第一个tab
			if (headerTabs.value.length > 0) {
				activeTabId.value = headerTabs.value[0].id;
			}
			selectFirstIndustry();
		}
	} catch {
		industryTypeData.value = [];
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchIndustryTypeList();
});
</script>

<style lang="less" scoped>
.classified-by-industry {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 0.18rem 0.24rem;
	background-image: url('@/assets/images/industry/bg.webp');
	background-size: 100% 100%;
	box-sizing: border-box;
	overflow: hidden;
	.page-body {
		flex: 1;
		min-height: 0;
		display: flex;
		gap: 0.16rem;
		margin-top: 0.2rem;
	}
}
</style>
