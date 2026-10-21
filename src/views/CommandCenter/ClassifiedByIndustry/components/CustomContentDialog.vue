<template>
	<el-dialog
		:model-value="modelValue"
		@update:model-value="(v: boolean) => emit('update:modelValue', v)"
		title="请选择需要定制的页面内容"
		width="10rem"
		class="custom-content-dialog"
		:close-on-click-modal="false"
		:append-to-body="true"
		destroy-on-close
	>
		<div v-loading="loading" class="dialog-content-body">
			<div class="option-group">
				<span class="group-title">{{ strengthTitle }}</span>
				<div class="sub-options indent-1">
					<el-checkbox
						v-for="item in strengthItems"
						:key="item.key"
						v-model="checkedMap[item.key]"
						>{{ item.label }}</el-checkbox
					>
				</div>
			</div>

			<div class="option-group">
				<span class="group-title">{{ advantageTitle }}</span>
				<div class="sub-options indent-1 row-layout">
					<el-checkbox :model-value="checkedAdvantageAll" @change="onAdvantageAllChange"
						>全选</el-checkbox
					>
					<el-checkbox
						v-for="item in advantageItems"
						:key="item.key"
						v-model="checkedMap[item.key]"
						>{{ item.label }}</el-checkbox
					>
				</div>
			</div>

			<div class="option-group">
				<span class="group-title">{{ industryTitle }}</span>
				<div class="sub-options indent-1 three-col-layout">
					<el-checkbox :model-value="checkedIndustryAll" @change="onIndustryAllChange"
						>全选</el-checkbox
					>
					<el-checkbox
						v-for="item in industryItems"
						:key="item.key"
						v-model="checkedMap[item.key]"
						>{{ item.label }}</el-checkbox
					>
				</div>
			</div>

			<div v-if="hasIndustrySelected" class="option-group">
				<span class="group-title">{{ districtTitle }}</span>
				<div class="sub-options indent-1 row-layout">
					<el-checkbox :model-value="checkedDistrictAll" @change="onDistrictAllChange"
						>全选</el-checkbox
					>
					<el-checkbox
						v-for="item in districtItems"
						:key="item.key"
						v-model="checkedMap[item.key]"
						>{{ item.label }}</el-checkbox
					>
				</div>
			</div>

			<div v-if="hasIndustrySelected" class="option-group">
				<span class="group-title">{{ elementTitle }}</span>
				<div class="sub-options indent-1 row-layout">
					<el-checkbox :model-value="checkedElementAll" @change="onElementAllChange"
						>全选</el-checkbox
					>
					<el-checkbox
						v-for="item in elementItems"
						:key="item.key"
						v-model="checkedMap[item.key]"
						>{{ item.label }}</el-checkbox
					>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="emit('update:modelValue', false)">取消</el-button>
				<el-button type="primary" :disabled="!hasAnySelected" @click="onConfirm"
					>确定</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, watch } from 'vue';
import { getCustomizeMenuList, saveCustomize } from '@/api/industry';
import type { CategoryItem, CategoryTreeNode, CustomizeMenuResult, CheckOption } from '../type';

const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	'update:modelValue': [val: boolean];
	confirm: [];
}>();

/** 类别树数据 */
const categoryTree = ref<CategoryTreeNode[]>([]);
/** 所有复选项的选中状态，key 为 detailCode */
const checkedMap = reactive<Record<string, boolean>>({});
const loading = ref(false);

/** 按 columnCode 查找分类节点 */
const getCategory = (code: string): CategoryTreeNode | undefined =>
	categoryTree.value.find((c) => c.columnCode === code);

/** 按 columnCode 查找分类子项（按 sortOrder 升序） */
const getChildren = (code: string): CategoryItem[] => {
	const cat = getCategory(code);
	const list = cat?.children || [];
	return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
};

/** 按 columnCode 获取分类名称（一级菜单 columnName） */
const getCategoryName = (code: string): string => getCategory(code)?.columnName || '';

