<template>
	<div v-loading="loading || iframeLoading" class="empowerment-tool">
		<iframe
			v-if="iframeSrc"
			:src="iframeSrc"
			class="tool-iframe"
			frameborder="0"
			allowfullscreen
			@load="onIframeLoad"
		></iframe>
		<EmptyData v-else />
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import EmptyData from '@/views/CommandCenter/ClassifiedByIndustry/components/EmptyData.vue';
import useEmpowermentUrl from '../composables/useEmpowermentUrl';

const props = defineProps({
	industryCode: {
		type: String,
		default: '',
	},
});

const { loading, iframeSrc } = useEmpowermentUrl(() => props.industryCode);
const iframeLoading = ref(false);

const onIframeLoad = () => {
	iframeLoading.value = false;
};

watch(iframeSrc, (val) => {
	if (val) iframeLoading.value = true;
});
</script>

<style lang="less" scoped>
.empowerment-tool {
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 0.06rem;
	box-sizing: border-box;

	.tool-iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
}
</style>
