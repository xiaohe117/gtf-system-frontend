<template>
	<div class="contact-record-form">
		<div class="form-container">
			<FormHeader
				v-model="showOptionalFields"
				title="编辑工作记录"
				tip="记录面向企业的招商工作，记录包括会见、拜访等企业的关的工作"
			/>

			<!-- 锚点导航 -->
			<div class="anchor-navigation">
				<template v-for="(anchor, index) in anchors" :key="anchor.id">
					<div
						class="nav-step"
						:class="{ active: currentStep >= index + 1 }"
						@click="scrollToAnchor(anchor.id)"
					>
						<div class="step-circle"></div>
						<div class="step-text">{{ index + 1 }}.{{ anchor.text }}</div>
					</div>
					<div class="nav-line" v-if="index < anchors.length - 1"></div>
				</template>
			</div>

			<div class="form-item-container" ref="scrollContainer">
				<!-- 基本情况 -->
				<div class="form-section" id="basic-info">
					<div class="section-header">
						<SmallTitle title="基本情况" />
					</div>
					<el-form
						ref="basicInfoFormRef"
						:model="form.basicInfo"
						:rules="basicInfoRules"
						label-width="145px"
					>
						<div class="form-grid">
							<el-form-item label="工作类型" prop="activityType" class="required">
								<el-radio-group v-model="form.basicInfo.activityType">
									<el-radio value="1">拜访</el-radio>
									<el-radio value="2">来访</el-radio>
									<el-radio value="3">重大活动</el-radio>
								</el-radio-group>
								<el-input
									v-if="form.basicInfo.activityType === '3'"
									v-model="form.basicInfo.activityTypeAdd"
									placeholder="描述活动类型"
									style="width: 140px; margin-left: 10px"
								/>
							</el-form-item>
							<el-form-item label="工作形式" prop="activityForm" class="required">
								<el-radio-group
									v-model="form.basicInfo.activityForm"
									@change="handleWorkFormChange"
								>
									<el-radio value="1">市内招商</el-radio>
									<el-radio value="2">市外招商（境内）</el-radio>
									<el-radio value="3">境外招商</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="日期" prop="startTime" class="required">
								<el-date-picker
									v-model="form.basicInfo.startTime"
									type="date"
									placeholder="选择日期"
									format="YYYY/MM/DD"
									value-format="YYYY-MM-DD"
								/>
							</el-form-item>
							<el-form-item
								label="地点"
								prop="activityLocationCountryName"
								class="required"
							>
								<div class="location-input-group">
									<el-cascader
										v-if="form.basicInfo.activityForm !== '3'"
										v-model="locationValue"
										:options="regionData"
										placeholder="选择省/市/区"
										filterable
										clearable
										@change="handleLocationChange"
										style="width: 200px"
									/>
									<el-input
										v-model="form.basicInfo.activityLocationDetailedAddress"
										:placeholder="
											form.basicInfo.activityForm === '3'
												? '输入详细地址（国外）'
												: '输入详细地址'
										"
										style="width: 200px; flex: 1"
									/>
								</div>
							</el-form-item>
						</div>
						<el-form-item
							v-if="showOptionalFields"
							label="工作简介"
							prop="activityIntro"
						>
							<el-input
								v-model="form.basicInfo.activityIntro"
								type="textarea"
								:rows="4"
								placeholder="请简要介绍此次招商对接的内容、目标等。"
							/>
						</el-form-item>
					</el-form>
				</div>

				<!-- 企业信息 ---->
				<div class="form-section">
					<div class="section-header">
						<SmallTitle title="企业信息" />
					</div>
					<el-form
						ref="enterpriseInfoFormRef"
						:model="form.enterpriseInfo"
						:rules="enterpriseInfoRules"
						label-width="145px"
					>
						<div class="form-grid">
							<el-form-item label="企业名称：" prop="enterpriseName" class="required">
								<div class="name-box" @click="selectFunc('formData')">
									<el-input
										v-model="form.enterpriseInfo.enterpriseName"
										placeholder="请输入企业名称"
										readonly
										style="width: 300px"
									/>
									<el-button type="primary">选择</el-button>
								</div>
							</el-form-item>
							<el-form-item
								label="信用代码："
								prop="enterpriseSccode"
								class="required"
							>
								<el-input
									v-model="form.enterpriseInfo.enterpriseSccode"
									placeholder="请输入信用代码"
									disabled
								/>
							</el-form-item>
						</div>
						<div class="form-grid">
							<el-form-item
								label="机构类型："
								v-if="showOptionalFields"
								prop="enterpriseType"
							>
								<el-input
									v-model="form.enterpriseInfo.enterpriseType"
									placeholder="请输入机构类型"
									disabled
								/>
							</el-form-item>
							<el-form-item
								label="注册地址："
								v-if="showOptionalFields"
								prop="enterpriseAddress"
							>
								<el-input
									v-model="form.enterpriseInfo.enterpriseAddress"
									placeholder="请输入注册地址"
									disabled
								/>
							</el-form-item>
						</div>
					</el-form>
				</div>

				<!-- 与会政府单位 -->
				<div class="form-section">
					<div class="section-header">
						<SmallTitle title="与会政府单位" />
						<el-button type="primary" :icon="Plus" @click="addGovernmentUnit"
							>添加</el-button
						>
					</div>
					<el-form
						ref="governmentUnitsFormRef"
						:model="form"
						:rules="governmentUnitsRules"
						label-width="145px"
					>
						<div v-if="form.governmentUnits.length === 0" class="empty-placeholder">
							暂无政府单位，请点击"添加"按钮添加
						</div>

						<div
							v-for="(unit, index) in form.governmentUnits"
							:key="unit.id"
							class="unit-item"
						>
							<div class="unit-header">
								<div class="unit-actions">
									<el-button
										text
										@click="deleteGovernmentUnit(index)"
										class="delete-btn"
										>删除</el-button
									>
								</div>
							</div>
							<div class="form-grid">
								<el-form-item
									:label="`单位${index + 1}`"
									:prop="`governmentUnits.${index}.companyName`"
									class="required"
								>
									<el-input
										v-model="unit.companyName"
										placeholder="请输入机构名称"
									/>
								</el-form-item>
								<el-form-item
									:label="`出席人数`"
									:prop="`governmentUnits.${index}.attendance`"
									class="required"
								>
									<el-input-number
										v-model="unit.attendance"
										:min="1"
										placeholder="请输入人员数量"
									/>
								</el-form-item>
							</div>
							<el-form-item
								v-if="showOptionalFields"
								label="参会人员"
								:prop="`governmentUnits.${index}.govLeaderList`"
							>
								<div class="participants-section">
									<div
										v-for="(participant, pIndex) in unit.govLeaderList"
										:key="participant.id"
										class="participant-item"
									>
										<div class="participant-row">
											<el-input
												v-model="participant.name"
												placeholder="请输入人员姓名"
												style="width: 150px; margin-right: 10px"
											/>
											<div class="person-type-group">
												<span class="person-type-label">人员类型：</span>
												<el-radio-group
													v-model="participant.type"
													size="small"
													style="margin-right: 10px"
												>
													<el-radio value="1">市领导</el-radio>
													<el-radio value="2">区领导</el-radio>
													<el-radio value="3">单位领导</el-radio>
												</el-radio-group>
												<el-button
													text
													@click="removeParticipant(unit, pIndex)"
													class="delete-btn"
													icon="Delete"
													:disabled="unit.govLeaderList.length <= 1"
													title="删除参会人员"
													size="small"
												>
													删除参会人员
												</el-button>
												<el-button
													type="primary"
													size="small"
													@click="addParticipant(unit)"
													style="margin-left: 10px"
												>
													增加人员
												</el-button>
											</div>
										</div>
									</div>
								</div>
							</el-form-item>
						</div>
					</el-form>
				</div>

				<!-- 与会企业 -->
				<div class="form-section">
					<div class="section-header">
						<SmallTitle title="与会企业" />
						<el-button type="primary" :icon="Plus" @click="addEnterprise"
							>添加</el-button
						>
					</div>
					<el-form
						ref="enterprisesFormRef"
						:model="form"
						:rules="enterprisesRules"
						label-width="145px"
					>
						<div v-if="form.enterprises.length === 0" class="empty-placeholder">
							暂无企业，请点击"添加"按钮添加
						</div>

						<div
							v-for="(enterprise, index) in form.enterprises"
							:key="enterprise.id"
							class="unit-item"
						>
							<div class="unit-header">
								<div class="unit-actions">
									<el-button
										text
										@click="deleteEnterprise(index)"
										class="delete-btn"
										>删除</el-button
									>
								</div>
							</div>
							<div class="form-grid">
								<el-form-item
									:label="`企业${index + 1}`"
									:prop="`enterprises.${index}.companyName`"
									class="required"
								>
									<div class="name-box" @click="selectFunc(`${index}`)">
										<el-input
											style="width: 300px"
											v-model="enterprise.companyName"
											placeholder="请输入企业名称"
											readonly
										/>
										<el-button type="primary">选择</el-button>
									</div>
								</el-form-item>
								<el-form-item
									:label="`出席人数`"
									:prop="`enterprises.${index}.attendance`"
									class="required"
								>
									<el-input-number
										v-model="enterprise.attendance"
										:min="1"
										placeholder="请输入人员数量"
									/>
								</el-form-item>
							</div>
							<el-form-item
								v-if="showOptionalFields"
								label="参会人员"
								:prop="`enterprises.${index}.govLeaderList`"
							>
								<div class="participants-section">
									<div
										v-for="(participant, pIndex) in enterprise.govLeaderList"
										:key="participant.id"
										class="participant-item"
									>
										<div class="enterprise-participant-row">
											<el-input
												v-model="participant.name"
												placeholder="请输入人员姓名"
												style="width: 150px; margin-right: 10px"
											/>
											<el-button
												text
												@click="removeParticipant(enterprise, pIndex)"
												class="delete-btn"
												icon="Delete"
												:disabled="enterprise.govLeaderList.length <= 1"
												title="删除参会人员"
												size="small"
											>
												删除参会人员
											</el-button>
											<el-button
												type="primary"
												size="small"
												@click="addParticipant(enterprise)"
												style="margin-left: 10px"
											>
												增加人员
											</el-button>
										</div>
									</div>
								</div>
							</el-form-item>
						</div>
					</el-form>
				</div>

				<!-- 对接方案 -->
				<div class="form-section" v-if="showOptionalFields" id="preparation-info">
					<div class="section-header">
						<SmallTitle title="对接方案" />
					</div>
					<div class="file-upload-item">
						<el-form
							ref="preparationFormRef"
							:model="form.preparationInfo"
							label-width="auto"
							label-position="top"
							class="form"
							><el-form-item label="" style="width: 10rem">
								<Upload
									v-model="form.preparationInfo.activityTalkFileList"
									class="upload"
									:accept="'.rar,.zip,.doc,.docx,.pdf'"
								></Upload>
							</el-form-item>
						</el-form>
					</div>
				</div>

				<!-- 参阅材料 -->
				<div class="form-section" v-if="showOptionalFields">
					<div class="section-header">
						<SmallTitle title="参阅材料" />
					</div>
					<div class="file-upload-item">
						<el-form
							ref="preparationFormRef"
							:model="form.preparationInfo"
							label-width="auto"
							label-position="top"
							class="form"
							><el-form-item label="" style="width: 10rem">
								<Upload
									v-model="form.preparationInfo.activitySchemeFileList"
									class="upload"
									:accept="'.rar,.zip,.doc,.docx,.pdf'"
								></Upload>
							</el-form-item>
						</el-form>
					</div>
				</div>

				<!-- 礼品交换 -->
				<div class="form-section" id="process-info">
					<div class="section-header">
						<SmallTitle title="礼品交换" />
					</div>
					<el-form
						ref="giftExchangeFormRef"
						:model="form.giftExchange"
						:rules="giftExchangeRules"
						label-width="150px"
					>
						<div class="form-grid">
							<el-form-item label="是否交换礼品" prop="exchangeGift" class="required">
								<el-radio-group v-model="form.giftExchange.exchangeGift">
									<el-radio value="true">是</el-radio>
									<el-radio value="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</div>
						<div
							v-if="form.giftExchange.exchangeGift === 'true' && showOptionalFields"
							class="form-grid"
						>
							<el-form-item label="我方赠与礼品">
								<el-input
									v-model="form.giftExchange.weGift"
									placeholder="描述礼品内容"
								/>
							</el-form-item>
							<el-form-item label="我方接受礼品">
								<el-input
									v-model="form.giftExchange.weReceiveGift"
									placeholder="描述礼品内容"
								/>
							</el-form-item>
						</div>
					</el-form>
				</div>

				<!-- 要点记录 -->
				<div class="form-section" v-if="showOptionalFields">
					<div class="section-header">
						<SmallTitle title="要点记录" />
					</div>
					<div class="file-upload-item">
						<el-form
							ref="preparationFormRef"
							:model="form.preparationInfo"
							label-width="auto"
							label-position="top"
							class="form"
							><el-form-item label="" style="width: 10rem">
								<Upload
									v-model="form.preparationInfo.processRecordFileList"
									class="upload"
									:accept="'.rar,.zip,.doc,.docx,.pdf'"
								></Upload>
							</el-form-item>
						</el-form>
					</div>
				</div>

				<!-- 录音材料 -->
				<div class="form-section" v-if="showOptionalFields">
					<div class="section-header">
						<SmallTitle title="录音材料" />
					</div>
					<div class="file-upload-item">
						<el-form
							ref="preparationFormRef"
							:model="form.preparationInfo"
							label-width="auto"
							label-position="top"
							class="form"
							><el-form-item label="" style="width: 10rem">
								<Upload
									v-model="form.preparationInfo.recordMaterialFileList"
									class="upload"
									:accept="'.mp3,.mp4,.m4a'"
								></Upload>
							</el-form-item>
						</el-form>
					</div>
				</div>

				<!-- 工作总结 -->
				<div class="form-section" id="summary-info">
					<div class="section-header">
						<SmallTitle title="工作总结" />
						<!-- <div class="section-actions">
							<el-button type="primary" size="small">新建线索</el-button>
							<el-button type="default" size="small">反馈问题</el-button>
						</div> -->
					</div>
					<el-form
						ref="workSummaryFormRef"
						:model="form.workSummary"
						:rules="workSummaryRules"
						label-width="145px"
					>
						<el-form-item label="对接总结：" prop="dockSummary" class="required">
							<el-input
								v-model="form.workSummary.dockSummary"
								type="textarea"
								:rows="6"
								placeholder="详细描述工作对接情况"
							/>
						</el-form-item>
					</el-form>
				</div>

				<!-- 对接评价 -->
				<div class="form-section">
					<div class="section-header">
						<SmallTitle title="对接评价" />
					</div>
					<el-form
						ref="evaluationFormRef"
						:model="form.evaluation"
						:rules="evaluationRules"
						label-width="145px"
					>
						<el-form-item label="企业意向" prop="enterpriseIntention" class="required">
							<div class="rating-section">
								<el-rate
									v-model="form.evaluation.enterpriseIntention"
									:max="5"
									show-text
									:texts="['极低', '低', '一般', '高', '非常高']"
									text-color="#ff9900"
								/>
							</div>
						</el-form-item>
						<el-form-item
							label="下一步工作建议："
							prop="supplementSuggestion"
							class="required"
						>
							<el-input
								v-model="form.evaluation.supplementSuggestion"
								type="textarea"
								:rows="4"
								placeholder="详细描述下一步对接情况"
							/>
						</el-form-item>
					</el-form>
				</div>

				<!-- 填报信息 -->
				<div class="form-section" v-if="showOptionalFields">
					<div class="section-header">
						<SmallTitle title="填报信息" />
					</div>
					<el-form ref="reportInfoFormRef" :model="form.reportInfo" label-width="145px">
						<div class="form-grid">
							<el-form-item
								label="填报时间："
								v-if="showOptionalFields"
								prop="reportTime"
							>
								<el-date-picker
									v-model="form.reportInfo.reportTime"
									type="datetime"
									placeholder="选择填报时间"
									format="YYYY年M月D日 HH:mm"
									value-format="YYYY-MM-DD HH:mm:ss"
									style="width: 100%"
								/>
							</el-form-item>
							<el-form-item
								label="填报单位："
								v-if="showOptionalFields"
								prop="reporterUnit"
							>
								<el-input
									v-model="form.reportInfo.reporterUnit"
									placeholder="填写填报单位"
								/>
							</el-form-item>
						</div>
						<div class="form-grid">
							<el-form-item
								label="填报人："
								v-if="showOptionalFields"
								prop="reporterName"
							>
								<el-input
									v-model="form.reportInfo.reporterName"
									placeholder="填写填报人姓名"
								/>
							</el-form-item>
							<el-form-item
								label="联系方式："
								v-if="showOptionalFields"
								prop="reporterPhone"
							>
								<el-input
									v-model="form.reportInfo.reporterPhone"
									placeholder="填写联系电话"
								/>
							</el-form-item>
						</div>
					</el-form>
				</div>
			</div>

			<!-- 提交按钮 -->
			<div class="form-actions">
				<el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
			</div>
		</div>
		<SearchDialog ref="searchRef" @handleClickEnterprise="confirmSelect" />
	</div>
