<!--
 * @Descripttion: 企业标签下拉框选择公共组件
 * @Author: ycyun
 * @Date: 2025-12-09 11:38:38
 * @LastEditors: ycyun
 * @LastEditTime: 2025-12-13 10:36:36
-->
<template>
	<el-cascader
		v-model="val"
		:options="options"
		placeholder="请选择企业标签"
		filterable
		clearable
		collapse-tags
		collapse-tags-tooltip
		:max-collapse-tags-tooltip-height="'80vh'"
		:props="{
			label: 'tagName',
			value: 'tagId',
			multiple: true,
			children: 'tags',
			emitPath: false,
		}"
		style="width: 100%"
		@change="updateValue"
	/>
</template>
<script lang="ts" setup>
import { getTagsGroupeds } from '@/api/EfficiencyCenter/index';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
});

const val = ref();
const emits = defineEmits(['update:modelValue', 'change']);
watch(
	() => props.modelValue,
	() => {
		if (props.modelValue) {
			val.value = props.modelValue.split(',');
		} else {
			val.value = [];
		}
	},
	{ immediate: true }
);
const options = ref([]);
getTagsGroupeds().then((res: any) => {
	// 第一个层级手动添加tagId
	res.data?.forEach((item: any) => {
		item.tagId = item.tagType;
		item.tagName = item.tagType;
	});
	options.value = res.data;
});
const updateValue = () => {
	// 更新值
	const data = val.value && val.value.join(',');
	emits('update:modelValue', data);
	emits('change', data);
};
</script>
