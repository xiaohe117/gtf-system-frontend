<template>
	<div class="gi-tab-switch">
		<button
			v-for="item in tabs"
			:key="item.key"
			class="gi-tab-item"
			:class="{ active: item.key === modelValue }"
			:disabled="disabled"
			type="button"
			@click="emit('update:modelValue', item.key)"
		>
			{{ item.label }}
		</button>
	</div>
</template>

<script setup lang="ts">
// Tab 选项结构
interface GiTabItem {
	label: string;
	key: string;
}

// 当前 tab 配置和选中值
defineProps<{
	tabs: GiTabItem[];
	modelValue: string;
	disabled?: boolean;
}>();

// 通知父组件更新选中 tab
const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();
</script>

<style lang="less" scoped>
.gi-tab-switch {
	display: flex;
	align-items: center;
	justify-content: center;
	width: min(100%, 2.1rem);
	height: clamp(0.21rem, 2.5vh, 0.23rem);
	padding: 0.01rem 0.04rem;
	border: 0;
	border-radius: 0.16rem;
	background: #f1f6ff;
	box-shadow: inset 0 0 0.01rem #bfd6ff;
}

.gi-tab-item {
	flex: 1 1 0;
	min-width: 0;
	height: clamp(0.19rem, 2.3vh, 0.21rem);
	padding: 0;
	border: 0;
	border-radius: 0.13rem;
	background: transparent;
	color: #56677b;
	font-size: 0.12rem;
	font-family: SourceHanSansCN-Bold;
	line-height: clamp(0.19rem, 2.3vh, 0.21rem);
	text-align: center;
	cursor: pointer;

	&:disabled {
		cursor: default;
	}

	&.active {
		color: #fff;
		background: linear-gradient(180deg, #48c8ff 0%, #1483ff 100%);
		box-shadow: 0 0.01rem 0.04rem rgba(17, 116, 255, 0.35);
	}
}
</style>
