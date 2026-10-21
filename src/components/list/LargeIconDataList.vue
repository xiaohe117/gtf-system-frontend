<!-- 对应设计稿 1-3-2, 1-3-3, 1-3-4 -->
<template>
	<div class="large-icon-list">
		<img class="l-i-l_icon" :src="iconUrl" alt="logo" />
		<div class="l-i-l_right">
			<div
				v-for="item in dataList"
				:key="item.label"
				class="l-i-l_right_item main-color-bg"
				:class="`${item?.bgColor || 'blue'}-01`"
			>
				<div class="line main-color-bg" :class="item?.bgColor || 'blue'"></div>
				<div v-if="dataList.length === 2" class="item_content large">
					<p class="main-color-font" :class="item?.bgColor || 'blue'">
						<span class="number-font">{{ item.num }}</span>
						<span>{{ item.unit }}</span>
					</p>
					<p class="item_content_label">
						<span>{{ item.label }}</span>
						<Tooltips v-if="item.hasTips" :tipsContent="item.tipsText" />
					</p>
				</div>
				<div v-else class="item_content">
					<div class="item_content_label">
						<span>{{ item.label }}</span>
						<Tooltips v-if="item.hasTips" :tipsContent="item.tipsText" />
					</div>
					<div class="main-color-font" :class="item?.bgColor || 'blue'">
						<span class="number-font">{{ item.num }}</span>
						<span>{{ item.unit }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	// 兼容最少长度为2，最大为4
	dataList: any[];
	iconUrl: string;
}>();
</script>

<style lang="less" scoped>
.number-font {
	font-family: @number-font;
}
.main-color-font {
	&.blue {
		color: @blue;
	}
	&.yellow {
		color: @yellow;
	}
	&.orange {
		color: @orange;
	}
	&.red {
		color: @red;
	}
	&.flu-blue {
		color: @flu-blue;
	}
	&.green {
		color: @green;
	}
	&.purple {
		color: @purple;
	}
}
.main-color-bg {
	&.blue {
		background-color: @blue;
	}
	&.yellow {
		background-color: @yellow;
	}
	&.orange {
		background-color: @orange;
	}
	&.red {
		background-color: @red;
	}
	&.flu-blue {
		background-color: @flu-blue;
	}
	&.green {
		background-color: @green;
	}
	&.purple {
		background-color: @purple;
	}
	&.blue-01 {
		background-color: @blue-01;
	}
	&.yellow-01 {
		background-color: @yellow-01;
	}
	&.orange-01 {
		background-color: @orange-01;
	}
	&.red-01 {
		background-color: @red-01;
	}
	&.flu-blue-01 {
		background-color: @flu-blue-01;
	}
	&.green-01 {
		background-color: @green-01;
	}
	&.purple-01 {
		background-color: @purple-01;
	}
}

.large-icon-list {
	display: flex;
	gap: 0.08rem;
}
.l-i-l_icon {
	width: 1.92rem;
	height: 2.2rem;
}
.l-i-l_right {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
}
.l-i-l_right_item {
	flex: 1;
	display: flex;
	font-size: 0.16rem;

	.number-font {
		font-size: 0.28rem;
		margin-right: 0.06rem;
	}
}
.line {
	width: 0.02rem;
	height: 100%;
}
.item_content {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 0.16rem;

	&.large {
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
}
.item_content_label {
	display: flex;
	align-items: center;
}
.tips-trigger {
	margin-left: 0.08rem;
	width: 0.17rem;
	height: 0.16rem;
	background-image: url('@/assets/images/uiComponents/normal_tips_icon.png');
	background-size: 100% 100%;
	cursor: pointer;
}
</style>
