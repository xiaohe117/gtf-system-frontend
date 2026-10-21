<!--
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2025-08-15 14:51:10
 * @LastEditors: zhaochao
 * @LastEditTime: 2026-01-05 11:53:21
-->
<template>
	<el-form :model="localForm" :rules="rules" ref="form">
		<el-row :gutter="16">
			<el-col v-for="(colItem, colIndex) in config" :key="colIndex" :span="colItem.span || 8">
				<el-form-item :prop="colItem.prop">
					<el-select
						v-if="colItem.type === 'select'"
						v-model="localForm[colItem.prop]"
						:placeholder="colItem.placeholder || `请选择${colItem.label}`"
						clearable
						filterable
						popper-class="wall-map-more-search"
						suffix-icon="CaretBottom"
					>
						<template #prefix>
							<div>{{ colItem.label }}：</div>
						</template>
						<el-option
							v-for="(option, index) in colItem.options"
							:key="index"
							:label="option.label"
							:value="option.value"
						></el-option>
					</el-select>
					<el-date-picker
						v-else-if="colItem.type === 'date'"
						v-model="localForm[colItem.prop]"
						:type="colItem.dateType || 'date'"
						:placeholder="colItem.placeholder || `请选择${colItem.label}`"
						:disabled="colItem.disabled"
						:format="colItem.format || 'yyyy-MM-dd'"
						:value-format="colItem.valueFormat || 'yyyy-MM-dd'"
						clearable
						popper-class="wall-map-more-search"
						suffix-icon="CaretBottom"
					></el-date-picker>
					<el-input
						v-else-if="colItem.type === 'input'"
						v-model="localForm[colItem.prop]"
						:placeholder="colItem.placeholder || `请输入${colItem.label}`"
						:disabled="colItem.disabled"
						clearable
						><template #prefix>
							<div>{{ colItem.label }}：</div>
						</template>
					</el-input>
					<div v-else-if="colItem.type === 'slot'" class="custom-form fx-r">
						<div class="label">{{ colItem.label }}：</div>
						<slot :name="colItem.prop" />
					</div>
					<slot v-else :name="colItem.prop" />
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>
<script lang="ts" setup>
// import { getSize } from '@/utils';

interface FormConfigItem {
	label: string;
	prop: string;
	type?: string;
	span?: number;
	placeholder?: string;
	disabled?: boolean;
	dateType?: string;
	format?: string;
	valueFormat?: string;
	options?: Array<{
		label: string;
		value: string | number;
	}>;
}
const props = defineProps({
	form: {
		type: Object as any,
		default: () => ({}),
	},
	rules: {
		type: Object,
		default: () => ({}),
	},
	config: {
		type: Array as PropType<FormConfigItem[]>,
		default: () => [],
	},
	labelWidth: {
		type: Number,
		default: 100,
	},
});
const localForm = ref(props.form);
watch(
	() => props.form,
	(newVal) => {
		localForm.value = newVal;
	},
	{ deep: true }
);
</script>

<style lang="less" scoped>
.el-form-item {
	width: 100%;
	margin-right: 0;
	margin-bottom: 0.12rem;
	border: 0.01rem solid #d9d9d9;
	border-radius: 0.02rem;
	:deep(.el-form-item__content) {
		display: flex;
		line-height: 0.36rem;
	}
	:deep(.el-form-item__label) {
		height: 0.36rem;
		line-height: 0.36rem;
		padding: 0 0 0 0;
		font-size: @g-font-size-base;
		color: rgba(0, 0, 0, 0.6);
	}
	.el-input,
	.el-select,
	.el-date-editor {
		flex: 1;
		:deep(.el-input__wrapper) {
			// background: #ecf3fd;
			--el-input-border-color: #d9d9d9;
		}
	}
}
:deep(.el-input__prefix),
:deep(.el-select__prefix),
:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	font-size: @g-font-size-base;
	height: 0.36rem;
	line-height: 0.36rem;
	min-height: 0.36rem;
	border-radius: 0.02rem;
	padding: 0.04rem 0.12rem;
	box-shadow: none;
	&:hover {
		box-shadow: none;
	}
}
:deep(.el-select__prefix) {
	padding: 0.04rem 0;
}
:deep(.el-select__icon) {
	color: rgba(0, 0, 0, 0.65);
	width: 0.14rem;
}
.custom-form {
	width: 100%;
	align-items: center;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	font-size: @g-font-size-base;
	height: 0.36rem;
	min-height: 0.36rem;
	border-radius: 0.02rem;
	padding: 0.04rem 0.12rem;
	.label {
		width: 1.5rem;
	}
}
</style>
<style lang="less">
.wall-map-more-search {
	.el-select-dropdown {
		border-radius: 0.02rem;
	}
	.el-select-dropdown__list,
	.el-select-dropdown__empty {
		padding: 0.06rem 0;
	}
	.el-select-dropdown__item,
	.el-select-dropdown__empty {
		font-size: @g-font-size-base;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		font-family:
			PingFangSC,
			PingFang SC;
		height: 0.36rem;
		min-height: 0.36rem;
		&.is-selected {
			color: var(--el-color-primary);
		}
	}

	.el-select-dropdown__item {
		line-height: 0.36rem;
	}
}
</style>
