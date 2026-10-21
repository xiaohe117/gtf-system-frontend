<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-05-12 16:22:49
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-14 10:47:15
-->
<template>
	<div class="rate" :class="compareClass">
		<div class="center-box" v-if="value">
			<el-icon v-if="compareClass === 'up'"><CaretTop /></el-icon>
			<el-icon v-if="compareClass === 'down'"><CaretBottom /></el-icon>
			<span class="number-font">{{ value }}</span>
			<span class="unit">%</span>
		</div>
		<div v-else>{{ emptyText }}</div>
	</div>
</template>
<script lang="ts" setup>
const emptyText = '-';
const props = defineProps({
	value: {
		type: [Number, null],
		default: null,
	},
});
const compareClass = computed(() => {
	if (!props.value) return '';
	const num: any = props.value;
	// eslint-disable-next-line no-nested-ternary
	return num > 0 ? 'up' : num < 0 ? 'down' : '';
});
</script>
<style lang="less" scoped>
.rate {
	display: inline-block;
	font-size: inherit;
	color: #202741;
	.center-box {
		display: flex;
		align-items: center;
	}
	&.up {
		color: #17ba7f;
	}
	&.down {
		color: #df5953;
	}
}
</style>