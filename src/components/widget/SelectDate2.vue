<template>
	<div class="date-select">
		<el-select v-model="currentValue" :placeholder="placeholder" v-bind="$attrs">
			<el-option
				v-for="item in dateOption"
				:key="item"
				:label="item"
				:value="item"
			></el-option>
		</el-select>
	</div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';
import { dateDropDown } from '@/api/EfficiencyCenter';

interface DateSelectProps {
	modelValue?: string;
	placeholder?: string;
}

// eslint-disable-next-line no-unused-vars
const props = withDefaults(defineProps<DateSelectProps>(), {
	modelValue: '',
	placeholder: '请选择时间',
});

const emit = defineEmits(['updateValue', 'change', 'update:modelValue']);

const dateOption: any = ref([]);
const store = useUserStore();

// --- 核心修改：严格优先级的计算属性 ---
const currentValue = computed({
	get() {
		// 1. 第一优先级：Store 里有值，且该值存在于下拉选项列表中
		if (store.dateSelect && dateOption.value.includes(store.dateSelect)) {
			return store.dateSelect;
		}

		// 2. 第二优先级：Store 没值（或不在列表中），但父组件传了值（兼容外部控制）
		if (props.modelValue) {
			return props.modelValue;
		}

		// 3. 第三优先级：兜底默认值（接口返回的第一项）
		if (dateOption.value.length > 0) {
			return dateOption.value[0];
		}

		return '';
	},
	set(val) {
		// 只要值变了，就同步给 Store 和 父组件
		store.setDateSelect(val);
		emit('update:modelValue', val);
		emit('change', val);
	},
});

const getDateDropDown = () => {
	dateDropDown<string[]>().then((res) => {
		if (res.code === 0) {
			dateOption.value = res.data;

			// --- 初始化逻辑 ---
			// 只有当 Store 里没有值时，才自动选中第一项
			if (!store.dateSelect) {
				const firstVal = res.data[0];

				// 更新 Store
				store.setDateSelect(firstVal);

				// 触发 set，通知父组件
				emit('update:modelValue', firstVal);
				emit('change', firstVal);
			}
		}
	});
};

onMounted(() => {
	getDateDropDown();
});
</script>

<style scoped>
.date-select {
	position: absolute;
	right: 0;
	width: 2.36rem;
	height: 0.32rem;
	color: rgba(0, 0, 0, 0.65);
	:deep(.el-select__placeholder) {
		color: rgba(0, 0, 0, 0.65) !important;
		font-size: 0.18rem;
	}
	z-index: 99;
}
</style>
