<template>
	<div class="filter-bar">
		<div class="filter-item">
			<span class="filter-label">产业链：</span>
			<el-select
				v-model="industryChain"
				:teleported="false"
				placeholder="请选择"
				clearable
				@change="changeFunc"
			>
				<el-option
					v-for="item in industryOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
		</div>
		<div class="filter-item">
			<span class="filter-label">发布时间：</span>
			<DateTimeRangePicker
				v-model="dateRange"
				type="date"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:teleported="false"
				@change="changeFunc"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { getIndustryChainList } from '@/api/Intelligence';
import { computed, onMounted, ref } from 'vue';
import type { FilterBarSearch } from '../GeneralDept/types';
import DateTimeRangePicker from './DateTimeRangePicker.vue';

defineOptions({ name: 'FilterBar' });
const props = defineProps<{
	modelValue: FilterBarSearch;
	deptCode: string;
}>();
// 产业链选项（接口获取）
const industryOptions = ref<{ label: string; value: string }[]>([]);

const emit = defineEmits(['update:modelValue', 'change']);

const emitUpdate = (patch: Partial<FilterBarSearch>) => {
	emit('update:modelValue', { ...props.modelValue, ...patch });
};

onMounted(async () => {
	try {
		const res = await getIndustryChainList<{
			code: number;
			data: { code: string; name: string; selected?: boolean }[];
		}>({ deptCode: props.deptCode });
		industryOptions.value =
			res.code === 0 && Array.isArray(res.data)
				? res.data.map((item) => ({ label: item.name, value: item.code }))
				: [];
		// 默认选中接口返回 selected 为 true 的数据
		const selectedItem = Array.isArray(res.data)
			? res.data.find((item) => item.selected) || res.data[0]
			: undefined;
		if (res.code === 0 && selectedItem) {
			emitUpdate({ industryChain: selectedItem.code });
			emit('change');
		}
	} catch {
		industryOptions.value = [];
	}
});



const industryChain = computed({
	get: () => props.modelValue.industryChain,
	set: (val: string) => emitUpdate({ industryChain: val }),
});

const dateRange = computed({
	get: (): [string, string] | null => {
		const range = props.modelValue.dateRange;
		return Array.isArray(range) && range.length >= 2 ? (range as [string, string]) : null;
	},
	set: (val: [string, string] | null) => emitUpdate({ dateRange: val ?? [] }),
});

const changeFunc = () => {
	emit('change');
};
</script>

<style lang="less" scoped>
.filter-bar {
	display: flex;
	align-items: center;
	gap: 0.24rem;
	padding: 0.16rem 0;
	flex-shrink: 0;
}

.filter-item {
	display: flex;
	align-items: center;
}

.filter-label {
	font-size: 0.16rem;
	color: #4e5969;
	white-space: nowrap;
}

.el-select {
	width: 2.4rem;
}

.date-time-range-picker {
	width: 3.5rem;
}
:deep(.el-select__wrapper) {
	line-height: 0.36rem;
	min-height: 0.36rem;
	font-size: 0.18rem;
}
</style>
