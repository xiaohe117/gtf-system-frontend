<template>
	<div class="title-part">
		<div class="title-part-left">
			<span class="icon"></span>
			<template v-if="multiple">
				<span
					v-for="(tab, index) in tabs"
					:key="index"
					:class="{ selected: index === activeTab }"
					class="tab-item"
					@click="handleTab(index)"
				>
					{{ tab }}
				</span>
			</template>
			<span v-else class="title-part-text">{{ props.title }}</span>
			<slot name="tag" />
		</div>
		<div class="title-part-right">
			<slot name="btn" />
		</div>
	</div>
</template>
<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		title?: string;
		multiple?: boolean;
		tabs?: string[];
	}>(),
	{
		title: '',
		multiple: false,
		tabs: () => [],
	}
);
const activeTab = ref(0);
const emit = defineEmits(['changeTab']);
const handleTab = (index: number) => {
	activeTab.value = index;
	emit('changeTab', index);
};
</script>
<style scoped lang="less">
.title-part {
	position: relative;
	display: flex;
	align-items: center;
	font-weight: 600;
	font-size: 0.18rem;
	color: @text-color-primary;
	line-height: 0.25rem;
	margin-bottom: 0.2rem;
	.title-part-right {
		position: absolute;
		right: 0;
		top: 0;
	}
	.title-part-left {
		flex: 1;
		.icon {
			display: inline-block;
			width: 0.22rem;
			height: 0.18rem;
			// background-image: url('@/assets/images/IndicatorDetailsPage/title-icon.png');
			background-size: 100% 100%;
			margin-right: 0.08rem;
		}
	}
}
.tab-item {
	cursor: pointer;
	font-weight: 400;
	margin-right: 0.35rem;
	color: @text-color-regular;
	&.selected {
		font-weight: 600;
		color: @text-color-primary;
	}
}
</style>
