<template>
	<div class="enterprise-business">
		<main>
			<SmallTitle title="企业信息"></SmallTitle>
			<BasicForm
				v-model:ruleForm="formData"
				:rules="formRules"
				:columns="filteredInfoColumns"
				:modify="true"
				ref="formRef"
			>
				<template #name>
					<div class="name-box">
						<el-input readonly v-model="formData.companyName"></el-input>
						<el-button
							type="primary"
							v-if="!route.query.sccode"
							@click="selectFunc('formData')"
							>选择</el-button
						>
					</div>
				</template>
			</BasicForm>
			<SmallTitle title="招商方向"></SmallTitle>
			<BasicForm
				v-model:ruleForm="formData"
				:rules="formRules"
				:columns="filteredStaColumns"
				:modify="true"
				ref="staRef"
			>
			</BasicForm>
			<SmallTitle title="关联项目">
				<el-button type="primary" @click="addProject" :icon="Plus">添加</el-button>
			</SmallTitle>
			<div
				class="glqy"
				v-for="(project, index) in formData.projectIdList"
				:key="'project-' + index"
			>
				<div class="flex">
					<BasicForm
						v-model:ruleForm="formData.projectIdList[index]"
						:rules="formRules"
						:columns="filteredFormColumns4"
						:modify="true"
						:ref="(el: any) => (projectRefs[index] = el)"
						:layout="'horizontal'"
					>
						<template #name>
							<div class="name-box" @click="openProjectDialog(`${index}`)">
								<el-input
									readonly
									v-model="formData.projectIdList[index].projectName"
									placeholder="请输入项目名称"
								></el-input>
								<el-button type="primary">选择</el-button>
							</div>
						</template>
					</BasicForm>
					<div @click="removeProject(index)" class="delete-btn">删除</div>
				</div>
			</div>
		</main>
	</div>
</template>
<script lang="ts" setup>
import { ref as vueRef, computed, watch } from 'vue';
import { handleRules } from '@/utils/form';
import SmallTitle from '@/components/SmallTitle.vue';
import BasicForm from '@/views/FormFillPage/components/BasicForm.vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
	showRequired: {
		type: Boolean,
		default: true,
	},
	relatedProjectData: {
		type: Object,
		default: () => ({}),
	},
	enterpriseDate: {
		type: Object,
		default: () => ({}),
	},
	modelValue: {
		type: Object,
		default: () => ({
			projectIdList: [], // 初始化 projectIdList 数组
		}),
	},
});
const emits = defineEmits(['update:modelValue', 'relatedProject', 'EnterpriseSearch']);

const formData = computed<any>({
	get: () => {
		// 确保返回的对象中始终有 projectIdList 且至少有一条数据
		const value = props.modelValue || {};
		if (!value.projectIdList || value.projectIdList.length === 0) {
			value.projectIdList = [
				{
					projectName: '',
					progressLevel: '',
					projectId: '',
				},
			];
		}
		return value;
	},
	set: (value) => emits('update:modelValue', value),
});
// setTimeout(() => {
// 	formData.value.projectIdList = formData.value?.projectIdList;
// 	console.log(formData.value?.projectIdList, '111111111');
// }, 500);

// 初始化时确保 projectIdList 存在
// if (!formData.value.projectIdList) {
// 	formData.value.projectIdList = [];
// }

const cols = [
	{
		prop: 'companyName',
		label: '企业名称',
		type: 'slot',
		slot: 'name',
		isRequired: true,
	},
	{
		prop: 'sccode',
		label: '信用代码',
		type: 'text',
		isRequired: true,
		disabled: true,
	},
	{
		prop: 'enterpriseType',
		label: '机构类型',
		type: 'text',
		disabled: true,
		isRequired: false,
	},
	{
		prop: 'registeredAddress',
		label: '注册地址',
		type: 'text',
		disabled: true,
		isRequired: false,
	},
];

const filteredInfoColumns = computed(() =>
	props.showRequired ? cols : cols.filter((item) => item.isRequired)
);

const staColumns = [
	{
		prop: 'mainAdviceContent',
		label: '主攻方向',
		type: 'textarea',
		span: 24,
		minRows: 6,
		placeholder: '与该企业进行投资合作的建议、招商方向建议等。',
		isRequired: true,
	},
	{
		prop: 'focusAdviceContent',
		label: '当期重点',
		type: 'textarea',
		span: 24,
		minRows: 6,
		placeholder: '短期阶段招商重点方向、建议内容。',
		isRequired: true,
	},
];

