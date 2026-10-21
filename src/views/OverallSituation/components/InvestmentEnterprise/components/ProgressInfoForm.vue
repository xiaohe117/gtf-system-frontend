<template>
  <div class="progress-info-form">
    <SmallTitle title="对接情况" />
    <BasicForm
        v-model:ruleForm="formData"
        :rules="formRules"
        :columns="dockFileColumns"
        :modify="true"
        ref="dockFileRef"
        class="file-box"
        labelPosition="top"
    >
      <template #activityTalkFileList>
        <Upload
            v-model="formData.activityTalkFileList"
            :name="'activityTalkFileList'"
        />
      </template>
      <template #activitySchemeFileList>
        <upload
            v-model="formData.activitySchemeFileList"
            :name="'activitySchemeFileList'"
        />
      </template>
    </BasicForm>
    <BasicForm
        v-model:ruleForm="formData"
        :rules="formRules"
        :columns="dockColumns"
        :modify="true"
        ref="dockRef"
        :layout="'vertical'"
    >
      <template #activityType>
        <div class="activity-type">
          <el-radio-group v-model="formData.activityType">
            <el-radio value="2">拜访</el-radio>
            <el-radio value="1">来访</el-radio>
            <el-radio value="3">重大活动</el-radio>
          </el-radio-group>
          <el-input
              v-if="formData.activityType === '3'"
              v-model="formData.activityTypeAdd"
              placeholder="描述活动类型"
          />
        </div>
      </template>
      <template #address>
       <div class="address">
         <el-select
             v-model="formData.activityForm"
             placeholder="请选择"
         >
           <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value"
           />
         </el-select>
         <el-cascader
             v-if="formData.activityForm !== '3'"
             v-model="formData.locationValue"
             :options="regionData"
             placeholder="选择省/市/区"
             filterable
             clearable
             @change="handleLocationChange"
             style="width:30%"
         />
         <el-input
             v-model="formData.activityLocationDetailedAddress"
             placeholder="输入详细地址"
         />
       </div>
      </template>
    </BasicForm>
    <SmallTitle title="参与单位" />
    <!-- 与会政府单位 -->
    <div class="form-section">
      <div class="section-header">
        <div class="title">与会政府单位</div>
        <el-button type="primary" :icon="Plus" @click="addGovernmentUnit"
        >添加</el-button
        >
      </div>
      <el-form
          ref="governmentUnitsFormRef"
          :model="formData"
          :rules="governmentUnitsRules"
          label-width="1.3rem"
      >
