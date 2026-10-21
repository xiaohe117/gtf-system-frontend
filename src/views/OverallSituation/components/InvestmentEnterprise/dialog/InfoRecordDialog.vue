<template>
	<el-dialog
		v-model="dialogVisible"
		:append-to-body="true"
		class="fill-form-Dialog"
		width="19rem"
	>
		<div class="fill-page">
			<div class="left-box">
				<div class="list-box">
					<div
						class="list-item"
						v-for="(item, index) in listData"
						@click="handleClick(index, item)"
						:key="item.id"
						:class="['list-item', { 'list-item-active': index === activeIndex }]"
					>
						<div class="icon"></div>
						<div class="text">{{ item.text }}</div>
					</div>
				</div>
			</div>
			<div class="right-box">
				<FormHeader
					v-model="showRequired"
					title="工作跟进记录"
					tip="记录面向目标企业的招商工作。"
				/>
				<main ref="scrollContainer">
					<div id="basic-info">
						<base-info-form
							v-model="formData"
							ref="baseInfoRef"
							:showRequired="showRequired"
							@relatedProject="relatedProject"
							:relatedProjectData="relatedProjectData"
							@EnterpriseSearch="EnterpriseSearch"
							:enterpriseDate="enterpriseDate"
						/>
					</div>
					<div id="progress-info">
						<progress-info-form
							v-model="formData"
							:showRequired="showRequired"
							ref="progressInfoRef"
							@EnterpriseSearch="EnterpriseSearch"
							:enterpriseDate="enterpriseDate1"
						/>
					</div>
					<div id="problem-info">
						<problem-info-form
							v-model="formData"
							ref="problemInfoRef"
							:showRequired="showRequired"
						></problem-info-form>
					</div>
					<div id="other-info">
						<other-info-form
							v-model="formData"
							ref="otherInfoRef"
							:showRequired="showRequired"
						></other-info-form>
					</div>
				</main>
			</div>
		</div>
		<template #footer>
			<div class="footer">
				<el-button
					class="btn"
					:disabled="!formData.sccode"
					@click="handleSubmit('1')"
					:loading="saveLoading"
					>暂存</el-button
				>
				<el-button type="primary" @click="handleSubmit('0')" :loading="saveLoading"
					>提交</el-button
				>
			</div>
		</template>
	</el-dialog>
	<RelatedProjectDialog
		ref="relatedProjectDialogRef"
		@handle-click-project="handleSelectProject"
	/>
	<SearchDialog ref="searchRef" @handleClickEnterprise="confirmSelect" />
</template>

<script lang="ts" setup>
import { ref as vueRef } from 'vue';
import { ElMessage } from 'element-plus';
import { queryEnterpriseByParams } from '@/api/runByEnterprise/index';
import { useRoute } from 'vue-router';
import { regionData } from 'element-china-area-data';
import { authService } from '@/services/auth'; // 修改这一行
import FormHeader from '@/views/FormFillPage/components/FormHeader.vue';
import BaseInfoForm from '@/views/RunByEnterprise/components/InvestmentEnterprise/components/BaseInfoForm.vue';
import ProgressInfoForm from '@/views/RunByEnterprise/components/InvestmentEnterprise/components/ProgressInfoForm.vue';
import ProblemInfoForm from '@/views/RunByEnterprise/components/InvestmentEnterprise/components/ProblemInfoForm.vue';
import OtherInfoForm from '@/views/RunByEnterprise/components/InvestmentEnterprise/components/OtherInfoForm.vue';
import RelatedProjectDialog from '@/views/FormFillPage/components/RelatedProjectDialog.vue';
import SearchDialog from '@/views/RunByEnterprise/Left/dialog/SearchDialog.vue';
import { queryWorkRecordTempInfo, addWorkRecord } from '@/api/formFillPage';

const route = useRoute();
const dialogVisible = ref(false);
const showRequired = ref(true);
const formData = ref<any>({
	enterprises: [
		{
			companyName: '',
			attendance: 1,
			govLeaderList: [
				{
					name: '',
					duty: '',
				},
			],
		},
	],
});

