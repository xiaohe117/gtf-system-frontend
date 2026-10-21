<template>
  <div class="chart-box">
    <SmallTitle :title="title">
      <!-- <el-select
        v-model="valueSelect"
        placeholder="请选择"
        popper-class="custom-header"
        class="date-part"
        @change="handleChange"
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <BaseChart
        :chartOption="chartOption"
        width="100%"
        height="3.35rem"
        v-bind="$attrs"
      />
    </SmallTitle>
  </div>
</template>

<script setup lang="ts">
import SmallTitle from './SmallTitle.vue';
import { barLineOption } from './chartOptions';

interface Option {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    selectOptions: Option[];
    chartData: Object;
  }>(),
  {
    title: '',
    selectOptions: () => [],
    chartData: () => ({}),
  }
);

// const emits = defineEmits(['handleSelectChange']);

// const valueSelect = ref('');
const chartOption = computed(() => barLineOption(props.chartData));

// const handleChange = (vl: any) => {
//   emits('handleSelectChange', vl);
// };

// onMounted(() => {
//   valueSelect.value = props.selectOptions?.[0]?.value;
// });
// watch(
//   () => props.selectOptions,
//   (newVl) => {
//     valueSelect.value = newVl?.[0]?.value;
//   },
//   {
//     deep: true,
//   }
// );
</script>

<style lang="less" scoped>
.chart-box {
  position: relative;
  height: 4.08rem;
  // margin-top: 0.24rem;
}
.date-part {
  position: absolute;
  top: 0.45rem;
  right: 0.24rem;
  z-index: 2;
  width: 1.8rem;
  :deep(.el-input__inner) {
    height: 0.32rem !important;
    line-height: 0.32rem;
    font-weight: 400;
    font-size: 0.14rem;
    color: rgba(0, 0, 0, 0.65);
  }
}
:deep(.tooltips-part) {
  padding: 0.2rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0rem 0.02rem 0.1rem 0.04rem rgba(0, 0, 0, 0.08);
  border-radius: 0.08rem;
  border: 0.02rem solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) 2 2;
  backdrop-filter: blur(0.07rem);
  .title {
    font-weight: 500;
    font-size: 0.16rem;
    color: rgba(0, 0, 0, 0.85);
  }
  .tag {
    margin-left: 0.08rem;
    padding: 0.01rem 0.08rem;
    background: #e6f7ff;
    border-radius: 0.02rem;
    border: 0.01rem solid #91d5ff;
    font-weight: 400;
    font-size: 0.12rem;
    color: #1890ff;
    line-height: 0.2rem;
  }
  .items {
    padding-top: 0.16rem;
    .icon {
      width: 0.14rem;
      height: 0.14rem;
      background: #0769ff;
      border-radius: 0.02rem;
      margin-right: 0.08rem;
      &.line {
        width: 0.14rem;
        height: 0.04rem;
        background: #0769ff;
        border-radius: 0.02rem;
      }
    }
    .label,
    .value {
      font-weight: 400;
      font-size: 0.16rem;
      color: #202741;
    }
    .label {
      padding-right: 0.16rem;
    }
  }
}
</style>

<style lang="less">
.custom-header {
  .el-select-dropdown__item {
    font-weight: 400 !important;
    font-size: 0.14rem !important;
  }
}
</style>
