<!-- tab控件2 对应设计稿 2-5 -->
<template>
	<div class="tabs-wrapper">
		<div
			v-for="(item, index) in tabList"
			:key="item"
			class="tab-item"
			:class="{ active: activeIndex === index, 'small-font': fontSize === 'small' }"
			@click="clickTab(index)"
		>
			{{ item }}
		</div>
		<slot name="right"></slot>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		tabList: string[];
		// normal: 0.22rem, small: 0.2rem
		fontSize?: 'normal' | 'small';
	}>(),
	{
		fontSize: 'normal',
	}
);

const activeIndex = ref(0);
const emits = defineEmits(['changeTab']);
const clickTab = (index: number) => {
	activeIndex.value = index;
	emits('changeTab', index);
};
</script>

<style lang="less" scoped>
.tabs-wrapper {
	width: 100%;
	height: 0.42rem;
	background: linear-gradient(90deg, #569aed5c 0%, #569aed00 100%);
	display: flex;
	align-items: center;
}

.tab-item {
	white-space: nowrap;
	height: 100%;
	color: #ffffffb3;
	font-size: 0.22rem;
	padding: 0 0.14rem;
	position: relative;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 0.02rem solid transparent;
	cursor: pointer;

	&.small-font {
		font-size: 0.2rem;
	}
	&:not(:first-child) {
		&::before {
			display: block;
			content: '';
			width: 0.01rem;
			height: 0.11rem;
			background-color: rgba(184, 192, 204, 0.5);
			position: absolute;
			left: -0.01rem;
			top: 0.15rem;
		}
	}
	&.active {
		background: linear-gradient(0deg, #569aed 0%, rgba(86, 154, 237, 0) 100%);
		border-color: #569aed;
		color: #fff;

		& + .tab-item {
			&::before {
				display: none;
			}
		}
		&::before {
			display: none;
		}
	}
}
</style>
