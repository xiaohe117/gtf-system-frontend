<template>
	<div class="filter">
		<div class="filter-btn" @click.stop="showFilterContent = !showFilterContent">筛选</div>
		<div class="filter-content" v-show="showFilterContent">
			<div>选择查看数据项</div>
			<div class="checkbox-group">
				<el-checkbox
					v-model="checkAll"
					:indeterminate="isIndeterminate"
					@change="handleCheckAllChange"
				>
					全部
				</el-checkbox>
				<el-checkbox-group v-model="checkedColumns" @change="handleCheckedChange">
					<el-checkbox
						v-for="item in columnsCheckGroups"
						:key="item"
						:label="item"
						:value="item"
					></el-checkbox>
				</el-checkbox-group>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { Column } from '@/types';

const props = withDefaults(
	defineProps<{
		columns: Column[];
	}>(),
	{
		columns: () => [],
	}
);
const showFilterContent = ref<boolean>(false);
const checkedColumns = ref<string[]>([]);
const checkAll = ref<boolean>(true);
const isIndeterminate = ref<boolean>(false);

const emits = defineEmits(['changeSelectedColumns']);

const columnsCheckGroups = computed(() =>
	props.columns
		.filter((col: any) => col.visible !== false && col.disabledFilter !== true)
		.map((item: any) => item.label)
);

watch(
	() => columnsCheckGroups.value,
	(val) => {
		checkAll.value = true;
		checkedColumns.value = val;
		emits('changeSelectedColumns', val);
	},
	{
		immediate: true,
	}
);
const handleCheckAllChange = (val: any) => {
	checkedColumns.value = val ? columnsCheckGroups.value : [];
	isIndeterminate.value = false;
	emits('changeSelectedColumns', checkedColumns.value);
};

const handleCheckedChange = (val: any) => {
	const checkedCount = val.length;
	checkAll.value = checkedCount === columnsCheckGroups.value.length;
	isIndeterminate.value = checkedCount > 0 && checkedCount < columnsCheckGroups.value.length;
	emits('changeSelectedColumns', val);
};
const closeFilterContent = (event: any) => {
	// 如果点击的不是筛选内容区域，则关闭筛选
	if (!event.target.closest('.filter-content')) {
		showFilterContent.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', closeFilterContent);
});
onUnmounted(() => {
	document.removeEventListener('click', closeFilterContent);
});
</script>
<style lang="less" scoped>
.filter {
	width: 1.56rem;
	height: 0.5rem;
	.filter-btn {
		width: 100%;
		height: 100%;
		line-height: 0.5rem;
		border: 0.02rem solid rgba(47, 107, 239, 0.5);
		color: rgba(0, 0, 0, 0.45);
		font-size: 0.24rem;
		cursor: pointer;
		border-radius: 0.1rem;
		font-weight: 400;
		padding-left: 0.21rem;

		&::after {
			width: 0.28rem;
			height: 0.28rem;
			content: '';
			display: inline-block;
			// background: url('@/assets/images/common/filter-btn.png') no-repeat center;
			background-size: 100% 100%;
			position: absolute;
			right: 0rem;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.filter-content {
		font-weight: 400;
		color: rgba(0, 0, 0, 0.9);
		font-size: 0.18rem;
		padding: 0.17rem;
		position: absolute;
		background-color: #fff;
		top: 0.6rem;
		right: -0.2rem;
		z-index: 1001;
		border: 0.01rem solid rgba(47, 107, 239, 0.5);
		border-radius: 0.06rem;
		:deep(.el-checkbox__label) {
			font-size: 0.18rem;
			line-height: 0.22rem;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.9);
		}
		.checkbox-group {
			margin-top: 0.1rem;
			max-height: 3.5rem;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}
}
</style>
