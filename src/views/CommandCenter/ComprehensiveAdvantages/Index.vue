<template>
	<div class="comp-advantages-wrapper">
		<div class="advantages-content">
			<Advantage />
		</div>
	</div>
</template>
<script lang="ts" setup>
import Advantage from '@/views/CommandCenter/ClassifiedByIndustry/components/Advantage.vue';
</script>
<style lang="less" scoped>
.comp-advantages-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 0.18rem 0.24rem;
	background-image: url('@/assets/images/industry/bg.webp');
	background-size: 100% 100%;
	box-sizing: border-box;
	overflow: hidden;
	.advantages-content {
		flex: 1;
		min-height: 0;
		display: flex;
		gap: 0.16rem;
		margin-top: 0.2rem;
	}
}
</style>