</template>

<script setup lang="ts">
import Upload from '@/components/Upload/Index.vue';
import { Plus } from '@element-plus/icons-vue';
import SearchDialog from '@/views/RunByEnterprise/Left/dialog/SearchDialog.vue';
import { ElMessage } from 'element-plus';
import { regionData } from 'element-china-area-data';
import { recordSave } from '@/api/formFillPage/index';
import FormHeader from './FormHeader.vue';

const anchors = ref([
	{ id: 'basic-info', text: '基础信息' },
	{ id: 'preparation-info', text: '准备信息' },
	{ id: 'process-info', text: '过程信息' },
	{ id: 'summary-info', text: '总结信息' },
]);

const emits = defineEmits(['close']);

const loading = ref(false);

const currentStep = ref<number>(1);

// 各模块的表单引用
const basicInfoFormRef = ref<any>();
const enterpriseInfoFormRef = ref<any>();
const governmentUnitsFormRef = ref<any>();
const enterprisesFormRef = ref<any>();
const preparationFormRef = ref<any>();
const giftExchangeFormRef = ref<any>();
const keyPointsFormRef = ref<any>();
const workSummaryFormRef = ref<any>();
const evaluationFormRef = ref<any>();
const reportInfoFormRef = ref<any>();

// 表单数据
const form = reactive<any>({
	basicInfo: {
		activityType: '',
		startTime: '',
		activityForm: '',
		activityLocationCountryName: '',
		activityLocationProvinceName: '',
		activityLocationCityName: '',
		activityLocationDetailedAddress: '',
		activityIntro: '',
		activityTypeAdd: '',
	},
	enterpriseInfo: {
		enterpriseName: '',
		enterpriseSccode: '',
		enterpriseType: '',
		enterpriseAddress: '',
	},
	governmentUnits: [
		{
			companyName: '',
			attendance: 1,
			govLeaderList: [
				{
					name: '',
					type: '',
				},
			],
		},
	],
	enterprises: [
		{
			companyName: '',
			attendance: 1,
			govLeaderList: [
				{
					name: '',
				},
			],
		},
	],
	preparationInfo: {
		activityTalkFileList: [],
		activitySchemeFileList: [],
		processRecordFileList: [],
		recordMaterialFileList: [],
	},
	giftExchange: {
		exchangeGift: '',
		weGift: '',
		weReceiveGift: '',
	},
	workSummary: {
		dockSummary: '',
	},
	evaluation: {
		enterpriseIntention: '',
		supplementSuggestion: '',
	},
	reportInfo: {
		reportTime: '',
		reporterUnit: '',
		reporterName: '',
		reporterPhone: '',
	},
});

