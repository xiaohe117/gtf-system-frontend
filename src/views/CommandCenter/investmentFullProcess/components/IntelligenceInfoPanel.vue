<template>
	<div class="intelligence-info-panel" :class="{ compact }">
		<div class="info-tabs">
			<span
				class="info-tabs-item"
				:class="{ active: activeInfoTab === 'meeting' }"
				@click="handleTabClick('meeting')"
			>
				高层会见
			</span>
			<span
				class="info-tabs-item"
				:class="{ active: activeInfoTab === 'news' }"
				@click="handleTabClick('news')"
			>
				{{ newsTabLabel }}
			</span>
		</div>

		<div
			class="info-list"
			:class="{ 'meeting-info-list': activeInfoTab === 'meeting' }"
			v-loading="loading && activeInfoTab === 'news'"
			element-loading-background="rgba(255, 255, 255, 0.72)"
			element-loading-text="加载中..."
		>
			<template v-if="activeInfoTab === 'meeting'">
				<div class="meeting-group">
					<div class="info-source-label">广东省</div>
					<div class="meeting-list">
						<CardEmptyState
							v-if="!loading && guangdongMeetingList.length === 0"
							compact
						/>
						<div
							v-for="(item, index) in guangdongMeetingList"
							:key="item.id || `guangdong-${item.title}-${index}`"
							class="info-item"
							:class="{ clickable: !!item.link }"
							@click="openInfoLink(item, 'meeting')"
						>
							<EllipsisTooltip
								:content="item.tag"
								:disabled="item.tag.length <= 4"
								inline
							>
								<span class="info-tag">{{ truncateTag(item.tag) }}</span>
							</EllipsisTooltip>
							<EllipsisTooltip :content="item.title" flex>
								<p class="title-text">{{ item.title }}</p>
							</EllipsisTooltip>
							<time class="date-text">{{ item.date }}</time>
						</div>
					</div>
				</div>

				<div class="meeting-group">
					<div class="info-source-label secondary">其他省市</div>
					<div class="meeting-list">
						<CardEmptyState
							v-if="!loading && otherProvinceMeetingList.length === 0"
							compact
						/>
						<div
							v-for="(item, index) in otherProvinceMeetingList"
							:key="item.id || `other-${item.title}-${index}`"
							class="info-item"
							:class="{ clickable: !!item.link }"
							@click="openInfoLink(item, 'meeting')"
						>
							<EllipsisTooltip
								:content="item.tag"
								:disabled="item.tag.length <= 4"
								inline
							>
								<span class="info-tag">{{ truncateTag(item.tag) }}</span>
							</EllipsisTooltip>
							<EllipsisTooltip :content="item.title" flex>
								<p class="title-text">{{ item.title }}</p>
							</EllipsisTooltip>
							<time class="date-text">{{ item.date }}</time>
						</div>
					</div>
				</div>
			</template>

			<template v-else>
				<CardEmptyState v-if="!loading && infoList.length === 0" compact />
				<div
					v-for="(item, index) in infoList"
					:key="item.id || `${item.title}-${index}`"
					class="info-item"
					:class="{ clickable: !!item.url }"
					@click="openInfoLink(item, 'news')"
				>
					<EllipsisTooltip
						:content="item.tag"
						:disabled="item.tag.length <= 4"
						inline
					>
						<span class="info-tag">{{ truncateTag(item.tag) }}</span>
					</EllipsisTooltip>
					<EllipsisTooltip :content="item.title" flex>
						<p class="title-text">{{ item.title }}</p>
					</EllipsisTooltip>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { InfoItem, InfoTabKey } from '../intelligenceInfo';
import { openInfoLink, truncateTag } from '../intelligenceInfo';
import CardEmptyState from './CardEmptyState.vue';
import EllipsisTooltip from './EllipsisTooltip.vue';

const props = withDefaults(
	defineProps<{
		activeInfoTab: InfoTabKey;
		guangdongMeetingList: InfoItem[];
		otherProvinceMeetingList: InfoItem[];
		infoList: InfoItem[];
		loading?: boolean;
		compact?: boolean;
		newsTabLabel?: string;
	}>(),
	{
		loading: false,
		compact: false,
		newsTabLabel: '企业资讯',
	},
);

const emit = defineEmits<{
	'update:activeInfoTab': [value: InfoTabKey];
	tabChange: [value: InfoTabKey];
}>();

