<!--
 * @Descripttion: 企业性质
 * @Author: ycyun
 * @Date: 2025-10-27 16:59:56
 * @LastEditors: ycyun
 * @LastEditTime: 2025-10-27 17:43:33
-->
<template>
    <div class="nature-chart">
        <ChartContainer :chartOption="pieOption"/>
    </div>
</template>
<script lang="ts" setup>
import { queryNatureCount} from "@/api/index"
import { pieChartOption } from './chartOption';

const pieOption = ref({})

const getNaturePieOption= async ()=> {
  try {
    const res = await queryNatureCount<any>({domesticForeign: '1'});
    const data = res?.data || [];
    const chartData = data.map((el: any) => ({
      name: el.label || '',
      value: el.subCount || 0,
    })).filter((el: any) =>  el.name);
    pieOption.value = pieChartOption(chartData, 1,'企业性质');
  } catch (error) {
    console.log(error);
    
  }
}
getNaturePieOption()
</script>
<style lang="less" scoped>
.nature-chart{
     padding-right: 0.24rem;
     padding-top: 0.24rem;
}
</style>