// 地区选择值
const locationValue = ref<string[]>([]);

const showOptionalFields = ref<boolean>(true);

const basicInfoRules: any = {
	activityType: [{ required: true, message: '请选择工作类型', trigger: 'change' }],
	startTime: [{ required: true, message: '请选择日期', trigger: 'change' }],
	activityForm: [{ required: true, message: '请选择工作形式', trigger: 'change' }],
	activityLocationCountryName: [
		{
			required: true,
			message: '请选择省市区',
			trigger: 'change',
			// eslint-disable-next-line no-unused-vars
			validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
				if (form.basicInfo.activityForm === '3') {
					callback();
				} else if (!value) {
					callback(new Error('请选择省市区'));
				} else {
					callback();
				}
			},
		},
	],
};

const enterpriseInfoRules: any = {
	enterpriseName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
};

const governmentUnitsRules: any = (() => {
	const rules: any = {};

	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < 20; i++) {
		rules[`governmentUnits.${i}.companyName`] = [
			{ required: true, message: '请输入机构名称', trigger: 'blur' },
		];
	}

	return rules;
})();

const enterprisesRules: any = (() => {
	const rules: any = {};

	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < 10; i++) {
		rules[`enterprises.${i}.companyName`] = [
			{ required: true, message: '请输入企业名称', trigger: 'blur' },
		];
	}

	return rules;
})();

