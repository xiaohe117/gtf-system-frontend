<template>
	<div class="map-heat-switch">
		<div
			v-for="item in heatOptions"
			:key="item.key"
			class="heat-card"
			:class="{ active: activeKey === item.key }"
			@click="handleSelect(item.key)"
		>
			<div class="heat-icon">
				<img :src="item.icon" alt="" />
			</div>
			<div class="heat-name">{{ item.label }}</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import chinaIcon from '@/assets/images/map/china.svg';
import xmrltIcon from '@/assets/images/map/xmrlt.png';

export type HeatMapKey = 'visit' | 'project';

const props = withDefaults(
	defineProps<{
		modelValue?: HeatMapKey;
	}>(),
	{
		modelValue: 'visit',
	}
);

const emit = defineEmits<{
	'update:modelValue': [key: HeatMapKey];
}>();

const activeKey = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
});

const heatOptions = [
	{ key: 'visit' as const, label: '走访热力图', icon: chinaIcon },
	{ key: 'project' as const, label: '项目热力图', icon: xmrltIcon },
];

const handleSelect = (key: HeatMapKey) => {
	activeKey.value = key;
};
</script>

<style lang="less" scoped>
.map-heat-switch {
	position: absolute;
	right: 0;
	bottom: 0;
	z-index: 3;
	display: flex;
	align-items: flex-end;
	gap: 0.1rem;
}

.heat-card {
	display: flex;
	flex-direction: column;
	width: 1.08rem;
	overflow: hidden;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.92);
	border: 0.01rem solid rgba(188, 210, 255, 0.95);
	border-radius: 0.1rem;
	box-shadow: 0 0.04rem 0.12rem rgba(24, 74, 143, 0.12);
	cursor: pointer;
	transition: all 0.2s;

	.heat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 0.72rem;
		padding: 0.08rem 0.08rem 0.04rem;
		box-sizing: border-box;
		background: #e2eefc;

		img {
			width: 0.62rem;
			height: 0.52rem;
			object-fit: contain;
			opacity: 0.55;
			filter: grayscale(0.35) saturate(0.7);
		}
	}

	.heat-name {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 0.3rem;
		font-family: SourceHanSansCN;
		font-weight: 400;
		font-size: 0.14rem;
		color: #000000;
		line-height: 0.15rem;
		text-align: left;
		font-style: normal;
		white-space: nowrap;
		background: #ffffff;
	}

	&.active {
		border-color: #3d8bff;
		box-shadow: 0 0.06rem 0.16rem rgba(61, 139, 255, 0.28);

		.heat-icon {
			background: #e2eefc;

			img {
				opacity: 1;
				filter: none;
			}
		}

		.heat-name {
			font-family: SourceHanSansCN;
			font-weight: 400;
			font-size: 0.16rem;
			color: #ffffff;
			line-height: 0.15rem;
			text-align: left;
			font-style: normal;
			background: #408fff;
		}
	}

	&:hover:not(.active) {
		border-color: #8eb8ff;
	}
}
</style>
