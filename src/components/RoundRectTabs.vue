<!--
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2026-01-05 10:12:38
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-05 14:42:13
-->
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
			<slot :index="index" />
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	tabsList: string[];
}>();

const activeIndex = defineModel<number>();

const emits = defineEmits(['change']);

const clickTab = (index: number) => {
	if (activeIndex.value === index) {
		return;
	}
	activeIndex.value = index;
	emits('change', index);
};
</script>
<style lang="less" scoped>
.tabs-control {
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(255, 255, 255, 0.4);
	box-shadow: 0rem 0.02rem 0.04rem 0rem rgba(162, 169, 213, 0.66);
	border-radius: 0.18rem;
	border: 0.01rem solid #ffffff;
	backdrop-filter: blur(15px);

	> div {
		border-radius: 0.18rem;
		backdrop-filter: blur(15px);
		font-weight: 500;
		font-size: @g-font-size-base;
		color: #898989;
		line-height: 0.24rem;
		text-align: center;
		padding: 0rem 0.24rem;
		margin: 0.02rem;
		cursor: pointer;
		white-space: nowrap;
		&.active {
			background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
			border-radius: 0.18rem;
			color: #ffffff;
		}
	}
}
</style>
