<!--
 * @Descripttion: 反馈问题-录入
 * @Author: ycyun
 * @Date: 2025-09-05 10:09:22
 * @LastEditors: ycyun
 * @LastEditTime: 2025-09-09 10:05:45
-->
<template>
	<div class="problem-feedback">
		<!-- 顶部 -->
		<FormHeader
			v-model="showRequired"
			title=" 反馈问题-录入"
			tip="面向企业的招商工作中，记录企业反馈的问题或工作开展中遇到的问题"
		/>
		<main>
			<SmallTitle title="企业信息"></SmallTitle>
			<BasicForm
				v-model:ruleForm="formData"
				:rules="formRules"
				:columns="infoColumns"
				:modify="true"
				ref="formRef"
			>
				<template #name>
					<div class="name-box" @click="selectFunc('formData')">
						<el-input readonly v-model="formData.companyName"></el-input>
						<el-button type="primary">选择</el-button>
					</div>
				</template>
			</BasicForm>
			<SmallTitle title="问题情况"></SmallTitle>
			<BasicForm
				v-model:ruleForm="formData"
				:rules="formRules"
				:columns="staColumns"
				:modify="true"
				ref="staRef"
			>
			</BasicForm>
			<SmallTitle title="关联企业">
				<el-button type="primary" @click="addSub">添加</el-button>
			</SmallTitle>
			<template v-for="(item, index) in subsData" :key="item.id">
				<div class="subs-box">
					<BasicForm
						v-model:ruleForm="subsData[index]"
						:rules="formRules"
						:columns="getSubsColumns(index)"
						:modify="true"
						ref="subRef"
						class="form-box"
					>
						<template #name>
							<div class="name-box" @click="selectFunc(`${index}`)">
								<el-input readonly v-model="item.companyName"></el-input>
								<el-button type="primary">选择</el-button>
							</div>
						</template>
					</BasicForm>
					<div class="right-btn" @click="delSub(index)">删除</div>
				</div>
			</template>
			<SmallTitle title="填报信息" v-if="reportColumns.length > 0"></SmallTitle>
			<BasicForm
				v-model:ruleForm="formData"
				:rules="formRules"
				:columns="reportColumns"
				:modify="true"
				ref="reportRef"
			>
			</BasicForm>
		</main>
		<footer>
			<el-button type="primary" @click="submitFunc" :loading="saveLoading">提交</el-button>
		</footer>
		<SearchDialog ref="searchRef" @handleClickEnterprise="confirmSelect" />
	</div>
</template>
<script lang="ts" setup>
import SearchDialog from '@/views/RunByEnterprise/Left/dialog/SearchDialog.vue';
import { handleRules, deepClone } from '@/utils/form';
import { addProblemFeedback,queryDeptOption } from '@/api/formFillPage/index';
import { ElMessage } from 'element-plus';
import SmallTitle from '@/components/SmallTitle.vue';
import { generateUUID } from '@/utils/index';
import dayjs from 'dayjs';
import BasicForm from './BasicForm.vue';
import FormHeader from './FormHeader.vue';

const emits = defineEmits(['close']);
const showRequired = ref(true);
const formData: any = ref({ fillTime: dayjs().format('YYYY-MM-DD HH:mm') });

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
		prop: 'companyType',
		label: '机构类型',
		type: 'text',
		disabled: true,
	},
	{
		prop: 'address',
		label: '注册地址',
		type: 'text',
		disabled: true,
	},
];

const infoColumns = computed(() =>
	cols.filter((item) => showRequired.value || item.isRequired)
) as any;
const reportColumns = computed(() => {
	const arr = [
		{
			prop: 'fillTime',
			label: '填报时间',
			type: 'date',
			dateType: 'datetime',
			format: 'YYYY-MM-DD HH:mm',
			valueFormat: 'YYYY-MM-DD HH:mm',
		},
		{
			prop: 'fillUnit',
			label: '填报单位',
			type: 'text',
		},
		{
			prop: 'fillUser',
			label: '填报人',
			type: 'text',
		},
		{
			prop: 'fillMobile',
			label: '联系方式',
			type: 'text',
		},
	];
	return arr.filter((item: any) => showRequired.value || item.isRequired);
}) as any;

