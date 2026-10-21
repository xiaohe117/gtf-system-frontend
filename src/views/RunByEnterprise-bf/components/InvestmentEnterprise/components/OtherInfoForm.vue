<template>
	<div class="enterprise-business">
		<SmallTitle title="其他材料"></SmallTitle>
		<BasicForm
			v-model:ruleForm="formData"
			:rules="problemRules"
			:columns="filteredStaColumns"
			:modify="true"
			ref="problemFormRef"
		>
			<template #gift>
				<div>
					<el-radio-group v-model="formData.exchangeGift">
						<el-radio :value="true">是</el-radio>
						<el-radio :value="false">否</el-radio>
					</el-radio-group>
				</div>
			</template>
		</BasicForm>
		<BasicForm
			v-if="formData.exchangeGift"
			v-model:ruleForm="formData"
			:rules="solutionRules"
			:columns="filteredStaColumns1"
			:modify="true"
			ref="solutionFormRef"
		/>
		<div class="update" v-if="props.showRequired">
			<div class="form-section">
				<div class="section-header">
					<h3>要点记录</h3>
				</div>
				<div class="file-upload-item">
					<el-form
						ref="pointsFormRef"
						:model="formData"
						label-width="auto"
						label-position="top"
						class="form"
					>
						<el-form-item label="" style="width: 7rem">
							<Upload
								v-model="formData.processRecordFileList"
								class="upload"
								:accept="'.rar,.zip,.doc,.docx,.pdf'"
							></Upload>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<!-- 录音材料模块 -->
			<div class="form-section">
				<div class="section-header">
					<h3>录音材料</h3>
				</div>
				<div class="file-upload-item">
					<el-form
						ref="recordFormRef"
						:model="formData"
						label-width="auto"
						label-position="top"
						class="form"
					>
						<el-form-item label="" style="width: 7rem">
							<Upload
								v-model="formData.recordMaterialFileList"
								class="upload"
								:accept="'.mp3,.mp4,.m4a'"
								:max-size="100"
							></Upload>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<SmallTitle title="填报信息" v-if="props.showRequired"></SmallTitle>
		<BasicForm
			v-model:ruleForm="formData"
			:rules="infoRules"
			:columns="filteredInfoColumns"
			:modify="true"
			ref="infoFormRef"
		/>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { handleRules } from '@/utils/form';
import Upload from '@/components/Upload/Index.vue';
import SmallTitle from '@/components/SmallTitle.vue';
import BasicForm from '@/views/FormFillPage/components/BasicForm.vue';

const props = defineProps({
	showRequired: {
		type: Boolean,
		default: true,
	},
	modelValue: {
		type: Object,
		default: () => ({}),
	},
});
const emits = defineEmits(['update:modelValue', 'EnterpriseSearch']);
// 使用 computed 实现双向绑定
const formData = computed<any>({
	get: () => props.modelValue,
	set: (value) => emits('update:modelValue', value),
});

const problemFormRef = ref();
const solutionFormRef = ref();
const infoFormRef = ref();

const pointsFormRef = ref<any>();
const recordFormRef = ref<any>();

const staColumns = [
	{
		prop: 'exchangeGift',
		label: '是否交换礼品',
		type: '',
		placeholder: '',
		slot: 'gift',
		required: true,
		isRequired: true,
	},
];

const filteredStaColumns = computed(() =>
	props.showRequired ? staColumns : staColumns.filter((item) => item.isRequired)
);

const staColumns1 = [
	{
		prop: 'weGift',
		label: '我方赠与礼品',
		type: 'text',
	},
	{
		prop: 'weReceiveGift',
		label: '我方接受礼品',
		type: 'text',
	},
];

const filteredStaColumns1 = computed(() =>
	props.showRequired ? staColumns1 : staColumns1.filter((item: any) => item.isRequired)
);

const infoColumns = [
	{
		prop: 'reportTime',
		label: '填报时间',
		isRequired: false,
		placeholder: '选择填报时间',
		format: 'YYYY-MM-DD HH:mm:ss',
		valueFormat: 'YYYY-MM-DD HH:mm:ss',
		type: 'date',
		dateType: 'datetime',
	},
	{
		prop: 'reporterUnit',
		label: '填报单位',
		type: 'text',
		isRequired: false,
		placeholder: '填写填报单位',
	},
	{
		prop: 'reporterName',
		label: '填报人',
		type: 'text',
		isRequired: false,
		placeholder: '填写填报人姓名',
	},
	{
		prop: 'reporterPhone',
		label: '联系方式',
		type: 'text',
		isRequired: false,
		placeholder: '填写联系电话',
	},
];

const filteredInfoColumns = computed(() =>
	props.showRequired ? infoColumns : infoColumns.filter((item) => item.isRequired)
);

const problemRules = computed(() => handleRules(filteredStaColumns.value));
const solutionRules = computed(() => handleRules(filteredStaColumns1.value));
const infoRules = computed(() => handleRules(filteredInfoColumns.value)); // 使用过滤后的infoColumns生成规则

const handelOK = async () => {
	try {
		console.log('礼品表单数据:', formData.value);
		const [problemValid, solutionValid, infoValid, pointsValid, recordValid] =
			await Promise.all([
				problemFormRef.value?.validateForm(),
				solutionFormRef.value?.validateForm(),
				infoFormRef.value?.validateForm(),
				pointsFormRef.value?.validate(),
				recordFormRef.value?.validate(),
			]);

		if (problemValid && solutionValid && infoValid && pointsValid && recordValid) {
			return true; // Return true when all validations pass
		}
		return true; // Return false when any validation fails
	} catch (error) {
		console.error('表单校验出错:', error);
		return true; // Return false when there's an error
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
.update {
	display: flex;
	justify-content: space-between;
	.form-section {
		margin-bottom: 0.3rem;

		.section-header {
			margin-bottom: 0.1rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.section-title {
				color: #fff;
				font-size: 0.16rem;
				font-weight: 500;
			}

			.section-actions {
				display: flex;
				gap: 0.1rem;
			}
		}
	}
}
</style>
