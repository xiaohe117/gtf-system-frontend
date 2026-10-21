<template>
	<div class="fill-page">
    <div class="btn-back" @click="handleBack"></div>
		<div class="left-box fx-c">
			<template v-for="parentItem in menuItems" :key="parentItem.id">
				<div
					:class="['menu-btn', { 'menu-btn--active': activeId === parentItem.id }]"
					@click="scrollToSection(parentItem.id)"
				>
					{{ parentItem.name }}
				</div>
			</template>
		</div>
		<div class="rigth-box">
			<div class="rigth-box-title">
				<el-button class="button" round @click="submitForm(true)"
					>保存草稿</el-button
				>
				<el-button class="button" type="primary" round @click="submitForm(false)"
					>提交</el-button
				>
			</div>
			<div class="rigth-box-content">
				<!-- 基础信息 -->
				<div class="foundation" ref="scrollContainer">
				  <el-form ref="mainFormRef" :model="formData"  label-width="auto" label-position="top">
          <FrameBox class="fx-w" id="section-0">
            <TitleBody name="基础信息">
              <el-form
                  :model="formData.BasicForm"
                  :rules="BasicFormRules"
                  ref="BasicFormFormRef"
                  label-width="auto"
                  label-position="top"
                  class="form"
              >
                <el-form-item
                    label="工作类型"
                    prop="activityType"
                    style="width: 7.18rem"
                >
                  <el-radio-group v-model="formData.BasicForm.activityType">
                    <el-radio
                        v-for="item in typeOptions"
                        :key="item.value"
                        :value="item.value"
                    >
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="形式"
                    prop="activityForm"
                    style="width: 7.18rem"
                >
                  <el-radio-group v-model="formData.BasicForm.activityForm">
                    <el-radio
                        v-for="item in shapeOptions"
                        :key="item.value"
                        :value="item.value"
                    >
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="标题"
                    prop="activityName"
                    style="width: 7.18rem"
                >
                  <el-input
                      v-model="formData.BasicForm.activityName"
                      placeholder="请输入标题"
                  />
                </el-form-item>
                <el-form-item
                    label="时间"
                    prop="accessTime"
                    style="width: 7.18rem"
                >
                  <el-date-picker
                      v-model="formData.BasicForm.accessTime"
                      type="datetimerange"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item
                    label="地点"
                    prop="activityLocation"
                    class="textarea"
                >
                  <div class="flex">
                    <el-select
                        v-model="formData.BasicForm.locationType"
                        placeholder="请选择"
                        :style="{width: '2.8rem','margin-right':'0.2rem'}"
                    >
                      <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                      />
                    </el-select>

                    <el-input
                        v-model="formData.BasicForm.activityLocationDetailedAddress"
                        style="width: 100%"
                        placeholder="请输入地址详情"
                    /></div
                  ></el-form-item>
                <el-form-item
                    label="规模"
                    prop="activityScale"
                    style="width: 7.18rem"
                >
                  <el-select
                      v-model="formData.BasicForm.activityScale"
                      placeholder="请选择规模"
                  >
                    <el-option
                        v-for="item in scaleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                    label="产业领域"
                    prop="industryField"
                >
                  <el-select
                      v-model="formData.BasicForm.industryField"
                      placeholder="请选择产业"
                      style="width: 7.18rem"
                  >
                    <el-option
                        v-for="item in industryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item  class="textarea" label="工作简介" prop="activityIntro">
                  <el-input
                      v-model="formData.BasicForm.activityIntro"
                      placeholder="请输入工作简介"
                      type="textarea"
                  /> </el-form-item>
              </el-form>
            </TitleBody>
          </FrameBox>
          <div class="con">
            <div class="con-left">
              <FrameBox class="con-left-one" id="section-1">
                <TitleBody name="准备信息">
                  <el-form
                      ref="preparationFormRef"
                      :model="formData.preparationInfo"
                      :rules="preparationRules"
                      label-width="auto"
                      label-position="top"
                      class="form"
                  ><el-form-item label="会见/拜访(活动)方案" style="width: 3.36rem">
                    <!--											<el-upload-->
                    <!--												v-model:file-list="preparationFiles"-->
                    <!--												class="upload-demo"-->
                    <!--												action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"-->
                    <!--												multiple-->
                    <!--												:on-preview="handlePreview"-->
                    <!--												:on-remove="handleRemove"-->
                    <!--												:limit="3"-->
                    <!--												style="width: 3.36rem"-->
                    <!--											>-->
                    <!--												<el-button type="primary">上传文件</el-button>-->
                    <!--												<template #tip>-->
                    <!--													<div class="el-upload__tip">-->
                    <!--														支持扩展名：<br />-->
                    <!--														.rar .zip .doc .pdf .jpg...-->
                    <!--													</div>-->
                    <!--												</template>-->
                    <!--											</el-upload>-->
                    <Upload v-model="formData.preparationInfo.activityTalkFileList" class="upload"></Upload>
                  </el-form-item>
                    <el-form-item label="参阅材料" style="width: 3.36rem">
                      <Upload v-model="formData.preparationInfo.activitySchemeFileList" class="upload"></Upload>
                    </el-form-item>
                  </el-form>
                </TitleBody>
              </FrameBox>
              <FrameBox class="con-left-tow" id="section-2">
                <TitleBody name="过程记录">
                  <el-form
                      ref="processFormRef"
                      :model="formData.processInfo"
                      :rules="processRules"
                      label-width="auto"
                      label-position="top"
                      class="form"
                  >
                    <el-form-item
                        label="是否交换礼品"
                        prop="exchangeGift"
                        style="width: 7.18rem"
                    >
                      <el-select
                          v-model="formData.processInfo.exchangeGift"
                          placeholder="请选择"
                          style="width: 7.18rem"
                      >
                        <el-option
                            v-for="item in exchangeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label=""  prop="processRecordFileList">
                      <!--											<el-upload-->
                      <!--												v-model:file-list="processFiles"-->
                      <!--												class="upload-demo"-->
                      <!--												action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"-->
                      <!--												multiple-->
                      <!--												:on-preview="handlePreview"-->
                      <!--												:on-remove="handleRemove"-->
                      <!--												:limit="3"-->
                      <!--												style="width: 3.36rem"-->
                      <!--											>-->
                      <!--												<el-button type="primary">上传文件</el-button>-->
                      <!--												<template #tip>-->
                      <!--													<div-->
                      <!--														class="el-upload__tip"-->
                      <!--														style="-->
                      <!--															position: absolute;-->
                      <!--															left: 1.17rem;-->
                      <!--															top: -0.07rem;-->
                      <!--															width: 100%;-->
                      <!--														"-->
                      <!--													>-->
                      <!--														支持扩展名： .rar .zip .doc .pdf .jpg...-->
                      <!--													</div>-->
                      <!--												</template>-->
                      <!--											</el-upload>-->
                      <Upload v-model="formData.processInfo.processRecordFileList" class="upload" :layout="'level'"></Upload>
                    </el-form-item>
                  </el-form >
                </TitleBody>
              </FrameBox>
            </div>
            <div class="con-rigth">
              <FrameBox class="con-rigth">
                <TitleBody name="相关方">
                  <el-form
                      ref="stakeholderFormRef"
                      :model="formData.stakeholderInfo"
                      :rules="stakeholderRules"
                      label-width="auto"
                      label-position="top"
                      class="form"
                  >
                    <el-form-item label="我方">
                      <el-icon class="icon icon1"><CirclePlus /></el-icon>
                      <div class="select">
                        <div
                            v-for="item in itemsArr"
                            :key="item.id"
                            class="conm"
                        >
                          <p>{{ item.name }}</p>
                          <el-icon @click="removeItem(item.id)"
                          ><Close
                          /></el-icon>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item label="企方">
                      <div class="icon icon1 icon2">
                        <el-icon><CirclePlus /></el-icon>&nbsp; 最近拜访：
                        <span style="color: #3170ff">
													东浩兰生会展集团股份有限公司</span
                        >
                      </div>
                      <div class="select">
                        <div
                            v-for="item in itemsArr"
                            :key="item.id"
                            class="conm"
                        >
                          <p>{{ item.name }}</p>
                          <el-icon @click="removeItem(item.id)"
                          ><Close
                          /></el-icon>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item label="填报方">
                      <div class="Informant">
                        <el-select
                            v-model="formData.stakeholderInfo.reporterUnit"
                            placeholder="单位：请选择"
                            style="width: 3.46rem"
                        >
                          <el-option
                              v-for="item in options"
                              :key="item.value"
                              :value="item.value"
                          />
                        </el-select>

                        <el-input
                            v-model="formData.stakeholderInfo.reporterName"
                            style="width: 3.46rem"
                            placeholder="请输入"
                            :formatter="
														(value: any) =>
															`姓名： ${value}`.replace(
																/\B(?=(\d{3})+(?!\d))/g,
																','
															)
													"
                            :parser="
														(value: any) =>
															value.replace(/姓名：\s?|(,*)/g, '')
													"
                        />
                        <el-input
                            v-model="formData.stakeholderInfo.reporterPosition"
                            style="width: 3.46rem"
                            placeholder="请输入"
                            :formatter="
														(value: any) =>
															`职务： ${value}`.replace(
																/\B(?=(\d{3})+(?!\d))/g,
																','
															)
													"
                            :parser="
														(value: any) =>
															value.replace(/职务：\s?|(,*)/g, '')
													"
                        />
                        <el-input
                            v-model="formData.stakeholderInfo.reporterPhone"
                            style="width: 3.46rem"
                            placeholder="请输入"
                            :formatter="
														(value: any) =>
															`电话： ${value}`.replace(
																/\B(?=(\d{3})+(?!\d))/g,
																','
															)
													"
                            :parser="
														(value: any) =>
															value.replace(/电话：\s?|(,*)/g, '')
													"
                        />
                      </div>
                      <el-input
                          v-model="formData.stakeholderInfo.reportTime"
                          placeholder="请输入"
                          style="margin-top: 0.12rem"
                          disabled
                          :formatter="
													(value: any) =>
														`填报时间： ${value}`.replace(
															/\B(?=(\d{3})+(?!\d))/g,
															','
														)
												"
                          :parser="
													(value: any) =>
														value.replace(/填报时间：\s?|(,*)/g, '')
												"
                      />
                    </el-form-item>
                  </el-form>
                </TitleBody>
              </FrameBox>
            </div>
          </div>
          <FrameBox class="fx-w-botton" id="section-3">
            <TitleBody name="工作成效">
              <el-form
                  ref="resultFormRef"
                  :model="formData.resultInfo"
                  :rules="resultRules"
                  label-width="auto"
                  label-position="top"
                  class="form"
              >
                <el-form-item label="活动线索">
                  <el-icon class="icon"><CirclePlus /></el-icon>
                  <div class="select">
                    <div v-for="item in itemsArr" :key="item.id" class="conm">
                      <p>{{ item.name }}</p>
                      <el-icon @click="removeItem(item.id)"
                      ><Close
                      /></el-icon>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="box" label="活动问题">
                  <el-icon class="icon"><CirclePlus /></el-icon>
                  <div class="select">
                    <div v-for="item in itemsArr" :key="item.id" class="conm">
                      <p>{{ item.name }}</p>
                      <el-icon @click="removeItem(item.id)"
                      ><Close
                      /></el-icon>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="textarea" label="工作总结" prop="summary">
                  <el-input
                      v-model="formData.resultInfo.summary"
                      placeholder="请输入工作总结"
                      type="textarea"
                      style="width: 100%"/>
                </el-form-item>
              </el-form>
            </TitleBody>
          </FrameBox>
				</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router';
