<template>
  <FrameBox class="target-enterprise-analysis" size="short-white">
    <TitleBody name="目标企业分析" class="target-enterprise">
     <template  #extra>
       <RoundRectTabs
           v-model="selectedTab"
           :tabsList="tabsList"
       />
     </template>
      <div class="target-enterprise-content">
        <template v-if="selectedTab===0">
          <list-item
              v-model="activeIndex"
              :list="listData">
          </list-item>
          <div class="chart-box">
            <ChartContainer :chartOption="pieOption" />
          </div>
        </template>
        <template v-if="selectedTab===1">
          <div class="chart-box">
            <ChartContainer :chartOption="pieOption" />
          </div>
        </template>
        <template v-if="selectedTab===2">
          <Industry/>
        </template>
        <template v-if="selectedTab===3">
          <img class="investment" :src="getUrl('runByEnterprise/right/attract-investment.png')" alt="">
        </template>
      </div>
    </TitleBody>
  </FrameBox>

</template>

<script lang='ts' setup>
import {
  queryRegionTotal,
  queryRegionCount,
  queryNatureCount,
} from "@/api/index"
import ListItem from "@/views/RunByEnterprise/Right/components/ListItem.vue";
import {getUrl} from "@/utils";
import {pieChartOption2} from "@/views/RunByEnterprise/Right/chartOption";
import Industry from "./components/Industry.vue";

const activeIndex = ref<any>(0);
const selectedTab = ref<any>(0);
const tabsList = ref<any>(['企业所在地', '企业性质', '所属产业','招商成熟度']);
const listData = ref<any>([
  {
    icon:getUrl('runByEnterprise/right/china-map-blue.png'),
    activeIcon:getUrl('runByEnterprise/right/china-map-white.png'),
    title: '中国',
    count: '0',
    unit: '家',
  },
  {
    icon:getUrl('runByEnterprise/right/world-map-blue.png'),
    activeIcon:getUrl('runByEnterprise/right/world-map-white.png'),
    title: '世界(除中国）',
    count: '0',
    unit: '家',
  }
]);
// 企业区域
const pieOption = ref({});
const regionList1 =ref<any[]>([])
const regionList2 =ref<any[]>([
  {
    label: '欧洲',
    count: 0,
  },
  {
    label: '北美',
    count: 0,
  },
  {
    label: '东南亚',
    count: 0,
  },
  {
    label: '日韩',
    count: 0,
  },
  {
    label: '南美',
    count: 0,
  },
  {
    label: '其他',
    count: 0,
  }
])
const getRegionTotal = async ()=> {
  try {
    const res = await queryRegionTotal<any>();
    const data = res?.data || [];
    listData.value[0].count=data[0].count || 0
    listData.value[1].count=data[1].count || 0

  } catch (error) {
    listData.value[1].count = 0
    listData.value[0].count = 0
  }

}
const getRegionPieOption1 = async ()=> {
  try {
    const res = await queryRegionCount<any>({domesticForeign: '0'});
   const data = res?.data || [];
    regionList1.value = data
    const chartData = regionList1.value.map((el: any) => ({
      name: el.label,
      value: el.subCount,
      labelLine: {
				show: el.subCount > 0,
			},
			label: {
				show: el.subCount > 0,
			},
    }));
    pieOption.value = pieChartOption2(chartData, 0, '中国');
  } catch (error) {
    regionList1.value = [];
  }

}
const getRegionPieOption2= async ()=> {
  try {
    const res = await queryRegionCount<any>({domesticForeign: '1'});
    const data = res?.data || [];
    regionList1.value = data
    const chartData = regionList2.value.map((el: any) => ({
      name: el.label,
      value: el.subCount,
      labelLine: {
				show: el.subCount > 0,
			},
			label: {
				show: el.subCount > 0,
			},
    }));
    pieOption.value = pieChartOption2(chartData, 0,'世界');
  } catch (error) {
    regionList1.value = [];
  }
}
// 企业性质
const natureList =ref<any[]>([])
const getNaturePieOption= async ()=> {
  try {
    const res = await queryNatureCount<any>({domesticForeign: '1'});
    const data = res?.data || [];
    natureList.value = data
    const chartData = natureList.value.map((el: any) => ({
      name: el.label || '',
      value: el.subCount || 0,
    }));
    pieOption.value = pieChartOption2(chartData, selectedTab.value,'企业性质');
  } catch (error) {
    natureList.value = [];
  }

}
watch(
    () => activeIndex.value,
    () => {
      if (activeIndex.value === 0){
        getRegionPieOption1()
      }else {
        getRegionPieOption2()
      }
    },
);
watch(
    () => selectedTab.value,
    () => {
      if (selectedTab.value === 0){
        getRegionPieOption1()
        getRegionTotal()
        activeIndex.value = 0
      }else if (selectedTab.value===1) {
        getNaturePieOption()
      }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.target-enterprise-analysis{
  font-family: PingFangSC, PingFang SC;
  width:100%;
  height: 4.23rem;
  .target-enterprise-content{
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 0.14rem;
    .chart-box{
      height: 3.16rem;
      flex: 1;
    }
    .investment{
      width: 100%;
      height: 3.16rem;
    }
  }
}

</style>
