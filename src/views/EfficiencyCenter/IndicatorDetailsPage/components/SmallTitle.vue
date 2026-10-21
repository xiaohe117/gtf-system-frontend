<template>
	<div class="small-title-wrapper">
		<div class="title-part">
			<span class="icon"></span>
			<template v-if="title">
				<span class="text" :title="title">
					{{ title }}
				</span>
			</template>
			<slot v-else name="title" />
			<slot name="append" />
		</div>
		<div class="content-part">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title?: string;
	}>(),
	{
		title: '',
	}
);
</script>

<style lang="less" scoped>
.small-title-wrapper {
	padding: 0.24rem;
	background: #ffffff;
	border-radius: 0.08rem;
	box-sizing: border-box;
}
.title-part {
	display: flex;
	align-items: center;
	font-weight: 600;
	font-size: 0.18rem;
	color: #202741;
	line-height: 0.25rem;
	overflow: hidden;
	.icon {
		display: inline-block;
		width: 0.22rem;
		height: 0.18rem;
		background-image: url('@/assets/images/IndicatorDetailsPage/title-icon.png');
		background-size: 100% 100%;
		margin-right: 0.08rem;
	}
	.text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
