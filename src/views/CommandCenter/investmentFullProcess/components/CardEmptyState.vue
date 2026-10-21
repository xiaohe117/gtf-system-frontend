<template>
	<div class="card-empty" :class="{ compact }" :style="heightStyle">
		<div class="card-empty-text">{{ text }}</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		/** 高度，默认撑满列表容器 */
		height?: string;
		text?: string;
		/** 情报等窄区域用更小尺寸 */
		compact?: boolean;
	}>(),
	{
		height: '100%',
		text: '暂无数据',
		compact: false,
	},
);

const heightStyle = computed(() => ({ height: props.height }));
</script>

<style lang="less" scoped>
.card-empty {
	flex: 1;
	min-height: 1.2rem;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

.card-empty-text {
	font-weight: 400;
	font-size: 0.12rem;
	line-height: 0.18rem;
	color: rgba(0, 0, 0, 0.45);
}

.card-empty.compact {
	min-height: 0.48rem;
}
</style>
