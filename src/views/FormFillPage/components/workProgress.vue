<template>
	<!-- <div class="toptitle"></div> -->
	<div class="enterprise-business">
		<header>
			<div class="title">工作进展-录入</div>
			<div class="tip">*面向企业的招商工作中，记录企业反馈的问题或工作开展中遇到的问题</div>
			<div class="switch">
				非必填项：<el-switch
					v-model="showRequired"
					inline-prompt
					active-text="显示"
					inactive-text="隐藏"
				/>
			</div>
		</header>
		<div class="Dialogbox">
			<SmallTitle title="基本信息" />
			<BasicForm
				v-model:ruleForm="formData"
				:rules="formRules"
				:columns="formColumns"
				:modify="modify"
				ref="basicInfoForm1"
				:layout="'vertical'"
			/>
			<BasicForm
				v-model:ruleForm="formData2"
				:rules="formRules"
				:columns="formColumns2"
				:modify="modify"
				ref="basicInfoForm2"
				:layout="'horizontal'"
			/>

			<div>
				<SmallTitle title="关联企业">
					<el-button type="primary" @click="addEnterprise" :icon="Plus">添加</el-button>
				</SmallTitle>
			</div>
			<div class="glqy" v-for="(enterprise, index) in enterprises" :key="index">
				<div class="flex">
					<BasicForm
						v-model:ruleForm="enterprise.formData"
						:rules="formRules"
						:columns="formColumns3"
						:modify="modify"
						:ref="
							(el: any) => {
								if (el) enterpriseRefs[index] = el;
							}
						"
						:layout="'horizontal'"
					>
						<template #name>
							<div class="name-box" @click="openSearchDialog(`${index}`)">
								<el-input
									readonly
									v-model="enterprise.formData.enterpriseName"
									placeholder="请输入企业名称"
								></el-input>
								<el-button type="primary">选择</el-button>
							</div>
						</template>
					</BasicForm>
					<!-- <el-button type="danger" @click="removeEnterprise(index)" class="delete-btn"
						>删除</el-button
					> -->
					<div @click="removeEnterprise(index)" class="delete-btn">删除</div>
				</div>
			</div>

			<SmallTitle title="关联项目">
				<el-button type="primary" @click="addProject" :icon="Plus">添加</el-button>
			</SmallTitle>
			<div class="glqy" v-for="(project, index) in projects" :key="'project-' + index">
				<div class="flex">
					<BasicForm
						v-model:ruleForm="project.formData"
						:rules="formRules"
						:columns="formColumns4"
						:modify="modify"
						:ref="
							(el: any) => {
								if (el) projectRefs[index] = el;
							}
						"
						:layout="'horizontal'"
						><template #name>
							<div class="name-box" @click="openProjectDialog(`${index}`)">
								<el-input
									readonly
									v-model="project.formData.projectName"
									placeholder="请输入项目名称"
								></el-input>
								<el-button type="primary">选择</el-button>
							</div>
						</template></BasicForm
					>

					<!-- <el-button type="danger" @click="removeProject(index)" class="delete-btn"
						>删除</el-button
					> -->
					<div @click="removeProject(index)" class="delete-btn">删除</div>
				</div>
			</div>

			<SmallTitle title="对接记录">
				<el-button type="primary" @click="addRecord" :icon="Plus">添加</el-button>
			</SmallTitle>
			<div class="glqy" v-for="(record, index) in records" :key="'record-' + index">
				<div class="flex">
					<BasicForm
						v-model:ruleForm="record.formData"
						:rules="formRules"
						:columns="formColumns5"
						:modify="modify"
						:ref="
							(el: any) => {
								if (el) recordRefs[index] = el;
							}
						"
						:layout="'horizontal'"
					>
						<!-- <template #name>
							<div class="name-box" @click="openRecordDialog(`${index}`)">
								<el-input
									readonly
									v-model="record.formData.enterpriseName"
								></el-input>
								<el-button type="primary">选择</el-button>
							</div>
						</template> -->
						<template #cascader>
							<div class="cascaderBox" @click="openRecordDialog(`${index}`)">
								<el-input
									v-model="record.formData.location"
									style="width: 1.8rem"
									placeholder="请输入地点"
								/>
								&nbsp; &nbsp; &nbsp;
								<el-input
									v-model="record.formData.detailAddress"
									style="width: 2rem"
									placeholder="请输入详细地址"
								/>
								<!-- <div class="name-box" @click="openRecordDialog(`${index}`)"> -->
								<el-button type="primary" style="width: 1.1rem; margin-left: 0.2rem"
									>选择</el-button
								>
								<!-- </div> -->
							</div>
						</template>
					</BasicForm>
					<div class="glqy-btn">
						<!-- <el-button type="danger" @click="removeRecord(index)" class="delete-btn"
							>删除</el-button
						> -->
						<div @click="removeRecord(index)" class="delete-btn">删除</div>
					</div>
				</div>
			</div>
			<SmallTitle title="填报信息" v-if="formColumns6.length > 0"></SmallTitle>
			<BasicForm
				v-model:ruleForm="formData6"
				:rules="formRules"
				:columns="formColumns6"
				:modify="modify"
				ref="basicInfoForm4"
				:layout="'horizontal'"
			/>
		</div>
	</div>
	<SearchDialog ref="enterpriseDialogRef" @handle-click-enterprise="handleSelectEnterprise" />
	<RelatedProjectDialog
		ref="relatedProjectDialogRef"
		@handle-click-project="handleSelectProject"
	/>
	<DockingRecordsDialog ref="dockingRecordsDialogRef" @handle-click-record="handleSelectRecord" />
