<template>
	<el-tooltip
		effect="dark"
		:content="content"
		placement="top"
		:disabled="tooltipDisabled"
	>
		<span
			ref="rootRef"
			class="ellipsis-host"
			:class="{ 'is-flex': flex, 'is-inline': inline }"
			@mouseenter="checkOverflow"
		>
			<slot />
		</span>
	</el-tooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
	defineProps<{
		content?: string;
		/** 外部指定是否禁用 tooltip，如 JS 截断场景 */
		disabled?: boolean;
		/** 在 flex 行内占满剩余宽度 */
		flex?: boolean;
		/** 行内包裹（标签等不抢宽度） */
		inline?: boolean;
	}>(),
	{
		content: '',
		disabled: undefined,
		flex: false,
		inline: false,
	},
);

const rootRef = ref<HTMLElement | null>(null);
const isOverflow = ref(false);

const checkOverflow = () => {
	const root = rootRef.value;
	if (!root) {
		isOverflow.value = false;
		return;
	}

	const target = (root.firstElementChild as HTMLElement | null) ?? root;
	isOverflow.value =
		target.scrollWidth > target.clientWidth || target.scrollHeight > target.clientHeight;
};

const tooltipDisabled = computed(() => {
	if (props.disabled !== undefined) return props.disabled;
	if (!props.content) return true;
	return !isOverflow.value;
});
</script>

<style lang="less" scoped>
.ellipsis-host {
	display: block;
	min-width: 0;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.ellipsis-host.is-flex {
	flex: 1;
	min-width: 0;
}

.ellipsis-host.is-inline {
	display: inline-flex;
	flex-shrink: 0;
	max-width: none;
	overflow: visible;
	text-overflow: unset;
	white-space: normal;
}

.ellipsis-host:not(.is-inline) > :deep(*) {
	display: block;
	width: 100%;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