/** 各分组标题（取接口一级菜单 columnName） */
const strengthTitle = computed(() => getCategoryName('YCHARD'));
const advantageTitle = computed(() => getCategoryName('ZHYS'));
const industryTitle = computed(() => getCategoryName('CYXZ'));
const districtTitle = computed(() => getCategoryName('CYDQ'));
const elementTitle = computed(() => getCategoryName('CYYS'));

/** 将分类子项转为复选项（key 取 detailCode，label 取 detailName） */
const toOptions = (items: CategoryItem[]): CheckOption[] =>
	items.map((i) => ({ key: i.detailCode, label: i.detailName }));

/** 羊城硬核实力选项（YCHARD 子项） */
const strengthItems = computed<CheckOption[]>(() => toOptions(getChildren('YCHARD')));
/** 综合优势选项（ZHYS 子项） */
const advantageItems = computed<CheckOption[]>(() => toOptions(getChildren('ZHYS')));
/** 产业选择选项（CYXZ 子项） */
const industryItems = computed<CheckOption[]>(() => toOptions(getChildren('CYXZ')));
/** 产业所在地区选项（CYDQ 子项） */
const districtItems = computed<CheckOption[]>(() => toOptions(getChildren('CYDQ')));
/** 产业优势选项（CYYS 子项） */
const elementItems = computed<CheckOption[]>(() => toOptions(getChildren('CYYS')));

/** 综合优势全选状态（所有子项选中时为 true） */
const checkedAdvantageAll = computed(
	() => advantageItems.value.length > 0 && advantageItems.value.every((i) => checkedMap[i.key])
);
/** 产业选择全选状态 */
const checkedIndustryAll = computed(
	() => industryItems.value.length > 0 && industryItems.value.every((i) => checkedMap[i.key])
);
/** 是否有产业选择子项被选中（控制产业所在地区、产业优势分组是否展示） */
const hasIndustrySelected = computed(() => industryItems.value.some((i) => checkedMap[i.key]));
/** 产业所在地区全选状态 */
const checkedDistrictAll = computed(
	() => districtItems.value.length > 0 && districtItems.value.every((i) => checkedMap[i.key])
);
/** 产业优势全选状态 */
const checkedElementAll = computed(
	() => elementItems.value.length > 0 && elementItems.value.every((i) => checkedMap[i.key])
);

/** 是否有任意复选项被选中（控制确定按钮是否可用） */
const hasAnySelected = computed(() => Object.values(checkedMap).some((v) => v));

/** 综合优势全选切换 */
const onAdvantageAllChange = (val: boolean) => {
	advantageItems.value.forEach((i) => {
		checkedMap[i.key] = val;
	});
};
/** 产业选择全选切换 */
const onIndustryAllChange = (val: boolean) => {
	industryItems.value.forEach((i) => {
		checkedMap[i.key] = val;
	});
};
/** 产业所在地区全选切换 */
const onDistrictAllChange = (val: boolean) => {
	districtItems.value.forEach((i) => {
		checkedMap[i.key] = val;
	});
};
/** 产业优势全选切换 */
const onElementAllChange = (val: boolean) => {
	elementItems.value.forEach((i) => {
		checkedMap[i.key] = val;
	});
};

/** 根据类别树初始化所有复选项的选中状态（isCustomized 为 true 的子项默认选中） */
const initCheckedMap = () => {
	Object.keys(checkedMap).forEach((k) => delete checkedMap[k]);
	categoryTree.value.forEach((cat) => {
		cat.children.forEach((item) => {
			checkedMap[item.detailCode] = item.isCustomized === true;
		});
	});
};

