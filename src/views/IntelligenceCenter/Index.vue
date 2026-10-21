<template>
	<div>IntelligenceCenter</div>
</template>

<script setup lang="ts">
onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});
onBeforeMount(() => {});
</script>

<style lang="less" scoped></style>
