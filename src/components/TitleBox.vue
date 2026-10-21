<template>
	<div class="title-container fx-c">
		<div
			class="header"
			:style="{ justifyContent: $slots.extra ? 'space-between' : 'flex-start' }"
		>
			<div class="name">
				<span>{{ props.name }}</span>
			</div>
			<div><slot name="extra"></slot></div>
		</div>
		<div class="title-body-content">
			<slot></slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
	name: string;
}>();
</script>
<style lang="less" scoped>
.title-container {
	// width: 100%;
	// height: 100%;
}
.header {
	display: flex;
	align-items: baseline;
	margin-bottom: 0.16rem;

	.name {
		min-width: 1.61rem;
		min-height: 0.44rem;
		background: url('@/assets/images/gtf/water-proof.png') top left / 1.61rem 0.44rem no-repeat;

		> span {
			display: inline-block;
			padding-top: 0.1rem;
			padding-left: 0.14rem;
			font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
			font-size: 0.3rem;
			line-height: 0.25rem;
			color: transparent;
			background-clip: text;
			background-image: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
		}
	}
}
.title-body-content {
	width: 100%;
	height: 100%;
}
</style>
