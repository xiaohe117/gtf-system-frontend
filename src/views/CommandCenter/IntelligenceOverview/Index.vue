<!--
 * @Descripttion: 情报概览页面
 * @Author: opencode
 * @Date: 2026-06-12
-->
<template>
	<div class="intelligence-overview">
		<div class="left-panel">
			<SearchHeader :get-qxb-token="getLatestQxbToken" />
			<FrameBox class="left-card">
				<EnterpriseDynamics class="outside-content" :get-qxb-token="getLatestQxbToken" />
			</FrameBox>
			<FrameBox class="left-card">
				<IndustryDevelopment :get-qxb-token="getLatestQxbToken" />
			</FrameBox>
		</div>
		<div class="right-panel">
			<div class="data-update-time">
				数据更新时间：{{ latestUpdateTime || '--年--月--日' }}
			</div>
			<FrameBox style="max-height: 100%; height: 100%; border-radius: 0.11rem">
				<TargetEnterpriseRecommend :get-qxb-token="getLatestQxbToken" />
			</FrameBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getlatestupdateTime, getQxbToken } from '@/api/Intelligence/index';
import EnterpriseDynamics from './components/EnterpriseDynamics.vue';
import IndustryDevelopment from './components/IndustryDevelopment.vue';
import SearchHeader from './components/SearchHeader.vue';
import TargetEnterpriseRecommend from './components/TargetEnterpriseRecommend.vue';

type QxbTokenData =
	| string
	| {
			token?: string;
			qxbToken?: string;
			accessToken?: string;
			access_token?: string;
	  };

type LatestUpdateTimeData = {
	updateTime?: string;
};

// const QXB_DEFAULT_INDUSTRY_CODE = '10103';

const latestUpdateTime = ref('');

const normalizeQxbToken = (data: QxbTokenData | null | undefined): string => {
	if (!data) return '';
	if (typeof data === 'string') return data;
	return data.token || data.qxbToken || data.accessToken || data.access_token || '';
};

const getLatestQxbToken = async (): Promise<string> => {
	try {
		const res = await getQxbToken<QxbTokenData>();
		return res.code === 0 ? normalizeQxbToken(res.data) : '';
	} catch {
		return '';
	}
};

const getLatestUpdateTime = async () => {
	try {
		const res = await getlatestupdateTime<LatestUpdateTimeData>();
		latestUpdateTime.value = res.code === 0 ? res.data?.updateTime || '' : '';
	} catch {
		latestUpdateTime.value = '';
	}
};

onMounted(() => {
	getLatestUpdateTime();
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});
</script>

<style lang="less" scoped>
.intelligence-overview {
	display: flex;
	width: 100%;
	height: 100%;
	min-width: 0;
	overflow: hidden;
	gap: 0.1rem;
}

.left-panel {
	width: 13.8rem;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
	min-height: 0;
	overflow: hidden;
}

.left-card {
	flex: 1;
	width: 100%;
	min-width: 0;
	min-height: 0;
	height: 0;
	overflow: hidden;
	border-radius: 0.11rem;
}

.right-panel {
	position: relative;
	width: 5.229rem;
	display: flex;
	flex-direction: column;
	min-width: 0;
	height: 100%;
}

.data-update-time {
	position: absolute;
	top: -0.3rem;
	right: 0.08rem;
	z-index: 10;
	color: #2f6bef;
	font-size: 0.14rem;
	font-weight: 600;
	line-height: 0.24rem;
	white-space: nowrap;
	pointer-events: none;
}

:deep(.outside) {
	> div > div:not(:last-child) {
		margin: 0;
	}
}

:deep(.outside) {
	.outside-content {
		> div:not(:last-child) {
			// margin-bottom: 0.1rem;
		}
		background-color: white;
		padding-top: 0;
	}
}
</style>
