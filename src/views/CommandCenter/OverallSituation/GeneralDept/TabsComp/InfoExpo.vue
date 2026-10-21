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
					<div class="info-card-title-text">
						<img class="info-card-icon" src="@/assets/images/DeptOverview/info-icon.png"/>
						<span class="info-card-title-name">
							<EllipsisText :text="item.exhibitionTitle" :lines="1" />
						</span>
						<span class="info-card-title-date" v-if="item.beginDate || item.endDate">({{ formatExpoDate(item) }})</span>
					</div>
				</div>
				<div class="info-card-item">
					<div class="info-card-line address">
						<span class="info-card-label"> 所在地区：</span>
						<span class="info-card-value">
							<EllipsisText :text="formatRegion(item)" :lines="1" />
						</span>
					</div>
					<div class="info-card-line">
						<span class="info-card-label"> 所属行业：</span>
						<span class="info-card-value">{{ item.industry }}</span>
					</div>
					<div class="info-card-line is-full">
						<span class="info-card-label"> 主办单位：</span>
						<span class="info-card-value">
							<EllipsisText :text="item.hostUnit" :lines="1" />
						</span>
					</div>
				</div>
			</template>
		</InfoComp>
	</div>
</template>

<script lang="ts" setup>
import { getMeetingDynamicList } from '@/api/Intelligence/index';
import InfoComp from './InfoComp.vue';
import type { FetchListParams } from '../types';

defineProps({
	deptCode: {
		type: String,
		default: '',
	},
});

// 会展日期：beginDate ~ endDate，缺失时只展示已有部分
const formatExpoDate = (item: { beginDate?: string; endDate?: string }) =>
	[item.beginDate || '', item.endDate || ''].filter(Boolean).join('-');

// 直辖市（北京、上海、天津、重庆等）province 与 city 相同，只展示城市名
const MUNICIPALITY_NAMES = ['北京', '上海', '天津', '重庆'];
const formatRegion = (item: { province?: string; city?: string }) => {
	const province = item.province || '';
	const city = item.city || '';
	const isMunicipality =
		province === city ||
		MUNICIPALITY_NAMES.some(name => province.includes(name) && city.includes(name));
	if (isMunicipality) return city;
	return `${province}${city}`;
};

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
		const res: any = await getMeetingDynamicList(params);
		if (requestId !== listRequestId) return;
		if (Number(res?.code) === 0) {
			const data = res?.data || {};
			list.value = data.records || [];
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
	if (item.url) {
		window.open(item.url, '_blank');
	}
};
</script>

<style scoped lang="less">
.info-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	.address{
		width: 2rem;
	}
}
</style>