</template>

<script lang="ts" setup>
import { ref as vueRef, computed } from 'vue';
import { handleRules } from '@/utils/form';
import { Plus } from '@element-plus/icons-vue';
import { insertWorkProgressInfo } from '@/api/formFillPage/index';
import { ElMessage } from 'element-plus';
import BasicForm from '@/views/FormFillPage/components/BasicForm.vue';
import SmallTitle from '@/components/SmallTitle.vue';
import SearchDialog from '@/views/RunByEnterprise/Left/dialog/SearchDialog.vue';
import DockingRecordsDialog from '@/views/FormFillPage/components/DockingRecordsDialog.vue';
import RelatedProjectDialog from '@/views/FormFillPage/components/RelatedProjectDialog.vue';

const emit = defineEmits(['confirm']);
const modify = ref(true);
const basicInfoForm1 = vueRef<any>(null);
const basicInfoForm2 = vueRef<any>(null);
const basicInfoForm4 = vueRef<any>(null);
const showRequired = ref(true);

// 表单数据
const formData = vueRef({
	progressType: '',
	progressTitle: '',
	content: '',
});

const formData2 = vueRef({
	followUnit: '',
	responsiblePerson: '',
	plannedDate: '',
	actualDate: '',
	isFlow: '1',
});

const formData6: any = vueRef({
	responsiblePerson: '',
	plannedDate: '',
});

// 关联企业相关
const enterprises = vueRef<Array<{ formData: any }>>([
	{
		formData: {
			enterpriseName: '',
			sccode: '',
		},
	},
]);
const enterpriseRefs = vueRef<any[]>([]);
const enterpriseDialogRef = vueRef();
const currentEnterpriseIndex = vueRef<number | null>(null);

// 关联项目相关
const projects = vueRef<Array<{ formData: any }>>([
	{
		formData: {
			projectName: '',
			projectStage: '',
		},
	},
]);
const projectRefs = vueRef<any[]>([]);
const relatedProjectDialogRef = vueRef();
const currentProjectIndex = vueRef<number | null>(null);

// 对接记录相关
const records = vueRef<Array<{ formData: any }>>([
	{
		formData: {
			recordDate: '',
			location: '',
			detailAddress: '',
			workType: '',
			workForm: '',
			workDescription: '',
		},
	},
]);
const recordRefs = vueRef<any[]>([]);
const dockingRecordsDialogRef = vueRef();
const currentRecordIndex = vueRef<number | null>(null);

