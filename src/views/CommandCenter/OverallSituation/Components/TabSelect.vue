<template>
	<ul class="tab-list">
		<li
			class="tab-item"
			v-for="item in tabList"
			:key="item.value"
			:class="{ active: activeTab === item.value }"
			@click="selectTab(item)"
		>
			{{ item.name }}
		</li>
	</ul>
</template>
<script lang="ts" setup>
const props = defineProps({
	tabList: {
		type: Object,
		default: () => ({}),
	},
    modelValue:{
        type:[String , Number],
        default:''
    }
});
const emit = defineEmits(['select','update:modelValue'])
const activeTab:any = ref('');
watch(
	() => props.modelValue,
	() => {
		activeTab.value = props.modelValue;
	},
	{ immediate: true, deep: true }
);
const selectTab = (ele: any) => {
	activeTab.value = ele.value;
    emit('update:modelValue', activeTab.value);
    emit('select',ele)
};

</script>
<style lang="less" scoped>
.tab-list {
	display: inline-block;
	background: rgba(255, 255, 255, 0.4);
	box-shadow: 0 0 0.04rem 0 rgba(162, 169, 213, 0.66);
	border-radius: 0.18rem;
	border: 0.01rem solid #a5c9ff;
	backdrop-filter: blur(0.118421052631579rem);
	white-space: nowrap;
	li {
		display: inline-block;
		color: #898989;
		height: 100%;
		min-width: 1.25rem;
		text-align: center;
		line-height: 0.3rem;
		cursor: pointer;
		&.active {
			background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
			border-radius: 0.18rem;
			color: #ffffff;
		}
	}
}
</style>