<!--        <div v-if="formData.governmentUnits?.length === 0" class="empty-placeholder">-->
<!--          暂无政府单位，请点击"添加"按钮添加-->
<!--        </div>-->
        <div
            v-for="(unit, index) in formData.governmentUnits"
            :key="unit.id"
            class="unit-item"
        >
         <div class="left-box">
           <div class="form-grid">
            <el-row>
              <el-col :span="12">
                <el-form-item
                    :label="`单位${index + 1}：`"
                    :prop="`governmentUnits.${index}.companyName`"
                    class="required"
                >
                  <el-input
                      v-model="unit.companyName"
                      placeholder="请输入机构名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                    :label="`出席人数：`"
                    :prop="`governmentUnits.${index}.attendance`"
                    class="required"
                >
                  <el-input-number
                      class="people-num"
                      v-model="unit.attendance"
                      :min="1"
                      :max="99999"
                      step="1"
                      precision="0"
                      placeholder="请输入人员数量"
                      style="width:4rem;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
           </div>
           <el-form-item
               v-if="showOptionalFields"
               label="参会人员："
               :prop="`governmentUnits.${index}.govLeaderList`"
           >
             <div class="participants-section">
               <div
                   v-for="(participant, pIndex) in unit.govLeaderList"
                   :key="participant.id"
                   class="participant-item"
               >
                 <div class="participant-row">
                   <el-row>
                     <el-col :span="12">
                       <el-input
                           v-model="participant.name"
                           placeholder="请输入人员姓名"
                           style="width: 90.5%;"
                       />
                     </el-col>
                     <el-col :span="12">
                       <div class="person-type-group">
                         <div class="person-type-label">人员类型：</div>
                         <div class="person-type-right">
                           <el-radio-group
                               v-model="participant.type"
                           >
                             <el-radio value="1">市领导</el-radio>
                             <el-radio value="2">区领导</el-radio>
                             <el-radio value="3">单位领导</el-radio>
                           </el-radio-group>
                           <el-button
                               text
                               @click="removeParticipant(unit, pIndex)"
                               class="delete-btn"
                               icon="DeleteFilled"
                               :disabled="unit.govLeaderList.length <= 1"
                               size="small"
                           >
                           </el-button>
                           <el-button
                               text
                               size="small"
                               @click="addParticipant(unit)"
                               icon="CirclePlusFilled"
                           >
                           </el-button>
                         </div>
                       </div>
                     </el-col>
                   </el-row>
                 </div>
               </div>
             </div>
           </el-form-item>
         </div>
         <div :class="['unit-actions']" @click="deleteGovernmentUnit(index)">
            删除
         </div>
        </div>
      </el-form>
    </div>
    <!-- 与会企业 -->
    <div class="form-section">
      <div class="section-header">
        <div class="title">与会企业</div>
        <el-button type="primary" :icon="Plus" @click="addEnterprise"
        >添加</el-button
        >
      </div>
      <el-form
          ref="enterprisesFormRef"
          :model="formData"
          :rules="enterprisesRules"
          label-width="1.3rem"
      >
        <div
            v-for="(enterprise, index) in formData.enterprises"
            :key="enterprise.id"
            class="unit-item"
        >
         <div class="left-box">
           <el-row class="form-grid">
            <el-col :span="12">
              <el-form-item
                :label="`企业${index + 1}：`"
                :prop="`enterprises.${index}.companyName`"
                class="required"
            >
              <div class="name-box" @click="selectFunc(`${index}`)">
                <el-input
                    v-model="enterprise.companyName"
                    placeholder="请输入企业名称"
                    readonly
                />
                <el-button type="primary">选择</el-button>
              </div>
            </el-form-item>
            </el-col>
             <el-col :span="12">
               <el-form-item
                   :label="`出席人数：`"
                   :prop="`enterprises.${index}.attendance`"
                   class="required"
               >
                 <el-input-number
                     class="people-num"
                     v-model="enterprise.attendance"
                     :min="1"
                     :max="99999"
                     step="1"
                     precision="0"
                     placeholder="请输入人员数量"
                     style="width:4rem;"
                 />
               </el-form-item>
             </el-col>
           </el-row>
          <el-row >
            <el-form-item
                class="form-person"
                v-if="showOptionalFields"
                label="参会人员："
                :prop="`enterprises.${index}.govLeaderList`"
            >
              <div class="participants-section">
                <div
                    v-for="(participant, pIndex) in enterprise.govLeaderList"
                    :key="participant.id"
                    class="participant-item"
                >
                  <div class="participant-row">
                    <el-row>
                      <el-col :span="12">
                        <el-input
                            v-model="participant.name"
                            placeholder="请输入人员姓名"
                            style="width: 90.5%;"
                        />
                      </el-col>
                      <el-col :span="12" >
                        <div class="person-type-group">
                          <div class="person-type-label">职务：</div>
                          <div class="person-type-right">
                            <el-input
                                v-model="participant.duty"
                                placeholder="请输入职务"
                                style="width:4rem;"
                            />
                            <el-button
                                text
                                @click="removeParticipant(enterprise, pIndex)"
                                class="delete-btn"
                                icon="DeleteFilled"
                                :disabled="enterprise.govLeaderList.length <= 1"
                                size="small"
                            >
                            </el-button>
                            <el-button
                                text
                                size="small"
                                @click="addParticipant(enterprise)"
                                :icon="CirclePlusFilled"
                            >
                            </el-button>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-row>
         </div>
          <div :class="['unit-actions',{'actions-disabled':formData.enterprises.length <= 1}]" @click="deleteEnterprise(index)">
            删除
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {handleRules} from "@/utils/form";
import Upload from '@/components/Upload/Index.vue';
import BasicForm from '@/views/FormFillPage/components/BasicForm.vue';
import { ElMessage } from 'element-plus';
import { regionData } from 'element-china-area-data';
import { Plus, CirclePlusFilled } from '@element-plus/icons-vue'; // 修改这一行

const props = defineProps({
  showRequired: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  enterpriseDate: {
    type: Object,
    default: () => ({}),
  },
});
const emits = defineEmits(['update:modelValue','EnterpriseSearch']);
// 使用 computed 实现双向绑定
const formData = computed<any>({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
});
const showOptionalFields = ref<boolean>(true);
const dockRef = ref();
const governmentUnitsFormRef =ref ()
const enterprisesFormRef =ref ()

const options = ref([
    {
        label: '市内招商',
        value: '1',
    },
    {
        label: '市外招商（境内）',
        value: '2',
    },
    {
        label: '境外招商',
        value: '3',
    },
])

