<template>
	<div class="result-item" @click="openResultLink">
		<img src="@/assets/images/IntelligenceOverview/start.png" class="result-icon" alt="" />
		<div class="result-main">
			<div class="result-title-row">
				<el-tooltip
					:show-after="300"
					:content="item.title || '--'"
					placement="top"
					:disabled="!item.title || !titleOverflow"
				>
					<div
						class="result-title"
						v-html="item.titleHtml"
						@mouseenter="titleOverflow = isOverflowing($event)"
					></div>
				</el-tooltip>
				<el-tooltip
					v-if="item.companyName"
					:show-after="300"
					:content="item.companyName"
					placement="top"
					:disabled="!companyOverflow"
				>
					<span
						class="result-company"
						@mouseenter="companyOverflow = isOverflowing($event)"
					>
						(<span v-html="item.companyNameHtml"></span>)
					</span>
				</el-tooltip>
			</div>
			<div v-if="item.metas.length" class="result-meta">
				<span
					v-for="meta in item.metas"
					:key="meta.label"
					class="meta-item"
					:class="meta.className"
				>
					<span class="meta-label">{{ meta.label }}：</span>
					<el-tooltip
						:show-after="300"
						:content="meta.value || '--'"
						placement="top"
						:disabled="!meta.value || !metaOverflow[meta.label]"
					>
						<span
							class="meta-value"
							v-html="meta.valueHtml"
							@mouseenter="metaOverflow[meta.label] = isOverflowing($event)"
						></span>
					</el-tooltip>
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getQxbToken } from '@/api/Intelligence/index';
import type { ResultItem } from '../composables/useSearchResults';

const QXB_BASE_URL = 'https://z-plugin.qixin.com/third-login?tenant=gd_gdyt1';

const props = defineProps<{
	item: ResultItem;
	sectionKey?: string;
}>();

const titleOverflow = ref(false);
const companyOverflow = ref(false);
const metaOverflow = reactive<Record<string, boolean>>({});

const isOverflowing = (event: Event) => {
	const el = event.currentTarget as HTMLElement | null;
	if (!el) return false;
	return el.scrollWidth > el.clientWidth;
};

const openQxbPage = async (returnUrl: string) => {
	const res = await getQxbToken();
	if (!res.data) return;
	const targetUrl = `${QXB_BASE_URL}&token=${res.data}&returnUrl=${encodeURIComponent(returnUrl)}`;
	window.open(targetUrl, '_blank');
};

const openResultLink = () => {
	if (props.sectionKey === 'policy') {
		if (!props.item.policyDynamicId) return;
		openQxbPage(
			`https://z-plugin.qixin.com/recommend/policy-details?id=${props.item.policyDynamicId}`
		);
		return;
	}
	if (!props.item.url) return;
	window.open(props.item.url, '_blank');
};
</script>

<style lang="less" scoped>
.result-item {
	display: flex;
	align-items: center;
	gap: 0.08rem;
	margin-bottom: 0.08rem;
	padding: 0.08rem 0.12rem;
	border-radius: 0.06rem;
	cursor: pointer;
	background: #f6f8fc;
	border: 1px solid #dcdfe6;

	&:hover .result-title {
		color: #165dff;
	}

	:deep(em) {
		font-family:
			PingFangSC,
			PingFang SC;
		font-style: normal;
		color: #165dff;
	}
}

.result-icon {
	width: 0.16rem;
	height: 0.16rem;
	flex-shrink: 0;
}

.result-main {
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
	gap: 0.24rem;
}

.result-title-row {
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
	overflow: hidden;

	> :deep(.el-tooltip__trigger:first-child) {
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	> :deep(.el-tooltip__trigger:has(.result-company)) {
		flex: 0 0 2rem;
		width: 2rem;
		overflow: hidden;
	}
}

.result-title {
	flex: 1;
	min-width: 0;
	font-size: 0.16rem;
	font-weight: 600;
	color: #202741;
	line-height: 0.24rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.result-company {
	flex: 0 0 2rem;
	width: 2rem;
	margin-left: 0.08rem;
	font-size: 0.14rem;
	font-weight: 400;
	color: #8897b7;
	line-height: 0.24rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.result-meta {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	gap: 0.02rem;
	font-size: 0.13rem;
	color: #8897b7;
	white-space: nowrap;
}

.meta-item {
	display: inline-flex;
	align-items: center;
	flex: 0 0 2.5rem;
	width: 2.5rem;
	text-align: left;
	white-space: nowrap;
	overflow: hidden;

	.meta-label {
		flex-shrink: 0;
	}

	:deep(.el-tooltip__trigger) {
		display: block !important;
		flex: 0 0 1.8rem;
		width: 1.8rem;
		overflow: hidden;
		min-width: 0;
	}

	.meta-value {
		display: block;
		flex: 0 0 1.8rem;
		width: 1.8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		color: rgba(0, 0, 0, 0.9);
		white-space: nowrap;
	}
}
</style>