const listData = ref([
	{
		id: 'basic-info',
		text: '基本信息',
	},
	{
		id: 'progress-info',
		text: '进展信息',
	},
	{
		id: 'problem-info',
		text: '问题信息',
	},
	{
		id: 'other-info',
		text: '其他信息',
	},
]);
const activeIndex = ref(0);
const saveLoading = ref(false);

const baseInfoRef = ref<any>(null);
const problemInfoRef = ref<any>(null);
const otherInfoRef = ref<any>(null);
const progressInfoRef = ref<any>(null);
// 获取当前日期
const getCurrentDate = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
	const day = String(now.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
};

// 判断所有附件是否都已经上传完成
const validateFileLists = (): boolean => {
	const fileLists = [
		formData.value.processRecordFileList,
		formData.value.recordMaterialFileList,
		formData.value.activitySchemeFileList,
		formData.value.activityTalkFileList,
	];

	const isValid = fileLists.every((list) => {
		if (!Array.isArray(list)) return true;
		return list.every((item) => item.id);
	});

	if (!isValid) {
		ElMessage.error('请等待文件上传完成后再操作！');
		return false;
	}

	return true;
};
// 提交

const handleSubmit = async (type: string) => {
	// 保存当前表单数据的快照
	const formDataSnapshot = JSON.parse(JSON.stringify(formData.value));
	console.log('提交前的表单数据快照:', formDataSnapshot);
	if (!validateFileLists()) {
		return;
	}
	if (type === '0') {
		console.log('校验前数据:', formData.value);
		// 表单提交前需要校验
		try {
			// 逐个执行校验，避免并发问题
			const result1 = await baseInfoRef.value?.handelOK();
			const result2 = await problemInfoRef.value?.handelOK();
			const result3 = await otherInfoRef.value?.handelOK();
			const result4 = await progressInfoRef.value?.handelOK();
			const allValid = result1 && result2 && result3 && result4;
			if (!allValid) {
				return;
			}
		} catch (error) {
			ElMessage.error('表单校验出错');
			// 恢复表单数据
			formData.value = formDataSnapshot;
			return;
		}
	}

	// 确保使用最新的表单数据
	console.log('11111888, 提交时的表单数据:', formData.value);

	// 如果 formData 在校验过程中被意外清空，则使用快照数据
	const submitData =
		formData.value && Object.keys(formData.value).length > 0
			? formData.value
			: formDataSnapshot;

	const params = {
		sccode: submitData.sccode, // 信用代码
		companyName: submitData.companyName, // 企业名称
		enterpriseType: submitData.enterpriseType, // 注册地址
		registeredAddress: submitData.registeredAddress, // 机构类型
		projectIdList: submitData.projectIdList, // 关联项目
		isTempSave: type,
		entInvestAdvice: {
			adviceContent: submitData.mainAdviceContent, // 建议内容(主攻方向)
			currentKey: submitData.focusAdviceContent, // 当期重点
		},
		gtfActivityBasicInfoDTO: {
			activityLocationCountryName: submitData.activityLocationCountryName,
			activityLocationProvinceName: submitData.activityLocationProvinceName,
			activityLocationCityName: submitData.activityLocationCityName,
			startTime: getCurrentDate(),
			activityScale: submitData.solutionForm?.mainAdviceContent, // 具体举措
			activityType: submitData.activityType, // 工作类型
			activityTypeAdd: submitData.activityTypeAdd,
			activityForm: submitData.activityForm, // 活动形式
			activityLocationDetailedAddress: submitData.activityLocationDetailedAddress, // 详情地址
			activityIntro: submitData.progressTitle, // 进展概要
			detailedProgress: submitData.detailedProgress, // 详细进展
			followDutyUnit: submitData.followDutyUnit, // 跟进责任单位
			dutyPerson: submitData.dutyPerson, // 责任人
			isWhether: submitData.isWhether, // 是否需要流转
			andCanGovernmentUnitList: submitData.governmentUnits || [], // 与会政府单位
			andCanCompanyList: submitData.enterprises || [], // 与会企业
		},
		gtfActivityPreparationInfoDTO: {
			activityTalkFileList: submitData.activityTalkFileList || [], // 对接方案
			activitySchemeFileList: submitData.activitySchemeFileList || [], // 参阅材料
		},
		// gtfInvestIssueFb: {
		// 	problemDescription: submitData.problemForm?.problemDescription, // 问题描述
		// 	problemType: submitData.problemForm?.problemType, // 问题类型
		// 	responsibleUnit: submitData.problemForm?.responsibleUnit, // 责任单位
		// 	responsiblePerson: submitData.problemForm?.responsiblePerson, // 责任人
		// 	problemStatus: submitData.problemForm?.problemStatus, // 问题状态
		// 	desiredTime: submitData.problemForm?.desiredTime, // 预期解决时间
		// 	realTime: submitData.problemForm?.realTime, // 实际解决时间
		// },
		gtfActivityProcessRecordDTO: {
			processRecordFileList: submitData.processRecordFileList || [],
			exchangeGift: submitData.exchangeGift || false, // 是否交换礼品
			weGift: submitData.weGift, // 我方赠品
			weReceiveGift: submitData.weReceiveGift, // 我方接收赠品
			recordMaterialFileList: submitData.recordMaterialFileList || [],
		},
		gtfActivityRelatedParty: {
			reporterUnit: submitData.reporterUnit, // 填报人单位
			reporterName: submitData.reporterName, // 填报人姓名
			reporterPhone: submitData.reporterPhone, // 填报人电话
			reportTime: submitData.reportTime, // 填报时间
		},
		// 议定事项
		gtfInvestAgreedMatters: submitData.gtfInvestAgreedMatters || [],
		// 问题反馈
		gtfInvestIssueFb: submitData.gtfInvestIssueFb || [],
	};

	console.log('提交参数:', params);
	saveLoading.value = true;

	addWorkRecord({ ...params })
		.then((res: any) => {
			ElMessage.success(`${res.data}!`);
			if (type === '0') {
				dialogVisible.value = false;
			}
			saveLoading.value = false;
		})
		.catch((err) => {
			saveLoading.value = false;
			ElMessage.error(`操作失败,${err.message}`);
		});
};
const handleSearch = () => {
	const params = {
		current: 1,
		size: 24,
		companyName: route.query.sccode,
	};
	queryEnterpriseByParams({ data: params }).then((res: any) => {
		if (res.code === 0) {
			console.log('查询回显接口没数据使用路由查询');
			formData.value.companyName = res.data.records[0].companyName;
			formData.value.sccode = res.data.records[0].sccode;
			formData.value.enterpriseType = res.data.records[0].enterpriseType;
			formData.value.registeredAddress = res.data.records[0].registeredAddress;
		}
	});
};
// 地点反显
const convertNamesToCodes = (provinceName: string, cityName: string, districtName?: string) => {
	if (!provinceName || !cityName) return undefined;

	const province = regionData.find((p) => p.label === provinceName);
	if (!province) return undefined;

	const city = province.children?.find((c) => c.label === cityName);
	if (!city) return undefined;

	if (districtName) {
		const district = city.children?.find((d) => d.label === districtName);
		if (district) {
			return [province.value, city.value, district.value];
		}
	}

	return [province.value, city.value];
};
// 获取用户信息
const handleUserInfo = () => {
	// 用户信息反显
	const userInfo: any = authService.getUserInfo(); // 直接从auth获取用户信息
	formData.value.reporterName = userInfo?.name;
	formData.value.reporterUnit = userInfo?.dept;
	formData.value.reporterPhone = userInfo?.phone;
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
};
// 查看详情
const handleWorkRecord = async (sccode: string) => {
	queryWorkRecordTempInfo({ sccode })
		.then((res: any) => {
			if (res.code === 0) {
				const data = res.data || [];
				formData.value = {
					// 企业基本信息
					sccode: data.sccode,
					companyName: data.companyName,
					enterpriseType: data.enterpriseType,
					registeredAddress: data.registeredAddress,
					projectIdList: data.projectIdList,
					isTempSave: data.isTempSave,

					// 投资建议
					mainAdviceContent: data.entInvestAdvice?.adviceContent,
					focusAdviceContent: data.entInvestAdvice?.currentKey,

					// 对接情况

					activityLocationCountryName:
						data.gtfActivityBasicInfoDTO?.activityLocationCountryName,
					activityLocationProvinceName:
						data.gtfActivityBasicInfoDTO?.activityLocationProvinceName,
					activityLocationCityName:
						data.gtfActivityBasicInfoDTO?.activityLocationCityName,
					activityType: data.gtfActivityBasicInfoDTO?.activityType,
					activityTypeAdd: data.gtfActivityBasicInfoDTO?.activityTypeAdd,
					activityForm: data.gtfActivityBasicInfoDTO?.activityForm,
					activityLocationDetailedAddress:
						data.gtfActivityBasicInfoDTO?.activityLocationDetailedAddress,
					activityIntro: data.gtfActivityBasicInfoDTO?.activityIntro,
					startTime: data.gtfActivityBasicInfoDTO?.startTime,
					endTime: data.gtfActivityBasicInfoDTO?.endTime,
					activityScale: data.gtfActivityBasicInfoDTO?.activityScale,
					detailedProgress: data.gtfActivityBasicInfoDTO?.detailedProgress,
					followDutyUnit: data.gtfActivityBasicInfoDTO?.followDutyUnit,
					dutyPerson: data.gtfActivityBasicInfoDTO?.dutyPerson,
					isWhether: data.gtfActivityBasicInfoDTO?.isWhether || true,

					// 与会政府单位
					governmentUnits: data.gtfActivityBasicInfoDTO?.andCanGovernmentUnitList,

					// 与会企业
					enterprises: data.gtfActivityBasicInfoDTO?.andCanCompanyList,

					// 准备材料
					activityTalkFileList: data.gtfActivityPreparationInfoDTO?.activityTalkFileList,
					activitySchemeFileList:
						data.gtfActivityPreparationInfoDTO?.activitySchemeFileList,

					// 过程记录
					processRecordFileList: data.gtfActivityProcessRecordDTO?.processRecordFileList,
					exchangeGift: data.gtfActivityProcessRecordDTO?.exchangeGift || false,
					weGift: data.gtfActivityProcessRecordDTO?.weGift,
					weReceiveGift: data.gtfActivityProcessRecordDTO?.weReceiveGift,
					recordMaterialFileList:
						data.gtfActivityProcessRecordDTO?.recordMaterialFileList,

					// 问题反馈
					problemDescription: data.gtfInvestIssueFb?.problemDescription,
					problemType: data.gtfInvestIssueFb?.problemType,
					responsibleUnit: data.gtfInvestIssueFb?.responsibleUnit,
					responsiblePerson: data.gtfInvestIssueFb?.responsiblePerson,
					problemStatus: data.gtfInvestIssueFb?.problemStatus,
					desiredTime: data.gtfInvestIssueFb?.desiredTime,
					realTime: data.gtfInvestIssueFb?.realTime,

					// 相关方信息
					// reporterUnit: data.gtfActivityRelatedParty?.reporterUnit,
					// reporterName: data.gtfActivityRelatedParty?.reporterName,
					// reporterPhone: data.gtfActivityRelatedParty?.reporterPhone,
					// reportTime: data.gtfActivityRelatedParty?.reportTime,

					// 表单专用字段（对应接口字段）
					progressTitle: data.gtfActivityBasicInfoDTO?.activityIntro, // activityIntro -> progressTitle
					problemForm: {
						problemDescription: data.gtfInvestIssueFb?.problemDescription,
						problemType: data.gtfInvestIssueFb?.problemType,
						responsibleUnit: data.gtfInvestIssueFb?.responsibleUnit,
						responsiblePerson: data.gtfInvestIssueFb?.responsiblePerson,
						problemStatus: data.gtfInvestIssueFb?.problemStatus,
						desiredTime: data.gtfInvestIssueFb?.desiredTime,
						realTime: data.gtfInvestIssueFb?.realTime,
					},
					solutionForm: {
						mainAdviceContent: data.gtfActivityBasicInfoDTO?.activityScale, // activityScale -> mainAdviceContent
					},
					// 议定事项
					gtfInvestAgreedMatters: data.gtfInvestAgreedMatters || [],
					// // 问题反馈
					gtfInvestIssueFb: data.gtfInvestIssueFb || [],
				};
				if (!data?.companyName && !data?.sccode && route.query.sccode) {
					// 查询回显接口没数据使用路由查询
					handleSearch();
				}
				// 地址反显
				const provinceName = data.gtfActivityBasicInfoDTO?.activityLocationCountryName;
				const cityName = data.gtfActivityBasicInfoDTO?.activityLocationProvinceName;
				const districtName = data.gtfActivityBasicInfoDTO?.activityLocationCityName; // 如果有区信息
				const codes = convertNamesToCodes(provinceName, cityName, districtName);
				if (codes) {
					formData.value.locationValue = codes;
				}
				if (!formData.value.enterprises || formData.value.enterprises.length === 0) {
					formData.value.enterprises = [
						{
							companyName: data?.companyName || '',
							attendance: 1,
							govLeaderList: [
								{
									name: '',
									duty: '',
								},
							],
						},
					];
				}
				handleUserInfo(); // 填报信息取用户的信息
			} else {
				formData.value = {};
			}
		})
		.catch(() => {
			formData.value = {};
		});
};

