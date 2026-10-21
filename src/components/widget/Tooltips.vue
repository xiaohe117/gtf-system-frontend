<!-- 提示控件 对应设计稿 2-2 -->
<template>
	<el-tooltip
		:placement="placement"
		append-to="#app"
		:show-after="showAfter"
		popper-class="widget_tooltips"
	>
		<!-- 支持通过默认插槽改变触发内容 -->
		<slot>
			<div class="tooltips_trigger"></div>
		</slot>
		<template #content>
			<div class="tooltips_content">{{ tipsContent }}</div>
		</template>
	</el-tooltip>
</template>

<script lang="ts" setup>
import type { Placement } from 'element-plus';

withDefaults(
	defineProps<{
		placement?: Placement;
		tipsContent: string;
		showAfter?: number;
	}>(),
	{
		placement: 'top',
		showAfter: 0,
	}
);
</script>

<style lang="less" scoped>
.tooltips_trigger {
	width: 0.17rem;
	height: 0.16rem;
	background-image: url('@/assets/images/uiComponents/normal_tips_icon.png');
	background-size: 100% 100%;
	margin-left: 0.08rem;
	cursor: pointer;
}
.tooltips_content {
	max-width: 4.45rem;
	padding: 0.1rem;
	background: #0d2a4c;
	border-radius: 0.04rem;
	border: 0.02rem solid #5d6b7c;
	font-size: 0.14rem;
	color: #fff;
	line-height: 0.22rem;
	text-align: justify;
}
</style>

<style lang="less">
.widget_tooltips {
	&.el-popper.is-dark {
		background-color: transparent;
		border: none;
		padding: 0;

		.el-popper__arrow {
			z-index: 0;
			&::before {
				background: #0d2a4c;
				border: 0.02rem solid #5d6b7c;
				top: -0.02rem;
			}
		}
	}

	&.el-popper[data-popper-placement^='bottom'] {
		> .el-popper__arrow {
			top: -0.01rem;
		}
	}
}
</style>
