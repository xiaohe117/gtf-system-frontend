<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-09-05 11:07:51
 * @LastEditors: ycyun
 * @LastEditTime: 2025-09-08 15:17:09
-->
<template>
  <el-dialog v-model="dialogVisible" class="problem-feedback-dialog" :append-to-body="true" width="19rem">
      <ProblemFeedback @close="close"/>
  </el-dialog>

</template>

<script lang='ts' setup>
import ProblemFeedback from '../components/ProblemFeedback.vue'

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
.problem-feedback-dialog{
  margin-top: 0.3rem !important;
  margin-bottom: 0rem !important;
}
</style>
