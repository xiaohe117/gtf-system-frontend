<!--
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2025-08-11 14:22:47
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-08-11 16:36:06
-->
<template>
	<div class="number-value fx-r">
		{{ props.label }}
		<div class="value">
			<div v-if="isEmpty(props.value)">-</div>
			<div v-else>
				<span class="green" v-if="Number(props.value) > 0"
					>+{{ formatNumber(props.value) }}</span
				>
				<span class="red" v-else>{{ formatNumber(props.value) }}</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { isEmpty, formatNumber } from '@/utils';

const props = defineProps({
	value: {
		type: Number,
		default: 0,
	},
	label: {
		type: String,
		default: '',
	},
});
</script>
<style lang="less" scoped>
.number-value {
	color: rgba(0, 0, 0, 0.6);
	font-size: 0.14rem;
	.value {
		margin-left: 0.08rem;
		.red {
			color: #ff4d4f;
		}
		.green {
			color: #1eb092;
		}
	}
}
</style>
