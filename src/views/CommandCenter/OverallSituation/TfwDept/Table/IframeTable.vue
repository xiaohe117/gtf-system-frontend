<template>
	<div class="iframe-table">
		<IframeView :src="url" class="iframe-container" />
	</div>
</template>
<script lang="ts" setup>
import ServiceUrl from '@/utils/url';

const props = defineProps({
	curTitleTab: {
		type: Number,
		default: 1,
	},
	dateValue: {
		type: Object as PropType<{ startTimeStr: string; endTimeStr: string }>,
		default: () => ({ startTimeStr: '', endTimeStr: '' }),
	},
});

const url: any = ref('');

const getUrl = () => {
    const params = 'headerBgColor=%230268fb&industryColumnColor=%23000000&headerFontColor=%23ffffff'
	const config: any = {
		weekIframe: `${ServiceUrl.getQmSysUrl()}/pc/projectManage/projectList/weekIframe?${params}`,
		sixBatchIframe: `${ServiceUrl.getQmSysUrl()}/pc/projectManage/projectList/sixBatchIframe?${params}`,
	};
	url.value = config[props.curTitleTab];
};

watch(
	() => props.curTitleTab,
	() => {
		getUrl();
	},
	{ immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.iframe-container {
	min-height: 0 !important;
    height: 100%;
	padding-top: 0.24rem;
}
:deep(.iframe-content) {
	height: 100% !important;
}
</style>