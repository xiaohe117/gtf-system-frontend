<template>
  <el-dialog v-model="dialogVisible" class="enterprise-investment-dialog" :append-to-body="true" width="19rem">
    <EnterpriseInvestment @close="close"/>
  </el-dialog>

</template>

<script lang='ts' setup>
import EnterpriseInvestment from '../components/EnterpriseInvestment.vue'

const dialogVisible = ref(false)
const show = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
}
defineExpose({ show });

</script>

<style lang="less">
.enterprise-investment-dialog{
  margin-top: 0.3rem !important;
  margin-bottom: 0rem !important;
}
</style>