const filteredStaColumns = computed(() =>
	props.showRequired ? staColumns : staColumns.filter((item) => item.isRequired)
);

const formRef = ref();
const staRef = ref();
const selectType = ref('');
const selectFunc = (type: string) => {
	emits('EnterpriseSearch', '企业查找');
	selectType.value = type;
};

// 关联项目相关
const projectRefs = vueRef<any[]>([]);
const currentProjectIndex = vueRef<number | null>(null);

const cols4 = [
	{
		prop: 'projectName',
		label: '项目名称',
		type: 'text',
		placeholder: '请输入项目名称',
		isRequired: true,
		slot: 'name',
	},
	// <!-- 进程阶段 0:注册 1：在谈 2：签约 3：开工 4：投产（开票） 5：纳统纳税 6：落地 -->

	{
		prop: 'progressLevel',
		label: '项目阶段',
		type: 'select',
		placeholder: '请选择项目阶段',
		options: [
			{ label: '注册', value: '0' },
			{ label: '在谈', value: '1' },
			{ label: '签约', value: '2' },
			{ label: '开工', value: '3' },
			{ label: '投产（开票）', value: '4' },
			{ label: '纳统纳税', value: '5' },
			{ label: '落地', value: '6' },
		],
		isRequired: true,
		disabled: true,
	},
];

const filteredFormColumns4 = computed(() =>
	props.showRequired ? cols4 : cols4.filter((item) => item.isRequired)
);
const formRules = computed(() => {
	const allColumns = [...cols, ...staColumns, ...cols4];
	return handleRules(
		props.showRequired ? allColumns : allColumns.filter((item) => item.isRequired)
	);
});

const addProject = () => {
	// 确保 projectIdList 存在
	if (!formData.value.projectIdList) {
		formData.value.projectIdList = [];
	}
	formData.value.projectIdList.push({
		projectName: '',
		progressLevel: '',
		projectId: '',
	});
};
const removeProject = (index: number) => {
	formData.value.projectIdList.splice(index, 1);
	projectRefs.value.splice(index, 1);
};

const openProjectDialog = (index: any) => {
	currentProjectIndex.value = index;
	emits('relatedProject', '关联项目');
};

const handelOK = async () => {
	try {
		// 收集所有表单的校验Promise
		const validations = [
			formRef.value?.validateForm(), // 企业信息表单
			staRef.value?.validateForm(), // 招商方向表单
			...projectRefs.value.map((ref) => ref?.validateForm()), // 所有关联项目表单
		];

		const results = await Promise.all(validations);

		const allValid = results.every((valid) => valid);

		if (formData.value.projectIdList.length === 0) {
			ElMessage.warning('请至少添加一个关联项目');
			return false;
		}

		if (allValid) {
			console.log('BaseInfoForm所有表单数据:', formData.value);
			return true;
		}
		return false;
	} catch (error) {
		// 处理校验失败
		console.error('校验失败:', error);
		return false;
	}
};

// 关联项目弹窗监听
watch(
	() => props.relatedProjectData,
	(project: any) => {
		if (currentProjectIndex.value !== null) {
			formData.value.projectIdList[currentProjectIndex.value] = {
				projectName: project.projectName,
				progressLevel: project.progressLevel,
				sccode: project.id,
				projectId: project.projectId,
			};
		}
		currentProjectIndex.value = null;
	},
	{
		deep: true,
		immediate: true,
	}
);

// 企业查找弹窗监听
watch(
	() => props.enterpriseDate,
	({ companyName, sccode, enterpriseType, registeredAddress }) => {
		const updatedData = {
			...formData.value, // Keep existing values
			companyName,
			sccode,
			enterpriseType,
			registeredAddress,
		};

		formData.value = updatedData;
	},
	{
		deep: true,
		immediate: true,
	}
);

defineExpose({
	handelOK,
});
</script>
<style lang="less" scoped>
.enterprise-business {
	display: flex;
	flex-direction: column;
	.el-button {
		font-family: MicrosoftYaHei;
		font-weight: 400;
		text-align: center;
		border: none;
	}

	main {
		.name-box {
			display: flex;
			justify-content: space-between;
			width: 100%;
			.el-button {
				width: 1.25rem;
				margin-left: 0.18rem;
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
			background: linear-gradient(
				180deg,
				rgba(183, 220, 255, 0.54) 0%,
				rgba(220, 240, 255, 0) 100%
			);
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
	}
}
</style>