const giftExchangeRules: any = {
	exchangeGift: [{ required: true, message: '请选择是否交换礼品', trigger: 'change' }],
};

const workSummaryRules: any = {
	dockSummary: [{ required: true, message: '请填写工作总结', trigger: 'blur' }],
};

const evaluationRules: any = {
	enterpriseIntention: [{ required: true, message: '请对企业意向进行评价', trigger: 'change' }],
	supplementSuggestion: [{ required: true, message: '请填写下一步工作建议', trigger: 'blur' }],
};

// 处理地区选择变化
const handleLocationChange = (value: string[]) => {
	if (value && value.length === 3) {
		const province = regionData.find((p: any) => p.value === value[0]);
		const city = province?.children?.find((c: any) => c.value === value[1]);
		const district = city?.children?.find((d: any) => d.value === value[2]);

		form.basicInfo.activityLocationCountryName = province?.label || '';
		form.basicInfo.activityLocationProvinceName = city?.label || '';
		form.basicInfo.activityLocationCityName = district?.label || '';
	} else if (!value || value.length === 0) {
		form.basicInfo.activityLocationCountryName = '';
		form.basicInfo.activityLocationProvinceName = '';
		form.basicInfo.activityLocationCityName = '';
	}
};

// 监听工作形式变化，当选择境外招商时清空省市区数据
const handleWorkFormChange = () => {
	if (form.basicInfo.activityForm === '3') {
		// 清空省市区选择
		locationValue.value = [];
		form.basicInfo.activityLocationCountryName = '';
		form.basicInfo.activityLocationProvinceName = '';
		form.basicInfo.activityLocationCityName = '';
	}
};

