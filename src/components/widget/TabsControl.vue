<!-- tab控件 对应设计稿 2-1 -->
<template>
	<div class="tabs-control">
		<div
			v-for="(tab, index) in tabsList"
			:key="tab"
			class="tabs-control_item"
			:class="{ active: activeIndex === index }"
			@click="clickTab(index)"
		>
			{{ tab }}
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	tabsList: string[];
}>();

const activeIndex = ref(0);
const emits = defineEmits(['changeTab']);
const clickTab = (index: number) => {
	activeIndex.value = index;
	emits('changeTab', index);
};
</script>

<style lang="less" scoped>
.tabs-control {
	font-size: 0.16rem;
	color: @normal-color;
	display: flex;
}
.tabs-control_item {
	height: 0.28rem;
	line-height: 0.24rem;
	box-sizing: border-box;
	background-image: linear-gradient(180deg, #224481 0%, #3869a6 100%);
	border: 0.02rem solid #274b84;
	padding: 0 0.14rem;
	cursor: pointer;

	&:first-child {
		border-radius: 0.04rem 0 0 0.04rem;
	}
	&:last-child {
		border-radius: 0 0.04rem 0.04rem 0;
	}
	&.active {
		background-image: linear-gradient(180deg, #0693ffcc 0%, #60b7fecc 100%);
		border-color: #0392fd;
	}
}
</style>
