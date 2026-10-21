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

const activeIndex = defineModel<number>();

const clickTab = (index: number) => {
	activeIndex.value = index;
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
		font-size: 0.14rem;
		color: #898989;
		line-height: 0.3rem;
		text-align: center;
		padding: 0rem 0.24rem;
		margin: 0.02rem;
		cursor: pointer;
		height: 0.3rem;

		&.active {
			background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
			border-radius: 0.18rem;
			color: #ffffff;
		}
	}
}
</style>