// 添加政府单位
const addGovernmentUnit = () => {
	const newUnit: any = {
		companyName: '',
		attendance: 1,
		govLeaderList: [
			{
				name: '',
				type: '',
			},
		],
	};
	form.governmentUnits.push(newUnit);
};

// 删除政府单位
const deleteGovernmentUnit = (index: number) => {
	form.governmentUnits.splice(index, 1);
};

// 添加企业
const addEnterprise = () => {
	const newEnterprise: any = {
		companyName: '',
		attendance: 1,
		govLeaderList: [
			{
				name: '',
			},
		],
	};
	form.enterprises.push(newEnterprise);
};

// 删除企业
const deleteEnterprise = (index: number) => {
	form.enterprises.splice(index, 1);
};

// 添加参会人员
const addParticipant = (unit: any) => {
	if ('companyName' in unit) {
		// 政府单位参与者
		const newParticipant: any = {
			name: '',
			type: '',
		};
		unit.govLeaderList.push(newParticipant);
	} else {
		// 企业参与者
		const newParticipant: any = {
			name: '',
		};
		unit.govLeaderList.push(newParticipant);
	}
};

// 删除参会人员
const removeParticipant = (unit: any, index: number) => {
	if (unit.govLeaderList.length <= 1) {
		ElMessage.warning('至少需要保留一个参会人员');
		return;
	}
	unit.govLeaderList.splice(index, 1);
};