// 表单列配置
const cols = [
	{
		prop: 'progressType',
		label: '进展类型',
		type: 'select',
		isRequired: true,
		placeholder: '选择工作进展类型',
		options: [
			{ label: '工作计划', value: '1' },
			{ label: '已完成', value: '2' },
			{ label: '关闭', value: '3' },
			{ label: '跟进落实', value: '4' },
		],
	},
	{
		prop: 'progressTitle',
		label: '进展概要',
		type: 'text',
		isRequired: true,
		placeholder: '请对招商工作中，阶段性或节点性的工作进展情况（含计划）做概要性描述',
		maxLength: 200,
	},
	{
		prop: 'content',
		label: '详细进展',
		type: 'textarea',
		isRequired: true,
		placeholder: '对工作进展展开详细描述',
		minRows: 4,
		maxRows: 6,
		maxLength: 2000,
		width: '100%',
	},
];
const formColumns = computed(() =>
	cols.filter((item: any) => showRequired.value || item.isRequired)
) as any;
const cols2 = [
	{
		prop: 'followUnit',
		label: '跟进责任单位',
		type: 'text',
		placeholder: '请输入责任单位',
	},
	{
		prop: 'responsiblePerson',
		label: '责任人',
		type: 'text',
		placeholder: '可填写一个或多个责任人，用英文逗号分隔',
	},
	{
		prop: 'plannedDate',
		label: '计划完成时间',
		type: 'date',
		dateType: 'datetime',
		placeholder: '预期解决问题的时间',
		format: 'YYYY-MM-DD HH:mm',
		valueFormat: 'YYYY-MM-DD HH:mm',
	},
	{
		prop: 'actualDate',
		label: '实际完成时间',
		type: 'date',
		dateType: 'datetime',
		placeholder: '预期解决问题的时间',
		format: 'YYYY-MM-DD HH:mm',
		valueFormat: 'YYYY-MM-DD HH:mm',
	},
	{
		prop: 'isFlow',
		label: '是否需要流转',
		type: 'radio',
		options: [
			{ label: '是（待跟踪）', value: '1' },
			{ label: '否（仅记录）', value: '0' },
		],
		isRequired: true,
	},
];
const formColumns2 = computed(() =>
	cols2.filter((item: any) => showRequired.value || item.isRequired)
) as any;
const cols3 = [
	{
		prop: 'enterpriseName',
		label: '企业名称',
		type: 'text',
		placeholder: '请输入企业名称',
		isRequired: true,
		slot: 'name',
	},
	{
		prop: 'sccode',
		label: '信用代码',
		type: 'text',
		placeholder: '请输入信用代码',
		isRequired: true,
		disabled: true,
	},
];
const formColumns3 = computed(() =>
	cols3.filter((item: any) => showRequired.value || item.isRequired)
) as any;
const cols4 = [
	{
		prop: 'projectName',
		label: '项目名称',
		type: 'text',
		placeholder: '请输入项目名称',
		isRequired: true,
		slot: 'name',
	},
	{
		prop: 'projectStage',
		label: '项目阶段',
		type: 'text',
		placeholder: '请输入项目阶段',
		isRequired: true,
		disabled: true,
	},
];
const formColumns4 = computed(() =>
	cols4.filter((item: any) => showRequired.value || item.isRequired)
) as any;
const cols5 = [
	{
		prop: 'recordDate',
		label: '日期',
		type: 'date',
		placeholder: '请输入日期',
		isRequired: true,
		format: 'YYYY-MM-DD HH:mm',
		valueFormat: 'YYYY-MM-DD HH:mm',
		disabled: true,
		slot: 'name',
	},
	{
		prop: 'location',
		label: '地点',
		type: 'text',
		placeholder: '请输入地点',
		isRequired: true,
		slot: 'cascader',
		disabled: true,
	},
	{
		prop: 'workType',
		label: '工作类型',
		type: 'text',
		placeholder: '请输入工作类型',
		isRequired: true,
		disabled: true,
	},
	{
		prop: 'workForm',
		label: '工作形式',
		type: 'text',
		placeholder: '请输入工作形式',
		isRequired: true,
		disabled: true,
	},
	{
		prop: 'workDescription',
		label: '工作介绍',
		type: 'textarea',
		placeholder: '请输入工作介绍',
		isRequired: true,
	},
];
const formColumns5 = computed(() =>
	cols5.filter((item: any) => showRequired.value || item.isRequired)
) as any;
const cols6 = [
	{
		prop: 'recordTime',
		label: '填报时间',
		type: 'date',
		dateType: 'datetime',
		placeholder: '请选择填报时间',
		format: 'YYYY-MM-DD HH:mm',
		valueFormat: 'YYYY-MM-DD HH:mm',
	},
	{
		prop: 'recorderDept',
		label: '填报单位',
		type: 'text',
		placeholder: '请输入填报单位 ',
	},
	{
		prop: 'recorder',
		label: '填报人',
		type: 'text',
		placeholder: '请输入填报人',
	},
	{
		prop: 'telePhone',
		label: '联系方式',
		type: 'text',
		placeholder: '请输入联系方式',
	},
];
const formColumns6 = computed(() =>
	cols6.filter((item: any) => showRequired.value || item.isRequired)
) as any;
const formRules = computed(() =>
	handleRules([
		...formColumns.value,
		...formColumns2.value,
		...formColumns3.value,
		...formColumns4.value,
		...formColumns5.value,
		...formColumns6.value,
	])
);

