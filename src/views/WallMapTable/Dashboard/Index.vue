<template>
	<FrameBox class="main-content">
		<div class="left-frame-box">
			<Left v-bind="$attrs" />
		</div>
		<div class="center-frame-box">
			<TitleBody name="整体对接概况">
				<DockStation v-bind="$attrs" />
			</TitleBody>
		</div>
		<div class="right-frame-box">
			<TitleBody name="未对接央企总部">
				<NotConnected v-bind="$attrs" />
			</TitleBody>
		</div>
	</FrameBox>
</template>
<script lang="ts" setup>
import DockStation from './DockStation/Index.vue';
import NotConnected from './NotConnected/Index.vue';
import Left from './Left/Index.vue';
</script>
<style lang="less" scoped>
.main-content{
	display: flex;
	:deep(.outside-content) {
		width: 100%;
		& > div {
			display: flex;
			gap: 0.2rem;
			width: 100%;
		}
	}
}
.left-frame-box,
.center-frame-box,
.right-frame-box {
	flex: 1;
	background: #fff;
	padding: 0.25rem 0.3rem;
}
</style>