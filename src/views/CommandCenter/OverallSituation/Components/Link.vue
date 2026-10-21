<template>
	<div v-if="!isEmptyText && canClick" class="link-btn" @click="handleClick">
		{{ displayText }}
	</div>
	<div v-else>
		{{ displayText }}
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { EmptyConst, isEmpty } from '@/utils';

const props = withDefaults(
	defineProps<{
		row?: Record<string, any>;
		col?: Record<string, any>;
		canClick?: boolean;
	}>(),
	{
		row: () => ({}),
		col: () => ({}),
		canClick: true,
	}
);

const emit = defineEmits<{
	click: [];
}>();

const isEmptyText = computed(() => isEmpty(props.row[props.col.prop]));
const displayText = computed(() =>
	isEmptyText.value ? EmptyConst : props.row[props.col.prop]
);

const handleClick = () => {
	emit('click');
};
</script>

<style lang="less" scoped>
.link-btn {
	color: #165dff;
	font-weight: 500;
	cursor: pointer;
}
</style>
