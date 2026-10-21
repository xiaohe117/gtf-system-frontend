<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-09-05 11:07:51
 * @LastEditors: ycyun
 * @LastEditTime: 2025-09-08 15:17:01
-->
<template>
  <el-dialog v-model="dialogVisible" class="enterprise-business-dialog" :append-to-body="true" width="19rem">
      <EnterpriseBusiness @close="close"/>
  </el-dialog>

</template>

<script lang='ts' setup>
import EnterpriseBusiness from '../components/EnterpriseBusiness.vue'

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
.enterprise-business-dialog{
  margin-top: 0.3rem !important;
  margin-bottom: 0rem !important;;
}
</style>