import Upload from '@/components/Upload/Index.vue'
import {addFillPage,queryIndustryList} from "@/api/index";

const router = useRouter();
const route = useRoute();
const sccode = computed(() => route.query.sccode);
// 当前选中的菜单项id
const activeId = ref(0);
const scrollContainer = ref<HTMLElement | null>(null);

const menuItems = ref([
	{ name: '基本信息', id: 0 },
	{ name: '准备记录', id: 1 },
	{ name: '过程记录', id: 2 },
	{ name: '工作成效', id: 3 },
]);

const scrollToSection = (id: number) => {
	activeId.value = id;
	const sectionId = `section-${id}`;
	const sectionElement = document.getElementById(sectionId);
	const container = scrollContainer.value;

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
// 表单部分
const scaleOptions = ref<any>([
  { value: '1', label: '大' },
  { value: '2', label: '中' },
  { value: '3', label: '小' },
]);
const shapeOptions = ref<any>([
	{ value: '1', label: '市内招商' },
	{ value: '2', label: '市外招商（境内）' },
	{ value: '3', label: '市外招商（境外）' },
]);
const typeOptions = ref<any>([
  { value: '1', label: '会见' },
  { value: '2', label: '拜访' },
  { value: '3', label: '招商活动' },
]);
const exchangeOptions = ref<any>([
  { value: false, label: '否' },
  { value: true, label: '是' },
]);
const industryOptions =  ref<any>([])
const options = ref([
  { value: '', label: '' },
]);
// 初始数据
const itemsArr = ref([
	{ id: 1, name: '李四222' },
	{ id: 2, name: '王五333' },
	{ id: 3, name: '赵六444' },
]);

// 移除项目
const removeItem = (id: any) => {
	if (id === 'static') {
		console.log('静态项目被点击');
		return;
	}
	itemsArr.value = itemsArr.value.filter((item) => item.id !== id);
};
const getIndustryOptions = async () => {
  const params = {
    entity:{},
    pageNum: -1,
    pageSize: -1
  }
  try {
    const res = await queryIndustryList(params)
    const list = (res as any)?.data?.records || [];
    industryOptions.value = list.map((item: any) => ({
      label: item.industryType,
      value: item.industryCode
    }))
  }catch (error){
    industryOptions.value = []
  }
}
getIndustryOptions()
// 表单引用
const BasicFormFormRef = ref();
const preparationFormRef = ref();
const processFormRef = ref();
const stakeholderFormRef = ref();
const resultFormRef = ref();
// 表单数据
const formData = reactive<any>({
  BasicForm: {
    activityType: '',
    activityName: '',
    activityForm: '',
    accessTime:[],
    activityIntro: '',
    locationType: '',
    activityLocationDetailedAddress:'',
    activityScale: '',
    industryField: '',
  },
  preparationInfo: {
    activityTalkFileList: [],
    activitySchemeFileList: []
  },
  processInfo: {
    exchangeGift: '',
    processRecordFileList: []
  },
  stakeholderInfo: {
  },
  resultInfo: {
    summary: ''
  }
});
// 验证规则
const BasicFormRules = reactive({
  activityName: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  accessTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
  activityType: [{ required: true, message: '请选择工作类型', trigger: 'blur' }],
  activityForm: [{ required: true, message: '请选择形式', trigger: 'blur' }],
  activityIntro: [{ required: true, message: '请输入工作简介', trigger: 'blur' }]
});

const preparationRules = reactive({
  // files: [{ required: true, message: '请上传准备文件', trigger: 'blur' }]
});

const processRules = reactive({
  exchangeGift: [{ required: true, message: '请选择是否交换礼品', trigger: 'blur' }]
});

const stakeholderRules = reactive({
});

const resultRules = reactive({
  summary: [{ required: true, message: '请输入工作总结', trigger: 'blur' }]
});
// 提交表单
const submitForm = async (isDraft:Boolean) => {
  try {
    // 验证所有表单
    const results = await Promise.all([
      BasicFormFormRef.value?.validate(),
      preparationFormRef.value?.validate(),
      processFormRef.value?.validate(),
      stakeholderFormRef.value?.validate(),
      resultFormRef.value?.validate()
    ]);

    // 如果所有验证都通过
    if (results.every(result => result === true)) {

      if(formData.BasicForm.accessTime.length >0){
        const [startTime, endTime] = formData.BasicForm.accessTime;
        formData.BasicForm.startTime = startTime
        formData.BasicForm.endTime = endTime
      }
      const params = {
        sccode: sccode.value,
        isDraft,
        gtfActivityBasicFormDTO: { ...formData.BasicForm },
        gtfActivityPreparationInfoDTO: { ...formData.preparationInfo },
        gtfActivityProcessRecordDTO: {...formData.processInfo },
        gtfActivityRelatedPartyDTO: {...formData.stakeholderInfo },
        gtfActivityEffectivenessDTO: {...formData.resultInfo },
      };
     const res =  await addFillPage(params);
      if(res.code===0){
        ElMessage.success('添加成功！');
        router.go(-1)
      }

    }
  } catch (error) {
    ElMessage.error('添加失败');
  }
};
const handleBack = () => {
  const { history } = window;
  // 花智会app中初始化页面length为2时，返回无效果
  const backUrl = history.state && history.state.back;
  if (history.length <= 1 || backUrl === null) {
    const path = backUrl || '/';
    router.replace(path);
  } else {
    router.go(-1);
  }
};
</script>
<style lang="less" scoped>
.fill-page {
  height: 100%;
	background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
	column-gap: 0.24rem;
	padding-top: 0.24rem;
  padding-bottom: 0.24rem;
	margin: 0;
  font-family: PingFangSC, PingFang SC;
  color: rgba(0,0,0,0.6);
	font-weight: 400;
	font-size: 0.14rem;
	display: flex;
  .btn-back {
    position: fixed;
    z-index: 2;
    cursor: pointer;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0.41rem;
    height: 1.52rem;
    background-size: 100% 100%;
    background-image: url(/src/assets/images/runByEnterprise/newDetail/back-btn.png);
  }
	.left-box {
		width: 2.7rem;
		font-size: 0.2rem;
    padding-top: 0.16rem;
		background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
		box-shadow: 0px 0px 8px 0px rgba(25, 43, 138, 0.34);
		border: 0.02rem solid;
		border-image: linear-gradient(180deg, rgba(238, 242, 255, 1), rgba(162, 196, 255, 1)) 2 2;
		backdrop-filter: blur(4px);
		.el-table {
			background: #f5f7fa;
			border: 0.01rem solid #e4e7ed;
			border-radius: 0.04rem;
			.el-table__header {
				background: #f0f2f5;
			}

			.el-table__row {
				&:hover {
					background: #ecf5ff;
				}
			}
		}

		.menu-btn {
			position: relative;
			height: 0.48rem;
			line-height: 0.48rem;
			font-size: 0.2rem;
			padding: 0 0.16rem;
			cursor: pointer;
			user-select: none;
			transition: all 0.3s ease;
			box-sizing: border-box;
			margin-bottom: 0.08rem;
		}

		/* 未选中状态 - 保持原有尺寸 */
		.menu-btn {
			width: 2.7rem;
      color: rgba(0,0,0,0.6);
		}

		/* 选中状态 - 保持原有尺寸 */
		.menu-btn--active {
			width: 2.7rem;
			color: #165dff;
			background: linear-gradient(90deg, rgba(232, 244, 255, 0) 50%, #b8d8ff 100%);
			border-right: #165dff 0.04rem solid;
		}

		/* 悬停效果 */
		.menu-btn:not(.menu-btn--active):hover {
			opacity: 0.9;
			transform: translateX(0.05rem);
		}
	}

	.rigth-box {
		width: 15.67rem;
		// background-color: #fff;
		.rigth-box-title {
			width: 100%;
			height: 1.03rem;
			background: url('@/assets/images/ActivityFillingPage/title.png') no-repeat;
			background-size: cover;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0.24rem;

			.button {
				width: 1.29rem;
				height: 0.4rem;
        background: rgba(255,255,255,0.4);
        box-shadow: 0 0.03rem 0.05rem 0 rgba(162,169,213,0.66);
        border-radius: 0.2rem;
        border: 0.01rem solid #FFFFFF;
        backdrop-filter: blur(0.15rem);
        &:hover {
        background: rgba(255,255,255,0.6);
        box-shadow: 0 0.03rem 0.05rem 0 rgba(162,169,213,0.66);
        border-radius: 0.2rem;
        border: 0.01rem solid #FFFFFF;
        backdrop-filter: blur(0.15rem);
        cursor: pointer;
        color: #165dff;
        }
			}
      :deep(.el-button--primary){
        background: linear-gradient(0deg, #1B4DF4 0%, #5DC9FC 100%) !important;
        &:hover{
          color: #FFFFFF !important;
        }
      }
		}
		.rigth-box-content {
			margin-top: 0.14rem;
			width: 100%;
			.foundation {
				width: 100%;
				height: 6.5899rem;
				overflow-y: auto;
				.con {
					width: 100%;
					height: 7.32rem;
					display: flex;
					justify-content: space-between;
					margin-top: 0.24rem;
					.con-left {
						width: 7.79rem;
						height: 7.32rem;
						.con-left-one {
							height: 3.79rem;
							width: 100%;
							margin-bottom: 0.22rem;
						}
						.con-left-tow {
							height: 3.29rem;
							width: 100%;
						}
					}
					.con-rigth {
						width: 7.79rem;
						height: 7.32rem;
					}
				}
				.fx-w-botton {
					height: 4.08rem;
					margin-top: 0.24rem;
				}
			}
		}
	}
}
.fx-w {
	min-width: 100%;
	height: 6.5899rem;
}
.fade-enter-active,
.fade-leave-active {
	transition: all 0.3s ease;
	transform: translateY(-0.1rem);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-0.2rem);
}
.main-content {
	padding: 0 0 0 0.26rem;
	column-gap: 0.24rem;
}

:deep(.title-body-content) {
	display: flex;
	flex-direction: column;
}
.form {
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	font-size: 0.2rem !important;
  padding: 0 0.16rem ;
  :deep(.el-form-item--label-top) {
    .el-form-item__label{
      padding-right: 0;
      font-weight: 400;
      font-size: 0.18rem;
      color: rgba(0,0,0,0.85);
    }

  }
  .textarea{
    width: 100%;
  }
  .icon{
    margin-left: 0.1rem;
    font-size: 0.17rem;
    font-weight: bold;
    color: #165dff;
    cursor: pointer;
  }

}
.flex {
	width: 100%;
	display: flex;
	justify-content: space-between;
}
.el-upload__tip {
	font-size: 0.14rem;
	opacity: 0.4;
}
.select {
	width: 7.45rem;
	min-height: 1.43rem;
	background: #ffffff;
	border-radius: 0.02rem;
	border: 0.01rem solid #d9d9d9;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;

	.conm {
		display: flex;
		width: 1.21rem;
		height: 0.32rem;
		background: #e6effe;
		border-radius: 0.04rem;
		justify-content: space-between;
		align-items: center;
		padding: 0.12rem;
		font-size: 0.14rem;
		cursor: pointer;
		margin: 0.06rem 0 0.06rem 0.16rem;
	}
}
.icon {
	position: absolute;
	top: -0.28rem;
	left: 0.7rem;
	font-size: 0.14rem;
	display: flex;
	align-items: center;
}
.icon1{
  left: 0.4rem;
}
.icon2{
  top: -0.4rem;
}
.Informant {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	row-gap: 0.12rem;
}
</style>
