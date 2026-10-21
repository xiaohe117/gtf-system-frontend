<template>
  <div class="card-wrapper">
    <slot/>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped lang="less">
.card-wrapper {
  padding: @space-size-card-inner;
  background: #ffffff;
  border-radius: 0.08rem;
  margin-top: @space-size-card;
}
</style>