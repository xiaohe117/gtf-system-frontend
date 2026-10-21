<!--
 * @Descripttion: 时间选择组件
 * @Author: ycyun
 * @Date: 2026-05-13 15:05:37
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-13 17:57:15
-->
<template>
	<el-select class="date-select" v-model="selectedValue" @change="handleChange" v-bind="$attrs">
		<el-option v-for="item in dateOption" :key="item" :label="item" :value="item"></el-option>
	</el-select>
</template>
<script lang="ts" setup>
import { queryDateDropDown } from '@/api/commandCenter/deptOverview';

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	options: {
		type: [Array, null],
		default: null,
	},
});
const emit = defineEmits(['change', 'update:modelValue']);

const dateOption: any = ref([]);
const selectedValue: any = ref('');
watch(
	() => props.modelValue,
	() => {
		selectedValue.value = props.modelValue;
	},
	{ immediate: true, deep: true }
);
const handleChange = () => {
	emit('update:modelValue', selectedValue.value);
	emit('change', selectedValue.value);
};
const getList = () => {
	queryDateDropDown().then((res) => {
		dateOption.value = res.data || [];
		selectedValue.value = dateOption.value[0] || '';
		handleChange();
	});
};
onMounted(() => {
	if (!props.options) {
		getList();
		return;
	}
	watch(
		() => props.options,
		() => {
			dateOption.value = props.options || [];
		},
		{ immediate: true }
	);
});
</script>
<style lang="less" scoped>
.date-select {
	display: inline-block;
	width: 2.56rem;
}
</style>