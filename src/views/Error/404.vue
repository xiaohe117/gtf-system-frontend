<template>
	<div class="layout-container">
		<HeaderComponent />
		<div class="layout-main">
			<div class="content">
				<div class="left">
					<img src="@/assets/images/noPermission/404.png" alt="" />
				</div>
				<div class="right">
					<p class="txt">抱歉，您暂无权限访问此页面</p>
					<div class="btn" @click="handleClick">返回</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/layout/components/Header/NewIndex.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// const appStore = useAppStore();

const handleClick = () => {
	router.go(-1);
};

onMounted(() => {
	// appStore.initTagsViewVisible();
});
</script>

<style lang="less" scoped>
.layout-container {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.layout-main {
	flex: 1;
	display: flex;
	overflow: hidden;
	// background-image: url('@/assets/images/common/bg.png');
	// background-size: 100% 100%;
	background-repeat: no-repeat;
}

.content {
	width: 100%;
	height: calc(100% - 0.6rem);
	margin: 1.2rem 0.2rem 0.2rem 0.2rem;
	border-radius: 0.08rem;
	box-sizing: border-box;
	position: relative;
	display: flex;
}
.left {
	width: 6.96rem;
	height: 6.96rem;
	margin: 1.19rem 0 0 2.11rem;
	img {
		width: 6.96rem;
		height: 6.96rem;
	}
}
.right {
	margin-top: 3.5rem;
	h3 {
		font-size: 0.66rem;
		font-weight: bold;
		color: #333;
	}
	.btn {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: 0.27rem;
		color: #ffffff;
		background: #2f6bef;
		border-radius: 0.04rem;
		padding: 0.1rem 0.2rem;
		cursor: pointer;
		display: inline-block;
		margin-top: 0.25rem;
	}
	.txt {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 600;
		font-size: 0.66rem;
		color: rgba(0, 0, 0, 0.65);
		margin-top: 0.8rem;
	}
}
</style>
