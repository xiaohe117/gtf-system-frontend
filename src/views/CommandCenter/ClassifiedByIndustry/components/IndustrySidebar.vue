<template>
	<div class="industry-sidebar">
		<div v-for="group in groups" :key="group.title" class="group">
			<div class="group-title">
				<span class="text">{{ group.title }}</span>
				<img src="@/assets/images/industry/title-bg.webp" class="title-bg" alt="" />
			</div>
			<ul class="group-list">
				<li
					v-for="item in group.items"
					:key="item.key"
					class="group-item"
					:class="{ active: item.key === activeKey, disabled: item.disabled }"
					@click="onItemClick(item)"
				>
					<span class="item-label">{{ item.label }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { IndustryGroup, IndustryItem } from '../type';

defineProps({
	groups: {
		type: Array as () => IndustryGroup[],
		required: true,
	},
	activeKey: {
		type: String,
		required: true,
	},
});

const emit = defineEmits<{
	select: [key: string];
}>();

const onItemClick = (item: IndustryItem) => {
	if (!item.disabled) {
		emit('select', item.key);
	}
};
</script>

<style lang="less" scoped>
.industry-sidebar {
	width: 2.6rem;
	min-width: 2.6rem;
	height: 100%;
	border-radius: 0.08rem;
	padding: 0 0.2rem 0.16rem 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 0.16rem;
	overflow-y: auto;

	.group {
		display: flex;
		flex-direction: column;
		gap: 0.16rem;

		.group-title {
			position: relative;
			display: flex;
			align-items: center;
			gap: 0.08rem;
			padding: 0 0.08rem 0 0.38rem;
			height: 0.42rem;
			margin-top: -0.08rem;
			.title-bg {
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 100%;
				height: 0.22rem;
				z-index: 0;
			}
			.text {
				position: relative;
				z-index: 1;
				font-family: MicrosoftYaHei;
				font-weight: bold;
				font-size: 0.2rem;
				color: #3a73de;
				line-height: 0.26rem;
				text-shadow: 0.01rem 0.01rem 0.02rem rgba(0, 34, 161, 0.5);
				letter-spacing: 0.01rem;
			}
		}

		.group-list {
			display: flex;
			flex-direction: column;
			gap: 0.08rem;

			.group-item {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 0.38rem;
				padding: 0 0.14rem;
				background: #d9ebff;
				border-radius: 0.04rem;
				cursor: pointer;
				transition: all 0.2s ease;
				box-sizing: border-box;

				.item-label {
					font-family: MicrosoftYaHei;
					font-size: 0.16rem;
					color: rgba(0, 0, 0, 0.6);
				}

				&.disabled {
					background: rgba(236, 239, 243);
					cursor: not-allowed;

					.item-label {
						color: #b2b2b2;
					}
				}

				&.active {
					background-color: unset;
					background-image: url('@/assets/images/industry/side-bg.webp');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: center;
					width: calc(100% + 0.2rem);

					.item-label {
						font-family: MicrosoftYaHei;
						font-weight: 600;
						font-size: 0.16rem;
						color: #fff;
					}
				}
			}
		}
	}
}
</style>
