<!-- tab控件 对应设计稿 2-1 -->
<template>
  <div class="tabs-line-control" :class="{'fx-sp-b': tabsList.length===3}">
    <el-tabs  v-model="activeIndex" @tab-click="handleTabClick">
      <el-tab-pane
          v-for="(tab, index) in tabsList"
          :key="index"
          :name="index"
      >
        <template #label>
          <span class="custom-tab-label">
            {{ tab.name }}
            <span v-if="tab.num">({{ tab.num }}</span>
            <span v-if="tab.unit">{{ tab.unit }})</span>
            <span v-if="tab.num && !tab.unit">)</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
      tabsList: any;
    }>(), {
      tabsList: () => []
    }
);
const activeIndex = defineModel<number>({ default: 0 });

const emits = defineEmits(['changeTab']);
const handleTabClick = (tabPane:any) => {
  const index = parseInt(tabPane.paneName, 10);
  emits('changeTab', props.tabsList[index],index);
};
</script>

<style lang="less" scoped>.tabs-line-control {
  display: inline-flex;
  align-items: center;
  margin: 0.16rem 0;
  gap: 0.06rem;
  :deep(.el-tabs) {
    border: none;
    width: 100%;
    .el-tabs__header {
      margin: 0;
      border: none;
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }

    // 确保 nav-wrap 不隐藏箭头
    .el-tabs__nav-wrap {
      position: relative;
    }

    .el-tabs__nav-scroll {
      // 保持默认行为以显示滚动条和箭头
    }

    .el-tabs__item {
      backdrop-filter: blur(15px);
      font-weight: 500;
      font-size: 0.14rem;
      color: rgba(0,0,0,0.5);
      line-height: 0.2rem;
      text-align: center;
      margin: 0.02rem;
      cursor: pointer;
      height: auto;
      padding: 0rem 0.05rem;
      &.is-active {
        color: #2E79F8;
      }

      &:hover {
        color: #2E79F8;
      }
    }

    .custom-tab-label{
      padding: 0rem 0.05rem;
    }

    .el-tabs__active-bar{
      background-color: #2E79F8;
    }

    // 调整左右箭头样式
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 0.2rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.8);
      border: none;
      box-shadow: 0 0 0.04rem rgba(0, 0, 0, 0.1);
      z-index: 10;

      &:hover {
        background-color: rgba(255, 255, 255, 1);
      }

      &.is-disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    .el-tabs__nav-prev {
      left: 0;
      border-radius: 0 0.04rem 0.04rem 0;
    }

    .el-tabs__nav-next {
      right: 0;
      border-radius: 0.04rem 0 0 0.04rem;
    }

    // 自定义箭头图标样式
    .el-tabs__nav-prev .el-icon,
    .el-tabs__nav-next .el-icon {
      font-size: 0.14rem;
      color: #2E79F8;
      font-weight: bold;
    }
  }

  .custom-tab-label {
    display: inline-flex;
    align-items: center;
    gap: 0.02rem;
  }
}
</style>
