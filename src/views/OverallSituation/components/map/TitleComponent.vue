<template>
	<div class="modal-overlay">
		<div class="modal-container" @click.stop>
			<div class="modal-header">
				<h3 class="modal-title">{{ title }}</h3>
				<span class="total-count">共{{ total }}家</span>
				<span class="view-details-btn" @click="handleExpand">展开</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title?: string;
		total?: number;
		visible?: boolean;
	}>(),
	{
		title: '',
		total: 0,
		visible: false,
	}
);

const emit = defineEmits(['view-expand']);

const handleExpand = () => {
	emit('view-expand');
};
</script>

<style scoped lang="less">
.modal-overlay {
	width: 2.5rem;
	position: absolute;
	left: 0.1rem;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: fadeIn 0.3s ease;
}

.modal-container {
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 0.08rem 0.08rem 0 0;
	width: 100%;
	box-shadow: 0 0.1rem 0.25rem rgba(0, 0, 0, 0.1);
	transition:
		transform 0.3s ease,
		opacity 0.3s ease;
	transform: translateY(0);
	opacity: 1;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	line-height: 0.39rem;
	background: rgba(142, 197, 255, 0.5);
	border-radius: 0.08rem 0.08rem 0 0;
	border-bottom: 0.01rem solid #aaccff;
	padding: 0 0.2rem 0 0.16rem;
	font-family: PingFangSC-Medium;
	font-size: 0.16rem;
	color: #333;
	font-weight: 700;
	position: relative;

	.modal-title {
		white-space: nowrap;
	}

	.total-count {
		font-size: 0.18rem;
		white-space: nowrap;
		margin-left: auto;
	}

	.view-details-btn {
		color: #2f71ff;
		cursor: pointer;
		margin-left: 0.2rem;
	}

	.close-btn {
		position: absolute;
		right: -0.1rem;
		top: -0.1rem;
		background: none;
		border: none;
		color: #64748b;
		width: 0.3rem;
		height: 0.3rem;
		cursor: pointer;
		transition: color 0.2s ease;
		background-image: url('@/assets/images/gtf/close.png');
		background-size: 100% 100%;
	}
}
</style>