// 关联项目弹窗逻辑
const relatedProjectDialogRef = vueRef();
const relatedProjectData = ref();
const relatedProject = () => {
	relatedProjectDialogRef.value?.show();
};
const handleSelectProject = (project: any) => {
	relatedProjectData.value = project;
};
// 企业查找逻辑
const searchRef = ref();
const enterpriseDate = ref();
const enterpriseDate1 = ref();
const enterpriseType = ref();
const EnterpriseSearch = (type: any) => {
	searchRef.value.show();
	enterpriseType.value = type;
};
const confirmSelect = (item: any) => {
	if (enterpriseType.value === 1) {
		enterpriseDate1.value = item;
	} else {
		enterpriseDate.value = item;
		formData.value = {
			...item,
			isWhether: true,
			exchangeGift: false,
			enterprises: [
				{
					companyName: enterpriseDate.value.companyName,
					attendance: 1,
					govLeaderList: [
						{
							name: '',
							duty: '',
						},
					],
				},
			],
		};
		queryWorkRecordTempInfo({ sccode: item.sccode }).then((res: any) => {
			const data: any = res.data || [];
			formData.value.mainAdviceContent = data.entInvestAdvice.adviceContent;
			formData.value.focusAdviceContent = data.entInvestAdvice?.currentKey;
		});
		handleUserInfo(); // 填报信息取用户的信息
	}
};

