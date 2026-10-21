<template>
	<el-cascader
		v-model="innerValue"
		class="dept-cascader"
		:style="controlStyle"
		:options="deptOptions"
		:props="cascaderProps"
		:show-all-levels="false"
		:teleported="false"
		:disabled="loading"
		placeholder="请选择单位"
		popper-class="dept-cascader-dropdown"
	/>
</template>

<script setup lang="ts">
import { queryDeptTree } from '@/api/commandCenter/investmentFullProcess';
import {
	ALL_DEPT_VALUE,
	normalizeDeptTree,
	type DeptCascaderOption,
	type DeptTreeNode,
} from '../deptTree';

defineOptions({ name: 'DeptCascader' });

/** 选中单位的 name，全市为 '' */
const model = defineModel<string>({ default: ALL_DEPT_VALUE });

const height = inject<Ref<string>>('investmentFilterControlHeight', ref('0.42rem'));
const fontSize = inject<Ref<string>>('investmentFilterControlFontSize', ref('0.18rem'));
const controlStyle = computed(() => ({
	height: height.value,
	minHeight: height.value,
	maxHeight: height.value,
	lineHeight: height.value,
	fontSize: fontSize.value,
	'--el-component-size': height.value,
	'--el-input-inner-height': height.value,
	'--el-font-size-base': fontSize.value,
	'--filter-control-height': height.value,
	'--filter-control-font-size': fontSize.value,
}));

const deptOptions = ref<DeptCascaderOption[]>([]);
const loading = ref(false);

const cascaderProps = {
	label: 'desc',
	value: 'name',
	children: 'children',
	emitPath: false,
};

const innerValue = computed({
	get: () => model.value ?? ALL_DEPT_VALUE,
	set: (val: string) => {
		model.value = val ?? ALL_DEPT_VALUE;
	},
});

const fetchDeptTree = async () => {
	loading.value = true;
	try {
		const res: any = await queryDeptTree();
		deptOptions.value =
			res?.code === 0 ? normalizeDeptTree((res.data ?? []) as DeptTreeNode[]) : [];
	} catch {
		deptOptions.value = [];
	} finally {
		loading.value = false;
	}
};

onMounted(fetchDeptTree);
</script>

<style lang="less" scoped>
@import '../filterControl.less';

.dept-cascader {
	width: 2.2rem;
	flex: 0 0 auto;
	box-sizing: border-box;
	vertical-align: middle;

	:deep(.el-input) {
		height: 100% !important;
		min-height: 100% !important;
		max-height: 100% !important;
		line-height: 1 !important;
		font-size: var(--filter-control-font-size, 0.18rem) !important;
	}

	:deep(.el-input__wrapper) {
		.filter-control-shell();
		width: 100%;
		height: 100% !important;
		min-height: 100% !important;
		max-height: 100% !important;
		box-shadow: none !important;
		font-size: var(--filter-control-font-size, 0.18rem) !important;
	}

	:deep(.el-input__wrapper:hover),
	:deep(.el-input.is-focus .el-input__wrapper),
	:deep(.el-input__wrapper.is-focus) {
		box-shadow: none !important;
		border-color: var(--el-border-color-hover);
	}

	:deep(.el-input.is-focus .el-input__wrapper),
	:deep(.el-input__wrapper.is-focus) {
		border-color: var(--el-color-primary);
	}

	:deep(.el-input__inner) {
		height: 100% !important;
		line-height: 1 !important;
		font-size: var(--filter-control-font-size, 0.18rem) !important;
	}

	:deep(.el-input__suffix),
	:deep(.el-input__suffix-inner),
	:deep(.el-input__icon) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		line-height: 1;
		font-size: var(--filter-control-font-size, 0.18rem) !important;
	}

	/* teleported=false 时下拉挂在组件内，字号也要跟 rem 走 */
	:deep(.el-cascader__dropdown),
	:deep(.el-popper) {
		font-size: var(--filter-control-font-size, 0.18rem) !important;
	}

	:deep(.el-cascader-panel),
	:deep(.el-cascader-menu),
	:deep(.el-cascader-menu__list),
	:deep(.el-cascader-node),
	:deep(.el-cascader-node__label) {
		font-size: var(--filter-control-font-size, 0.18rem) !important;
		line-height: 1.4 !important;
	}

	:deep(.el-cascader-node) {
		padding: 0.08rem 0.2rem !important;
		height: auto !important;
		min-height: 0.34rem !important;
	}
}
</style>

<!-- 下拉面板全局兜底（防止 EP 默认 14px 在缩放时显得极小） -->
<style lang="less">
.dept-cascader-dropdown {
	font-size: var(--filter-control-font-size, 0.18rem) !important;

	.el-cascader-panel,
	.el-cascader-menu,
	.el-cascader-menu__list,
	.el-cascader-node,
	.el-cascader-node__label {
		font-size: var(--filter-control-font-size, 0.18rem) !important;
		line-height: 1.4 !important;
	}

	.el-cascader-node {
		padding: 0.08rem 0.2rem !important;
		height: auto !important;
		min-height: 0.34rem !important;
	}
}
</style>
