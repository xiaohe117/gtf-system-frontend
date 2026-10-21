<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-27 10:49:31
 * @LastEditors: ycyun
 * @LastEditTime: 2025-10-30 18:33:36
-->
<template>
	<div class="title-select">
		<div
			v-for="(item, index) in list"
			:key="index"
			class="title-item"
			@click="clickFunc(item)"
			:class="{ active: active === item.value }"
		>
			<span>{{ item.name }}</span>
		</div>
		<div class="right-box">
			<slot />
		</div>
	</div>
</template>
<script lang="ts" setup>
interface ListItem {
  name: string;
  value: string | number;
}
interface Props {
  list: ListItem[];
  modelValue: string | number;
}
const props = defineProps<Props>();

const active = ref();
watch(
	() => props.modelValue,
	() => {
		active.value = props.modelValue;
	},
	{ immediate: true }
);
const emit = defineEmits(['update:modelValue', 'select']);
const clickFunc = (val: any) => {
	if (val === active.value) {
		return;
	}
	active.value = val.value;
	emit('update:modelValue', active.value);
	emit('select', active.value, val);
};
</script>
<style lang="less" scoped>
.title-select {
	display: flex;
	align-items: center;
	.title-item {
		min-width: 1.61rem;
		min-height: 0.44rem;
		cursor: pointer;
		margin-right: 0.08rem;
		padding-right: 0.36rem;
		white-space: nowrap;
		&.active {
			background: url('@/assets/images/gtf/title-bg-yellow.png') bottom right / 1.55rem
				0.17rem no-repeat;
			> span {
				background: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
				background-clip: text;
				-webkit-text-fill-color: transparent;
				filter: drop-shadow(0.02rem 0.02rem 0 #ffffff);
			}
			&::before {
				content: '';
				position: absolute;
				width: 0.89rem;
				height: 0.28rem;
				background: url('@/assets/images/gtf/title-bg-text.png');
				background-size: 100% 100%;
			}
		}

		> span {
			display: inline-block;
			padding-top: 0.07rem;
			padding-left: 0.14rem;
			font-family: YouSheBiaoTiHei;
			font-size: 0.3rem;
			line-height: 0.39rem;
			background: linear-gradient(180deg, #ecf8fe 10%, #4b4b4b 100%);
			background-clip: text;
			-webkit-text-fill-color: transparent;
			filter: drop-shadow(0.02rem 0.02rem 0 #ffffff);
		}
	}
	.right-box {
		margin-left: auto;
		padding-right: 0.24rem;
	}
}
</style>