const handleTabClick = (tabKey: InfoTabKey) => {
	if (props.activeInfoTab === tabKey) return;
	emit('update:activeInfoTab', tabKey);
	emit('tabChange', tabKey);
};
</script>

<style lang="less" scoped>
.intelligence-info-panel {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
	min-height: 0;
	overflow: hidden;
}

.info-tabs {
	display: flex;
	align-items: center;
	gap: 0.12rem;
	flex-shrink: 0;
	margin: 0.02rem 0;
}

.info-tabs-item {
	display: flex;
	align-items: center;
	justify-content: center;
	width: clamp(1.08rem, 7vw, 1.28rem);
	height: clamp(0.26rem, 3.2vh, 0.3rem);
	background-image: url('@/views/newOverallSituation/image/pill-gray-mask.png');
	background-size: 100% 100%;
	background-position: center;
	font-weight: 600;
	font-size: 0.16rem;
	color: rgba(0, 0, 0, 0.65);
	cursor: pointer;

	&.active {
		color: #fff;
		background-image: url('@/views/newOverallSituation/image/pill-blue-mask.png');
	}
}

.info-list {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 0.04rem;
	flex: 1 1 0;
	height: 0;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;

	&.meeting-info-list {
		overflow: hidden;
		min-height: 1.2rem;
	}
}

.meeting-group {
	display: grid;
	grid-template-columns: 0.3rem minmax(0, 1fr);
	align-items: stretch;
	flex: 1 1 0;
	min-width: 0;
	min-height: 0;
}

.info-source-label {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 0.3rem;
	min-height: 100%;
	border-radius: 0.07rem 0 0 0.07rem;
	background: #1598ff;
	color: #fff;
	font-size: clamp(0.13rem, 1.55vh, 0.16rem);
	font-weight: 700;
	line-height: 1.05;
	text-align: center;
	writing-mode: vertical-rl;
	text-orientation: upright;
	white-space: nowrap;

	&.secondary {
		background: #9fc4fb;
	}
}

.meeting-list {
	display: flex;
	flex-direction: column;
	gap: 0.06rem;
	min-width: 0;
	min-height: 0;
	padding: 0.02rem 0;
	border: 0.01rem solid #168dff;
	border-left: 0;
	border-radius: 0 0.08rem 0.08rem 0;
	overflow-y: auto;
	overflow-x: hidden;
}

.info-item {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	padding: 0.02rem 0.08rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 1rem 0.18rem 0.18rem 1rem;

	&.clickable {
		cursor: pointer;
	}
}

.info-tag {
	display: flex;
	justify-content: center;
	width: 0.76rem;
	height: 0.24rem;
	font-size: 0.12rem;
	color: #266fe8;
	padding-top: 0.02rem;
	border: 0.01rem solid #1982ff;
	border-radius: 0.12rem;
	flex-shrink: 0;
}

.title-text {
	flex: 1 1 auto;
	min-width: 0;
	font-size: 0.14rem;
	color: #4b4b4b;
	padding: 0 0.1rem 0 0.08rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin: 0;
}

.date-text {
	flex: 0 0 0.92rem;
	margin-left: auto;
	font-size: 0.14rem;
	color: #5e5e5e;
	text-align: right;
	white-space: nowrap;
}

.intelligence-info-panel.compact {
	.info-tabs {
		gap: 0.08rem;
		margin: 0;
	}

	.info-tabs-item {
		width: 0.88rem;
		height: 0.24rem;
		font-size: 0.12rem;
	}

	.info-list {
		gap: 0.02rem;
	}

	.meeting-group {
		grid-template-columns: 0.24rem minmax(0, 1fr);
	}

	.info-source-label {
		width: 0.24rem;
		font-size: 0.12rem;
		border-radius: 0.05rem 0 0 0.05rem;
	}

	.meeting-list {
		gap: 0.04rem;
		border-radius: 0 0.06rem 0.06rem 0;
		min-height: 0.48rem;
	}

	.info-item {
		padding: 0.01rem 0.06rem;
	}

	.info-tag {
		width: 0.64rem;
		height: 0.2rem;
		font-size: 0.11rem;
		padding-top: 0.01rem;
	}

	.title-text {
		font-size: 0.12rem;
		padding: 0 0.06rem 0 0.04rem;
	}

	.date-text {
		flex-basis: 0.76rem;
		font-size: 0.12rem;
	}
}
</style>
