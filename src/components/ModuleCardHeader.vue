<template>
	<header class="module-header">
		<div class="header-left">
			<span class="module-title">{{ title }}</span>
			<slot name="left-extra" />
		</div>
		<button v-if="showEnter" class="enter-btn" type="button" @click="emit('enter')">
			<img src="@/views/newOverallSituation/image/more.png" alt="" />
		</button>
	</header>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string;
		showEnter?: boolean;
	}>(),
	{
		showEnter: true,
	}
);

const emit = defineEmits(['enter']);
</script>

<style lang="less" scoped>
.module-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-width: 0;
}

.header-left {
	position: relative;
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	overflow: visible;
	height: 0.46rem;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 1.01rem;
		height: 0.35rem;
		background: url('@/assets/images/investmentFullProcess/title-bg.png') left center / 100%
			100% no-repeat;
		pointer-events: none;
	}
}

.module-title {
	margin-left: 0.22rem;
	flex-shrink: 0;
	font-family: AlimamaShuHeiTi;
	font-weight: bold;
	font-size: 0.24rem;
	color: #165DFF;
	line-height: 0.29rem;
	text-shadow: 0.02rem 0.02rem 0rem #ffffff;
}

.enter-btn {
	flex-shrink: 0;
	width: 0.9rem;
	height: 0.28rem;
	padding: 0;
	border: 0;
	background: transparent;
	cursor: pointer;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}
</style>
