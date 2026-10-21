<template>
	<el-select
		:model-value="modelValue"
		@change="handleChange"
		:placeholder="placeholder"
		:popper-class="`${popperClass} select-dropdown-menu`"
		no-data-text="暂无数据"
		:clearable="clearable"
	>
		<el-option
			v-for="item in options"
			:key="item.value"
			:label="item.label"
			:value="item.value"
		/>
	</el-select>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		modelValue?: string | number;
		placeholder?: string;
		options: Array<{ value: string | number; label: string }>;
		popperClass?: string;
		clearable: boolean;
	}>(),
	{
		modelValue: '',
		options: () => [],
		placeholder: '请选择',
		popperClass: '',
		clearable: true,
	}
);

const emit = defineEmits(['update:modelValue', 'change']);

const handleChange = (value: string | number) => {
	emit('update:modelValue', value);
	emit('change', value);
};
</script>
