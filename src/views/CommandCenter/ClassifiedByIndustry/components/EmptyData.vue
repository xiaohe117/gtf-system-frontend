<template>
	<div class="empty-data">
		<img src="@/assets/images/industry/emty.webp" class="empty-img" alt="" />
		<div class="empty-text">
			<slot>暂无数据</slot>
		</div>
	</div>
</template>

<style lang="less" scoped>
.empty-data {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.08rem;

	.empty-img {
		width: 1.74rem;
		height: 1rem;
		object-fit: contain;
	}

	.empty-text {
		font-family: 'PingFang SC', PingFangSC;
		font-weight: 500;
		font-size: 0.2rem;
		color: #666;
	}
}
</style>
