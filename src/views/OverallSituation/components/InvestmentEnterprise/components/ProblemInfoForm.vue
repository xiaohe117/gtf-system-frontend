<template>
	<div class="enterprise-business">
		<main>
			<!-- 议定事项模块 -->
			<SmallTitle title="议定事项">
				<el-button type="primary" @click="addProject" :icon="Plus">添加</el-button>
			</SmallTitle>
			<div
				class="glqy"
				v-for="(project, index) in formData.gtfInvestAgreedMatters"
				:key="'project-' + index"
			>
				<div class="flex">
					<BasicForm
						v-model:ruleForm="formData.gtfInvestAgreedMatters[index]"
						:rules="projectRules"
						:columns="filteredFormColumns4"
						:modify="true"
						:ref="(el: any) => (projectRefs[index] = el)"
						:layout="'horizontal'"
					>
					</BasicForm>
					<div @click="removeProject(index)" class="delete-btn">删除</div>
				</div>
			</div>

			<!-- 问题反馈模块 -->
			<SmallTitle title="问题反馈">
				<el-button type="primary" @click="addProblem" :icon="Plus">添加</el-button>
			</SmallTitle>
			<div
				class="glqy"
				v-for="(problem, index) in formData.gtfInvestIssueFb"
				:key="'problem-' + index"
			>
				<div class="flex">
					<BasicForm
						v-model:ruleForm="formData.gtfInvestIssueFb[index]"
						:rules="problemRules"
						:columns="filteredStaColumns"
						:modify="true"
						:ref="(el: any) => (problemRefs[index] = el)"
						:layout="'horizontal'"
					>
					</BasicForm>
					<div @click="removeProblem(index)" class="delete-btn">删除</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script lang="ts" setup>
import { ref as vueRef, computed } from 'vue';
import { handleRules } from '@/utils/form';
import { Plus } from '@element-plus/icons-vue';
import SmallTitle from '@/components/SmallTitle.vue';
import BasicForm from '@/views/FormFillPage/components/BasicForm.vue';

const props = defineProps({
	showRequired: {
		type: Boolean,
		default: true,
	},
	modelValue: {
		type: Object,
		default: () => ({
			gtfInvestAgreedMatters: [],
			gtfInvestIssueFb: [],
		}),
	},
});
const emits = defineEmits(['update:modelValue']);

const formData = computed<any>({
	get: () => props.modelValue,
	set: (value) => emits('update:modelValue', value),
});

// 表单引用
const projectRefs = vueRef<any[]>([]);
const problemRefs = vueRef<any[]>([]);

// 议定事项相关
const cols4 = [
	{
		prop: 'eventDescription',
		label: '事项描述',
		type: 'textarea',
		placeholder: '请描述在招商工作中，企业反馈的问题或工作开展中遇到的问题',
		isRequired: true,
		span: 24,
		minRows: 4,
	},
	{
		prop: 'followDutyUnit',
		label: '责任单位',
		type: 'text',
		placeholder: '请输入责任单位',
		isRequired: true,
	},
	{
		prop: 'dutyPerson',
		label: '责任人',
		type: 'text',
		placeholder: '请输入责任人',
		isRequired: false,
	},
];
const filteredFormColumns4 = computed(() =>
	props.showRequired ? cols4 : cols4.filter((item) => item.isRequired)
);

// 新增：议定事项的校验规则
const projectRules = computed(() => handleRules(filteredFormColumns4.value));

const addProject = () => {
	if (!formData.value.gtfInvestAgreedMatters) {
		formData.value.gtfInvestAgreedMatters = [];
	}
	formData.value.gtfInvestAgreedMatters.push({
		eventDescription: '',
		followDutyUnit: '',
		dutyPerson: '',
	});
};

const removeProject = (index: number) => {
	formData.value.gtfInvestAgreedMatters.splice(index, 1);
	projectRefs.value.splice(index, 1);
};

