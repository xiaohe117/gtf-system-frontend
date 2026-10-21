<!--
 * @Descripttion:
 * @Author: zhaochao
 * @Date: 2025-06-06 16:32:06
 * @LastEditors: ycyun
 * @LastEditTime: 2025-06-23 18:44:04
-->
<template>
  <el-dialog
      v-model="dialogVisible"
      width="9rem"
      :append-to-body="true"
      :before-close="handleClose"
      title="招商作战弹框"
  >
    <DynamicTable class="table-box" :has-order="true" :tableData="tableData" :columns="columns" max-height="6rem"></DynamicTable>
  </el-dialog>
</template>
<script lang="ts" setup>
import DynamicTable from '@/components/table/DynamicTable.vue';
import {columns1, columns2, columns3, columns4} from './data';

const dialogVisible: any = ref(false);

const emit = defineEmits(['close']);

const handleClose = () => {
  dialogVisible.value = false;
  emit('close');
};
  const currentType = ref<any>(1) // 更新当前类型
const tableData = ref([]) as any;
const columns = computed<any>(() => {
  const columnMap = [columns1, columns2, columns3, columns4];
  return columnMap[currentType.value] || [];
});
const show = (data:any,type: number) => {
  tableData.value = data;
  currentType.value = type;
  dialogVisible.value = true;
};


defineExpose({ show });
</script>
<style lang="less">
.preview-file-dialog {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 !important;
}
</style>
<style lang="less" scoped>
main {
  width: 100%;
  height: 80vh;
  .iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