//  锚点跳转功能
const scrollContainer = ref<HTMLElement | null>(null);
const isClickScrolling = ref(false);
const handleClick = (index: number, item: any) => {
	activeIndex.value = index;
  isClickScrolling.value = true;

	const anchorId = item.id;
	const sectionElement = document.getElementById(anchorId);
	const container = scrollContainer.value;

	if (sectionElement && container) {
		// 计算元素相对于容器的位置
		const containerRect = container.getBoundingClientRect();
		const elementRect = sectionElement.getBoundingClientRect();
		const offset = elementRect.top - containerRect.top + container.scrollTop;

		// 平滑滚动到指定位置
		container.scrollTo({
      top: Math.max(0, offset),
			behavior: 'smooth',
		});
    // 滚动完成后重新启用滚动监听
    setTimeout(() => {
      isClickScrolling.value = false;
    }, 500); // 与滚动动画时间大致相同
	}
};
const handleScroll = () => {
  if (isClickScrolling.value) return;
	if (!scrollContainer.value) return;

	const container = scrollContainer.value;
	const scrollPosition = container.scrollTop + container.offsetTop;
  const containerHeight = container.clientHeight;

	// eslint-disable-next-line no-plusplus
	for (let i = listData.value.length - 1; i >= 0; i--) {
		const anchor = listData.value[i];
		const element = document.getElementById(anchor.id);

    if (element) {
			const elementTop = element.offsetTop;
      const elementBottom = elementTop + element.offsetHeight;
      const anchorId = anchor.id;

      const elementMidPoint = (elementTop + elementBottom) / 2;
      const isMidPointVisible = (
          elementMidPoint >= scrollPosition &&
          elementMidPoint <= scrollPosition + containerHeight
      );

      if (isMidPointVisible) {
				if (anchorId === 'basic-info') {
					activeIndex.value = 0;
				} else if (anchorId === 'progress-info') {
					activeIndex.value = 1;
				} else if (anchorId === 'problem-info') {
					activeIndex.value = 2;
				} else if (anchorId === 'other-info') {
					activeIndex.value = 3;
				}
				break;
			}
		}
	}
};

