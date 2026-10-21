<template>
	<div class="info-page">
		<InfoComp
			:list="list"
			:total="total"
			:loading="loading"
			:deptCode="deptCode"
			@fetch="handleFetch"
			@itemClick="handleItemClick"
		>
			<template #default="{ item }">
				<div class="info-card-title">
					<div class="info-card-title-text "  :class="{'has-tags':item.tags.length > 0}">
						<span class="info-card-title-name">
							<EllipsisText :text="item.title" :lines="1" />
						</span>
						<TagList class="info-card-title-tag" :tags="item.tags" />
					</div>
				</div>
				<div class="info-card-item">
					<div class="info-card-line">
						<span class="info-card-label">
							{{ `${item.pubTime}・${item.source}` }}</span
						>
					</div>
					<div class="info-card-line is-full">
						<span class="info-card-label"> 相关链接：</span>
						<span class="info-card-value">
							<CompanyTags :stats="item.companyStats" />
						</span>
					</div>
				</div>
			</template>
		</InfoComp>
	</div>
</template>

<script lang="ts" setup>
import { getsentimentdynamiclList } from '@/api/Intelligence/index';
import CompanyTags from './CompanyTags.vue';
import InfoComp from './InfoComp.vue';
import TagList from './TagList.vue';
import type { FetchListParams } from '../types';
import { parseStringData,openQxbPage } from '../data';

defineProps({
	deptCode: {
		type: String,
		default: '',
	},
});

// 列表数据由本组件持有，查询后传入 InfoComp 展示
const list: any = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

let listRequestId = 0;

// 由 InfoComp 在分页/筛选/日期变化时触发
const handleFetch = async (params: FetchListParams) => {
	loading.value = true;
	listRequestId += 1;
	const requestId = listRequestId;
	try {
		const res: any = await getsentimentdynamiclList(params);
		if (requestId !== listRequestId) return;
		if (Number(res?.code) === 0) {
			const data = res?.data || {};
			list.value =
				data.records?.map((e: any) => {
					// companyStats 形如 {'eid':'xxx','name':'yyy'},{'eid':'zzz','name':'www'}
					// 非合法 JSON（单引号），整体替换为双引号后解析为对象数组
					const companyStats = parseStringData(e.companyStats);
					// 标签数组：情感 + 标签列表（tagList 逗号分隔）
					const tags = [
						e.sentiment,
						...(typeof e.tagList === 'string' && e.tagList ? e.tagList.split(',') : []),
					].filter(Boolean);
					return {
						...e,
						companyStats,
						tags,
					};
				}) || [];
			total.value = Number(data?.total ?? 0) || 0;
		} else {
			list.value = [];
			total.value = 0;
		}
	} catch {
		if (requestId !== listRequestId) return;
		list.value = [];
		total.value = 0;
	} finally {
		if (requestId === listRequestId) {
			loading.value = false;
		}
	}
};


const handleItemClick = (item: any) => {
	if (item.oid) {
		openQxbPage(`https://z-plugin.qixin.com/recommend/defaults?oid=${item.oid}`);
	}
};
</script>

<style scoped lang="less">
.info-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	.info-card-title-tag{
		flex: 1;
		min-width: 0;
	}
	.has-tags .info-card-title-tag{
		min-width: 1.5rem;
	}
}
</style>
