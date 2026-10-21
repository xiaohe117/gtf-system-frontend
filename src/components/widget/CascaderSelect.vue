<template>
	<div class="custom-cascader-wrapper">
		<el-cascader
			:options="options"
			:model-value="modelValue"
			@change="handleChange"
			:clearable="clearable"
			:separator="separator"
			popper-class="custom-cascader-dropdown"
		/>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		modelValue?: string | number;
		options: Array<{ value: string | number; label: string }>;
		clearable?: boolean;
		separator?: string;
	}>(),
	{
		modelValue: '',
		options: () => [],
		clearable: true,
		separator: '',
	}
);

const emit = defineEmits(['update:modelValue', 'change']);

const handleChange = (value: string | number) => {
	emit('update:modelValue', value);
	emit('change', value);
};
</script>

<style lang="less">
/* 组件没有使用scoped ，为全局样式 。必须写在custom-cascader-wrapper或者custom-cascader-dropdown中*/
.custom-cascader-wrapper {
	width: fit-content;
	margin-left: auto;
	margin: 0 0.24rem;
	.el-cascader {
		min-width: 1.64rem;
		width: fit-content;
		max-width: 2rem;
		.el-input__wrapper {
			width: 100%;
			min-width: 1.64rem;
			max-width: 2rem;
			height: 0.32rem;
			background: #fbfcff;
			box-shadow: 0.06rem 0rem 0.1rem 0rem rgba(10, 65, 208, 0.2);
			border-radius: 0.23rem;
			border: 0.01rem solid #165dff;
			backdrop-filter: blur(0.15rem);
			display: flex;
			align-items: center;
			padding: 0;
			.el-input__inner {
				font-family:
					PingFangSC,
					PingFang SC;
				font-weight: 400;
				font-size: 0.18rem;
				color: #165dff;
				line-height: 0.25rem;
				height: 100%;
				padding-left: 0.12rem;

				&::placeholder {
					font-weight: 400;
					font-size: 0.18rem;
					color: #165dff;
				}
			}

			.el-input__suffix {
				.el-input__suffix-inner {
					.icon-arrow-down {
						width: 0;
						height: 0;
						border-left: 0.06rem solid transparent;
						border-right: 0.06rem solid transparent;
						border-top: 0.08rem solid #165dff;
						border-bottom: 0;
						font-size: 0;
						margin-right: 0.18rem;
					}
				}
			}
		}
	}
}
.custom-cascader-dropdown {
	.el-cascader-node__prefix {
		display: none;
	}
	.el-cascader-node {
		&.is-active {
			.el-cascader-node__label {
				color: #165dff !important;
			}
		}
		.el-cascader-node__label {
			color: rgba(0, 0, 0, 0.65) !important;
		}
	}
	.el-cascader-menu {
		.in-active-path {
			.el-cascader-node__label {
				color: #165dff !important;
			}
		}
	}
}
</style>
