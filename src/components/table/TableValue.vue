<template>
	<div class="table-value" :class="{ 'one-row-ellipsis': col.showToolTip !== false }">
		<template v-if="isEmpty(props.val)">
			<div
				:class="{
					'g-cell-right': col.align === 'right',
					'g-cell-sort': col.align === 'right' && col.sortable,
				}"
			>
				{{ EmptyConst }}
			</div>
		</template>
		<template v-else-if="col.type === 'rate'">
			<div
				class="number-font"
				:class="{
					'g-cell-right': col.align === 'right',
					'g-cell-sort': col.align === 'right' && col.sortable,
				}"
			>
				<div class="table-num-box" :class="props.val < (col.typeVal || 0) ? 'down' : 'up'">
					<span class="triangle"></span>
					<span class="table-num">{{ handleRateValue(props.val) }}{{ col.unit }}</span>
				</div>
			</div>
		</template>
		<template v-else-if="col.type === 'rate-add'">
			<div
				class="number-font"
				:class="{
					'g-cell-right': col.align === 'right',
					'g-cell-sort': col.align === 'right' && col.sortable,
				}"
			>
				<div class="table-num-box" :class="props.val < (col.typeVal || 0) ? 'down' : 'up'">
					<span class="table-num"
						><span v-if="props.val > (col.typeVal || 0)">+</span
						>{{ handleRateValue(props.val) }}{{ col.unit }}</span
					>
				</div>
			</div>
		</template>
		<template v-else-if="col.type === 'num'">
			<div
				class="number-font"
				:class="{
					'g-cell-right': col.align === 'right',
					'g-cell-sort': col.align === 'right' && col.sortable,
				}"
			>
				{{ formatNumber(props.val) }}
			</div>
		</template>
		<template v-else-if="col.type === 'number'">
			<div
				class="number-font"
				:class="{
					'g-cell-right': col.align === 'right',
					'g-cell-sort': col.align === 'right' && col.sortable,
				}"
			>
				{{ formatNumber2(props.val) }}
			</div>
		</template>
		<template v-else-if="col.type === 'amount'">
			<div
				class="number-font"
				:class="{
					'g-cell-right': col.align === 'right',
					'g-cell-sort': col.align === 'right' && col.sortable,
				}"
			>
				{{ formatNumber(props.val, 2) }}
			</div>
		</template>
		<template v-else-if="col.type === 'tag'">
			<span class="table-tag">{{ props.val }}</span>
		</template>
		<template v-else-if="col.type === 'tag-select'">
			<span
				class="table-tag"
				:class="col.selectedOptions.find((v: any) => v.code === props.val)?.className"
				>{{ col.selectedOptions.find((v: any) => v.code === props.val)?.label }}</span
			>
		</template>
		<template v-else-if="col.type === 'tags'">
			<span v-for="(tag, tagIdx) in props.val.split(',')" :key="tagIdx" class="table-tag">{{
				tag
			}}</span>
		</template>
		<template v-else>
			<span
				:class="{
					'g-cell-right': col.align === 'right',
					'g-cell-sort': col.align === 'right' && col.sortable,
				}"
				>{{ props.val }}</span
			>
		</template>
	</div>
</template>
<script setup lang="ts">
import { formatNumber, formatNumber2, handleRateValue, isEmpty, EmptyConst } from '@/utils';

const props = withDefaults(
	defineProps<{
		col: any;
		val?: any;
	}>(),
	{
		val: '',
	}
);
</script>
<style scoped lang="less">
@import '@/assets/css/rate';

.table-tag {
	display: inline-block;
	color: @tag-blue-text-color;
	background: rgba(47, 107, 239, 0.15);
	border-radius: 2px;
	margin: 0.02rem 0.08rem 0.02rem 0;
	padding: 2px 8px;
	&:first-child {
		margin-left: 0;
	}
	&.tag-0 {
		color: #53a064;
		background: rgba(83, 160, 100, 0.15);
	}
	&.tag-1 {
		color: #ffb10d;
		background: rgba(255, 177, 13, 0.15);
	}
	&.tag-2 {
		color: #df5953;
		background: rgba(223, 89, 83, 0.15);
	}
}
</style>