// 问题反馈相关
const staColumns = [
	{
		prop: 'problemDescription',
		label: '问题描述',
		type: 'textarea',
		placeholder: '请描述在招商工作中，企业反馈的问题或工作开展中遇到的问题',
		isRequired: true,
		span: 24,
		minRows: 3,
	},

	{
		prop: 'problemStatus',
		label: '问题状态',
		type: 'select',
		placeholder: '选择问题解决进度',
		isRequired: true,
		options: [
			{ label: '待解决', value: '1' },
			{ label: '处理中', value: '2' },
			{ label: '已解决', value: '3' },
			{ label: '已关闭', value: '4' },
		],
	},
	{
		prop: 'desiredTime',
		label: '预期解决时间',
		format: 'YYYY-MM-DD HH:mm:ss',
		valueFormat: 'YYYY-MM-DD HH:mm:ss',
		type: 'date',
		dateType: 'datetime',
	},
	{
		prop: 'nextStep',
		label: '具体举措',
		type: 'textarea',
		span: 24,
		minRows: 3,
		placeholder: '描述下一步工作具体内容',
		isRequired: true,
	},
	{
		prop: 'realTime',
		label: '实际解决时间',
		format: 'YYYY-MM-DD HH:mm:ss',
		valueFormat: 'YYYY-MM-DD HH:mm:ss',
		type: 'date',
		dateType: 'datetime',
	},
	{
		prop: 'responsibleUnit',
		label: '责任单位',
		type: 'text',
	},
	{
		prop: 'responsiblePerson',
		label: '责任人',
		type: 'text',
	},
];

const filteredStaColumns = computed(() =>
	props.showRequired ? staColumns : staColumns.filter((item) => item.isRequired)
);

const addProblem = () => {
	if (!formData.value.gtfInvestIssueFb) {
		formData.value.gtfInvestIssueFb = [];
	}
	formData.value.gtfInvestIssueFb.push({
		problemDescription: '',
		mainAdviceContent: '',
		problemStatus: '',
		desiredTime: '',
		realTime: '',
		responsibleUnit: '',
		responsiblePerson: '',
	});
};

const removeProblem = (index: number) => {
	formData.value.gtfInvestIssueFb.splice(index, 1);
	problemRefs.value.splice(index, 1);
};

// 问题反馈的校验规则
const problemRules = computed(() => handleRules(filteredStaColumns.value));

const handelOK = async () => {
	try {
		// 校验所有动态表单
		const validations = [];

		// 校验议定事项表单（只有有数据时才校验）
		if (
			formData.value.gtfInvestAgreedMatters &&
			formData.value.gtfInvestAgreedMatters.length > 0
		) {
			if (projectRefs.value.length > 0) {
				validations.push(...projectRefs.value.map((ref) => ref.validateForm()));
			}
		}

		// 校验问题反馈表单（只有有数据时才校验）
		if (formData.value.gtfInvestIssueFb && formData.value.gtfInvestIssueFb.length > 0) {
			if (problemRefs.value.length > 0) {
				validations.push(...problemRefs.value.map((ref) => ref.validateForm()));
			}
		}

		// 如果没有需要校验的表单，直接返回true
		if (validations.length === 0) {
			return true;
		}

		const results = await Promise.all(validations);
		const allValid = results.every((valid) => valid);

		if (allValid) {
			console.log('表单数据:', formData.value);
			return true;
		}
		return false;
	} catch (error) {
		console.error('表单校验出错:', error);
		return false;
	}
};
defineExpose({
	handelOK,
});
</script>

<style lang="less" scoped>
.enterprise-business {
	.el-button {
		font-family: MicrosoftYaHei;
		font-weight: 400;
		text-align: center;
		border: none;
	}
}
.glqy {
	width: 97.3%;
	margin-bottom: 0.1rem;
	padding-top: 0.18rem;
	background: rgba(22, 93, 255, 0.05);
	border-radius: 0.08rem 0 0 0.08rem;
	border-radius: 0.04rem;
	position: relative;
	padding-right: 0.28rem;
}
.glqy .flex {
	width: 100%;
}
.glqy .flex .name-box {
	display: flex;
	justify-content: space-between;
	width: 100%;
}
.glqy .flex .name-box .el-button {
	width: 1.25rem !important;
	margin-left: 0.18rem;
}
.glqy .flex .delete-btn {
	position: absolute;
	right: -0.4rem;
	height: 100%;
	top: 0;
	width: 0.34rem;
	background: linear-gradient(180deg, rgba(183, 220, 255, 0.54) 0%, rgba(220, 240, 255, 0) 100%);
	border-radius: 0.08rem 0.08rem 0 0;
	cursor: pointer;
	font-size: 0.16rem;
	color: #ff4d4f;
	display: flex;
	justify-content: center;
	align-items: center;
	writing-mode: vertical-lr;
	letter-spacing: 0.16rem;
}
</style>
