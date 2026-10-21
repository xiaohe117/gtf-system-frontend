<template>
	<div class="date-select">
		<el-select
			:model-value="selectedValue"
			@update:model-value="updateValue"
			@change="handleChange"
			:placeholder="placeholder"
			v-bind="$attrs"
		>
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
// import { EcoOperationNormalMock as EcoOperationNormal } from '@/api/dailyMonitoring/home';
import { dateDropDown } from '@/api/EfficiencyCenter';

interface DateSelectProps {
	modelValue?: string;
	// dateOption?: string[];
	placeholder?: string;
}

// eslint-disable-next-line no-unused-vars
const props = withDefaults(defineProps<DateSelectProps>(), {
	modelValue: '',
	// dateOption: () => [],
	placeholder: '请选择时间',
});

const dateOption: any = ref([]);
const store = useUserStore();
const defaultDate = computed(() => store.dateSelect);
const selectedValue = ref<any>('');
const emit = defineEmits(['updateValue', 'change', 'update:modelValue']);

// 计算选中的值
const val = computed(() => {
	// 检查defaultDate是否存在于选项中
	if (defaultDate.value && dateOption.value.includes(defaultDate.value)) {
		return defaultDate.value;
	}
	// 最后返回第一个选项（如果选项存在）
	return dateOption.value.length > 0 ? dateOption.value[0] : '';
});

const handleChange = (value: string) => {
	store.setDateSelect(value);
};

watch(
	() => val.value,
	(value) => {
		selectedValue.value = value;
		emit('update:modelValue', value);
		emit('change', value);
	}
);
const updateValue = (value: string) => {
	emit('updateValue', value);
};

const getDateDropDown = () => {
	dateDropDown<string[]>().then((res) => {
		if (res.code === 0) {
			if (store.dateSelect === '') {
				store.setDateSelect(res?.data[0]);
			}
			dateOption.value = res.data;
		} else {
			console.log('获取数据失败');
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