// 过滤表单数据，移除非必填项
const filterFormData = (formData: any) => {
	const filteredData = JSON.parse(JSON.stringify(formData)) as any;

	if (!showOptionalFields.value) {
		// 移除基本信息中的工作简介
		delete (filteredData.basicInfo as Record<string, unknown>).activityIntro;

		// 移除政府单位参会人员信息
		filteredData.governmentUnits.forEach((unit: any) => {
			delete (unit as Record<string, unknown>).govLeaderList;
		});

		// 移除企业参会人员信息
		filteredData.enterprises.forEach((enterprise: any) => {
			delete (enterprise as Record<string, unknown>).govLeaderList;
		});

		// 移除礼品交换的详细信息
		if (filteredData.giftExchange.exchangeGift === 'true') {
			delete (filteredData.giftExchange as Record<string, unknown>).weGift;
			delete (filteredData.giftExchange as Record<string, unknown>).weReceiveGift;
		}

		// 移除填报信息
		delete (filteredData.reportInfo as Record<string, unknown>).reportTime;
		delete (filteredData.reportInfo as Record<string, unknown>).reporterUnit;
		delete (filteredData.reportInfo as Record<string, unknown>).reporterName;
		delete (filteredData.reportInfo as Record<string, unknown>).reporterPhone;
	}

	return filteredData;
};

