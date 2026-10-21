<template>
	<div class="inputBox">
		<img
			v-if="showLeftIcon"
			class="icon-left"
			src="@/assets/images/RecruitmentByProject/icon-left.png"
		/>
		<el-input
			v-model="inputValue"
			class="inputBox-input"
			:placeholder="placeholder"
			@input="handleInput"
			@change="handleChange"
		>
			<template #suffix>
				<img
					v-if="showRightIcon"
					class="icon-rigth"
					src="@/assets/images/RecruitmentByProject/icon-rigth.png"
					alt=""
				/>
			</template>
		</el-input>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	placeholder: {
		type: String,
		default: '',
	},
	showLeftIcon: {
		type: Boolean,
		default: true,
	},
	showRightIcon: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['update:modelValue', 'input', 'change']);

const inputValue = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	},
});

const handleInput = (value) => {
	emit('input', value);
};

const handleChange = (value) => {
	emit('change', value);
};
</script>

<style scoped lang="less">
:deep(.inputBox-input) {
	.el-input__wrapper {
		transform: none !important;
		transition: none !important;
		scale: 1 !important;
		background-color: #edf4ff;
		border-radius: 0.08rem;
		margin-left: 0.35rem;
	}

	.el-input__wrapper.is-focus {
		box-shadow: none !important;
		transform: none !important;
		scale: 1 !important;
	}

	.el-input__inner {
		color: #266fe8;
		transform: none !important;
		transition: none !important;
		color: #266fe8;
		font-weight: bold;
	}
  .el-input__inner::-webkit-input-placeholder {
    font-family: PingFangSC, PingFang SC;
    color: #266FE8; /* 设置你需要的颜色 */
    font-size: @g-font-size-base; /* 设置字体大小 */
    font-style: normal; /* 设置字体样式 */
  }
  .el-input__inner::placeholder {
    font-family: PingFangSC, PingFang SC;
    color: #266FE8; /* 设置你需要的颜色 */
    font-size: @g-font-size-base; /* 设置字体大小 */
    font-style: normal; /* 设置字体样式 */
  }
}

.inputBox {
	/* width: 293.84px; */
	height: 33.32px;
	position: relative;

	.icon-left {
		width: 0.66rem;
		height: 0.66rem;
		position: absolute;
		z-index: 3;
		top: -0.18rem;
	}

	.icon-rigth {
		width: @g-font-size-medium;
	}
}
</style>
