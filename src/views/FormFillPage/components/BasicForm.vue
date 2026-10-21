<template>
	<el-form
		ref="ruleFormRef"
		:model="localForm"
		:rules="rules"
		:label-width="layout === 'horizontal' ? '140px' : '140px'"
		class="demo-ruleForm"
		:class="[layoutClass]"
		:label-position="labelPosition ? labelPosition : ''"
	>
		<!-- 基本信息部分插槽 -->
		<slot name="before-form-content"></slot>

		<el-row :gutter="layout === 'horizontal' ? 20 : 0">
			<el-col
				v-for="(col, index) in visibleColumns"
				:key="col.prop"
				:span="col.span ? col.span : layout === 'horizontal' ? 12 : 24"
			>
				<div :class="index % 2 === 0 ? 'bg-purple' : 'bg-purple-light'">
					<el-form-item
						:label="col.label ? col.label + (labelPosition === 'top' ? '' : ' ：') : ''"
						:prop="col.prop"
					>
						<!-- 检查是否有对应的插槽 -->
						<template v-if="slots[col.slot]">
							<slot :name="col.slot"></slot>
						</template>
						<template v-else>
							<template v-if="modify">
								<!-- 根据不同类型显示不同的表单控件 -->
								<el-input
									v-if="!col.type || col.type === 'text'"
									v-model="localForm[col.prop]"
									:style="{ width: col.width ? col.width + 'px' : '300px' }"
									:disabled="col.disabled"
									:maxlength="col.maxLength || 100"
									clearable
									:placeholder="col.placeholder || `请输入${col.label}`"
								></el-input>

								<!-- 添加 textarea 支持 -->
								<el-input
									v-else-if="col.type === 'textarea'"
									v-model="localForm[col.prop]"
									type="textarea"
									:autosize="{
										minRows: col.minRows || 2,
										maxRows: col.maxRows || 4,
									}"
									:style="{ width: col.width ? col.width + 'px' : '100%' }"
									:placeholder="col.placeholder || `请输入${col.label}`"
									:disabled="col.disabled"
									:maxlength="col.maxLength || 1000"
									clearable
								></el-input>

								<el-select
									v-else-if="col.type === 'select'"
									v-model="localForm[col.prop]"
									:style="{ width: col.width ? col.width + 'px' : '300px' }"
									:disabled="col.disabled"
									:multiple="col.multiple"
									clearable
								>
									<el-option
										v-for="item in col.options"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									></el-option>
								</el-select>

								<el-date-picker
									v-else-if="col.type === 'date'"
									v-model="localForm[col.prop]"
									:type="col.dateType || 'date'"
									:style="{ width: col.width ? col.width + 'px' : '100%' }"
									placeholder="选择日期"
									:disabled="col.disabled"
									:format="col.format || 'yyyy-MM-dd'"
									:value-format="col.valueFormat || 'yyyy-MM-dd'"
									clearable
								></el-date-picker>

								<el-radio-group
									v-else-if="col.type === 'radio'"
									v-model="localForm[col.prop]"
									:disabled="col.disabled"
								>
									<el-radio
										v-for="item in col.options"
										:key="item.value"
										:label="item.value"
									>
										{{ item.label }}
									</el-radio>
								</el-radio-group>

								<el-tag
									v-else-if="col.type === 'tag'"
									:type="col.tagType || 'success'"
								>
									{{ localForm[col.prop] }}
								</el-tag>
								<div v-else-if="col.type === 'cascader'">
									<el-cascader />
								</div>
							</template>
							<span v-else>
								<el-tag v-if="col.type === 'tag'" :type="col.tagType || 'success'">
									{{ localForm[col.prop] }}
								</el-tag>
								<template v-else>
									{{
										col.options
											? getOptionLabel(col.options, localForm[col.prop])
											: isEmpty(localForm[col.prop])
												? EmptyConst
												: localForm[col.prop]
									}}
								</template>
							</span>
						</template>
					</el-form-item>
				</div>
			</el-col>
		</el-row>

		<!-- 表单内容之后的自定义插槽 -->
		<slot name="after-form-content"></slot>
	</el-form>
</template>

<script setup>
import { computed, useSlots, ref, watch } from 'vue';
import { isEmpty } from '@/utils';
import { EmptyConst } from '@/utils/dict'; // 确保路径正确

const slots = useSlots();
const ruleFormRef = ref(null);

const props = defineProps({
	ruleForm: {
		type: Object,
		required: true,
	},
	rules: {
		type: Object,
		required: true,
	},
	modify: {
		type: Boolean,
		default: false,
	},
	active: {
		type: Number,
		default: 0,
	},
	columns: {
		type: Array,
		default: () => [],
	},
	layout: {
		type: String,
		default: 'horizontal',
		validator: (value) => ['horizontal', 'vertical'].includes(value),
	},
	labelPosition: {
		type: String,
		default: 'right',
	},
});

const emit = defineEmits(['update:ruleForm']);

// 创建本地副本
const localForm = ref({ ...props.ruleForm });

// 使用浅拷贝和标志位避免循环
let isUpdating = false;

watch(
	() => props.ruleForm,
	(newVal) => {
		if (!isUpdating) {
			isUpdating = true;
			localForm.value = { ...newVal };
			nextTick(() => {
				isUpdating = false;
			});
		}
	},
	{ deep: true }
);

watch(
	localForm,
	(newVal) => {
		if (!isUpdating) {
			isUpdating = true;
			emit('update:ruleForm', newVal);
			nextTick(() => {
				isUpdating = false;
			});
		}
	},
	{ deep: true }
);
// 过滤掉操作列和不需要显示的列
const visibleColumns = computed(() =>
	props.columns.filter(
		(col) => col.prop !== 'action' && col.prop !== 'operateId' && col.show !== false
	)
);

const layoutClass = computed(() => `form-layout-${props.layout}`);

// 简化箭头函数
const getOptionLabel = (options, value) =>
	options.find((opt) => opt.value === value)?.label || value;

// 暴露方法给父组件
defineExpose({
	validateForm: () => ruleFormRef.value.validate(),
});
</script>

<style scoped lang="less">
// .bg-purple {
// 	background: #fff;
// }
// .bg-purple-light {
// 	background: #ffffff;
// }

/* 横向布局样式 */
.form-layout-horizontal .el-form-item {
	margin-bottom: 18px;
}

/* 纵向布局样式 */
.form-layout-vertical .el-form-item {
	margin-bottom: 20px;
}
.el-form-item .el-form-item__content .el-date-editor--daterange,
.el-date-editor,
.el-select,
.el-date-editor.el-input,
.el-input,
.el-date-editor--datetimerange.el-input__inner {
	width: 100% !important;
}
span {
	word-break: break-all; /* 英文强制换行 */
	overflow-wrap: break-word; /* 英文在单词边界换行 */
}
</style>