const addEnterprise = () => {
	enterprises.value.push({
		formData: {
			enterpriseName: '',
			sccode: '',
		},
	});
};

const removeEnterprise = (index: number) => {
	enterprises.value.splice(index, 1);
	enterpriseRefs.value.splice(index, 1);
};

const addProject = () => {
	projects.value.push({
		formData: {
			projectName: '',
			projectStage: '',
		},
	});
};

const removeProject = (index: number) => {
	projects.value.splice(index, 1);
	projectRefs.value.splice(index, 1);
};

const addRecord = () => {
	records.value.push({
		formData: {
			recordDate: '',
			location: '',
			detailAddress: '',
			workType: '',
			workForm: '',
			workDescription: '',
		},
	});
};

const removeRecord = (index: number) => {
	records.value.splice(index, 1);
	recordRefs.value.splice(index, 1);
};

const openSearchDialog = (index: any) => {
	currentEnterpriseIndex.value = index;
	enterpriseDialogRef.value?.show();
};

const openProjectDialog = (index: any) => {
	currentProjectIndex.value = index;
	relatedProjectDialogRef.value?.show();
};

const openRecordDialog = (index: any) => {
	currentRecordIndex.value = index;
	dockingRecordsDialogRef.value?.show();
};

const handleSelectEnterprise = (enterprise: any) => {
	if (currentEnterpriseIndex.value !== null) {
		enterprises.value[currentEnterpriseIndex.value].formData = {
			enterpriseName: enterprise.companyName,
			sccode: enterprise.sccode,
		};
	}
	currentEnterpriseIndex.value = null;
};

const handleSelectProject = (project: any) => {
	if (currentProjectIndex.value !== null) {
		projects.value[currentProjectIndex.value].formData = {
			projectName: project.projectName,
			projectStage: project.progressLevel,
			sccode: project.id,
		};
	}
	currentProjectIndex.value = null;
};

const handleSelectRecord = (record: any) => {
	if (currentRecordIndex.value !== null) {
		// 工作类型转换
		let workType;
		switch (record.activityType) {
			case '1':
				workType = '拜访';
				break;
			case '2':
				workType = '来访';
				break;
			default:
				workType = '重大活动';
		}

		// 工作形式转换
		let workForm;
		switch (record.activityForm) {
			case '1':
				workForm = '市内招商';
				break;
			case '2':
				workForm = '市内招商(境内)';
				break;
			default:
				workForm = '市内招商(境外)';
		}

		records.value[currentRecordIndex.value].formData = {
			recordDate: record.startTime,
			projectStage: record.activityName,
			location: `${record.activityLocationCountryCode || '-'}/${record.activityLocationProvinceCode || '-'}/${record.activityLocationCityCode || '-'}`,
			detailAddress: record.activityLocationDetailedAddress || '',
			workType, // 使用属性简写
			workForm, // 使用属性简写
			workDescription: record.companyName,
			sccode: record.id,
		};
	}
	currentRecordIndex.value = null;
};

const validateAndSubmit = async () => {
	try {
		const validations = [
			basicInfoForm1.value?.validateForm(),
			basicInfoForm2.value?.validateForm(),
			basicInfoForm4.value?.validateForm(),
			...enterpriseRefs.value.map((ref) => ref?.validateForm()),
			...projectRefs.value.map((ref) => ref?.validateForm()),
			...recordRefs.value.map((ref) => ref?.validateForm()),
		];

		const results = await Promise.all(validations);
		const isValid = results.every((valid) => valid);

		if (isValid) {
			// 准备提交数据
			const submitData = {
				// 基本信息
				progressType: formData.value.progressType,
				progressTitle: formData.value.progressTitle,
				content: formData.value.content,

				// 责任信息
				followUnit: formData2.value.followUnit,
				responsiblePerson: formData2.value.responsiblePerson,
				plannedDate: formData2.value.plannedDate,
				actualDate: formData2.value.actualDate,
				isFlow: formData2.value.isFlow,

				// 填报信息
				recordTime: formData6.value.recordTime,
				recorderDept: formData6.value.recorderDept,
				recorder: formData6.value.recorder,
				telePhone: formData6.value.telePhone,

				sccodeList: enterprises.value.map((e) => e.formData.sccode),
				// 关联项目
				projectIdList: projects.value.map((p) => p.formData.sccode),
				// 对接记录
				contactIdList: records.value.map((r) => r.formData.sccode),
			};

			// 调用接口
			const response = await insertWorkProgressInfo({
				...submitData,
			});
			if (response.code !== 0) return ElMessage.error(`操作失败！`);
			ElMessage.success('操作成功');
			emit('confirm', submitData);
			return true;
		}
		return false;
	} catch (error) {
		console.error('提交失败:', error);
		ElMessage.error('提交失败，请检查数据');
		return false;
	}
};