const getPlaceholderByActivityType = (type: string) => {
  switch (type) {
    case '2': // 拜访
      return 'XX赴XX拜访XX职务XX 【含我方人员、地点、客方单位、客方姓名及职务】';
    default:
      return 'XX会见XX公司XX职务XX一行【含我方人员、客方公司、客方姓名及职务】';
  }
};
const cols = computed(() => [
  {
    prop: 'activityType',
    label: '工作类型',
    type: 'slot',
    slot: 'activityType',
    span: 12,
    isRequired: true,
    options: [
      { label: '拜访', value: '2' },
      { label: '来访', value: '1' },
      { label: '重大活动', value: '3' },
    ],
  },
  {
    prop: 'isWhether',
    label: '是否需要流转',
    type: 'radio',
    span: 12,
    options: [
      { label: '是（待跟踪）', value: true },
      { label: '否（仅记录）', value: false },
    ],
  },
  {
    prop: 'activityLocationDetailedAddress',
    label: '地点',
    type: 'slot',
    slot: 'address',
    isRequired: true,
  },
  {
    prop: 'progressTitle',
    label: '进展概要',
    type: 'text',
    isRequired: true,
    placeholder: getPlaceholderByActivityType(formData.value.activityType),
    maxLength: 200,
  },
  {
    prop: 'detailedProgress',
    label: '详细进展',
    type: 'textarea',
    isRequired: true,
    placeholder: 'x月x日，XX会见（/拜访）XX（职务）XX ，就XX（具体合作事项）进行沟通对接。',
    minRows: 4,
    maxRows: 6,
    maxLength: 2000,
    span: 24,
  },
]);

const dockColumns = computed(() =>
    cols.value.filter((item:any) => props.showRequired || item.isRequired)
) as any;
const dockFileColumns = computed(() => {
  const arr = [
    {
      prop: 'activityTalkFileList',
      label: '对接方案',
      type: 'slot',
      slot: 'activityTalkFileList',
      span: 12,
    },
    {
      prop: 'activitySchemeFileList',
      label: '参阅材料',
      type: 'slot',
      slot: 'activitySchemeFileList',
      span: 12,
    },
  ];
  return arr.filter((item: any) => props.showRequired || item.isRequired);
}) as any;
const formRules = computed(() =>
    handleRules([
      ...dockColumns.value,
    ])
);
// 处理地区选择变化
const handleLocationChange = (value: string[]) => {
  if (value && value.length === 3) {
    const province = regionData.find((p: any) => p.value === value[0]);
    const city = province?.children?.find((c: any) => c.value === value[1]);
    const district = city?.children?.find((d: any) => d.value === value[2]);

    formData.value.activityLocationCountryName = province?.label || '';
    formData.value.activityLocationProvinceName = city?.label || '';
    formData.value.activityLocationCityName = district?.label || '';
  } else if (!value || value.length === 0) {
    formData.value.activityLocationCountryName = '';
    formData.value.activityLocationProvinceName = '';
    formData.value.activityLocationCityName = '';
  }
};

// 与会政府单位
const governmentUnitsRules: any = (() => {
  const rules: any = {};

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 20; i++) {
    rules[`governmentUnits.${i}.companyName`] = [
      { required: true, message: '请输入机构名称', trigger: 'blur' },
    ];
    rules[`governmentUnits.${i}.attendance`] = [
      { required: true, message: '请选择出席人数', trigger: 'blur' },
    ];
  }

  return rules;
})();
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
  if (!formData.value.governmentUnits) {
    formData.value.governmentUnits = [];
  }
  formData.value.governmentUnits.push(newUnit);
};
// 删除政府单位
const deleteGovernmentUnit = (index: number) => {
  formData.value.governmentUnits.splice(index, 1);
};
// 与会企业
const enterprisesRules: any = (() => {
  const rules: any = {};

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    rules[`enterprises.${i}.companyName`] = [
      { required: true, message: '请输入企业名称', trigger: 'blur' },
    ];
    rules[`enterprises.${i}.attendance`] = [
      { required: true, message: '请选择出席人数', trigger: 'blur' },
    ];
  }

  return rules;
})();
// 添加企业
const addEnterprise = () => {
  const newEnterprise: any = {
    companyName: '',
    attendance: 1,
    govLeaderList: [
      {
        name: '',
        duty:''
      },
    ],
  };
  if (!formData.value.enterprises) {
    formData.value.enterprises = [];
  }
  formData.value.enterprises.push(newEnterprise);
};

// 删除企业
const deleteEnterprise = (index: number) => {
  if(formData.value.enterprises.length>1){
    formData.value.enterprises.splice(index, 1);
  }
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
    unit.attendance = unit.govLeaderList.length;
  } else {
    // 企业参与者
    const newParticipant: any = {
      name: '',
    };
    unit.govLeaderList.push(newParticipant);
    unit.attendance = unit.govLeaderList.length;
  }
};

