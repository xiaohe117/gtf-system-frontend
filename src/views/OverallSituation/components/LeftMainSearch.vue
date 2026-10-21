<template>
	<div class="left-main-search">
		<TitleBody name="高级搜索">
			<el-form ref="ruleFormRef" :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="产业分类：" prop="industryType">
					<SelectControl
						v-model="formInline.industryType"
						:options="industryTypeOption"
					/>
				</el-form-item>
				<el-form-item label="全部地区：" prop="area">
					<SelectControl v-model="formInline.area" :options="areaOption" />
				</el-form-item>
				<el-form-item label="公司类型：" prop="companyType">
					<SelectControl v-model="formInline.companyType" :options="companyTypeOption" />
				</el-form-item>
				<el-form-item label="有无项目：" prop="isHasProject">
					<SelectControl
						v-model="formInline.isHasProject"
						:options="isHasProjectOption"
					/>
				</el-form-item>
				<el-form-item label="跟进单位：" prop="followUnit">
					<SelectControl v-model="formInline.followUnit" :options="followUnitOption" />
				</el-form-item>
				<el-form-item label="招商类型：" prop="investmentType">
					<SelectControl
						v-model="formInline.investmentType"
						:options="investmentTypeOption"
					/>
				</el-form-item>
			</el-form>
		</TitleBody>
	</div>
</template>

<script setup lang="ts">
import SelectControl from '@/components/widget/SelectControl.vue';

const props = defineProps<{
	originalData: any;
}>();

const formInline = reactive({
	industryType: 0,
	area: 0,
	companyType: 0,
	isHasProject: 0,
	followUnit: 0,
	investmentType: 0,
});

const createOptionsWithAll = (data: any[], field: string) => {
	const values = new Set(data.map((item) => item[field]).filter(Boolean));
	return [
		{ value: 0, label: '全部' },
		...Array.from(values).map((value) => ({ value, label: value })),
	];
};

// 下拉选项
const industryTypeOption = computed(() => createOptionsWithAll(props.originalData, 'industryType'));
const areaOption = computed(() => createOptionsWithAll(props.originalData, 'area'));
const companyTypeOption = computed(() => createOptionsWithAll(props.originalData, 'companyType'));
const isHasProjectOption = computed(() => createOptionsWithAll(props.originalData, 'isHasProject'));
const followUnitOption = computed(() => createOptionsWithAll(props.originalData, 'followUnit'));
const investmentTypeOption = computed(() =>
	createOptionsWithAll(props.originalData, 'investmentType')
);

// 重置表单
const ruleFormRef = ref<any>();
const resetForm = () => {
	ruleFormRef.value?.resetFields();
};

defineExpose({
	formInline,
	resetForm,
});
</script>

<style lang="less" scoped>
.left-main-search {
	margin-top: 0.24rem;
}
.demo-form-inline {
	padding-left: 0.16rem;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, auto);
	grid-row-gap: 0.16rem;
	grid-column-gap: 0.16rem;
	.el-input {
		--el-input-width: 3rem;
	}
	.el-select {
		--el-select-width: 3rem;

		:deep(.el-select__wrapper) {
			height: 0.36rem;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 0.04rem 0rem 0.04rem 0rem;
			border: 0.01rem solid #c2cfde;
			backdrop-filter: blur(0.1rem);
			box-shadow: none;
			font-weight: 400;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.65);
			line-height: 0.2rem;
		}
	}
	:deep(.el-form-item) {
		margin: 0;
		.el-form-item__label {
			align-items: center;
			padding-right: 0.08rem;
			font-weight: 500;
			font-size: 0.16rem;
			color: #333333;
			line-height: 0.2rem;
		}
		.el-select__placeholder {
			font-weight: 400;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.65);
			line-height: 0.2rem;
		}
	}
}
</style>