// 提交表单
const submitForm = async () => {
	// 收集所有表单引用
	const formRefs = [
		basicInfoFormRef.value,
		enterpriseInfoFormRef.value,
		governmentUnitsFormRef.value,
		enterprisesFormRef.value,
		giftExchangeFormRef.value,
		keyPointsFormRef.value,
		workSummaryFormRef.value,
		evaluationFormRef.value,
		reportInfoFormRef.value,
	];

	try {
		// 验证所有表单
		const validationPromises = formRefs
			.filter((ref) => ref) // 过滤掉未定义的引用
			.map((ref) => ref.validate());

		const results = await Promise.all(validationPromises);

		// 过滤表单数据，移除非必填项（如果隐藏了非必填项）
		const submitData = filterFormData(form);

		if (results.every((result) => result === true)) {
			const params = {
				sccode: form.enterpriseInfo.enterpriseSccode,
				gtfActivityBasicInfoDTO: {
					...submitData.basicInfo,
					andCanGovernmentUnitList: submitData.governmentUnits,
					andCanCompanyList: submitData.enterprises,
				},
				gtfActivityPreparationInfoDTO: {
					activityTalkFileList: submitData.preparationInfo.activityTalkFileList,
					activitySchemeFileList: submitData.preparationInfo.activitySchemeFileList,
				},
				gtfActivityProcessRecordDTO: {
					exchangeGift: submitData.giftExchange.exchangeGift === 'true',
					weGift: submitData.giftExchange.weGift,
					weReceiveGift: submitData.giftExchange.weReceiveGift,
					processRecordFileList: submitData.preparationInfo.processRecordFileList,
					recordMaterialFileList: submitData.preparationInfo.recordMaterialFileList,
				},
				gtfAttractInvestmentWorkSummaryDTO: {
					...submitData.workSummary,
					...submitData.evaluation,
					gtfActivityRelatedParty: { ...submitData.reportInfo },
				},
			};

			// eslint-disable-next-line no-console
			console.log('params:', params);

			loading.value = true;
			const res = await recordSave(params);
			if (res.code === 0) {
				ElMessage.success('添加成功！');
				emits('close');
				loading.value = false;
			}
		}

		/*
		console.log('提交的表单数据:', submitData);
		console.log('显示非必填项:', showOptionalFields.value);
		*/
	} catch (error) {
		ElMessage.error('请检查表单信息');
	}
};

const searchRef = ref();
const selectType = ref('');
const selectFunc = (type: string) => {
	selectType.value = type;
	searchRef.value.show();
};
const confirmSelect = (item: any) => {
	if (selectType.value === 'formData') {
		form.enterpriseInfo.enterpriseName = item.companyName;
		form.enterpriseInfo.enterpriseSccode = item.sccode;
		form.enterpriseInfo.enterpriseType = item.enterpriseType;
		form.enterpriseInfo.enterpriseAddress = item.registeredAddress;
	} else {
		form.enterprises[Number(selectType.value)].companyName = item.companyName;
	}
};

const scrollContainer = ref<HTMLElement | null>(null);
// 锚点跳转功能
const scrollToAnchor = (anchorId: string) => {
	const sectionElement = document.getElementById(anchorId);
	const container = scrollContainer.value;

	if (anchorId === 'basic-info') {
		currentStep.value = 1;
	} else if (anchorId === 'preparation-info') {
		currentStep.value = 2;
	} else if (anchorId === 'process-info') {
		currentStep.value = 3;
	} else if (anchorId === 'summary-info') {
		currentStep.value = 4;
	}

	if (sectionElement && container) {
		// 计算元素相对于容器的位置
		const containerRect = container.getBoundingClientRect();
		const elementRect = sectionElement.getBoundingClientRect();
		const offset = elementRect.top - containerRect.top + container.scrollTop;

		// 平滑滚动到指定位置
		container.scrollTo({
			top: offset,
			behavior: 'smooth',
		});
	}
};

const handleScroll = () => {
	if (!scrollContainer.value) return;

	const container = scrollContainer.value;
	const scrollPosition = container.scrollTop + container.offsetTop;

	// eslint-disable-next-line no-plusplus
	for (let i = anchors.value.length - 1; i >= 0; i--) {
		const anchor = anchors.value[i];
		const element = document.getElementById(anchor.id);
		if (element) {
			const elementTop = element.offsetTop;
			const anchorId = anchor.id;
			if (scrollPosition >= elementTop) {
				if (anchorId === 'basic-info') {
					currentStep.value = 1;
				} else if (anchorId === 'preparation-info') {
					currentStep.value = 2;
				} else if (anchorId === 'process-info') {
					currentStep.value = 3;
				} else if (anchorId === 'summary-info') {
					currentStep.value = 4;
				}
				break;
			}
		}
	}
};

onMounted(() => {
	if (scrollContainer.value) {
		scrollContainer.value.addEventListener('scroll', handleScroll);
	}
});

onUnmounted(() => {
	if (scrollContainer.value) {
		scrollContainer.value.removeEventListener('scroll', handleScroll);
	}
});
</script>

<style scoped lang="less">
.contact-record-form {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
}

.form-container {
	background: #fff;
	border-radius: 4px;
}

.form-control-section {
	background-image: url('@/assets/images/ActivityFillingPage/top_logo.png');
	background-repeat: no-repeat;
	background-size: 100% 100%;
	border: 1px solid #e9ecef;
	border-radius: 4px;
	padding: 15px 20px;
	margin-bottom: 20px;

	.control-item {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.control-label {
			font-size: 14px;
			font-weight: 500;
			color: #303133;
			margin-right: 15px;
		}
	}
}

