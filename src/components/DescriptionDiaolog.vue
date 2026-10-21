<template>
	<el-dialog v-model="dialogVisible" :width="width" class="tips-dialog" @close="close">
		<template #header>
			<div class="my-header">
				<div class="title">
					<span class="title-bg"></span>
					<span class="text">{{ title }}</span>
				</div>
			</div>
		</template>

		<Description :contentArray="content" />
	</el-dialog>
</template>

<script setup lang="ts">
    
import Description from '@/components/Description.vue';

defineProps({
	width: {
		type: String,
		default: '8.85rem',
	},
});

const title = ref<string>('');
const content = ref<any>([]);

const dialogVisible = ref(false);
const show = (_title: string, _content: any) => {
	dialogVisible.value = true;
	title.value = _title;
	content.value = _content;
};

function close() {
	dialogVisible.value = false;
	title.value = '';
	content.value = [];
}
defineExpose({ show });
</script>

<style lang="less" scoped>
.my-header {
	height: 0.6rem;
	display: flex;
	align-items: center;
	border-bottom: 0.01rem solid #aaccff;
}
.title {
	position: relative;
	padding: 0.02rem 0 0.04rem 0.28rem;
	text-align: left;

	.title-bg {
		display: inline-block;
		position: absolute;
		left: 0;
		top: 0;
		width: 1.96rem;
		height: 0.42rem;
		background-image: url('@/assets/images/OverallSituation/tips-title-bg.png');
		background-size: 100% 100%;
		&::before {
			margin: 0.05rem 0.16rem 0.09rem 0.07rem;
			display: inline-block;
			content: '';
			width: 0.05rem;
			height: 0.2rem;
			background-image: url('@/assets/images/OverallSituation/tips-title-blue.png');
			background-size: 100% 100%;
		}
	}
	.text {
		font-weight: 600;
		font-size: 0.22rem;
		color: rgba(0, 0, 0, 0.85);
		line-height: 0.28rem;
	}
}
</style>
<style lang="less">
.tips-dialog {
	padding: 0;
	.el-dialog__header.show-close {
		padding-right: 0;
	}
	.el-dialog__headerbtn {
		width: 0.63rem;
		height: 0.56rem;
	}
	.el-dialog__header {
		padding: 0;
	}
	.el-dialog__body {
		padding: 0.24rem;
	}
}
</style>
