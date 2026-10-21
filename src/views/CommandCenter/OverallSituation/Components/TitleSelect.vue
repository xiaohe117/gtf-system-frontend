<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-29 10:06:46
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-13 15:13:45
-->
<template>
	<div class="title-part">
		<div class="title-part-tabs" v-if="tabs && tabs.length > 0">
			<div
				v-for="(item, index) in tabs"
				:key="index"
				class="title-part-tabs-item"
				:class="{ active: activeTab === item.value }"
				@click="selectTab(item)"
			>
				<span class="text">{{ item.name }}</span>
				<el-tooltip v-if="item.tipText" :content="item.tipText" placement="bottom">
					<SvgIcon name="tip" size="0.28rem" />
				</el-tooltip>
			</div>
		</div>
		<div class="title-part-left" v-else>
			{{ props.title }}
			<slot name="tag" />
		</div>

		<slot name="left-cont" />

		<div class="title-part-right">
			<slot name="btn" />
		</div>
	</div>
	<!-- <div class="Solid"></div> -->
</template>
<script setup lang="ts">
interface tabsItem {
	name: string;
	value: number;
	tipText?: string;
	cycle?:string[]
}

const emit = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(
	defineProps<{
		title?: string;
		tabs?: tabsItem[] | undefined;
		modelValue?: string | number;
	}>(),
	{
		title: '',
		tabs: undefined,
		modelValue: '',
	}
);
const activeTab: any = ref('');
watch(
	() => props.modelValue,
	() => {
		activeTab.value = props.modelValue;
	},
	{ immediate: true, deep: true }
);
const selectTab = (obj: any) => {
	if (activeTab.value === obj.value) {
		return;
	}
	activeTab.value = obj.value;
	emit('update:modelValue', activeTab.value);
	emit('change', activeTab.value);
};
</script>
<style scoped lang="less">
.title-part {
	position: relative;
	display: flex;
	align-items: center;
	font-weight: 600;
	font-size: 0.22rem;
	color: rgba(0, 0, 0, 0.88);
	position: relative;
	
	border: .01rem solid #AACCFF;
	.title-part-tabs {
		display: flex;
		box-sizing: border-box;
		&-item {
			display: flex;
			padding-top: 0.16rem;
			padding-bottom: 0.16rem;
			align-items: center;
			text-indent: 0.16rem;
			cursor: pointer;
			&:first-child {
				padding-left: 0.24rem;
				.text {
					margin-left: 0;
				}
				&.active {
					background: url('@/assets/images/common/title-tabs-active-first.png');
					background-size: 100% 100%;
				}
			}
			&.active {
				background: url('@/assets/images/common/title-tabs-active-other.png');
				background-size: 100% 100%;
				padding-left: 0.24rem;
				padding-right:0.16rem;
				.text {
					color: #165dff;
				}
				:deep(.icon) {
					color: #165dff;
				}
			}
			.text {
				display: inline-block;
				color: #999999;
			}
			:deep(.icon) {
				color: #87b5ff;
				margin-left: -0.18rem;
				position: relative;
				z-index: 2;
			}
		}
	}
	.title-part-left,
	.text {
		padding: 0.01rem 0.36rem 0.01rem 0;
		margin-left: 0.16rem;
		white-space: nowrap;
	}
	.title-part-left,
	.title-part-tabs-item.active .text {
		
		position: relative;
		
		&::before {
			content: '';
			display: inline-block;
			width: 0.05rem;
			height: 0.2rem;
			background: #165dff;
			border-radius: 0.03rem;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
		}
		&::after{
			content: '';
			display: inline-block;
			width: 0.64rem;
			height: 0.2rem;
			background-image: url('@/assets/images/DeptOverview/water-logo.png');
			background-size: 100% 100%;
			position: absolute;
			left: 0.08rem;
			top: 0;
		}
	}
}
.title-part-right{
	margin-left: auto;
	display: flex;
	align-items: center;
}
</style>