const show = (sccode: string) => {
	activeIndex.value = 0;
	dialogVisible.value = true;
	nextTick(() => {
		if (scrollContainer.value) {
			scrollContainer.value.addEventListener('scroll', handleScroll);
		}
	});
	handleWorkRecord(sccode);
};
defineExpose({ show });
onMounted(() => {});
onUnmounted(() => {
	if (scrollContainer.value) {
		scrollContainer.value.removeEventListener('scroll', handleScroll);
	}
});
</script>

<style scoped lang="less">
.fill-form-Dialog {
	.fill-page {
		display: flex;
		gap: 0.16rem;
		padding: 0.24rem 0.24rem 0.24rem 0;
		.left-box {
			width: 2.75rem;
			padding-top: 0.34rem;
			background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
			box-shadow: 0.02rem 0 0 0 rgba(25, 43, 138, 0.34);
			border-right: 0.02rem solid;
			border-image: linear-gradient(180deg, rgba(238, 242, 255, 1), rgba(162, 196, 255, 1)) 2
				2;
			backdrop-filter: blur(0.04rem);
			.list-box {
				display: flex;
				flex-direction: column;
				gap: 0.1rem;
				.list-item {
					width: 2.78rem;
					cursor: pointer;
					display: flex;
					align-items: center;
					padding: 0 0.46rem;
					height: 0.48rem;
					font-family:
						PingFangSC,
						PingFang SC;
					font-weight: 500;
					font-size: 0.24rem;
					color: rgba(0, 0, 0, 0.6);
					&.list-item-active {
						color: #165dff;
						background: linear-gradient(90deg, rgba(232, 244, 255, 0) 0%, #b8d8ff 100%);
						opacity: 0.8;
						border-right: 0.04rem solid #3489ff;
					}
				}
			}
		}
		.right-box {
			flex: 1;
			main {
				height: 7rem;
				background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
				box-shadow: 0rem 0rem 0.08rem 0rem rgba(25, 43, 138, 0.34);
				border-radius: 0.14rem;
				border-image: linear-gradient(180deg, #eef2ff, #a2c4ff) 2 2;
				backdrop-filter: blur(0.04rem);
				padding: 0.24rem;
				overflow-y: auto;
			}
		}
	}
}
</style>

<style lang="less">
.fill-form-Dialog {
	background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
	box-shadow: 0 0 0.11rem 0 rgba(25, 43, 138, 0.34);
	border-radius: 0.12rem;
	border-image: linear-gradient(180deg, rgba(238, 242, 255, 1), rgba(162, 196, 255, 1)) 3 3;
	backdrop-filter: blur(0.05rem);
	margin-top: 0.3rem !important;
	margin-bottom: 0rem !important;
	padding: 0rem !important;
	.el-dialog__footer {
		padding: 0rem !important;
	}
	.footer {
		display: flex;
		justify-content: center;
		background-color: #ffffff;
		padding: 0.15rem 0rem;
		border-top: 1px solid #e5e5e5;
		.el-button {
			width: 1.25rem;
			height: 0.38rem;
			border-radius: 0.06rem;
			font-size: 0.18rem;
		}
		.btn {
			border: 1px solid #0068fb;
			color: #0068fb;
		}
	}
}
</style>