// 删除参会人员
const removeParticipant = (unit: any, index: number) => {
  if (unit.govLeaderList.length <= 1) {
    ElMessage.warning('至少需要保留一个参会人员');
    return;
  }
  unit.govLeaderList.splice(index, 1);
  unit.attendance = unit.govLeaderList.length;
};

// 表单提交
const handelOK = async () => {
  try {
    // 收集所有表单的校验Promise
    const validations = [
      dockRef.value?.validateForm(), // 企业信息表单
      governmentUnitsFormRef.value?.validate(),
      enterprisesFormRef.value?.validate(),
    ].filter(Boolean); // 过滤掉 undefined/null 值

    // 如果没有需要校验的内容，直接返回 true
    if (validations.length === 0) {
      return true;
    }

    const results = await Promise.all(validations);
    const allValid = results.every((valid) => valid === true);

    console.log('ProgressInfoForm 校验结果:', allValid);
    console.log('ProgressInfoForm 校验时的表单数据:', formData.value);
    return allValid;
  } catch (error) {
    // 处理校验失败，但不修改表单数据
    console.error('ProgressInfoForm 校验失败:', error);
    return false;
  }
};
const selectType = ref('');
const selectFunc = (type: string) => {
  emits('EnterpriseSearch', 1);
  selectType.value = type;
};
defineExpose({
  handelOK,
});
onMounted(() => {
  setTimeout(() => {

  })
});
watch(
    () => props.enterpriseDate,
    (item:any) => {
      formData.value.enterprises[Number(selectType.value)].companyName = item.companyName;
    },
    {
      deep: true,
    }
);
</script>

<style scoped lang="less">
.progress-info-form{
  .file-box{
    padding-left: 0.5rem;
  }
  .address{
    .el-select{
      width: 30%;
    }
    .el-cascader{
      width: 30%;
    }
    display: flex;
    gap: 0.2rem;
    width: 100%;
  }
  .activity-type{
    width: 100%;
    display: flex;
    gap: 0.2rem;
    justify-content: space-between;
    .el-radio-group{
      flex-wrap: nowrap;
    }
    .el-input{
    }
  }
  .form-section{
    margin-bottom: 0.16rem;
    .section-header{
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.24rem;
    }
    .unit-item{
      display: flex;
      justify-content: space-between;
      gap: 0.06rem;
      margin-bottom: 0.24rem;
      .left-box{
        flex: 1;
        background: rgba(22, 93, 255, 0.05);
        border-radius: 0.08rem;
        padding-top: 0.24rem;
        .form-person{
          width: 100%;
        }
        .name-box {
          display: flex;
          justify-content: space-between;
          width: 100%;
          .el-button {
            width: 1.25rem;
            margin-left: 0.18rem;
          }
        }
        .required{
          width: 100%;
          .people-num{
            width: 2rem;
          }
        }
        .participants-section{
          width: 100%;
          display: flex;
          gap:0.1rem;
          flex-direction: column;
          .participant-item{
            width: 100%;
            display: flex;
            gap:0.2rem;
            flex-direction: column;
            .enterprise-participant-row{
              display: flex;
              justify-content: space-between;
              gap: 0.15rem;
              align-items: center;
              .btn{
                //width: 1.3rem;
                display: flex;
                font-size: 0.24rem;
                .el-button{
                  :deep(.el-icon){
                    font-size: 0.24rem !important;
                    color: #165DFF;
                  }
                  &.delete-btn {
                    :deep(.el-icon) {
                      color: #C0C4CC;
                    }
                  }
                  :deep(.el-icon):last-child{

                  }
                  &:hover{
                    background: none;

                  }
                }

              }
            }
            .person-type-group{
              margin-left: -0.6rem;
              display: flex;
              .person-type-label{
                width: 1.1rem;
                text-align: right;
                margin-right: 0.15rem;
              }
              .person-type-right{
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: .24rem;
                .el-input{
                  width: 100%;
                }
                .el-button{
                  :deep(.el-icon){
                    font-size: 0.24rem !important;
                    color: #165DFF;
                  }
                  &.delete-btn {
                    :deep(.el-icon) {
                      color: #C0C4CC;
                    }
                  }
                  :deep(.el-icon):last-child{

                  }
                  &:hover{
                    background: none;
                  }
                }
              }
            }
          }
        }
      }
      .unit-actions{
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
        &.actions-disabled{
          cursor: not-allowed;
        }
        }
      }
    }
  }

</style>
