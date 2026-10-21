<!--
 * @Descripttion: 企业性质
 * @Author: ycyun
 * @Date: 2025-10-27 16:59:56
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-31 14:49:20
-->
<template>
    <div class="nature-chart" ref="chartBoxRef">
        <ChartContainer :chartOption="pieOption" ref="chartRef"/>
    </div>
</template>
<script lang="ts" setup>
import { queryNatureCount} from "@/api/index"
import { pieChartOption,handleResize,getOptionByWidth } from './chartOption';

const pieOption = ref({})
const chartRef = ref();
const chartBoxRef = ref()
const getNaturePieOption= async ()=> {
  try {
    const res = await queryNatureCount<any>({domesticForeign: '1'});
    const data = res?.data || [];
    const chartData = data.map((el: any) => ({
      name: el.label || '',
      value: el.subCount || 0,
    })).filter((el: any) =>  el.name);
    const myChart = chartRef.value?.chartInstance.instance;
    pieOption.value =getOptionByWidth(myChart,pieChartOption(chartData, 1,'企业性质'));
  } catch (error) {
    console.log(error);
    
  }
}
getNaturePieOption()
let resizeObserver: any = null;

onMounted(() => {
	resizeObserver = new ResizeObserver(() => handleResize(chartRef.value));
	resizeObserver.observe(chartBoxRef.value);
});
onUnmounted(() => {
	resizeObserver?.disconnect();
});
</script>
<style lang="less" scoped>
.nature-chart{
     padding-right: 0.24rem;
     padding-top: 0.24rem;
}
</style>