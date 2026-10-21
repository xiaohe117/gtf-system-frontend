<template>
 <div class="industry">
   <list-item
       v-model="activeIndex"
       :list="listData"
       @click-item="handleClick"
   >
   </list-item>
   <div class="industry-right">
     <line-tabs :tabs-list="tabsList" v-model="selectedTab"></line-tabs>
     <div class="custom-list-box">
       <div class="custom-legend">
         <template v-if="customLegend.length > 1">
								<span
                    v-for="(item, index) in customLegend"
                    :key="index"
                    class="custom-legend-item"
                >
									<i :style="{ background: item.color }"></i>
									{{ item.label }}
								</span>
         </template>
       </div>
       <div class="custom-list">
         <template v-if="rightTableList.length > 0">
           <div v-for="(item, index) in rightTableList" :key="index" class="custom-list-item">
             <el-popover  :disabled="true" popper-class="custom-popover">
               <template #reference>
                 <div class="fx-r fx-al-c item">
                   <div class="index">{{ index + 1 }}</div>
                   <div class="label overflow-ellipsis">
                     {{ item.name }}
                   </div>
                   <div class="value fx-r fx-1">
                     <div
                         class="value-item"
                         v-for="(
															legend, legendIndex
														) in customLegend"
                         :key="legendIndex"
                         :style="{
															background: legend.color,
															width:
																(item[legend.prop] /
																	maxTableValue) *
																	100 +
																'%',
														}"
                     />
                   </div>
                   <div class="number">
                     {{item.industryCount}}
                     <span class="unit">家</span>
                   </div>
                 </div>
               </template>
               <div class="custom-list-popover">
                 <div class="label">{{ item.name }}</div>
                 <div class="value">
                   <div v-for="(legend, legendIndex) in customLegend" :key="legendIndex" class="item">
                     <i v-show="customLegend.length > 1" :style="{borderColor: legend.color}"></i>
                     {{ legend.label }} {{ item[legend.prop] }}
                   </div>
                 </div>
               </div>
             </el-popover>
           </div>
         </template>
         <default-empty-container :height="'1.76rem'" v-else />
       </div>
     </div>
   </div>
 </div>
</template>

<script lang='ts' setup>
import ListItem from "@/views/RunByEnterprise/Right/components/ListItem.vue";
import LineTabs from "@/views/RunByEnterprise/Right/components/LineTabs.vue";
import {queryIndustryCategory,queryIndustryCount} from "@/api/index";

const activeIndex = ref<any>(0);
const selectedTab = ref<any>(0);
const listData = ref<any>([
  {
    title: '15个战略性产业集群',
    count: '1324',
    unit: '家',
    percent: '50',
    height: '0.65rem',
    fontSize:'0.2rem',
  },
  {
    title: '6个未来产业',
    count: '1324',
    unit: '家',
    percent: '30',
    height: '0.65rem',
    fontSize:'0.2rem',
  },
  {
    title: '8个现代服务业',
    count: '1324',
    fontSize:'0.2rem',
    unit: '家',
    percent: '30',
    height: '0.65rem',
  }
]);

const tabsList = ref<any>([{name:'按数量排'}, {name:'按默认产业排序'}]);

const customLegend = computed(() =>[
  {
    label: '所属产业',
    prop: 'industryCount',
    color: '#408FFF',
  },
]);
const rightTableList = ref<any[]>([]);
const maxTableValue = ref<number>(0);
const category = ref('');
const getRightTabData = async () => {
  const params = {
    category:category.value,
    sort:selectedTab.value+1
  };
  try {
    const res = await queryIndustryCount<any>(params);
    rightTableList.value = res?.data.map((item:any) => ({
      ...item,
      name: item.label,
      industryCount:item.count
    }));
    let maxValue: any = 0;
    if (rightTableList.value.length > 0) {
      // 遍历所有数据项，找出各项属性的最大值总和
      rightTableList.value.forEach((item: any) => {
        let itemTotal = 0;
        customLegend.value.forEach((legend: any) => {
          itemTotal += item[legend.prop] || 0;
        });
        if (itemTotal > maxValue) {
          maxValue = itemTotal;
        }
      });
    }

    // 如果没有数据或最大值为0，设置一个默认值避免除以0
    maxTableValue.value = maxValue > 0 ? maxValue : 1;
  } catch (error) {
    rightTableList.value = [];
  }
};
const getIndustryCategory = async () => {
  try {
    const res = await queryIndustryCategory<any>();
    const data= res?.data || [];
    listData.value = data.map((item:any) => ({
      title: item.label,
      count: item.totalCount,
      unit: '家',
      percent: item.ratio,
      height: '0.65rem',
      fontSize:'0.2rem',
    }));
    category.value = listData.value[0].title
    await getRightTabData();
  } catch (error) {
    listData.value = [];
  }
};

const handleClick=(item:any)=>{
  category.value = item.title;
  getRightTabData();
};
onMounted(async () => {
  await getIndustryCategory();
});
watch(
    () => selectedTab.value,
    () => {
      getRightTabData();
    },
);
</script>

<style lang="less" scoped>
.industry{
  display: flex;
  width: 100%;
  justify-content: space-between;
  height: 3.16rem;
  gap: 0.16rem;
  .industry-right{
    flex: 1;
    :deep(.tabs-line-control){
      margin-top: 0;
      margin-bottom: 0;
     .el-tabs__item{
       .custom-tab-label{
         padding: 0 0.3rem;
       }
     }
    }
    .custom-list-box {
      .custom-legend {
        text-align: right;
        color: #4b4b4b;
        margin-bottom: 0.1rem;
        .custom-legend-item {
          margin-left: 0.16rem;
          i {
            display: inline-block;
            width: 0.1rem;
            height: 0.1rem;
            margin-right: 0.08rem;
            border-radius: 0.01rem;
          }
        }
      }
      .custom-list {
        overflow-y: auto;
        max-height: 2.7rem;
        .custom-list-item {
          margin-bottom: 0.1rem;
          cursor: pointer;
          .item{
            gap: 0.12rem;
          }
          .index {
            width: 0.2rem;
            height: 0.2rem;
            line-height: 0.2rem;
            border-radius: 50%;
            background: #4787f0;
            color: #fff;
            text-align: center;
            font-size: 0.12rem;
            margin-right: 0.12rem;
          }
          &:nth-of-type(1) {
            .index {
              background: #ff7a0d;
            }
          }
          &:nth-of-type(2) {
            .index {
              background: #ffb20d;
            }
          }
          &:nth-of-type(3) {
            .index {
              background: #00bbc4;
            }
          }
          .label {
            font-family: MicrosoftYaHei;
            width: 1.4rem;
            font-size: 0.14rem;
            text-align: left;
            color: #000;
            margin-right: 0.12rem;
          }
          .value {
            background: #C7DAFF;
            .value-item {
              height: 0.08rem;
            }
          }
          .number{
            font-family: @number-font;
            font-weight: 400;
            font-size: .17rem;
            color: #000000;
            margin-right: 0.05rem;
            .unit{
              font-size: .14rem;
              color: rgba(0, 0, 0, 0.7);
            }
          }
        }
      }
    }
  }
}


</style>
<style lang="less">
.custom-popover {
  .custom-list-popover {
    font-family: MicrosoftYaHei;
    .label {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.14rem;
      margin-bottom: 0.1rem;
    }
    .value{
      font-size: 0.14rem;
      .item{
        margin-bottom: 0.06rem;
        i{
          display: inline-block;
          border-width: 0.03rem;
          width: 0.1rem;
          height: 0.1rem;
          border-style: solid;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
