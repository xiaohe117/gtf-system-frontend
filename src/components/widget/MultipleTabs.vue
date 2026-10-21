<!-- tab控件2 对应设计稿 2-5 -->
<template>
	<div class="tabs-wrapper flex-x-between">
		<div class="tab-items flex-y-between-start">
			<div
				v-for="item in props.tabList"
				:key="item.value"
				class="tab-item"
				:class="{ active: activeIndex[0] === item.value }"
				@click="clickTab(item.value, 0)"
			>
				{{ item.label }}
			</div>
		</div>
		<div class="right-part flex-y-between-start">
			<div class="top-tab-box flex-x-start">
				<div
					v-for="(items, index) in props.topTabList"
					:key="index"
					class="top-tab-items flex-x-start"
				>
					<span
						:class="['indicator' + (items.length > 1 ? '' : '-small'), 'flex-x-center']"
					>
						{{ items.length > 1 ? items.length : '' }}
					</span>
					<div class="flex-x-start">
						<div
							class="top-tab-item"
							v-for="item in items"
							:key="item.value"
							:class="{ active: activeIndex[1] === item.value }"
							@click="clickTab(item.value, 1)"
						>
							{{ item.label }}
						</div>
					</div>
				</div>
			</div>
			<div class="show-area">
				<slot name="showArea"></slot>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	tabList: { label: string; value: string }[];
	topTabList?: { label: string; value: string }[][];
}>();

const activeIndex = ref(['1', '1']);
const emits = defineEmits(['changeTab']);
const clickTab = (value: string, index: number) => {
	activeIndex.value[index] = value;
	emits('changeTab', activeIndex.value);
};
</script>

<style lang="less" scoped>
.tabs-wrapper {
	gap: 0.24rem;
}

@tab-height: 8.03rem;
.tab-items {
	height: @tab-height;
	.tab-item {
		width: 2.02rem;
		height: 0.6rem;
		font-weight: 500;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.6rem;
		padding-left: 0.16rem;
		position: relative;
		font-weight: 500;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.65);
		background: url('@/assets/images/gtf/tab-bg.png') center / 100% 100% no-repeat;
		cursor: pointer;
		&.active {
			color: #ffffff;
			background: url('@/assets/images/gtf/tab-bg-active.png') center / 100% 100% no-repeat;

			&::after {
				background: linear-gradient(
					90deg,
					rgba(255, 255, 255, 0.5) 0%,
					rgba(255, 255, 255, 0) 100%
				);
			}
		}

		&::after {
			position: absolute;
			content: '';
			width: 1.61rem;
			height: 0.12rem;
			top: 0.36rem;
			left: 0.2rem;
			transform: skewX(-45deg);
			background: linear-gradient(
				90deg,
				rgba(52, 137, 255, 0.2) 0%,
				rgba(52, 137, 255, 0) 100%
			);
		}
	}
}

.top-tab-box {
	gap: 0.17rem;
	.top-tab-items {
		min-width: 1.17rem;
		height: 0.36rem;
		background: rgba(255, 255, 255, 0.2);
		box-shadow: 0rem 0.03rem 0.05rem 0rem rgba(162, 169, 213, 0.66);
		border-radius: 0.12rem 0.04rem 0.12rem 0.04rem;
		border: 0.01rem solid #ffffff;
		backdrop-filter: blur(4px);

		.indicator {
			font-family: PangMenZhengDao;
			font-size: 0.24rem;
			color: #ffffff;
			width: 0.4rem;
			height: 0.34rem;
			background: url('@/assets/images/gtf/tab-num-indicator.png') center / 100% 100%
				no-repeat;
		}

		.indicator-small {
			width: 0.2rem;
			height: 0.34rem;
			background: url('@/assets/images/gtf/tab-indicator.png') center / 100% 100% no-repeat;
		}

		.top-tab-item {
			font-weight: 400;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.65);
			line-height: 0.22rem;
			padding: 0.07rem 0.16rem;
			position: relative;
			cursor: pointer;

			&:not(:last-child)::after {
				position: absolute;
				content: '';
				width: 0.01rem;
				height: 0.16rem;
				background: #a7c7ff;
				opacity: 0.9;
				backdrop-filter: blur(10px);
				top: 0.09rem;
				right: 0;
			}

			&.active {
				background: linear-gradient(0deg, #1a73e8, #0c6ce9, #00bcd4); /* 自定义渐变颜色 */
				-webkit-background-clip: text; /* 关键属性 */
				background-clip: text;
				-webkit-text-fill-color: transparent; /* 关键属性 */
				color: transparent;
				position: relative;
				&::before {
					position: absolute;
					top: 0.32rem;
					left: 0.16rem;
					content: '';
					width: calc(100% - 0.32rem);
					height: 0.04rem;
					background: #3489ff;
				}
			}
		}
	}
}
.right-part {
	width: 9.76rem;
	height: @tab-height;
	background: linear-gradient(90deg, rgba(26, 77, 241, 0.05) 0%, rgba(93, 201, 252, 0.05) 100%);
	border-radius: 0.08rem;
	padding: 0.16rem;
	gap: 0.16rem;

	.show-area {
		width: 100%;
		flex: 1;
	}
}
</style>
