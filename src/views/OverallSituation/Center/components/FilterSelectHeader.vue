<template>
	<el-select
		:model-value="modelValue"
		:placeholder="label"
		clearable
		style="width: 100%"
		class="filter-select"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<el-option
			v-for="(item,index) in options"
			:key="index"
			:label="item"
			:value="item"
		/>
	</el-select>
</template>

<script setup>
defineProps({
	modelValue: {
		type: [String, Number],
		default: null,
	},
	label: {
		type: String,
		default: '',
	},
	options: {
		type: Array,
		default: () => [],
	},
});
defineEmits(['update:modelValue']);
</script>

<style scoped lang="less">
.filter-select {
	:deep(.el-select__wrapper) {
		box-shadow: none;
		background: none;
		padding: 0;
		.el-select__placeholder {
			font-size: @g-font-size-base;
			font-weight: 600;
			color: #3489ff;
			&.is-transparent {
                font-weight: 400;
				color: #333;
			}
		}
		.el-select__caret {
			font-size: 0.14rem;
		}
	}
}
</style>
