<template>
  <div class="enterprise-business">
    <FormHeader v-model="showRequired" title="企业投资合作建议-录入" tip="*面向企业的招商工作中，与该企业进行投资合作的建议、招商方向建议等"/>
    <main>
      <SmallTitle title="投资合作目标企业"></SmallTitle>
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
      <SmallTitle title="主攻方向" v-if="reportColumns.length > 0"></SmallTitle>
      <BasicForm
          v-model:ruleForm="formData"
          :rules="formRules"
          :columns="mainColumns"
          :modify="true"
          ref="mainRef"
      >
      </BasicForm>
      <SmallTitle title="当期重点" v-if="reportColumns.length > 0"></SmallTitle>
      <BasicForm
          v-model:ruleForm="formData"
          :rules="formRules"
          :columns="focusColumns"
          :modify="true"
          ref="focusRef"
      >
      </BasicForm>
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
import { handleRules } from '@/utils/form';
import { addInvestmentSuggestion} from '@/api/formFillPage/index';
import { ElMessage } from 'element-plus';
import SmallTitle from '@/components/SmallTitle.vue';
import dayjs from 'dayjs';
import BasicForm from './BasicForm.vue';
import FormHeader from './FormHeader.vue'

const emits = defineEmits(['close']);
const showRequired = ref(true);
const formData: any = ref({ reportTime: dayjs().format('YYYY-MM-DD HH:mm') });

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
];
const infoColumns = computed(() =>
    cols.filter((item) => showRequired.value || item.isRequired)
) as any;
const mainColumns = computed(() => {
  const arr = [
    {
      prop: 'mainAdviceContent',
      label: '具体建议',
      type: 'textarea',
      span: 24,
      minRows: 6,
      placeholder: '与该企业进行投资合作的建议、招商方向建议等。',
      isRequired: true,
    },
  ];
  return arr.filter((item: any) => showRequired.value || item.isRequired);
}) as any;
const focusColumns = computed(() => {
  const arr = [
    {
      prop: 'focusAdviceContent',
      label: '具体建议',
      type: 'textarea',
      span: 24,
      minRows: 6,
      placeholder: '短期阶段招商重点方向、建议内容。',
      isRequired: true,
    },
  ];
  return arr.filter((item: any) => showRequired.value || item.isRequired);
}) as any;
const reportColumns = computed(() => {
  const arr = [
    {
      prop: 'reportTime',
      label: '填报时间',
      type: 'date',
      dateType: 'datetime',
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
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
const formRules = ref(handleRules(
    cols.concat(mainColumns.value, focusColumns.value, reportColumns.value)
)) as any;

const formRef = ref();
const mainRef = ref();
const focusRef = ref();
const reportRef = ref();
const saveLoading = ref(false);
const submitFunc = async () => {
  const forms = [mainRef.value,focusRef.value, formRef.value, reportRef.value];
  Promise.all(forms.map((item) => item.validateForm())).then(() => {
    const params = {
      ...formData.value,
    };
    saveLoading.value = true
    addInvestmentSuggestion(params)
        .then(() => {
          ElMessage.success('操作成功')
          emits('close');
          saveLoading.value = false
        })
        .catch((err) => {
          saveLoading.value = false
          ElMessage.error(`操作失败,${err.message}`)
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
    border: none;
  }
  main {
    height: 7.0rem;
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
