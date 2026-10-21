<template>
	<div class="header-tabs">
		<div
			v-for="tab in tabs"
			:key="tab.id"
			class="tab-item"
			:class="{ active: tab.id === activeId }"
			@click="emit('change', tab.id)"
		>
			<span class="tab-label">{{ tab.label }}</span>
		</div>
		<div class="land-supermarket" @click="handleLandClick">
			<span class="land-text">招商土地超市</span>
			<img :src="landArrowImg" class="land-arrow" alt="" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import landArrowImg from '@/assets/images/industry/land-arrow.webp';
import type { TabItem } from '../type';

defineProps({
	tabs: {
		type: Array as () => TabItem[],
		required: true,
	},
	activeId: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits<{
	change: [id: number];
}>();



const handleLandClick = () => {
	window.open('https://guangdong.tianditu.gov.cn/guangzhou/zstdcs/#/', '_blank');
};
</script>

<style lang="less" scoped>
.header-tabs {
	display: flex;
	align-items: flex-end;
	gap: 0.12rem;
	width: 100%;

	.tab-item {
		height: 0.52rem;
		// width: 3.4rem;
		width: 2.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: url('@/assets/images/industry/tab-bg.webp');
		background-size: 100% 100%;
		cursor: pointer;
		&.active {
			background-image: url('@/assets/images/industry/tab-bg-act.webp');
		}

		.tab-label {
			font-family: YouSheBiaoTiHei;
			font-size: 0.24rem;
			color: #fff;
			letter-spacing: 0.02rem;
			text-shadow: 0.01rem 0.01rem 0.02rem rgba(0, 34, 161, 0.5);
			text-align: center;
		}
	}

	.land-supermarket {
		margin-left: auto;
		height: 0.38rem;
		width: 1.66rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.12rem;
		background-image: url('@/assets/images/industry/land-bg.webp');
		background-size: 100% 100%;
		cursor: pointer;

		.land-text {
			font-family:
				PingFangSC,
				'PingFang SC';
			font-weight: 500;
			font-size: 0.16rem;
			color: #165dff;
		}

		.land-arrow {
			width: 0.19rem;
			height: 0.14rem;
		}
	}
}
</style>
