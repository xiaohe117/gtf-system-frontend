<template>
	<Header />
	<AppMain />
</template>

<script setup lang="ts">
import { Header, AppMain } from './components';
// import { AppMain } from './components';
</script>

<style lang="less" scoped>
.main-container {
	display: flex;
	overflow: hidden;
}
</style>