const resetForm = () => {
	formData.value = {
		progressType: '',
		progressTitle: '',
		content: '',
	};
	formData2.value = {
		followUnit: '',
		responsiblePerson: '',
		plannedDate: '',
		actualDate: '',
		isFlow: '1',
	};
	formData6.value = {
		responsiblePerson: '',
		plannedDate: '',
	};
	enterprises.value = [
		{
			formData: {
				enterpriseName: '',
				sccode: '',
			},
		},
	];
	enterpriseRefs.value = [];
	projects.value = [
		{
			formData: {
				projectName: '',
				projectStage: '',
			},
		},
	];
	projectRefs.value = [];
	records.value = [
		{
			formData: {
				recordDate: '',
				location: '',
				workType: '',
				workForm: '',
				workDescription: '',
			},
		},
	];
	recordRefs.value = [];
};

defineExpose({
	validateAndSubmit,
	resetForm,
});
</script>

<style scoped>
.enterprise-business {
	display: flex;
	flex-direction: column;
	padding: 0 1.6rem;
}
.enterprise-business header {
	height: 1.01rem;
	display: flex;
	align-items: center;
	color: rgba(0, 0, 0, 0.85);
	background: url('@/assets/images/FormFillPage/header-bg.png');
	background-size: 100% 100%;
	margin-bottom: 0.24rem;
}
.enterprise-business header .title {
	flex: 1;
	font-family: YouSheBiaoTiHei;
	font-size: 0.36rem;
	color: #ffffff;
	line-height: 0.4rem;
	text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
	padding-left: 0.87rem;
}
.enterprise-business header .tip {
	margin-right: 0.18rem;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.2rem;
	color: rgba(0, 0, 0, 0.65);
	line-height: 0.28rem;
}
.enterprise-business header .switch {
	font-weight: 400;
	font-family:
		PingFangSC,
		PingFang SC;
}
.enterprise-business header .switch .el-switch {
	--el-switch-on-color: #2f6bef;
	font-size: 0.16rem;
	height: 0.32rem;
	line-height: 0.2rem;
}
.enterprise-business header .switch .el-switch :deep(.el-switch__inner) {
	font-size: 0.16rem;
}
.enterprise-business header .switch .el-switch :deep(.el-switch__core) {
	width: 0.8rem;
	height: 0.32rem;
	border-radius: 0.24rem;
}
.enterprise-business .Dialogbox {
	height: 7rem;
	background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
	box-shadow: 0rem 0rem 0.08rem 0rem rgba(25, 43, 138, 0.34);
	border-radius: 0.14rem;
	border-image: linear-gradient(180deg, #eef2ff, #a2c4ff) 2 2;
	backdrop-filter: blur(0.04rem);
	padding: 0.24rem;
	overflow: auto;
}
.enterprise-business .glqy {
	width: 97.3%;
	margin-bottom: 0.1rem;
	padding-top: 0.18rem;
	background: rgba(22, 93, 255, 0.05);
	border-radius: 0.08rem 0 0 0.08rem;
	border-radius: 0.04rem;
	position: relative;
	padding-right: 0.28rem;
}
.enterprise-business .glqy .flex {
	width: 100%;
}
.enterprise-business .glqy .flex .name-box {
	display: flex;
	justify-content: space-between;
	width: 100%;
}
.enterprise-business .glqy .flex .name-box .el-button {
	width: 1.25rem !important;
	margin-left: 0.18rem;
}
.enterprise-business .glqy .flex .delete-btn {
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
.enterprise-business .cascaderBox {
	display: flex;
	align-items: center;
}
</style>
