<template>
	<div class="stage-card">
		<ModuleCardHeader :title="title" :show-enter="false">
			<template #left-extra>
				<slot name="left-extra" />
			</template>
		</ModuleCardHeader>
		<div class="card-body">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import ModuleCardHeader from '@/components/ModuleCardHeader.vue';

defineProps<{
	title: string;
}>();
</script>

<style lang="less" scoped>
.stage-card {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	min-width: 0;
	min-height: 0;
	margin: 0;
	padding: 0.12rem;
	background-color: transparent;
	background-image: url('@/assets/images/investmentFullProcess/card-bg.png');
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	box-shadow: 0 0 0.08rem 0 rgba(25, 43, 138, 0.34);
	overflow: hidden;
	transition:
		transform 0.2s ease,
		background-image 0.2s ease;

	> * {
		position: relative;
		z-index: 1;
	}
}

.card-body {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
	min-height: 0;
	padding: 0.04rem 0 0;
	overflow: hidden;
}
</style>
