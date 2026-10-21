<template>
	<header>
		<div class="title">{{ title }}</div>
		<div class="tip">*{{tip}}</div>
		<div class="switch" v-if="isShow">
			非必填项：<el-switch
				v-model="showRequired"
				inline-prompt
				active-text="显示"
				inactive-text="隐藏"
				@change="change"
			/>
		</div>
    <slot></slot>
	</header>
</template>
<script lang="ts" setup>
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: true,
	},
	title: {
		type: String,
		default: '',
	},
    tip:{
        type: String,
		default: '',
    },
  isShow:{
    type: Boolean,
    default: true
  }
});
const showRequired = ref();
watch(
	() => props.modelValue,
	() => {
		showRequired.value = props.modelValue;
	},
	{ immediate: true, deep: true }
);
const emits = defineEmits(['change', 'update:modelValue']);
const change = () => {
	emits('update:modelValue', showRequired.value);
	emits('change', showRequired.value);
};
</script>
<style lang="less" scoped>
header {
	height: 1.01rem;
	display: flex;
	align-items: center;
	color: rgba(0, 0, 0, 0.85);
	background: url('@/assets/images/FormFillPage/header-bg.png');
	background-size: 100% 100%;
	margin-bottom: 0.24rem;

	.title {

		font-family: YouSheBiaoTiHei;
		font-size: 0.36rem;
		color: #ffffff;
		line-height: 0.4rem;
		text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
		padding-left: 0.87rem;
	}
	.tip {
    flex: 1;
    margin-left: 3.5rem;
		margin-right: 0.18rem;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 0.2rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.28rem;
	}
	.switch {
		font-weight: 400;
		font-family: PingFangSC, PingFang SC;
    color: rgba(0,0,0,0.9);
    font-size: 0.2rem;
		.el-switch {
			--el-switch-on-color: #2f6bef;
			font-size: 0.16rem;
			height: 0.32rem;
			line-height: 0.2rem;
			:deep(.el-switch__inner) {
				font-size: 0.16rem;
			}
			:deep(.el-switch__core) {
				height: 0.32rem;
				border-radius: 0.14rem;
			}
		}

		:deep(.el-switch__core .el-switch__inner) {
			padding: 0 0.16rem 0 0.38rem;
		}
		:deep(.el-switch.is-checked .el-switch__core .el-switch__inner) {
			padding: 0 0.38rem 0 0.16rem;
		}
		:deep(.el-switch .el-switch__core .el-switch__action) {
			left: 0.01rem;
		}

		:deep(.el-switch.is-checked .el-switch__core .el-switch__action) {
			left: calc(100% - 0.23rem);
		}
		:deep(.el-switch__core .el-switch__action) {
			width: 0.23rem;
			height: 0.23rem;
		}
	}
}
</style>