/** 获取优势类别树并初始化选中状态（根据 customizedDetailIds 标记已定制项） */
const fetchCategoryTree = async () => {
	loading.value = true;
	try {
		const res = await getCustomizeMenuList<CustomizeMenuResult>({});
		if (res.code === 0 && res.data) {
			const { customizedDetailIds = [], categoryTree: tree = [] } = res.data || {};
			// 用 customizedDetailIds 标记每个子项的 isCustomized
			const idSet = new Set(customizedDetailIds);
			tree.forEach((cat) => {
				cat.children.forEach((item) => {
					item.isCustomized = idSet.has(item.detailCode);
				});
			});
			categoryTree.value = tree;
			initCheckedMap();
		}
	} catch {
		categoryTree.value = [];
	} finally {
		loading.value = false;
	}
};

/** 弹窗打开时获取类别树数据 */
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			fetchCategoryTree();
		}
	},
	{ immediate: true }
);

/** 产业选择全部取消时，联动清空产业所在地区、产业优势的所有选中项 */
watch(hasIndustrySelected, (selected) => {
	if (!selected) {
		districtItems.value.forEach((i) => {
			checkedMap[i.key] = false;
		});
		elementItems.value.forEach((i) => {
			checkedMap[i.key] = false;
		});
	}
});

/** 确定按钮回调：调用 saveCustomize 保存所选 detailCode，成功后关闭弹窗并触发 confirm */
const onConfirm = async () => {
	// 收集所有选中的 detailCode（checkedMap 中值为 true 的 key）
	const detailIds = Object.keys(checkedMap).filter((key) => checkedMap[key]);
	loading.value = true;
	try {
		const res = await saveCustomize<{ code: number }>({ detailIds });
		if (res.code === 0) {
			emit('update:modelValue', false);
			emit('confirm');
		}
	} catch {
		// 接口失败不关闭弹窗，便于用户重试
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="less" scoped>
.dialog-content-body {
	.group-title {
		font-family: MicrosoftYaHei;
		font-size: 0.2rem;
		color: rgba(0, 0, 0, 0.85);
	}
	.option-group {
		margin-bottom: 0.24rem;
		.el-checkbox {
			font-family: MicrosoftYaHei;
			font-size: 0.2rem;
			color: rgba(0, 0, 0, 0.85);
		}
	}
	.sub-options {
		margin-top: 0.12rem;
		&.indent-1 {
			padding-left: 0.36rem;
		}
		&.row-layout {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 0.12rem 0.16rem;
			.el-checkbox {
				font-family: MicrosoftYaHei;
				font-size: 0.2rem;
				color: rgba(0, 0, 0, 0.75);
				justify-self: start;
			}
		}
		&.three-col-layout {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 0.12rem 0.32rem;
			.el-checkbox {
				font-family: MicrosoftYaHei;
				font-size: 0.2rem;
				color: rgba(0, 0, 0, 0.75);
				justify-self: start;
			}
		}
	}

	:deep(.el-checkbox.is-checked) {
		.el-checkbox__inner {
			border-color: #165dff;
			background-color: #165dff;
		}
		.el-checkbox__label {
			color: #165dff;
		}
	}
}

.dialog-footer {
	display: flex;
	justify-content: center;
	gap: 0.32rem;
	.el-button {
		min-width: 1rem;
	}
}
</style>

<style lang="less">
.el-dialog.custom-content-dialog {
	margin-top: 5vh !important;
	margin-bottom: 5vh !important;
	max-height: 90vh !important;
	display: flex !important;
	flex-direction: column !important;
	overflow: hidden !important;
	border-radius: 0.08rem;

	.el-dialog__header {
		padding: 0.24rem 0.32rem !important;
		border-bottom: none !important;
		flex-shrink: 0;
	}

	.el-dialog__title {
		font-family: MicrosoftYaHei !important;
		font-weight: bold !important;
		font-size: 0.24rem !important;
		color: rgba(0, 0, 0, 0.85) !important;
	}

	.el-dialog__body {
		flex: 1 1 auto !important;
		min-height: 0 !important;
		padding: 0.16rem 0.32rem 0 !important;
		overflow-y: auto !important;
		overflow-x: hidden !important;
	}

	.el-dialog__footer {
		flex-shrink: 0;
		padding: 0.16rem 0.32rem 0.24rem !important;
		border-top: none !important;
	}
}
</style>