const options = ref([])
queryDeptOption().then((res:any) => {
	options.value = res.data?.map((item: any) => ({
		value: item,
		label: item,
	})) || [];
})
const staColumns = computed(() => {
	const arr = [
		{
			prop: 'problemDescription',
			label: '问题描述',
			type: 'textarea',
			placeholder: '请描述在招商工作中，企业反馈的问题或工作开展中遇到的问题',
			isRequired: true,
			span: 24,
			minRows: 4,
		},
		{
			prop: 'problemType',
			label: '问题类型',
			type: 'select',
			placeholder: '选择问题类型',
			isRequired: true,
			options: [
				{
					label: '基础配套（土地、园区、用水电气）',
					value: '基础配套（土地、园区、用水电气）',
				},
				{
					label: '产业要素（上下游产业、规划、政策）',
					value: '产业要素（上下游产业、规划、政策）',
				},
				{ label: '流程效率（审批、建设）', value: '流程效率（审批、建设）' },
			],
		},
		{
			prop: 'problemStatus',
			label: '问题状态', // 问题状态(1:待解决/2:处理中/3:已解决/4:已关闭)
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
			format: 'YYYY-MM-DD HH:mm',
			valueFormat: 'YYYY-MM-DD HH:mm',
			type: 'date',
			dateType: 'datetime',
		},
		{
			prop: 'realTime',
			label: '实际解决时间',
			format: 'YYYY-MM-DD HH:mm',
			valueFormat: 'YYYY-MM-DD HH:mm',
			type: 'date',
			dateType: 'datetime',
		},
		{
			prop: 'responsibleUnit',
			label: '责任单位',
			type: 'text',
			// options:options.value,
		},
		{
			prop: 'responsiblePerson',
			label: '责任人',
			type: 'text',
		},
	];
	return arr.filter((item: any) => showRequired.value || item.isRequired);
}) as any;

const formRules = ref(handleRules(cols.concat(reportColumns).concat(staColumns.value)));
const getSubsColumns = (index: number) => {
	const arr: any = deepClone(cols);
	arr.forEach((ele: any) => {
		if (ele.prop === 'companyName') {
			ele.label = `企业${index + 1}`;
		}
	});
	return arr.filter((item: any) => showRequired.value || item.isRequired);
};
const subsData: any = ref([{ id: generateUUID() }]);

const addSub = () => {
	subsData.value.push({ id: generateUUID() });
};
const delSub = (index: number) => {
	subsData.value.splice(index, 1);
};
const formRef = ref();
const subRef = ref();
const reportRef = ref();
const staRef = ref();
const saveLoading = ref(false);
const submitFunc = async () => {
	const forms = [...subRef.value, formRef.value, reportRef.value, staRef.value];
	Promise.all(forms.map((item) => item.validateForm())).then(() => {
		const params = {
			...formData.value,
			desiredTime: formData.value.desiredTime
				? dayjs(formData.value.desiredTime).format('YYYY-MM-DD HH:mm:ss')
				: null,
			realTime: formData.value.realTime
				? dayjs(formData.value.realTime).format('YYYY-MM-DD HH:mm:ss')
				: null,
			fillTime: formData.value.fillTime
				? dayjs(formData.value.fillTime).format('YYYY-MM-DD HH:mm:ss')
				: null,
			relatedEnterprise: formData.value.sccode,
			list: subsData.value.map((ele: any) => ({
				...ele,
				id: null,
			})),
		};
		saveLoading.value = true;
		addProblemFeedback(params)
			.then(() => {
				ElMessage.success('操作成功');
				emits('close');
				saveLoading.value = false;
			})
			.catch((err) => {
				saveLoading.value = false;
				ElMessage.error(`操作失败,${err.message}`);
			});
	});
};
const searchRef = ref();
const selectType = ref('');
const selectFunc = (type: string) => {
	selectType.value = type;
	searchRef.value.show();
};
const confirmSelect = (item: any) => {
	if (selectType.value === 'formData') {
		formData.value.companyName = item.companyName;
		formData.value.sccode = item.sccode;
		formData.value.companyType = item.enterpriseType;
		formData.value.address = item.registeredAddress;
	} else {
		subsData.value[Number(selectType.value)].companyName = item.companyName;
		subsData.value[Number(selectType.value)].sccode = item.sccode;
		subsData.value[Number(selectType.value)].companyType = item.enterpriseType;
		subsData.value[Number(selectType.value)].address = item.registeredAddress;
	}
};
</script>
<style lang="less" scoped>
.problem-feedback {
	display: flex;
	flex-direction: column;
	padding: 0 1.6rem;
	.el-button {
		font-family: MicrosoftYaHei;
		font-weight: 400;
		text-align: center;
		// background: linear-gradient(0, #1b4df4 0%, #5dc9fc 100%);
		// border-radius: 0.02rem;
		border: none;
	}

	main {
		height: 7rem;
		background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
		box-shadow: 0rem 0rem 0.08rem 0rem rgba(25, 43, 138, 0.34);
		border-radius: 0.14rem;
		border-image: linear-gradient(180deg, #eef2ff, #a2c4ff) 2 2;
		backdrop-filter: blur(0.04rem);
		padding: 0.24rem;
		overflow: auto;

		.name-box {
			display: flex;
			justify-content: space-between;
			width: 100%;
			.el-button {
				width: 1.25rem;
				margin-left: 0.18rem;
			}
		}
		.subs-box {
			display: flex;
			margin-bottom: 0.16rem;
			.form-box {
				flex: 1;
				background: rgba(22, 93, 255, 0.05);
				border-radius: 0.08rem;
				padding-right: 0.9rem;
				padding-top: 0.24rem;
			}
			.right-btn {
				margin-left: 0.24rem;
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
	footer {
		display: flex;
		justify-content: center;
		padding-top: 0.24rem;
		.el-button {
			width: 1.25rem;
		}
	}
}
</style>