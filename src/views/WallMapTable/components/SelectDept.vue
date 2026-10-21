<!--
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2025-10-18 11:34:47
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-05 19:06:57
-->
<template>
	<div class="select-dept" :class="{ 'has-value': val.length > 0 }">
		<el-cascader
			ref="cascaderRef"
			v-model="val"
			:options="options"
			placeholder="请选择"
			filterable
			clearable
			@change="changeFunc"
			:suffix-icon="CaretBottom"
			:props="defaultProps"
			:show-all-levels="false"
			@visible-change="visibleChange"
			@expand-change="elCascaderOnlick"
			popper-class="select-dept-cascader"
			placement="bottom"
			v-bind="$attrs"
		>
			<template #prefix>
				<div>{{ label }}：</div>
			</template>
			<!-- <template #default="{ node, data }">
				<div @click="selectNode(data, node)">
					{{ data.name }}
				</div>
			</template> -->
		</el-cascader>
		<el-icon class="suffix-icon el-select__caret" :class="{ 'is-reverse': visible }">
			<CaretBottom />
		</el-icon>
	</div>
</template>
<script lang="ts" setup>
import { getDeptTfwList, getOtherDeptList } from '@/api/wallMapTable/index';
import { CaretBottom } from '@element-plus/icons-vue';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	dataType: {
		type: String,
		default: 'tfw', // 数据类型tfw:只显示投发委所属，other:除了投发委外的其他单位
	},
	label: {
		type: String,
		default: '',
	},
});
const val = ref('');
const defaultProps = ref({
	value: 'code',
	label: 'name',
	emitPath: false,
	checkStrictly: true,
});
watch(
	() => props.modelValue,
	() => {
		val.value = props.modelValue;
	},
	{ immediate: true, deep: true }
);
const tfwDepts: any = ref([]);
const getTfwDepts = () => {
	getDeptTfwList().then((res: any) => {
		tfwDepts.value = (res.data && res.data.children) || [];
	});
};
const otherDepts: any = ref([]);
const cascaderRef = ref();
const getOtherDepts = () => {
	getOtherDeptList().then((res: any) => {
		otherDepts.value = res.data || [];
	});
};
watch(
	() => props.dataType,
	() => {
		if (props.dataType === 'tfw') {
			getTfwDepts();
		} else {
			getOtherDepts();
		}
	},
	{ immediate: true }
);
const emits = defineEmits(['update:modelValue', 'change']);

function transObj(data: any, map: any = {}) {
	// eslint-disable-next-line no-restricted-syntax
	for (const node of data) {
		map[node.departmentId] = node;
		if (node.children && node.children.length > 0) {
			transObj(node.children, map);
		}
	}
	return map;
}

const options = computed(() => {
	if (props.dataType === 'tfw') {
		return tfwDepts.value;
	}
	// 第一级不能选择
	return otherDepts.value.map((item: any) => ({
		...item,
		disabled: item.code !== '100',
	}));
});

// 转换为对象数据，方便获取选中节点
let optionsMap = {} as any;
watch(
	() => options.value,
	() => {
		optionsMap = transObj(options.value);
	},
	{ immediate: true, deep: true }
);
const elCascaderOnlick = () => {
	setTimeout(() => {
		document.querySelectorAll('.el-cascader-node__label')?.forEach((el:any) => {
			el.onclick = function () {
				el.previousElementSibling.click()
			};
		});
	},500);
};
const changeFunc = () => {
	emits('update:modelValue', val.value);
	emits('change', val.value, optionsMap[val.value] || {});
	elCascaderOnlick()
};

const visible = ref(false);
const visibleChange = (v: any) => {
	visible.value = v;
	if(v){
		elCascaderOnlick()
	}
};

</script>
<style lang="less" scoped>
.select-dept {
	width: 100%;
	position: relative;
	.el-cascader {
		width: 100%;
	}
	:deep(.el-input__wrapper) {
		padding: 0 0.12rem !important;
	}
	.suffix-icon {
		position: absolute;
		width: 0.12rem;
		color: rgba(0, 0, 0, 0.65);
		right: 0.12rem;
		top: calc(50% - 0.06rem);
		cursor: pointer;
		pointer-events: none;
	}
	&.has-value:hover {
		.el-select__caret {
			display: none;
		}
	}
	:deep(.el-input__suffix) {
		.el-icon {
			font-size:  @g-font-size-base;
			color: rgba(0, 0, 0, 0.65);
		}
		.el-icon.icon-arrow-down {
			opacity: 0;
		}
	}
}
</style>
<style lang="less">
.select-dept-cascader {
	.el-radio {
		--el-radio-input-height: @g-font-size-base;
		--el-radio-input-width: @g-font-size-base
	}
	.el-cascader-node {
		height: 0.36rem;
		min-height: 0.36rem;
		padding: 0 0.3rem 0 0.2rem;
	}
	.el-cascader-menu:last-child .el-cascader-node {
		padding-right: 0.2rem;
	}
	.el-cascader-node__label {
		font-size:  @g-font-size-base;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		font-family: PingFangSC, PingFang SC;
	}
}
</style>