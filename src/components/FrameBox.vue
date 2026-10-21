<template>
	<div :class="['outside', props.size || '']">
		<div class="outside-content">
			<div v-if="$slots.default">
				<slot />
			</div>

			<div v-if="$slots.first">
				<slot name="first" />
			</div>

			<div v-if="$slots.second">
				<slot name="second" />
			</div>

			<div v-if="$slots.third">
				<slot name="third" />
			</div>

			<div v-if="$slots.fourth">
				<slot name="fourth" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	size?: 'small' | 'short' | 'up' | 'down';
}>();
</script>

<style lang="less" scoped>
.outside {
	background: url('@/assets/images/gtf/frame-big.png') center / 100% 100% no-repeat;
	padding: 0.06rem 0.06rem 0.01rem 0.064rem;
	//max-width: 12.6rem;
	//max-height: 9.04rem;

	&.small {
		max-width: 6.08rem;
		background-image: url('@/assets/images/gtf/frame.png');
	}

	&.short {
		max-height: 7.93rem;
		background-image: url('@/assets/images/gtf/frame-short.png');
	}
	&.up {
		background-image: url('@/assets/images/gtf/up.png');
	}
	&.down {
		background-image: url('@/assets/images/gtf/down.png');
	}
	&.small-white{
		background-image: url('@/assets/images/gtf/frame-white.png');
	}
  &.short-white{
    background-image: url('@/assets/images/gtf/short-white.png');
  }

	.outside-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		padding: 0.1rem 0.1rem 0.12rem 0.1rem;
		background: rgba(255, 255, 255, 0.05);
		box-shadow:
			-0.08rem 0rem 0.2rem 0rem rgba(25, 43, 138, 0.34),
			0.08rem 0rem 0.2rem 0rem rgba(188, 200, 255, 0.5);
		border-radius: 0.11rem;
		border-top-right-radius: 0.25rem;
		overflow: hidden;

		> div {
			width: 100%;
			height: 100%;
			&:not(:last-child) {
				margin-bottom: 0.24rem;
			}
		}
	}
}
</style>
