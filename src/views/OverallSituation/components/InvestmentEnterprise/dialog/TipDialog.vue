<template>
  <el-dialog v-model="dialogVisible" width="4.9rem">
    <TitleBody name="温馨提示">
     <div class="box">
       <img class="dev-img" src="@/assets/images/runByEnterprise/dev-bg.png" alt="">
       <p class="dev-text" style="text-align: center;">功能正在开发中，敬请期待。</p>
     </div>
    </TitleBody>
  </el-dialog>

</template>

<script lang='ts' setup>
const dialogVisible = ref(false)
const show = () => {
  dialogVisible.value = true;
};

defineExpose({ show });

</script>

<style scoped lang="less">
.box{
  text-align: center;
  margin-bottom: 0.1rem;
  .dev-img{
    width: 2rem;
    margin: 0.1rem 0 0.3rem;
  }
  .dev-text{
    height: 0.22rem;
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 500;
    font-size: .16rem;
    color: #000;
    line-height: .22rem;
    text-align: right;
    font-style: normal;
  }
}


</style>
