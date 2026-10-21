<template>
	<div class="info-page">
		<InfoComp
			:list="list"
			:total="total"
			:loading="loading"
			:deptCode="deptCode"
			:defaultDate="false"
			@fetch="handleFetch"
			@itemClick="handleItemClick"
		>
			<template #default="{ item }">
				<div class="info-card-title">
					<div class="info-card-title-text">
						<img
							class="info-card-icon"
							src="@/assets/images/DeptOverview/info-icon.png"
						/>
						<span class="info-card-title-name">
							<EllipsisText :text="item.title" :lines="1" />
						</span>
						<span class="info-card-title-date" v-if="item.publishTime"
							>({{ item.publishTime }})</span
						>
					</div>
				</div>
				<div class="info-card-item">
					<div class="info-card-line dept">
						<span class="info-card-dept">
							<EllipsisText :text="item.dept" :lines="1" />
						</span>
						
					</div>
					<div class="info-card-line tag">
						<span class="info-card-tag">
							<EllipsisText :text="item.plateFullName" :lines="1" />
						</span>
					</div>
					<div class="info-card-line is-full">
						<span class="info-card-value">
							<EllipsisText :text="item.plainText" :lines="1" />
						</span>
					</div>
				</div>
			</template>
		</InfoComp>
	</div>
</template>

<script lang="ts" setup>
import { getPolicyDynamicList } from '@/api/Intelligence/index';
import InfoComp from './InfoComp.vue';
import type { FetchListParams } from '../types';
import { openQxbPage } from '../data';

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
		const res: any = await getPolicyDynamicList(params);
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
	if (item.policyDynamicId) {
		openQxbPage(`https://z-plugin.qixin.com/recommend/policy-details?id=${item.policyDynamicId}`);
	}
};
</script>

<style scoped lang="less">
.info-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	.info-card-line {
		&.dept{
			width: 2rem;
		}
		&.tag{
			width: 1rem;
		}
	}
	.info-card-dept {
		background-color: rgb(228, 241, 255);
		color: #165dff;
		padding: 0.02rem 0.08rem;
		width: auto;
	}
	.info-card-tag {
		background-color: #e3f5e3;
		color: #0a660a;
		padding: 0.02rem 0.08rem;
	}
}
</style>
