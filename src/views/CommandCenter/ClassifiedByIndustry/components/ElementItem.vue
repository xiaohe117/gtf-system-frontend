<template>
	<div class="element-item">
		<div class="item-header">
			<span class="title">{{ topic.title }}</span>
		</div>
		<div class="item-body" :class="{ 'is-bottom-hidden': bottomHidden }">
			<div
				class="section-top"
				:class="{ 'is-full': bottomHidden }"
				:data-key="'top-' + topic.key"
			>
				<div class="section-title">
					<div class="title-text">{{ topic.sections.experience.title }}</div>
				</div>
				<div class="section-list">
					<RichText
						v-if="topic.sections.experience.content"
						:html="topic.sections.experience.content"
						:style="textStyleTop"
						class="item-text"
					></RichText>
					<div v-else class="item-text no-data">暂无数据</div>
				</div>
			</div>

			<div
				class="section-bottom"
				:class="{ 'is-hidden': bottomHidden }"
				:data-key="topic.key"
			>
				<div class="section-title">
					<span class="title-text">{{ topic.sections.situation.title }}</span>
				</div>
				<div class="section-list">
					<RichText
						v-if="topic.sections.situation.content"
						:html="topic.sections.situation.content"
						:style="textStyleBottom"
						class="item-text"
					></RichText>
					<div v-else class="item-text no-data">暂无数据</div>
				</div>
			</div>
		</div>
		<div class="item-footer">
			<div class="btn" @click="emit('more', topic)"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import RichText from './RichText.vue';
import type { TopicItem } from '../type';

defineProps({
	topic: {
		type: Object as () => TopicItem,
		required: true,
	},
	bottomHidden: {
		type: Boolean,
		default: false,
	},
	textStyleTop: {
		type: Object,
		default: () => ({}),
	},
	textStyleBottom: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['more']);
</script>

<style lang="less" scoped>
.element-item {
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 0.04rem 0.08rem 0.08rem;
	background-image: url('@/assets/images/industry/ele-bg.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-position: 0 0;
	transition: all 0.2s ease;
	overflow: hidden;
	// &:nth-child(2n) {
	// background-image: url('@/assets/images/industry/ele-bg-2.webp');
	// }
	&:hover {
		transform: translateY(-0.02rem);
	}

	.item-header {
		width: 100%;
		height: 0.48rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		position: relative;
		flex-shrink: 0;
		background-image: url('@/assets/images/industry/line.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: 0 bottom;
		margin-bottom: 0.08rem;
		.title {
			font-family: YouSheBiaoTiHei;
			font-size: 0.28rem;
			color: #fff;
			line-height: 35px;
			letter-spacing: 4px;
			text-shadow: 1px 1px 0px #000000;
			text-align: left;
		}
	}

	.item-body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		--section-gap: 0.08rem;
		gap: var(--section-gap);
		overflow: hidden;

		&.is-bottom-hidden {
			gap: 0;
		}

		.item-text {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			font-family: PingFangSC, 'PingFang SC';
			font-size: 13px;
			color: rgba(0, 0, 0, 0.79);
			line-height: 1.6;

			&.no-data {
				display: flex;
				align-items: center;
				justify-content: center;
				color: rgba(0, 0, 0, 0.4);
				-webkit-box-orient: unset;
			}
		}

		.section-top {
			flex: 0 1 auto;
			min-height: 0;
			max-height: 100%;
			display: flex;
			flex-direction: column;
			overflow: hidden;

			&.is-full {
				flex: 1 1 auto;

				.section-list {
					flex: 1 1 auto;
				}
			}

			.section-title {
				height: 0.42rem;
				padding: 0.12rem 0.08rem;
				background-image: url('@/assets/images/industry/ele-title-bg.webp');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: 0 0;
				flex-shrink: 0;

				.title-text {
					background-image: url('@/assets/images/industry/sub-title-bg-2.webp');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: 0 0;
					width: 0.94rem;
					height: 0.22rem;
					display: flex;
					align-items: center;
					justify-content: center;
					font-family: YouSheBiaoTiHei;
					font-size: 12px;
					color: #fff;
					text-shadow: -1px 1px 0px rgba(38, 111, 232, 0.5);
				}
			}

			.section-list {
				flex: 0 1 auto;
				min-height: 0;
				padding: 0 0.08rem 0.12rem;
				background-image: url('@/assets/images/industry/ele-content-bg.webp');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: 0 0;
				overflow: hidden;

				.item-text {
					text-align: justify;
				}
			}
		}
		.section-bottom {
			flex: 1 1 0;
			min-height: 0;
			display: flex;
			flex-direction: column;
			overflow: hidden;

			&.is-hidden {
				flex: 0 0 0;
				height: 0;
				min-height: 0;
				opacity: 0;
				pointer-events: none;
			}

			.section-title {
				padding-left: 0.08rem;
				flex-shrink: 0;

				.title-text {
					background-image: url('@/assets/images/industry/sub-title-bg.webp');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: 0 0;
					width: 0.94rem;
					height: 0.22rem;
					display: flex;
					align-items: center;
					justify-content: center;
					font-family: YouSheBiaoTiHei;
					font-size: 13px;
					color: #fff;
					line-height: 17px;
					text-shadow: -1px 1px 0px rgba(38, 111, 232, 0.5);
				}
			}
			.section-list {
				flex: 1;
				min-height: 0;
				padding: 0.08rem;
				overflow: hidden;
			}
		}
	}

	.item-footer {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: right;
		flex: 0 0 0.42rem;
		height: 0.42rem;
		.btn {
			background-image: url('@/assets/images/industry/more.webp');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: 0 0;
			width: 0.96rem;
			height: 0.26rem;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			z-index: 1;
		}
	}
}
</style>
