<!--
 * @Descripttion: 整体概况右侧
 * @Author: lj
 * @Date: 2025-08-12 9:58:31
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-12-16 10:25:32
-->
<template>
  <FrameBox class="aim-enterprise-overview" size="small-white">
    <TitleBody name="重点目标企业挂图作战" class="target-enterprise">
      <div class="enterprise-list">
        <template v-if="enterpriseList.length > 0">
          <div
              v-for="(item, index) in enterpriseList"
              :key="index"
              class="enterprise-item"
          >
            <div class="left-dec">
              <div class="name">{{item.label}}</div>
              <div class="count">{{item.totalCount || 0}}
                <div class="unit">家</div>
              </div>
            </div>
            <div class="progress-box">
              <div class="progress-text">
                <div class="label">已对接</div>
                <div class="value">{{item.subCount || 0}}</div>
                <div class="unit1">家</div>
                <div class="rate">{{item.ratio || 0}}%</div>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-inner" :style="{ width: `${item.ratio}%` }"></div>
              </div>
            </div>
          </div>
        </template>
        <default-empty-container :height="'2.37rem'" v-else />
      </div>
      <div class="goto-special" @click="goToSpecial"></div>
    </TitleBody>
    <TitleBody name="目标企业整体跟进概况" >
      <div class="enterprise-follow">
        <RoundRectTabs v-model="selectedTab" :tabsList="tabsList" />
        <el-tabs v-model="activeOrder" @tab-click="handleTabClick">
          <el-tab-pane
              v-for="item in orderListTab"
              :label="item.label"
              :name="item.value"
              :key="item.value"
          />
        </el-tabs>
        <!-- 自定义列表数据 -->
        <div class="custom-list-box" ref="customListRef">
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
          <div class="custom-list" v-if="rightTableList.length > 0">
            <div
                v-for="(item, index) in rightTableList"
                :key="index"
                class="custom-list-item"
            >
              <div class="fx-r fx-al-c">
                <div class="index">{{ index + 1 }}</div>
                <div class="label overflow-ellipsis" :title="item.name">
                  {{ item.name }}
                </div>
                <div class="value fx-r fx-1">
                  <div
                      class="value-item"
                      v-for="(legend, legendIndex) in customLegend"
                      :key="legendIndex"
                      :style="{
												background: legend.color,
												width:
													(item[legend.prop] / maxTableValue) * 100 + '%',
											}"
                      @mouseover="handleMouseover(item, $event)"
                      @mouseout="handleMouseout"
                  />
                </div>
              </div>
            </div>
          </div>
          <default-empty-container :height="'3.3rem'" v-else />
          <!-- 鼠标移入提示信息 -->
          <div
              class="custom-list-popover"
              v-show="isShowTooltip"
              :style="{
								left: toolTipPosition.x + 'px',
								top: toolTipPosition.y + 'px',
								minWidth: '1.6rem',
							}"
          >
            <div class="label">{{ currentNode.name }}</div>
            <div class="value">
              <div
                  v-for="(legend, legendIndex) in customLegend"
                  :key="legendIndex"
                  class="item"
              >
                <i :style="{ borderColor: legend.color }"></i>
                {{ legend.label }} {{ currentNode[legend.prop] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TitleBody>
  </FrameBox>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {getSize} from "@/utils";
import {queryKeyTargetList} from "@/api";

const router = useRouter();
const tabsList = ref<any>(['各区', '市直单位', '国企平台']);
const rightTableList = ref<any[]>([]);
const maxTableValue = ref<number>(0);
const selectedTab = ref<any>(0);
const activeOrder = ref('orderByEnterprise');
const toolTipPosition = ref({ x: 0, y: 0 });
const isShowTooltip = ref<boolean>(false);
const customListRef = ref<any>(null);
const enterpriseList = ref<any[]>([]);
const handleKeyEnterprise = async () => {
  try {
    const res = await queryKeyTargetList<any>();
    console.log(res);
    enterpriseList.value = res?.data || [];
  } catch (error) {
    console.log(error);
  }
};
handleKeyEnterprise()

const customLegend = computed(() => [
  {
    label: '跟进有接洽企业',
    prop: 'concatCompanyCount',
    color: '#408FFF',
  },
  {
    label: '跟进企业',
    prop: 'followCompanyCount',
    color: '#F5CA45',
  },
]);
const orderListTab = ref<any>([
  {
    label: '按跟进企业数量排',
    value: 'orderByEnterprise',
  },
  {
    label: '按有工作记录排',
    value: 'orderByRecords',
  },
  {
    label: '按默认顺序',
    value: 'defaultOrder',
  },
]);
const currentNode = ref<any>({});
const getRightTabData = () => {
  let data: any = [];
  if (selectedTab.value === 0) {
    data = [];
  } else if (selectedTab.value === 1) {
    data =[];
  } else if (selectedTab.value === 2) {
    data = [];
  }
  if (activeOrder.value === 'orderByEnterprise') {
    data = data.sort((a: any, b: any) => b.followCompanyCount - a.followCompanyCount);
  } else if (activeOrder.value === 'orderByRecords') {
    data = data.sort(
        (a: any, b: any) =>
            b.followCompanyCount +
            b.concatCompanyCount -
            (a.followCompanyCount + a.concatCompanyCount)
    );
  } else {
    data = data.sort((a: any, b: any) => b.concatCompanyCount - a.concatCompanyCount);
  }
  rightTableList.value = data;

  let maxValue: any = 0;
  customLegend.value.forEach((item: any) => {
    maxValue += Math.max(...rightTableList.value.map((list: any) => list[item.prop]));
  });
  maxTableValue.value = maxValue;
};
const handleTabClick = () => {
  nextTick(() => {
    getRightTabData();
  });
};
watch(
    () => selectedTab.value,
    () => {
      activeOrder.value = 'orderByEnterprise';
      getRightTabData();
    },
    {
      immediate: true,
    }
);
const goToSpecial = () => {
  router.push({
    path: '/wallMapTable',
    query: {},
  });
};
const handleMouseover = (item: any, $event: any) => {
  currentNode.value = item;
  const basePosition = customListRef.value.getBoundingClientRect();
  isShowTooltip.value = true;
  toolTipPosition.value.x = $event.clientX - basePosition.x + getSize(20);
  toolTipPosition.value.y = $event.clientY - basePosition.y - getSize(10);
};
const handleMouseout = () => {
  isShowTooltip.value = false;
};
</script>
<style lang="less" scoped>
.aim-enterprise-overview {
  flex-shrink: 0;
  height: 9.48rem;
  width: 4.58rem;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.14rem;
  font-family: MicrosoftYaHei;
  :deep(.outside-content) {
    padding-top: 0.24rem;
    padding-right: 0.14rem;
    > div,
    .title-container {
      height: auto;
    }
    .header {
      margin-bottom: 0;
    }
  }
  .target-enterprise{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 0.34rem;
    .enterprise-list{
      display: flex;
      flex-direction: column;
      margin-top: 0.12rem;
      .enterprise-item{
        width: 100%;
        display: flex;
        height: 0.79rem;
        background: url('@/assets/images/runByEnterprise/right/target-bg1.png') no-repeat
        center;
        background-size: 100%;
        padding-left: 0.88rem;
        color: #FFFFFF;
        font-size: 0.16rem;
        .left-dec{
          padding-top: 0.1rem;
          .name{
            width: 0.8rem;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            text-shadow: 0 0.02rem 0.04rem rgba(0,0,0,0.5);
          }
          .count{
            display: flex;
            align-items: center;
            justify-items: flex-start;
            font-weight: 500;
            text-shadow: 0 0.02rem 0.04rem rgba(0,0,0,0.5);
            font-weight: bold;
            font-family: @number-font;
            font-size: 0.24rem;
            .unit{
              font-family: PingFangSC, PingFang SC;
              font-weight: 500;
              text-shadow: 0 0.02rem 0.04rem rgba(0,0,0,0.5);
              font-size: 0.14rem;
              color: #FFFFFF;
              margin-left: 0.07rem;
            }
          }
        }

        .progress-box{
          width: 1.68rem;
          margin-left: 0.4rem;
          display: flex;
          flex-direction: column;
          padding-top: 0.16rem;
          .progress-text{
            height: 0.25rem;
            display: flex;
            color: rgba(0,0,0,0.6);
            justify-content: space-between;
            align-items: center;
            .label{
              font-family: MicrosoftYaHei;
              font-size: 0.14rem;
              margin-right: 0.24rem;
            }
            .value{
              font-size: 0.2rem;
              font-weight: bold;
              font-family: @number-font;
              color: rgba(0,0,0,0.6);
            }
            .unit1{
              font-family: MicrosoftYaHei;
              margin-left: 0.02rem;
              font-family: MicrosoftYaHei;
              font-size: 0.14rem;
              color: rgba(0,0,0,0.6);
              margin-right: 0.28rem;
            }
            .rate{
              font-family: @number-font;
              color: rgba(0,0,0,0.6);
              font-weight: bold;
              font-size: 0.16rem;
              color: rgba(0,0,0,0.6);
            }

          }
          .progress-bar{
            width: 1.68rem;
            height: 0.09rem;
            background: #FFF0E0;
            .progress-bar-inner{
              height:100%;
              background: linear-gradient( 270deg, #FFDC68 0%, #FE793B 100%);
            }
          }

        }

      }
      .enterprise-item:nth-child(2){
        background: url('@/assets/images/runByEnterprise/right/target-bg2.png') no-repeat
        center;
        background-size: 100%;
      }
      .enterprise-item:nth-child(3){
        background: url('@/assets/images/runByEnterprise/right/target-bg3.png') no-repeat
        center;
        background-size: 100%;
      }
    }

    .goto-special {
      cursor: pointer;
      height: 0.28rem;
      line-height: 0.28rem;
      font-family: MicrosoftYaHei;
      font-size: 0.14rem;
      color: #176bf9;
      text-align: center;
      background: url('@/assets/images/runByEnterprise/right/wall-chart-bg.png') no-repeat
      center;
      background-size: 100%;
      margin-top: 0.18rem;
    }
  }
  .enterprise-follow {
    margin-top: 0.15rem;
    .tabs-control {
      width: 4.22rem;
      :deep(.tabs-control_item) {
        font-size: 0.14rem;
        height: 0.3rem;
        display: flex;
        align-items: center;
      }
    }
    .el-tabs {
      margin-top: 0.2rem;
    }
    .custom-list-box {
      position: relative;

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
        padding: 0 0.2rem;
        overflow-y: auto;
        height: 3.3rem;
        .custom-list-item {
          margin-bottom: 0.1rem;
          cursor: pointer;
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
            max-width: 1.3rem;
            text-align: left;
            color: #000;
            margin-right: 0.12rem;
          }

          .value {
            .value-item {
              height: 0.08rem;
            }
          }
        }
      }
      .custom-list-popover {
        font-family: MicrosoftYaHei;
        position: absolute;
        z-index: 2;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.1rem;
        border-radius: 0.04rem;
        box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.1);
        .label {
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.14rem;
          margin-bottom: 0.1rem;
          font-weight: 600;
        }
        .value {
          font-size: 0.14rem;
          .item {
            margin-bottom: 0.06rem;
            i {
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
  }

  .matter {
    .more-icon {
      cursor: pointer;
      width: 1.6rem;
      height: 0.38rem;
      background-image: url('@/assets/images/runByEnterprise/newDetail/left-main-enter-icon.png');
      background-size: 100% 100%;
      font-size: 0.14rem;
      color: #165dff;
      text-align: center;
      line-height: 0.38rem;
    }
    .matter-top {
      width: 100%;
      height: 0.66rem;
      background: url('@/assets/images/runByEnterprise/left/trends-top.png') no-repeat center;
      background-size: 100%;
      text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 0.14rem;
      padding-left: 0.14rem;
      margin-top: 0.16rem;
      .label {
        font-size: 0.16rem;
        font-weight: 500;
      }
      .value {
        font-size: 0.24rem;
        font-weight: bold;
        font-family: @number-font;
      }
    }
    .chart-box {
      height: 2rem;
    }
  }
  .key-ranking {
    margin-top: 0.16rem;
    :deep(.tabs-control) {
      > div {
        padding: 0rem 0.1rem;
      }
    }
    .main-content {
      padding-left: 0.12rem;
      padding-right: 0.08rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 5.3rem;
      padding-bottom: 0.15rem;
      .rank-list-box {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        .list-items {
          align-items: center;
          .list-common-item {
            text-align: center;
            font-weight: 500;
            font-size: 0.16rem;
            color: rgba(0, 0, 0, 0.7);
            line-height: 0.22rem;
            flex: 1;
            &:nth-child(1) {
              flex: 0.5;
            }
            &:nth-child(2) {
              flex: 2;
            }
            &.text-ellipsis {
              text-align: left;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &.rank-desc {
              display: flex;
              gap: 0.04rem;
              align-items: center;
              justify-content: center;
              > div {
                width: 0.55rem;
                height: 0.18rem;
                background: #00c462;
                border-radius: 0.01rem;
                font-family: MicrosoftYaHei;
                font-size: 0.11rem;
                color: #ffffff;
                line-height: 0.18rem;
                &.yellow {
                  background: #ffc359;
                }
              }
            }
          }
          &.header {
            margin-bottom: 0.11rem;
          }
          &.body-items {
            position: relative;
            cursor: pointer;
            height: 0.36rem;
            background: rgba(169, 181, 255, 0.1);
            border-radius: 1rem;
            border: 0.01rem solid #ffffff;
            &:not(:last-child) {
              margin-bottom: 0.05rem;
            }
          }
          &.active {
            background: linear-gradient(180deg, #1b4df4 0%, #5dc9fc 100%);
            .list-common-item {
              color: #ffffff;
            }
            &::after {
              position: absolute;
              right: -0.22rem;
              content: '';
              display: inline-block;
              width: 0;
              height: 0;
              border-top: 0.16rem solid transparent;
              border-bottom: 0.16rem solid transparent;
              border-left: 0.16rem solid #ff8900;
            }
          }
        }
      }
    }
  }
}
</style>
