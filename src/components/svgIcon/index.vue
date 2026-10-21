<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-19 10:37:02
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-13 15:25:01
-->
<template>
  <svg
    class="icon"
    :class="[$attrs.class, 'icon-' + name]"
    :style="iconStyle"
    aria-hidden="true"
  >
    <use :href="`#icon-${name}`"></use>
  </svg>
</template>
 
<script setup>
// 接收外部属性
const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => true
      // 可选：验证图标名称是否存在}
  },
  size: {
    type: [Number, String],
    default: '.2rem',
  },
});
// 计算最终样式
const iconStyle = computed(() => ({
  width: props.size,
  height: props.size
}));
</script>
<script>
export default {
  name: "SvgIcon",
  inheritAttrs: false, // 阻止默认继承，避免属性重复应用
};
</script>
<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  fill: currentColor; 
  outline:none;
}
 
/* 解决样式穿透问题 */
:deep(svg) {
  width: 100%;
  height: 100%;
 
}
/* 隐藏 SVG 内部的 title 标签，防止浏览器显示原生 tooltip */
:deep(svg title) {
  display: none !important;
}
</style>