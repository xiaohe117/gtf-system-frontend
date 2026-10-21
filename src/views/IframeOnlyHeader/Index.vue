<template>
	<div class="iframe-only-header">
		<IframeView :src="url" @loaded="handleLoaded" />
	</div>
</template>
<script lang="ts" setup>
import ServiceUrl from '@/utils/url';
import { useRoute } from 'vue-router';
import { getEmbedTickets } from '@/api/user';

const route = useRoute();
const config: any = {
	assistant: `${ServiceUrl.getAiUrl()}/web/iframe/bootstrap`,
};

const pageType: any = computed(() => route.params.pageType);

const url = computed(() => config[pageType.value]);

const handleLoaded = async (el: HTMLIFrameElement) => {
	if (pageType.value !== 'assistant') {
		return;
	}
	const res = await getEmbedTickets<{ ticket: string }>();
	const ticket = res.data?.ticket ?? '';
	setTimeout(() => {
		try {
			el.contentWindow?.postMessage({ type: 'GTF_EMBED_TICKET', ticket }, '*');
		} catch (error) {
			console.log('发送消息失败', error);
		}
	},300);
};
</script>
<style lang="less" scoped>
.iframe-only-header {
	width: 100%;
	height: 100%;
	:deep(.iframe-content) {
		height: 100% !important;
	}
}
</style>