.form-section {
	margin-bottom: 30px;

	.section-header {
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.section-title {
			color: #fff;
			font-size: 16px;
			font-weight: 500;
		}

		.section-actions {
			display: flex;
			gap: 10px;
		}
	}
}

.form-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	align-items: start;

	.el-form-item {
		width: 100%;
	}
}

.location-input-group {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.empty-placeholder {
	text-align: center;
	color: #999;
	padding: 40px 0;
	border: 1px dashed #ddd;
	border-radius: 4px;
	margin-bottom: 20px;
}

.unit-item {
	padding: 20px;
	margin-bottom: 20px;
	background: rgba(22, 93, 255, 0.05);
	border-radius: 8px 0px 0px 8px;

	.unit-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 20px;
		border-bottom: 1px solid #f0f0f0;
		padding-bottom: 10px;

		.unit-actions {
			display: flex;
			gap: 10px;
		}
	}
}

.participants-section {
	.participant-item {
		margin-bottom: 15px;

		.participant-row {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 10px;
		}

		.enterprise-participant-row {
			display: flex;
			align-items: center;
			gap: 10px;
			flex-wrap: wrap;
		}

		.person-type-group {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 10px;
			flex: 1;

			.person-type-label {
				font-size: 14px;
				color: #606266;
				white-space: nowrap;
			}

			.el-radio-group {
				flex: 1;
				min-width: 260px;
			}

			.el-button {
				white-space: nowrap;
			}
		}
	}
}

.required {
	:deep(.el-form-item__label) {
		position: relative;

		&::before {
			content: '*';
			color: #f56c6c;
			margin-right: 4px;
		}
	}
}

.delete-btn {
	color: #f56c6c !important;

	&:hover:not(:disabled) {
		color: #f78989 !important;
	}

	&:disabled {
		color: #c0c4cc !important;
		cursor: not-allowed;
	}
}

.form-actions {
	text-align: center;
	margin-top: 30px;

	.el-button {
		margin: 0 10px;
		padding: 10px 30px;
	}
}

:deep(.el-form-item__label) {
	padding: 0 56px 0 0;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	font-size: 0.18rem;
	color: rgba(0, 0, 0, 0.85);
}

:deep(.el-input__wrapper) {
	box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-textarea__inner) {
	box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.rating-section {
	:deep(.el-rate) {
		line-height: 1;
	}

	:deep(.el-rate__text) {
		margin-left: 10px;
		font-size: 14px;
		color: #606266;
	}
}
.form-item-container {
	height: 5.2rem;
	background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
	box-shadow: 0rem 0rem 0.08rem 0rem rgba(25, 43, 138, 0.34);
	border-radius: 0.14rem;
	border-image: linear-gradient(180deg, #eef2ff, #a2c4ff) 2 2;
	backdrop-filter: blur(0.04rem);
	padding: 0.24rem;
	overflow: auto;
}
.name-box {
	display: flex;
	button {
		margin-left: 0.24rem;
	}
}

.anchor-navigation {
	background: #ffffff;
	padding: 24px;
	margin-bottom: 24px;
	display: flex;
	align-items: center;

	background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
	box-shadow: 0rem 0rem 0.08rem 0rem rgba(25, 43, 138, 0.34);
	border-radius: 0.14rem;
	border-image: linear-gradient(180deg, #eef2ff, #a2c4ff) 2 2;
	backdrop-filter: blur(0.04rem);

	.nav-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		transition: all 0.3s ease;
		width: 1.6rem;
		height: 1rem;

		&.active {
			.step-circle {
				position: relative;
				background-color: #e6f7ee;
				&::after {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 14px;
					height: 14px;
					background-color: #52c41a;
					border-radius: 50%;
				}
			}

			.step-text {
				color: #67c23a;
				font-weight: 600;
				background: rgba(23, 186, 127, 0.1);
				border-radius: 4px;
				width: 1.86rem;
				line-height: 0.4rem;
			}
		}

		.step-circle {
			position: relative;
			background-color: rgba(216, 216, 216, 0.36);
			width: 26px;
			height: 26px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 8px;
			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 14px;
				height: 14px;
				background-color: #d8d8d8;
				border-radius: 50%;
			}
		}

		.step-text {
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 500;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.85);
			transition: all 0.3s ease;
			text-align: center;
			line-height: 1.2;
		}
	}

	.nav-line {
		width: 200px;
		height: 2px;
		background: #e4e7ed;
		margin: -35px -47px 10px -47px;
	}

	.nav-step.active + .nav-line {
		background: #67c23a;
	}
}
</style>
