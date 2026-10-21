<template>
	<div class="rich-text" v-html="rendered"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { replaceGtfApiUrl } from '@/utils';

const props = withDefaults(defineProps<{ html?: string }>(), { html: '' });

/** 渲染前统一替换富文本中图片地址的 host，兼容不同网络环境 */
const rendered = computed(() => replaceGtfApiUrl(props.html));
</script>

<style lang="less" scoped>
.rich-text {
	:deep(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 0.08rem 0;

		th,
		td {
			border: 0.01rem solid rgba(0, 0, 0, 0.2);
			padding: 0.06rem 0.08rem;
			text-align: center;
			vertical-align: middle;
		}

		th {
			background: rgba(37, 110, 255, 0.1);
			font-weight: 600;
		}
	}

	:deep(img) {
		max-width: 100%;
		height: auto;
	}

	:deep(ul),
	:deep(ol) {
		margin: 0.08rem 0;

		li {
			list-style-position: inside;
			line-height: 1.7;
		}
	}

	:deep(ul) li {
		list-style: disc inside;
	}

	:deep(ol) li {
		list-style: decimal inside;
	}
}
</style>