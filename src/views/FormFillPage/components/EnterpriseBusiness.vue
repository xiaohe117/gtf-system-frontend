<!--
 * @Descripttion: 企业在穗业务录入
 * @Author: ycyun
 * @Date: 2025-09-05 10:09:22
 * @LastEditors: ycyun
 * @LastEditTime: 2025-09-09 10:06:09
-->
<template>
	<div class="enterprise-business">
		<!-- 顶部 -->
		<FormHeader
			v-model="showRequired"
			title="在穗业务情况-录入"
			tip="面向企业的招商工作中，与该企业相关的业务信息记录"
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
			<SmallTitle title="在穗子公司或分支机构">
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
import { addBusinessSituation } from '@/api/formFillPage/index';
import { ElMessage } from 'element-plus';
import SmallTitle from '@/components/SmallTitle.vue';
import { generateUUID } from '@/utils/index';
import { authService } from '@/services/auth'; // 修改这一行
import BasicForm from './BasicForm.vue';
import FormHeader from './FormHeader.vue';

const emits = defineEmits(['close']);
const showRequired = ref(true);
const formData: any = ref({});
onMounted(() => {
	const userInfo: any = authService.getUserInfo(); // 直接从auth获取用户信息
	formData.value.reporter = userInfo?.name;
	formData.value.reportUnit = userInfo?.dept;
	formData.value.phone = userInfo?.phone;
	formData.value.reportTime = new Date()
		.toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		})
		.replace(/\//g, '-')
		.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3')
		.replace(/(\d{2}):(\d{2}):(\d{2})/, '$1:$2:$3');
});
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
	},
	{
		prop: 'registeredAddress',
		label: '注册地址',
		type: 'text',
		disabled: true,
	},
	{
		prop: 'businessDescription',
		label: '业务情况',
		type: 'textarea',
		span: 24,
		minRows: 4,
		isRequired: true,
		placeholder: '请描述该企业整体在穗业务情况。',
	},
];
const infoColumns = computed(() =>
	cols.filter((item) => showRequired.value || item.isRequired)
) as any;
const reportColumns = computed(() => {
	const arr = [
		{
			prop: 'reportTime',
			label: '填报时间',
			type: 'date',
			dateType: 'datetime',
			format: 'YYYY-MM-DD HH:mm:ss',
			valueFormat: 'YYYY-MM-DD HH:mm:ss',
		},
		{
			prop: 'reportUnit',
			label: '填报单位',
			type: 'text',
		},
		{
			prop: 'reporter',
			label: '填报人',
			type: 'text',
		},
		{
			prop: 'telePhone',
			label: '联系方式',
			type: 'text',
		},
	];
	return arr.filter((item: any) => showRequired.value || item.isRequired);
}) as any;

const formRules = ref(handleRules(cols.concat(reportColumns))) as any;
const getSubsColumns = (index: number) => {
	const arr: any = deepClone(cols);
	arr.forEach((ele: any) => {
		if (ele.prop === 'companyName') {
			ele.label = `子公司${index + 1}`;
		}
		if (ele.prop === 'businessDescription') {
			ele.label = '总体业务情况';
			ele.isRequired = true;
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
const saveLoading = ref(false);
const submitFunc = async () => {
	const forms = [...subRef.value, formRef.value, reportRef.value];
	Promise.all(forms.map((item) => item.validateForm())).then(() => {
		const params = {
			...formData.value,
			subCompanyDtoList: subsData.value.map((item: any) => ({
				subSccode: item.sccode,
				subBusinessSituation: item.businessDescription,
			})),
		};
		saveLoading.value = true;
		addBusinessSituation(params)
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
		formData.value.enterpriseType = item.enterpriseType;
		formData.value.registeredAddress = item.registeredAddress;
	} else {
		subsData.value[Number(selectType.value)].companyName = item.companyName;
		subsData.value[Number(selectType.value)].sccode = item.sccode;
		subsData.value[Number(selectType.value)].enterpriseType = item.enterpriseType;
		subsData.value[Number(selectType.value)].registeredAddress = item.registeredAddress;
	}
};
</script>
<style lang="less" scoped>
.enterprise-business {
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
