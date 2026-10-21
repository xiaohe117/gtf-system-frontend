<!-- tab控件 对应设计稿 2-1 -->
<template>
	<div class="list-box">
    <div
        v-for="(item,index) in list"
        :key="index"
        :class="['list-item',{ 'list-item-active': activeIndex === index }]"
        :style = "{ height: item.height }"
        @click="clickItem(index,item)"
    >
      <img v-if="item.icon" class="icon" :src="getIconUrl(index)">
      <div class="content">
        <div class="title" :class="{ 'active': activeIndex === index }">{{ item.title }}</div>
        <div class="bottom-box">
         <div class="count" :style="{ 'font-size': item.fontSize}" :class="{ 'active': activeIndex === index }">
           {{ item.count }}
           <span class="unit" :class="{ 'active': activeIndex === index }">{{item.unit}}</span>
         </div>
          <div v-if="item.percent" class="percent" :class="{ 'active': activeIndex === index }">{{ item.percent }}%</div>
        </div>
      </div>
    </div>
	</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
      list: any;
    }>(), {}
);

const activeIndex = defineModel<number>();
const emits = defineEmits(['clickItem']);
const clickItem = (index: number,item:any) => {
  activeIndex.value = index;
  emits('clickItem', item);
};
const getIconUrl = computed(() => (index: number) => {
  const item = props.list[index];
  return activeIndex.value === index ? item.activeIcon : item.icon;
});
</script>
<style lang="less" scoped>
.list-box {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  overflow-y: auto;
  overflow-x: hidden;
  .list-item {
    cursor: pointer;
    width: 2.52rem;
    height: 0.77rem;
    background: url("@/assets/images/runByEnterprise/right/no-selected-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    padding: 0.08rem 0.24rem;
    gap: 0.24rem;
    .icon{
      width: 0.56rem;
      height: 0.56rem;
    }
    .content{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title{
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: bold;
        font-size: 0.16rem;
        color: #333333;
      }
      .bottom-box{
        display: flex;
        gap: 0.2rem;
        align-items: baseline;
        .count{
          font-family: @number-font;
          font-weight: bold;
          font-size: 0.24rem;
          color: rgba(0,0,0,0.6);
          .unit{
            font-size: 0.12rem;
          }
        }
        .percent{
          font-family: @number-font;
          font-weight: 400;
          font-size: 0.16rem;
          color: rgba(0,0,0,0.6);
        }
      }
      .active{
        color: #FFFFFF !important;
        text-shadow: 0 0.02rem 0.04rem rgba(0,0,0,0.5);
      }
    }
  }
  .list-item-active{
    width: 2.66rem;
    background: url("@/assets/images/runByEnterprise/right/blue-selected-bg.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
