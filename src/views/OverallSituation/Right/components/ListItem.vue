<!--
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2026-01-05 10:12:38
 * @LastEditors: zhaochao
 * @LastEditTime: 2026-01-05 16:37:04
-->
// 列表公共组件
<template>
	<div class="list-box">
    <div
        v-for="(item,index) in list"
        :key="index"
        :class="['list-item']"
    >
      <div class="icon" :style="{'color':colorList[index]}"></div>
  
      <div class="title">{{ splitAtLeftBrackets(item.projStage) }}</div>
      <div class="num">{{ item.projSum || '-' }}</div>
    </div>
	</div>
</template>

<script lang="ts" setup>
import type {  ProjectSummaryByDistrict} from '@/api/OverallSituation/RightModule/type';

withDefaults(
    defineProps<{
      list: ProjectSummaryByDistrict[];
    }>(), {}
);

/**
 * 在所有左括号前插入换行（安全，不破坏原字符）
 */
function splitAtLeftBrackets(text: string): string {
   if (!text) return ''
  // 把每个左括号替换为 "\n" + 原括号
  return text.replace(/\p{Ps}/gu, '\n$&')
}

const colorList = ref<string[]>(['#FF6B6B', '#FFA36C', '#FFD56B', '#6BCB77', '#4D96FF', '#845EF7', '#FF6FD8', '#FF922B']);

</script>
<style lang="less" scoped>
.list-box {
  display: flex;
  gap: 0.12rem;
  flex-wrap: wrap;
  .list-item {
    width: calc(50% - 0.06rem);
    height: 0.48rem;
    background: url("@/assets/images/OverallSituation/list-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    padding: 0.08rem;
    flex-shrink: 0;
    .icon{
      width: 0.12rem;
      height: 0.12rem;
      background: #FFFFFF;
      border-radius: 50%;
      border: 0.02rem solid;
    }
    .title{
      margin-left: 0.08rem;
      color: #333333;
      white-space: pre-line;
      // width: 0.4rem; // 限制宽度为两个字符的宽度
      word-break: break-all; // 允许在任意字符间换行
      line-height: 1.2;
      font-size: @g-font-size-base; // 根据实际字体大小调整
    }
    .num{
      flex: 1;
      text-align: right;
      margin-left: 0.2rem;
      font-weight: 600;
      font-size: @g-font-size-base;
      color: #165DFF;
    }
    .text{
      margin-left: 0.12rem;
      flex: 1;
      font-size: @g-font-size-base;
      color: #333333;
      display: flex;
      gap: 0.02rem;
      justify-content: space-between;
      .rate{
        font-weight: bold;
        font-size:@g-font-size-base;
        color: #165DFF;
      }
    }
  }
}
</style>
